# PREG-015. ¿Se conservan los documentos y los resultados después de prevalidar, y por cuánto tiempo?

Origen: S1
SPEC: SPEC-003 v1.3 — sección 14; SPEC-002/RF-018, AC-016; T-010
Estado: abierta
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-003, sección 14: «[Política y tiempo de retención y almacenamiento de archivos de documentos de salud de fórmulas e historias clínicas]: tema para arquitectura.»
T-010 preguntó: «¿Se conservan los documentos después de prevalidar? ¿Cuánto tiempo?». No hay decisión en `docs/decisiones.md`.
SPEC-002/AC-016: «muestra el estado preliminar de las fórmulas registradas», lo que supone guardar los resultados.

## Por qué importa

Cuánto se guarda un dato de salud es una decisión de negocio y de cumplimiento (Ley 1581, contexto 3.11), no solo de almacenamiento. Arquitectura puede decidir dónde, pero no el plazo. También fija qué debe borrar SPEC-001/RF-009 y qué consulta SPEC-002/RF-018.

## Opciones

1. Los archivos se borran al terminar la prevalidación y solo queda el resultado.
2. Los archivos se guardan por un plazo definido.
3. Los archivos se guardan hasta la revocación.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

