# Descartes del 2026-11-02

Archivos sacados del árbol activo porque rompían la compilación, el pipeline o el stack aprobado. Se guardan aquí (no se borraron) por si alguien quiere recuperar una idea. Nada de esta carpeta lo leen Jest, el orquestador ni el runner.

| Carpeta | Origen | Motivo |
|---|---|---|
| `raiz/` | `api/`, `comunes/`, `datos/`, `dominio/`, `servicios/` en la raíz del repo | Código de notificaciones fuera de `apps/api`, con importaciones rotas y librerías que no están en el stack aprobado (`nestjs-pg-boss`, `luxon`, `uuid`). Incluye recordatorios, que están fuera del MVP (SPEC-005 en evaluación). |
| `notificaciones-pruebas/` | `apps/api/src/modulos/notificaciones/pruebas/*.test.ts` | Importaban las carpetas de la raíz y no siguen el patrón `*.spec.ts` de Jest. Las pruebas del módulo las genera S3 desde los casos aprobados. |
| `identidad/` | `testimport.ts` (pruebas) y `testimport2.ts` (dominio) de identidad | Archivos de depuración de la ruta de importación. |
| `scripts/` | `b1_pasos.py`, `bucle_modulo.py` en la raíz | Sustituidos por `qa/scripts/runner.py` (ciclo de construcción) y `ciclo.py`. Además terminaban con una línea `PY` suelta. |
