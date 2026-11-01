#!/usr/bin/env python3
"""Marca el estado del pipeline sin editar pipeline.json a mano.

No ejecuta agentes: solo actualiza el estado y valida los valores permitidos.
Después de marcar, corre `python3 orquestador.py` para ver el siguiente paso.

Uso:
    python3 qa/scripts/marcar.py mostrar
    python3 qa/scripts/marcar.py mvp --estado aprobado --aprobado-por "Nombre"
    python3 qa/scripts/marcar.py modulo identidad --spec aprobada
    python3 qa/scripts/marcar.py modulo identidad --revision APTA
    python3 qa/scripts/marcar.py modulo identidad --oraculos aprobados
    python3 qa/scripts/marcar.py modulo identidad --pruebas rojas
    python3 qa/scripts/marcar.py modulo identidad --implementacion verde
    python3 qa/scripts/marcar.py modulo identidad --humo verde
    python3 qa/scripts/marcar.py iteracion identidad
    python3 qa/scripts/marcar.py escalar identidad "3 intentos sin progreso"
    python3 qa/scripts/marcar.py modulo reservas --spec-id SPEC-004
    python3 qa/scripts/marcar.py hash identidad      # fija el hash de la SPEC aprobada

Nota: la puerta del MVP, la SPEC aprobada y el veredicto de S1 se leen de los
archivos (ver orquestador.py). `mvp --aprobado-por` y `--spec`/`--revision`
solo dejan constancia en pipeline.json; no abren ninguna puerta por sí solos.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
PIPELINE = RAIZ / "pipeline.json"

VALORES = {
    "mvp_estado": {"borrador", "en_negociacion", "aprobado"},
    "spec": {"pendiente", "borrador", "candidata", "aprobada"},
    "revision": {"pendiente", "APTA", "APTA_CON_RESERVAS", "NO_APTA"},
    "oraculos": {"pendiente", "aprobados"},
    "pruebas": {"pendiente", "rojas", "verdes"},
    "implementacion": {"pendiente", "en_curso", "verde"},
    "humo": {"pendiente", "en_curso", "verde", "fallido"},
}


def cargar(path: Path) -> dict:
    if not path.is_file():
        sys.exit(f"No existe {path}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        sys.exit(f"{path} no es JSON válido: {exc}")


def guardar(path: Path, datos: dict) -> None:
    datos["actualizado"] = date.today().isoformat()
    temporal = path.with_suffix(".tmp")
    temporal.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporal.replace(path)


def escribir_cabecera_mvp(datos: dict) -> None:
    """Refleja estado, aprobado_por y hash_specs en la cabecera de docs/mvp.md (fuente de verdad)."""
    import hashlib
    import re
    sys.path.insert(0, str(RAIZ))
    import orquestador  # noqa: E402

    ruta = RAIZ / "docs" / "mvp.md"
    if not ruta.is_file():
        sys.exit("No existe docs/mvp.md")
    mvp = datos.get("mvp", {})
    rutas = []
    for mod in datos.get("modulos", {}).values():
        if mod.get("spec_id"):
            r = orquestador.spec_aprobada(RAIZ, mod["spec_id"])
            if r:
                rutas.append(r)
    h = hashlib.sha256(b"".join(r.read_bytes() for r in sorted(rutas))).hexdigest()[:12] if rutas else "pendiente"
    mvp["hash_specs"] = h
    valores = {"estado": mvp.get("estado") or "borrador",
               "aprobado_por": mvp.get("aprobado_por") or "",
               "hash_specs": h}
    lineas = ruta.read_text(encoding="utf-8").splitlines()
    for i, linea in enumerate(lineas[:20]):
        m = re.match(r"^(estado|aprobado_por|hash_specs)\s*:", linea)
        if m:
            lineas[i] = f"{m.group(1)}: {valores[m.group(1)]}".rstrip()
    ruta.write_text("\n".join(lineas) + "\n", encoding="utf-8")
    print(f"docs/mvp.md: estado={valores['estado']} aprobado_por={valores['aprobado_por'] or '—'} hash_specs={h}")


def validar(campo: str, valor: str) -> str:
    permitidos = VALORES[campo]
    if valor not in permitidos:
        sys.exit(f"Valor inválido para {campo}: «{valor}». Permitidos: {', '.join(sorted(permitidos))}")
    return valor


def modulo(datos: dict, nombre: str) -> dict:
    return datos.setdefault("modulos", {}).setdefault(
        nombre,
        {
            "spec": "pendiente",
            "revision": "pendiente",
            "oraculos": "pendiente",
            "pruebas": "pendiente",
            "implementacion": "pendiente",
            "humo": "pendiente",
        },
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Marca el estado del pipeline.")
    parser.add_argument("--archivo", default=str(PIPELINE), help="Ruta alternativa de pipeline.json.")
    sub = parser.add_subparsers(dest="comando", required=True)

    p_mostrar = sub.add_parser("mostrar", help="Imprime el pipeline actual.")
    p_mostrar.set_defaults(func=lambda d, a: None)

    p_mvp = sub.add_parser("mvp", help="Actualiza el estado del MVP.")
    p_mvp.add_argument("--estado", choices=sorted(VALORES["mvp_estado"]))
    p_mvp.add_argument("--aprobado-por", dest="aprobado_por")
    p_mvp.add_argument("--ronda", type=int)

    p_mod = sub.add_parser("modulo", help="Actualiza el estado de un módulo.")
    p_mod.add_argument("nombre")
    for campo in ("spec", "revision", "oraculos", "pruebas", "implementacion", "humo"):
        p_mod.add_argument(f"--{campo}", choices=sorted(VALORES[campo]))

    p_mod.add_argument("--spec-id", dest="spec_id", help="SPEC del módulo, p. ej. SPEC-004.")

    p_hash = sub.add_parser("hash", help="Registra el hash de la SPEC aprobada del módulo.")
    p_hash.add_argument("nombre")

    p_it = sub.add_parser("iteracion", help="Suma una iteración de corrección a un módulo.")
    p_it.add_argument("nombre")

    p_esc = sub.add_parser("escalar", help="Registra un escalamiento.")
    p_esc.add_argument("nombre")
    p_esc.add_argument("motivo")

    p_res = sub.add_parser("resolver-escalado", help="Quita el escalamiento de un módulo.")
    p_res.add_argument("nombre")

    args = parser.parse_args()
    path = Path(args.archivo)
    datos = cargar(path)

    if args.comando == "mostrar":
        print(json.dumps(datos, ensure_ascii=False, indent=2))
        return 0

    if args.comando == "mvp":
        mvp = datos.setdefault("mvp", {})
        if args.estado:
            mvp["estado"] = validar("mvp_estado", args.estado)
        if args.ronda is not None:
            mvp["ronda"] = args.ronda
        if args.aprobado_por is not None:
            if not args.aprobado_por.strip():
                sys.exit("--aprobado-por no puede estar vacío")
            mvp["aprobado_por"] = args.aprobado_por.strip()
        if mvp.get("estado") == "aprobado" and not mvp.get("aprobado_por"):
            sys.exit("Un MVP aprobado necesita --aprobado-por con el nombre de la persona.")
        if path == PIPELINE:
            escribir_cabecera_mvp(datos)

    elif args.comando == "modulo":
        campos = {
            "spec": args.spec,
            "revision": args.revision,
            "oraculos": args.oraculos,
            "pruebas": args.pruebas,
            "implementacion": args.implementacion,
            "humo": args.humo,
        }
        campos = {k: validar(k, v) for k, v in campos.items() if v is not None}
        if args.spec_id:
            if not __import__("re").fullmatch(r"SPEC-\d{3}", args.spec_id):
                sys.exit("--spec-id debe tener la forma SPEC-00x")
            campos["spec_id"] = args.spec_id
        if not campos:
            sys.exit("Indica al menos un campo: --spec-id, --spec, --revision, --oraculos, --pruebas, --implementacion o --humo.")
        modulo(datos, args.nombre).update(campos)

    elif args.comando == "hash":
        sys.path.insert(0, str(RAIZ))
        import orquestador  # noqa: E402
        mod = datos.get("modulos", {}).get(args.nombre)
        if not mod or not mod.get("spec_id"):
            sys.exit(f"El módulo {args.nombre} no tiene spec_id.")
        ruta = orquestador.spec_aprobada(RAIZ, mod["spec_id"])
        if ruta is None:
            sys.exit(f"No hay {mod['spec_id']} aprobada y congelada: no se fija hash.")
        mod["spec_hash"] = orquestador.hash_archivo(ruta)
        print(f"{args.nombre}: {ruta.relative_to(RAIZ)} → {mod['spec_hash']}")

    elif args.comando == "iteracion":
        iteraciones = datos.setdefault("iteraciones", {})
        iteraciones[args.nombre] = iteraciones.get(args.nombre, 0) + 1
        print(f"{args.nombre}: iteración {iteraciones[args.nombre]}")

    elif args.comando == "escalar":
        datos.setdefault("escalados", []).append(
            {"modulo": args.nombre, "motivo": args.motivo, "fecha": date.today().isoformat()}
        )

    elif args.comando == "resolver-escalado":
        antes = len(datos.get("escalados", []))
        datos["escalados"] = [
            e for e in datos.get("escalados", []) if e.get("modulo") != args.nombre
        ]
        print(f"Escalamientos de {args.nombre}: {antes - len(datos['escalados'])} resueltos")

    guardar(path, datos)
    print(f"Actualizado {path}")
    print("Siguiente paso: python3 orquestador.py" + ("" if path == PIPELINE else f" --archivo {path}"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
