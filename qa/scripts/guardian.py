#!/usr/bin/env python3
"""Guardián mecánico de Pharma Express (sin LLM).

Convierte en comprobaciones las reglas del plan que no deben depender de que
un modelo obedezca su prompt:

  foto        Guarda el hash de los archivos protegidos (pruebas, qa/, SPEC
              aprobadas) antes de que corra un paso B1/B2/B3/B4.
  verificar   Después del paso: falla si cambió un archivo protegido o si el
              código de producción contiene trampas (valores de las pruebas,
              catch vacíos, comentarios «para que pase la prueba»).
  revisar     Solo el análisis del código, sin foto (útil a mano o en CI).
  rojas       Ejecuta Jest del módulo y comprueba que las pruebas fallan por
              aserción o por «No implementado», no porque la suite no compila.

Uso:
    python3 qa/scripts/guardian.py foto
    python3 qa/scripts/guardian.py verificar
    python3 qa/scripts/guardian.py revisar
    python3 qa/scripts/guardian.py rojas --modulo identidad

Código de salida: 0 si todo está bien; 1 si hay una violación.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FOTO = RAIZ / "qa" / "ejecuciones" / ".guardian-foto.json"
INFORMES = RAIZ / "qa" / "ejecuciones"
API = RAIZ / "apps" / "api"

# Archivos que B1-B4 nunca pueden tocar (B4 solo escribe qa/ejecuciones/ y trazabilidad).
PROTEGIDOS = [
    "apps/**/pruebas/**/*",
    "apps/**/*.spec.ts",
    "apps/**/*.test.ts",
    "apps/**/*.spec.tsx",
    "apps/**/*.test.tsx",
    "apps/**/e2e/**/*",
    "qa/casos/*",
    "qa/revision/*",
    "qa/oraculos-pendientes.md",
    "docs/specs/*",
    "agentes-ia/salidas/specification-agent/aprobadas/*",
]
IGNORAR_NOMBRES = {"desktop.ini"}

PATRON_PRUEBA = re.compile(r"(\.spec\.|\.test\.|/pruebas/|/e2e/)")
# Literales «sospechosos»: códigos/cédulas numéricos y ids sintéticos tipo `solicitud-1`.
LITERAL = re.compile(r"""['"`]((?:\d[\d.\-]{4,}\d)|(?:[a-z]+(?:-[a-z]+)*-\d+))['"`]""")
TRAMPAS = [
    (re.compile(r"catch\s*(\([^)]*\))?\s*\{\s*(//[^\n]*\s*|/\*.*?\*/\s*)*\}", re.S),
     "catch vacío (silencia errores)"),
    (re.compile(r"(para|por)\s+(cumplir|pasar|satisfacer)\s+(con\s+)?(el|la|los|las)?\s*(caso|prueba|test)", re.I),
     "comentario que adapta el código a la prueba"),
    (re.compile(r"(make|so)\s+(the\s+)?tests?\s+pass", re.I), "comentario que adapta el código a la prueba"),
    (re.compile(r"process\.env\.(NODE_ENV|JEST_WORKER_ID)\s*===?\s*['\"]test", re.I),
     "rama de código exclusiva para pruebas"),
]
TRAMPAS_PRUEBA = [
    (re.compile(r"\b(it|test|describe)\.(skip|only)\s*\("), "skip/only en una prueba"),
    (re.compile(r"\b(xit|xdescribe|fit|fdescribe)\s*\("), "prueba desactivada o enfocada"),
]


def archivos_protegidos() -> list[Path]:
    vistos: set[Path] = set()
    for patron in PROTEGIDOS:
        for p in RAIZ.glob(patron):
            if p.is_file() and p.name not in IGNORAR_NOMBRES and "node_modules" not in p.parts:
                vistos.add(p)
    return sorted(vistos)


def huella(p: Path) -> str:
    # Normaliza fin de línea para que copiar entre Windows y Linux no dispare falsos positivos.
    return hashlib.sha256(p.read_bytes().replace(b"\r\n", b"\n")).hexdigest()


def foto() -> int:
    datos = {str(p.relative_to(RAIZ)): huella(p) for p in archivos_protegidos()}
    FOTO.parent.mkdir(parents=True, exist_ok=True)
    FOTO.write_text(json.dumps({"fecha": datetime.now().isoformat(timespec="seconds"),
                                "archivos": datos}, indent=2), encoding="utf-8")
    print(f"Foto de {len(datos)} archivos protegidos → {FOTO.relative_to(RAIZ)}")
    return 0


def cambios_protegidos() -> list[str]:
    if not FOTO.is_file():
        return ["No hay foto previa: ejecuta `guardian.py foto` antes del paso B."]
    antes = json.loads(FOTO.read_text(encoding="utf-8"))["archivos"]
    ahora = {str(p.relative_to(RAIZ)): huella(p) for p in archivos_protegidos()}
    problemas = []
    for ruta in sorted(set(antes) | set(ahora)):
        if ruta not in ahora:
            problemas.append(f"archivo protegido eliminado: {ruta}")
        elif ruta not in antes:
            problemas.append(f"archivo protegido creado: {ruta}")
        elif antes[ruta] != ahora[ruta]:
            problemas.append(f"archivo protegido modificado: {ruta}")
    return problemas


