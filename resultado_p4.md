# SPEC-002: Gestión de Solicitudes con Medicamentos Mixtos (Agudos y Crónicos)

- **Versión:** v0.1
- **Estado:** Borrador
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

Establecer el comportamiento del sistema cuando una solicitud contiene simultáneamente medicamentos de tipo agudo y crónico, aplicando la regla de agendamiento unificado para garantizar que no se dividan citas por tipo de tratamiento dentro de la misma solicitud. `[CONFIRMADO: contexto §3.5 y respuesta del equipo]`

## 2. Contexto

- **Contexto del negocio:** La necesidad original proponía agendar los medicamentos agudos para el mismo día y crear una cita separada al día siguiente para los crónicos. Por decisión del equipo y conforme al contexto aprobado, se ajusta la regla para mantener un agendamiento unificado por punto y solicitud. `[CONFIRMADO: contexto §3.5 y respuesta del equipo]`
- **Documentos o decisiones previas relacionadas:** Sección 3.5 del Contexto Aprobado de Pharma Express y SPEC-001. `[CONFIRMADO: contexto §3.5]`
- **Glosario relevante:**
  - **Tratamiento agudo o crónico:** Clasificación de una fórmula según el diagnóstico de la historia clínica. `[CONFIRMADO: contexto §2.4]`
  - **Cita:** Ventana escogida en un punto para recoger los medicamentos reservados en ese punto. `[CONFIRMADO: contexto §2.4]`
  - **Reserva:** Existencias y cupo apartados para una cita. `[CONFIRMADO: contexto §2.4]`

## 3. Alcance

- **Incluido:**
  - Evaluación y tratamiento de solicitudes que contengan una mezcla de medicamentos agudos y crónicos. `[CONFIRMADO: contexto §3.5]`
  - Aplicación de la regla de agendamiento unificado (regla del crónico) cuando la solicitud incluye algún medicamento crónico. `[CONFIRMADO: contexto §3.5]`
  - Confirmación atómica de la reserva para toda la solicitud por punto. `[CONFIRMADO: contexto §3.5]`
- **Excluido:** ver sección 14 (Fuera de alcance)

## 4. Actores

- **Paciente:** Afiliado que gestiona sus fórmulas (agudas, crónicas o mixtas) por la web o por Telegram. Incluye a cuidadores, tutores o facilitadores comunitarios. `[CONFIRMADO: contexto §2.3 y §3.3]`
- **Inventario simulado:** Fuente de existencias por medicamento y por punto. `[CONFIRMADO: contexto §2.3]`

## 5. Requisitos funcionales

- **RF-001** `[CONFIRMADO: contexto §3.5]`: El sistema debe determinar el tipo de tratamiento (agudo o crónico) a partir del diagnóstico de la historia clínica para cada fórmula de la solicitud.
  - Trazabilidad: REQ-004
- **RF-002** `[CONFIRMADO: contexto §3.5]`: El sistema debe aplicar la regla del tratamiento crónico (agendamiento exclusivamente para el día calendario siguiente) a toda la cita si la solicitud incluye algún medicamento crónico.
  - Trazabilidad: REQ-005

## 6. Requisitos no funcionales

- **RNF-001** `[PENDIENTE]`: [Operación] debe [condición de calidad medible] bajo [condiciones de carga o contexto].
  - Estado: `OPEN-Q-001`

## 7. Reglas de negocio

- **BR-001** `[CONFIRMADO: contexto §3.5]`: No se crean citas separadas por tipo de tratamiento. Si una cita incluye algún medicamento crónico, aplica la regla del crónico (solo el día calendario siguiente).
- **BR-002** `[CONFIRMADO: contexto §3.5]`: La reserva se hace por solicitud, se agenda una cita por punto, y la confirmación es atómica: las citas de una misma fórmula se reservan todas o ninguna.

### 7.1. Estados y transiciones (si aplica)

- **Estados posibles:** Prevalidación Aprobada → Selección de Cita (Mixta) → Reserva Atómica Confirmada
- **Estados terminales:** Reserva Confirmada, Reserva Rechazada por Concurrencia.
- **Transiciones:**
  - Prevalidación Aprobada → Selección de Cita (Mixta)
    - Actor que la provoca: Paciente
    - Condiciones: La solicitud contiene medicamentos agudos y crónicos con prevalidación exitosa.

## 8. Flujos principales

