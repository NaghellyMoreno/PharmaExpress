---
name: manejo-de-ambiguedades
description: Plantilla y reglas para registrar una ambigüedad como pregunta PREG-xxx sin inventar la respuesta. Úsalo en S1, S2 y B1–B4 cuando falte una decisión, una regla o un dato.
---
# Manejo de ambigüedades

Cuando falta información, **no se inventa**: se crea una pregunta en `docs/preguntas/PREG-xxx.md`.

## Plantilla

```markdown
# PREG-xxx. <Pregunta concreta>

Origen: <S1 / S2 / S3 / B1 / B2 / B3 / B4 / R1 / R2>
SPEC: <SPEC-00x / docs/mvp.md / sección>
Estado: abierta | respondida | descartada
Bloquea: sí | no
Fecha: AAAA-MM-DD

## Contexto
<Qué dice la SPEC o el contexto y qué falta. Cita la frase literal.>

## Por qué importa
<Qué caso, prueba, regla o módulo depende de la respuesta.>

## Opciones (si existen)
1. <opción> — consecuencia.
2. <opción> — consecuencia.

## Propuesta del agente (marcada como PROPUESTA)
<Opcional. Nunca se trata como decisión.>

## Respuesta del equipo
<Vacío hasta que una persona responda.>
```

## Reglas

1. Una pregunta por archivo; numeración `PREG-001`, `PREG-002`…
2. `Bloquea: sí` solo si impide seguir con el módulo, el caso o la prueba.
3. No conviertas la propuesta en decisión: la respuesta la da una persona.
4. Si la pregunta se resuelve, escribe la respuesta y cambia el estado; no borres el archivo.
5. Si la ambigüedad afecta a una SPEC, no la corrijas tú: S1 la reporta y Especificaciones la resuelve.
6. No incluyas datos reales de pacientes en la pregunta.
