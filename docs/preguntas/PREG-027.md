# PREG-027. ¿Qué estado tiene una fórmula crónica sin resultado por DEC-P19 y cómo sigue la solicitud?

Origen: S1
SPEC: SPEC-008/RF-084, SPEC-008/BR-027, SPEC-008/AC-052 · SPEC-003/RF-024 paso 5, SPEC-003/RF-028, SPEC-003/BR-014, SPEC-003/AC-032
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-008/RF-084: «no emite resultado para la fórmula crónica afectada, muestra un error de sistema y registra el evento». SPEC-003/BR-014 no tiene fila para este caso, y nadie dice si se puede repetir la prevalidación.

## Por qué importa

Define el texto en pantalla, cómo se cuenta en SPEC-003/RF-028 («ninguna de las fórmulas» apta) y qué registra el evento. Hallazgo H-011.

## Opciones (si existen)

1. Estado propio sin resultado, con siguiente paso definido y opción de repetir la prevalidación.
2. Sin estado propio: solo el error, y la persona inicia una solicitud nueva.

## Propuesta del agente (PROPUESTA)

Sin propuesta.

Deducción de PHARMA_EXPRESS_SPEC-1.md (2026-11-01), aceptada por la persona: Opción 2. A10 no incluye ningún estado «sin resultado», pero el archivo es anterior a DEC-P19.

## Respuesta del equipo

Respondida con DEC-P43 (docs/decisiones.md), 2026-11-01.
