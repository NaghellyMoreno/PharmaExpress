<!--
Agente: Specification Agent
Proveedor: groq
Modelo: qwen/qwen3.8-27b
Fecha: 2026-09-30 20:40
Petición: Necesitamos que el paciente pueda cancelar su cita
-->

# SPEC-001. Cancelación de cita - Versión 0.1

Estado: Borrador
Modo: Inicial
Necesidad original: "Necesitamos que el paciente pueda cancelar su cita"

## Análisis
- Objetivo: Permitir al paciente (o a quien actúa por él) cancelar una cita agendada, liberando los recursos asociados (medicamentos y cupo de ventana) para que queden disponibles para otros usuarios.
- Alcance inicial: La acción de cancelación desde los canales soportados (Web y Telegram), la liberación de reservas y la notificación de confirmación.
- Actores: Paciente, persona que actúa por el paciente (cuidador/tutor), facilitador comunitario.
- Contexto aplicable: 3.1 (Canales), 3.3 (Vinculación), 3.5 (Disponibilidad, reserva y agenda), 3.6 (Notificaciones).

## Contradicciones detectadas
- Ninguna.

## Preguntas de aclaración
- OPEN-Q-001. ¿La cancelación es posible en cualquier momento antes de la validación oficial en el punto, o existe una ventana de tiempo (por ejemplo, hasta 1 hora antes de la cita) en la que ya no se puede cancelar por el sistema y debe gestionarse presencialmente?
  Por qué importa: Define la regla de negocio principal y los criterios de aceptación para el estado "Cita activa" vs "Cita en curso".
  Crítica: sí
  Propuesta del agente: Dado que el contexto 3.5 dice "El usuario puede cancelar en cualquier momento", se asume que es posible hasta el inicio de la ventana. Sin embargo, dado que la reserva expira al terminar la ventana, es necesario definir si la cancelación está bloqueada una vez iniciada la ventana de 1 hora.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-002. Si la cita incluye múltiples puntos (una solicitud con medicamentos en distintos puntos), ¿la cancelación es atómica (se cancelan todas las citas de la solicitud) o el usuario puede cancelar solo la cita de un punto específico?
  Por qué importa: El contexto 3.5 indica que "Si los medicamentos están en puntos distintos, se agenda una cita por punto" y que la confirmación es atómica. No especifica si la cancelación sigue la misma lógica atómica o permite cancelación parcial.
  Crítica: sí
  Propuesta del agente: Para mantener la consistencia con la confirmación atómica y evitar estados parciales complejos, se propone que la cancelación sea atómica para toda la solicitud (todas las citas asociadas a esa solicitud se cancelan).
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-003. ¿El sistema debe permitir la cancelación de una cita que ya fue validada parcialmente en el punto (es decir, el dispensador ya validó el código pero no cerró todos los medicamentos)?
  Por qué importa: El contexto 3.7 indica que el dispensador cierra cada medicamento como entregado o no entregado. Si el paciente cancela desde el sistema mientras el dispensador está procesando, ¿qué pasa con la validación oficial?
  Crítica: sí
  Propuesta del agente: La cancelación por el sistema debe estar bloqueada una vez que el dispensador ha iniciado la validación (validado el código). Si el dispensador ya validó, la gestión es presencial.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-004. ¿Se envía una notificación al dispensador cuando el paciente cancela una cita?
  Por qué importa: El contexto 3.6 detalla las notificaciones al paciente, pero no menciona notificaciones al dispensador. Si el dispensador tiene una agenda, ¿necesita saber que una cita se canceló para liberar su tiempo operativo?
  Crítica: no
  Propuesta del agente: No se envía notificación al dispensador, ya que el sistema gestiona la liberación de cupos automáticamente y el dispensador solo ve las citas activas.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-005. ¿La cancelación requiere una confirmación explícita del usuario (por ejemplo, "¿Está seguro?") o se ejecuta inmediatamente al pulsar el botón?
  Por qué importa: Define la experiencia de usuario y evita cancelaciones accidentales.
  Crítica: no
  Propuesta del agente: Se requiere confirmación explícita para evitar errores, dado que la cancelación libera recursos y no hay reprogramación (contexto 3.5).
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Permitir al usuario cancelar una o más citas asociadas a una solicitud, liberando las reservas de medicamentos y cupos de ventana para que queden disponibles para otros usuarios.

