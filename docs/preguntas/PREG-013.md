# PREG-013. ¿Cómo se trata una fórmula crónica «sin resultado» por falta del año en el catálogo de festivos?

Origen: S1
SPEC: SPEC-003 v1.3 — RF-024 paso 5, RF-027, RF-028, BR-014, AC-032; SPEC-008/AC-052
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

DEC-P19: «no se emite resultado para la fórmula crónica afectada, se muestra un error de sistema y se registra».
SPEC-003/RF-027 solo prevé «resultado preliminar por fórmula (apta o no apta)».
SPEC-003/RF-028: «si ninguna de las fórmulas de la solicitud resulta apta».
La tabla SPEC-003/BR-014 no tiene fila para este caso.
SPEC-003, flujo principal, paso 10: calcula primero la cita posible y luego «verifica que posea fecha habilitada»; RF-024 paso 5 enuncia antes el caso sin fecha habilitada.

## Por qué importa

Quedan sin oráculo cuatro cosas:

1. Una solicitud con una fórmula sin resultado y las demás no aptas: ¿termina el flujo digital (RF-028)?
2. ¿Qué siguiente paso ve la persona y puede reintentar en la misma solicitud?
3. ¿Se muestra la leyenda de resultado preliminar?
4. Una crónica sin fecha habilitada y sin el año del catálogo: ¿queda no apta (DEC-P16) o sin resultado (DEC-P19)?

## Opciones

1. El caso sin fecha habilitada se resuelve primero (no apta) y la fórmula sin resultado queda como tercer estado, con texto y siguiente paso propios.
2. El error de catálogo se resuelve primero y detiene esa fórmula.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P50 (docs/decisiones.md), 2026-11-01.
