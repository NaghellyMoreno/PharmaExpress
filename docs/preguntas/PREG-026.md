# PREG-026. ¿En qué zona horaria se determina la «fecha de prevalidación»?

Origen: S1
SPEC: SPEC-008/BR-025, SPEC-008/RF-084, SPEC-008/AC-046, SPEC-008/AC-052 · SPEC-003/RF-024, SPEC-003/BR-015
Estado: abierta
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-008/BR-025 compara con «la fecha de prevalidación en que se realiza la consulta». Ningún documento revisado fija la zona horaria.

## Por qué importa

Cerca de la medianoche, cambia el resultado de vigencia, el primer día hábil y el año necesario del catálogo. Hallazgo H-020.

## Opciones (si existen)

1. Hora de Colombia, fija.
2. Otra zona, definida por configuración.

## Propuesta del agente (PROPUESTA)

Opción 1: el producto opera en Manizales. Es una inferencia; nunca se trata como decisión.

## Respuesta del equipo

