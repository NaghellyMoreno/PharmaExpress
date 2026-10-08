"""Formas de guardar las respuestas de los agentes.

Cada agente elige la suya con "organizacion_salida" en config.json. Para agregar una nueva,
se crea una subclase de Almacen y se registra en ALMACENES; el resto del código no cambia.
"""
from .arquitectura import AlmacenArquitectura, compactar_spec, entradas_arquitectura
from .base import Almacen, Ejecucion
from .simple import AlmacenSimple
from .spec import AlmacenSpec

ALMACENES = {"spec": AlmacenSpec, "arquitectura": AlmacenArquitectura}


def crear_almacen(agente):
    """Almacén que corresponde al agente; sin "organizacion_salida", el simple."""
    clase = ALMACENES.get(agente.organizacion_salida, AlmacenSimple)
    return clase(agente.carpeta_salida)


__all__ = [
    "Almacen", "AlmacenArquitectura", "AlmacenSimple", "AlmacenSpec", "Ejecucion",
    "compactar_spec", "crear_almacen", "entradas_arquitectura",
]
