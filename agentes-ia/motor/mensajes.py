"""Mensajes que se envían al modelo: instrucción de sistema + petición con adjuntos."""
from pathlib import Path

from .errores import ErrorAgente


def construir_mensajes(prompt_sistema, peticion, adjuntos=(), textos=()):
    """textos: pares (título, contenido) que se adjuntan sin venir de un archivo."""
    return [
        {"role": "system", "content": prompt_sistema},
        {"role": "user", "content": _mensaje_usuario(peticion, adjuntos, textos)},
    ]


def _mensaje_usuario(peticion, adjuntos, textos):
    partes = [peticion]
    for ruta in adjuntos:
        archivo = Path(ruta)
        if not archivo.is_file():
            raise ErrorAgente(f"No se encontró el archivo adjunto: {ruta}")
        partes.append(f"---\nArchivo adjunto: {archivo.name}\n\n{archivo.read_text(encoding='utf-8')}")
    for titulo, contenido in textos:
        partes.append(f"---\n{titulo}\n\n{contenido}")
    return "\n\n".join(partes)
