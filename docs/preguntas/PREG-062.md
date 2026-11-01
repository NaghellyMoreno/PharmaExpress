# PREG-062. ¿Una vinculación vencida aparece en la lista de pacientes del canal y cuenta para exigir la selección?

Origen: S1
SPEC: SPEC-002 v1.6 (RF-015, RF-016, BR-007, BR-009, A1, AC-010, AC-011); DEC-P26; contexto 3.3
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

- DEC-P26: «Reactivar una vinculación vencida exige solo un código nuevo.» Sin cédula, el paciente tiene que salir de lo que el canal ya conoce.
- SPEC-002/A1: «Si la vinculación del paciente seleccionado ha superado los 3 meses calendario».
- Contexto 3.3: «Mientras está vencida, ese canal no muestra información».
- SPEC-002/RF-016: «Si un canal tiene más de un paciente vinculado». No dice si una vinculación vencida cuenta.

Para seleccionar a un paciente vencido, su `CC ***1234` debería verse en la lista. No se sabe si esa máscara es «información» prohibida por 3.3, ni cómo se elige al paciente cuando varias vinculaciones vencieron.

## Por qué importa

Es la entrada a la reactivación en un canal con varios pacientes. Sin esta regla, SPEC-002/AC-010 no tiene oráculo en ese caso y RF-016 no dice cuántos pacientes se cuentan.

## Opciones

1. La lista muestra las vencidas con su máscara y una marca de vencida. La máscara no se considera información; todas cuentan para la selección.
2. La lista solo muestra las vigentes y una acción aparte permite reactivar. Hay que definir cómo se identifica al paciente sin pedir la cédula.

## Propuesta del agente (PROPUESTA)

Ninguna: precisa el contexto 3.3 y DEC-P26. Nunca se trata como decisión.

Deducción de PHARMA_EXPRESS_SPEC-1.md (2026-11-01), aceptada por la persona: Opción 1. AC-14 y A1 piden el código a un paciente vinculado con la vinculación vencida, pero DEC-46 dice que no muestra información, y el archivo no aclara la lista.

## Respuesta del equipo

Respondida con DEC-P48 (docs/decisiones.md), 2026-11-01.
