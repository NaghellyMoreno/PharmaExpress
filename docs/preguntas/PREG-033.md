# PREG-033. En Telegram, ¿la vinculación es del chat o de la cuenta, y qué pasa si otra persona abre la Mini App?

Origen: S1
SPEC: SPEC-002 v1.4 (RF-013, RNF-009, AC-022, AC-024)
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

- SPEC-002/AC-024: «Dado un chat con vinculación vigente con el paciente, cuando la persona abre la Mini App para una gestión, entonces el sistema no pide un código nuevo.»
- SPEC-002/RNF-009: «no deben considerarse prueba de identidad».
- DEC-P22: los datos de Telegram nunca prueban la identidad.

Con vinculación vigente no se pide código, así que el acceso depende solo de reconocer el chat. La SPEC no dice si «chat» se limita a un chat privado, ni qué ocurre si una cuenta de Telegram distinta abre el botón de la Mini App (por ejemplo, un mensaje reenviado) o si el bot se agrega a un grupo.

## Por qué importa

Es el caso negativo de AC-024: define quién ve datos de salud sin código. S2 puede diseñar lo confirmado, pero este caso queda sin oráculo. El mecanismo técnico es de arquitectura; la regla de negocio no.

## Opciones

1. Solo chats privados, y una cuenta distinta a la vinculada debe verificar con cédula y código.
2. La vinculación sigue al chat, sea quien sea el que abra; se acepta el riesgo (3.3: el sistema no distingue personas).

## Propuesta del agente (PROPUESTA)

Opción 1. Nunca se trata como decisión.

## Respuesta del equipo

Respondida con DEC-P37 (docs/decisiones.md), 2026-11-01. Fuente: PHARMA_EXPRESS_SPEC-1.md: RF-16, AC-12, DEC-10, DEC-11, CL-27.
