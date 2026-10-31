# Plan — Módulo `identidad` (B1 Servicios y API)

- **Estado**: borrador (lo escribe B1; la puerta de arquitectura/implementación la decide la persona)
- **Módulo**: `identidad`
- **SPEC**: SPEC-001 v1.1 («Consentimiento, identidad y derechos del titular», EPIC-001), estado Aprobada y congelada (veredicto S1: APTA)
- **Requisitos**: SPEC-001/RF-001 … RF-011, BR-001 … BR-005, CL-001 … CL-004, AC-001 … AC-013
- **Fecha**: 2026-10-31
- **Origen**: `docs/mvp.md` (REQ-001, corte técnico del módulo `identidad`: esfuerzo M, riesgo real)

## Objetivo del plan

Poner en verde las pruebas rojas de QA (`apps/api/src/modulos/identidad/pruebas/`) implementando el módulo
`identidad` de NestJS (dominio, servicios, datos, api) sin tocar pruebas ni `qa/`.

## Pasos

1. **Dominio puro** — `dominio/reglas.ts` + `dominio/index.ts`
   - Archivos: `apps/api/src/modulos/identidad/dominio/reglas.ts`, `dominio/index.ts`.
   - Cubre: consentimiento (BR-001 / RF-001, RF-003 / AC-001, AC-002, TC-001, TC-002), código de un solo uso y vigencia (BR-002, BR-003, BR-005 / RF-005, RF-006 / AC-003, AC-004, AC-009, AC-010, AC-011 / TC-003, TC-004, TC-006, TC-007, TC-008, TC-013), intentos (BR-005 / CL-004 / AC-010, AC-011 / TC-007, TC-008).
   - Regla dura: reglas puras, sin I/O, sin NestJS, sin Prisma, sin HTTP.

2. **Datos** — repositorio Prisma + esquema del módulo
   - Archivos: `apps/api/src/modulos/identidad/datos/identidad.repository.ts`, `apps/api/src/modulos/identidad/datos/prisma/schema.identidad.prisma`.
   - Cubre: un esquema PostgreSQL por módulo (`identidad`); el resto de módulos acceden solo por la `api/`.

3. **Servicios (casos de uso)** — `servicios/`
   - Archivos: `servicios/consentimiento.service.ts`, `servicios/verificacion.service.ts`, `servicios/autorizacion-datos-salud.service.ts`, `servicios/revocacion.service.ts`, `servicios/solicitud-codigo.service.ts`, `servicios/index.ts`.
   - Cubre: `ConsentimientoService` (AC-001, AC-002, AC-006 / TC-001, TC-002, TC-003), `VerificacionIdentidadService` (AC-004 … AC-013 / TC-004 … TC-013), `AutorizacionDatosSaludService` (AC-005 / TC-005), `RevocacionService` (AC-007 … AC-009, AC-014 / TC-009 … TC-014), `SolicitudCodigoService` (AC-003 / TC-013 / CL-001).

4. **Api / módulo Nest** — `api/`, `api/dto/`, `identidad.module.ts`
   - Archivos: `api/identidad.api.ts`, `api/dto/identidad.dto.ts`, `identidad.module.ts`.
   - Cubre: puerta de entrada del módulo, DTO + Zod en el borde, controladores (sin HTTP aún: B3/B2 consumen la api).

5. **Ejecución de la suite** — `npm test -- modulos/identidad`
   - Pruebas: `dominio.spec.ts` (reglas), `servicios.spec.ts` (casos de uso), `concurrencia.spec.ts` (Testcontainers PostgreSQL).
   - Avanzar solo si el número de pruebas verdes no empeora.

6. **Bucle B4** — corregir hasta verde (máx. 3 iteraciones por falla, re-ejecutar el módulo completo).
   - Clasificación de fallos: `DEFECTO_CODIGO`, `PRUEBA_SOSPECHOSA`, `ENTORNO`.

7. **Reglas duras y verificación** — plantillas sin datos de salud, logs con pino y lista blanca de campos, datos sintéticos en fixtures, sin modificación de pruebas.

8. **Cierre** — informe SALIDA (ver `backend-servicios-api.md`) + trazabilidad (`qa/trazabilidad.md`) + `pipeline.json`.

## Decisiones tomadas en el plan (sin inventar)

- Los servicios se construyen con dependencias inyectadas (EPS simulada, SMS, correo) y con estado de códigos por instancia/servicio, según lo que exigen las pruebas rojas y la SPEC-001 v1.1.
- El código de un solo uso se evalúa con `esCodigoValido(codigo, emisionMs, ingresoMs)` usando vigencia de 10 minutos y máximo 3 intentos (BR-005 / CL-003 / CL-004).

## Puertas

- Si una prueba parece incorrecta: `docs/preguntas/PREG-xxx.md` + detenerse (regla dura del agente).
- Si falta SPEC o decisión: `docs/preguntas/PREG-xxx.md` + detenerse.
- Sin SPEC o decisión para algo: no implementarlo.
