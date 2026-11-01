# PREG-040. ¿Cuándo un documento es «ilegible» y cuándo es «incompleto» si el OCR lee solo una parte?

Origen: S1
SPEC: SPEC-003 v1.7 — RF-029, RF-031, BR-009, BR-014, E3, AC-022
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-003/AC-022: «Dado un documento que no se puede leer».
SPEC-003/BR-009 separa dos causas: «la imagen no permite extracción OCR (incluyendo documentos ilegibles o manuscritos), está incompleta».
SPEC-003/BR-014 les da textos distintos. Ilegible: «No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial.» Incompleto: «No fue posible validar los datos del documento con la EPS simulada.»

DEC-P28 quitó la detección de manuscritas, pero no fijó qué hace ilegible a un documento. La SPEC no dice qué pasa si el OCR devuelve texto parcial: por ejemplo, lee el número y no los medicamentos, o lee caracteres sin sentido.

## Por qué importa

- SPEC-003/AC-022 solo tiene oráculo en el extremo claro, cuando no se obtiene ningún dato.
- Una manuscrita con lectura parcial puede no recibir el mensaje común de DEC-P28, porque llegaría a la vista previa o a la no coincidencia.
- No se sabe si una lectura parcial pasa a la vista previa de SPEC-003/RF-030 o falla antes.

## Opciones

1. Ilegible = no se obtuvo ningún dato; una lectura parcial es «incompleta».
2. Ilegible = falta alguno de los datos obligatorios (número o medicamentos en la fórmula; diagnóstico en la historia), de modo que siempre sale el mensaje común.
3. Toda lectura parcial pasa a la vista previa y la persona la rechaza.

## Propuesta del agente (marcada como PROPUESTA)

Ninguna. Afecta qué texto ve la persona y lo decide el equipo.

## Respuesta del equipo

Respondida con DEC-P54 (docs/decisiones.md), 2026-11-01.
