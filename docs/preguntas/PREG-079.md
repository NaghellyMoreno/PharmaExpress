# PREG-079. Al alcanzar el tope de envíos, ¿sigue valiendo el código vigente y qué cuenta como un envío?

Origen: S1
SPEC: SPEC-001 v1.2 — RF-012, BR-003, CL-001, AC-003, AC-013, AC-015, E3, E5; DEC-P61; DEC-P68; ARQ-005/ADR-006
Estado: respondida
Bloquea: no
Fecha: 2026-11-02

## Contexto

SPEC-001/RF-012: «Al alcanzarlo, no envía más códigos y presenta la ruta alterna solo con la orientación para actualizar datos en la EPS y la atención presencial, sin la opción de pedir un código nuevo.»

SPEC-001/BR-003: «Si el usuario solicita un nuevo código mientras otro sigue vigente, el código anterior queda anulado de inmediato y solo es válido el último emitido.»

SPEC-001/CL-001: «si el usuario solicita un código nuevo antes de ingresar el anterior, el código previo queda invalidado de inmediato y solo el nuevo es aceptado.»

SPEC-001/E5: «El sistema ofrece la opción de reintentar el envío del código o acudir a la atención presencial.»

Al pie de la letra, una petición hecha con el tope alcanzado y con un código todavía vigente anula ese código (BR-003, CL-001), pero no se envía otro (RF-012), y la persona se queda sin ningún código válido. Si la anulación ocurre solo al emitir un código nuevo («solo es válido el último emitido»), el código vigente sigue sirviendo. DEC-P61 y DEC-P68 no tratan este caso.

Tampoco se define qué cuenta como un envío para el tope: un envío que falla (E5), el reintento de E5, o el mismo código enviado por SMS y por correo.

## Por qué importa

Cambia el oráculo de SPEC-001/AC-003 y AC-015 cuando se alcanza el tope, y el de SPEC-001/AC-013 (¿se ofrece «reintentar el envío» con el tope alcanzado?). Sin esta respuesta, S2 solo puede diseñar casos por debajo del tope. Hallazgos H-002 y H-003 del informe de SPEC-001.

## Opciones

1. Con el tope alcanzado, la petición no anula el código vigente, que sigue valiendo hasta vencer o agotar intentos. Un envío fallido no cuenta, y un código enviado por SMS y correo cuenta como un solo envío.
2. La petición anula el código vigente igual que hoy (BR-003) y solo queda la ruta alterna. Todo intento de envío cuenta, falle o no.
3. Otra combinación que fije el equipo.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P78 (docs/decisiones.md), 2026-11-02.