- **FP-001: Agendamiento de solicitud mixta (agudos y crónicos)**
  - Actor: Paciente
  - Precondiciones: Solicitud con medicamentos agudos y crónicos validada exitosamente.
  - Pasos:
    1. El sistema identifica la presencia de medicamentos tanto agudos como crónicos en la solicitud.
    2. El sistema aplica la regla de agendamiento unificado (aplica la regla del crónico: citas disponibles solo para el día calendario siguiente).
    3. El paciente selecciona la ventana de 1 hora en el punto de dispensación correspondiente.
    4. El sistema ejecuta la reserva atómica de todos los medicamentos de la solicitud (agudos y crónicos juntos) para dicha cita.
  - Resultado esperado: Se genera una única cita para el día calendario siguiente que incluye todos los medicamentos de la solicitud en ese punto, sin separar los agudos para el mismo día.

## 9. Flujos alternativos y excepciones

- **FA-001 (alternativa - Conflicto de disponibilidad concurrente):** Si otra persona confirma la reserva antes de que el usuario complete la acción → El sistema informa la situación y muestra las opciones actualizadas. `[CONFIRMADO: contexto §3.5]`

## 10. Casos límite

- **CL-001:** Solicitudes mixtas en las que los medicamentos se encuentran en puntos de dispensación distintos.
  - ¿Requiere especificación explícita? Sí `[CONFIRMADO: contexto §3.5]`
  - Comportamiento esperado: La reserva se hace por solicitud y se agenda una cita por punto, aplicando la regla del crónico en cada punto si la fórmula de ese punto contiene algún medicamento crónico. `[CONFIRMADO: contexto §3.5]`

## 11. Criterios de aceptación

- **AC-001** (cubre RF-001 / BR-001)
  - **Dado** que el paciente tiene una solicitud con medicamentos agudos y crónicos
  - **Cuando** el sistema procesa el agendamiento
  - **Entonces** aplica la regla del crónico permitiendo elegir citas únicamente para el día calendario siguiente, sin ofrecer opciones para el mismo día.
- **AC-002** (cubre RF-002 / BR-002)
  - **Dado** que el usuario selecciona una cita para una solicitud mixta en un punto
  - **When** confirma la reserva
  - **Then** el sistema realiza la reserva de forma atómica para todos los medicamentos (agudos y crónicos) en una sola cita para ese punto.

### 11.1. Escenarios en formato Gherkin (opcional)

```gherkin
Feature: Agendamiento de solicitudes con medicamentos mixtos

  Scenario: Solicitud con medicamentos agudos y crónicos se agenda al día siguiente
    Given que el paciente tiene una solicitud con medicamentos agudos y crónicos prevalidados
    When el paciente procede a seleccionar la cita en el punto
    Then el sistema restringe el agendamiento al día calendario siguiente
    And agenda todos los medicamentos de la solicitud en una única cita para ese punto
```

## 12. Dependencias

- SPEC-001 (Prevalidación de Solicitud y Disponibilidad). `[CONFIRMADO: contexto §3.4]`
- Módulo de Agenda y Reserva. `[CONFIRMADO: contexto §3.5]`

## 13. Restricciones

- La reserva se realiza de manera estrictamente atómica por solicitud y punto; no se permiten sobre-reservas ni particiones de citas por tipo de tratamiento. `[CONFIRMADO: contexto §3.5]`

## 14. Fuera de alcance

- Creación de citas separadas o en días distintos para agudos y crónicos dentro de una misma solicitud. `[CONFIRMADO: contexto §3.5 y respuesta del equipo]`
- Reprogramación de citas. `[CONFIRMADO: contexto §3.10]`
- Gestión de pendientes o entregas parciales. `[CONFIRMADO: contexto §3.10]`

## 15. Preguntas abiertas

- **OPEN-Q-001:** ¿Cuáles serán los tiempos máximos de respuesta esperados para la confirmación atómica de reservas mixtas bajo concurrencia alta?
  - Estado: Pendiente
  - Responsable: Equipo Técnico / Arquitectura
  - Impacto si no se responde: Imposibilidad de medir el RNF de desempeño de concurrencia.
  - Respuesta: —

## 16. Trazabilidad

- **REQ-004** → SPEC-002 → RF-001 / BR-001 → AC-001
- **REQ-005** → SPEC-002 → RF-002 / BR-002 → AC-002

## 17. Historial de cambios

- **v0.1** (AAAA-MM-DD): Borrador inicial generado por el Specification Agent adaptando la necesidad al contexto aprobado por instrucción del equipo.

---

## Control de aprobación

- [ ] Objetivo y alcance revisados
- [ ] Reglas de negocio aprobadas
- [ ] Criterios de aceptación críticos aprobados
- [ ] Restricciones con impacto contractual, económico, legal, de seguridad o de UX aprobadas
- [ ] Sin preguntas abiertas críticas
- **Aprobado por:** [Pendiente]
- **Fecha de aprobación:** [Pendiente]
- **Estado final:** Borrador