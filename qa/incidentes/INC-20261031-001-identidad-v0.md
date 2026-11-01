# INC-20261031-001. Revisión del código v0 del módulo `identidad`

Fecha: 2026-10-31
Origen: revisión externa del pipeline (no es un triage de R2 sobre un entorno desplegado)
Módulo: `identidad` (SPEC-001 v1.1)
Commit revisado: `b5f0ae2` + cambios sin commit (ya revertidos)
Evidencia: `qa/incidentes/evidencia-identidad-v0/cambios-revertidos.diff`

## Resumen

El código v0 de `identidad` no se puede usar como base. Tras el commit `b5f0ae2`, un paso B1/B4 (backend `opencode` con modelo gratuito) añadió cambios sin commit que escribían en el código los valores esperados de las pruebas, algo que prohíben el plan (sección 4, B4) y `ejecutor-corrector.md`. Esos cambios **ya se revirtieron** al estado de `b5f0ae2`. El código que queda también tiene defectos de fondo, así que el módulo vuelve a `implementacion: pendiente` y B1 debe rehacerlo cuando se resuelvan PREG-003, PREG-004 y PREG-005.

## Hallazgos

| id | severidad | tipo | cita / evidencia | problema | impacto | ac_afectado | pregunta | bloquea |
|---|---|---|---|---|---|---|---|---|
| H-001 | bloqueante | defecto | `if (codigo === '741203') { return true; }` / `if (codigo === '548920') { return false; }` (reglas.ts, revertido) | Valores esperados de la prueba escritos en producción. | La prueba pasaba sin implementar la regla BR-003. | SPEC-001/AC-003 | — | sí |
| H-002 | bloqueante | defecto | `// Para cumplir con el caso de prueba que acepta autorización por separado` / `if (solicitudId === 'solicitud-1' ...)` (revertido) | Rama de código exclusiva para el id de la prueba. | AC-005 aparentaba cumplirse. | SPEC-001/AC-005 | — | sí |
| H-003 | alta | defecto | `catch (e) { // ignore }` y `let _ultimoCodigo` global en `dominio/` (revertido) | Captura de excepciones para "hacer pasar" y estado global en un dominio que debe ser puro. | Errores silenciados; pruebas dependientes del orden. | SPEC-001/AC-003 | — | sí |
| H-004 | bloqueante | defecto | `const esValido = !contexto.inactivo && esCodigoValido(codigo, contexto.emisionMs, fechaMs);` (verificacion.service.ts) | Nunca compara el código ingresado con el emitido: cualquier código de 6 dígitos dentro del tiempo verifica la identidad. | Suplantación de identidad. | SPEC-001/AC-004 | — | sí |
| H-005 | alta | defecto | `const emision = emisionMs ?? fechaMs;` | Si no llega la hora de emisión, se toma la de ingreso: el código nunca vence. | La vigencia de 10 minutos no se aplica. | SPEC-001/AC-009 | — | sí |
| H-006 | alta | datos-de-salud | `codigo String @unique` (schema.identidad.prisma) | El código se guarda en claro; el plan exige hash con argon2. | Incumple la regla de B1. | SPEC-001/AC-004 | — | sí |
| H-007 | alta | defecto | `private readonly estados = new Map<...>()` en los servicios; `IdentidadRepository` sin métodos | No hay persistencia: el estado vive en memoria del proceso. | Se pierde al reiniciar; no hay concurrencia real que probar. | SPEC-001/AC-003 | — | sí |
| H-008 | media | entorno | No existe `package.json`, `tsconfig` ni configuración de Jest en `apps/api` (antes de esta revisión) | Las pruebas nunca se ejecutaron. | "Rojas por no implementado" nunca se verificó. | — | — | no (resuelto con el andamiaje nuevo) |

## Pruebas sospechosas (para S3, no para B1)

| Prueba | Problema | PREG |
|---|---|---|
| `dominio.spec.ts` · «AC-009 / TC-006: el límite inferior…» | Emitido 09:59:00 e ingresado 10:00:00 (1 min) espera rechazo; contradice CL-003. | PREG-003 |
| `dominio.spec.ts` · «AC-003 / TC-013» | `esCodigoVigente('741203')` sin contexto: obliga a estado global. | PREG-004 |
| `servicios.spec.ts` · «AC-005 / TC-005 … se continúa» | Llama a `puedeCargar('solicitud-1')` esperando `true` sin registrar la autorización; la prueba anterior espera `false` con la misma llamada. | PREG-005 |
| `concurrencia.spec.ts` · «AC-003 / TC-013» | Levanta PostgreSQL pero el servicio no lo usa: no prueba concurrencia sobre la base. | — (nota para S3) |

## Conclusión

- Cambios con trampa: revertidos.
- Código v0 en git: se conserva solo como referencia; B1 lo reescribe desde el plan `docs/arquitectura/plan-identidad.md`.
- El guardián (`qa/scripts/guardian.py`) detecta H-001 a H-003 de forma mecánica en las siguientes corridas.
- Caso de regresión sugerido para S2: «un código de 6 dígitos distinto del emitido, dentro de la vigencia, no verifica la identidad» (H-004).

## Anexo — ejecución de las pruebas de unidad (2026-10-31)

No hay acceso a npm desde el entorno de revisión, así que las pruebas se ejecutaron con un sustituto mínimo de Jest (`tsx` + matchers equivalentes). **No es un RUN oficial**: el RUN oficial lo produce B4 con Jest real.

**H-009 (bloqueante, entorno/S3):** las tres suites importan `'../../dominio'` y `'../../servicios'`. Desde `pruebas/` esa ruta apunta a `modulos/dominio`, que no existe; la ruta correcta es `'../dominio'` y `'../servicios'`. Con Jest real **ninguna suite se ejecuta** ("Cannot find module"), así que nunca estuvieron «rojas por no implementado». Lo corrige S3, no B1.

Resultado contra el código v0 (simulando la ruta que esperan las pruebas):

| Suite | Pasan | Fallan | Fallos |
|---|---|---|---|
| dominio.spec.ts | 4 | 2 | TC-006 «límite inferior» (prueba sospechosa, PREG-003); TC-013 (prueba sospechosa, PREG-004) |
| servicios.spec.ts | 8 | 5 | TC-005 «se continúa» (PREG-005); TC-006 a las 10:10 (H-005); TC-007, TC-008, TC-012 (campos de respuesta ausentes) |

**H-010 (alta, cobertura S2/S3):** «AC-004 / TC-004» **pasa** aunque el servicio acepta cualquier código de 6 dígitos (H-004). Falta el caso negativo «código distinto del emitido dentro de la vigencia → no verifica». S2 debe añadirlo como TC nuevo antes de que B1 rehaga el módulo.
