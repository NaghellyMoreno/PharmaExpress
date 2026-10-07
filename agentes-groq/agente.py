#!/usr/bin/env python3
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
PROVEEDOR_POR_DEFECTO = "gemini"
# Errores ante los que se prueba el siguiente modelo de "modelos_respaldo":
# 429 = cupo agotado; 500, 502, 503 y 504 = modelo saturado o caído.
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


# ---------------------------------------------------------------------------
# Organización de salidas por documento (agentes con "organizacion_salida": "spec")
#
# salidas/<agente>/
#   aprobadas/                  solo versiones aprobadas y congeladas
#   borradores/SPEC-001/        borradores y candidatas de cada documento
#   analisis/SPEC-001/          documentos en estado de análisis
#   sin-clasificar/             respuestas sin encabezado de documento
#   registro.md                 una línea por ejecución
# ---------------------------------------------------------------------------
# El prefijo del encabezado lo fija el agente con "prefijo_documento" en config.json
# (SPEC para el Specification Agent, ARQ para el Architecture Agent).
PATRON_ESTADO = re.compile(r"^Estado:\s*(.+?)\s*$", re.M)
PATRON_EPICA = re.compile(r"^Épica:\s*(.+?)\s*$", re.M)
MARCA_INCOMPLETA = "_INCOMPLETA"


def leer_encabezado_spec(texto, prefijo="SPEC"):
    """Devuelve (id, nombre, version, estado) o None si la respuesta no tiene encabezado."""
    patron = re.compile(
        rf"^#\s*({re.escape(prefijo)}-\d{{3}})\.\s*(.+?)\s*-\s*Versi[oó]n\s*(\d+\.\d+)\s*$", re.M
    )
    encabezado = patron.search(texto)
    if not encabezado:
        return None
    estado = PATRON_ESTADO.search(texto)
    return (
        encabezado.group(1),
        encabezado.group(2),
        encabezado.group(3),
        estado.group(1) if estado else "Desconocido",
    )


def relativa(ruta):
    """Ruta relativa a la raíz del proyecto; se queda absoluta si está fuera."""
    try:
        return Path(ruta).relative_to(RAIZ_PROYECTO)
    except ValueError:
        return Path(ruta)


def clave_version(ruta):
    """Ordena archivos SPEC-001_v1.10.md por versión numérica, no alfabética."""
    coincidencia = re.search(r"_v(\d+)\.(\d+)", ruta.name)
    return (int(coincidencia.group(1)), int(coincidencia.group(2))) if coincidencia else (-1, -1)


def ruta_libre(ruta):
    """Si el archivo ya existe, agrega _2, _3... para no sobrescribir."""
    if not ruta.exists():
        return ruta
    contador = 2
    while True:
        candidata = ruta.with_name(f"{ruta.stem}_{contador}{ruta.suffix}")
        if not candidata.exists():
            return candidata
        contador += 1


def ultima_version_spec(config, id_spec):
    """Busca la última versión completa de un documento: aprobada, en análisis o en borrador."""
    base = RAIZ_PROYECTO / config["carpeta_salida"]
    archivos = list((base / "borradores" / id_spec).glob(f"{id_spec}_v*.md"))
    archivos += list((base / "aprobadas").glob(f"{id_spec}_v*.md"))
    archivos += list((base / "analisis" / id_spec).glob(f"{id_spec}_v*.md"))
    completos = [a for a in archivos if MARCA_INCOMPLETA not in a.name]
    if not completos:
        sys.exit(f"No hay versiones guardadas de {id_spec} en {relativa(base)}.")
    # A igual versión, prefiere la aprobada sobre la candidata.
    return max(completos, key=lambda a: (clave_version(a), "aprobadas" in a.parts))


