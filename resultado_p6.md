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