# PREG-002. ¿Cuál es el AC verificable de REQ-009 (aislamiento de identidad de los canales)?

Origen: S2
SPEC: docs/mvp.md (REQ-009)
Estado: abierta
Bloquea: sí
Fecha: 2026-10-31

## Contexto

La SPEC-001 versión 1.1 (módulo `identidad`) cubre el aviso de privacidad, el consentimiento, la verificación de identidad, la autorización de datos de salud y la revocación. El requisito `Debe` `REQ-009` (Aislamiento de identidad de los canales) del `docs/mvp.md` queda registrado como «Debe» con la siguiente condición: «Evita suposiciones de identidad inseguras mediante identificadores de Telegram». Marca como «Pendiente de SPEC (EPIC-002)» y su contenido es `PROPUESTA`: «Dado un usuario en la web o Telegram, cuando interactúa con el sistema, entonces se exige la verificación explicita mediante cédula y OTP sin derivar la identidad del canal de transporte».

## Por qué importa

Sin un AC verificable para `REQ-009`, S2 no puede diseñar el caso `TC-*` que lo trazue (REQ → AC → TC) dentro del alcance del módulo `identidad`; sin ese caso, el requisito `Debe` queda sin cobertura de diseño en esta ronda.

## Opciones (si existen)

1. Mantener la propuesta tal cual: verificación explícita por cédula + OTP, sin derivar identidad del canal de transporte.
2. Ajustar la condición de aceptación o los canales donde aplique la verificación.
3. Otro criterio.

## Propuesta del agente (PROPUESTA)

Mantener la propuesta registrada en `docs/mvp.md` («se exige la verificación explicita mediante cédula y OTP sin derivar la identidad del canal de transporte») como punto de partida para la futura SPEC, y esperar la respuesta del equipo antes de redactar el AC.

## Respuesta del equipo

(Vacío hasta que una persona responda.)
