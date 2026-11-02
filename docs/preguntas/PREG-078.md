# PREG-078. ¿Qué datos forman el «resultado» que se conserva cuando se borran las fotos y los PDF?

Origen: S1
SPEC: SPEC-003 v1.13 — RF-032, AC-054; DEC-P59; SPEC-002/RF-018, AC-016; ARQ-005/COMP-003, ADR-003
Estado: respondida
Bloquea: no
Fecha: 2026-11-02

## Contexto

SPEC-003/RF-032: «El sistema debe borrar las fotos y los PDF cargados al terminar la prevalidación de la solicitud y conservar solo el resultado.»

SPEC-003/AC-054: «no queda ninguna foto ni PDF de esa solicitud y sí queda su resultado preliminar.»

DEC-P59: «Las fotos y los PDF se borran al terminar la prevalidación y solo queda el resultado.»

ARQ-005/COMP-003: «aplica cifrado a nivel de aplicación AES-256-GCM a los textos extraídos antes de persistir».

SPEC-002/RF-018: «El sistema debe permitir al usuario consultar el estado de prevalidación de cada fórmula».

No se define si «el resultado» incluye solo apta o no apta con su motivo y siguiente paso, o también los datos leídos por OCR: número de fórmula, medicamentos y diagnóstico. Leída al pie de la letra, «solo el resultado» excluye los textos extraídos que ARQ-005 guarda cifrados. Pero sin algún identificador de la fórmula, la consulta de SPEC-002/RF-018 no puede decir a qué fórmula corresponde cada estado.

## Por qué importa

AC-054 no tiene oráculo completo para «no queda nada más que el resultado»: S2 no sabe qué campos deben seguir y cuáles no. El tema es de datos de salud (Ley 1581). También cambia lo que muestra la consulta de SPEC-002/AC-016 y lo que borra COMP-005. Tras una revocación ya manda DEC-P51 (solo tipo de evento y fecha); esta pregunta es por lo que queda antes de revocar.

## Opciones

1. Solo apta o no apta, motivo y siguiente paso por fórmula, con el número de fórmula como identificador; los medicamentos y el diagnóstico leídos se borran con los archivos.
2. Además del resultado, se conservan cifrados los medicamentos leídos (para mostrarlos en la consulta), y el diagnóstico se borra.
3. Se conservan cifrados todos los textos extraídos, como hoy describe ARQ-005, y «solo el resultado» se refiere únicamente a los archivos.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P81 (docs/decisiones.md), 2026-11-02.
