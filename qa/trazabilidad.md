# Trazabilidad — REQ → AC → TC → RUN

Actualizan: **S2** (diseño), **S3** (prueba), **B4** (ejecución), **R1** (humo en notas). No borres filas: conserva el historial.

## Matriz

| REQ | SPEC | AC | TC | Prueba (ruta) | RUN | Estado | Notas |
|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | pendiente | — |
| SPEC-001/RF-001 | SPEC-001 | SPEC-001/AC-001 | TC-001 | apps/api/src/modulos/identidad/pruebas/dominio.spec.ts | — | rojo | Consentimiento inicial |
| SPEC-001/RF-002 | SPEC-001 | SPEC-001/AC-006 | TC-003 | apps/api/src/modulos/identidad/pruebas/servicios.spec.ts | — | rojo | Aceptación como tercero |
| SPEC-001/RF-003 | SPEC-001 | SPEC-001/AC-002 | TC-002 | apps/api/src/modulos/identidad/pruebas/servicios.spec.ts | — | rojo | Rechazo del aviso |
| SPEC-001/RF-004 | SPEC-001 | SPEC-001/AC-004 | TC-004 | apps/api/src/modulos/identidad/pruebas/servicios.spec.ts | — | rojo | Verificación de identidad |
| SPEC-001/RF-005 | SPEC-001 | SPEC-001/AC-003 | TC-013 | apps/api/src/modulos/identidad/pruebas/concurrencia.spec.ts | — | rojo | BR-003 / CL-001: nuevo código anula el anterior |
| SPEC-001/RF-005 | SPEC-001 | SPEC-001/AC-009 | TC-006 | apps/api/src/modulos/identidad/pruebas/dominio.spec.ts | — | rojo | BR-005 / CL-003: límite de vigencia del código |
| SPEC-001/RF-005 | SPEC-001 | SPEC-001/AC-010 | TC-007 | apps/api/src/modulos/identidad/pruebas/dominio.spec.ts | — | rojo | BR-005 / CL-004: intentos fallidos y reintento |
| SPEC-001/RF-005 | SPEC-001 | SPEC-001/AC-011 | TC-008 | apps/api/src/modulos/identidad/pruebas/dominio.spec.ts | — | rojo | BR-005 / CL-004: tercer intento fallido |
| SPEC-001/RF-006 | SPEC-001 | SPEC-001/AC-009 | TC-006 | apps/api/src/modulos/identidad/pruebas/servicios.spec.ts | — | rojo | RF-006: ruta alternativa por vencimiento |
| SPEC-001/RF-007 | SPEC-001 | SPEC-001/AC-005 | TC-005 | apps/api/src/modulos/identidad/pruebas/servicios.spec.ts | — | rojo | Autorización de datos de salud |
| SPEC-001/RF-008 | SPEC-001 | SPEC-001/AC-007 | TC-009 | apps/api/src/modulos/identidad/pruebas/servicios.spec.ts | — | rojo | Revocación de consentimiento |
| SPEC-001/RF-009 | SPEC-001 | SPEC-001/AC-008 | TC-010 | apps/api/src/modulos/identidad/pruebas/servicios.spec.ts | — | rojo | Revocación con citas activas |
| SPEC-001/RF-009 | SPEC-001 | SPEC-001/AC-008 | TC-014 | apps/api/src/modulos/identidad/pruebas/servicios.spec.ts | — | rojo | Transversal: ningún mensaje ni log nombra medicamento |
| SPEC-001/RF-010 | SPEC-001 | SPEC-001/AC-012 | TC-011 | apps/api/src/modulos/identidad/pruebas/servicios.spec.ts | — | rojo | Cédula no registrada / EPS no responde |
| SPEC-001/RF-011 | SPEC-001 | SPEC-001/AC-013 | TC-012 | apps/api/src/modulos/identidad/pruebas/servicios.spec.ts | — | rojo | Fallo SMS/correo |

## Estados

`pendiente` · `diseñado` · `rojo` · `verde` · `escalado` · `bloqueado` · `descartado`.

## Cobertura del MVP

```text
cobertura = REQ "Debe" con al menos un TC y un RUN verde / REQ "Debe" en alcance
```

Meta: **100 %** para los requisitos `Debe`.

## Reglas

1. Usa identificadores calificados: `SPEC-004/RF-012`, `SPEC-004/AC-036`.
2. `RUN` solo se llena con evidencia (`qa/ejecuciones/RUN-*.json` o `qa/humo/RUN-humo-*.md`).
3. Si cambia una SPEC, marca como `bloqueado` los TC afectados y anota el impacto.
4. No cambies un AC para que una prueba pase.
5. No marques `verde` sin un RUN que lo respalde.
