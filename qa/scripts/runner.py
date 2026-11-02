#!/usr/bin/env python3
"""Runner secuencial del pipeline de Pharma Express.

Ejecuta el siguiente paso que indique orquestador.py, o recorre la secuencia
hasta la próxima puerta humana. No aprueba nada por su cuenta: las puertas de
MVP, oráculos, SPEC y entrega siempre se detienen.

Backends:
  - api       : usa agentes-ia/herramientas.py con un LLM por API key (Gemini, Mistral,
                Groq u OpenRouter) y los mismos .claude/agents/*.md, sin CLI externo.
  - claude    : usa `claude -p` y los subagentes de .claude/agents/.
  - opencode  : usa `opencode run --agent general` y le pasa el archivo del
                subagente como instrucción (respaldo cuando no hay Claude Code).
  - python    : usa agentes-ia/agente.py para Especificaciones y Arquitectura.

Uso:
    python3 qa/scripts/runner.py --estado
    python3 qa/scripts/runner.py --dry-run
    python3 qa/scripts/runner.py --todo
    python3 qa/scripts/runner.py --paso S1 --modulo identidad
    python3 qa/scripts/runner.py --todo --backend opencode

Candados mecánicos (desde 2026-10-31):
  - Antes de B1/B2/B3/B4: `guardian.py foto`. Después: `guardian.py verificar`.
    Si un agente tocó pruebas/qa o dejó trampas en el código, el runner se
    detiene, suma una iteración y escala a una persona.
  - El modelo de cada subagente sale de `.env` (MODELO_S1, MODELO_B1, …).
    Con OpenCode, los pasos B no corren sin modelo configurado.
  - Una salida con «usage limit», «rate limit» o «Error:» cuenta como fallo,
    aunque el CLI devuelva código 0.
  - El estado se lee con orquestador.reconciliar(): los archivos mandan.

Código de salida: 0 si terminó o se detuvo en una puerta humana; 1 si falló.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
ORQUESTADOR = RAIZ / "orquestador.py"
PIPELINE = RAIZ / "pipeline.json"
MARCAR = RAIZ / "qa" / "scripts" / "marcar.py"
LOG_DIR = RAIZ / "qa" / "ejecuciones"
AGENTES_DIR = RAIZ / ".claude" / "agents"
GUARDIAN = RAIZ / "qa" / "scripts" / "guardian.py"
PASOS_B = {"B1", "B2", "B3", "B4"}
VARIABLE_MODELO = {
    "S1": "MODELO_S1", "S2": "MODELO_S2", "S3": "MODELO_S3", "B1": "MODELO_B1",
    "B2": "MODELO_B2", "B3": "MODELO_B3", "B4": "MODELO_B4", "R1": "MODELO_R1", "R2": "MODELO_R2",
}
SENALES_FALLO = re.compile(r"(usage limit|rate limit|quota|\bError:|insufficient credits)", re.I)

# paso del orquestador -> (agente de Claude/OpenCode, archivo, tipo)
AGENTES = {
    "S1": ("qa-s1-revisor-spec", "qa-s1-revisor-spec.md", "subagente"),
    "S2": ("qa-s2-disenador-casos", "qa-s2-disenador-casos.md", "subagente"),
    "S3": ("qa-s3-generador-pruebas", "qa-s3-generador-pruebas.md", "subagente"),
    "B1/B4": ("backend-servicios-api", "backend-servicios-api.md", "subagente"),
    "R1": ("qa-r1-humo", "qa-r1-humo.md", "subagente"),
}

PUERTAS = {"mvp", "registrar-modulos", "spec", "escalado", "escalar", "entrega"}


def cargar_orquestador():
    spec = importlib.util.spec_from_file_location("orquestador", ORQUESTADOR)
    if spec is None or spec.loader is None:
        raise RuntimeError("No se pudo cargar orquestador.py")
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo


def leer_pipeline() -> dict:
    try:
        return json.loads(PIPELINE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        sys.exit(f"No se pudo leer pipeline.json: {exc}")


def pipeline_efectivo() -> dict:
    efectivo, avisos = cargar_orquestador().reconciliar(leer_pipeline(), RAIZ)
    for aviso in avisos:
        print(f"  ! {aviso}")
    return efectivo


def siguiente() -> dict:
    return cargar_orquestador().siguiente(pipeline_efectivo())[0]


def leer_env() -> dict:
    """Variables de .env en la raíz (sin depender de python-dotenv)."""
    datos = {}
    ruta = RAIZ / ".env"
    if ruta.is_file():
        for linea in ruta.read_text(encoding="utf-8").splitlines():
            linea = linea.strip()
            if linea and not linea.startswith("#") and "=" in linea:
                clave, valor = linea.split("=", 1)
                datos[clave.strip()] = valor.strip().strip('"').strip("'")
    return datos


def modelo_para(paso: str) -> str | None:
    variable = VARIABLE_MODELO.get(paso)
    if not variable:
        return None
    return os.environ.get(variable) or leer_env().get(variable) or None


def guardian(*args: str) -> int:
    return subprocess.run([sys.executable, str(GUARDIAN), *args], cwd=RAIZ).returncode


def detectar_backend(preferido: str) -> str | None:
    if preferido != "auto":
        return preferido
    if shutil.which("claude"):
        return "claude"
    if shutil.which("opencode"):
        return "opencode"
    return None


def preflight(backend: str | None) -> list[str]:
    problemas = []
    if backend is None:
        problemas.append("No hay `claude` ni `opencode` en el PATH.")
    if backend in ("python", "api"):
        for modulo in ("openai", "dotenv"):
            if importlib.util.find_spec(modulo) is None:
                problemas.append(f"Falta el paquete Python `{modulo}` (pip install -r agentes-ia/requirements.txt).")
        if not (RAIZ / "agentes-ia" / ".env").is_file() and not os.environ.get("GEMINI_API_KEY"):
            problemas.append("Falta agentes-ia/.env o GEMINI_API_KEY.")
    return problemas


def prompt_para(paso: str, modulo: str, archivo: str, extra: str = "") -> str:
    contexto = (
        f"Trabaja en el repositorio {RAIZ}. Módulo: {modulo}. "
        f"Sigue al pie de la letra el archivo {archivo}. "
        "Lee primero docs/mvp.md y tu archivo de agente. "
        "No pidas confirmación interactiva: ejecuta hasta terminar o hasta una puerta humana. "
        "No inventes datos de salud: usa solo datos sintéticos. "
        "Cuando termines, escribe tus salidas en las rutas que indica el agente."
    )
    tareas = {
        "S1": "Revisa la SPEC del módulo y deja el informe en qa/revision/ con veredicto APTA, APTA_CON_RESERVAS o NO_APTA.",
        "S2": "Diseña los casos TC-* y actualiza qa/trazabilidad.md y qa/oraculos-pendientes.md.",
        "S3": "Genera las pruebas ejecutables de los TC aprobados y déjalas rojas por 'no implementado'.",
        "B1/B4": "Implementa el módulo y ejecuta la suite hasta dejarla verde, sin tocar pruebas.",
        "R1": "Ejecuta el humo del módulo contra el entorno de prueba y deja el informe en qa/humo/.",
    }
    tareas["B1"] = tareas["B1/B4"]
    tareas["B2"] = ("Implementa el bot de Telegram del módulo con grammY dentro del backend, usando solo la api/ "
                    "de los módulos y plantillas fijas, hasta dejar verdes sus pruebas, sin tocar pruebas.")
    tareas["B3"] = ("Implementa las pantallas web del módulo en apps/web (React + Vite + Tailwind + shadcn/ui) "
                    "con el cliente tipado de la API, sin tocar pruebas.")
    tareas["B4"] = ("Ejecuta las pruebas del módulo, clasifica cada fallo y corrige solo código de producción "
                    "hasta dejarlas verdes, sin tocar pruebas.")
    carpeta = leer_pipeline().get("modulos", {}).get(modulo, {}).get("carpeta")
    if carpeta:
        contexto += (f" El código y las pruebas de este módulo están en apps/api/src/modulos/{carpeta}/: "
                     "trabaja ahí y no crees otra carpeta para el módulo.")
    texto = f"{contexto}\n\nTAREA: {tareas.get(paso, 'Ejecuta tu tarea.')}"
    return f"{texto}\n\n{extra}" if extra else texto


def comando(backend: str, paso: str, modulo: str, extra: str = "") -> list[str]:
    especiales = {
        "B1": ("backend-servicios-api", "backend-servicios-api.md"),
        "B2": ("backend-bot-telegram", "backend-bot-telegram.md"),
        "B3": ("frontend-interfaz-web", "frontend-interfaz-web.md"),
        "B4": ("ejecutor-corrector", "ejecutor-corrector.md"),
    }
    if paso in especiales:
        agente, archivo = especiales[paso]
    else:
        agente, archivo = AGENTES[paso][0], AGENTES[paso][1]

    prompt = prompt_para(paso, modulo, f".claude/agents/{archivo}", extra)
    modelo = modelo_para(paso)
    if backend == "claude":
        extra = ["--model", modelo] if modelo else []
        return ["claude", "-p", *extra, f"Usa el subagente {agente}. {prompt}"]
    if backend == "opencode":
        extra = ["--model", modelo] if modelo else []
        return ["opencode", "run", "--agent", "general", *extra, "--auto", "--format", "default", prompt]
    raise ValueError(f"Backend no soportado para ejecutar: {backend}")


def ejecutar_api(paso: str, modulo: str, log, extra: str = "") -> int:
    """Backend `api`: el agente del repositorio corre con un LLM por API key (agentes-ia/herramientas.py)."""
    spec = importlib.util.spec_from_file_location("herramientas", RAIZ / "agentes-ia" / "herramientas.py")
    herramientas = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(herramientas)
    archivo = f"agentes-ia/agentes/{herramientas.POLITICAS[paso]['agente']}/prompt.md"

    def salida(texto: str) -> None:
        print(texto)
        log.write(texto + "\n")

    return herramientas.ejecutar_paso(paso, modulo, prompt_para(paso, modulo, archivo, extra), modelo_para(paso), salida)


def carpeta_modulo(modulo: str) -> str:
    """Carpeta en apps/api/src/modulos/ (campo `carpeta` de pipeline.json; por defecto, el nombre del módulo)."""
    return leer_pipeline().get("modulos", {}).get(modulo, {}).get("carpeta") or modulo


def correr_pruebas(modulo: str) -> tuple[str, str]:
    """Pruebas de unidad del módulo, ejecutadas por el runner (no por el modelo).

    Devuelve ("verde" | "rojo" | "sin_pruebas", salida). Verde exige código 0 de Jest.
    """
    carpeta = carpeta_modulo(modulo)
    # Rutas explícitas: con `projects`, Jest ignora el patrón posicional y correría todas las suites.
    pruebas = sorted(
        p.relative_to(RAIZ / "apps" / "api").as_posix()
        for p in (RAIZ / "apps" / "api" / "src" / "modulos" / carpeta / "pruebas").glob("*.spec.ts")
        if not p.name.startswith(("integracion.", "concurrencia."))
    )
    if not pruebas:
        return "sin_pruebas", f"No hay pruebas de unidad en apps/api/src/modulos/{carpeta}/pruebas/: S3 debe crearlas primero."
    npx = "npx.cmd" if os.name == "nt" else "npx"
    cmd = [npx, "jest", "--selectProjects", "unidad", "--runTestsByPath", *pruebas]
    try:
        proc = subprocess.run(cmd, cwd=RAIZ / "apps" / "api", capture_output=True, text=True,
                              encoding="utf-8", errors="replace", timeout=900)
    except FileNotFoundError:
        return "rojo", "No se encontró npx: instala Node.js y ejecuta npm install en apps/api."
    except subprocess.TimeoutExpired:
        return "rojo", "Las pruebas superaron 900 s."
    return ("verde" if proc.returncode == 0 else "rojo"), (proc.stdout + proc.stderr)[-8000:]


def ciclo_construccion(backend: str, paso: str, modulo: str, timeout: int, log) -> str:
    """El constructor del módulo (B1, B2 o B3) implementa; el runner corre las pruebas; si fallan,
    B4 corrige con la salida real.

    Repite hasta verde o hasta completar 3 iteraciones en el módulo (contando las anteriores), y
    entonces escala a una persona. Sin pruebas de unidad no gasta iteraciones: pide S3, salvo la web
    (B3), cuyas pruebas son de Playwright: construye una vez y queda para revisión manual.
    Devuelve "verde", "escalado", "sin_pruebas", "revision" o un error "Bx=código".
    """
    constructor = paso.split("/")[0]
    if constructor != "B3" and correr_pruebas(modulo)[0] == "sin_pruebas":
        print(f"[ciclo] {modulo}: no hay pruebas de unidad; S3 debe generarlas antes de construir.")
        return "sin_pruebas"
    previas = leer_pipeline().get("iteraciones", {}).get(modulo, 0)
    extra = ""
    for numero in range(previas + 1, 4):
        sub = constructor if numero == previas + 1 else "B4"
        print(f"\n[ciclo] {modulo}: iteración {numero} de 3 con {sub}")
        log.write(f"\n[ciclo] {modulo}: iteración {numero} de 3 con {sub}\n")
        guardian("foto")
        codigo = ejecutar_backend(backend, sub, modulo, timeout, log, extra)
        if guardian("verificar") != 0:
            marcar("iteracion", modulo)
            marcar("escalar", modulo, f"guardián: {sub} violó reglas duras (ver qa/ejecuciones/guardian-*.md)")
            return "escalado"
        if codigo != 0:
            return f"{sub}={codigo}"
        estado, salida = correr_pruebas(modulo)
        log.write(f"\n[pruebas {modulo}] {estado}\n{salida}\n")
        if estado == "sin_pruebas":
            print(f"[ciclo] {modulo}: {sub} terminó; no hay pruebas de unidad, queda para revisión manual.")
            return "revision"
        if estado == "verde":
            print(f"[ciclo] {modulo}: pruebas en verde.")
            marcar("modulo", modulo, "--implementacion", "verde")
            return "verde"
        print(f"[ciclo] {modulo}: pruebas en rojo tras la iteración {numero}.")
        marcar("iteracion", modulo)
        extra = ("RESULTADO DE LAS PRUEBAS (ejecutadas por el runner; corrige el código de producción, "
                 f"no las pruebas):\n{salida[-6000:]}")
    marcar("escalar", modulo, f"3 iteraciones de {paso} sin dejar las pruebas en verde")
    return "escalado"


def ejecutar_backend(backend: str, paso: str, modulo: str, timeout: int, log, extra: str = "") -> int:
    if backend == "api":
        return ejecutar_api(paso, modulo, log, extra)
    if backend == "opencode" and paso in PASOS_B and not modelo_para(paso):
        print(f"{paso} con OpenCode requiere {VARIABLE_MODELO[paso]} en .env (categoría del plan §11). "
              "No se usa el modelo gratuito por defecto.", file=sys.stderr)
        return 2
    cmd = comando(backend, paso, modulo, extra)
    salida_total: list[str] = []
    print(f"\n$ {' '.join(cmd[:5])} ...\n")
    try:
        proc = subprocess.Popen(
            cmd,
            cwd=RAIZ,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
    except FileNotFoundError:
        print(f"No se encontró el ejecutable para el backend {backend}.", file=sys.stderr)
        return 127

    inicio = time.time()
    try:
        assert proc.stdout is not None
        for linea in proc.stdout:
            print(linea, end="")
            log.write(linea)
            salida_total.append(linea)
        proc.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        proc.kill()
        print(f"\nTiempo agotado tras {timeout}s.", file=sys.stderr)
        return 124
    finally:
        print(f"\n[runner] {paso} terminó en {time.time() - inicio:.1f}s con código {proc.returncode}.")
    if proc.returncode == 0 and SENALES_FALLO.search("".join(salida_total[-40:])):
        print(f"[runner] {paso}: la salida indica un fallo (cupo, límite o error) aunque el código fue 0.",
              file=sys.stderr)
        return 3
    return proc.returncode


def marcar(*args: str) -> int:
    cmd = [sys.executable, str(MARCAR), *args]
    return subprocess.run(cmd, cwd=RAIZ).returncode


def informe_mas_reciente(carpeta: Path, patron: str = "*.md") -> Path | None:
    if not carpeta.is_dir():
        return None
    archivos = sorted(carpeta.glob(patron), key=lambda p: p.stat().st_mtime, reverse=True)
    return archivos[0] if archivos else None


def veredicto_s1(modulo: str) -> str | None:
    """Lee la línea «Veredicto:» del informe de la SPEC del módulo (no menciones sueltas)."""
    spec_id = leer_pipeline().get("modulos", {}).get(modulo, {}).get("spec_id")
    if not spec_id:
        return None
    return cargar_orquestador().veredicto_informe(RAIZ, spec_id)


def resultado_humo() -> str | None:
    informe = informe_mas_reciente(RAIZ / "qa" / "humo", "RUN-humo-*.md")
    if not informe:
        return None
    texto = informe.read_text(encoding="utf-8", errors="replace").lower()
    if "fallido" in texto or "falló" in texto or "fallo" in texto:
        return "fallido"
    if "verde" in texto or "ok" in texto:
        return "verde"
    return None


def describir(accion: dict) -> str:
    return (
        f"[{accion['modulo']}] {accion['paso']} — {accion['responsable']}\n"
        f"  {accion['accion']}\n"
        f"  Bloqueado por: {accion.get('bloqueado_por', '—')}"
    )


def puerta(accion: dict) -> bool:
    return accion["paso"] in PUERTAS


def plan_humano(accion: dict) -> str:
    paso = accion["paso"]
    modulo = accion["modulo"]
    if paso == "mvp":
        return (
            "Puerta humana del MVP. Ejecuta los modos MVP y luego una persona escribe aprobado_por:\n"
            "  python3 agentes-ia/agente.py specification-agent \"priorizar MVP\" --adjuntar ...\n"
            "  python3 agentes-ia/agente.py architecture-agent \"cortar MVP\" --adjuntar ...\n"
            "  python3 qa/scripts/marcar.py mvp --estado aprobado --aprobado-por \"Nombre\""
        )
    if paso == "registrar-modulos":
        return (
            "El MVP ya está aprobado. Registra cada módulo del Corte técnico:\n"
            "  python3 qa/scripts/marcar.py modulo <nombre> --spec pendiente"
        )
    if paso == "spec":
        return (
            f"Aprobación humana de la SPEC del módulo {modulo}. Congélala en "
            f"agentes-ia/salidas/specification-agent/aprobadas/ y marca:\n"
            f"  python3 qa/scripts/marcar.py modulo {modulo} --spec aprobada"
        )
    if paso in ("escalado", "escalar"):
        return "Escalamiento: decide una persona. Revisa el motivo en pipeline.json y resuélvelo con marcar.py."
    if paso == "entrega":
        return "Puerta humana final: revisa la definición de terminado y aprueba la entrega."
    return ""


def main() -> int:
    parser = argparse.ArgumentParser(description="Runner secuencial del pipeline.")
    parser.add_argument("--estado", action="store_true", help="Muestra el siguiente paso y sale.")
    parser.add_argument("--dry-run", action="store_true", help="Muestra la secuencia sin ejecutar agentes.")
    parser.add_argument("--todo", action="store_true", help="Prueba mecánica + preflight + secuencia hasta una puerta.")
    parser.add_argument("--seguir", action="store_true", help="Ejecuta pasos hasta una puerta humana.")
    parser.add_argument("--paso", help="Fuerza un paso: S1, S2, S3, B1/B4, B2/B4, B3/B4, B1-B4 sueltos, R1 (R2 con --backend api).")
    parser.add_argument("--modulo", default=None, help="Módulo sobre el que trabaja el paso forzado.")
    parser.add_argument("--backend", default="auto", choices=["auto", "claude", "opencode", "python", "api"])
    parser.add_argument("--timeout", type=int, default=1200, help="Segundos por agente (por defecto 1200).")
    parser.add_argument("--auto-marcar", action="store_true", help="Marca S1/S3/R1 cuando el resultado es inequívoco.")
    parser.add_argument("--max-pasos", type=int, default=20, help="Tope de pasos en --seguir/--todo.")
    args = parser.parse_args()

    backend = detectar_backend(args.backend)
    accion = siguiente()

    if args.todo:
        print("== 1. Prueba mecánica ==")
        prueba = subprocess.run(
            [sys.executable, str(RAIZ / "qa" / "scripts" / "probar_todo.py")],
            cwd=RAIZ,
        )
        if prueba.returncode != 0:
            print("La prueba mecánica falló; no se ejecutan agentes.", file=sys.stderr)
            return 1

    problemas = preflight(backend)
    if backend == "python":
        problemas += preflight("python")

    print("\n== Runner Pharma Express ==")
    print(f"Backend: {backend or 'ninguno'}")
    if problemas:
        print("Preflight:")
        for problema in problemas:
            print(f"  - {problema}")
    else:
        print("Preflight: OK")
    print(f"\nSiguiente paso:\n{describir(accion)}")

    if args.estado:
        return 0

    if args.dry_run:
        print("\n== Secuencia prevista ==")
        simulado = pipeline_efectivo()
        orquestador = cargar_orquestador()
        for n in range(args.max_pasos):
            act = orquestador.siguiente(simulado)[0]
            print(f"  {n + 1}. [{act['modulo']}] {act['paso']} — {act['responsable']}")
            if puerta(act):
                print(f"     Se detiene: {plan_humano(act).splitlines()[0]}")
                break
            if act["paso"] == "S1":
                simulado.setdefault("modulos", {}).setdefault(act["modulo"], {})["revision"] = "APTA"
            elif act["paso"] == "S2":
                simulado.setdefault("modulos", {}).setdefault(act["modulo"], {})["oraculos"] = "aprobados"
            elif act["paso"] == "S3":
                simulado.setdefault("modulos", {}).setdefault(act["modulo"], {})["pruebas"] = "rojas"
            elif act["paso"].endswith("/B4"):
                simulado.setdefault("modulos", {}).setdefault(act["modulo"], {})["implementacion"] = "verde"
            elif act["paso"] == "R1":
                simulado.setdefault("modulos", {}).setdefault(act["modulo"], {})["humo"] = "verde"
        return 0

    if args.paso:
        ejecutables = set(AGENTES) | {"B1", "B2", "B3", "B4", "B2/B4", "B3/B4"} | ({"R2"} if backend == "api" else set())
        if args.paso not in ejecutables:
            sys.exit(f"Paso no ejecutable: {args.paso}")
        if not args.modulo:
            sys.exit("--paso requiere --modulo.")
        accion = {"paso": args.paso, "modulo": args.modulo, "responsable": "runner",
                  "accion": "Paso forzado con --paso."}

    if puerta(accion) and not args.paso:
        print(f"\n{plan_humano(accion)}")
        return 0

    if backend in (None, "python"):
        print(
            "\nNo hay backend de agentes disponible (api, claude u opencode). "
            "Instala Claude Code o ejecuta los agentes a mano; ver docs/COMO-PROBAR.md.",
            file=sys.stderr,
        )
        return 1

    LOG_DIR.mkdir(parents=True, exist_ok=True)
    sello = datetime.now().strftime("%Y%m%d-%H%M%S")
    ruta_log = LOG_DIR / f"runner-{sello}.log"
    resumen = {"fecha": sello, "backend": backend, "pasos": []}

    with ruta_log.open("w", encoding="utf-8") as log:
        log.write(f"Runner {sello} | backend={backend}\n")
        pasos = 0
        forzado = accion if args.paso else None
        while pasos < args.max_pasos:
            if forzado and pasos > 0:
                break  # un paso forzado con --paso se ejecuta una sola vez
            accion = forzado or siguiente()
            print(f"\n== Paso {pasos + 1}: {describir(accion)} ==")
            log.write(f"\n== Paso {pasos + 1}: {describir(accion)} ==\n")

            if puerta(accion):
                print(f"\n{plan_humano(accion)}")
                resumen["detenido_en"] = accion
                break

            paso = accion["paso"]
            modulo = accion["modulo"]
            if paso.endswith("/B4"):
                resultado = ciclo_construccion(backend, paso, modulo, args.timeout, log)
                resumen["pasos"].append({"paso": paso, "modulo": modulo, "resultado": resultado})
                pasos += 1
                if resultado == "verde":
                    continue  # el orquestador decide el siguiente paso
                if resultado == "escalado":
                    print(f"\n{modulo}: se escaló a una persona (ver pipeline.json, escalados).")
                    resumen["detenido_en"] = {"motivo": "escalado", **accion}
                    break
                if resultado in ("sin_pruebas", "revision"):
                    motivo = ("faltan pruebas: ejecuta S3 del módulo" if resultado == "sin_pruebas"
                              else "revisión manual: marca --implementacion verde cuando esté listo")
                    print(f"\n{modulo}: {motivo}.")
                    resumen["detenido_en"] = {"motivo": motivo, **accion}
                    break
                print(f"{resultado}: el agente falló (cupo, API o error). Se detiene.", file=sys.stderr)
                resumen["error"] = resultado
                return 1
            else:
                codigo = ejecutar_backend(backend, paso, modulo, args.timeout, log)
                if codigo != 0:
                    print(f"{paso} falló con código {codigo}. Se detiene.", file=sys.stderr)
                    resumen["error"] = f"{paso}={codigo}"
                    return 1

            resumen["pasos"].append({"paso": paso, "modulo": modulo})
            pasos += 1

            if not args.auto_marcar:
                print(f"\nRevisa la salida y marca el estado con marcar.py. Se detiene para no asumir el resultado.")
                resumen["detenido_en"] = {"motivo": "marcado manual", **accion}
                break

            if paso == "S1":
                veredicto = veredicto_s1(modulo)
                if veredicto:
                    marcar("modulo", modulo, "--revision", veredicto)
                    if veredicto == "NO_APTA":
                        print("S1 devolvió NO_APTA: se detiene para volver a Especificaciones.")
                        resumen["detenido_en"] = {"motivo": "NO_APTA", **accion}
                        break
                else:
                    print("S1 no dejó un veredicto legible; se detiene.", file=sys.stderr)
                    resumen["detenido_en"] = {"motivo": "sin veredicto S1", **accion}
                    break
            elif paso == "S3":
                if guardian("rojas", "--modulo", modulo) == 0:
                    marcar("modulo", modulo, "--pruebas", "rojas")
                else:
                    print("S3: las pruebas no fallan por la razón correcta; no se marcan rojas.", file=sys.stderr)
                    resumen["detenido_en"] = {"motivo": "rojas no verificadas", **accion}
                    break
            elif paso == "R1":
                estado = resultado_humo()
                if estado:
                    marcar("modulo", modulo, "--humo", estado)
                else:
                    print("R1 no dejó un informe legible; se detiene.", file=sys.stderr)
                    resumen["detenido_en"] = {"motivo": "sin informe de humo", **accion}
                    break
            else:
                print(f"{paso} terminó. Revisa y marca el estado; el runner no asume el resultado.")
                resumen["detenido_en"] = {"motivo": "marcado manual", **accion}
                break

        if pasos >= args.max_pasos:
            print(f"\nSe alcanzó el tope de {args.max_pasos} pasos.")
            resumen["detenido_en"] = {"motivo": "max-pasos"}

    (LOG_DIR / f"runner-{sello}.json").write_text(
        json.dumps(resumen, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"\nLog: {ruta_log.relative_to(RAIZ)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
