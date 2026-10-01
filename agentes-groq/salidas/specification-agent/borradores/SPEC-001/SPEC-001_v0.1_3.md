<!--
Agente: Specification Agent
Proveedor: groq
Modelo: qwen/qwen3.8-27b
Fecha: 2026-09-30 20:34
Petición: Necesitamos que el paciente pueda cancelar su cita
-->

# SPEC-001. Cancelación de cita - Versión 0.1

Estado: Borrador
Modo: Inicial
Necesidad original: "Necesitamos que el paciente pueda cancelar su cita"

## Análisis
- Objetivo: Permitir al paciente (o a quien actúa por él) cancelar una cita agendada, liberando los recursos asociados (medicamentos y cupo) para que estén disponibles para otros usuarios.
- Alcance inicial: La acción de cancelar una cita existente desde los canales soportados (Web y Telegram), la liberación de la reserva y la notificación de confirmación.
- Actores: Paciente, Persona que actúa por el paciente (cuidador/tutor), Facilitador comunitario.
- Contexto aplicable: 3.1 (Canales), 3.3 (Vinculación), 3.5 (Disponibilidad, reserva y agenda), 3.6 (Notificaciones).

## Contradicciones detectadas
- Ninguna.

## Preguntas de aclaración
- OPEN-Q-001. ¿La cancelación es posible en cualquier momento antes de que inicie la ventana de la cita, o existe un plazo límite (por ejemplo, 1 hora antes) para evitar la liberación tardía de cupos?
  Por qué importa: Define la regla de negocio sobre la ventana temporal de cancelación y los criterios de aceptación.
  Crítica: sí
  Propuesta del agente: El contexto 3.5 dice "El usuario puede cancelar en cualquier momento", lo cual sugiere que no hay límite previo a la cita, pero es crítico confirmar si esto aplica incluso minutos antes de la ventana para evitar conflictos operativos en el punto.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-002. Si la solicitud contiene múltiples citas (una por punto, según contexto 3.5), ¿la cancelación es por cita individual o por toda la solicitud?
  Por qué importa: Determina la granularidad de la acción y cómo se liberan las reservas.
  Crítica: sí
  Propuesta del agente: Dado que la reserva es por solicitud pero la cita es por punto, y el contexto dice "cancelar en cualquier momento", se infiere que se puede cancelar una cita específica, pero si se cancela una de varias, ¿qué pasa con las demás? ¿Se mantienen?
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-003. ¿Qué información se muestra al usuario al momento de confirmar la cancelación? ¿Se le indica explícitamente que los medicamentos reservados se liberan y que debe iniciar una nueva solicitud para obtener otra cita?
  Por qué importa: Asegura la claridad del flujo y evita malentendidos sobre la disponibilidad posterior.
  Crítica: no
  Propuesta del agente: Mostrar un mensaje claro: "Su cita fue cancelada. Los medicamentos y el cupo han sido liberados. Para obtener una nueva cita, inicie una nueva solicitud."
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-004. ¿Se envía una notificación de cancelación a todos los canales vinculados (Web, Telegram, SMS, Correo) o solo al canal desde donde se realizó la acción?
  Por qué importa: El contexto 3.6 dice "Cada notificación se envía por todos los medios del paciente", pero es importante confirmar si la cancelación activa esta regla o si es una excepción por ser una acción del usuario.
  Crítica: no
  Propuesta del agente: Aplicar la regla general del contexto 3.6: notificar por todos los medios.
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Permitir al usuario cancelar una cita agendada, liberando la reserva de medicamentos y el cupo de la ventana para que queden disponibles para otros pacientes.

### 2. Contexto
El sistema Pharma Express permite agendar citas tras la prevalidación y reserva de medicamentos. El contexto 3.5 establece que "No hay reprogramación. El usuario puede cancelar en cualquier momento. Para obtener otra cita debe iniciar una nueva solicitud." La cancelación debe garantizar que no queden reservas huérfanas que bloqueen la disponibilidad para otros.
Decisiones del equipo:
- Ninguna aún.

