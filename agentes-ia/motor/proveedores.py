"""Proveedores compatibles con la API de OpenAI y creación de sus clientes.

Para agregar un proveedor basta con sumarlo a PROVEEDORES; el resto del código no cambia.
"""
import os
from dataclasses import dataclass
from typing import Optional

from .errores import ErrorAgente, ProveedorNoDisponible
from .rutas import ARCHIVO_ENV


@dataclass(frozen=True)
class Proveedor:
    base_url: str
    # Variable de agentes-ia/.env con la llave. None si el proveedor no la necesita.
    variable_llave: Optional[str] = None
    # Variable de agentes-ia/.env que permite cambiar la dirección del proveedor.
    variable_url: Optional[str] = None

    def llave(self):
        if not self.variable_llave:
            # Ollama ignora la llave, pero la librería exige una.
            return "ollama"
        llave = os.environ.get(self.variable_llave)
        if not llave:
            raise ProveedorNoDisponible(f"Falta {self.variable_llave}. Agrégala en agentes-ia/.env.")
        return llave

    def url(self):
        return os.environ.get(self.variable_url or "", "") or self.base_url


# La llave de cada uno va en agentes-ia/.env.
PROVEEDORES = {
    "gemini": Proveedor(
        "https://generativelanguage.googleapis.com/v1beta/openai/", variable_llave="GEMINI_API_KEY"
    ),
    "groq": Proveedor("https://api.groq.com/openai/v1", variable_llave="GROQ_API_KEY"),
    "openrouter": Proveedor("https://openrouter.ai/api/v1", variable_llave="OPENROUTER_API_KEY"),
    # IA local: no necesita llave. Se puede cambiar la dirección con OLLAMA_BASE_URL en .env.
    "ollama": Proveedor("http://localhost:11434/v1", variable_url="OLLAMA_BASE_URL"),
}
PROVEEDOR_POR_DEFECTO = "openrouter"


def cargar_variables_entorno():
    """Carga las llaves de API desde agentes-ia/.env si python-dotenv está instalado."""
    try:
        from dotenv import load_dotenv
    except ImportError:
        return
    load_dotenv(ARCHIVO_ENV)


def crear_cliente(nombre_proveedor):
    """Crea un cliente de la API de OpenAI apuntando al proveedor indicado."""
    proveedor = PROVEEDORES.get(nombre_proveedor)
    if proveedor is None:
        raise ErrorAgente(
            f"Proveedor desconocido: '{nombre_proveedor}'. Opciones: {', '.join(PROVEEDORES)}"
        )
    llave = proveedor.llave()
    try:
        from openai import OpenAI
    except ImportError:
        raise ProveedorNoDisponible("Falta la librería openai. Ejecuta: pip install -r requirements.txt")
    return OpenAI(api_key=llave, base_url=proveedor.url())


def listar_modelos(nombre_proveedor):
    return sorted(modelo.id for modelo in crear_cliente(nombre_proveedor).models.list())
