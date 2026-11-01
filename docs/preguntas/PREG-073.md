# PREG-073. ¿Cuál es la tolerancia al comparar los medicamentos leídos con los de la EPS simulada?

Origen: DEC-P49
SPEC: SPEC-003/BR-013, AC-025; DEC-P08
Estado: respondida
Bloquea: no
Fecha: 2026-11-01

## Contexto

DEC-P49 fija que la lista debe ser igual, con una tolerancia definida a las diferencias de lectura del OCR, pero no dice cuál. Tampoco se sabe si la comparación incluye dosis y cantidad.

## Por qué importa

Sin ese valor, S2 no puede fijar el oráculo de los casos intermedios de SPEC-003/AC-025. Una tolerancia amplia podría confundir dos medicamentos de nombre parecido.

## Opciones

1. Solo se ignoran mayúsculas, tildes y espacios.
2. Además se admite un número fijo de caracteres distintos por nombre.
3. El valor lo propone arquitectura según el OCR elegido y lo aprueba el equipo.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P56 (docs/decisiones.md), 2026-11-01.
