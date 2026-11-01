# PREG-022. ¿Qué pasa si la EPS simulada o un catálogo falla durante la prevalidación?

Origen: S1
SPEC: SPEC-008 §9, §12 · SPEC-003 §9
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-008 §12 depende de la «EPS simulada», pero sus flujos de excepción solo son A1 y E1. SPEC-001/RF-010 cubre el fallo en la identidad y DEC-P19 solo el año de festivos faltante.

## Por qué importa

Falta el oráculo para una dependencia caída a mitad de una solicitud: qué se muestra, qué se registra y qué pasa con las fórmulas ya evaluadas. Hallazgo H-005.

## Opciones (si existen)

1. Igual que DEC-P19: sin resultado, error de sistema y registro — alcance por fórmula o por solicitud a definir.
2. Se detiene toda la solicitud y se orienta a la atención presencial.

## Propuesta del agente (PROPUESTA)

Sin propuesta: DEC-P19 no se puede extender por analogía sin decisión.

## Respuesta del equipo

Respondida con DEC-P31 (docs/decisiones.md), 2026-11-01. Fuente: PHARMA_EXPRESS_SPEC-1.md: DEC-32, SUP-05, A5.2, SPEC-08 sección 14.

Precisada por DEC-P53: DEC-P31 solo aplica a la prevalidación.
