---
name: cliente-api-tipado
description: Reglas para generar un cliente tipado de la API en apps/web/src/api y usarlo en todas las pantallas. Úsalo en B3 para evitar fetch suelto y mantener el contrato con el backend.
---
# Cliente API tipado

## Estructura

```text
apps/web/src/api/
├─ cliente.ts       instancia base (baseURL, cookies, errores)
├─ tipos.ts         tipos de DTO / OpenAPI
├─ identidad.ts     funciones del módulo identidad
├─ reservas.ts      funciones del módulo reservas
└─ indice.ts        exporta todo
```

## Reglas

1. Todas las llamadas pasan por `src/api/`. **Nada de `fetch` suelto en pantallas o componentes.**
2. Los tipos salen del contrato de la API (OpenAPI o DTO). No los inventes.
3. Las cookies httpOnly las pone el backend: `credentials: 'include'` cuando aplique, sin manipularlas.
4. Errores tipados: `{ codigo, mensaje }`; la UI decide cómo mostrarlos con plantillas fijas.
5. No registres cuerpos de respuesta con datos de salud en consola ni analítica.
6. No guardes datos de salud en `localStorage`.
7. Un cambio de contrato se refleja primero en `tipos.ts`; si el backend no lo tiene, es una PREG.

## Ejemplo

```ts
export async function reservar(entrada: EntradaReserva): Promise<Reserva> {
  const r = await cliente.post('/reservas', entrada);
  return r.data as Reserva;
}
```

## Verificación

- `grep -R "fetch(" apps/web/src` no devuelve llamadas fuera de `src/api/`.
- Los tipos compilan.
- Ningún `console.log` imprime datos de salud.
