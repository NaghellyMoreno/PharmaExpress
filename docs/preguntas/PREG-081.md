# PREG-081. Si un canal falla y el otro entrega el código, ¿se avisa la falla y se ofrece reintentar el envío? ¿Ese reintento cuenta para el tope?

Origen: S1
SPEC: SPEC-001 v1.5 — RF-011, RF-012, E5, AC-013, AC-020; DEC-P82
Estado: abierta
Bloquea: no
Fecha: 2026-11-02

## Contexto

DEC-P82 decide el conteo del caso mixto: «Un envío cuenta para el tope si el código llegó por al menos un canal; solo es fallido si fallan todos los canales.» No dice qué ve la persona en ese caso. PREG-080 también lo preguntaba («Tampoco se dice si en el caso mixto se aplica AC-013»), y DEC-P82 no responde esa parte.

SPEC-001/RF-011: «Ante fallo en los servicios externos de envío de SMS o correo, el sistema debe notificar la falla en la entrega del mensaje y permitir reintentar el envío o dirigirse a la atención presencial.»

SPEC-001/AC-013: «Dado un fallo en el servicio externo de SMS o correo al enviar el código, cuando el sistema detecta la falla de entrega, entonces informa la novedad al usuario y ofrece las opciones de reintentar el envío o acudir a atención presencial.»

SPEC-001/AC-020: «Dado un celular a un envío del tope de RF-012 y un paciente con celular y correo registrados, cuando el SMS falla y el correo llega, entonces ese envío cuenta para el tope y la siguiente petición muestra la ruta alterna sin la opción de pedir un código nuevo.»

SPEC-001/RF-012: «Al alcanzarlo, no envía más códigos».

Al pie de la letra, un SMS que falla es «un fallo en el servicio externo de SMS». Entonces AC-013 obliga a avisar y a ofrecer «reintentar el envío» también en el caso mixto. En el escenario de AC-020 ese envío ya alcanzó el tope. Si el reintento manda el código, contradice RF-012 y AC-020. Si no lo manda, AC-013 ofrece una opción que no hace nada. Tampoco se dice si un reintento cuenta para el tope.

## Por qué importa

Cambia el oráculo de SPEC-001/AC-013 en el caso mixto, y el de AC-020 justo en el límite del tope. Mientras no haya respuesta, S2 diseña AC-013 con todos los canales fallidos y AC-020 tal como está escrito. El aviso en el caso mixto queda como `supuesto`.

## Opciones (si existen)

1. En el caso mixto no se avisa ninguna falla: el envío se da por bueno y RF-011, E5 y AC-013 solo aplican cuando fallan todos los canales. Consecuencia: si la persona esperaba el SMS, nada le dice que el código solo llegó por correo.
2. Se avisa que un canal falló, sin ofrecer reintentar. Consecuencia: AC-013 y E5 deben distinguir el caso mixto.
3. Se avisa y se ofrece reintentar el envío del canal que falló, siempre que no se haya alcanzado el tope; el reintento cuenta como un envío nuevo. Con el tope alcanzado se aplica AC-017. Consecuencia: AC-013 y E5 llevan la condición del tope.
4. Otra regla que fije el equipo.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

