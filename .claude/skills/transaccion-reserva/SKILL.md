---
name: transaccion-reserva
description: Patrón para reservar medicamento y cupo todo o nada con PostgreSQL, UPDATE condicional y rollback. Úsalo en B1 y en las pruebas de concurrencia AC-36.
---
# Transacción de reserva

## Problema

Dos personas confirman al mismo tiempo la última unidad o el último cupo. Sin transacción, ambas reservas pueden confirmarse y aparece una **sobre-reserva**.

## Patrón

```sql
BEGIN;

UPDATE reservas.inventario
SET disponible = disponible - :cantidad
WHERE punto_id = :punto
  AND medicamento_id = :medicamento
  AND disponible >= :cantidad;

-- Si el UPDATE anterior afectó 0 filas, ROLLBACK y responder "sin disponibilidad".

UPDATE reservas.ventana
SET ocupados = ocupados + 1
WHERE ventana_id = :ventana
  AND ocupados < capacidad;

-- Si el UPDATE anterior afectó 0 filas, ROLLBACK y liberar el inventario.

INSERT INTO reservas.reserva (...) VALUES (...);

COMMIT;
```

## Reglas

1. La condición (`disponible >= cantidad`, `ocupados < capacidad`) va **dentro del `WHERE`**. No leas el valor y luego actualices: eso abre la ventana de carrera.
2. Medicamento y cupo se confirman **juntos o ninguno**. Si un `UPDATE` no afecta filas, `ROLLBACK`.
3. El `COMMIT` solo ocurre si ambos `UPDATE` y el `INSERT` tuvieron éxito.
4. La reserva expira al terminar la ventana; el cupo y el inventario se liberan en la misma transacción de expiración.
5. Idempotencia: si llega un reintento de la misma confirmación, no dupliques la reserva. Usa una clave de idempotencia.
6. No implementes la reserva en memoria, en el frontend ni en el bot.

## Prueba obligatoria (AC-36)

```text
50 confirmaciones en paralelo sobre 10 unidades ⇒ máximo 10 reservas.
```

- Usa PostgreSQL real (Testcontainers), no un mock.
- Ejecuta las confirmaciones con `Promise.allSettled`.
- Verifica:
  - confirmadas ≤ 10;
  - inventario final = 0;
  - ninguna reserva con cantidad negativa;
  - las rechazadas reciben un mensaje genérico, sin datos de salud.

## Errores que no se aceptan

- `SELECT` seguido de `UPDATE` sin bloqueo.
- Bajar el número de intentos de la prueba para que pase.
- Capturar la excepción y devolver «ok».
- Confirmar la reserva y luego intentar descontar.
