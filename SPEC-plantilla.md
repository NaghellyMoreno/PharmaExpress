# SPEC-XXX: [Nombre de la funcionalidad]

- **Versión:** v0.1
- **Estado:** Borrador | En revisión | Aprobada | Congelada (FROZEN)
- **Fecha:** AAAA-MM-DD
- **Autor (agente):** Specification Agent
- **Responsable humano de aprobación:** [Nombre / rol]

> **Convención de origen de la información.** Cada requisito, regla o criterio debe indicar su origen:
> - `[CONFIRMADO]`: lo dijo explícitamente una persona responsable.
> - `[INFERENCIA]`: deducido por el agente; requiere validación.
> - `[PROPUESTA]`: sugerido por el agente; requiere decisión.
> - `[APROBADO]`: decisión validada por un humano.
>
> Una inferencia nunca debe convertirse silenciosamente en una regla de negocio.

---

## 1. Objetivo

[Qué se quiere lograr con esta funcionalidad y por qué. Una o dos frases.]

## 2. Contexto

- **Contexto del negocio:** [descripción breve]
- **Documentos o decisiones previas relacionadas:** [referencias]
- **Glosario relevante:**
  - **[Término]:** [definición]
  - **[Término]:** [definición]

## 3. Alcance

- **Incluido:**
  - [Elemento 1]
  - [Elemento 2]
- **Excluido:** ver sección 14 (Fuera de alcance)

## 4. Actores

- **[Actor 1]:** [rol y qué busca lograr con el sistema]
- **[Actor 2]:** [rol y qué busca lograr con el sistema]
- **Partes interesadas:** [quiénes se ven afectados sin interactuar directamente]

## 5. Requisitos funcionales

- **RF-001** `[origen]`: El sistema debe [comportamiento verificable].
  - Trazabilidad: REQ-XXX
- **RF-002** `[origen]`: El sistema debe [comportamiento verificable].
  - Trazabilidad: REQ-XXX

## 6. Requisitos no funcionales

- **RNF-001** `[origen]`: [Operación] debe [condición de calidad medible] bajo [condiciones de carga o contexto].
  - Si el valor aún no está definido, **no inventarlo**: registrarlo como `OPEN-Q-XXX`.

## 7. Reglas de negocio

- **BR-001** `[origen]`: [Regla del dominio, sin decisiones técnicas.]
- **BR-002** `[origen]`: [Regla del dominio, sin decisiones técnicas.]

### 7.1. Estados y transiciones (si aplica)

- **Estados posibles:** [ESTADO A] → [ESTADO B] → [ESTADO C]
- **Estados terminales:** [ESTADO X], [ESTADO Y]
- **Transiciones:**
  - [ESTADO A] → [ESTADO B]
    - Actor que la provoca: [actor]
    - Condiciones: [condiciones]

## 8. Flujos principales

- **FP-001: [Nombre del flujo]**
  - Actor: [actor]
  - Precondiciones: [condiciones]
  - Pasos:
    1. [Paso 1]
    2. [Paso 2]
    3. [Paso 3]
  - Resultado esperado: [resultado]

## 9. Flujos alternativos y excepciones

- **FA-001 (alternativa):** [Situación] → [comportamiento esperado del sistema]
- **FE-001 (excepción):** [Situación de error o fallo] → [comportamiento esperado del sistema]

## 10. Casos límite

- **CL-001:** [Situación extrema o poco frecuente]
  - ¿Requiere especificación explícita? Sí / No / Por decidir
  - Comportamiento esperado: [descripción o `OPEN-Q-XXX`]

## 11. Criterios de aceptación

- **AC-001** (cubre RF-001 / BR-001)
  - **Dado** [precondición]
  - **cuando** [acción del actor o evento]
  - **entonces** [resultado observable]
- **AC-002** (cubre RF-002 / BR-002)
  - **Dado** [precondición]
  - **cuando** [acción del actor o evento]
  - **entonces** [resultado observable]

### 11.1. Escenarios en formato Gherkin (opcional)

```gherkin
Feature: [Nombre de la funcionalidad]

  Scenario: [Nombre del escenario]
    Given [precondición]
    When [acción]
    Then [resultado esperado]
    And [resultado adicional]
```

## 12. Dependencias

- [Dependencia 1: otra SPEC, sistema externo, decisión pendiente, etc.]
- [Dependencia 2]

## 13. Restricciones

- [Restricción legal, contractual, de negocio, de seguridad, de experiencia de usuario, etc.]
- Nota: aquí no se eligen tecnologías ni arquitectura; eso corresponde al Architecture Agent.

## 14. Fuera de alcance

- [Elemento explícitamente excluido 1]
- [Elemento explícitamente excluido 2]

## 15. Preguntas abiertas

- **OPEN-Q-001:** [Pregunta]
  - Estado: Pendiente | Respondida | Descartada
  - Responsable: [Producto / Negocio / Legal / otro]
  - Impacto si no se responde: [qué queda bloqueado]
  - Respuesta: [completar cuando se resuelva]
- **OPEN-Q-002:** [Pregunta]
  - Estado: Pendiente
  - Responsable: [rol]
  - Impacto si no se responde: [...]
  - Respuesta: —

> Si existen preguntas críticas sin respuesta, la SPEC **no** debe cerrarse ni congelarse.

## 16. Trazabilidad

- **REQ-001** → SPEC-XXX → RF-001 / BR-001 → AC-001 → TASK-XXX *(lo completa el Planning Agent)* → TEST-XXX *(lo completa QA)*
- **REQ-002** → SPEC-XXX → RF-002 / BR-002 → AC-002 → TASK-XXX → TEST-XXX

## 17. Historial de cambios

- **v0.1** (AAAA-MM-DD): Borrador inicial generado por el Specification Agent.
- **v1.0** (AAAA-MM-DD): [Cambios tras respuestas humanas.]
  - Cambios: [descripción]
  - Impacto evaluado en: [reglas, estados, interfaz, servicios, notificaciones, pruebas]
  - Aprobado por: [nombre / rol]

---

## Control de aprobación

- [ ] Objetivo y alcance revisados
- [ ] Reglas de negocio aprobadas
- [ ] Criterios de aceptación críticos aprobados
- [ ] Restricciones con impacto contractual, económico, legal, de seguridad o de UX aprobadas
- [ ] Sin preguntas abiertas críticas
- **Aprobado por:** [nombre / rol]
- **Fecha de aprobación:** AAAA-MM-DD
- **Estado final:** SPEC FROZEN
