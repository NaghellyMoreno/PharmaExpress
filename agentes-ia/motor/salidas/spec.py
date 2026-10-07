"""Organización de salidas por SPEC (agentes con "organizacion_salida": "spec").

salidas/specification-agent/
  aprobadas/                  solo versiones aprobadas y congeladas
  borradores/SPEC-001/        borradores y candidatas de cada SPEC
  sin-clasificar/             respuestas sin encabezado de SPEC
  registro.md                 una línea por ejecución
"""
import re
from dataclasses import dataclass

from ..errores import ErrorAgente
from ..rutas import relativa_al_proyecto
from .base import Almacen, escribir_con_encabezado, ruta_libre

PATRON_ENCABEZADO = re.compile(r"^#\s*(SPEC-\d{3})\.\s*(.+?)\s*-\s*Versi[oó]n\s*(\d+\.\d+)\s*$", re.M)
PATRON_ESTADO = re.compile(r"^Estado:\s*(.+?)\s*$", re.M)
PATRON_VERSION_ARCHIVO = re.compile(r"_v(\d+)\.(\d+)")
MARCA_INCOMPLETA = "_INCOMPLETA"
# Una SPEC completa termina con esta sección; si falta, la respuesta se cortó.
SECCION_FINAL = "## Siguiente paso"


@dataclass(frozen=True)
class EncabezadoSpec:
    id: str
    nombre: str
    version: str
    estado: str

    @property
    def aprobada(self):
        return "aprobada" in self.estado.lower()


def leer_encabezado_spec(texto):
    """Devuelve el encabezado de la SPEC, o None si la respuesta no es una SPEC."""
    encabezado = PATRON_ENCABEZADO.search(texto)
    if not encabezado:
        return None
    estado = PATRON_ESTADO.search(texto)
    return EncabezadoSpec(
        id=encabezado.group(1),
        nombre=encabezado.group(2),
        version=encabezado.group(3),
        estado=estado.group(1) if estado else "Desconocido",
    )


def clave_version(ruta):
    """Ordena archivos SPEC-001_v1.10.md por versión numérica, no alfabética."""
    coincidencia = PATRON_VERSION_ARCHIVO.search(ruta.name)
    return (int(coincidencia.group(1)), int(coincidencia.group(2))) if coincidencia else (-1, -1)


class AlmacenSpec(Almacen):
    @property
    def registro(self):
        return self.carpeta / "registro.md"

    def guardar(self, ejecucion):
        texto = ejecucion.respuesta.texto
        cortada = ejecucion.respuesta.cortada
        spec = leer_encabezado_spec(texto)
        if spec is None:
            destino = self.carpeta / "sin-clasificar" / f"{ejecucion.fecha:%Y%m%d-%H%M}_sin-clasificar.md"
        else:
            destino = self._destino(spec, cortada)

        destino.parent.mkdir(parents=True, exist_ok=True)
        archivo = ruta_libre(destino)
        escribir_con_encabezado(archivo, ejecucion)
        self._registrar(ejecucion, spec, archivo)
        return archivo

    def ultima_version(self, id_spec):
        """Busca la última versión completa de una SPEC, aprobada o en borrador."""
        archivos = list((self.carpeta / "borradores" / id_spec).glob(f"{id_spec}_v*.md"))
        archivos += list((self.carpeta / "aprobadas").glob(f"{id_spec}_v*.md"))
        completos = [a for a in archivos if MARCA_INCOMPLETA not in a.name]
        if not completos:
            raise ErrorAgente(
                f"No hay versiones guardadas de {id_spec} en {relativa_al_proyecto(self.carpeta)}."
            )
        # A igual versión, prefiere la aprobada sobre la candidata.
        return max(completos, key=lambda a: (clave_version(a), "aprobadas" in a.parts))

    def organizar_existentes(self):
        """Mueve una sola vez los archivos sueltos del formato anterior a la estructura por SPEC.

        Devuelve la lista de (origen, destino) de cada archivo movido.
        """
        movidos = []
        sueltos = [a for a in sorted(self.carpeta.glob("*.md")) if a.name != self.registro.name]
        for archivo in sueltos:
            texto = archivo.read_text(encoding="utf-8")
            spec = leer_encabezado_spec(texto)
            if spec is None:
                destino = self.carpeta / "sin-clasificar" / archivo.name
            else:
                destino = self._destino(spec, cortada=SECCION_FINAL not in texto)
            destino.parent.mkdir(parents=True, exist_ok=True)
            destino = ruta_libre(destino)
            archivo.rename(destino)
            movidos.append((archivo, destino))
        return movidos

    def _destino(self, spec, cortada):
        """Las aprobadas completas van a aprobadas/; el resto, a borradores/SPEC-00X/."""
        carpeta = "aprobadas" if spec.aprobada and not cortada else f"borradores/{spec.id}"
        return self.carpeta / carpeta / f"{spec.id}_v{spec.version}{MARCA_INCOMPLETA if cortada else ''}.md"

    def _registrar(self, ejecucion, spec, archivo):
        if not self.registro.exists():
            self.registro.write_text(
                "# Registro de ejecuciones del Specification Agent\n\n", encoding="utf-8"
            )
        if spec is None:
            id_spec, version, estado = "-", "-", "Sin encabezado de SPEC"
        else:
            id_spec, version, estado = spec.id, spec.version, spec.estado
        incompleta = " | INCOMPLETA" if ejecucion.respuesta.cortada else ""
        resumen = " ".join(ejecucion.peticion.split())[:120]
        with self.registro.open("a", encoding="utf-8") as registro:
            registro.write(
                f"- {ejecucion.fecha:%Y-%m-%d %H:%M} | {id_spec} | versión {version} | {estado}"
                f"{incompleta} | {ejecucion.respuesta.modelo} | "
                f"{archivo.relative_to(self.carpeta)} | {resumen}\n"
            )
