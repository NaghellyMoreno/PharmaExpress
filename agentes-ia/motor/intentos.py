"""Orden en que se prueban los modelos de un agente: el principal y luego sus respaldos."""
from dataclasses import dataclass, field

from .errores import ErrorAgente
from .proveedores import PROVEEDOR_POR_DEFECTO


@dataclass(frozen=True)
class Intento:
    proveedor: str
    modelo: str
    parametros: dict = field(default_factory=dict)

    def __str__(self):
        return f"{self.modelo} ({self.proveedor})"


def cadena_de_modelos(config):
    """Arma la lista de intentos en orden.

    Cada elemento de "modelos_respaldo" puede ser el nombre de un modelo del mismo proveedor
    o un objeto {"proveedor", "modelo", "parametros"} para pasar a otro proveedor, por ejemplo
    a la IA local. Si el objeto no trae "parametros", usa los del agente.
    """
    proveedor = config.get("proveedor", PROVEEDOR_POR_DEFECTO)
    parametros = config.get("parametros", {})
    cadena = [Intento(proveedor, config["modelo"], parametros)]
    for respaldo in config.get("modelos_respaldo", []):
        if isinstance(respaldo, str):
            cadena.append(Intento(proveedor, respaldo, parametros))
        else:
            cadena.append(Intento(
                respaldo.get("proveedor", proveedor),
                respaldo["modelo"],
                respaldo.get("parametros", parametros),
            ))
    return cadena


def filtrar_cadena(cadena, proveedor=None, modelo=None):
    """Aplica --proveedor y --modelo: deja un solo intento, sin respaldos."""
    if not proveedor and not modelo:
        return cadena
    if modelo:
        coincidencias = [
            i for i in cadena if i.modelo == modelo and (not proveedor or i.proveedor == proveedor)
        ]
        if coincidencias:
            return coincidencias[:1]
        # El modelo no está en config.json: se usa con los parámetros del modelo principal.
        return [Intento(proveedor or cadena[0].proveedor, modelo, cadena[0].parametros)]
    coincidencias = [i for i in cadena if i.proveedor == proveedor]
    if not coincidencias:
        raise ErrorAgente(
            f"El agente no tiene un modelo de '{proveedor}' en config.json. Indica cuál con --modelo."
        )
    return coincidencias[:1]