### 2. Contexto
El sistema Pharma Express permite agendar citas para la recogida de medicamentos. Una vez agendada, la cita reserva existencias y cupo. El usuario puede cancelar la cita para liberar estos recursos. No existe reprogramación; para obtener otra cita, el usuario debe iniciar una nueva solicitud (contexto 3.5).
Decisiones del equipo:
- Ninguna aún.

### 3. Alcance
- Cancelación de citas desde la aplicación web y el bot de Telegram.
- Liberación automática de reservas de medicamentos y cupos de ventana.
- Notificación de confirmación de cancelación al usuario.
- Actualización del estado de la solicitud.

### 4. Actores e historias de usuario
Actores: Paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-001. Como paciente, quiero cancelar mi cita para no tener que desplazarme si ya no necesito el medicamento o si tengo un imprevisto, para liberar el cupo para otras personas.
- HU-002. Como cuidador, quiero cancelar la cita de mi familiar desde mi chat vinculado, para gestionar sus citas cuando él no puede hacerlo.

### 5. Requisitos funcionales
- RF-001. El sistema debe permitir al usuario ver la lista de sus citas activas (no canceladas y no finalizadas) desde la web y Telegram. Origen: contexto 3.1, 3.5.
- RF-002. El sistema debe permitir al usuario seleccionar una cita activa para cancelarla. Origen: necesidad.
- RF-003. El sistema debe liberar las reservas de medicamentos y el cupo de la ventana asociada a la cita cancelada. Origen: contexto 3.5.
- RF-004. El sistema debe enviar una notificación de confirmación de cancelación al usuario por todos los medios vinculados (web, Telegram, SMS, correo). Origen: contexto 3.6.
- RF-005. El sistema debe actualizar el estado de la cita a "Cancelada" y registrar la fecha y hora de la cancelación. Origen: inferido, requiere confirmación (OPEN-Q-001, OPEN-Q-003).
- RF-006. Si la solicitud tiene citas en múltiples puntos, el sistema debe aplicar la lógica de cancelación definida por el equipo (atómica o parcial). Origen: pendiente de OPEN-Q-002.

### 6. Requisitos no funcionales
- RNF-001. Rendimiento. La cancelación debe completarse en menos de 5 segundos. Se verifica con: pruebas de carga. Origen: inferido, requiere confirmación.
- RNF-002. Disponibilidad. La función de cancelación debe estar disponible en los canales web y Telegram durante el horario de atención del sistema. Se verifica con: monitoreo de disponibilidad. Origen: contexto 3.1.

### 7. Reglas de negocio
- BR-001. La cancelación libera las existencias y el cupo de la ventana para que queden disponibles para otras personas. Origen: contexto 3.5.
- BR-002. No existe reprogramación; tras cancelar, el usuario debe iniciar una nueva solicitud para obtener otra cita. Origen: contexto 3.5.
- BR-003. La cancelación solo es posible mientras la cita esté en estado "Agendada" y no haya sido validada por el dispensador. Origen: pendiente de OPEN-Q-001, OPEN-Q-003.
- BR-004. La lógica de cancelación para solicitudes con múltiples puntos (atómica o parcial). Origen: pendiente de OPEN-Q-002.

### 8. Flujo principal
1. El usuario inicia sesión o verifica su identidad en la web o Telegram.
2. El usuario navega a la sección de "Mis citas" o "Citas activas".
3. El sistema muestra la lista de citas activas.
4. El usuario selecciona la cita que desea cancelar.
5. El sistema muestra un mensaje de confirmación (si aplica, ver OPEN-Q-005).
6. El usuario confirma la cancelación.
7. El sistema verifica que la cita sea cancelable (estado, validación del dispensador).
8. El sistema libera las reservas de medicamentos y el cupo de la ventana.
9. El sistema actualiza el estado de la cita a "Cancelada".
10. El sistema envía la notificación de confirmación al usuario.
11. El sistema muestra un mensaje de éxito al usuario.

