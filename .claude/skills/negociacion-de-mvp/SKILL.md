---
name: negociacion-de-mvp
description: Formato y reglas para la negociación de máximo 2 rondas entre Especificaciones y Arquitectura sobre docs/mvp.md. Úsalo cuando Arquitectura diga que un requisito «Debe» no cabe y haya que reformularlo, dividirlo o escalarlo a una persona.
---
# Negociación del MVP

## Regla de propiedad

| Sección de `docs/mvp.md` | Dueño | El otro agente |
|---|---|---|
| `## Requisitos` | Especificaciones | Solo comenta en `## Observaciones`. |
| `## Corte técnico` | Arquitectura | Solo comenta en `## Observaciones`. |
| `## Observaciones` | Ambos | Solo comentarios, sin editar la sección ajena. |
| `## Registro de decisiones` | Ambos | Registra ronda, cambio, quién lo pidió y quién aprobó. |

Ninguno edita la sección del otro. Ninguno decide alcance solo.

## Rondas

- **Máximo 2 rondas** de negociación automática.
- Ronda 1: Arquitectura señala lo que no cabe; Especificaciones responde.
- Ronda 2: Especificaciones reformula, divide o baja de prioridad; Arquitectura actualiza el corte.
- Si persiste el desacuerdo, **decide una persona**. No hay ronda 3.

## Formato de observación (Arquitectura → Especificaciones)

```markdown
- OBS-001 (ronda 1, Arquitectura): SPEC-00x/RF-00y no cabe en 5 días por <razón>.
  Impacto: <qué se cae del MVP si entra>.
  Opciones: (a) dividir en <...>; (b) aplazar; (c) simular <...>.
  No decido: requiere respuesta de Especificaciones o de una persona.
```

## Formato de respuesta (Especificaciones → Arquitectura)

```markdown
- RES-001 (ronda 1, Especificaciones): acepto dividir SPEC-00x/RF-00y en <parte A> (Debe) y <parte B> (Debería).
  Justificación: <necesidad que respalda la parte A>.
  AC afectados: <AC-...>.
```

## Qué NO se negocia

- La transacción de reserva: real.
- Los datos de salud: nunca se simulan ni se aplazan.
- AC-36 (concurrencia): nunca se simula ni se aplaza.
- Una obligación legal (Ley 1581, autorizaciones, 48 horas).

Si una opción técnica rompe uno de estos puntos, Arquitectura no la propone y Especificaciones no la acepta. Se escala a la persona.

## Escalamiento a la persona

```markdown
- ESC-001 (ronda 2, sin acuerdo): <resumen del desacuerdo>.
  Opción A: <...> — costo/riesgo.
  Opción B: <...> — costo/riesgo.
  Recomendación (marcada como PROPUESTA): <...>.
  Decide: persona del equipo.
```

## Cierre

La persona escribe `aprobado_por` en `docs/mvp.md`. Hasta entonces, QA y Backend/Frontend no arrancan.
