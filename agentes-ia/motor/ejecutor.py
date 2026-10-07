"""Llama al modelo y, si falla, prueba el siguiente intento de la cadena."""
import re
from dataclasses import dataclass
from typing import Optional

from .errores import ErrorAgente, ProveedorNoDisponible
from .proveedores import crear_cliente

# Errores ante los que se prueba el siguiente modelo de "modelos_respaldo":
# 404 = modelo retirado (pasa con los modelos gratuitos de OpenRouter, que cambian);
# 429 = cupo agotado; 500, 502, 503 y 504 = modelo saturado o caído.
ESTADOS_CON_RESPALDO = {404, 429, 500, 502, 503, 504}
# Los modelos con razonamiento locales (Qwen) pueden devolver su razonamiento entre estas etiquetas.
PATRON_RAZONAMIENTO = re.compile(r"<think>.*?</think>\s*", re.S)


@dataclass(frozen=True)
class Respuesta:
    """Lo que respondió el modelo y quién lo respondió."""
    proveedor: str
    modelo: str
    texto: str
    # True si se cortó por alcanzar el límite de tokens de salida.
    cortada: bool
    tokens_entrada: Optional[int] = None
    tokens_salida: Optional[int] = None


class _IntentoFallido(Exception):
    def __init__(self, aviso, mensaje_final, admite_respaldo=True):
        super().__init__(mensaje_final)
        self.aviso = aviso
        self.mensaje_final = mensaje_final
        self.admite_respaldo = admite_respaldo


class EjecutorConRespaldo:
    """Prueba cada intento en orden hasta que uno responda.

    Recibe cómo crear clientes y cómo avisar al usuario, así se puede usar
    con otros clientes (por ejemplo, uno falso en pruebas) o sin imprimir en pantalla.
    """

    def __init__(self, fabrica_clientes=crear_cliente, avisar=print):
        self._fabrica_clientes = fabrica_clientes
        self._avisar = avisar

    def ejecutar(self, intentos, mensajes):
        for posicion, intento in enumerate(intentos):
            siguiente = intentos[posicion + 1] if posicion + 1 < len(intentos) else None
            try:
                completado = self._llamar(intento, mensajes)
            except _IntentoFallido as fallo:
                if siguiente is None or not fallo.admite_respaldo:
                    raise ErrorAgente(fallo.mensaje_final)
                self._avisar(f"Aviso: {fallo.aviso} Probando con {siguiente}...\n")
                continue
            return _a_respuesta(intento, completado)
        raise ErrorAgente("El agente no tiene modelos configurados.")

    def _llamar(self, intento, mensajes):
        try:
            cliente = self._fabrica_clientes(intento.proveedor)
        except ProveedorNoDisponible as error:
            raise _IntentoFallido(f"no se puede usar {intento.proveedor}: {error}", str(error))

        # Se importa aquí porque, si falta la librería, la fábrica ya avisó arriba.
        from openai import APIConnectionError, APIError

        self._avisar(f"Ejecutando con {intento}...\n")
        try:
            return cliente.chat.completions.create(
                model=intento.modelo, messages=mensajes, **intento.parametros
            )
        except APIConnectionError as error:
            # Pasa con Ollama cuando la aplicación no está abierta.
            ayuda = " ¿Está abierto Ollama?" if intento.proveedor == "ollama" else ""
            raise _IntentoFallido(
                f"no hay conexión con {intento.proveedor}.",
                f"Error de conexión ({intento.proveedor}): {error}{ayuda}",
            )
        except APIError as error:
            estado = getattr(error, "status_code", None)
            raise _IntentoFallido(
                f"{intento.modelo} no está disponible (error {estado}).",
                f"Error de la API ({intento.proveedor}): {error}",
                admite_respaldo=estado in ESTADOS_CON_RESPALDO,
            )


def _a_respuesta(intento, completado):
    eleccion = completado.choices[0]
    uso = completado.usage
    return Respuesta(
        proveedor=intento.proveedor,
        modelo=intento.modelo,
        texto=PATRON_RAZONAMIENTO.sub("", eleccion.message.content or "").strip(),
        cortada=eleccion.finish_reason == "length",
        tokens_entrada=uso.prompt_tokens if uso else None,
        tokens_salida=uso.completion_tokens if uso else None,
    )