### 9. Flujos alternativos y de excepción
- A1. El usuario intenta cancelar una cita que ya fue validada por el dispensador: el sistema muestra un mensaje indicando que la cita ya fue atendida y no puede cancelarse por el sistema.
- A2. El usuario intenta cancelar una cita que ya fue cancelada: el sistema muestra un mensaje indicando que la cita ya está cancelada.
- E1. Error de red durante la cancelación: el sistema muestra un mensaje de error y permite reintentar.

### 10. Casos límite
- CL-001. Cancelación en el último minuto antes de la ventana: el comportamiento depende de la respuesta a OPEN-Q-001. Origen: pendiente.
- CL-002. Cancelación de una cita con medicamentos en múltiples puntos: el comportamiento depende de la respuesta a OPEN-Q-002. Origen: pendiente.
- CL-003. Cancelación mientras el dispensador está validando el código: el comportamiento depende de la respuesta a OPEN-Q-003. Origen: pendiente.

### 11. Criterios de aceptación
- AC-001. Dado un usuario con una cita activa, cuando el usuario selecciona la opción de cancelar y confirma, entonces el sistema libera las reservas, actualiza el estado a "Cancelada" y envía la notificación de confirmación.
- AC-002. Dado un usuario con una cita que ya fue validada por el dispensador, cuando el usuario intenta cancelarla, entonces el sistema muestra un mensaje de error indicando que no se puede cancelar.
- AC-003. Dado un usuario con una solicitud con citas en dos puntos, cuando el usuario cancela la cita (asumiendo lógica atómica, pendiente de confirmación), entonces ambas citas se cancelan y se liberan las reservas de ambos puntos.

### 12. Dependencias
- Funcionalidad de agendamiento y reserva (para conocer el estado de la cita y las reservas).
- Funcionalidad de notificaciones (para enviar la confirmación).
- Inventario simulado (para liberar existencias).
- Agenda simulada (para liberar cupos).

### 13. Restricciones
- La cancelación no es reprogramación; el usuario debe iniciar una nueva solicitud. Origen: contexto 3.5.
- Los identificadores de Telegram no prueban identidad; la cancelación requiere vinculación activa. Origen: contexto 3.1, 3.3.
- No se incluyen nombres de medicamentos ni diagnósticos en las notificaciones de cancelación. Origen: contexto 3.6.

### 14. Fuera de alcance
- Reprogramación de citas. Origen: contexto 3.10.
- Gestión de entregas parciales. Origen: contexto 3.10.
- Notificaciones al dispensador. Origen: pendiente de OPEN-Q-004.
- Cancelación de citas ya validadas por el dispensador. Origen: inferido, requiere confirmación (OPEN-Q-003).

### 15. Preguntas abiertas
- OPEN-Q-001: Pendiente.
- OPEN-Q-002: Pendiente.
- OPEN-Q-003: Pendiente.
- OPEN-Q-004: Pendiente.
- OPEN-Q-005: Pendiente.

### 16. Trazabilidad
- HU-001: RF-001, RF-002, RF-003, RF-004, RF-005; BR-001, BR-002, BR-003; AC-001, AC-002; CL-001, CL-002, CL-003.
- HU-002: RF-001, RF-002, RF-003, RF-004, RF-005; BR-001, BR-002, BR-003; AC-001, AC-002; CL-001, CL-002, CL-003.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad.

## Verificación
- Completitud: no cumple. Hay 5 preguntas abiertas críticas que impiden definir reglas de negocio y criterios de aceptación definitivos.
- Consistencia: cumple.
- No ambigüedad: no cumple. Las reglas de negocio BR-003 y BR-004 están pendientes de definición.
- Verificabilidad: no cumple. Los criterios de aceptación dependen de las respuestas a las preguntas abiertas.
- Trazabilidad: cumple.
- No invención: cumple.
- Delimitación: cumple.
- Utilidad: cumple.

## Siguiente paso
Respondan las preguntas abiertas (especialmente OPEN-Q-001, OPEN-Q-002 y OPEN-Q-003) y ejecuten de nuevo el agente adjuntando este archivo.
