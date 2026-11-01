# PREG-025. ¿Cómo se mide el rango de 8 a 9 meses de los datos de prueba?

Origen: S1
SPEC: SPEC-008/BR-025, modelo de dominio de SPEC-008
Estado: abierta
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-008/BR-025: «comprendidas estrictamente entre 8 y 9 meses posteriores a la fecha de consulta médica simulada». Contexto 3.4: «en los datos de prueba va de 8 a 9 meses después de la consulta». La fórmula guarda «fecha de prescripción», no fecha de consulta.

## Por qué importa

No se sabe si 8 y 9 meses exactos son válidos ni desde qué fecha se cuenta, así que el rango no se puede comprobar. Hallazgos H-014 y H-015.

## Opciones (si existen)

1. Extremos incluidos, contando desde la fecha de prescripción.
2. Extremos excluidos, contando desde la fecha de prescripción.
3. Añadir una fecha de consulta a la EPS simulada.

## Propuesta del agente (PROPUESTA)

Sin propuesta.

## Respuesta del equipo

