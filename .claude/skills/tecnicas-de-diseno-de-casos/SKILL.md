---
name: tecnicas-de-diseno-de-casos
description: Elige y aplica la técnica de diseño de casos según el tipo de regla. Úsalo en S2 para derivar condiciones de prueba de cada AC con particiones de equivalencia, valores límite, tablas de decisión, transición de estados o Dado/Cuando/Entonces.
---
# Técnicas de diseño de casos

## Cuándo usar cada una

| Tipo de regla | Técnica | Ejemplo |
|---|---|---|
| Cantidades, tiempos, intentos, días | Particiones de equivalencia + valores límite | 30 unidades: 29, 30, 31; 10 min: 9:59, 10:00, 10:01. |
| Combinaciones de reglas de negocio | Tabla de decisión | Afiliación activa/inactiva × fórmula vigente/vencida × autorización sí/no. |
| Ciclos de vida | Transición de estados | Reserva: pendiente → confirmada → expirada/cancelada → dispensada. |
| Criterios de aceptación | Dado/Cuando/Entonces | Un caso por AC, más negativos y límites. |
| Flujos de usuario | Recorrido + alternativas | Camino feliz, error de validación, reintento. |
| Concurrencia | Ejecución paralela controlada | 50 confirmaciones sobre 10 unidades ⇒ máximo 10 reservas. |

## Procedimiento

1. Lee el AC y subraya las condiciones y el resultado observable.
2. Identifica los parámetros de entrada y sus rangos.
3. Aplica la técnica y escribe las condiciones de prueba.
4. Para cada condición, crea un `TC-xxx` con precondiciones, pasos, datos y resultado esperado.
5. Asigna el oráculo con `politica-de-oraculos`.
6. Añade al menos un caso negativo y uno de límite por regla numérica.
7. Si la SPEC menciona concurrencia, escribe el caso paralelo con el número exacto de intentos y el máximo esperado.

## Tabla de decisión (ejemplo)

| # | Afiliación | Fórmula vigente | Autorización | Resultado |
|---|---|---|---|---|
| 1 | activa | sí | sí | prevalidación apta |
| 2 | activa | sí | no | no apta: mostrar trámite de la EPS |
| 3 | activa | no | — | no apta: nueva valoración |
| 4 | inactiva | — | — | detener solicitud y orientar a la EPS |

## Reglas

- Un AC puede generar varios TC; un TC puede cubrir un solo AC.
- No dupliques casos con los mismos valores de equivalencia.
- Los datos son sintéticos.
- Si no puedes decidir el resultado esperado, no inventes: `PREG-xxx`.
