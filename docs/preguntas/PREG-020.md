# PREG-020. ¿Qué resultado tiene un medicamento que no figura en el catálogo simulado de cobertura PBS?

Origen: S1
SPEC: SPEC-008/BR-026, SPEC-008/RF-077 · SPEC-003/RF-024 paso 3
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-008/BR-026 solo trata dos casos: «figura como cubierto» y «figurando como no PBS». DEC-P17 dice que manda el catálogo, pero no qué pasa si el medicamento no aparece en él, ni si el catálogo lista solo los PBS o todos.

## Por qué importa

Sin esta regla no hay oráculo para ese caso y los datos del catálogo no se pueden diseñar por completo. Hallazgo H-003 del informe de SPEC-008.

## Opciones (si existen)

1. Se trata como no PBS y decide la autorización — mismo flujo de un no PBS.
2. La fórmula queda no apta y se orienta a la atención presencial — no depende de la autorización.
3. Se considera error de datos — el catálogo debe contener todos los medicamentos de la EPS simulada.

## Propuesta del agente (PROPUESTA)

Sin propuesta: es una regla de negocio.

## Respuesta del equipo

Respondida con DEC-P32 (docs/decisiones.md), 2026-11-01. Fuente: PHARMA_EXPRESS_SPEC-1.md: CL-31, BR-12.
