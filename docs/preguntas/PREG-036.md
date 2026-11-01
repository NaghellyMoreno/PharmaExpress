# PREG-036. Con vinculación vigente, ¿se puede revocar el consentimiento sin un código nuevo?

Origen: S1
SPEC: SPEC-002 v1.4 (RF-011, RF-013, AC-024); SPEC-001/RF-008, RF-009, BR-004
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

- SPEC-001/RF-008: «el titular con identidad verificada revoque el consentimiento y solicite la eliminación de sus datos».
- SPEC-002/RF-011 incluye la «revocación» en el recorrido, y SPEC-002/AC-024 dice que con vinculación vigente no se pide un código nuevo para una gestión.
- Contexto 3.3: el sistema no distingue entre paciente, cuidador, tutor o facilitador.

No se sabe si una vinculación vigente cuenta como «identidad verificada» para una acción que elimina todos los datos, ni si un tercero puede ejecutarla.

## Por qué importa

La revocación es irreversible y afecta a todos los canales. En un navegador compartido, una vinculación de hasta 3 meses permitiría borrar los datos del paciente sin código. S2 no tiene oráculo para este caso.

## Opciones

1. Exigir un código nuevo solo para revocar; es una excepción a AC-024 y hay que precisar DEC-P22.
2. Permitirla con la vinculación vigente, con la confirmación de SPEC-001.

## Propuesta del agente (PROPUESTA)

Opción 1. Nunca se trata como decisión.

## Respuesta del equipo

Respondida con DEC-P38 (docs/decisiones.md), 2026-11-01. Fuente: PHARMA_EXPRESS_SPEC-1.md: RF-11, RF-13, BR-06, DEC-11, A12 paso 17.
