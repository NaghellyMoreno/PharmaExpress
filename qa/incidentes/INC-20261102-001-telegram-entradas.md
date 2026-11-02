# INC-20261102-001. Revisión del bot de Telegram en `apps/api/src/entradas/telegram`

Fecha: 2026-11-02
Origen: revisión externa del pipeline (no es un triage de R2 sobre un entorno desplegado)
Módulo: `entradas/telegram` (construido fuera de `modulos/`, atribuible a B2 backend-bot-telegram; SPEC-002 v1.2)
Commit revisado: cambios sin commit (sin confirmar en git; ver `git status`)
Evidencia: `apps/api/src/entradas/telegram/telegram.service.ts`, `telegram.module.ts`, `telegram.controller.ts`, `templates.ts`

## Resumen

El código de `entradas/telegram` no se puede usar como base. No tiene ninguna prueba de unidad propia (no existe una carpeta `pruebas/` bajo `entradas/telegram`, y `jest.config.js` solo detecta `**/pruebas/**/*.spec.ts`), lo que contradice la regla dura «sin pruebas de unidad no construye: pide S3». Además, implementa un flujo de verificación de identidad por conversación de chat (pide cédula y luego código como mensajes de texto sueltos) que contradice directamente **DEC-P10** y SPEC-002 v1.2: *«el chat solo lleva avisos con plantilla fija... la carga de documentos, la confirmación y los resultados se hacen en la Mini App»*. El plan aprobado (`docs/arquitectura/plan-telegram.md`) describe un diseño distinto: validación criptográfica de `initData` de la Mini App, `OtpService`/`ChatLinkService` y un `WebhookController`, no un intercambio de texto libre en el chat. El módulo vuelve a `implementacion: pendiente` y B2 debe rehacerlo desde `docs/arquitectura/plan-telegram.md`, con pruebas primero (S3).

## Hallazgos

| id | severidad | tipo | cita / evidencia | problema | impacto | ac_afectado | pregunta | bloquea |
|---|---|---|---|---|---|---|---|---|
| H-001 | bloqueante | arquitectura | `telegram.service.ts`: estados `awaitingCedula`/`awaitingCode` leídos de `ctx.message.text` | La verificación de identidad (cédula + código) se hace por mensajes de texto en el chat, no en la Mini App. | Contradice DEC-P10 y SPEC-002 v1.2: el chat debe limitarse a avisos con plantilla fija. | SPEC-002/RF-013, DEC-P10 | — | sí |
| H-002 | bloqueante | entorno | No existe `apps/api/src/entradas/telegram/pruebas/` ni ningún `*.spec.ts` para este código | Se construyó sin pruebas de unidad previas (S3). | No hay oráculo para verificar el comportamiento; cualquier aserción sobre el código sería inventada. | — | — | sí |
| H-003 | alta | defecto | `this.bot.addUpdateHandler(...)`, `this.bot.sendMessage(...)` (`telegram.service.ts:21,33,40,50...`) | grammY no expone `addUpdateHandler` ni `sendMessage` en `Bot`; los handlers van con `bot.on(...)` y los envíos con `ctx.reply(...)` o `bot.api.sendMessage(...)`. | No compila (`tsc --noEmit` falla). | — | — | sí |
| H-004 | alta | defecto | `if (state.step === 'awaitingCedula') { ... await this.identiteService.requestOtp(text); ...}` dentro de un callback sin `async` (`telegram.service.ts:21,46-58`) | `await` fuera de una función `async`: error de sintaxis/compilación (TS1308). | No compila. | — | — | sí |
| H-005 | media | defecto | `import { IdentidadService } from '../../identidad/identidad.service'`, `import { CanalesService } from '../../canales/canales.service'`, `import { CanalesModule } from '../../canales/canales.module'` | Esos módulos/archivos no existen: `identidad` expone `IdentidadApi` (`api/identidad.api.ts`), y `canales` no tiene `canales.module.ts` ni un `CanalesService` con `linkChat`; su servicio real es `CanalesServicio` (`servicios/canales.servicio.ts`). | `Cannot find module` (TS2307); el código nunca pudo haberse ejecutado. | — | — | sí |
| H-006 | media | arquitectura | `entradas/telegram` importa servicios internos de `identidad` y `canales` en vez de su `api/` | Viola la frontera de módulos de `nestjs-modulo-estandar`: «un módulo solo accede a datos ajenos por la `api/` del otro módulo». | Acopla el canal a la implementación interna de otros módulos. | — | — | no (se corrige al rehacer) |

## Conclusión

- No se modificó ni se intentó «arreglar» este código: hacerlo habría significado legitimar una arquitectura (OTP por chat) que nadie aprobó, y escribir aserciones sin oráculo.
- `entradas/telegram` queda señalado como base no válida; B2 debe reconstruirlo siguiendo `docs/arquitectura/plan-telegram.md` (Mini App + `initData` + webhook), con la skill `grammy-handlers`, y generando primero las pruebas (S3) antes de implementar.
- Caso de regresión sugerido para S2: «un mensaje de texto con cédula o código enviado directamente al chat (fuera de la Mini App) no verifica identidad ni se procesa; el bot responde solo con la plantilla fija y el botón a la Mini App» (cubre H-001).
