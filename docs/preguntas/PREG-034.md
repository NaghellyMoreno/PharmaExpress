# PREG-034. ¿Qué pasa si dos pacientes de un canal terminan su cédula en los mismos 4 dígitos?

Origen: S1
SPEC: SPEC-002 v1.4 (RF-016, BR-009, AC-011, HU-007)
Estado: abierta
Bloquea: no
Fecha: 2026-10-31

## Contexto

- SPEC-002/BR-009: «Se prohíbe mostrar nombres, apellidos, iniciales, el número de cédula completo».
- SPEC-002/RF-013: múltiples pacientes «a un mismo canal sin límite».
- DEC-P20 fija `CC ***1234` como única identificación.

Dos pacientes con los mismos últimos 4 dígitos se ven idénticos en la lista. La SPEC no define cómo distinguirlos.

## Por qué importa

Un facilitador podría gestionar al paciente equivocado y ver o cargar datos de salud ajenos. AC-011 no se puede cumplir en ese caso («exige seleccionar explícitamente al paciente»).

## Opciones

1. Mantener solo la máscara y aceptar el riesgo.
2. Agregar en esos casos un dato no sensible, como el orden o la fecha de vinculación; precisa DEC-P20.
3. Permitir un alias local escrito por el usuario del canal; es una función nueva y puede guardar datos personales.

## Propuesta del agente (PROPUESTA)

Opción 2. Nunca se trata como decisión.

## Respuesta del equipo

