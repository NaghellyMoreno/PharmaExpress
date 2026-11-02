# PREG-080. Si el código llega por un solo canal (falla el SMS y llega el correo, o al revés), ¿cuenta como envío para el tope?

Origen: S1
SPEC: SPEC-001 v1.4 — RF-011, RF-012, E5, AC-013, AC-018, AC-019; DEC-P78
Estado: respondida
Bloquea: no
Fecha: 2026-11-02

## Contexto

SPEC-001/RF-012: «Un envío fallido no cuenta para el tope, y un código enviado por SMS y por correo cuenta como un solo envío (DEC-P78).» y «un tope configurable por celular y ventana de tiempo».

SPEC-001/AC-018: «Dado un celular a un envío del tope de RF-012, cuando un envío del código falla en el servicio externo, entonces ese envío no cuenta para el tope y el usuario puede pedir otro código.»

SPEC-001/AC-019: «Dado un paciente con celular y correo registrados, cuando el sistema envía un código por SMS y por correo, entonces cuenta un solo envío para el tope de RF-012.»

SPEC-001/AC-013: «Dado un fallo en el servicio externo de SMS o correo al enviar el código, cuando el sistema detecta la falla de entrega, entonces informa la novedad al usuario y ofrece las opciones de reintentar el envío o acudir a atención presencial.»

DEC-P78 decide los dos extremos: todo falla (no cuenta) y todo llega (cuenta uno). No decide el caso mixto, en un paciente con celular y correo registrados: el SMS falla y el correo llega, o el SMS llega y el correo falla. El tope se cuenta por celular, y en el primer caso el celular no recibió nada. Tampoco se dice si en el caso mixto se aplica AC-013 (avisar la falla y ofrecer reintentar) o se da el envío por bueno.

## Por qué importa

Cambia el oráculo de SPEC-001/AC-018 y AC-019 en el límite del tope (celular a un envío del tope): según la respuesta, la siguiente petición se envía o muestra la ruta alterna sin «pedir un código nuevo» (AC-015, AC-017). También cambia si AC-013 aplica cuando solo falla uno de los dos canales. Sin respuesta, S2 diseña los casos de todo falla y todo llega, y deja el mixto como `supuesto`.

## Opciones (si existen)

1. Cuenta como envío si llegó por al menos un canal; solo cuenta como fallido si fallan todos. Consecuencia: el caso mixto gasta tope aunque el celular no haya recibido nada.
2. Cuenta solo si el SMS al celular llegó; el correo no cambia el conteo. Consecuencia: se alinea con «por celular», pero quien recibe el código por correo puede pedir más sin gastar tope.
3. Otra regla que fije el equipo (por ejemplo, contar por canal).

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P82 (docs/decisiones.md), 2026-11-02.
