"""Línea de comandos: lee los argumentos y une las piezas del motor."""
import argparse
import sys

from .agentes import cargar_agente, listar_agentes
from .ejecutor import EjecutorConRespaldo
from .errores import ErrorAgente
from .intentos import cadena_de_modelos, filtrar_cadena
from .mensajes import construir_mensajes
from .proveedores import PROVEEDORES, cargar_variables_entorno, listar_modelos
from .rutas import relativa_al_proyecto
from .salidas import AlmacenSpec, Ejecucion, compactar_spec, crear_almacen, entradas_arquitectura


def crear_parser():
    parser = argparse.ArgumentParser(description="Ejecuta un agente de Pharma Express.")
    parser.add_argument("agente", nargs="?", help="Nombre de la carpeta del agente en agentes/")
    parser.add_argument("peticion", nargs="?", help="Qué le pides al agente (si se omite, se pregunta)")
    parser.add_argument("--adjuntar", nargs="*", default=[], help="Archivos de texto para dar contexto")
    parser.add_argument("--no-guardar", action="store_true", help="Solo muestra el resultado en pantalla")
    parser.add_argument("--listar", action="store_true", help="Lista los agentes disponibles")
    parser.add_argument("--modelos", metavar="PROVEEDOR", help="Lista los modelos de un proveedor")
    parser.add_argument(
        "--organizar", metavar="AGENTE",
        help="Reorganiza una sola vez los archivos sueltos del formato anterior",
    )
    parser.add_argument(
        "--continuar", metavar="SPEC-00X",
        help="Adjunta automáticamente la última versión completa de esa SPEC (o de ARQ-001)",
    )
    parser.add_argument(
        "--proveedor", choices=sorted(PROVEEDORES),
        help="Usa solo este proveedor, sin respaldos (por ejemplo, ollama para la IA local)",
    )
    parser.add_argument("--modelo", help="Usa solo este modelo, sin respaldos")
    return parser


# ---------------------------------------------------------------------------
# Comandos
# ---------------------------------------------------------------------------

def comando_listar():
    print("Agentes disponibles:")
    for nombre in listar_agentes():
        print(f"  - {nombre}")


def comando_modelos(nombre_proveedor):
    modelos = listar_modelos(nombre_proveedor)
    print(f"Modelos disponibles en {nombre_proveedor}:")
    for modelo in modelos:
        print(f"  - {modelo}")


def comando_organizar(nombre_agente):
    almacen = _almacen_spec(cargar_agente(nombre_agente), f"El agente '{nombre_agente}' no usa")
    movidos = almacen.organizar_existentes()
    if not movidos:
        print("No hay archivos sueltos para organizar.")
    for origen, destino in movidos:
        print(f"  {origen.name}  ->  {destino.relative_to(almacen.carpeta)}")


def comando_ejecutar(args):
    agente = cargar_agente(args.agente)
    intentos = filtrar_cadena(cadena_de_modelos(agente.config), args.proveedor, args.modelo)
    almacen = crear_almacen(agente)

    peticion = args.peticion or input("¿Qué le pides al agente?\n> ").strip()
    if not peticion:
        raise ErrorAgente("La petición está vacía.")

    adjuntos = list(args.adjuntar)
    if args.continuar:
        anterior = _almacen_spec(agente, "--continuar solo funciona con agentes que usan").ultima_version(
            args.continuar.upper()
        )
        print(f"Adjuntando la última versión: {relativa_al_proyecto(anterior)}\n")
        adjuntos.insert(0, str(anterior))

    textos = []
    # Agentes que trabajan sobre las SPEC aprobadas (como el Architecture Agent) las reciben siempre.
    if "carpeta_specs" in agente.config:
        specs, inventario = entradas_arquitectura(agente.config)
        for spec in specs:
            print(f"Adjuntando SPEC aprobada: {relativa_al_proyecto(spec)}")
            textos.append((
                f"SPEC aprobada: {spec.name} (sin las secciones de proceso)",
                compactar_spec(spec.read_text(encoding="utf-8")),
            ))
        print()
        textos.append(("Inventario de SPEC no aprobadas", inventario))

    print(f"Agente: {agente.nombre}")
    mensajes = construir_mensajes(agente.prompt_sistema, peticion, adjuntos, textos)
    # Si un modelo está saturado, sin cupo o sin conexión, se prueba el siguiente de "modelos_respaldo".
    respuesta = EjecutorConRespaldo().ejecutar(intentos, mensajes)
    _mostrar_respuesta(respuesta)

    if not args.no_guardar:
        archivo = almacen.guardar(Ejecucion(agente, peticion, respuesta))
        if respuesta.cortada and isinstance(almacen, AlmacenSpec):
            print("Se guardó marcada como INCOMPLETA: --continuar no la usará como adjunto.")
        print(f"Resultado guardado en: {relativa_al_proyecto(archivo)}")


# ---------------------------------------------------------------------------
# Ayudantes
# ---------------------------------------------------------------------------

def _almacen_spec(agente, inicio_error):
    """Devuelve el almacén por SPEC del agente o un error si el agente no lo usa."""
    almacen = crear_almacen(agente)
    if not isinstance(almacen, AlmacenSpec):
        raise ErrorAgente(f"{inicio_error} \"organizacion_salida\": \"spec\".")
    return almacen


def _mostrar_respuesta(respuesta):
    print(respuesta.texto)
    if respuesta.cortada:
        print(
            "\nAviso: la respuesta se cortó porque alcanzó el límite de tokens de salida. "
            "Sube max_tokens en config.json y vuelve a ejecutar."
        )
    if respuesta.tokens_entrada is not None:
        print(f"\nTokens -> entrada: {respuesta.tokens_entrada}, salida: {respuesta.tokens_salida}")


def main(argv=None):
    args = crear_parser().parse_args(argv)
    cargar_variables_entorno()
    try:
        if args.organizar:
            comando_organizar(args.organizar)
        elif args.modelos:
            comando_modelos(args.modelos)
        elif args.listar or not args.agente:
            comando_listar()
        else:
            comando_ejecutar(args)
    except ErrorAgente as error:
        # Muestra el error en una sola línea en lugar de la traza completa de Python.
        sys.exit(str(error))
