# SPECs — fuente de verdad

Aquí viven las SPEC aprobadas y congeladas que alimentan el flujo.

## Ubicación canónica (decisión del 2026-10-31)

**La única fuente de SPEC aprobadas es `agentes-ia/salidas/specification-agent/aprobadas/`.**
El runner del Agente de Especificaciones la escribe y la congela solo; copiarlas aquí
crearía dos fuentes de verdad. Esta carpeta queda para documentación del flujo.
El orquestador (`orquestador.py`) considera aprobada una SPEC solo si existe allí con
«Estado: Aprobada y congelada», y guarda su hash para detectar cambios.

Estructura:

```text
agentes-ia/salidas/specification-agent/
├── aprobadas/       ← solo versiones aprobadas y congeladas
├── borradores/
└── registro.md
```

S1, S2, S3 y el Agente de Arquitectura leen de `agentes-ia/salidas/specification-agent/aprobadas/`. Las candidatas en `borradores/` no entran al flujo. No muevas ni renombres una SPEC aprobada sin registrar el cambio.

## Reglas

- Solo una SPEC en estado **Aprobada y congelada** entra al flujo de arquitectura y QA.
- Cada SPEC conserva su identificador (`SPEC-00x`) y su versión (`vX.Y`).
- Una SPEC aprobada no se edita: se crea una versión nueva con análisis de impacto.
- La numeración de RF/BR/AC se repite entre SPECs: cita siempre con el identificador calificado (`SPEC-004/AC-036`).
- No copies datos reales de pacientes en una SPEC ni en sus ejemplos.
