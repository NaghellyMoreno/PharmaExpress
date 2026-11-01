---
name: plantilla-jest-nestjs
description: Estructura de pruebas para el stack aprobado Jest + Testcontainers + Playwright + grammY simulado. Úsalo en S3 al convertir casos TC-* en pruebas ejecutables que fallan primero.
---
# Plantilla Jest + NestJS + Testcontainers + Playwright

## Dónde va cada prueba

| Qué se prueba | Herramienta | Ubicación |
|---|---|---|
| Reglas de dominio puras | Jest unitario | `apps/api/src/modulos/<x>/pruebas/dominio.spec.ts` |
| Servicios y API | Jest + Nest Testing | `apps/api/src/modulos/<x>/pruebas/servicios.spec.ts` |
| Base de datos y transacciones | Jest + Testcontainers PostgreSQL | `apps/api/src/modulos/<x>/pruebas/integracion.spec.ts` |
| Concurrencia | Jest + Testcontainers + `Promise.all` | `apps/api/src/modulos/reservas/pruebas/concurrencia.spec.ts` |
| Flujos web | Playwright | `apps/web/e2e/<flujo>.spec.ts` |
| Bot Telegram | grammY con updates simulados | `apps/api/src/entradas/telegram/pruebas/` |
| SMS / correo | Stub/spy del proveedor | junto al servicio que los usa |

## Convención de nombres

```ts
it('AC-36 / TC-041: 50 confirmaciones sobre 10 unidades dejan máximo 10 reservas', async () => { ... });
it('@supuesto AC-12 / TC-018: ...', async () => { ... });
```

## Unitario (dominio)

```ts
describe('Reserva', () => {
  it('AC-31 / TC-001: no reserva si el cupo está lleno', () => {
    const ventana = crearVentana({ capacidad: 1, ocupados: 1 });
    expect(puedeReservar(ventana)).toBe(false);
  });
});
```

## Integración con Testcontainers

```ts
import { PostgreSqlContainer } from '@testcontainers/postgresql';

let container: StartedPostgreSqlContainer;

beforeAll(async () => {
  container = await new PostgreSqlContainer().start();
  // aplicar migraciones del módulo
}, 60_000);

afterAll(async () => { await container.stop(); });
```

## Concurrencia (AC-36)

```ts
it('AC-36 / TC-036: 50 confirmaciones sobre 10 unidades dejan máximo 10 reservas', async () => {
  const intentos = Array.from({ length: 50 }, () => confirmarReserva(datos));
  const resultados = await Promise.allSettled(intentos);
  const confirmadas = resultados.filter(r => r.status === 'fulfilled' && r.value.ok).length;
  expect(confirmadas).toBeLessThanOrEqual(10);
});
```

## grammY simulado

```ts
const update = { message: { text: '/start', chat: { id: 1 } } } as Update;
await bot.handleUpdate(update);
expect(respuestas[0]).toContain('Tu reserva');
expect(respuestas[0]).not.toMatch(/medicamento|diagnóstico/i);
```

## Reglas

1. La prueba debe fallar por «no implementado», no por error de sintaxis.
2. No toques código de producción.
3. No uses `skip`/`only` para evitar fallos.
4. Datos sintéticos y plantillas fijas.
5. Toda prueba debe poder rastrearse a un `TC` y un `AC`.
