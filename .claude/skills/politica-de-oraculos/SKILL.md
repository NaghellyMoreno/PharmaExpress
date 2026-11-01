---
name: politica-de-oraculos
description: Decide el tipo de aserción según el origen del dato esperado. Úsalo al diseñar casos (S2), escribir pruebas (S3) o corregir fallos (B4). Evita calcular el valor esperado a partir del código bajo prueba.
---
# Política de oráculos

El **oráculo** es la fuente que dice si el resultado observado es correcto. No se inventa: se deriva del origen del dato.

| Origen del dato | Qué hacer | Tipo de aserción |
|---|---|---|
| `APROBADO` | Dato aprobado por una persona. | Definitiva. |
| `CONFIRMADO` | Dato del contexto, de la SPEC o de una respuesta del equipo. | Definitiva. |
| `INFERENCIA` | Conclusión del agente, aún no confirmada. | Marcada `@supuesto`; si falla, **preguntar, no corregir**. |
| `PROPUESTA` | Idea sin aprobación. | No hay caso: crear `PREG-xxx`. |

## Reglas

1. Nunca calcules el valor esperado a partir del código bajo prueba. Eso convierte la prueba en una tautología.
2. Un oráculo `@supuesto` que falla no se «arregla» cambiando la prueba: se escala a una persona.
3. Un TC sin oráculo identificable no existe.
4. Si dos fuentes se contradicen, gana la de mayor autoridad: persona > contexto/SPEC aprobada > inferencia del agente.
5. Los datos de salud solo se verifican con datos sintéticos.

## Etiqueta en pruebas

```ts
// Oráculo definitivo
it('AC-36 / TC-041: 50 confirmaciones sobre 10 unidades dejan máximo 10 reservas', ...)

// Oráculo supuesto
it('@supuesto AC-12 / TC-018: ...', ...)
```

## Cuándo preguntar

- No hay fuente para el resultado esperado.
- La fuente es una inferencia y la prueba falla.
- La fuente contradice la SPEC o el contexto.
- El resultado depende de una regla que no está escrita.
