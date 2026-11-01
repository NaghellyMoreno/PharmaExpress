---
name: criterios-calidad-de-spec
description: Lista de comprobación para revisar si una SPEC es verificable, no ambigua, completa, consistente y trazable. Úsalo en S1 antes de diseñar casos o escribir pruebas.
---
# Criterios de calidad de una SPEC

## 1. Verificable

- Existe una observación concreta que dice pasa/no pasa.
- El resultado esperado es observable desde fuera del sistema.
- No depende de «que funcione bien» ni de la opinión de quien prueba.

## 2. No ambigua

Señala y cita:

- Términos vagos: «rápido», «adecuado», «fácil», «amigable», «óptimo», «según corresponda».
- Sujeto omitido: «se valida», «se notifica» (¿quién?).
- «Etc.», «y demás», «entre otros».
- Números sin unidad o sin límite.
- Dos reglas distintas para el mismo caso.

## 3. Completa

- Casos de error y excepción.
- Valores límite: por debajo, en el límite y por encima.
- Estados y transiciones.
- Quién ejecuta la acción y con qué verificación.
- Qué pasa si falla una dependencia externa.

## 4. Consistente

- No choca con otro REQ/RF, BR, AC, flujo o caso límite.
- Los mismos números en todas las secciones (10 minutos, 3 intentos, 48 horas, 90 días, 30 unidades).
- Coincide con `PHARMA_EXPRESS_AGENTES.md`, sección 3.
- No contradice el contexto normativo 3.11.

## 5. Trazable

- Cada REQ/RF tiene ≥1 AC.
- Cada AC apunta a un REQ/RF.
- Cada BR y cada CL crítico tiene AC.
- La sección de trazabilidad no tiene huecos.

## Valores límite obligatorios

| Valor | Debajo | En el límite | Por encima |
|---|---|---|---|
| 30 unidades | sí | sí | sí |
| 10 minutos | sí | sí | sí |
| 3 intentos | sí | sí | sí |
| 48 horas | sí | sí | sí |
| 90 días | sí | sí | sí |

## Veredicto

- `APTA`: sin hallazgos bloqueantes.
- `APTA_CON_RESERVAS`: hallazgos no bloqueantes o preguntas abiertas.
- `NO_APTA`: al menos un bloqueante. El módulo se detiene.
