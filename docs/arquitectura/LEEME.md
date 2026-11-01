# Arquitectura — documentos y dueño

Esta carpeta la escribe el **Agente de Arquitectura**. Contiene:

| Archivo | Qué es |
|---|---|
| `propuesta-tecnologica.md` | **Stack aprobado** por el equipo. Restricción de entrada, no propuesta a debatir. |
| `ARQ-00x.md` | Propuesta de arquitectura por SPEC o épica, con drivers, alternativas, ADR y trazabilidad. |
| `plan-<modulo>.md` | Plan de 5–8 pasos que escribe B1 antes de implementar un módulo. |

## ¿De quién es el stack?

Del **Agente de Arquitectura**. No del Agente de Especificaciones (las SPEC no eligen tecnología) ni de QA (QA solo lo usa para elegir herramientas).

- Arquitectura lo lee en el modo «Cortar MVP» y en los ADR.
- S1–S3 y R1–R2 lo leen para saber con qué se prueba: Jest + Testcontainers, Playwright, grammY, PostgreSQL.
- B1–B3 lo heredan como stack de implementación.
- B4 lo usa para ejecutar, no para decidir.

## Reglas

- Una arquitectura por ejecución; si hay varias independientes, se divide y se pregunta.
- Cada decisión relevante lleva su ADR.
- No se inventan drivers que ninguna SPEC pida; se preguntan.
- La trazabilidad llega hasta `Implementación/TEST` como «pendiente de QA».
- Ningún ARQ se marca como aprobado por el agente: lo aprueba una persona.
