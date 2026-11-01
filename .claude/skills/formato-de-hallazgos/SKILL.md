---
name: formato-de-hallazgos
description: Formato único para reportar hallazgos de revisión, humo o triage, con id, severidad, cita o evidencia, impacto y AC afectado. Úsalo en S1, R1 y R2.
---
# Formato de hallazgos

Todo hallazgo debe poder defenderse con una cita o una evidencia. **Sin cita, no hay hallazgo.**

## Tabla

| Campo | Contenido |
|---|---|
| `id` | `H-001`, `H-002`… único dentro del informe. |
| `severidad` | `bloqueante` · `alta` · `media` · `menor`. |
| `tipo` | `verificabilidad` · `ambigüedad` · `completitud` · `consistencia` · `trazabilidad` · `defecto` · `entorno` · `datos-de-salud`. |
| `cita` | Frase literal de la SPEC o evidencia (línea de log, captura, respuesta HTTP). |
| `problema` | Qué está mal, en una frase. |
| `impacto` | Qué caso, prueba, AC o flujo queda sin cubrir. |
| `ac_afectado` | `SPEC-00x/AC-00y` o `—`. |
| `pregunta` | Pregunta sugerida para resolverlo (si aplica). |
| `bloquea` | `sí` · `no`. |

## Severidad

- `bloqueante`: impide diseñar o ejecutar; requisito no verificable, contradicción, AC ausente en un `Debe`.
- `alta`: defecto funcional o riesgo de datos de salud.
- `media`: ambigüedad que puede resolverse con una pregunta no bloqueante.
- `menor`: estilo, redacción, requisito fuera del MVP.

## Ejemplo

```markdown
| H-003 | bloqueante | verificabilidad | «El sistema responde rápido» | No hay umbral observable | S2 no puede diseñar el caso | SPEC-004/AC-012 | ¿Cuál es el tiempo máximo aceptable? | sí |
```

## Reglas

1. Un hallazgo = una fila. No agrupes problemas distintos.
2. No inventes la cita: cópiala exactamente.
3. En R1/R2 enmascara cédulas, teléfonos, correos y datos de salud.
4. Separa los hallazgos de las hipótesis: una hipótesis no es un defecto confirmado.
5. Cierra con un veredicto o una conclusión, no solo con la tabla.
