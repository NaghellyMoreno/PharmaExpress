#!/usr/bin/env python3
"""Ejecuta B1 paso a paso para un módulo (por defecto identidad)."""
import subprocess, sys
from pathlib import Path

modulo = sys.argv[1] if len(sys.argv) > 1 else "identidad"
plan = f"docs/arquitectura/plan-{modulo}.md"
pasos = 8
for i in range(1, pasos + 1):
    peticion = f"Implementa el paso {i} del plan-{modulo}.md. Devuelve solo el código y archivos a crear/modificar."
    cmd = [sys.executable, "agentes-ia/agente.py", "backend-servicios-api", peticion, "--adjuntar", plan]
    print(f"\n===== PASO {i}/{pasos} =====")
    subprocess.run(cmd, cwd=Path(__file__).resolve().parent)
PY