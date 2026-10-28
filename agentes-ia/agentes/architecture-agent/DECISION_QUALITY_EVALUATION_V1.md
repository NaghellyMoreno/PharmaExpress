# Evaluación controlada de Architecture Decision Quality V1

Los ocho casos reproducibles están en `tests/fixtures/decision_quality_cases_v1.json`. Cada caso proporciona documento, preflight, estado esperado y foco de revisión. El estado esperado es un criterio de evaluación, no una respuesta codificada en el agente.

## Procedimiento para una ejecución autorizada

1. Conservar una copia identificada del prompt anterior y del nuevo. Si no existe el prompt anterior verificable, marcar la comparación entre versiones `NOT_EVALUATED`; no usar una salida histórica con corpus o contrato distinto como baseline.
2. Ejecutar cada versión con el mismo documento, modelo, configuración, preflight y orden de fuentes. Usar una ejecución independiente por caso y versión. No modificar los documentos entre versiones.
3. Registrar JSON, Markdown, manifiesto de ejecución, identificador del prompt, estado, cantidad de llamadas y tokens reales reportados por Gemini. No registrar secretos.
4. Revisar cada salida contra las fuentes. Señalar afirmaciones sin respaldo, restricciones omitidas, categorías de alternativas mezcladas, contradicciones internas, ventajas y desventajas omitidas y preguntas bloqueantes o no bloqueantes mal clasificadas.
5. Comparar por caso la justificación, criterios, trade-offs, riesgos, invenciones, contradicciones, tokens y llamadas. Una salida que incumpla el contrato local se califica `FAIL` para coherencia estructural; no se reinterpreta como propuesta válida.
6. Dos personas del equipo revisan los casos sin conocer la versión del prompt. Registran diferencias y resuelven desacuerdos con citas de las fuentes. La decisión arquitectónica sigue siendo humana.

## Rúbrica humana por caso

| Dimensión | Pregunta de revisión |
| --- | --- |
| Pertinencia | ¿La propuesta responde al problema y evalúa alternativas del mismo nivel cuando corresponde? |
| Fidelidad a fuentes | ¿Cada premisa material y restricción atribuida al proyecto está respaldada por el documento o preflight? |
| Profundidad técnica | ¿Explica mecanismos, coordinación, consecuencias y límites sin prometer garantías automáticas? |
| Equilibrio | ¿Reconoce ventajas de descartadas y desventajas de la recomendada? |
| Justificación | ¿Se puede seguir la cadena necesidad → criterio → comparación → decisión → trade-off? |
| Incertidumbre | ¿Distingue pregunta bloqueante, duda no bloqueante, supuesto y propuesta? |
| Coherencia interna | ¿Matriz, recomendación, estructura, ADR, riesgos y preguntas son compatibles? |
| Ausencia de invenciones | ¿Evita tecnologías, métricas, restricciones y decisiones humanas no documentadas? |

Para cada dimensión registrar `PASS`, `PARTIAL`, `FAIL` o `NOT_EVALUATED`, con una cita breve de la entrada y otra de la salida que explique la calificación. No calcular una mejora porcentual a partir de estas categorías. En A y H revisar expresamente si el cambio de restricción altera justificadamente límites, valoración o recomendación; mantener la misma recomendación también puede ser válido si está defendido. En F comprobar que no se elige monolito por defecto. En G comprobar que no se trasladan hechos de otros proyectos.

La suite automática valida contrato y referencias; no califica estas ocho dimensiones semánticas. No se hizo ninguna ejecución real de Gemini para este incremento.
