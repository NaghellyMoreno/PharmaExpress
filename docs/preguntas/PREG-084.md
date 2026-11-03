# PREG-084. ¿Qué precondición debe tener SPEC-001/AC-003 (v1.6)?

Origen: S1
SPEC: SPEC-001 v1.6 / AC-003
Estado: abierta
Bloquea: sí
Fecha: 2026-11-02

## Contexto

SPEC-001 v1.5 tenía AC-003: «Dado un celular con al menos dos envíos disponibles antes del tope de RF-012, y que el usuario solicita un código de verificación y posteriormente pide otro antes de que venza el primero, cuando intenta usar el código anterior, entonces el sistema lo rechaza por estar anulado.»

SPEC-001 v1.6 cambió AC-003 a: «Dado un usuario con identidad ya verificada y un código de verificación activo de un intento previo, cuando solicita un nuevo código estando por debajo del tope de RF-012, entonces el sistema emite el nuevo código y el anterior queda anulado de inmediato. Origen: RF-006, BR-003, PREG-004.»

El historial de la SPEC dice que este cambio responde a `docs/preguntas/PREG-004.md`. Esa pregunta, ya resuelta, solo decide la firma de una función de implementación (`esCodigoVigente(codigo, contexto?)`) para la prueba TC-013; no pide ni permite inferir que AC-003 deba decir «identidad ya verificada».

La precondición nueva no se puede construir según la propia SPEC-001 v1.6:
- SPEC-001/BR-003: «Si el usuario solicita un nuevo código mientras otro sigue vigente, el código anterior queda anulado de inmediato…» (sin condición de identidad verificada).
- SPEC-001/CL-001: la misma regla, sin esa condición.
- SPEC-001, sección 7.2: desde el estado «Identidad Verificada» solo hay transición a «Autorización Salud Registrada» o a «Revocado»; ninguna transición vuelve a un estado con código activo.
- SPEC-001, sección 8 (flujo principal): el paso 10 habilita el acceso tras validar el código; no hay paso posterior que vuelva a emitir códigos de verificación.
- SPEC-001 §16: AC-003 está trazado bajo HU-002 («verificar mi identidad mediante un código»), que ocurre antes de llegar a «Identidad Verificada».

En conjunto, «identidad ya verificada» y «un código de verificación activo» no pueden darse a la vez: no existe un estado del sistema que cumpla el «Dado» de AC-003 tal como está escrito.

## Por qué importa

AC-003 es uno de los AC que `docs/mvp.md` cita para `REQ-001` (`Debe`, módulo `identidad`). S2 no puede diseñar el oráculo TC-013 sin decidir primero cuál de las dos condiciones del «Dado» se descarta. Mientras no se corrija, la revisión S1 de SPEC-001 queda en `NO_APTA` (ver `qa/revision/informe-SPEC-001.md`, hallazgo H-019) y el módulo `identidad` no puede avanzar con esta versión.

## Opciones (si existen)

1. Quitar «identidad ya verificada» y volver a una precondición solo sobre el código y el tope, por ejemplo la de v1.5 («un celular con al menos dos envíos disponibles antes del tope de RF-012») o la de v1.4 («un celular por debajo del tope de RF-012»). Consecuencia: AC-003 vuelve a probar lo mismo que BR-003/CL-001, sin contradicción, y S2 puede rehacer TC-013 como antes.
2. Mantener «identidad ya verificada» si en realidad se quería describir otro escenario, por ejemplo la revalidación de una vinculación vencida (SPEC-002/RF-015: «iniciar de inmediato el flujo de revalidación solicitando únicamente un nuevo código de verificación, sin exigir reingresar la cédula»). Consecuencia: ese escenario no es tema de SPEC-001 (la identidad ya se verificó antes; lo que vence es la vinculación del canal, no la identidad), así que AC-003 tendría que moverse a SPEC-002 o reescribirse por completo, y SPEC-001/AC-003 quedaría sin contenido o se eliminaría.
3. Revisar también si el cambio de AC-003 era necesario: PREG-004 no pedía tocar el contenido de negocio del AC, solo la firma de una función de prueba. Podría bastar con dejar AC-003 igual a v1.5 y resolver PREG-004 únicamente en el oráculo/TC (alcance de S2), sin volver a tocar la SPEC.

## Propuesta del agente (marcada como PROPUESTA)

`PROPUESTA`: opción 1 con el texto de v1.4/v1.5 (sin la condición «identidad ya verificada»), porque es la que ya estaba resuelta y verificada en revisiones anteriores (H-009 y H-013 de `qa/revision/informe-SPEC-001.md`) y no depende de ningún dato nuevo. La decisión la toma el equipo.

## Respuesta del equipo

