

---

# SPEC-001: Prevalidación de Solicitud y Disponibilidad

- **Versión:** v0.1
- **Estado:** Borrador
- **Fecha:** 2023-10-25 *(fecha estándar o actual)*
- **Autor (agente):** Specification Agent
- **Responsable humano de aprobación:** Equipo de Producto / Pharma Express

---

## 1. Objetivo

Permitir que el paciente conozca antes de desplazarse al punto de dispensación la validez preliminar de su solicitud y la disponibilidad de sus medicamentos a través de los canales digitales (aplicación web y bot de Telegram). `[CONFIRMADO]`

## 2. Contexto

- **Contexto del negocio:** En los puntos de dispensación tradicionales, las validaciones ocurren cuando el paciente ya está en la ventanilla, generando esperas de 3 a 5 horas y desplazamientos inútiles. Pharma Express busca evitar esto mediante la prevalidación anticipada y la reserva del medicamento antes de asignar la cita. `[CONFIRMADO]`
- **Documentos o decisiones previas relacionadas:** Sección 2.1, 2.2, 3.4 y 3.5 del Contexto Aprobado de Pharma Express. `[CONFIRMADO]`
- **Glosario relevante:**
  - **Pre-dispensación:** Gestión previa a la entrega: prevalidación, reserva y cita antes del desplazamiento. `[CONFIRMADO]`
  - **Solicitud:** Conjunto de fórmulas y medicamentos de un mismo paciente gestionados en una misma gestión. `[CONFIRMADO]`
  - **Fórmula:** Prescripción con uno o más medicamentos. Es la unidad de validación y es todo o nada. `[CONFIRMADO]`
  - **Prevalidación:** Verificación preliminar de afiliación, vigencia, cobertura PBS, autorización y, si la fórmula es crónica, habilitación de entrega. No sustituye la validación oficial. `[CONFIRMADO]`
  - **Reserva:** Existencias y cupo apartados para una cita. `[CONFIRMADO]`

## 3. Alcance

- **Incluido:**
  - Carga de fórmulas e historia clínica en foto o PDF por la web o Telegram. `[CONFIRMADO]`
  - Proceso ordenado de prevalidación (Afiliación, Vigencia de la fórmula, Cobertura PBS, Autorización y Habilitación de entrega para crónicos). `[CONFIRMADO]`
  - Verificación de disponibilidad de existencias y cupos en las ventanas de los puntos de dispensación. `[CONFIRMADO]`
  - Presentación de los resultados de la prevalidación como preliminares, advirtiendo que la validación oficial ocurre en el punto. `[CONFIRMADO]`
- **Excluido:** ver sección 14 (Fuera de alcance)

## 4. Actores

- **Paciente:** Afiliado que gestiona sus fórmulas por la web o por Telegram. Incluye a cuidadores, tutores o facilitadores comunitarios que operan en su nombre. `[CONFIRMADO]`
- **EPS simulada:** Fuente de afiliación, datos de contacto, vigencia de fórmulas, autorizaciones y habilitación de entregas crónicas. `[CONFIRMADO]`
- **Inventario simulado:** Fuente de existencias por medicamento y por punto. `[CONFIRMADO]`

## 5. Requisitos funcionales

- **RF-001** `[CONFIRMADO]`: El sistema debe permitir al paciente cargar sus fórmulas y su historia clínica en formato de foto o PDF mediante la aplicación web o el bot de Telegram.
- **RF-002** `[CONFIRMADO]`: El sistema debe ejecutar la prevalidación siguiendo estrictamente el orden: 1. Afiliación activa, 2. Vigencia de la fórmula, 3. Cobertura PBS de cada medicamento, 4. Autorización de cada medicamento, y 5. Habilitación de entrega (solo para fórmulas crónicas).
- **RF-003** `[CONFIRMADO]`: El sistema debe verificar la disponibilidad de los medicamentos en el inventario simulado y la existencia de ventanas con cupo en los puntos de dispensación.
- **RF-004** `[CONFIRMADO]`: El sistema debe presentar todos los resultados de la prevalidación acompañados del aviso explícito de que se trata de un resultado preliminar y que la validación oficial ocurre en el punto.

## 6. Requisitos no funcionales

- **RNF-001** `[PENDIENTE]`: [Operación] debe [condición de calidad medible] bajo [condiciones de carga o contexto].
  - Estado: `OPEN-Q-001`

## 7. Reglas de negocio

