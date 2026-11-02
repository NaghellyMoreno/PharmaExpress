#!/usr/bin/env python3
"""Bucle cíclico de Pharma Express.

Avanza el pipeline paso a paso con los agentes del repositorio (backend `api` de
qa/scripts/runner.py, que usa agentes-ia/herramientas.py y la API key de cada agente):

  - S1, S3 y R1 se marcan solos cuando el resultado es inequívoco.
  - B1/B4 itera: B1 implementa, el runner corre las pruebas y B4 corrige con la salida
    real, hasta verde o hasta 3 iteraciones; entonces escala a una persona.
  - Se detiene en cada puerta humana (MVP, SPEC, oráculos tras S2, escalados, entrega)
    y cuando un paso necesita que una persona revise y marque el resultado.

Uso:
    python3 ciclo.py            # hasta la próxima puerta humana
    python3 ciclo.py --max 40   # tope de pasos
"""
import argparse
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent


def main() -> int:
    parser = argparse.ArgumentParser(description="Ejecuta el pipeline hasta la próxima puerta humana.")
    parser.add_argument("--max", type=int, default=20, help="Tope de pasos (por defecto 20).")
    args = parser.parse_args()
    cmd = [sys.executable, str(RAIZ / "qa" / "scripts" / "runner.py"),
           "--seguir", "--backend", "api", "--auto-marcar", "--max-pasos", str(args.max)]
    return subprocess.run(cmd, cwd=RAIZ).returncode


if __name__ == "__main__":
    raise SystemExit(main())
