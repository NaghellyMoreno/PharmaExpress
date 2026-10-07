"""Forma de guardar por defecto: un archivo por ejecución con la fecha y un resumen de la petición."""
import re

from .base import Almacen, escribir_con_encabezado, ruta_libre


class AlmacenSimple(Almacen):
    def guardar(self, ejecucion):
        self.carpeta.mkdir(parents=True, exist_ok=True)
        resumen = re.sub(r"[^a-z0-9]+", "-", ejecucion.peticion.lower())[:40].strip("-") or "resultado"
        # Si ya existe uno de la misma petición en el mismo minuto, agrega _2, _3... para no sobrescribirlo.
        archivo = ruta_libre(self.carpeta / f"{ejecucion.fecha:%Y%m%d-%H%M}_{resumen}.md")
        escribir_con_encabezado(archivo, ejecucion)
        return archivo
