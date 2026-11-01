# PREG-031. Para reactivar una vinculación vencida, ¿se exige cédula y código o solo el código?

Origen: S1
SPEC: SPEC-002 v1.4 (RF-013, RF-015, BR-007, AC-010, AC-022, CL-007); SPEC-001/RF-004
Estado: respondida
Bloquea: sí
Fecha: 2026-10-31

## Contexto

- DEC-P22 y SPEC-002/AC-022: «Dado un chat de Telegram sin vinculación vigente con el paciente, cuando la persona abre la Mini App, entonces el sistema exige cédula y código de un solo uso». Una vinculación vencida no es vigente.
- SPEC-002/RF-015: «iniciar de inmediato el flujo de revalidación solicitando un nuevo código de verificación», sin cédula.
- SPEC-002/BR-007: «hasta completar la revalidación con un nuevo código de verificación».
- Contexto 3.3: «Toda vinculación vence a los 3 meses y exige un código nuevo.»
- SPEC-001/RF-004 verifica «solicitando la cédula y enviando un código de un solo uso».

## Por qué importa

AC-010 y AC-022 dan oráculos distintos para la misma situación en la Mini App. Además, sin pedir la cédula, cualquiera que tenga el canal dispara un SMS al paciente y el flujo se aparta del de SPEC-001. Con cédula, es más lento para adultos mayores.

## Opciones

1. Cédula y código siempre, en web y Mini App. Una sola regla, igual a SPEC-001; RF-015, BR-007 y AC-010 cambian.
2. Solo código, con el paciente ya conocido por el canal. Cumple 3.3 al pie de la letra; hay que precisar DEC-P22 y AC-022 para excluir el caso vencido.
3. Distinto por canal. Dos reglas y más pruebas.

## Propuesta del agente (PROPUESTA)

Opción 1. INFERIDO de DEC-P22, que es la decisión más reciente. Nunca se trata como decisión.

## Respuesta del equipo

Respondida con DEC-P26 (docs/decisiones.md), 2026-10-31.