- **BR-001** `[CONFIRMADO]`: Si de un documento no se obtienen los datos (ilegible, incompleto, sin diagnóstico o sin coincidencia con la EPS simulada), se pide cargarlo de nuevo; si el problema persiste, la fórmula queda no apta y se orienta a la atención presencial.
- **BR-002** `[CONFIRMADO]`: Cada fórmula es todo o nada: si un medicamento no cumple, toda la fórmula queda no apta. Las fórmulas separadas son independientes.
- **BR-003** `[CONFIRMADO]`: La prevalidación de afiliación se verifica una vez por solicitud. Si la afiliación está inactiva, se detiene toda la solicitud y se orienta hacia la EPS.
- **BR-004** `[CONFIRMADO]`: Si falta la autorización de un medicamento consultada en la EPS simulada, el sistema solo muestra los puntos, enlaces o trámites de autorización de la EPS del paciente, sin tramitar autorizaciones ni vigilar su estado.

### 7.1. Estados y transiciones (si aplica)

- **Estados posibles:** Documento Cargado → Prevalidación en Proceso → [Apta / No Apta]
- **Estados terminales:** Fórmula Apta (lista para agendamiento), Fórmula No Apta (orientada a EPS/presencial).
- **Transiciones:**
  - Documento Cargado → Prevalidación en Proceso
    - Actor que la provoca: Paciente / Sistema
    - Condiciones: Carga exitosa de documentos legibles y vinculación activa.

## 8. Flujos principales

- **FP-001: Consulta de validez preliminar y disponibilidad**
  - Actor: Paciente
  - Precondiciones: Identidad verificada, canal vinculado y consentimiento de datos aceptado.
  - Pasos:
    1. El paciente carga las fórmulas e historia clínica por la web o Telegram.
    2. El sistema evalúa la legibilidad y los datos frente a la EPS simulada.
    3. El sistema ejecuta secuencialmente la prevalidación (Afiliación, Vigencia, Cobertura PBS, Autorización y Habilitación de entrega).
    4. El sistema consulta el inventario simulado para verificar la disponibilidad de los medicamentos.
    5. El sistema muestra el resultado preliminar de la validez de la solicitud y la disponibilidad de los medicamentos junto con las opciones de agendamiento si aplica.
  - Resultado esperado: El paciente conoce la validez preliminar y disponibilidad antes de desplazarse.

## 9. Flujos alternativos y excepciones

- **FA-001 (alternativa - Documento ilegible):** Si el documento no es legible o está incompleto → El sistema solicita cargarlo nuevamente. Si el problema persiste, la fórmula se marca como no apta y se orienta a la atención presencial. `[CONFIRMADO]`
- **FE-001 (excepción - Afiliación inactiva):** Si la afiliación está inactiva → El sistema detiene toda la solicitud y orienta al paciente hacia la EPS. `[CONFIRMADO]`
- **FE-002 (excepción - Medicamento no apto):** Si un medicamento de la fórmula no cumple con los criterios → Toda la fórmula queda no apta (regla de todo o nada). `[CONFIRMADO]`

## 10. Casos límite

- **CL-001:** Fórmulas con medicamentos mixtos (agudos y crónicos dentro de la misma solicitud).
  - ¿Requiere especificación explícita? Sí `[CONFIRMADO]`
  - Comportamiento esperado: Cada fórmula se evalúa según su tipo; las crónicas exigen además la validación de la fecha habilitada de entrega. `[CONFIRMADO]`

## 11. Criterios de aceptación

- **AC-001** (cubre RF-001 / BR-001)
  - **Dado** que el paciente se encuentra vinculado en la web o Telegram
  - **Cuando** carga la foto o PDF de su fórmula e historia clínica
  - **Entonces** el sistema procesa el documento y, si es ilegible o incompleto, solicita una nueva carga.
- **AC-002** (cubre RF-002 / BR-003)
  - **Dado** que se ha iniciado una solicitud con documentos legibles
  - **Cuando** el sistema ejecuta la prevalidación
  - **Entonces** verifica primero la afiliación activa y detiene el proceso orientando a la EPS si esta se encuentra inactiva.
- **AC-003** (cubre RF-003 / RF-004)
  - **Dado** que la prevalidación de la fórmula es exitosa
  - **Cuando** el sistema verifica el inventario simulado
  - **Entonces** muestra la disponibilidad de los medicamentos y la validez preliminar con el aviso de que la validación oficial ocurre en el punto.

## 12. Dependencias

- Módulo de Identidad y Consentimiento (para la vinculación previa del canal). `[CONFIRMADO]`
- Servicios simulados de la EPS e Inventario. `[CONFIRMADO]`

## 13. Restricciones

- Los datos de salud son sensibles y requieren autorización explícita del titular (Ley 1581 de 2012 y Decreto 1377 de 2013). `[CONFIRMADO]`
- El sistema no realiza validación oficial ni sustituye los procesos presenciales obligatorios del punto de dispensación. `[CONFIRMADO]`

