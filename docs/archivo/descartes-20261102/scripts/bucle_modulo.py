#!/usr/bin/env python3
"""Bucle B1->B4 para un módulo: corre tests, invoca B4 si fallan, hasta verde o 3 iteraciones."""
import subprocess, sys, time
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
MODULO = sys.argv[1] if len(sys.argv) > 1 else "identidad"

def run_tests():
    r = subprocess.run(["npm", "test", "--", f"modulos/{MODULO}"], cwd=RAIZ / "apps" / "api", capture_output=True, text=True)
    out = r.stdout + r.stderr
    passed = "Tests:" in out and "failed" not in out.lower().split("Tests:")[-1] if "Tests:" in out else False
    # heuristic: green if no "FAIL" and exit 0
    green = (r.returncode == 0) and ("FAIL" not in out)
    return green, out, r.returncode

iteracion = 0
while iteracion < 3:
    iteracion += 1
    print(f"\n===== ITERACIÓN {iteracion} ({MODULO}) =====")
    green, out, code = run_tests()
    print(out[-1500:])
    if green:
        print("\n[VERDE] Todas las pruebas pasan.")
        subprocess.run([sys.executable, "qa/scripts/marcar.py", "modulo", MODULO, "--implementacion", "verde"], cwd=RAIZ)
        break
    print(f"\n[ROJO] Tests fallaron (código {code}). Invocando B4...")
    subprocess.run([sys.executable, "agentes-ia/agente.py", "ejecutor-corrector", f"Ejecuta y corrige pruebas del módulo {MODULO}"], cwd=RAIZ)
    time.sleep(2)
else:
    print("\n[ESCALADO] 3 iteraciones sin pasar. Requiere intervención humana.")
PY