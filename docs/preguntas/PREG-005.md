# PREG-005 — Registro de autorización de datos de salud

**Origen:** SPEC-001 v1.5 / AC-005 / TC-005 / módulo identidad
**Estado:** resuelta
**Bloquea:** no
**Decisión:** Añadir método `registrarAutorizacion(solicitudId)` y que `puedeCargar` consulte ese registro.

## Pregunta
¿Dónde y cómo se registra la autorización separada de datos de salud antes de `puedeCargar('solicitud-1')`? ¿Existe un método `registrarAutorizacion(solicitudId)` o el estado se pasa como parámetro?

## Contexto
La prueba TC-005 espera `puedeCargar('solicitud-1') → true` sin registrar autorización previa. Falta decidir el contrato del servicio de autorización.

## Propuesta
Añadir método `registrarAutorizacion(solicitudId: string): Promise<void>` y que `puedeCargar` consulte ese registro. Actualizar el TC para registrar antes de consultar.