## 14. Fuera de alcance

- Validación oficial en el punto (ocurre exclusivamente por el dispensador). `[CONFIRMADO]`
- Trámite de autorizaciones o vigilancia de su estado por parte del sistema. `[CONFIRMADO]`
- Modificación o prescripción de fórmulas. `[CONFIRMADO]`
- Integración real con sistemas de la EPS o inventarios reales. `[CONFIRMADO]`

## 15. Preguntas abiertas

- **OPEN-Q-001:** ¿Cuáles serán los tiempos máximos de respuesta esperados para el procesamiento de archivos cargados (foto/PDF) en los canales digitales?
  - Estado: Pendiente
  - Responsable: Equipo Técnico / Arquitectura
  - Impacto si no se responde: Imposibilidad de medir el RNF de desempeño de carga.
  - Respuesta: —

## 16. Trazabilidad

- **REQ-001** → SPEC-001 → RF-001 / BR-001 → AC-001
- **REQ-002** → SPEC-001 → RF-002 / BR-002 / BR-003 → AC-002
- **REQ-003** → SPEC-001 → RF-003 / RF-004 → AC-003

## 17. Historial de cambios

- **v0.1** (2023-10-25): Borrador inicial generado por el Specification Agent basado en el Contexto Aprobado.

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

---

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

---

# SPEC-003: Envío de Notificaciones por Canales Vinculados

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

Asegurar que todas las notificaciones del sistema sean enviadas a través de los canales vinculados del paciente (SMS, correo, Telegram y web), cumpliendo estrictamente con la restricción de seguridad de no exponer información sensible como nombres de medicamentos ni diagnósticos clínicos. `[CONFIRMADO: contexto §3.6]`

## 2. Contexto

- **Contexto del negocio:** El sistema multicanal de Pharma Express requiere mantener informado al paciente sobre sus citas y el estado de sus gestiones sin vulnerar la privacidad de sus datos de salud sensibles. `[CONFIRMADO: contexto §2.1 y §3.6]`
- **Documentos o decisiones previas relacionadas:** Sección 3.6 del Contexto Aprobado de Pharma Express y Ley 1581 de 2012. `[CONFIRMADO: contexto §3.6 y §3.11]`
- **Glosario relevante:**
  - **Canales:** Medios a través de cuales se comunica el sistema (aplicación web, bot de Telegram, SMS y correo). `[CONFIRMADO: contexto §3.1 y §3.6]`
  - **Notificación:** Mensaje enviado al paciente sobre eventos del sistema (como recordatorios de citas o cambios en la solicitud). `[CONFIRMADO: contexto §3.6]`

## 3. Alcance

- **Incluido:**
  - Envío de mensajes por todos los medios del paciente (notificación web a navegadores vinculados, Telegram a chats vinculados, SMS al celular registrado y correo si existe). `[CONFIRMADO: contexto §3.6]`
  - Aplicación de la restricción de contenido que prohíbe incluir nombres de medicamentos y diagnósticos en cualquier notificación y por cualquier medio. `[CONFIRMADO: contexto §3.6]`
- **Excluido:** ver sección 14 (Fuera de alcance)

## 4. Actores

- **Paciente:** Afiliado (incluyendo cuidadores, tutores o facilitadores que operan en su nombre) que recibe las notificaciones en sus canales vinculados. `[CONFIRMADO: contexto §2.3 y §3.3]`
- **Servicios externos reales:** Telegram, SMS y correo (transportan los mensajes). `[CONFIRMADO: contexto §2.3]`

## 5. Requisitos funcionales

- **RF-001** `[CONFIRMADO: contexto §3.6]`: El sistema debe enviar cada notificación por todos los medios del paciente: notificación de la web a los navegadores vinculados, Telegram a los chats vinculados, SMS al celular registrado y correo si existe.
  - Trazabilidad: REQ-006
- **RF-002** `[CONFIRMADO: contexto §3.6]`: El sistema debe garantizar que ninguna notificación, por ningún medio, incluya nombres de medicamentos ni diagnósticos.
  - Trazabilidad: REQ-007

## 6. Requisitos no funcionales

- **RNF-001** `[PENDIENTE]`: [Operación] debe [condición de calidad medible] bajo [condiciones de carga o contexto].
  - Estado: `OPEN-Q-001`

## 7. Reglas de negocio

- **BR-001** `[CONFIRMADO: contexto §3.6]`: Las notificaciones se envían de manera simultánea o integrada a través de todos los canales que el paciente tenga vinculados.
- **BR-002** `[CONFIRMADO: contexto §3.6]`: Está estrictamente prohibido incluir nombres de medicamentos o diagnósticos clínicos en el contenido de los mensajes de notificación.

