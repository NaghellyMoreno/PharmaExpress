# PREG-061. Si un paciente se desvincula y vuelve a vincularse al mismo canal, ¿debe aceptarse otra vez el aviso?

Origen: S1
SPEC: SPEC-002 v1.6 (RF-012, RF-020, AC-012, AC-019); DEC-P27
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

- DEC-P27: «La aceptación del aviso de privacidad es una por paciente y canal: no se repite al reactivar, pero sí con un segundo paciente en el mismo canal.»
- SPEC-002/RF-020: «La desvinculación voluntaria solo debe eliminar la asociación entre el canal y el paciente específico».

Leída al pie de la letra, DEC-P27 no repetiría la aceptación, porque el par paciente-canal ya aceptó. Pero la asociación se eliminó por voluntad de la persona y la vinculación siguiente es nueva. La decisión no cubre este caso.

## Por qué importa

S2 no tiene oráculo para el caso de volver a vincular. También define si la aceptación sobrevive a la desvinculación.

## Opciones

1. Se exige de nuevo: la vinculación nueva empieza desde cero.
2. No se exige: la aceptación del par paciente-canal se conserva tras desvincular.

## Propuesta del agente (PROPUESTA)

Ninguna: es una decisión de negocio y legal. Nunca se trata como decisión.

## Respuesta del equipo

Respondida con DEC-P40 (docs/decisiones.md), 2026-11-01. Fuente: PHARMA_EXPRESS_SPEC-1.md: SPEC-02 flujo principal paso 3, SPEC-01 flujo principal pasos 2 a 4.