def guardar_spec(config, nombre_agente, peticion, respuesta, modelo, cortada):
    base = RAIZ_PROYECTO / config.get("carpeta_salida", f"agentes-groq/salidas/{nombre_agente}")
    prefijo = config.get("prefijo_documento", "SPEC")
    fecha = datetime.now()
    datos = leer_encabezado_spec(respuesta, prefijo)

    if datos is None:
        # Respuesta sin encabezado (por ejemplo, una propuesta de división).
        carpeta = base / "sin-clasificar"
        nombre = f"{fecha:%Y%m%d-%H%M}_sin-clasificar.md"
        id_spec, version, estado = "-", "-", "Sin encabezado de SPEC"
        destino = carpeta / nombre
    else:
        id_spec, _, version, estado = datos
        nombre = f"{id_spec}_v{version}{MARCA_INCOMPLETA if cortada else ''}.md"
        aprobada = "aprobada" in estado.lower() and not cortada
        analisis = "análisis" in estado.lower() or "analisis" in estado.lower()

        if analisis:
            carpeta = base / "analisis" / id_spec
            destino = carpeta / nombre
        elif aprobada:
            # Anti-duplicidad FROZEN: una versión aprobada y congelada se guarda una sola vez.
            carpeta = base / "aprobadas"
            destino = carpeta / nombre
            if destino.exists():
                sys.exit(
                    f"{relativa(destino)} ya existe y está congelada: no se crea un duplicado. "
                    f"Para cambiarla, pide la siguiente versión con --continuar {id_spec}."
                )
        else:
            carpeta = base / f"borradores/{id_spec}"
            destino = carpeta / nombre
            congelada = base / "aprobadas" / nombre
            if congelada.exists():
                sys.exit(
                    f"{relativa(congelada)} ya existe y está congelada: no se guarda {id_spec} "
                    f"v{version} otra vez con la misma versión. Pide la siguiente versión "
                    f"con --continuar {id_spec}."
                )

    carpeta.mkdir(parents=True, exist_ok=True)
    archivo = ruta_libre(destino)
    encabezado = (
        f"<!--\n"
        f"Agente: {config.get('nombre', nombre_agente)}\n"
        f"Proveedor: {config.get('proveedor', PROVEEDOR_POR_DEFECTO)}\n"
        f"Modelo: {modelo}\n"
        f"Fecha: {fecha:%Y-%m-%d %H:%M}\n"
        f"Petición: {peticion}\n"
        f"-->\n\n"
    )
    archivo.write_text(encabezado + respuesta + "\n", encoding="utf-8")

    registro = base / "registro.md"
    if not registro.exists():
        registro.write_text(
            f"# Registro de ejecuciones de {config.get('nombre', nombre_agente)}\n\n",
            encoding="utf-8",
        )
    resumen = " ".join(peticion.split())[:120]
    with registro.open("a", encoding="utf-8") as r:
        r.write(
            f"- {fecha:%Y-%m-%d %H:%M} | {id_spec} | versión {version} | {estado}"
            f"{' | INCOMPLETA' if cortada else ''} | {modelo} | "
            f"{archivo.relative_to(base)} | {resumen}\n"
        )
    return archivo


def organizar_existentes(nombre_agente):
    """Mueve una sola vez los archivos sueltos del formato anterior a la estructura por SPEC."""
    config, _ = cargar_agente(nombre_agente)
    if config.get("organizacion_salida") != "spec":
        sys.exit(f"El agente '{nombre_agente}' no usa \"organizacion_salida\": \"spec\".")
    base = RAIZ_PROYECTO / config["carpeta_salida"]
    sueltos = [a for a in sorted(base.glob("*.md")) if a.name != "registro.md"]
    if not sueltos:
        print("No hay archivos sueltos para organizar.")
        return
    for archivo in sueltos:
        texto = archivo.read_text(encoding="utf-8")
        datos = leer_encabezado_spec(texto, config.get("prefijo_documento", "SPEC"))
        if datos is None:
            destino = base / "sin-clasificar" / archivo.name
        else:
            id_spec, _, version, estado = datos
            # Una SPEC completa termina con "## Siguiente paso"; si falta, se cortó.
            cortada = "## Siguiente paso" not in texto
            aprobada = "aprobada" in estado.lower() and not cortada
            carpeta = base / ("aprobadas" if aprobada else f"borradores/{id_spec}")
            destino = carpeta / f"{id_spec}_v{version}{MARCA_INCOMPLETA if cortada else ''}.md"
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino = ruta_libre(destino)
        archivo.rename(destino)
        print(f"  {archivo.name}  ->  {destino.relative_to(base)}")


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
    return OpenAI(api_key=llave, base_url=datos["base_url"])


