#!/usr/bin/env python3
"""Motor común para ejecutar los agentes del proyecto Pharma Express.

Funciona con cualquier proveedor compatible con la API de OpenAI: Mistral, Gemini,
Groq u OpenRouter. El proveedor se escoge en el config.json de cada agente.

Cada agente vive en agentes/<nombre>/ y tiene dos archivos:
    - prompt.md   -> instrucciones de sistema (puede incluir {{CONTEXTO_PROYECTO}})
    - config.json -> proveedor, modelo, parámetros, carpeta de salida y, opcionalmente,
                     archivo_contexto (ruta relativa a la raíz del proyecto)

Uso:
    python agente.py --listar
    python agente.py --modelos mistral
    python agente.py --probar mistral mistral-small-latest
    python agente.py specification-agent "Necesitamos que el paciente pueda cancelar su cita"
    python agente.py specification-agent "Respuestas del equipo. OPEN-Q-001: ..." --adjuntar salidas/specification-agent/<archivo>.md
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
# Contexto común de todos los agentes. Un agente puede usar otro con "archivo_contexto" en config.json.
ARCHIVO_CONTEXTO_POR_DEFECTO = "PHARMA_EXPRESS_AGENTES.md"
MARCADOR_CONTEXTO = "{{CONTEXTO_PROYECTO}}"

# Proveedores compatibles con la API de OpenAI. La llave de cada uno va en agentes-groq/.env.
PROVEEDORES = {
    "mistral": {"base_url": "https://api.mistral.ai/v1", "variable": "MISTRAL_API_KEY"},
    "gemini": {
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
        "variable": "GEMINI_API_KEY",
    },
    "groq": {"base_url": "https://api.groq.com/openai/v1", "variable": "GROQ_API_KEY"},
    "openrouter": {"base_url": "https://openrouter.ai/api/v1", "variable": "OPENROUTER_API_KEY"},
}
PROVEEDOR_POR_DEFECTO = "groq"
# Errores ante los que se prueba el siguiente modelo de "modelos_respaldo":
# 429 = límite de uso alcanzado; 500, 502, 503 y 504 = modelo saturado o caído.
ESTADOS_CON_RESPALDO = {429, 500, 502, 503, 504}


def cargar_variables_entorno():
    """Carga las llaves de API desde agentes-groq/.env si python-dotenv está instalado."""
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

    # El contexto se lee en cada ejecución para que siempre esté actualizado.
    # Cada agente puede indicar su propio archivo con "archivo_contexto" en config.json.
    if MARCADOR_CONTEXTO in prompt:
        archivo_contexto = RAIZ_PROYECTO / config.get("archivo_contexto", ARCHIVO_CONTEXTO_POR_DEFECTO)
        if not archivo_contexto.is_file():
            sys.exit(f"No se encontró el archivo de contexto: {archivo_contexto}")
        prompt = prompt.replace(MARCADOR_CONTEXTO, archivo_contexto.read_text(encoding="utf-8"))

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
        f"Proveedor: {config.get('proveedor', PROVEEDOR_POR_DEFECTO)}\n"
        f"Modelo: {config['modelo']}\n"
        f"Fecha: {fecha:%Y-%m-%d %H:%M}\n"
        f"Petición: {peticion}\n"
        f"-->\n\n"
    )
    archivo.write_text(encabezado + respuesta + "\n", encoding="utf-8")
    return archivo


def crear_cliente(nombre_proveedor):
    """Crea un cliente de la API de OpenAI apuntando al proveedor indicado."""
    if nombre_proveedor not in PROVEEDORES:
        sys.exit(
            f"Proveedor desconocido: '{nombre_proveedor}'. "
            f"Opciones: {', '.join(PROVEEDORES)}"
        )
    datos = PROVEEDORES[nombre_proveedor]
    llave = os.environ.get(datos["variable"])
    if not llave:
        sys.exit(f"Falta {datos['variable']}. Agrégala en agentes-groq/.env (mira .env.example).")
    try:
        from openai import OpenAI
    except ImportError:
        sys.exit("Falta la librería openai. Ejecuta: pip install -r requirements.txt")
    return OpenAI(api_key=llave, base_url=datos["base_url"], max_retries=3)


def listar_modelos(nombre_proveedor):
    cliente = crear_cliente(nombre_proveedor)
    print(f"Modelos disponibles en {nombre_proveedor}:")
    for modelo in sorted(m.id for m in cliente.models.list()):
        print(f"  - {modelo}")


def mostrar_limites(cabeceras):
    """Imprime las cabeceras de límites de uso que envía el proveedor, si las hay."""
    limites = {k: v for k, v in cabeceras.items() if "ratelimit" in k.lower() or k.lower() == "retry-after"}
    if not limites:
        print("El proveedor no envió información de límites.")
        return
    print("Límites que reporta el proveedor para tu cuenta:")
    for clave, valor in sorted(limites.items()):
        print(f"  {clave}: {valor}")


def probar_conexion(nombre_proveedor, modelo):
    """Envía una solicitud mínima para separar problemas de cuenta de problemas de tamaño."""
    from openai import APIError

    cliente = crear_cliente(nombre_proveedor).with_options(max_retries=0)
    print(f"Probando {modelo} en {nombre_proveedor} con una solicitud mínima...\n")
    try:
        crudo = cliente.chat.completions.with_raw_response.create(
            model=modelo,
            messages=[{"role": "user", "content": "Responde solo: hola"}],
            max_tokens=10,
        )
    except APIError as error:
        print(f"Falló (error {getattr(error, 'status_code', '?')}): {detalle_del_proveedor(error)}\n")
        respuesta = getattr(error, "response", None)
        if respuesta is not None:
            mostrar_limites(respuesta.headers)
        return
    completado = crudo.parse()
    print(f"Funciona. Respuesta: {completado.choices[0].message.content}\n")
    mostrar_limites(crudo.headers)


def detalle_del_proveedor(error):
    """Devuelve el mensaje original del proveedor, que suele decir la causa exacta."""
    cuerpo = getattr(error, "body", None)
    if isinstance(cuerpo, list) and cuerpo:
        cuerpo = cuerpo[0]
    if isinstance(cuerpo, dict):
        datos = cuerpo.get("error", cuerpo)
        if isinstance(datos, dict) and datos.get("message"):
            return str(datos["message"])
        if cuerpo.get("message"):
            return str(cuerpo["message"])
    return str(error)


def explicar_error(error, nombre_proveedor):
    return f"{explicacion_breve(error, nombre_proveedor)}\nDetalle del proveedor: {detalle_del_proveedor(error)}"


def explicacion_breve(error, nombre_proveedor):
    estado = getattr(error, "status_code", None)
    if estado == 413:
        sugerencia = (
            "Reduce max_tokens en config.json."
            if nombre_proveedor == "mistral"
            else "Cambia \"proveedor\" a \"mistral\" en config.json o reduce max_tokens."
        )
        return f"La solicitud supera el límite de tokens por solicitud del plan de {nombre_proveedor}. {sugerencia}"
    if estado in ESTADOS_CON_RESPALDO and estado != 429:
        return "El modelo está saturado en este momento. Espera unos minutos o agrega modelos de respaldo en config.json."
    if estado == 429:
        return (
            "El proveedor rechazó la solicitud por límite de uso (429). Si es la primera vez que lo usas, "
            "revisa que el plan gratuito esté activo y que el modelo tenga cupo en tu plan."
        )
    if estado == 401:
        return "La llave de API no es válida. Revisa agentes-groq/.env."
    if estado == 404:
        return (
            "El modelo no existe en este proveedor. Revisa los nombres con: "
            f"python agente.py --modelos {nombre_proveedor}"
        )
    return str(error)


def main():
    parser = argparse.ArgumentParser(description="Ejecuta un agente de Pharma Express.")
    parser.add_argument("agente", nargs="?", help="Nombre de la carpeta del agente en agentes/")
    parser.add_argument("peticion", nargs="?", help="Qué le pides al agente (si se omite, se pregunta)")
    parser.add_argument("--adjuntar", nargs="*", default=[], help="Archivos de texto para dar contexto")
    parser.add_argument("--no-guardar", action="store_true", help="Solo muestra el resultado en pantalla")
    parser.add_argument("--listar", action="store_true", help="Lista los agentes disponibles")
    parser.add_argument("--modelos", metavar="PROVEEDOR", help="Lista los modelos de un proveedor")
    parser.add_argument(
        "--probar", nargs=2, metavar=("PROVEEDOR", "MODELO"),
        help="Envía una solicitud mínima y muestra los límites de tu cuenta",
    )
    args = parser.parse_args()

    cargar_variables_entorno()

    if args.probar:
        probar_conexion(*args.probar)
        return

    if args.modelos:
        listar_modelos(args.modelos)
        return

    if args.listar or not args.agente:
        print("Agentes disponibles:")
        for nombre in listar_agentes():
            print(f"  - {nombre}")
        return

    config, prompt_sistema = cargar_agente(args.agente)
    nombre_proveedor = config.get("proveedor", PROVEEDOR_POR_DEFECTO)
    cliente = crear_cliente(nombre_proveedor)

    peticion = args.peticion or input("¿Qué le pides al agente?\n> ").strip()
    if not peticion:
        sys.exit("La petición está vacía.")

    from openai import APIError

    print(
        f"Ejecutando '{config.get('nombre', args.agente)}' con "
        f"{config['modelo']} ({nombre_proveedor})...\n"
    )
    mensajes = [
        {"role": "system", "content": prompt_sistema},
        {"role": "user", "content": construir_mensaje_usuario(peticion, args.adjuntar)},
    ]
    # Si un modelo está saturado o sin cupo, se prueba el siguiente de la lista.
    modelos = [config["modelo"]] + config.get("modelos_respaldo", [])
    completado = None
    for posicion, modelo in enumerate(modelos):
        try:
            completado = cliente.chat.completions.create(
                model=modelo, messages=mensajes, **config.get("parametros", {})
            )
            config["modelo"] = modelo
            break
        except APIError as error:
            estado = getattr(error, "status_code", None)
            hay_otro = posicion < len(modelos) - 1
            if estado in ESTADOS_CON_RESPALDO and hay_otro:
                print(
                    f"Aviso: {modelo} no está disponible (error {estado}: {detalle_del_proveedor(error)}). "
                    f"Probando con {modelos[posicion + 1]}...\n"
                )
                continue
            sys.exit(f"Error de la API ({nombre_proveedor}): {explicar_error(error, nombre_proveedor)}")

    respuesta = completado.choices[0].message.content or ""
    print(respuesta)

    if completado.choices[0].finish_reason == "length":
        print(
            "\nAviso: la respuesta se cortó porque alcanzó el límite de tokens de salida. "
            "Sube max_tokens en config.json y vuelve a ejecutar."
        )

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