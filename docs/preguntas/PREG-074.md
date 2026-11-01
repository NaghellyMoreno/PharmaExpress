# PREG-074. ¿Qué prioridad tienen en docs/mvp.md los REQ que quedan sin evento tras DEC-P45 y DEC-P35?

Origen: S1
SPEC: docs/mvp.md (REQ-024, REQ-004, REQ-008, REQ-023) · SPEC-002/AC-012, AC-021, AC-023 · SPEC-005 · SPEC-008/RF-079
Estado: abierta
Bloquea: no
Fecha: 2026-11-01

## Contexto

`docs/mvp.md`: «`REQ-024` (Entrega multicanal transaccional): `Debe`.» Su AC propuesto empieza: «Dado un evento de agendamiento o cancelación».
DEC-P45: «Sin agendamiento, el MVP no tiene notificaciones; los AC que dependen de ellas se aplazan hasta SPEC-005.»
DEC-P01 lista qué REQ pasan a «en evaluación», y REQ-024 no está en esa lista.
`docs/mvp.md`: «`REQ-004` (Privacidad de datos sensibles en notificaciones): `Debe`.» REQ-008 (mensajería real) mezcla el código de verificación, que sigue, con las notificaciones, que no existen en el MVP.
DEC-P35 deja «en evaluación» lo ligado al agendamiento en SPEC-008, pero REQ-023 (configuración de puntos, ventanas e inventario) sigue como `Debe`.

## Por qué importa

Un `Debe` sin evento que lo dispare no se puede verificar, y un `Debe` sin AC bloquea la aprobación del MVP. La negociación de la ronda 1 necesita saber si estos REQ salen del `Debe`. Hallazgos SPEC-002/H-070 y SPEC-008/H-007.

## Opciones

1. REQ-024 y REQ-023 pasan a «en evaluación», junto con el agendamiento; REQ-004 y REQ-008 se dividen y se conserva como `Debe` lo que sigue existiendo (plantillas del chat sin datos de salud y código de verificación).
2. Siguen como `Debe`, sujetos a que entre el agendamiento, y el MVP lo declara como condición.

## Propuesta del agente (PROPUESTA)

Ninguna: es una decisión de alcance y la toma una persona en la negociación del MVP.

## Respuesta del equipo