def listar_modelos(nombre_proveedor):
    cliente = crear_cliente(nombre_proveedor)
    print(f"Modelos disponibles en {nombre_proveedor}:")
    for modelo in sorted(m.id for m in cliente.models.list()):
        print(f"  - {modelo}")


# ---------------------------------------------------------------------------
# Flujo en terminal: preguntas de aclaración, resumen y aprobación [S/n]
# ---------------------------------------------------------------------------


def llamar(cliente, config, mensajes, nombre_proveedor):
    """Una llamada al modelo. Si está saturado o sin cupo, prueba los de respaldo."""
    from openai import APIError

    modelos = [config["modelo"]] + config.get("modelos_respaldo", [])
    for posicion, modelo in enumerate(modelos):
        try:
            completado = cliente.chat.completions.create(
                model=modelo, messages=mensajes, **config.get("parametros", {})
            )
            config["modelo"] = modelo
            return completado
        except APIError as error:
            estado = getattr(error, "status_code", None)
            if estado in ESTADOS_CON_RESPALDO and posicion < len(modelos) - 1:
                print(
                    f"Aviso: {modelo} no está disponible (error {estado}). "
                    f"Probando con {modelos[posicion + 1]}...\n"
                )
                continue
            # Muestra el error en una sola línea en lugar de la traza completa de Python.
            sys.exit(f"Error de la API ({nombre_proveedor}): {error}")


def avisar(completado, fase=None):
    """Avisa si la respuesta se cortó y muestra el consumo de tokens."""
    if completado.choices[0].finish_reason == "length":
        print(
            "\nAviso: la respuesta se cortó porque alcanzó el límite de tokens de salida. "
            "Sube max_tokens en config.json y vuelve a ejecutar."
        )
    if completado.usage:
        etiqueta = f" ({fase})" if fase else ""
        print(
            f"\nTokens{etiqueta} -> entrada: {completado.usage.prompt_tokens}, "
            f"salida: {completado.usage.completion_tokens}"
        )


def parsear_preguntas(texto):
    """Extrae las preguntas del bloque '## Preguntas de aclaración' (OPEN-Q o ARCH-Q)."""
    bloque = re.search(
        r"^## Preguntas de aclaración[^\n]*\n(.*?)(?=^## |\Z)", texto, re.M | re.S
    )
    contenido = bloque.group(1) if bloque else texto

    preguntas = []
    actual = None
    for linea in contenido.splitlines():
        nueva = re.match(r"^- ((?:OPEN|ARCH)-Q-\d{3})\.\s*(.+)$", linea)
        if nueva:
            if actual:
                preguntas.append(actual)
            actual = {
                "id": nueva.group(1),
                "pregunta": nueva.group(2).strip(),
                "importa": "",
                "critica": False,
                "estado": "",
            }
        elif actual:
            dato = linea.strip()
            if dato.startswith("Por qué importa:"):
                actual["importa"] = dato.split(":", 1)[1].strip()
            elif dato.startswith("Crítica:"):
                actual["critica"] = dato.split(":", 1)[1].strip().lower().startswith("sí")
            elif dato.startswith("Estado:"):
                actual["estado"] = dato.split(":", 1)[1].strip()
    if actual:
        preguntas.append(actual)
    return preguntas


def contar_pendientes(texto):
    """Cuenta las preguntas abiertas que siguen marcadas como Pendiente en la SPEC."""
    pendientes = set(re.findall(r"^- ((?:OPEN|ARCH)-Q-\d{3}): Pendiente", texto, re.M))
    pendientes.update(
        p["id"] for p in parsear_preguntas(texto) if p["estado"].lower().startswith("pendiente")
    )
    return len(pendientes)


