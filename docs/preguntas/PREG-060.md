# PREG-060. ¿Dónde y cuándo queda registrada la aceptación del aviso «por paciente y canal», si SPEC-001 la registra antes de conocer al paciente?

Origen: S1
SPEC: SPEC-002 v1.6 (RF-012, AC-027, AC-028); SPEC-001/RF-002 (aprobada y congelada); DEC-P27
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

- DEC-P27: «La aceptación del aviso de privacidad es una por paciente y canal». El registro indica que afecta a SPEC-001/RF-001 y RF-002.
- SPEC-001/RF-002: «El sistema debe registrar si la aceptación fue realizada por el titular o por un tercero, indicando la fecha, la hora y el canal». No menciona al paciente.
- SPEC-001, flujo principal: el paso 4 registra la aceptación y el paso 5 pide la cédula, así que al aceptar aún no se conoce al paciente.
- SPEC-002/AC-027 y AC-028 prueban cuándo aparece el aviso, pero ningún RF ni AC de SPEC-002 exige ligar la aceptación con el paciente.

## Por qué importa

Una persona que no sea titular puede apoyar a varios pacientes. Sin ese vínculo no hay constancia de la aceptación de cada titular, y S2 no tiene oráculo para comprobarla. Tampoco está definido qué pasa con una aceptación cuya verificación falla, por ejemplo, con una cédula inexistente. SPEC-001 está congelada: cambiarla es una decisión humana.

## Opciones

1. Requisito nuevo en SPEC-002: al verificar la identidad, la aceptación se liga al paciente y al canal. SPEC-001 no cambia y DEC-P27 debe dejar de señalarla como afectada.
2. Nueva versión de SPEC-001 con RF-002 ampliado. Reabre una SPEC aprobada e invalida su revisión y sus pruebas.

## Propuesta del agente (PROPUESTA)

Ninguna: requiere la lectura legal del equipo y decidir si se reabre SPEC-001. Nunca se trata como decisión.

Deducción de PHARMA_EXPRESS_SPEC-1.md (2026-11-01), aceptada por la persona: Opción 1. SPEC-01 registra la aceptación antes de la cédula y no la liga a un paciente, y así no se reabre SPEC-001; pero el archivo es anterior a DEC-P27.

## Respuesta del equipo

Respondida con DEC-P47 (docs/decisiones.md), 2026-11-01.