### 3. Alcance
- Cancelación de citas agendadas desde la aplicación web y el bot de Telegram.
- Liberación automática de la reserva de medicamentos y el cupo de la ventana.
- Notificación de confirmación de la cancelación.
- Cierre de la gestión de la cita cancelada.

### 4. Actores e historias de usuario
Actores: Paciente, Persona que actúa por el paciente, Facilitador comunitario.
- HU-001. Como paciente, quiero cancelar mi cita, para no tener que desplazarme si ya no necesito el medicamento o si mis planes cambiaron.
- HU-002. Como cuidador, quiero cancelar la cita de mi familiar, para gestionar sus citas desde mi canal vinculado.

### 5. Requisitos funcionales
- RF-001. El sistema debe permitir al usuario ver la lista de sus citas activas (agendadas y no canceladas) desde la web y Telegram. Origen: contexto 3.1, 3.5.
- RF-002. El sistema debe permitir al usuario seleccionar una cita activa para cancelarla. Origen: necesidad.
- RF-003. El sistema debe solicitar una confirmación explícita antes de ejecutar la cancelación. Origen: inferido, requiere confirmación (OPEN-Q-003).
- RF-004. Al confirmar la cancelación, el sistema debe liberar la reserva de medicamentos asociada a esa cita. Origen: contexto 3.5.
- RF-005. Al confirmar la cancelación, el sistema debe liberar el cupo de la ventana asociada a esa cita. Origen: contexto 3.5.
- RF-006. El sistema debe marcar la cita como "Cancelada" y no permitir su reutilización ni reprogramación. Origen: contexto 3.5.
- RF-007. El sistema debe enviar una notificación de confirmación de la cancelación. Origen: contexto 3.6.
- RF-008. Si la solicitud tiene múltiples citas (por puntos distintos), el sistema debe permitir cancelar una cita específica sin afectar a las demás, salvo que se decida lo contrario. Origen: pendiente de OPEN-Q-002.

### 6. Requisitos no funcionales
- RNF-001. Disponibilidad. La función de cancelación debe estar disponible en los canales web y Telegram mientras la vinculación del usuario esté activa. Se verifica con: pruebas de usuario en ambos canales. Origen: contexto 3.1, 3.3.
- RNF-002. Consistencia de datos. La liberación de la reserva y el cupo debe ser atómica con la cancelación de la cita. No debe quedar una cita cancelada con reserva activa. Se verifica con: pruebas de integración y revisión de estado en base de datos simulada. Origen: contexto 3.5.

### 7. Reglas de negocio
- BR-001. No existe reprogramación. Una vez cancelada, la cita no puede ser modificada ni reutilizada. Origen: contexto 3.5.
- BR-002. La cancelación libera los medicamentos y el cupo de la ventana para que estén disponibles para otras personas. Origen: contexto 3.5.
- BR-003. El usuario debe iniciar una nueva solicitud completa (prevalidación, reserva, agendamiento) para obtener una nueva cita. Origen: contexto 3.5.
- BR-004. La cancelación es posible en cualquier momento antes de la cita. Origen: contexto 3.5, pendiente de confirmación de límites temporales (OPEN-Q-001).
- BR-005. Si la cita se cancela, el código de entrega asociado queda invalidado. Origen: inferido, requiere confirmación (OPEN-Q-001).

### 8. Flujo principal
1. El usuario inicia sesión o verifica su identidad en la web o Telegram.
2. El usuario navega a la sección de "Mis citas" o "Agenda".
3. El sistema muestra la lista de citas activas (estado: Agendada).
4. El usuario selecciona la cita que desea cancelar.
5. El sistema muestra un resumen de la cita (fecha, hora, punto) y pregunta: "¿Desea cancelar esta cita?".
6. El usuario confirma la cancelación.
7. El sistema libera la reserva de medicamentos y el cupo de la ventana.
8. El sistema marca la cita como "Cancelada".
9. El sistema envía la notificación de confirmación por todos los canales vinculados.
10. El sistema muestra un mensaje de éxito: "Su cita fue cancelada. Para obtener una nueva cita, inicie una nueva solicitud."

