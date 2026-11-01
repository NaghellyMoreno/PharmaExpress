#!/usr/bin/env python3
"""Prueba mecánica de todo el andamiaje de agentes de Pharma Express.

No llama a ningún LLM y no modifica el repositorio: comprueba que los archivos,
los skills, el lint y la máquina de estados del orquestador funcionan.

Uso:
    python3 qa/scripts/probar_todo.py
    python3 qa/scripts/probar_todo.py --verbose

Código de salida: 0 si todo pasa, 1 si algo falla.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
AGENTES = RAIZ / ".claude" / "agents"
SKILLS = RAIZ / ".claude" / "skills"
MVP = RAIZ / "docs" / "mvp.md"
PIPELINE = RAIZ / "pipeline.json"
ORQUESTADOR = RAIZ / "orquestador.py"
LINT = RAIZ / "qa" / "scripts" / "lint_spec.py"
SPEC_MUESTRA = RAIZ / "PHARMA_EXPRESS_SPEC-1.md"

resultados: list[tuple[bool, str, str]] = []


def anotar(ok: bool, nombre: str, detalle: str = "") -> None:
    resultados.append((ok, nombre, detalle))


def leer_frontmatter(path: Path) -> dict[str, str]:
    texto = path.read_text(encoding="utf-8")
    m = re.match(r"^---\r?\n(.*?)\r?\n---", texto, re.S)
    if not m:
        return {}
    datos: dict[str, str] = {}
    for linea in m.group(1).splitlines():
        if ":" in linea:
            clave, valor = linea.split(":", 1)
            datos[clave.strip()] = valor.strip()
    return datos


def compilar_python() -> None:
    archivos = [
        ORQUESTADOR,
        RAIZ / "agentes-ia" / "agente.py",
        LINT,
        RAIZ / "qa" / "scripts" / "marcar.py",
        RAIZ / "qa" / "scripts" / "runner.py",
        RAIZ / "qa" / "scripts" / "guardian.py",
    ]
    fallos = []
    for path in archivos:
        try:
            compile(path.read_text(encoding="utf-8"), str(path), "exec")
        except SyntaxError as exc:
            fallos.append(f"{path.relative_to(RAIZ)}: {exc}")
    anotar(not fallos, "Sintaxis Python", "; ".join(fallos) or f"{len(archivos)} archivos compilan")


def revisar_agentes() -> None:
    archivos = sorted(AGENTES.glob("*.md"))
    fallos = []
    for path in archivos:
        fm = leer_frontmatter(path)
        if not fm.get("name"):
            fallos.append(f"{path.name}: sin name")
        elif fm["name"] != path.stem:
            fallos.append(f"{path.name}: name={fm['name']}")
        if not fm.get("description"):
            fallos.append(f"{path.name}: sin description")
    anotar(not fallos, "Agentes", "; ".join(fallos) or f"{len(archivos)} agentes con frontmatter")


def revisar_skills() -> None:
    archivos = sorted(SKILLS.glob("*/SKILL.md"))
    fallos = []
    for path in archivos:
        fm = leer_frontmatter(path)
        carpeta = path.parent.name
        if not fm.get("name"):
            fallos.append(f"{carpeta}: sin name")
        elif fm["name"] != carpeta:
            fallos.append(f"{carpeta}: name={fm['name']}")
        if not fm.get("description"):
            fallos.append(f"{carpeta}: sin description")
    anotar(not fallos, "Skills", "; ".join(fallos) or f"{len(archivos)} skills con frontmatter")


def revisar_mvp() -> None:
    texto = MVP.read_text(encoding="utf-8")
    requeridos = [
        "## Requisitos            (dueño: Especificaciones)",
        "## Corte técnico         (dueño: Arquitectura)",
        "## Observaciones",
        "## Registro de decisiones",
    ]
    faltan = [h for h in requeridos if h not in texto]
    anotar(not faltan, "docs/mvp.md", "faltan: " + ", ".join(faltan) if faltan else "secciones y dueños correctos")


def revisar_pipeline() -> None:
    try:
        datos = json.loads(PIPELINE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        anotar(False, "pipeline.json", str(exc))
        return
    faltan = [k for k in ("mvp", "modulos", "iteraciones", "escalados") if k not in datos]
    anotar(not faltan, "pipeline.json", "faltan claves: " + ", ".join(faltan) if faltan else "JSON válido")


def revisar_lint() -> None:
    if not SPEC_MUESTRA.is_file():
        anotar(False, "Lint de SPEC", f"no existe {SPEC_MUESTRA.name}")
        return
    proc = subprocess.run(
        [sys.executable, str(LINT), "--json", str(SPEC_MUESTRA)],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        anotar(False, "Lint de SPEC", proc.stderr.strip() or "el lint falló")
        return
    try:
        datos = json.loads(proc.stdout)
        hallazgos = sum(len(r.get("hallazgos", [])) for r in datos)
    except json.JSONDecodeError as exc:
        anotar(False, "Lint de SPEC", f"salida no es JSON: {exc}")
        return
    anotar(True, "Lint de SPEC", f"{SPEC_MUESTRA.name}: {hallazgos} hallazgos mecánicos")


def cargar_orquestador():
    spec = importlib.util.spec_from_file_location("orquestador", ORQUESTADOR)
    if spec is None or spec.loader is None:
        raise RuntimeError("No se pudo cargar orquestador.py")
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo


def pipeline_base(mvp_aprobado: bool = True, modulo: dict | None = None,
                  iteraciones: dict | None = None,
                  escalados: list | None = None) -> dict:
    datos = {
        "mvp": {"aprobado_por": "persona" if mvp_aprobado else None},
        "modulos": {},
        "iteraciones": iteraciones or {},
        "escalados": escalados or [],
    }
    if modulo is not None:
        datos["modulos"]["identidad"] = modulo
    return datos


def revisar_maquina_de_estados() -> None:
    orquestador = cargar_orquestador()
    casos = [
        ("MVP sin aprobar", pipeline_base(mvp_aprobado=False), "mvp"),
        ("MVP aprobado, sin módulos", pipeline_base(), "registrar-modulos"),
        ("SPEC pendiente", pipeline_base(modulo={"spec": "borrador"}), "spec"),
        ("S1 pendiente", pipeline_base(modulo={"spec": "aprobada"}), "S1"),
        ("S1 NO_APTA", pipeline_base(modulo={"spec": "aprobada", "revision": "NO_APTA"}), "S1"),
        ("S2 pendiente", pipeline_base(modulo={"spec": "aprobada", "revision": "APTA"}), "S2"),
        ("S3 pendiente", pipeline_base(modulo={"spec": "aprobada", "revision": "APTA",
                                               "oraculos": "aprobados"}), "S3"),
        ("B1/B4 pendiente", pipeline_base(modulo={"spec": "aprobada", "revision": "APTA",
                                                   "oraculos": "aprobados",
                                                   "pruebas": "rojas"}), "B1/B4"),
        ("R1 pendiente", pipeline_base(modulo={"spec": "aprobada", "revision": "APTA",
                                                "oraculos": "aprobados", "pruebas": "rojas",
                                                "implementacion": "verde"}), "R1"),
        ("Entrega", pipeline_base(modulo={"spec": "aprobada", "revision": "APTA",
                                           "oraculos": "aprobados", "pruebas": "verdes",
                                           "implementacion": "verde", "humo": "verde"}), "entrega"),
        ("3 iteraciones", pipeline_base(modulo={"spec": "aprobada"}, iteraciones={"identidad": 3}), "escalar"),
        ("Escalado global", pipeline_base(escalados=[{"modulo": "identidad", "motivo": "prueba"}]), "escalado"),
    ]
    fallos = []
    for nombre, datos, esperado in casos:
        obtenido = orquestador.siguiente(datos)[0]["paso"]
        if obtenido != esperado:
            fallos.append(f"{nombre}: esperaba {esperado}, obtuve {obtenido}")
    anotar(not fallos, "Máquina de estados", "; ".join(fallos) or f"{len(casos)} transiciones correctas")


def revisar_check_cli() -> None:
    orquestador = cargar_orquestador()
    casos = [
        ("bloqueado por MVP", pipeline_base(mvp_aprobado=False), 1),
        ("todo en verde", pipeline_base(modulo={"spec": "aprobada", "revision": "APTA",
                                                 "oraculos": "aprobados", "pruebas": "verdes",
                                                 "implementacion": "verde", "humo": "verde"}), 0),
    ]
    fallos = []
    with tempfile.TemporaryDirectory() as tmp:
        for nombre, datos, esperado in casos:
            archivo = Path(tmp) / "pipeline.json"
            archivo.write_text(json.dumps(datos), encoding="utf-8")
            proc = subprocess.run(
                [sys.executable, str(ORQUESTADOR), "--archivo", str(archivo), "--check", "--sin-archivos"],
                capture_output=True,
                text=True,
            )
            if proc.returncode != esperado:
                fallos.append(f"{nombre}: esperaba {esperado}, obtuve {proc.returncode}")
    anotar(not fallos, "orquestador --check", "; ".join(fallos) or "códigos de salida correctos")


def revisar_reconciliacion() -> None:
    """Los archivos mandan: un pipeline.json «aprobado» no abre puertas que los archivos cierran."""
    orquestador = cargar_orquestador()
    fallos = []
    with tempfile.TemporaryDirectory() as tmp:
        raiz = Path(tmp)
        (raiz / "docs").mkdir()
        (raiz / "qa" / "revision").mkdir(parents=True)
        aprobadas = raiz / "agentes-ia" / "salidas" / "specification-agent" / "aprobadas"
        aprobadas.mkdir(parents=True)
        mvp = raiz / "docs" / "mvp.md"
        mvp.write_text("# MVP\nestado: borrador\naprobado_por: \n", encoding="utf-8")
        falso = {"mvp": {"aprobado_por": "alguien"},
                 "modulos": {"identidad": {"spec_id": "SPEC-001", "spec": "aprobada", "revision": "APTA",
                                           "oraculos": "aprobados", "pruebas": "rojas"}},
                 "iteraciones": {}, "escalados": []}
        ef, _ = orquestador.reconciliar(falso, raiz)
        if orquestador.siguiente(ef)[0]["paso"] != "mvp":
            fallos.append("MVP en borrador no cierra la puerta")
        mvp.write_text("# MVP\nestado: aprobado\naprobado_por: Persona\n", encoding="utf-8")
        ef, _ = orquestador.reconciliar(falso, raiz)
        if orquestador.siguiente(ef)[0]["paso"] != "spec":
            fallos.append("SPEC sin archivo aprobado no detiene el módulo")
        spec = aprobadas / "SPEC-001_v1.0.md"
        spec.write_text("# SPEC-001. X - Versión 1.0\nEstado: Aprobada y congelada\n", encoding="utf-8")
        (raiz / "qa" / "revision" / "informe-SPEC-001.md").write_text(
            "Veredicto: APTA\n\nEl informe previo fue NO_APTA.\n", encoding="utf-8")
        falso["modulos"]["identidad"]["spec_hash"] = orquestador.hash_archivo(spec)
        ef, _ = orquestador.reconciliar(falso, raiz)
        if orquestador.siguiente(ef)[0]["paso"] != "B1/B4":
            fallos.append("con todo en orden no habilita B1/B4 (o leyó mal el veredicto)")
        spec.write_text("# SPEC-001. X - Versión 1.0\nEstado: Aprobada y congelada\ncambio\n", encoding="utf-8")
        ef, avisos = orquestador.reconciliar(falso, raiz)
        if orquestador.siguiente(ef)[0]["paso"] != "S1":
            fallos.append("un cambio de SPEC no invalida la revisión")
    anotar(not fallos, "Reconciliación con archivos", "; ".join(fallos) or "4 casos correctos")


def revisar_guardian() -> None:
    spec = importlib.util.spec_from_file_location("guardian", RAIZ / "qa" / "scripts" / "guardian.py")
    g = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(g)
    casos = [
        ("if (codigo === '741203') return true;", "'741203'", True),
        ("try { x(); } catch (e) {\n  // ignore\n}", None, True),
        ("// Para cumplir con el caso de prueba", None, True),
        ("const vigencia = 10 * 60 * 1000;", None, False),
    ]
    fallos = []
    for codigo, literal, espera in casos:
        hay = bool(literal and g.LITERAL.search(literal)) or any(p.search(codigo) for p, _ in g.TRAMPAS)
        if hay != espera:
            fallos.append(f"«{codigo[:30]}»: esperaba {espera}")
    if not g.TRAMPAS_PRUEBA[0][0].search("it.skip('x', () => {})"):
        fallos.append("no detecta it.skip")
    anotar(not fallos, "Guardián", "; ".join(fallos) or "detecta valores de prueba, catch vacío, comentarios y skip")


def revisar_runner() -> None:
    proc = subprocess.run(
        [sys.executable, str(RAIZ / "qa" / "scripts" / "runner.py"), "--estado"],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        anotar(False, "Runner", proc.stderr.strip() or f"código {proc.returncode}")
        return
    if "Siguiente paso" not in proc.stdout:
        anotar(False, "Runner", "no muestra el siguiente paso")
        return
    anotar(True, "Runner", "detecta backend y muestra el siguiente paso")


def main() -> int:
    parser = argparse.ArgumentParser(description="Prueba mecánica del andamiaje.")
    parser.add_argument("--verbose", action="store_true", help="Muestra el detalle de cada prueba.")
    args = parser.parse_args()

    compilar_python()
    revisar_agentes()
    revisar_skills()
    revisar_mvp()
    revisar_pipeline()
    revisar_lint()
    revisar_maquina_de_estados()
    revisar_check_cli()
    revisar_reconciliacion()
    revisar_guardian()
    revisar_runner()

    print("Pharma Express — prueba mecánica del andamiaje\n")
    for ok, nombre, detalle in resultados:
        marca = "OK  " if ok else "FALLA"
        print(f"  [{marca}] {nombre}" + (f" — {detalle}" if detalle and (args.verbose or not ok) else ""))

    fallos = sum(1 for ok, _, _ in resultados if not ok)
    print(f"\n{len(resultados) - fallos}/{len(resultados)} pruebas pasaron.")
    if fallos:
        print("Revisa los detalles con --verbose.")
        return 1
    print("Andamiaje consistente. Los agentes concretos se prueban aparte (ver docs/COMO-PROBAR.md).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
