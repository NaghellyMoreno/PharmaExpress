# PREG-014. ¿Una misma fórmula puede volver a prevalidarse en otra solicitud y con intentos nuevos?

Origen: S1
SPEC: SPEC-003 v1.3 — BR-009, RF-024; SPEC-008/AC-041
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

Contexto 3.4: «el usuario vuelve a consultar por su cuenta».
SPEC-008/AC-041: «cuando el sistema ejecuta la nueva prevalidación».
SPEC-003/BR-009: «Cada documento cuenta con dos (2) intentos de procesamiento.»

SPEC-003 no tiene un requisito de nueva prevalidación. No se dice si la persona abre otra solicitud, si los intentos se reinician, ni si una fórmula «no apta» por documentos puede volver a intentarse.

## Por qué importa

SPEC-008/AC-041 depende de esta conducta. Si los intentos se reinician en cada solicitud, el límite de dos no limita nada; si no se reinician, una autorización obtenida después no se podría volver a consultar.

## Opciones

1. Nueva solicitud con intentos nuevos, para cualquier resultado.
2. Nueva solicitud solo para no aptas por reglas de la EPS (autorización, fecha); las no aptas por documento se quedan en atención presencial.

## Propuesta del agente (PROPUESTA)

Ninguna.

Deducción de PHARMA_EXPRESS_SPEC-1.md (2026-11-01), aceptada por la persona: Opción 2. El archivo dice que No apta es un estado final (A10), que el usuario vuelve a consultar la autorización por su cuenta (DEC-15) y que un documento fallido va a atención presencial (DEC-42), pero no trata los intentos en una solicitud nueva.

## Respuesta del equipo

Respondida con DEC-P41 (docs/decisiones.md), 2026-11-01.
