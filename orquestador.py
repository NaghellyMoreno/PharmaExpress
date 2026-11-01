#!/usr/bin/env python3
"""Orquestador simple de Pharma Express (sin MCP, sin LLM).

Lee pipeline.json y dice cuál es el siguiente paso permitido. No ejecuta
agentes, no modifica código y no decide alcance: solo aplica las reglas de
orden y las puertas humanas del plan.

Uso:
    python orquestador.py
    python orquestador.py --json
    python orquestador.py --check   # código 1 si hay un bloqueo

Reglas:
  1. Sin `mvp.aprobado_por`, no arranca QA ni construcción.
  2. Una SPEC no aprobada detiene el módulo.
  3. Revisión NO_APTA devuelve el módulo a Especificaciones.
  4. Sin oráculos aprobados, S3 no escribe pruebas.
  5. Sin pruebas rojas, B1 no implementa.
  6. Con iteraciones >= 3, se escala a una persona.
  7. El humo es el último paso antes de la aprobación de entrega.

Fuente de verdad (desde 2026-10-31): los ARCHIVOS mandan sobre pipeline.json.
  - Puerta del MVP: cabecera de docs/mvp.md (`estado: aprobado` y `aprobado_por:`).
  - SPEC aprobada: existe <spec_id>_vX.Y.md con «Estado: Aprobada y congelada» en
    agentes-ia/salidas/specification-agent/aprobadas/ (o docs/specs/).
  - Veredicto de S1: línea «Veredicto:» de qa/revision/informe-<spec_id>.md.
  - Cambio de SPEC: si su hash difiere de `spec_hash`, se invalidan revisión,
    oráculos y pruebas del módulo (análisis de impacto).
Oráculos, pruebas, implementación y humo siguen en pipeline.json (los marca
una persona con qa/scripts/marcar.py). Usa --sin-archivos para evaluar solo
pipeline.json (pruebas del propio orquestador).
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
PIPELINE = RAIZ / "pipeline.json"
ORDEN_MODULOS = [
    "identidad",
    "datos_simulados",
    "prevalidacion",
    "reservas",
    "notificaciones",
    "telegram",
    "web",
]
CARPETAS_SPEC = [
    Path("agentes-ia/salidas/specification-agent/aprobadas"),
    Path("docs/specs"),
]
MVP_MD = Path("docs/mvp.md")
REVISION = Path("qa/revision")


# ---------------------------------------------------------------- archivos

def cabecera_mvp(raiz: Path) -> dict:
    """Lee `estado:` y `aprobado_por:` de las primeras líneas de docs/mvp.md."""
    ruta = raiz / MVP_MD
    if not ruta.is_file():
        return {"existe": False, "estado": None, "aprobado_por": None}
    datos = {"existe": True, "estado": None, "aprobado_por": None}
    for linea in ruta.read_text(encoding="utf-8").splitlines()[:20]:
        m = re.match(r"^\s*(estado|aprobado_por)\s*:\s*(.*?)\s*$", linea)
        if m and datos[m.group(1)] is None:
            valor = m.group(2).strip().strip("`")
            datos[m.group(1)] = valor or None
    return datos


def _version(ruta: Path) -> tuple[int, int]:
    m = re.search(r"_v(\d+)\.(\d+)", ruta.name)
    return (int(m.group(1)), int(m.group(2))) if m else (0, 0)


def spec_aprobada(raiz: Path, spec_id: str) -> Path | None:
    """Última versión aprobada y congelada de la SPEC, o None."""
    candidatas: list[Path] = []
    for carpeta in CARPETAS_SPEC:
        base = raiz / carpeta
        if base.is_dir():
            candidatas += [p for p in base.glob(f"{spec_id}*.md") if "INCOMPLETA" not in p.name]
    aprobadas = [
        p for p in candidatas
        if re.search(r"^Estado:\s*Aprobada y congelada", p.read_text(encoding="utf-8", errors="replace"), re.M)
    ]
    return max(aprobadas, key=_version) if aprobadas else None


def hash_archivo(ruta: Path) -> str:
    return hashlib.sha256(ruta.read_bytes()).hexdigest()[:12]


def veredicto_informe(raiz: Path, spec_id: str) -> str | None:
    """Veredicto de la línea «Veredicto:» del informe de S1 (no de menciones sueltas)."""
    ruta = raiz / REVISION / f"informe-{spec_id}.md"
    if not ruta.is_file():
        return None
    m = re.search(r"^\s*[-*]?\s*Veredicto:\s*[*`]*\s*(APTA_CON_RESERVAS|NO_APTA|APTA)\b",
                  ruta.read_text(encoding="utf-8", errors="replace"), re.M)
    return m.group(1) if m else None


def reconciliar(pipeline: dict, raiz: Path) -> tuple[dict, list[str]]:
    """Devuelve el pipeline efectivo (los archivos mandan) y los avisos de discrepancia."""
    efectivo = copy.deepcopy(pipeline)
    avisos: list[str] = []

    mvp_md = cabecera_mvp(raiz)
    mvp = efectivo.setdefault("mvp", {})
    if not mvp_md["existe"]:
        avisos.append("No existe docs/mvp.md: la puerta del MVP queda cerrada.")
        mvp["aprobado_por"] = None
    else:
        aprobado = mvp_md["estado"] == "aprobado" and bool(mvp_md["aprobado_por"])
        if pipeline.get("mvp", {}).get("aprobado_por") and not aprobado:
            avisos.append(
                f"pipeline.json dice MVP aprobado por «{pipeline['mvp']['aprobado_por']}», pero "
                f"docs/mvp.md dice estado={mvp_md['estado'] or 'vacío'} y aprobado_por="
                f"{mvp_md['aprobado_por'] or 'vacío'}. Manda docs/mvp.md."
            )
        mvp["estado"] = mvp_md["estado"]
        mvp["aprobado_por"] = mvp_md["aprobado_por"] if aprobado else None

    for nombre, estado in efectivo.get("modulos", {}).items():
        original = pipeline.get("modulos", {}).get(nombre, {})
        spec_id = estado.get("spec_id")
        if not spec_id:
            if original.get("spec") == "aprobada":
                avisos.append(f"[{nombre}] marcado spec=aprobada sin spec_id: se trata como pendiente.")
            estado["spec"] = "pendiente"
            continue
        ruta = spec_aprobada(raiz, spec_id)
        if ruta is None:
            if original.get("spec") == "aprobada":
                avisos.append(f"[{nombre}] pipeline.json dice spec=aprobada, pero no hay {spec_id} "
                              "«Aprobada y congelada»: se trata como pendiente.")
            estado["spec"] = "pendiente"
            continue
        estado["spec"] = "aprobada"
        estado["spec_ruta"] = str(ruta.relative_to(raiz))
        actual = hash_archivo(ruta)
        guardado = original.get("spec_hash")
        if not guardado:
            avisos.append(f"[{nombre}] {spec_id} sin hash registrado. Fíjalo con: "
                          f"python3 qa/scripts/marcar.py hash {nombre}")
        elif guardado != actual:
            avisos.append(f"[{nombre}] {spec_id} cambió (hash {guardado} → {actual}): se invalidan "
                          "revisión, oráculos y pruebas. Analiza el impacto en qa/trazabilidad.md.")
            for campo in ("revision", "oraculos", "pruebas", "implementacion", "humo"):
                estado[campo] = "pendiente"
            continue
        veredicto = veredicto_informe(raiz, spec_id)
        if veredicto is None:
            if original.get("revision") in ("APTA", "APTA_CON_RESERVAS"):
                avisos.append(f"[{nombre}] pipeline.json dice revision={original['revision']}, pero no hay "
                              f"qa/revision/informe-{spec_id}.md con línea «Veredicto:».")
            estado["revision"] = "pendiente"
        elif veredicto != original.get("revision"):
            avisos.append(f"[{nombre}] revisión en pipeline.json={original.get('revision')}, en el informe="
                          f"{veredicto}. Manda el informe.")
            estado["revision"] = veredicto
    return efectivo, avisos


def cargar() -> dict:
    if not PIPELINE.is_file():
        sys.exit(f"No se encontró {PIPELINE}")
    try:
        return json.loads(PIPELINE.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        sys.exit(f"pipeline.json no es JSON válido: {exc}")


def ordenar_modulos(modulos: dict) -> list[str]:
    conocidos = [m for m in ORDEN_MODULOS if m in modulos]
    desconocidos = sorted(m for m in modulos if m not in ORDEN_MODULOS)
    return conocidos + desconocidos


def siguiente(pipeline: dict) -> list[dict]:
    acciones: list[dict] = []

    for escalado in pipeline.get("escalados", []):
        acciones.append(
            {
                "paso": "escalado",
                "modulo": escalado.get("modulo", "—"),
                "responsable": "persona",
                "accion": f"Resolver escalamiento: {escalado.get('motivo', escalado)}",
                "bloqueado_por": "iteraciones o desacuerdo",
            }
        )

    mvp = pipeline.get("mvp", {})
    if not mvp.get("aprobado_por"):
        acciones.append(
            {
                "paso": "mvp",
                "modulo": "—",
                "responsable": "Especificaciones → Arquitectura → persona",
                "accion": (
                    "Completar Requisitos y Corte técnico en docs/mvp.md, "
                    "cerrar la negociación (máx. 2 rondas) y que una persona "
                    "escriba aprobado_por."
                ),
                "bloqueado_por": "puerta humana: mvp.aprobado_por vacío",
            }
        )
        return acciones

    modulos = pipeline.get("modulos", {})
    if not modulos:
        acciones.append(
            {
                "paso": "registrar-modulos",
                "modulo": "—",
                "responsable": "persona / orquestador",
                "accion": (
                    "El MVP está aprobado. Registrar en pipeline.json los módulos "
                    "del Corte técnico, con su SPEC y estado inicial."
                ),
                "bloqueado_por": "modulos vacío",
            }
        )
        return acciones

    for nombre in ordenar_modulos(modulos):
        estado = modulos.get(nombre, {})
        iteraciones = pipeline.get("iteraciones", {}).get(nombre, 0)

        if iteraciones >= 3:
            acciones.append(
                {
                    "paso": "escalar",
                    "modulo": nombre,
                    "responsable": "persona",
                    "accion": "3 iteraciones sin progreso: detener y escalar.",
                    "bloqueado_por": "tope de iteraciones",
                }
            )
            continue

        if estado.get("spec") != "aprobada":
            acciones.append(
                {
                    "paso": "spec",
                    "modulo": nombre,
                    "responsable": "Especificaciones",
                    "accion": "Aprobar y congelar la SPEC del módulo.",
                    "bloqueado_por": "spec != aprobada",
                }
            )
            continue

        revision = estado.get("revision")
        if revision not in ("APTA", "APTA_CON_RESERVAS"):
            acciones.append(
                {
                    "paso": "S1",
                    "modulo": nombre,
                    "responsable": "S1 Revisor de SPEC",
                    "accion": "Ejecutar revisión estática y resolver hallazgos bloqueantes.",
                    "bloqueado_por": f"revision = {revision or 'pendiente'}",
                }
            )
            continue

        if estado.get("oraculos") != "aprobados":
            acciones.append(
                {
                    "paso": "S2",
                    "modulo": nombre,
                    "responsable": "S2 Diseñador de casos + persona",
                    "accion": (
                        "Diseñar TC y oráculos; una persona aprueba "
                        "qa/oraculos-pendientes.md."
                    ),
                    "bloqueado_por": f"oraculos = {estado.get('oraculos') or 'pendiente'}",
                }
            )
            continue

        if estado.get("pruebas") not in ("rojas", "verdes"):
            acciones.append(
                {
                    "paso": "S3",
                    "modulo": nombre,
                    "responsable": "S3 Generador de pruebas",
                    "accion": "Generar pruebas ejecutables que fallen primero.",
                    "bloqueado_por": f"pruebas = {estado.get('pruebas') or 'pendiente'}",
                }
            )
            continue

        if estado.get("implementacion") != "verde":
            acciones.append(
                {
                    "paso": "B1/B4",
                    "modulo": nombre,
                    "responsable": "B1 Servicios y API + B4 Ejecutor",
                    "accion": "Implementar el módulo y corregir hasta verde (máx. 3 iteraciones).",
                    "bloqueado_por": f"implementacion = {estado.get('implementacion') or 'pendiente'}",
                }
            )
            continue

        if estado.get("humo") != "verde":
            acciones.append(
                {
                    "paso": "R1",
                    "modulo": nombre,
                    "responsable": "R1 Pruebas de humo",
                    "accion": "Ejecutar humo del módulo en el entorno de prueba.",
                    "bloqueado_por": f"humo = {estado.get('humo') or 'pendiente'}",
                }
            )
            continue

    if not acciones:
        acciones.append(
            {
                "paso": "entrega",
                "modulo": "—",
                "responsable": "persona",
                "accion": (
                    "Todos los módulos en verde. Revisar la definición de terminado "
                    "(sección 9 del plan) y aprobar la entrega."
                ),
                "bloqueado_por": "puerta humana final",
            }
        )
    return acciones


def imprimir(pipeline: dict, acciones: list[dict], avisos: list[str] | None = None) -> None:
    mvp = pipeline.get("mvp", {})
    print("Pharma Express — estado del pipeline")
    print(f"  MVP: {mvp.get('estado', '—')} | ronda {mvp.get('ronda', 0)} | "
          f"aprobado_por: {mvp.get('aprobado_por') or 'PENDIENTE'}")
    print(f"  Módulos: {len(pipeline.get('modulos', {}))}")
    if avisos:
        print("\nAvisos (los archivos mandan sobre pipeline.json):")
        for aviso in avisos:
            print(f"  ! {aviso}")
    print("\nSiguiente:")
    for a in acciones:
        print(f"  [{a['modulo']}] {a['paso']} — {a['responsable']}")
        print(f"     {a['accion']}")
        if a.get("bloqueado_por"):
            print(f"     Bloqueado por: {a['bloqueado_por']}")
    print()


def main() -> int:
    global PIPELINE
    parser = argparse.ArgumentParser(description="Orquestador simple de Pharma Express.")
    parser.add_argument("--json", action="store_true", help="Salida JSON.")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Código 1 si el siguiente paso está bloqueado por una puerta humana o un tope.",
    )
    parser.add_argument(
        "--archivo",
        default=str(PIPELINE),
        help="Ruta alternativa de pipeline.json.",
    )
    parser.add_argument(
        "--sin-archivos",
        action="store_true",
        help="Evalúa solo pipeline.json, sin leer docs/mvp.md, SPEC ni informes (pruebas).",
    )
    args = parser.parse_args()

    PIPELINE = Path(args.archivo)
    pipeline = cargar()
    avisos: list[str] = []
    if not args.sin_archivos:
        pipeline, avisos = reconciliar(pipeline, RAIZ)
    acciones = siguiente(pipeline)

    if args.json:
        print(json.dumps({"pipeline": pipeline, "avisos": avisos, "siguiente": acciones},
                         ensure_ascii=False, indent=2))
    else:
        imprimir(pipeline, acciones, avisos)

    if args.check and any(
        a["paso"] in ("mvp", "escalado", "escalar") for a in acciones
    ):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
