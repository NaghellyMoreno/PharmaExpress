# PREG-038. ¿La autorización de datos de salud se pide una vez por paciente, por canal o por solicitud?

Origen: S1
SPEC: SPEC-002 v1.4 (flujo principal paso 7, AC-024); SPEC-001/RF-007; SPEC-003/RF-021
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

- SPEC-001/RF-007: «exigir una autorización separada para el tratamiento de datos de salud antes de permitir la carga de documentos».
- SPEC-003/RF-021: «previa aceptación de la autorización de tratamiento de datos de salud».
- SPEC-002 no menciona esta autorización: su paso 7 pasa directamente a «El usuario realiza la prevalidación».

Con vinculación vigente no se repite el código (DEC-P22), pero nadie dice si la autorización se conserva, para qué paciente vale, ni si un facilitador debe darla por cada paciente.

## Por qué importa

Falta el oráculo de la entrada a la carga en el segundo uso y con varios pacientes. Se relaciona con T-025 (no se define si esa autorización vence).

## Opciones

1. Una por paciente; se conserva mientras no se revoque.
2. Una por paciente y canal; termina con la vinculación.
3. Una por solicitud.

## Propuesta del agente (PROPUESTA)

Ninguna: depende de la lectura legal del equipo.

Deducción de PHARMA_EXPRESS_SPEC-1.md (2026-11-01), aceptada por la persona: Opción 1. BR-08 habla de autorización «vigente» y RF-12 la termina al revocar, pero el archivo no dice su alcance por paciente, canal o solicitud.

## Respuesta del equipo

Respondida con DEC-P46 (docs/decisiones.md), 2026-11-01.
