---
name: grammy-handlers
description: Patrón para handlers de grammY en Pharma Express, con webhook, vinculación por identidad, plantillas fijas y pruebas con updates simulados. Úsalo en B2.
---
# Handlers de grammY

## Estructura

```text
apps/api/src/entradas/telegram/
├─ telegram.module.ts
├─ bot.ts              crea el bot y registra handlers
├─ handlers/           comandos y callbacks
├─ plantillas.ts       todos los textos fijos
└─ pruebas/            updates simulados
```

## Reglas

- El handler **solo** llama a la `api/` del módulo. No contiene reglas de negocio.
- No crea tablas ni usa Prisma directamente.
- La vinculación usa el flujo de identidad (cédula + código). Nunca guardes la cédula en el estado de la conversación.
- Todos los textos salen de `plantillas.ts`; no se interpolan medicamentos ni diagnósticos.
- Comandos desconocidos y errores: mensaje genérico.
- Webhook en el mismo servidor NestJS; token solo por variable de entorno.
- Pruebas con `bot.handleUpdate(update)`; nunca llames a Telegram real.

## Plantilla de handler

```ts
bot.command('start', async (ctx) => {
  await ctx.reply(PLANTILLAS.inicio);
});

bot.on('message:text', async (ctx) => {
  await ctx.reply(PLANTILLAS.noReconocido);
});
```

## Verificación

- La respuesta no contiene `medicamento`, `diagnóstico`, `cédula` ni nombres reales.
- El segundo mensaje del mismo flujo no duplica la acción.
- Los errores no filtran detalles internos.
