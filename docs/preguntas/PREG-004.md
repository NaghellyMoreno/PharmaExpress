# PREG-004 — Firma del predicado `esCodigoVigente` (contexto)

**Origen:** SPEC-001 v1.5 / AC-003 / TC-013 / módulo identidad
**Estado:** resuelta
**Bloquea:** no
**Decisión:** Segundo argumento `esCodigoVigente(codigo, contexto?)`. El TC debe pasar el contexto con el código vigente.

## Pregunta
¿Cómo debe recibir `esCodigoVigente` el contexto del código vigente (código, emisión, intentos, inactivo) sin usar estado global? ¿Se pasa como segundo argumento `ContextoCodigoVigente` o se cambia la firma a `(codigo, contexto)`?

## Contexto
La prueba TC-013 llama `esCodigoVigente('741203')` con un solo argumento. La función pura no puede saber cuál es "el último" sin estado. Requiere decisión de SPEC/S2 sobre la firma del predicado.

## Propuesta
Cambiar la firma a `esCodigoVigente(codigo: string, contexto?: ContextoCodigoVigente): boolean` y actualizar el TC para pasar el contexto.