def interactuar(preguntas):
    """Hace las preguntas una a una con '>' y devuelve {id: respuesta}; vacío = pendiente."""
    if preguntas:
        print(
            f"{len(preguntas)} preguntas de aclaración. Responde una a una y pulsa Enter; "
            "en blanco = pendiente; salir = terminar.\n"
        )
    respuestas = {}
    for posicion, pregunta in enumerate(preguntas, 1):
        if posicion > 1:
            print()
        marca = "CRÍTICA · " if pregunta["critica"] else ""
        print(f"{posicion}. {marca}{pregunta['id']}: {pregunta['pregunta']}")
        if pregunta["importa"]:
            print(f"   Por qué importa: {pregunta['importa']}")
        try:
            linea = input("> ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n(interrumpido; lo que falte queda pendiente)")
            return respuestas
        if linea.lower() in ("salir", "exit", "q"):
            print("\n(detenido; lo que falte queda pendiente)")
            return respuestas
        respuestas[pregunta["id"]] = linea or None
    return respuestas


def mensaje_respuestas(preguntas, respuestas):
    """Arma el mensaje de la segunda fase con la respuesta del equipo a cada pregunta."""
    lineas = ["FASE=RESPUESTAS", ""]
    if not preguntas:
        lineas.append("No hubo preguntas de aclaración. Genera la SPEC con la necesidad original.")
        return "\n".join(lineas)
    for pregunta in preguntas:
        respuesta = respuestas.get(pregunta["id"])
        lineas.append(f"- {pregunta['id']}. {pregunta['pregunta']}")
        lineas.append(f"  Respuesta: {respuesta if respuesta else '(pendiente)'}")
    return "\n".join(lineas)


def flujo_interactivo(cliente, config, prompt_sistema, peticion, adjuntos, nombre_proveedor, prefijo):
    """Primera llamada solo con las preguntas; con las respuestas, la SPEC completa."""
    mensajes = [
        {"role": "system", "content": prompt_sistema},
        {"role": "user", "content": construir_mensaje_usuario(f"FASE=PREGUNTAS\n\n{peticion}", adjuntos)},
    ]
    completado = llamar(cliente, config, mensajes, nombre_proveedor)
    texto = completado.choices[0].message.content or ""
    avisar(completado, "fase 1")

    # Si la primera entrega ya vino como documento o como propuesta de división, no hay fase 2.
    if leer_encabezado_spec(texto, prefijo) or texto.lstrip().startswith("# Propuesta de división"):
        return texto, completado.choices[0].finish_reason == "length", [], {}, False

    preguntas = parsear_preguntas(texto)
    respuestas = interactuar(preguntas)
    mensajes.append({"role": "assistant", "content": texto})
    mensajes.append({"role": "user", "content": mensaje_respuestas(preguntas, respuestas)})
    print("\nGenerando la SPEC con tus respuestas...\n")
    completado2 = llamar(cliente, config, mensajes, nombre_proveedor)
    respuesta = completado2.choices[0].message.content or ""
    avisar(completado2, "fase 2")
    return (
        respuesta,
        completado2.choices[0].finish_reason == "length",
        preguntas,
        respuestas,
        True,
    )


def imprimir_resumen(respuesta, prefijo):
    """Resumen corto en terminal; si no tiene encabezado de documento, imprime la respuesta completa."""
    datos = leer_encabezado_spec(respuesta, prefijo)
    if datos is None:
        print(respuesta.rstrip())
        return None

    id_doc, nombre, version, estado = datos
    epica = PATRON_EPICA.search(respuesta)
    conteos = []
    for tipo in ("HU", "RF", "RNF", "BR", "AC", "CL"):
        total = len(re.findall(rf"^- {tipo}-\d+\.", respuesta, re.M))
        if total:
            conteos.append(f"{total} {tipo}")
    pendientes = contar_pendientes(respuesta)

    print(f"{id_doc} · {nombre}")
    linea = f"Versión {version} · {estado}"
    if epica:
        linea += f" · Épica: {epica.group(1)}"
    print(linea)
    if conteos:
        print("Contenido: " + " · ".join(conteos))
    if pendientes:
        print(f"Preguntas abiertas: {pendientes} pendientes")
    else:
        print("Preguntas abiertas: ninguna")
    return datos


