# PREG-009. ¿La lectura de la historia clínica también se confirma o rechaza y qué se muestra en esa pantalla?

Origen: S1
SPEC: SPEC-003 v1.3 — RF-030, BR-009, AC-030, DEC-P15
Estado: respondida
Bloquea: sí
Fecha: 2026-10-31

## Contexto

SPEC-003/RF-030: «una vista previa de los datos extraídos por OCR (número de prescripción de 20 dígitos y medicamentos)».
SPEC-003/AC-030: «falla en sus dos intentos de procesamiento OCR o confirmación por el usuario».
SPEC-003/BR-009 cuenta como fallido que «el usuario rechaza la confirmación de lectura» para cualquier documento.

La vista previa de RF-030 solo trae campos de la fórmula. Una historia clínica no tiene número de prescripción ni medicamentos, y su dato útil, el diagnóstico, no aparece en la lista.

## Por qué importa

Sin esta respuesta no se puede ejecutar la rama «confirmación por el usuario» de AC-030 ni la regla de DEC-P15 para ese caso. Además decide si el diagnóstico aparece en pantalla, incluida la Mini App.

## Opciones

1. La vista previa de la historia clínica muestra el diagnóstico o diagnósticos leídos y la persona confirma o rechaza.
2. La historia clínica no se confirma: solo cuentan las fallas de lectura. AC-030 y BR-009 deben corregirse.

## Propuesta del agente (PROPUESTA)

Ninguna. DEC-P04 dice que la persona confirma lo leído, pero no define los campos de la historia clínica.

## Respuesta del equipo

Respondida con DEC-P24 (docs/decisiones.md), 2026-10-31.
