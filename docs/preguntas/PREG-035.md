# PREG-035. Un archivo enviado al chat del bot, ¿puede descargarse, guardarse o quedar en los registros?

Origen: S1
SPEC: SPEC-002 v1.4 (RF-085, BR-008, A2, AC-018)
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

- SPEC-002/BR-008: «Cualquier archivo o imagen recibido directamente en el chat es ignorado operacionalmente».
- SPEC-002/AC-018 solo comprueba la respuesta con plantilla.
- Una foto de fórmula o de historia clínica es dato de salud, y puede enviarse antes de aceptar la autorización de datos de salud (SPEC-001/RF-007).

La SPEC no dice qué significa «ignorado»: si el sistema descarga el archivo, guarda el identificador o el nombre, o lo escribe en registros.

## Por qué importa

Sin esta regla no hay oráculo para comprobar que el dato de salud no entró al sistema. Toca la Ley 1581 y la regla de datos de salud del proyecto.

## Opciones

1. No descargar ni guardar el archivo, ni su nombre, ni su identificador; solo registrar que hubo un intento, sin contenido.
2. Permitir un registro técnico con metadatos, con un plazo definido.

## Propuesta del agente (PROPUESTA)

Opción 1. Nunca se trata como decisión.

Deducción de PHARMA_EXPRESS_SPEC-1.md (2026-11-01), aceptada por la persona: Opción 1. RNF-03 exige usar solo los datos necesarios, pero el archivo es anterior a DEC-P10 y no trata este caso.

## Respuesta del equipo

Respondida con DEC-P44 (docs/decisiones.md), 2026-11-01.
