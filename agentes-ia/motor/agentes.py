"""Lista y carga los agentes de la carpeta agentes/."""
import json
from dataclasses import dataclass

from .errores import ErrorAgente
from .rutas import CARPETA_AGENTES, RAIZ_PROYECTO

# Contexto común de todos los agentes. Un agente puede usar otro con "archivo_contexto" en config.json.
ARCHIVO_CONTEXTO_POR_DEFECTO = "PHARMA_EXPRESS_AGENTES.md"
MARCADOR_CONTEXTO = "{{CONTEXTO_PROYECTO}}"


@dataclass(frozen=True)
class Agente:
    carpeta: str
    config: dict
    prompt_sistema: str

    @property
    def nombre(self):
        return self.config.get("nombre", self.carpeta)

    @property
    def carpeta_salida(self):
        return RAIZ_PROYECTO / self.config.get("carpeta_salida", f"agentes-ia/salidas/{self.carpeta}")

    @property
    def organizacion_salida(self):
        return self.config.get("organizacion_salida")


def listar_agentes():
    """Nombres de las carpetas de agentes, sin las que empiezan con "_" (como _plantilla)."""
    return sorted(
        carpeta.name
        for carpeta in CARPETA_AGENTES.iterdir()
        if carpeta.is_dir() and not carpeta.name.startswith("_")
    )


def cargar_agente(nombre):
    carpeta = CARPETA_AGENTES / nombre
    if not carpeta.is_dir():
        raise ErrorAgente(
            f"No existe el agente '{nombre}'. Agentes disponibles: {', '.join(listar_agentes())}"
        )
    config = json.loads((carpeta / "config.json").read_text(encoding="utf-8"))
    prompt = (carpeta / "prompt.md").read_text(encoding="utf-8")
    return Agente(carpeta=nombre, config=config, prompt_sistema=_insertar_contexto(prompt, config))


def _insertar_contexto(prompt, config):
    """Reemplaza {{CONTEXTO_PROYECTO}} por el archivo de contexto.

    Se lee en cada ejecución para que siempre esté actualizado.
    """
    if MARCADOR_CONTEXTO not in prompt:
        return prompt
    archivo = RAIZ_PROYECTO / config.get("archivo_contexto", ARCHIVO_CONTEXTO_POR_DEFECTO)
    if not archivo.is_file():
        raise ErrorAgente(f"No se encontró el archivo de contexto: {archivo}")
    return prompt.replace(MARCADOR_CONTEXTO, archivo.read_text(encoding="utf-8"))
