# PREG-018. ¿Qué instante y qué zona horaria definen la «fecha de prevalidación»?

Origen: S1
SPEC: SPEC-003 v1.3 — RF-024 pasos 2 y 5, BR-015; SPEC-008/BR-025
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-003/RF-024 paso 2: «fecha de vigencia mayor o igual a la fecha actual de prevalidación».
SPEC-003/BR-015: «el primer día hábil inmediatamente posterior a la fecha de la prevalidación».

No se dice si la fecha es la de inicio de la solicitud, la de confirmar los datos o la de ejecutar cada paso, ni en qué zona horaria se toma. Una solicitud puede cruzar la medianoche entre dos intentos de carga.

## Por qué importa

Las pruebas de límite (vigencia igual a la fecha, fecha habilitada igual a la cita posible) cambian de resultado cerca de la medianoche.

## Opciones

1. Fecha del momento de ejecutar la prevalidación, en hora de Colombia.
2. Fecha de inicio de la solicitud, en hora de Colombia.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P70 (docs/decisiones.md), 2026-11-02.