### 9. Flujos alternativos y de excepción
- A1. El usuario selecciona "Cancelar" pero luego decide no hacerlo: El sistema vuelve a la lista de citas sin realizar cambios.
- E1. La cita ya fue cancelada: El sistema muestra un mensaje de error: "Esta cita ya fue cancelada."
- E2. La cita ya fue atendida (código validado en el punto): El sistema no permite la cancelación. Muestra: "Esta cita ya fue atendida."
- E3. La vinculación del usuario está vencida: El sistema no permite la gestión. Muestra: "Su vinculación ha vencido. Verifique su identidad para continuar."

### 10. Casos límite
- CL-001. Cancelación minutos antes de la ventana: El sistema permite la cancelación y libera el cupo. Origen: pendiente de OPEN-Q-001.
- CL-002. Cancelación de una cita en una solicitud con múltiples puntos: Se libera solo la reserva y cupo de la cita cancelada. Las demás citas permanecen activas. Origen: pendiente de OPEN-Q-002.
- CL-003. Cancelación después de que el dispensador haya iniciado la validación pero antes de cerrar: El sistema debe definir si permite la cancelación. Origen: pendiente de OPEN-Q-001.

### 11. Criterios de aceptación
- AC-001. Dado un usuario con una cita activa, cuando selecciona cancelar y confirma, entonces la cita cambia a estado "Cancelada" y la reserva de medicamentos se libera.
- AC-002. Dado un usuario con una cita activa, cuando cancela la cita, entonces el cupo de la ventana queda disponible para otros usuarios.
- AC-003. Dado un usuario que cancela una cita, cuando el sistema procesa la cancelación, entonces se envía una notificación de confirmación por todos los canales vinculados.
- AC-004. Dado un usuario con una cita cancelada, cuando intenta verla en su lista, entonces aparece con estado "Cancelada" y no puede ser seleccionada para reprogramación.
- AC-005. Dado un usuario que cancela una cita, cuando intenta obtener una nueva cita, entonces debe iniciar una nueva solicitud completa desde el inicio.

### 12. Dependencias
- Funcionalidad de vinculación de canales (contexto 3.3).
- Funcionalidad de reserva y agenda (contexto 3.5).
- Funcionalidad de notificaciones (contexto 3.6).
- Inventario simulado (para liberar existencias).

### 13. Restricciones
- No se permite reprogramación (contexto 3.5).
- La cancelación no genera un pendiente ni una entrega parcial (contexto 3.10).
- Los identificadores de Telegram no prueban identidad; se requiere vinculación activa (contexto 3.1, 3.3).

### 14. Fuera de alcance
- Reprogramación de citas.
- Gestión de pendientes o entregas parciales.
- Cancelación por parte del dispensador (solo el usuario puede cancelar).
- Notificaciones de disponibilidad de medicamentos tras la cancelación.

### 15. Preguntas abiertas
- OPEN-Q-001: Pendiente.
- OPEN-Q-002: Pendiente.
- OPEN-Q-003: Pendiente.
- OPEN-Q-004: Pendiente.

### 16. Trazabilidad
- HU-001: RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007; BR-001, BR-002, BR-003, BR-004; AC-001, AC-002, AC-003, AC-004, AC-005; CL-001, CL-002, CL-003.
- HU-002: RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007; BR-001, BR-002, BR-003, BR-004; AC-001, AC-002, AC-003, AC-004, AC-005; CL-001, CL-002, CL-003.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad.

## Verificación
- Completitud: no cumple. Faltan respuestas a preguntas críticas (OPEN-Q-001, OPEN-Q-002) que definen reglas de negocio y criterios de aceptación.
- Consistencia: cumple.
- No ambigüedad: no cumple. Hay ambigüedad sobre el límite temporal de cancelación y la granularidad en solicitudes múltiples.
- Verificabilidad: no cumple. Los criterios de aceptación dependen de las respuestas a las preguntas abiertas.
- Trazabilidad: cumple.
- No invención: cumple.
- Delimitación: cumple.
- Utilidad: cumple.

## Siguiente paso
Respondan las preguntas abiertas (especialmente OPEN-Q-001 y OPEN-Q-002) y ejecuten de nuevo el agente adjuntando este archivo.
