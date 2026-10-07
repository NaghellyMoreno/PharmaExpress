"""Mensajes que se envían al modelo: instrucción de sistema + petición con adjuntos."""
from pathlib import Path

from .errores import ErrorAgente


def construir_mensajes(prompt_sistema, peticion, adjuntos=()):
    return [
        {"role": "system", "content": prompt_sistema},
        {"role": "user", "content": _mensaje_usuario(peticion, adjuntos)},
    ]


def _mensaje_usuario(peticion, adjuntos):
    partes = [peticion]
    for ruta in adjuntos:
        archivo = Path(ruta)
        if not archivo.is_file():
            raise ErrorAgente(f"No se encontró el archivo adjunto: {ruta}")
        partes.append(f"---\nArchivo adjunto: {archivo.name}\n\n{archivo.read_text(encoding='utf-8')}")
    return "\n\n".join(partes)
