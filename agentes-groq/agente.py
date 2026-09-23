#!/usr/bin/env python3
"""Motor común para ejecutar los agentes de Groq del proyecto Pharma Express.

Cada agente vive en agentes/<nombre>/ y tiene dos archivos:
    - prompt.md   -> instrucciones de sistema (puede incluir {{CONTEXTO_PROYECTO}})
    - config.json -> modelo, parámetros y carpeta de salida

Uso:
    python agente.py --listar
    python agente.py generador-hu-invest "Épica de agendamiento de turnos, 5 historias"
    python agente.py generador-hu-invest "..." --adjuntar ../User-Strories/UserStory.md
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

RAIZ_AGENTES = Path(__file__).resolve().parent
RAIZ_PROYECTO = RAIZ_AGENTES.parent
CARPETA_AGENTES = RAIZ_AGENTES / "agentes"
ARCHIVO_CONTEXTO = RAIZ_PROYECTO / "PHARMA_EXPRESS_CONTEXTO.md"
MARCADOR_CONTEXTO = "{{CONTEXTO_PROYECTO}}"


def cargar_variables_entorno():
    """Carga GROQ_API_KEY desde agentes-groq/.env si python-dotenv está instalado."""
    try:
        from dotenv import load_dotenv
    except ImportError:
        return
    load_dotenv(RAIZ_AGENTES / ".env")


def listar_agentes():
    return sorted(
        carpeta.name
        for carpeta in CARPETA_AGENTES.iterdir()
        if carpeta.is_dir() and not carpeta.name.startswith("_")
    )


def cargar_agente(nombre):
    carpeta = CARPETA_AGENTES / nombre
    if not carpeta.is_dir():
        sys.exit(
            f"No existe el agente '{nombre}'. Agentes disponibles: {', '.join(listar_agentes())}"
        )

    config = json.loads((carpeta / "config.json").read_text(encoding="utf-8"))
    prompt = (carpeta / "prompt.md").read_text(encoding="utf-8")

    # El contexto se lee de PHARMA_EXPRESS_CONTEXTO.md en cada ejecución para que siempre esté actualizado.
    if MARCADOR_CONTEXTO in prompt:
        prompt = prompt.replace(MARCADOR_CONTEXTO, ARCHIVO_CONTEXTO.read_text(encoding="utf-8"))

    return config, prompt


def construir_mensaje_usuario(peticion, adjuntos):
    partes = [peticion]
    for ruta in adjuntos:
        archivo = Path(ruta)
        if not archivo.is_file():
            sys.exit(f"No se encontró el archivo adjunto: {ruta}")
        partes.append(
            f"---\nArchivo adjunto: {archivo.name}\n\n{archivo.read_text(encoding='utf-8')}"
        )
    return "\n\n".join(partes)


def guardar_resultado(config, nombre_agente, peticion, respuesta):
    carpeta = RAIZ_PROYECTO / config.get("carpeta_salida", f"agentes-groq/salidas/{nombre_agente}")
    carpeta.mkdir(parents=True, exist_ok=True)

    fecha = datetime.now()
    resumen = re.sub(r"[^a-z0-9]+", "-", peticion.lower())[:40].strip("-") or "resultado"
    archivo = carpeta / f"{fecha:%Y%m%d-%H%M}_{resumen}.md"

    encabezado = (
        f"<!--\n"
        f"Agente: {config.get('nombre', nombre_agente)}\n"
        f"Modelo: {config['modelo']}\n"
        f"Fecha: {fecha:%Y-%m-%d %H:%M}\n"
        f"Petición: {peticion}\n"
        f"-->\n\n"
    )
    archivo.write_text(encabezado + respuesta + "\n", encoding="utf-8")
    return archivo


def main():
    parser = argparse.ArgumentParser(description="Ejecuta un agente de Groq de Pharma Express.")
    parser.add_argument("agente", nargs="?", help="Nombre de la carpeta del agente en agentes/")
    parser.add_argument("peticion", nargs="?", help="Qué le pides al agente (si se omite, se pregunta)")
    parser.add_argument("--adjuntar", nargs="*", default=[], help="Archivos de texto para dar contexto")
    parser.add_argument("--no-guardar", action="store_true", help="Solo muestra el resultado en pantalla")
    parser.add_argument("--listar", action="store_true", help="Lista los agentes disponibles")
    args = parser.parse_args()

    if args.listar or not args.agente:
        print("Agentes disponibles:")
        for nombre in listar_agentes():
            print(f"  - {nombre}")
        return

    cargar_variables_entorno()
    if not os.environ.get("GROQ_API_KEY"):
        sys.exit("Falta GROQ_API_KEY. Crea agentes-groq/.env a partir de .env.example.")

    try:
        from groq import Groq, APIError
    except ImportError:
        sys.exit("Falta la librería de Groq. Ejecuta: pip install -r requirements.txt")

    config, prompt_sistema = cargar_agente(args.agente)
    peticion = args.peticion or input("¿Qué le pides al agente?\n> ").strip()
    if not peticion:
        sys.exit("La petición está vacía.")

    cliente = Groq()
    print(f"Ejecutando '{config.get('nombre', args.agente)}' con {config['modelo']}...\n")
    try:
        completado = cliente.chat.completions.create(
            model=config["modelo"],
            messages=[
                {"role": "system", "content": prompt_sistema},
                {"role": "user", "content": construir_mensaje_usuario(peticion, args.adjuntar)},
            ],
            **config.get("parametros", {}),
        )
    except APIError as error:
        sys.exit(f"Error de la API de Groq: {error}")

    respuesta = completado.choices[0].message.content or ""
    print(respuesta)

    if completado.usage:
        print(
            f"\nTokens -> entrada: {completado.usage.prompt_tokens}, "
            f"salida: {completado.usage.completion_tokens}"
        )

    if not args.no_guardar:
        archivo = guardar_resultado(config, args.agente, peticion, respuesta)
        print(f"Resultado guardado en: {archivo.relative_to(RAIZ_PROYECTO)}")


if __name__ == "__main__":
    main()