def sugerencia_siguiente(estado, id_doc, nombre_agente):
    """Qué hacer después, según el estado en que quedó el documento."""
    texto = estado.lower()
    if "aprobada" in texto:
        return f"{id_doc} quedó aprobada y congelada; lista para el Architecture Agent."
    if "candidata" in texto:
        return (
            f'Para congelarla: python agente.py {nombre_agente} '
            f'"El equipo aprueba la {id_doc}" --continuar {id_doc}'
        )
    if "análisis" in texto or "analisis" in texto:
        return f"Responde las preguntas de análisis y ejecuta de nuevo con --continuar {id_doc}."
    return f"Responde las preguntas abiertas y ejecuta de nuevo con --continuar {id_doc}."


# ---------------------------------------------------------------------------
# Adjuntos por identificador: --aprobada y --epica
# ---------------------------------------------------------------------------


def normalizar_id(valor, patron, ejemplo, origen):
    valor = valor.upper()
    if not re.fullmatch(patron, valor):
        sys.exit(f"{origen}: espera un identificador como {ejemplo} (llegó: '{valor}').")
    return valor


def buscar_aprobada(id_doc):
    """Última versión aprobada y completa de un ID en cualquier carpeta aprobadas/."""
    candidatos = [
        ruta
        for ruta in (RAIZ_AGENTES / "salidas").rglob(f"{id_doc}_v*.md")
        if "aprobadas" in ruta.parts
        and "historial" not in ruta.parts
        and MARCA_INCOMPLETA not in ruta.name
    ]
    if not candidatos:
        sys.exit(f"No hay ninguna versión aprobada de {id_doc} en salidas/*/aprobadas/.")
    return max(candidatos, key=clave_version)


def buscar_por_epica(epicas):
    """Última versión aprobada de cada documento de las épicas indicadas."""
    ultimas = {}
    vistas = set()
    for ruta in (RAIZ_AGENTES / "salidas").rglob("*.md"):
        if "aprobadas" not in ruta.parts or "historial" in ruta.parts or MARCA_INCOMPLETA in ruta.name:
            continue
        epica = PATRON_EPICA.search(ruta.read_text(encoding="utf-8"))
        if not epica:
            continue
        epica = epica.group(1).strip()
        if epica not in epicas:
            continue
        vistas.add(epica)
        id_doc = ruta.name.split("_v")[0]
        if id_doc not in ultimas or clave_version(ruta) > clave_version(ultimas[id_doc]):
            ultimas[id_doc] = ruta

    faltan = [e for e in epicas if e not in vistas]
    if faltan:
        sys.exit(f"No hay versiones aprobadas con la épica: {', '.join(faltan)}.")
    return [ultimas[id_doc] for id_doc in sorted(ultimas)]


