#!/usr/bin/env python3
"""Lint barato de SPECs de Pharma Express (sin LLM).

Comprueba lo mecánico que S1 no debería gastar en razonar:
  - RF/BR/CL sin AC en la sección de trazabilidad.
  - AC que no siguen Dado / Cuando / Entonces.
  - Palabras vagas en requisitos, reglas o criterios.
  - Límites numéricos sin un AC que los mencione.
  - AC huérfanos (no referenciados por ningún RF/BR).

Uso:
    python qa/scripts/lint_spec.py agentes-ia/salidas/specification-agent/aprobadas/SPEC-001_v1.1.md
    python qa/scripts/lint_spec.py agentes-ia/salidas/specification-agent/aprobadas/
    python qa/scripts/lint_spec.py --strict agentes-ia/salidas/specification-agent/aprobadas/SPEC-001_v1.1.md
    python qa/scripts/lint_spec.py --json agentes-ia/salidas/specification-agent/aprobadas/SPEC-001_v1.1.md

Salida: informe legible. Con --strict, código 1 si hay hallazgos bloqueantes.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

DEFINICION = re.compile(
    r"^\s*[-*]\s*(?P<tipo>REQ|RF|BR|RNF|CL|AC)-(?P<num>\d{3})\.\s*(?P<texto>.+)$"
)
AC_GWT = re.compile(
    r"\b(?:dado|dada)\b.*\bcu[aá]n(?:do|to)\b.*\bentonces\b",
    re.IGNORECASE | re.DOTALL,
)
PALABRAS_VAGAS = [
    "rápido", "rápida", "adecuado", "adecuada", "fácil", "amigable",
    "óptimo", "óptima", "eficiente", "según corresponda", "y demás",
    "entre otros", "etc.", "lo antes posible", "suficiente",
]
LIMITE = re.compile(
    r"\b(\d{1,4})\s*(unidades?|minutos?|min|horas?|días?|dias?|intentos?|meses)\b",
    re.IGNORECASE,
)
SECCION_TRAZABILIDAD = re.compile(
    r"^#{1,4}\s*16\.?\s*Trazabilidad.*?$", re.IGNORECASE | re.MULTILINE
)
SECCION_SIGUIENTE = re.compile(
    r"^#{1,4}\s*17\.?\s*Historial.*?$", re.IGNORECASE | re.MULTILINE
)


def leer(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="utf-8", errors="replace")


def extraer_definiciones(texto: str):
    definiciones = []
    for n, linea in enumerate(texto.splitlines(), start=1):
        m = DEFINICION.match(linea)
        if m:
            definiciones.append(
                {
                    "tipo": m.group("tipo"),
                    "id": f"{m.group('tipo')}-{m.group('num')}",
                    "texto": m.group("texto").strip(),
                    "linea": n,
                }
            )
    return definiciones


def extraer_trazabilidad(texto: str):
    """Devuelve {RF/BR/CL/REQ: set(AC)} a partir de la sección 16."""
    inicio = SECCION_TRAZABILIDAD.search(texto)
    if not inicio:
        return None
    fin = SECCION_SIGUIENTE.search(texto, pos=inicio.end())
    seccion = texto[inicio.end(): fin.start() if fin else len(texto)]
    mapa = {}
    for linea in seccion.splitlines():
        ids = re.findall(r"\b(REQ|RF|BR|CL)-(\d{3})\b", linea)
        acs = re.findall(r"\bAC-(\d{3})\b", linea)
        if not ids or not acs:
            continue
        for tipo, num in ids:
            mapa.setdefault(f"{tipo}-{num}", set()).update(f"AC-{a}" for a in acs)
    return mapa


def revisar(path: Path):
    texto = leer(path)
    definiciones = extraer_definiciones(texto)
    por_tipo = {}
    for d in definiciones:
        por_tipo.setdefault(d["tipo"], []).append(d)

    hallazgos = []

    def add(severidad, tipo, linea, id_, mensaje, cita):
        hallazgos.append(
            {
                "severidad": severidad,
                "tipo": tipo,
                "linea": linea,
                "id": id_,
                "mensaje": mensaje,
                "cita": cita,
            }
        )

    # 1. AC con formato Dado/Cuando/Entonces
    for ac in por_tipo.get("AC", []):
        if not AC_GWT.search(ac["texto"]):
            add(
                "bloqueante",
                "formato-AC",
                ac["linea"],
                ac["id"],
                "El AC no sigue el formato Dado / Cuando / Entonces.",
                ac["texto"][:180],
            )

    # 2. Trazabilidad RF/BR/CL/REQ -> AC
    traza = extraer_trazabilidad(texto)
    if traza is None:
        add(
            "bloqueante",
            "trazabilidad",
            1,
            "—",
            "No se encontró la sección 16. Trazabilidad.",
            "",
        )
        traza = {}

    for tipo in ("REQ", "RF", "BR", "CL"):
        for d in por_tipo.get(tipo, []):
            if not traza.get(d["id"]):
                add(
                    "bloqueante",
                    "trazabilidad",
                    d["linea"],
                    d["id"],
                    f"{d['id']} no tiene un AC asociado en la sección 16.",
                    d["texto"][:180],
                )

    # 3. AC huérfanos
    acs_referenciados = {ac for acs in traza.values() for ac in acs}
    for ac in por_tipo.get("AC", []):
        if ac["id"] not in acs_referenciados:
            add(
                "menor",
                "trazabilidad",
                ac["linea"],
                ac["id"],
                "AC no referenciado por ningún RF/BR/CL en la sección 16.",
                ac["texto"][:180],
            )

    # 4. Palabras vagas
    for d in definiciones:
        bajo = d["texto"].lower()
        for palabra in PALABRAS_VAGAS:
            if palabra in bajo:
                add(
                    "menor",
                    "ambiguedad",
                    d["linea"],
                    d["id"],
                    f"Término vago: «{palabra}».",
                    d["texto"][:180],
                )

    # 5. Límites numéricos sin AC que los mencione
    textos_ac = " ".join(ac["texto"] for ac in por_tipo.get("AC", []))
    vistos = set()
    for n, linea in enumerate(texto.splitlines(), start=1):
        for m in LIMITE.finditer(linea):
            valor = m.group(1)
            if valor in vistos:
                continue
            vistos.add(valor)
            if not re.search(rf"\b{re.escape(valor)}\b", textos_ac):
                add(
                    "aviso",
                    "limite",
                    n,
                    "—",
                    f"Límite «{m.group(0)}» sin un AC que lo mencione; revisar debajo, en el límite y por encima.",
                    linea.strip()[:180],
                )

    conteo = {
        tipo: len(por_tipo.get(tipo, []))
        for tipo in ("REQ", "RF", "BR", "RNF", "CL", "AC")
    }
    return {"archivo": str(path), "conteo": conteo, "hallazgos": hallazgos}


def imprimir(resultado):
    c = resultado["conteo"]
    print(f"\n{resultado['archivo']}")
    print(
        "  Definiciones: "
        + ", ".join(f"{k} {v}" for k, v in c.items() if v)
        + ("" if any(c.values()) else "ninguna")
    )
    if not resultado["hallazgos"]:
        print("  Sin hallazgos mecánicos. Falta la revisión de juicio de S1.")
        return
    print(f"  Hallazgos mecánicos: {len(resultado['hallazgos'])}")
    for h in resultado["hallazgos"]:
        cita = f" | «{h['cita']}»" if h["cita"] else ""
        print(
            f"  [{h['severidad'].upper()}] línea {h['linea']} {h['id']} "
            f"({h['tipo']}): {h['mensaje']}{cita}"
        )


def recolectar(rutas):
    archivos = []
    for ruta in rutas:
        p = Path(ruta)
        if p.is_dir():
            archivos.extend(sorted(p.glob("*.md")))
        elif p.is_file():
            archivos.append(p)
        else:
            print(f"No existe: {ruta}", file=sys.stderr)
    return [a for a in archivos if a.name.lower() != "leeme.md"]


def main():
    parser = argparse.ArgumentParser(description="Lint mecánico de SPECs.")
    parser.add_argument("rutas", nargs="+", help="Archivos o carpetas de SPECs.")
    parser.add_argument("--json", action="store_true", help="Salida JSON.")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Código 1 si hay hallazgos bloqueantes.",
    )
    args = parser.parse_args()

    resultados = [revisar(a) for a in recolectar(args.rutas)]
    if args.json:
        print(json.dumps(resultados, ensure_ascii=False, indent=2))
    else:
        for r in resultados:
            imprimir(r)

    bloqueantes = sum(
        1
        for r in resultados
        for h in r["hallazgos"]
        if h["severidad"] == "bloqueante"
    )
    if args.strict and bloqueantes:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
