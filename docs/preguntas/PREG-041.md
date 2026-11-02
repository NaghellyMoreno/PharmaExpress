# PREG-041. Si un documento falla por causas distintas en sus dos intentos, ¿qué motivo se muestra?

Origen: S1
SPEC: SPEC-003 v1.7 — RF-029, BR-009, BR-014, E1, E3
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-003/BR-014 tiene dos filas para un documento que agota sus intentos: «Documento ilegible (manuscrito o no)» y «Documento incompleto, sin diagnóstico, no coincidente o 2 rechazos OCR».
SPEC-003/BR-009 cuenta como fallido cualquier intento: ilegible, incompleto, sin diagnóstico, sin coincidencia o rechazado por la persona.

La SPEC no dice qué fila aplica si las causas se mezclan: por ejemplo, ilegible en el primer intento y rechazado en el segundo. La fila «2 rechazos OCR» tampoco cubre un solo rechazo sumado a otra causa.

## Por qué importa

El motivo es el oráculo de SPEC-003/RF-027. Con causas mezcladas, S2 no puede fijar el texto esperado. Las dos filas tienen el mismo siguiente paso; cambia el motivo.

## Opciones

1. Se muestra el motivo de la causa del segundo intento.
2. Se muestra el motivo de la causa del primer intento.
3. Se usa un solo motivo para todo documento que agote sus intentos.

## Propuesta del agente (marcada como PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P75 (docs/decisiones.md), 2026-11-02.
