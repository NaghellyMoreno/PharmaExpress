"""Carpetas del proyecto que usan los agentes."""
from pathlib import Path

RAIZ_AGENTES = Path(__file__).resolve().parent.parent
RAIZ_PROYECTO = RAIZ_AGENTES.parent
CARPETA_AGENTES = RAIZ_AGENTES / "agentes"
ARCHIVO_ENV = RAIZ_AGENTES / ".env"


def relativa_al_proyecto(ruta):
    """Muestra una ruta desde la raíz del proyecto, más corta y legible."""
    return ruta.relative_to(RAIZ_PROYECTO)