def numeracion_inicial(config, nombre_agente, prefijo):
    """Línea "SPEC-002, empieza en RF-013, BR-009..." con los números que siguen.

    La calcula el script porque en la primera versión el modelo no ve las salidas
    anteriores y no puede adivinar en qué documento se va ni por dónde sigue la
    numeración. Un documento incompleto no consume su número de SPEC (puede
    reintentarse), pero sí consume los números de sus elementos.
    """
    base = RAIZ_PROYECTO / config.get("carpeta_salida", f"agentes-groq/salidas/{nombre_agente}")
    documentos = sorted(
        ruta for ruta in base.rglob("*.md")
        if re.match(rf"{re.escape(prefijo)}-\d{{3}}_v", ruta.name)
    )
    if not documentos:
        return ""

    completos = [d for d in documentos if MARCA_INCOMPLETA not in d.name]
    ids = [
        int(re.match(rf"{re.escape(prefijo)}-(\d{{3}})", d.name).group(1)) for d in completos
    ]
    linea = f"{prefijo}-{(max(ids) if ids else 0) + 1:03d}"

    elementos = []
    for tipo in ("HU", "RF", "RNF", "BR", "CL", "AC"):
        encontrados = [
            int(n)
            for documento in documentos
            for n in re.findall(rf"\b{tipo}-(\d+)\b", documento.read_text(encoding="utf-8"))
        ]
        if encontrados:
            elementos.append(f"{tipo}-{max(encontrados) + 1:03d}")
    if elementos:
        linea += ", empieza en " + ", ".join(elementos)
    return linea + "."


