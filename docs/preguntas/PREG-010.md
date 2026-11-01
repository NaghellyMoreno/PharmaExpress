# PREG-010. ¿Cuándo «corresponden» los medicamentos leídos con los de la EPS simulada?

Origen: S1
SPEC: SPEC-003 v1.3 — BR-013, AC-025; DEC-P08
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-003/BR-013: «Los medicamentos leídos corresponden a la lista prescrita registrada bajo ese número en la EPS simulada».
SPEC-003/AC-025: «difieren de los registrados».
DEC-P08: «los medicamentos leídos son los que la EPS tiene para ese número».

No se dice si la comparación exige la lista completa o admite un subconjunto, si incluye dosis y cantidad, ni si tolera diferencias de lectura del OCR.

## Por qué importa

Con DEC-P04 la persona no puede corregir. Una letra mal leída, sin tolerancia, gasta un intento y puede dejar la fórmula no apta. S2 puede probar listas totalmente distintas, pero no fijar el oráculo de los casos intermedios.

## Opciones

1. Igualdad exacta de la lista normalizada.
2. Igualdad de la lista con una tolerancia definida.
3. Basta un subconjunto de los medicamentos registrados.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P49 (docs/decisiones.md), 2026-11-01.
