# PREG-030. ¿En qué instante exacto vence una vinculación?

Origen: S1
SPEC: SPEC-002 v1.4 (RF-014, RF-015, BR-005, A1, CL-005, CL-008, AC-009, AC-020)
Estado: respondida
Bloquea: sí
Fecha: 2026-10-31

## Contexto

- DEC-P21: «Una vinculación vence a los 3 meses calendario, el mismo día del mes.» No dice en qué momento de ese día.
- SPEC-002/BR-005: «exactamente 3 meses calendario desde el momento de su verificación» (sugiere la misma hora).
- SPEC-002/AC-009: «cuando la vinculación de uno cumple 3 meses calendario, entonces solo esa vinculación expira» (al cumplirlos ya vence).
- SPEC-002/DEC-12: «con una vinculación vencida (más de 3 meses calendario)» y SPEC-002/A1: «ha superado los 3 meses calendario» (hay que superarlos).
- SPEC-002/AC-020: «la vinculación expira exactamente el último día de febrero» (no dice si ese día aún sirve).

## Por qué importa

S2 no puede fijar el oráculo del caso en el límite ni los casos por debajo y por encima. Tampoco se sabe qué zona horaria manda. La SPEC-001 sí resolvió el caso equivalente (SPEC-001/AC-009: 10:09:59 y 10:10:00).

## Opciones

1. Vence al instante: misma fecha y hora de la verificación; el segundo anterior es vigente. Exige guardar la hora; el usuario no ve un corte de fin de día.
2. Vigente todo el día de vencimiento: deja de valer a las 00:00 del día siguiente. Más simple de explicar; concuerda con «más de 3 meses».
3. Vencida desde las 00:00 del día de vencimiento: concuerda con «cumple 3 meses».

En las tres hay que indicar la zona horaria.

## Propuesta del agente (PROPUESTA)

Opción 1 con hora de Colombia, por analogía con SPEC-001/AC-009 y con «desde el momento de su verificación». Nunca se trata como decisión.

## Respuesta del equipo

Respondida con DEC-P25 (docs/decisiones.md), 2026-10-31.
