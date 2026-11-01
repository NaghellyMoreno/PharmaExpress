# PREG-037. Sin agendamiento, ¿qué notificaciones y avisos del chat existen en el MVP?

Origen: S1
SPEC: SPEC-002 v1.4 (RF-012, RF-020, BR-007, AC-012, AC-021, AC-023); SPEC-005 v1.0; docs/mvp.md (REQ-024)
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

- SPEC-002/AC-023: «cuando el sistema genera notificaciones para ese paciente, entonces las notificaciones por ese canal quedan detenidas».
- SPEC-002/RF-012 habla de «avisos informativos de plantilla fija».
- Las RF-043 a RF-053 de SPEC-005 v1.0 se refieren a citas, recordatorios, indisponibilidad y entregas. Ninguna notifica un resultado de prevalidación.
- DEC-P01 deja el agendamiento en evaluación. `docs/mvp.md` tiene REQ-024 como «Debe», pero el texto de DEC-P01 no lo menciona.
- SPEC-002 §12 no incluye a SPEC-005 en sus dependencias.

## Por qué importa

Con el alcance DEC-P01, AC-012, AC-021 y AC-023 pueden quedar sin ningún evento que los dispare. S2 no tendría cómo ejecutarlos, y Frontend y Backend no tienen una lista de plantillas.

## Opciones

1. Definir un evento mínimo, por ejemplo «resultado de prevalidación listo», y dueño en SPEC-005 o SPEC-002.
2. Declarar que en el MVP no hay notificaciones y aplazar esos AC hasta SPEC-005.

## Propuesta del agente (PROPUESTA)

Ninguna: es una decisión de alcance.

Deducción de PHARMA_EXPRESS_SPEC-1.md (2026-11-01), aceptada por la persona: Opción 2. Todos los eventos de RF-50 dependen de citas, entregas o disponibilidad, y ninguno avisa un resultado de prevalidación. Sin embargo, el archivo incluye el agendamiento, así que no lo dice para este alcance.

## Respuesta del equipo

Respondida con DEC-P45 (docs/decisiones.md), 2026-11-01.
