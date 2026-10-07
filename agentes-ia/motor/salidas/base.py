"""Piezas comunes a todas las formas de guardar respuestas."""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime

from ..agentes import Agente
from ..ejecutor import Respuesta


@dataclass(frozen=True)
class Ejecucion:
    """Todo lo que se guarda de una ejecución: quién, qué se pidió y qué respondió."""
    agente: Agente
    peticion: str
    respuesta: Respuesta
    fecha: datetime = field(default_factory=datetime.now)


class Almacen(ABC):
    """Guarda la respuesta de un agente dentro de su carpeta de salida."""

    def __init__(self, carpeta):
        self.carpeta = carpeta

    @abstractmethod
    def guardar(self, ejecucion):
        """Guarda la ejecución y devuelve la ruta del archivo creado."""


def escribir_con_encabezado(archivo, ejecucion):
    """Escribe la respuesta precedida de un comentario con el agente, el modelo y la petición."""
    encabezado = (
        f"<!--\n"
        f"Agente: {ejecucion.agente.nombre}\n"
        f"Proveedor: {ejecucion.respuesta.proveedor}\n"
        f"Modelo: {ejecucion.respuesta.modelo}\n"
        f"Fecha: {ejecucion.fecha:%Y-%m-%d %H:%M}\n"
        f"Petición: {ejecucion.peticion}\n"
        f"-->\n\n"
    )
    archivo.write_text(encabezado + ejecucion.respuesta.texto + "\n", encoding="utf-8")


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
