# PREG-024. ¿Qué pasa si el número de fórmula no tiene 20 dígitos numéricos?

Origen: S1
SPEC: SPEC-008/RF-076, SPEC-008/AC-044 · SPEC-003/RF-022, SPEC-003/RF-029, SPEC-003/BR-009
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-008/RF-076: «un número numérico de 20 dígitos». SPEC-008/AC-044 solo cubre un número de 20 dígitos que no existe. Falta el caso de 19 o 21 dígitos y de caracteres no numéricos, por ejemplo por un error de OCR.

## Por qué importa

Es un valor límite sin casos por debajo ni por encima. Hallazgo H-010.

## Opciones (si existen)

1. Cuenta como no coincidencia con la EPS y consume un intento (SPEC-003/BR-009).
2. Cuenta como documento ilegible o incompleto y consume un intento.
3. Se rechaza antes de consultar y no consume intento.

## Propuesta del agente (PROPUESTA)

Sin propuesta.

Deducción de PHARMA_EXPRESS_SPEC-1.md (2026-11-01), aceptada por la persona: Opción 2. DEC-42 y AC-30 tratan igual todo documento del que no se obtienen los datos, pero el archivo no menciona el número de fórmula.

## Respuesta del equipo

Respondida con DEC-P42 (docs/decisiones.md), 2026-11-01.
