# PREG-032. ¿Qué alcance tiene «una sola aceptación» del aviso de privacidad?

Origen: S1
SPEC: SPEC-002 v1.4 (RF-012, flujo principal pasos 2 y 3, AC-019); SPEC-001/RF-001, RF-002, AC-001
Estado: respondida
Bloquea: sí
Fecha: 2026-10-31

## Contexto

- SPEC-002/RF-012: «el mismo y único aviso definido en SPEC-001/RF-001 con una sola aceptación».
- SPEC-002, flujo principal, paso 2: «Si ingresa por Telegram o por la web, antes de pedir la cédula o cualquier dato personal, el sistema presenta el aviso de privacidad», sin condición: se lee como que ocurre en cada ingreso.
- SPEC-002/AC-019 solo lo exige «cuando intenta iniciar el proceso de vinculación o verificación».
- SPEC-001/RF-002 registra quién aceptó (titular o tercero), fecha, hora y canal. La aceptación ocurre antes de conocer la cédula, así que no queda ligada a un paciente.
- Contexto 3.3: un canal admite varios pacientes sin límite.

## Por qué importa

No se sabe si el aviso aparece: (a) con vinculación vigente al reabrir el canal; (b) al vincular un segundo paciente al mismo canal; (c) al reactivar una vinculación vencida; (d) en un segundo canal del mismo paciente. Un facilitador puede ser «tercero» para varios titulares: una única aceptación por canal podría no sustentar el tratamiento de los datos de cada uno (Ley 1581). Afecta AC-019, AC-024 y SPEC-001/AC-001.

## Opciones

1. Una aceptación por par canal-paciente: se muestra en cada vinculación y reactivación, no con vinculación vigente. Cubre al facilitador; exige asociar la aceptación al paciente al verificar.
2. Una aceptación por persona o canal, una sola vez. Más simple; no deja constancia por titular.
3. Aceptación en cada ingreso. Lo que se lee en el flujo; molesto y contrario a «una sola aceptación».

## Propuesta del agente (PROPUESTA)

Opción 1. La validez legal debe confirmarla el equipo. Nunca se trata como decisión.

## Respuesta del equipo

Respondida con DEC-P27 (docs/decisiones.md), 2026-10-31.
