"""Errores del motor.

Los módulos lanzan estas excepciones en lugar de terminar el programa;
solo cli.py decide cómo mostrarlas y cuándo salir.
"""


class ErrorAgente(Exception):
    """Error esperado que se muestra al usuario en una sola línea, sin la traza de Python."""


class ProveedorNoDisponible(ErrorAgente):
    """El proveedor no se puede usar en este equipo (falta la llave o la librería)."""