def fuentes(prueba: bool) -> list[Path]:
    salida = []
    for base in (RAIZ / "apps").glob("*/src"):
        for p in base.rglob("*"):
            if p.suffix in (".ts", ".tsx") and "node_modules" not in p.parts:
                es_prueba = bool(PATRON_PRUEBA.search(p.as_posix()))
                if es_prueba == prueba:
                    salida.append(p)
    return salida


def linea_de(texto: str, pos: int) -> int:
    return texto.count("\n", 0, pos) + 1


def revisar_codigo() -> list[str]:
    problemas = []
    literales_prueba: set[str] = set()
    for p in fuentes(prueba=True):
        texto = p.read_text(encoding="utf-8", errors="replace")
        literales_prueba |= {m.group(1) for m in LITERAL.finditer(texto)}
        for patron, motivo in TRAMPAS_PRUEBA:
            for m in patron.finditer(texto):
                problemas.append(f"{motivo}: {p.relative_to(RAIZ)}:{linea_de(texto, m.start())}")
    for p in fuentes(prueba=False):
        texto = p.read_text(encoding="utf-8", errors="replace")
        rel = p.relative_to(RAIZ)
        for m in LITERAL.finditer(texto):
            if m.group(1) in literales_prueba:
                problemas.append(f"valor de prueba «{m.group(1)}» en código de producción: "
                                 f"{rel}:{linea_de(texto, m.start())}")
        for patron, motivo in TRAMPAS:
            for m in patron.finditer(texto):
                problemas.append(f"{motivo}: {rel}:{linea_de(texto, m.start())}")
    return problemas


def informe(titulo: str, problemas: list[str]) -> Path:
    sello = datetime.now().strftime("%Y%m%d-%H%M%S")
    ruta = INFORMES / f"guardian-{sello}.md"
    cuerpo = [f"# Guardián — {titulo}", "", f"Fecha: {sello}", "",
              "Clasificación: violación de reglas duras (plan §1.4 y §4 B4). Se escala a una persona.", ""]
    cuerpo += [f"- {p}" for p in problemas]
    cuerpo += ["", "Qué hacer: revisa el diff (`git diff`), revierte lo que viole las reglas y "
               "decide si la prueba es sospechosa (crear PREG) o si el código debe rehacerse."]
    ruta.write_text("\n".join(cuerpo) + "\n", encoding="utf-8")
    return ruta


def reportar(titulo: str, problemas: list[str]) -> int:
    if not problemas:
        print(f"Guardián ({titulo}): sin violaciones.")
        return 0
    print(f"Guardián ({titulo}): {len(problemas)} violación(es):")
    for p in problemas:
        print(f"  ✗ {p}")
    print(f"Informe: {informe(titulo, problemas).relative_to(RAIZ)}")
    return 1


def rojas(modulo: str) -> int:
    if not (API / "node_modules").is_dir():
        print("Faltan dependencias: ejecuta `npm install` en apps/api.")
        return 1
    npx = shutil.which("npx") or shutil.which("npx.cmd")
    if not npx:
        print("No se encontró npx.")
        return 1
    salida = INFORMES / f"jest-{modulo}-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    subprocess.run([npx, "jest", f"src/modulos/{modulo}", "--json", f"--outputFile={salida}"],
                   cwd=API, capture_output=True, text=True)
    if not salida.is_file():
        print("Jest no produjo resultado.")
        return 1
    datos = json.loads(salida.read_text(encoding="utf-8"))
    problemas, verdes, rojas_ok = [], [], 0
    for suite in datos.get("testResults", []):
        nombre = Path(suite["name"]).name
        if not suite.get("assertionResults") and suite.get("status") == "failed":
            msg = (suite.get("message") or "").strip().splitlines()
            problemas.append(f"{nombre}: la suite no se pudo ejecutar → {msg[0][:160] if msg else 'sin mensaje'}")
            continue
        for prueba in suite["assertionResults"]:
            if prueba["status"] == "passed":
                verdes.append(f"{nombre}: {prueba['title']}")
            elif prueba["status"] == "failed":
                texto = " ".join(prueba.get("failureMessages", []))
                if re.search(r"(SyntaxError|ReferenceError|Cannot find module|is not a function|TS\d{4})", texto) \
                        and "No implementado" not in texto:
                    problemas.append(f"{nombre}: «{prueba['title']}» falla por error técnico, no por aserción")
                else:
                    rojas_ok += 1
            else:
                problemas.append(f"{nombre}: «{prueba['title']}» está {prueba['status']} (skip/todo no permitido)")
    print(f"Jest {modulo}: {rojas_ok} rojas por la razón correcta, {len(verdes)} verdes, "
          f"{len(problemas)} con problema. Resultado: {salida.relative_to(RAIZ)}")
    for v in verdes:
        print(f"  · ya pasa (revisar si debía estar roja): {v}")
    return reportar(f"rojas {modulo}", problemas)


def main() -> int:
    parser = argparse.ArgumentParser(description="Guardián mecánico de reglas duras.")
    parser.add_argument("accion", choices=["foto", "verificar", "revisar", "rojas"])
    parser.add_argument("--modulo", help="Módulo para `rojas`.")
    args = parser.parse_args()
    if args.accion == "foto":
        return foto()
    if args.accion == "verificar":
        return reportar("verificar", cambios_protegidos() + revisar_codigo())
    if args.accion == "revisar":
        return reportar("revisar", revisar_codigo())
    if not args.modulo:
        sys.exit("`rojas` requiere --modulo.")
    return rojas(args.modulo)


if __name__ == "__main__":
    raise SystemExit(main())
