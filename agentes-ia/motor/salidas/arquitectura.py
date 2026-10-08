"""Organización de salidas del Architecture Agent (agentes con "organizacion_salida": "arquitectura").

salidas/architecture-agent/
  aprobadas/                  solo versiones aprobadas y congeladas
  borradores/ARQ-001/         borradores y candidatas del Architecture Package
  sin-clasificar/             respuestas sin encabezado de ARQ
  registro.md                 una línea por ejecución

También escoge las SPEC que recibe el agente como entrada.
"""
import re

from ..errores import ErrorAgente
from ..rutas import RAIZ_PROYECTO, relativa_al_proyecto
from .spec import MARCA_INCOMPLETA, AlmacenSpec, clave_version, leer_encabezado_spec

PATRON_SUFIJO = re.compile(r"_v\d+\.\d+_(\d+)$")
PATRON_COMENTARIO = re.compile(r"\A<!--.*?-->\s*", re.S)
PATRON_SECCION = re.compile(r"^#{2,3}\s+(?:\d+\.\s*)?(.+?)\s*$")
# Secciones del proceso de la SPEC que no son entrada de arquitectura. Se quitan para ahorrar
# tokens (unos 4.000 con dos SPEC), sobre todo con la IA local. Los criterios de aceptación se
# conservan porque la guía del Architecture Agent los pide como entrada.
SECCIONES_DE_PROCESO = {
    "análisis", "contradicciones detectadas", "análisis de impacto", "preguntas de aclaración",
    "preguntas abiertas", "trazabilidad", "historial de cambios", "verificación", "siguiente paso",
}
PATRON_ID_SPEC = re.compile(r"^(SPEC-\d{3})_v")


def sufijo(ruta):
    """SPEC-001_v1.3_2.md -> 2; sin sufijo -> 1 (es el primer archivo de esa versión)."""
    coincidencia = PATRON_SUFIJO.search(ruta.stem)
    return int(coincidencia.group(1)) if coincidencia else 1


def clave_vigente(ruta):
    """Versión más alta y, a igual versión, el sufijo más alto."""
    return clave_version(ruta), sufijo(ruta)


class AlmacenArquitectura(AlmacenSpec):
    PREFIJO = "ARQ"
    TITULO_REGISTRO = "# Registro de ejecuciones del Architecture Agent"

    def ultima_version(self, id_arq):
        """Como en AlmacenSpec, pero a igual versión y carpeta escoge el sufijo más alto."""
        archivos = list((self.carpeta / "borradores" / id_arq).glob(f"{id_arq}_v*.md"))
        archivos += list((self.carpeta / "aprobadas").glob(f"{id_arq}_v*.md"))
        completos = [a for a in archivos if MARCA_INCOMPLETA not in a.name]
        if not completos:
            raise ErrorAgente(
                f"No hay versiones guardadas de {id_arq} en {relativa_al_proyecto(self.carpeta)}."
            )
        return max(completos, key=lambda a: (clave_version(a), "aprobadas" in a.parts, sufijo(a)))


def compactar_spec(texto):
    """Quita el comentario del motor y las secciones de proceso de una SPEC."""
    lineas, omitir = [], False
    for linea in PATRON_COMENTARIO.sub("", texto).splitlines():
        seccion = PATRON_SECCION.match(linea)
        if seccion:
            omitir = seccion.group(1).lower() in SECCIONES_DE_PROCESO
        if not omitir:
            lineas.append(linea)
    return "\n".join(lineas)


def entradas_arquitectura(config):
    """Archivos de las SPEC aprobadas vigentes y el inventario de las SPEC sin aprobar.

    Usa "carpeta_specs" y "specs_ignoradas" del config.json del agente.
    """
    carpeta = RAIZ_PROYECTO / config["carpeta_specs"]
    ignoradas = {i.upper() for i in config.get("specs_ignoradas", [])}
    vigentes = _vigentes_por_spec((carpeta / "aprobadas").glob("SPEC-*_v*.md"), ignoradas)
    if not vigentes:
        raise ErrorAgente(f"No hay SPEC aprobadas en {relativa_al_proyecto(carpeta / 'aprobadas')}.")
    return [vigentes[i] for i in sorted(vigentes)], _inventario_no_aprobadas(carpeta, ignoradas, vigentes)


def _vigentes_por_spec(archivos, ignoradas):
    """La versión vigente de cada SPEC entre los archivos, sin incompletas ni ignoradas."""
    vigentes = {}
    for archivo in archivos:
        coincidencia = PATRON_ID_SPEC.match(archivo.name)
        if not coincidencia or MARCA_INCOMPLETA in archivo.name or coincidencia.group(1) in ignoradas:
            continue
        id_spec = coincidencia.group(1)
        if id_spec not in vigentes or clave_vigente(archivo) > clave_vigente(vigentes[id_spec]):
            vigentes[id_spec] = archivo
    return vigentes


def _inventario_no_aprobadas(carpeta, ignoradas, aprobadas):
    """Una línea por SPEC cuya última versión no está aprobada, para el reporte de cobertura."""
    lineas = []
    borradores = _vigentes_por_spec((carpeta / "borradores").glob("SPEC-*/SPEC-*_v*.md"), ignoradas)
    for id_spec, archivo in sorted(borradores.items()):
        aprobada = aprobadas.get(id_spec)
        if aprobada and clave_version(aprobada) >= clave_version(archivo):
            continue
        spec = leer_encabezado_spec(archivo.read_text(encoding="utf-8"))
        nombre, version, estado = (spec.nombre, spec.version, spec.estado) if spec else ("?", "?", "?")
        lineas.append(f"- {id_spec}. {nombre} - versión {version} - {estado} ({archivo.name})")
    return "\n".join(lineas) or "No hay SPEC sin aprobar."
