# PREG-012. ¿Qué ve la persona si la EPS simulada o un catálogo no responde durante la prevalidación?

Origen: S1
SPEC: SPEC-003 v1.3 — RF-024, sección 9, sección 12
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-003, sección 12: «Servidor / Servicio simulado de la EPS (afiliación, vigencia de prescripción por número de 20 dígitos, estado PBS, autorizaciones y fechas habilitadas de entrega).»

Los flujos E1 a E4 no cubren un fallo de la consulta. La única falla de dependencia decidida es la del catálogo de festivos (DEC-P19). SPEC-001 sí tiene excepción de consulta a la EPS simulada (SPEC-001/RF-010).

## Por qué importa

Un error técnico no debe convertirse en un «no apto» ni en un intento gastado sin que alguien lo haya decidido. Tampoco hay un AC para este caso.

## Opciones

1. Mismo tratamiento de DEC-P19: sin resultado, error de sistema y registro.
2. Se detiene toda la solicitud y se permite reintentar sin gastar intentos de carga.
3. Se orienta a la atención presencial.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P31 (docs/decisiones.md), 2026-11-01. Fuente: PHARMA_EXPRESS_SPEC-1.md: DEC-32, SUP-05, A5.2, SPEC-08 sección 14.

Precisada por DEC-P53: DEC-P31 solo aplica a la prevalidación.
