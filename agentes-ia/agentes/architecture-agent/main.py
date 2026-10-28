import argparse
import subprocess
import sys
from pathlib import Path

from dotenv import load_dotenv

from architecture_runner import ArchitectureRun
from gemini_client import SYSTEM_PROMPT, InferenceError, analyze


def collect_files_interactively():
    print("Architecture Agent\n")
    print("No se proporcionaron archivos mediante --files.\n")
    print("Ingrese los archivos Markdown que conforman el contexto.")
    print("Ingrese una ruta por línea.")
    print("Presione Enter sin escribir una ruta para finalizar.\n")
    files = []
    seen = set()
    while True:
        try:
            filename = input(f"Archivo {len(files) + 1}: ").strip()
        except EOFError:
            break
        if not filename:
            break
        path = Path(filename)
        if not path.is_file():
            print(f"Archivo no encontrado: {filename}")
            continue
        if path.suffix.lower() != ".md":
            print(f"Se esperaba un archivo Markdown: {filename}")
            continue
        resolved = path.resolve()
        if resolved not in seen:
            files.append(filename)
            seen.add(resolved)
    return files


def main():
    load_dotenv()
    parser = argparse.ArgumentParser(description="Propone decisiones de arquitectura desde documentos Markdown.")
    parser.add_argument("--cli", action="store_true", help="Usar interfaz de línea de comandos")
    parser.add_argument("--files", nargs="+", help="Archivos Markdown de contexto")
    parser.add_argument("--deployment", help="Plataforma o entorno de despliegue; vacío significa no definido")
    parser.add_argument("--output-dir", default="outputs", help="Directorio de salida (default: outputs)")
    args = parser.parse_args()
    if not args.cli:
        if args.files is not None or args.output_dir != "outputs" or args.deployment is not None:
            parser.error("--files, --deployment y --output-dir requieren --cli")
        subprocess.run([sys.executable, "-m", "streamlit", "run", str(Path(__file__).resolve().with_name("streamlit_app.py"))], check=True)
        return
    files = args.files if args.files is not None else collect_files_interactively()
    if not files:
        parser.exit(1, "No se proporcionaron archivos de contexto.\nEl Architecture Agent necesita al menos un archivo Markdown.\n")
    workflow = ArchitectureRun(files, args.output_dir, infer=analyze)
    try:
        workflow.prepare()
        if args.deployment is None:
            try:
                deployment = input("Plataforma o entorno de despliegue (vacío = no definido; el agente evaluará alternativas):\n> ")
            except EOFError:
                deployment = ""
        else:
            deployment = args.deployment
        workflow.set_preflight(deployment)
        count = workflow.run["lossless_context_tokens"]
        token_text = f"{count} tokens" if count is not None else f"~{workflow.run['estimated_lossless_tokens']} tokens (estimación local)"
        print(f"Fuentes: {len(workflow.sources)}\nContexto lossless: {workflow.run['lossless_context_size']} bytes\nTokens del contexto: {token_text}")
        if workflow.run["context_token_warning"]:
            print("El contexto arquitectónico compilado supera el presupuesto recomendado.")
        result = workflow.start()
        if result["status"] == "NEEDS_INFORMATION":
            print("Architecture Agent necesita información adicional antes de cerrar la propuesta.")
            answers = []
            for index, item in enumerate(result["missing_information"], 1):
                print(f"\nPregunta {index}:\n{item['question']}")
                print(f"Por qué importa:\n{item['reason']}")
                print(f"Impacto en la decisión:\n{item['decision_impact']}")
                answers.append(input("Respuesta:\n> "))
            result = workflow.continue_with(answers)
    except InferenceError as exc:
        run = workflow.run
        lines = ["Architecture Agent no pudo completar la inferencia.", "", f"Tipo: {exc.error_type}", "Proveedor: Gemini"]
        if exc.http_status is not None:
            lines.append(f"HTTP: {exc.http_status}")
        elif exc.error_type == "CLIENT_TIMEOUT":
            lines.extend(["HTTP: no recibido", "Timeout configurado: 120 s"])
        lines.append(f"Modelo: {run['model']}")
        if run["duration_seconds"] is not None:
            lines.append(f"Duración: {run['duration_seconds']} s")
        if exc.retry_after is not None:
            lines.append(f"Retry-After: {exc.retry_after}")
        lines += ["", str(exc)]
        if exc.detail:
            lines += ["", f"Detalle del proveedor: {exc.detail}"]
        if run["questions_asked"]:
            lines += ["", "Resultado: La primera respuesta solicitó aclaraciones; la segunda inferencia falló. No se evaluaron Architecture Drivers."]
        else:
            lines += ["", "Resultado: No hubo salida del modelo; no se generaron preguntas ni se evaluaron Architecture Drivers."]
        if exc.error_type == "RATE_LIMITED":
            lines.append("Revise el detalle del proveedor y Retry-After, si está presente, antes de volver a ejecutar.")
        parser.exit(1, "\n".join(lines) + "\n")
    except (ValueError, OSError) as exc:
        if workflow.run["error_type"] == "OUTPUT_VALIDATION_ERROR":
            parser.exit(1, f"Architecture Agent rechazó la salida del modelo.\nTipo: OUTPUT_VALIDATION_ERROR\nDetalle: {exc}\n")
        parser.exit(1, f"Error: {exc}\n")
    if result["status"] == "READY":
        recommendation = result["recommendation"]
        print("Architecture Agent completó el análisis.\n\nEstado: READY")
        print(f"\nRecomendación del Architecture Agent:\n{recommendation['architecture']}")
        print("\nJustificación:")
        for item in recommendation["justification"]:
            print(f"- {item}")
        print("\nTrade-offs aceptados:")
        for item in recommendation["accepted_tradeoffs"]:
            print(f"- {item}")
        print(f"\nEstado del ADR:\n{result['adr']['status']} — pendiente aprobación humana.")
        output = workflow.output
        print(f"\nArchivos generados:\n{output / 'architecture-analysis.json'}\n{output / 'architecture-analysis.md'}\n{output / 'architecture-analysis.run.json'}")
    elif workflow.run["clarification_rounds"]:
        print("No existe información suficiente para emitir una recomendación arquitectónica final.\n\nPreguntas pendientes:")
        for index, item in enumerate(result["missing_information"], 1):
            print(f"Pregunta {index}: {item['question']}\nPor qué importa: {item['reason']}\nImpacto en la decisión: {item['decision_impact']}")
        print(f"\nArchivo:\n{workflow.output / 'architecture-analysis.json'}")
    print(f"\nInferencias realizadas: {len(workflow.run['calls'])}")
    for call in workflow.run["calls"]:
        print(f"Input tokens llamada {call['round']}: {call.get('input_tokens', 'No disponible')}")
    usage = workflow.run["usage"] or {}
    print(f"Input tokens totales: {usage.get('input_tokens', 'No disponible')}")


if __name__ == "__main__":
    main()