def main():
    parser = argparse.ArgumentParser(description="Ejecuta un agente de Pharma Express.")
    parser.add_argument("agente", nargs="?", help="Nombre de la carpeta del agente en agentes/")
    parser.add_argument("peticion", nargs="?", help="Qué le pides al agente (si se omite, se pregunta)")
    parser.add_argument("--adjuntar", nargs="*", default=[], help="Archivos de texto para dar contexto")
    parser.add_argument("--no-guardar", action="store_true", help="Solo muestra el resultado en pantalla")
    parser.add_argument(
        "--imprimir", action="store_true",
        help="Muestra el markdown completo además del resumen",
    )
    parser.add_argument("--listar", action="store_true", help="Lista los agentes disponibles")
    parser.add_argument("--modelos", metavar="PROVEEDOR", help="Lista los modelos de un proveedor")
    parser.add_argument(
        "--organizar", metavar="AGENTE",
        help="Reorganiza una sola vez los archivos sueltos del formato anterior",
    )
    parser.add_argument(
        "--continuar", metavar="SPEC-00X",
        help="Adjunta automáticamente la última versión completa de ese documento",
    )
    parser.add_argument(
        "--aprobada", nargs="+", metavar="SPEC-00X",
        help="Adjunta la última versión aprobada y congelada de cada documento indicado",
    )
    parser.add_argument(
        "--epica", nargs="+", metavar="EPIC-00X",
        help="Adjunta la última versión aprobada de cada documento de esa épica",
    )
    args = parser.parse_args()

    cargar_variables_entorno()

    if args.organizar:
        organizar_existentes(args.organizar)
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
    prefijo = config.get("prefijo_documento", "SPEC")
    por_spec = config.get("organizacion_salida") == "spec"

    peticion = args.peticion or input("¿Qué le pides al agente?\n> ").strip()
    if not peticion:
        sys.exit("La petición está vacía.")

    # Adjuntos, en este orden: --continuar, versiones aprobadas, épicas, --adjuntar.
    adjuntos = []
    if args.continuar:
        if not por_spec:
            sys.exit("--continuar solo funciona con agentes que usan \"organizacion_salida\": \"spec\".")
        id_doc = normalizar_id(
            args.continuar, rf"{re.escape(prefijo)}-\d{{3}}", f"{prefijo}-001", "--continuar"
        )
        anterior = ultima_version_spec(config, id_doc)
        print(f"Adjuntando la última versión: {relativa(anterior)}")
        adjuntos.append(str(anterior))
    for id_doc in (args.aprobada or []):
        id_doc = normalizar_id(id_doc, r"[A-Z]+-\d{3}", "SPEC-001", "--aprobada")
        ruta = buscar_aprobada(id_doc)
        print(f"Adjuntando versión aprobada: {relativa(ruta)}")
        adjuntos.append(str(ruta))
    if args.epica:
        epicas = [
            normalizar_id(epica, r"EPIC-\d{3}", "EPIC-001", "--epica") for epica in args.epica
        ]
        for ruta in buscar_por_epica(epicas):
            print(f"Adjuntando versión aprobada de {', '.join(epicas)}: {relativa(ruta)}")
            adjuntos.append(str(ruta))
    adjuntos += list(args.adjuntar)
    adjuntos = list(dict.fromkeys(adjuntos))  # sin duplicados, conservando el orden
    if adjuntos:
        print()

    # En la primera versión, el script le pasa la numeración al agente: el modelo no
    # ve las salidas anteriores y no puede saber en qué SPEC se va ni por dónde sigue.
    # Si el usuario ya indicó el número, o hay documentos adjuntos (--continuar), se omite.
    numeracion = ""
    if por_spec and not adjuntos and not re.search(rf"{re.escape(prefijo)}-\d{{3}}", peticion):
        numeracion = numeracion_inicial(config, args.agente, prefijo)
    mensaje = f"{numeracion} {peticion}" if numeracion else peticion
    if numeracion:
        print(f"Numeración: {numeracion}\n")

    print(
        f"Ejecutando '{config.get('nombre', args.agente)}' con "
        f"{config['modelo']} ({nombre_proveedor})...\n"
    )

    # Flujo interactivo en dos llamadas: preguntas en la terminal y luego la SPEC.
    # --continuar se queda como flujo por mensajes, y sin terminal (pipe o script)
    # también se hace una sola llamada con las preguntas dentro de la respuesta.
    interactivo = bool(config.get("interactivo")) and por_spec and not args.continuar and sys.stdin.isatty()

    preguntas, respuestas, llego_a_fase2 = [], {}, False
    if interactivo:
        respuesta, cortada, preguntas, respuestas, llego_a_fase2 = flujo_interactivo(
            cliente, config, prompt_sistema, mensaje, adjuntos, nombre_proveedor, prefijo
        )
    else:
        mensajes = [
            {"role": "system", "content": prompt_sistema},
            {"role": "user", "content": construir_mensaje_usuario(mensaje, adjuntos)},
        ]
        completado = llamar(cliente, config, mensajes, nombre_proveedor)
        respuesta = completado.choices[0].message.content or ""
        cortada = completado.choices[0].finish_reason == "length"
        avisar(completado)

    # Resumen en lugar de volcar el markdown; --imprimir lo muestra completo.
    datos = None
    if por_spec:
        datos = imprimir_resumen(respuesta, prefijo)
        if args.imprimir and datos is not None:
            print("\n" + respuesta.rstrip() + "\n")
    else:
        print(respuesta.rstrip())

    # Aprobación en terminal: una sola tecla, sin llamadas extra a la API.
    respondido_todo = all(respuestas.get(p["id"]) for p in preguntas) if preguntas else True
    if (
        interactivo
        and llego_a_fase2
        and respondido_todo
        and not cortada
        and not args.no_guardar
        and datos
        and "candidata" in datos[3].lower()
        and contar_pendientes(respuesta) == 0
    ):
        try:
            opcion = input(
                f"\n¿Apruebas y congelas la {datos[0]} versión {datos[2]}? [S/n] "
            ).strip().lower()
        except (KeyboardInterrupt, EOFError):
            print()
            opcion = "n"
        if opcion in ("", "s", "si", "sí"):
            respuesta = re.sub(
                r"^Estado:\s*.*$", "Estado: Aprobada y congelada", respuesta, count=1, flags=re.M
            )
            datos = leer_encabezado_spec(respuesta, prefijo)

    if not args.no_guardar:
        if por_spec:
            archivo = guardar_spec(config, args.agente, peticion, respuesta, config["modelo"], cortada)
            if cortada:
                print("Se guardó marcada como INCOMPLETA: --continuar no la usará como adjunto.")
            print(f"Guardada: {relativa(archivo)}")
            if datos:
                print(f"Siguiente: {sugerencia_siguiente(datos[3], datos[0], args.agente)}")
        else:
            archivo = guardar_resultado(config, args.agente, peticion, respuesta)
            print(f"Resultado guardado en: {relativa(archivo)}")


if __name__ == "__main__":
    main()