### 7.1. Estados y transiciones (si aplica)

- **Estados posibles:** Evento Generado → Validación de Privacidad de Contenido → Despacho Multicanal
- **Estados terminales:** Notificación Enviada, Notificación Fallida.
- **Transiciones:**
  - Evento Generado → Validación de Privacidad de Contenido
    - Actor que la provoca: Sistema
    - Condiciones: Ocurre un evento que requiere notificar al paciente (ej. recordatorio de cita o cambio de estado).

## 8. Flujos principales

- **FP-001: Envío de notificación multicanal**
  - Actor: Sistema
  - Precondiciones: Existencia de un evento que amerite notificación y canales vinculados activos.
  - Pasos:
    1. El sistema genera el mensaje de notificación asegurando la omisión de nombres de medicamentos y diagnósticos.
    2. El sistema identifica todos los medios vinculados del paciente (web, Telegram, SMS, correo).
    3. El sistema despacha el mensaje a través de cada uno de los canales correspondientes.
  - Resultado esperado: El paciente recibe la notificación en todos sus canales vinculados sin exposición de datos clínicos sensibles.

## 9. Flujos alternativos y excepciones

- **FA-001 (alternativa - Falta de un canal específico):** Si el paciente no cuenta con correo electrónico registrado → El sistema omite el envío por correo y despacha únicamente por los canales restantes vinculados (SMS, Telegram y web). `[CONFIRMADO: contexto §3.6]`

## 10. Casos límite

- **CL-001:** Notificaciones generadas cuando el canal de Telegram o navegador se encuentra con vinculación vencida (más de 3 meses).
  - ¿Requiere especificación explícita? Sí `[CONFIRMADO: contexto §3.3]`
  - Comportamiento esperado: Mientras la vinculación esté vencida, el canal respectivo no recibe notificaciones; los SMS y correos siguen llegando con normalidad. `[CONFIRMADO: contexto §3.3]`

## 11. Criterios de aceptación

- **AC-001** (cubre RF-001 / BR-001)
  - **Dado** que el paciente tiene múltiples canales vinculados (web, Telegram, SMS y correo)
  - **Cuando** el sistema genera una notificación de evento
  - **Entonces** envía el mensaje a través de todos los canales vinculados disponibles para el paciente.
- **AC-002** (cubre RF-002 / BR-002)
  - **Dado** que se va a despachar una notificación
  - **Cuando** se construye el contenido del mensaje
  - **Entonces** el sistema verifica que no se incluya ningún nombre de medicamento ni diagnóstico clínico.

### 11.1. Escenarios en formato Gherkin (opcional)

```gherkin
Feature: Envío seguro de notificaciones multicanal

  Scenario: Notificación enviada por todos los canales sin datos sensibles
    Given que el paciente tiene vinculados web, Telegram, SMS y correo
    When el sistema emite una notificación de recordatorio o estado
    Then el mensaje se envía por todos los canales activos
    And el contenido no contiene nombres de medicamentos ni diagnósticos
```

## 12. Dependencias

- Módulo de Identidad y Consentimiento (para conocer los canales vinculados). `[CONFIRMADO: contexto §3.1 y §3.3]`
- Servicios externos de mensajería (SMS, correo, Telegram). `[CONFIRMADO: contexto §2.3]`

## 13. Restricciones

- Los datos de salud son sensibles y requieren protección estricta según la Ley 1581 de 2012 y el Decreto 1377 de 2013. `[CONFIRMADO: contexto §3.11]`
- Ninguna notificación debe exponer información clínica o de prescripción. `[CONFIRMADO: contexto §3.6]`

## 14. Fuera de alcance

- Envío de notificaciones por WhatsApp o aplicación móvil instalable. `[CONFIRMADO: contexto §3.10]`
- Avisos de llegada de medicamentos o aprobación de autorizaciones por parte de la EPS. `[CONFIRMADO: contexto §3.6]`

## 15. Preguntas abiertas

- **OPEN-Q-001:** ¿Cuáles son los tiempos máximos de entrega tolerados para el despacho simultáneo de notificaciones a través de los servicios externos (SMS, correo, Telegram)?
  - Estado: Pendiente
  - Responsable: Equipo Técnico / Infraestructura
  - Impacto si no se responde: Imposibilidad de medir el RNF de desempeño de notificaciones.
  - Respuesta: —

## 16. Trazabilidad

- **REQ-006** → SPEC-003 → RF-001 / BR-001 → AC-001
- **REQ-007** → SPEC-003 → RF-002 / BR-002 → AC-002

## 17. Historial de cambios

- **v0.1** (AAAA-MM-DD): Borrador inicial generado por el Specification Agent basado en la nueva necesidad y el contexto aprobado.

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