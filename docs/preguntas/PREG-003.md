# PREG-003. <Pregunta concreta>

Origen: B1 (backend-servicios-api) — detectado en `apps/api/src/modulos/identidad/pruebas/dominio.spec.ts` (TC-006, caso «límite inferior»)
SPEC: SPEC-001 (módulo `identidad`), CL-003 / SPEC-001/AC-009
Estado: abierta
Bloquea: sí
Fecha: 2026-10-31

## Contexto

La SPEC-001 versión 1.1 (Aprobada y congelada; EPIC-001; módulo `identidad`) define en CL-003 / SPEC-001/AC-009:

> «Ingreso de código en el límite de tiempo de 10 minutos: un código correcto ingresado a los 9 minutos y 59 segundos es validado exitosamente; si se ingresa a las 10 minutos exactos (10m 00s) o después, el sistema lo rechaza por expiración y despliega la ruta alternativa.»

La pregunta original quedó respondida por el equipo (DEC-01 → OPEN-Q-001, resuelta en la SPEC-001 v1.1): un código emitido a las 09:59:00 tiene vigencia hasta las 10:08:59; un ingreso a las 10:00:00 está **dentro** de los 10 minutos y debe validarse.

La prueba roja `dominio.spec.ts` («AC-009 / TC-006: el límite inferior se respeta: emitido a las 09:59:00, el ingreso a las 10:00:00 se rechaza») espera `false` para ese caso.

## Por qué importa

Bloquea la implementación del módulo `identidad` (B1) y la puesta en verde de la regla `esCodigoValido` (`dominio/reglas.ts`). Sin resolver la semántica del «límite inferior», no es posible distinguir un defecto de producción de una prueba que contradice la SPEC congelada.

## Opciones (si existen)

1. Corregir la prueba (TC-006) para el caso de límite inferior coherente con la SPEC-001 v1.1 (p. ej., código emitido a las 09:50:00 e ingresado a las 10:00:00 = 10m exactos, o emitido a las 09:59:00 e ingresado a las 09:59:59).
2. Mantener la expectativa actual y reabrir la interpretación del límite inferior.

## Propuesta del agente (PROPUESTA)

Alinear la implementación a la SPEC-001 v1.1 aprobada y congelada (y a la respuesta de PREG-001): el código es válido mientras `ingreso - emision < 10 minutos`; en el límite (`>= 10m`) se rechaza.

## Respuesta del equipo

(Vacío hasta que una persona responda.)
