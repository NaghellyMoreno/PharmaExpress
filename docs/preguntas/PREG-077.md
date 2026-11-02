# PREG-077. ¿Cuántas fórmulas admite como máximo una solicitud?

Origen: S1
SPEC: SPEC-003 v1.13 — sección 3, BR-012, modelo de dominio; PREG-017; T-009
Estado: respondida
Bloquea: no
Fecha: 2026-11-02

## Contexto

SPEC-003, modelo de dominio: «Solicitud: conjunto de fórmulas e historia clínica de un mismo paciente gestionados en una misma sesión; admite varias fórmulas.»

`docs/preguntas/PREG-017.md`, Contexto: «ni el máximo de fórmulas por solicitud (preguntado en T-009 y sin respuesta).»

DEC-P74 respondió PREG-017 solo en lo de formato, tamaño y número mal formado: «Un archivo de otro formato o que supere el límite se rechaza antes de leerlo y no gasta intento.» No dice nada del máximo de fórmulas, y PREG-017 quedó `respondida`. La SPEC-003 v1.13 cerró OPEN-Q-015 sin ese punto.

## Por qué importa

Sin un máximo no hay caso de valor límite (debajo, en el límite y por encima) para la cantidad de fórmulas, ni conducta definida si la persona intenta cargar una más. Afecta SPEC-003/RF-021, la carga de OCR en los workers (ARQ-005) y el diseño de casos de S2 (hallazgo H-022 del informe de SPEC-003).

## Opciones

1. Sin máximo funcional; solo el límite técnico que fije Arquitectura — no hay caso «por encima» de negocio.
2. Un máximo fijo o configurable (lo fija el equipo) — al superarlo, la fórmula extra se rechaza antes de leerla, sin gastar intento, como DEC-P74.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P80 (docs/decisiones.md), 2026-11-02.
