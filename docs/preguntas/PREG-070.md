# PREG-070. Tras una desvinculación o una revocación, ¿volver a vincular el mismo canal y paciente es una vinculación nueva?

Origen: S1
SPEC: SPEC-002 v1.7 (RF-013, RF-020, flujo principal paso 3, E1, AC-012, AC-022); SPEC-001/AC-008; DEC-P26
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

- DEC-P26: «Reactivar una vinculación vencida exige solo un código nuevo. Cédula y código se exigen en una vinculación nueva.» La decisión no define «vinculación nueva».
- SPEC-002/RF-013 (v1.7): «la Mini App debe exigir cédula y código solo en una vinculación nueva cuando el chat nunca estuvo vinculado con el paciente».
- SPEC-002/AC-012: «la asociación se elimina del canal».
- SPEC-001/AC-008: «se desvinculan los canales».

La v1.7 reparte el acceso en tres casos: nunca vinculado, vencida y vigente. Un canal desvinculado o revocado no es ninguno de los tres. Sí estuvo vinculado, así que no entra en «nunca estuvo vinculado»; y no está vencido, así que no entra en la reactivación con solo código.

## Por qué importa

S2 no tiene oráculo para volver a vincular. Leído al pie de la letra, RF-013 no exige la cédula en ese caso, y la identidad quedaría sin verificar con el dato que la prueba. Además, para distinguir «nunca estuvo vinculado» de «estuvo y se desvinculó», el sistema tendría que conservar un rastro de una asociación que RF-020 y AC-012 dicen eliminar; tras una revocación, los datos se eliminan.

La aceptación del aviso en este mismo caso es otra pregunta: PREG-061.

## Opciones

1. Es una vinculación nueva: exige cédula y código. RF-013, el paso 3 y AC-022 tendrían que dejar de depender de «nunca estuvo vinculado»; no hace falta conservar rastro.
2. Se trata como una reactivación: exige solo código nuevo. Hay que conservar el rastro de la asociación eliminada y precisar DEC-P26. Solo sería viable tras desvincular, no tras revocar.
3. Respuesta distinta para desvinculación y para revocación.

## Propuesta del agente (PROPUESTA)

Opción 1, porque una asociación eliminada ya no prueba nada. Nunca se trata como decisión.

## Respuesta del equipo

Respondida con DEC-P39 (docs/decisiones.md), 2026-11-01. Fuente: PHARMA_EXPRESS_SPEC-1.md: SPEC-02 flujo principal paso 3, A10 Vinculación de canal.
