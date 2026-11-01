# Documentación de Pharma Express — guía de agentes

Esta carpeta es la fuente de verdad del flujo Spec-Driven. Ningún agente decide alcance por su cuenta.

## Orden del flujo

```text
Necesidad
  → Agente de Especificaciones (SPEC-*)
  → Agente de Arquitectura (ARQ-*)
  → docs/mvp.md: Requisitos (Especificaciones) + Corte técnico (Arquitectura)
  → Puerta humana: una persona escribe aprobado_por en docs/mvp.md
  → QA shift-left: S1 revisa → S2 diseña casos y oráculos → S3 genera pruebas rojas
  → Puerta humana: aprobar oráculos
  → Backend/Frontend: B1, B2, B3 + B4 hasta verde
  → QA shift-right: R1 humo sobre el entorno desplegado
  → Puerta humana: aprobar entrega
```

## Quién es dueño de qué

| Archivo o carpeta | Dueño | Regla |
|---|---|---|
| `docs/specs/` | — | Solo documentación. Las SPEC aprobadas viven en `agentes-ia/salidas/specification-agent/aprobadas/` (única fuente). |
| `docs/arquitectura/` | Agente de Arquitectura | Incluye el stack aprobado y los ARQ. |
| `docs/mvp.md` → **Requisitos** | Especificaciones | Arquitectura no la edita; deja observaciones. |
| `docs/mvp.md` → **Corte técnico** | Arquitectura | Especificaciones no la edita; deja observaciones. |
| `docs/preguntas/` | Cualquier agente que detecte una ambigüedad | Una pregunta por archivo `PREG-xxx.md`. |
| `qa/revision/` | S1 | Informes de revisión estática. |
| `qa/casos/` | S2 | Casos `TC-*.md` con su oráculo. |
| `qa/trazabilidad.md` | S2, S3 y B4 | Se actualiza, no se reescribe a mano sin evidencia. |
| `apps/api/` y `apps/web/` | B1–B4 | B4 solo corrige código de producción. |
| `qa/ejecuciones/` | B4 y R1 | Registros `RUN-*.json`; solo se agregan. |
| `qa/humo/` | R1 | Reportes de humo. |
| `.claude/agents/` | Equipo | Un archivo por subagente. |
| `.claude/skills/` | Equipo | Un procedimiento repetible por carpeta. |
| `pipeline.json` | Orquestador | Estado del flujo; no es una decisión de alcance. |

## El stack tecnológico: ¿de quién es?

**Del Agente de Arquitectura.** El stack es una decisión técnica y una restricción de construcción, no un requisito de negocio. Por eso:

- **Especificaciones** no lo lee para priorizar; si necesita una decisión técnica, la deja como «tema para arquitectura».
- **Arquitectura** lo lee como entrada aprobada (`docs/arquitectura/propuesta-tecnologica.md`) y lo usa para el corte técnico y los ADR.
- **QA (S1–S3, R1–R2)** lo lee solo para elegir herramientas: Jest + Testcontainers, Playwright, grammY simulado, etc.
- **B1–B3** lo heredan en su prompt base y lo implementan.
- **B4** lo usa para ejecutar las pruebas, no para decidir tecnología.

## Puertas humanas

1. Aprobar la SPEC.
2. Aprobar `docs/mvp.md` (con `aprobado_por`).
3. Aprobar los oráculos (`qa/oraculos-pendientes.md`).
4. Aprobar la entrega (reporte de humo + `pipeline.json`).

Sin estas aprobaciones, el orquestador no habilita el siguiente paso.
