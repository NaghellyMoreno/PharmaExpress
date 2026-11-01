# PREG-072. ¿El bot funciona si se agrega a un grupo de Telegram?

Origen: revisión de PREG-033 contra PHARMA_EXPRESS_SPEC-1.md
SPEC: SPEC-002 (RF-013, AC-024); DEC-P37
Estado: respondida
Bloquea: no
Fecha: 2026-11-01

## Contexto

DEC-P37 fija que la vinculación es del chat, pero PHARMA_EXPRESS_SPEC-1.md no menciona los grupos. En un grupo, una vinculación vigente mostraría datos de salud a todos sus integrantes sin código.

## Por qué importa

Es el resto de PREG-033 y define el caso negativo de SPEC-002/AC-024.

## Opciones

1. El bot solo opera en chats privados: en un grupo no vincula ni muestra nada.
2. Un grupo se trata como cualquier otro chat.

## Propuesta del agente (PROPUESTA)

Opción 1, por minimización (RNF-03). Nunca se trata como decisión.

## Respuesta del equipo

Respondida con DEC-P52 (docs/decisiones.md), 2026-11-01.
