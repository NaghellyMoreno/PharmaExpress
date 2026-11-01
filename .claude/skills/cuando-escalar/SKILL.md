---
name: cuando-escalar
description: Condiciones para detener un bucle automático y preguntar a una persona. Úsalo en B4 cuando un fallo no avanza, afecta una aserción, concurrencia o datos de salud. Evita bucles infinitos y arreglos que ocultan defectos.
---
# Cuándo escalar

Escala a una persona (y deja de corregir) cuando se cumpla **cualquiera** de estas condiciones:

## Por número de intentos

- 3 iteraciones sin que la prueba pase.
- El mismo error aparece dos veces seguidas sin cambio en el código.
- El tiempo de ejecución o el consumo de recursos crece sin explicación.

## Por el tipo de arreglo

- El arreglo exige cambiar una SPEC, un AC, un TC o un oráculo.
- El arreglo exige tocar una prueba (`*.test.*`, `*.spec.*`, `e2e/`, `pruebas/`).
- El arreglo exige `skip`, `only`, bajar un umbral o capturar una excepción para ocultar el fallo.
- El valor esperado no está en el TC y habría que «deducirlo» del código.

## Por el dominio

- Falla una prueba de **concurrencia** (por ejemplo, AC-36).
- Falla una prueba de **datos de salud** (mensajes o logs con medicamentos, diagnósticos o cédulas).
- Falla la transacción de reserva o aparece una sobre-reserva.
- El fallo afecta una obligación legal (Ley 1581, autorizaciones, 48 horas).
- No hay SPEC o decisión para el comportamiento esperado.

## Por el entorno

- El fallo es de infraestructura (contenedor, puerto, migración, credenciales) y no se reproduce de forma determinista.
- El entorno de prueba no está disponible o no coincide con la versión desplegada.

## Cómo escalar

1. Detén el bucle. No sigas «probando suerte».
2. Crea o actualiza `docs/preguntas/PREG-xxx.md` con:
   - la prueba y el error exacto;
   - las iteraciones hechas y qué cambió en cada una;
   - la evidencia (log enmascarado);
   - la decisión que necesitas.
3. Marca el TC como `escalado` en `qa/trazabilidad.md`.
4. Devuelve un resumen con: qué falla, qué probaste, qué necesitas y qué no tocarás.
