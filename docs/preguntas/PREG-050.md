# PREG-050. ¿Qué puede conservarse en un evento tras una revocación y qué observación demuestra que quedó disociado de la identidad?

Origen: S1
SPEC: SPEC-008/RF-083, SPEC-008/RNF-018, SPEC-008/AC-042 · SPEC-001/RF-009, SPEC-001/AC-007
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-008/AC-042: «el sistema almacena el registro del evento transaccional con el resultado de la prevalidación y las novedades detectadas, garantizando que tras una revocación de consentimiento los registros conservados queden disociados de la identidad».

SPEC-001/RF-009: «eliminar los datos personales y de salud tratados, conservar únicamente registros de auditoría disociados de la identidad».

Ninguna de las dos SPEC dice qué datos del evento pueden conservarse, ni si un resultado de prevalidación o una novedad son datos de salud que deben eliminarse. SPEC-001, sección 14, deja a arquitectura el mecanismo de disociación, pero no el criterio de aceptación.

## Por qué importa

Sin esta regla, SPEC-008/AC-042 no tiene un resultado de pasa/no pasa para la parte de revocación, y un evento conservado podría chocar con SPEC-001/RF-009 (`Debe`). Hallazgo H-006 del informe de SPEC-008.

## Opciones (si existen)

1. Se conserva el evento sin ningún dato que identifique al paciente y con su resultado y novedades — se debe confirmar que esto no incumple «eliminar los datos personales y de salud».
2. Se conserva solo el tipo de evento y su fecha, sin resultado ni novedades — las métricas de novedades solo cuentan totales ya agregados.
3. Otra lista de campos que defina el equipo.

## Propuesta del agente (PROPUESTA)

Sin propuesta: define el tratamiento de datos de salud y es una decisión del equipo.

## Respuesta del equipo

Respondida con DEC-P51 (docs/decisiones.md), 2026-11-01.
