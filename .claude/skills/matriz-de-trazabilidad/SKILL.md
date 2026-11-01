---
name: matriz-de-trazabilidad
description: Formato y reglas para mantener qa/trazabilidad.md con la cadena REQ → AC → TC → RUN. Úsalo en S2, S3 y B4 para que ninguna prueba quede sin requisito ni ningún requisito sin evidencia.
---
# Matriz de trazabilidad

Archivo: `qa/trazabilidad.md`.

## Formato

| REQ | SPEC | AC | TC | Prueba (ruta) | RUN | Estado | Notas |
|---|---|---|---|---|---|---|---|
| SPEC-004/RF-012 | SPEC-004 | SPEC-004/AC-031 | TC-001 | `apps/api/.../dominio.spec.ts` | — | diseñado | — |
| SPEC-004/RF-012 | SPEC-004 | SPEC-004/AC-036 | TC-036 | `apps/api/.../concurrencia.spec.ts` | RUN-2026-11-05 | verde | AC-36 |

## Reglas

1. **REQ** usa el identificador calificado (`SPEC-00x/RF-00y`); nunca un número suelto.
2. **AC** también calificado (`SPEC-00x/AC-00y`).
3. Un AC puede tener varios TC; un TC pertenece a un solo AC.
4. `RUN` se llena solo cuando hay evidencia de ejecución. No se inventa.
5. `Estado`: `pendiente`, `diseñado`, `rojo`, `verde`, `escalado`, `bloqueado`.
6. Si cambia una SPEC, marca como `bloqueado` todo TC afectado y anota el análisis de impacto. No borres filas: conserva el historial.
7. Si un TC se descarta, deja la fila con `Estado: descartado` y el motivo.
8. La cobertura útil del MVP se calcula así:

```text
cobertura = REQ "Debe" con al menos un TC y un RUN verde / REQ "Debe" en alcance
```

La meta del MVP es **100 %**.

## Actualización

- **S2** agrega las filas con AC y TC; deja `Prueba` y `RUN` vacíos.
- **S3** agrega la ruta de la prueba y el estado `rojo`.
- **B4** actualiza `RUN` y el estado a `verde` o `escalado`.
- **R1** puede agregar el RUN de humo en `Notas`, sin cambiar AC/TC.

## Prohibiciones

- No borres evidencia de un RUN anterior.
- No marques `verde` sin un RUN que lo respalde.
- No cambies un AC para que la prueba pase.
