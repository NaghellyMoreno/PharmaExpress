<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.6-flash
Fecha: 2026-09-30 21:21
Petición: Necesitamos que el paciente pueda cancelar su cita
-->

# SPEC-001. Cancelación de cita de entrega de medicamentos - Versión 0.1

Estado: Borrador
Modo: Inicial
Necesidad original: "Necesitamos que el paciente pueda cancelar su cita"

## Análisis
- Objetivo: permitir que el paciente o la persona autorizada cancele una cita agendada previamente, liberando los medicamentos reservados y el cupo de la ventana de atención.
- Alcance inicial: cancelación voluntaria de cita desde la aplicación web o el bot de Telegram por parte del paciente, cuidador o facilitador vinculado.
- Actores: Paciente, Persona que actúa por el paciente (cuidador, tutor, familiar), Facilitador comunitario.
- Contexto aplicable: secciones 2.3, 2.4, 3.1, 3.3, 3.5, 3.6, 3.10.

## Contradicciones detectadas
- Ninguna.

## Preguntas de aclaración
- OPEN-Q-001. Si una solicitud generó múltiples citas en puntos de dispensación distintos (porque los medicamentos estaban en diferentes puntos), ¿el usuario puede cancelar una sola cita o la cancelación aplica obligatoriamente a todas las citas de la solicitud?
  Por qué importa: define la granularidad del requisito funcional, el flujo de cancelación, las reglas de liberación de reserva y los criterios de aceptación.
  Crítica: sí
  Propuesta del agente: permitir cancelar cita por cita de forma independiente, liberando únicamente la reserva del punto y medicamentos correspondientes a esa cita.
  Estado: Pendiente
  Responsable: equipo

- OPEN-Q-002. ¿Hasta qué momento exacto se permite la cancelación voluntaria de una cita?
  Por qué importa: define el límite temporal para habilitar la opción de cancelación (por ejemplo, hasta antes de que inicie la ventana, durante la ventana antes de ser atendido, o hasta que el dispensador valide el código).
  Crítica: sí
  Propuesta del agente: permitir la cancelación en cualquier momento antes de que el dispensador registre la validación oficial del código de entrega en el punto.
  Estado: Pendiente
  Responsable: equipo

- OPEN-Q-003. ¿El sistema debe solicitar una confirmación explícita al usuario antes de procesar la cancelación de la cita?
  Por qué importa: impacta la usabilidad del flujo en web y Telegram y previene cancelaciones accidentales.
  Crítica: no
  Propuesta del agente: solicitar confirmación indicando que la acción liberará la reserva y la cita no se podrá recuperar.
  Estado: Pendiente
  Responsable: equipo

- OPEN-Q-004. Cuando se cancela una cita antes de haber reclamado ningún medicamento de la fórmula, ¿qué estado adquiere la fórmula y la prevalidación en el sistema?
  Por qué importa: la sección 3.5 indica que si no recibió nada, todo se libera, pero se debe precisar si el usuario puede agendar de inmediato una nueva cita con los datos prevalidados o si debe iniciar una nueva prevalidación/solicitud.
  Crítica: sí
  Propuesta del agente: liberar todos los medicamentos y exigir iniciar una nueva solicitud para obtener otra cita, ya que el sistema no contempla reprogramación (sección 3.5 y 3.10).
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Permitir la cancelación voluntaria de citas agendadas a través de la aplicación web o el bot de Telegram, asegurando la liberación inmediata de cupos e inventario reservado y la notificación por los canales del paciente.

### 2. Contexto
Pharma Express permite gestionar pre-dispensaciones y agendar citas en puntos de Disfarma en Manizales. Según la sección 3.5 del contexto del producto, no existe reprogramación de citas; si el usuario desea cambiar su cita, debe cancelar la existente e iniciar una nueva solicitud. La cancelación liberará los recursos asignados para que queden disponibles para otros usuarios.

Decisiones del equipo:
- Ninguna hasta el momento.

### 3. Alcance
Incluye:
- Consulta de citas activas por parte del canal vinculado (Web o Telegram).
- Solicitud de cancelación voluntaria de una cita activa.
- Confirmación de la cancelación por parte del usuario.
- Liberación inmediata del cupo en la ventana del punto y de los medicamentos reservados asociados a la cita.
- Actualización del estado de la cita y del código de entrega.
- Envío de notificaciones de cancelación a través de todos los medios registrados del paciente (Web, Telegram, SMS, correo).

No incluye:
- Reprogramación directa de la cita (sección 3.10).
- Gestión de devoluciones o reclamos tras la validación oficial en punto.

### 4. Actores e historias de usuario
Actores:
- Paciente: afiliado que consulta y cancela su cita.
- Persona que actúa por el paciente / Facilitador comunitario: opera desde un canal vinculado en nombre del paciente.

Historias de usuario:
- HU-001. Como paciente o persona autorizada, quiero cancelar una cita agendada desde la web o Telegram, para liberar la reserva si no puedo asistir y poder gestionar una nueva solicitud si lo requiero.

### 5. Requisitos funcionales
- RF-001. El sistema debe permitir al usuario consultar las citas activas vinculadas al paciente seleccionado en la aplicación web o en el bot de Telegram. Origen: contexto 3.1, 3.3.
- RF-002. El sistema debe ofrecer la opción de cancelar la cita activa seleccionada. Origen: necesidad.
- RF-003. El sistema debe solicitar confirmación al usuario antes de ejecutar la cancelación de la cita. Origen: inferido, requiere confirmación (OPEN-Q-003).
- RF-004. Al confirmar la cancelación, el sistema debe inactivar el código de entrega (QR y numérico) asociado a la cita. Origen: contexto 3.5, 3.7.
- RF-005. Al confirmar la cancelación, el sistema debe liberar el cupo ocupado en la ventana de atención del punto de dispensación. Origen: contexto 3.2, 3.5.
- RF-006. Si el paciente no ha recibido entregas parciales asociadas a la fórmula de la cita cancelada, el sistema debe liberar la totalidad de las existencias reservadas para dicha cita. Origen: contexto 3.5.
- RF-007. Si el paciente ya recibió una entrega parcial en el punto y cancela la cita del faltante, el sistema debe registrar lo no entregado como perdido y cerrar la fórmula. Origen: contexto 3.5.
- RF-008. Tras concretar la cancelación, el sistema debe enviar una notificación de confirmación de cancelación a todos los medios del paciente (notificación web, Telegram, SMS y correo si existe). Origen: contexto 3.6.
- RF-009. Las notificaciones de cancelación emitidas por el sistema no deben incluir nombres de medicamentos ni diagnósticos. Origen: contexto 3.6.
- RF-010. El sistema debe impedir la cancelación de una cita cuyo código de entrega ya haya sido validado por el dispensador en el punto. Origen: inferido, requiere confirmación (OPEN-Q-002).

### 6. Requisitos no funcionales
- RNF-001. Tiempo de respuesta. La liberación de la reserva y la actualización del estado de la cita deben realizarse de forma inmediata en el sistema. Se verifica mediante prueba de integración entre la cancelación y la disponibilidad del cupo/inventario. Origen: contexto 3.5.
- RNF-002. Privacidad y seguridad. La operación de cancelación solo se permite desde un canal con vinculación vigente (menor a 3 meses) y habiendo verificado la identidad. Se verifica mediante pruebas de autorización en canales no vinculados o vencidos. Origen: contexto 3.2, 3.3.

### 7. Reglas de negocio
- BR-001. Ausencia de reprogramación. El sistema no permite modicar la fecha u hora de una cita. Para cambiar una cita, el usuario debe cancelar la existente y realizar una nueva solicitud. Origen: contexto 3.5, 3.10.
- BR-002. Múltiples vinculaciones. Un canal con varios pacientes vinculados debe requerir la selección previa del paciente antes de listar o cancelar citas. Origen: contexto 3.3.
- BR-003. Anonimización en comunicaciones. Ninguna notificación enviada por SMS, correo, Telegram o web tras la cancelación contendrá información sensible de salud (medicamentos o diagnósticos). Origen: contexto 3.6.
- BR-004. Regla de cancelación parcial o total por solicitud con múltiples puntos. Pendiente de OPEN-Q-001.
- BR-005. Efecto de la cancelación previa al reclamo sobre la fórmula. Pendiente de OPEN-Q-004.

### 8. Flujo principal
1. El usuario ingresa a Pharma Express por la aplicación web o el bot de Telegram.
2. Si el canal tiene más de un paciente vinculado, el usuario selecciona el paciente correspondiente.
3. El usuario accede a la opción de consultar citas activas.
4. El sistema muestra la cita agendada con la fecha, ventana de 1 hora, punto de dispensación y código de entrega.
5. El usuario selecciona la opción de cancelar cita.
6. El sistema muestra un mensaje de confirmación advirtiendo que la cancelación liberará la cita y los medicamentos reservados, y que para obtener otra cita deberá iniciar una nueva solicitud.
7. El usuario confirma la cancelación.
8. El sistema invalida el código de entrega, libera el cupo en la ventana del punto y libera las existencias de medicamentos reservados.
9. El sistema muestra en pantalla el mensaje de cancelación exitosa e informa que debe iniciar una nueva solicitud si requiere agendar de nuevo.
10. El sistema envía en segundo plano la notificación de cancelación a través de web, Telegram, SMS y correo (si está registrado), sin mencionar nombres de medicamentos ni diagnósticos.

### 9. Flujos alternativos y de excepción
- A1. El usuario rechaza la confirmación de cancelación:
  1. En el paso 7 del flujo principal, el usuario elige no confirmar.
  2. El sistema cancela la operación y mantiene la cita, el código de entrega y las reservas sin cambios.

- E1. Intento de cancelación de una cita con código ya validado en el punto:
  1. En el paso 5 del flujo principal, el usuario intenta cancelar una cita cuyo código de entrega ya fue procesado por el dispensador.
  2. El sistema rechaza la solicitud e informa que la cita ya fue atendida en el punto y no puede ser cancelada.

- E2. Canal con vinculación vencida (mayor a 3 meses):
  1. El usuario intenta acceder a la consulta o cancelación de citas desde un canal cuya vinculación ha expirado.
  2. El sistema no muestra la cita y solicita realizar de nuevo la verificación de identidad con código de un solo uso. Origen: contexto 3.3.

### 10. Casos límite
- CL-001. Cancelación durante la ventana de atención (ejemplo: minuto 15 de la ventana de 1 hora) antes de ser atendido: el sistema permite la cancelación, invalida el código de entrega y libera el cupo restante de la ventana y el inventario. Origen: inferido, requiere confirmación (OPEN-Q-002).
- CL-002. Cancelación simultánea o posterior al registro de validación por parte del dispensador: si el dispensador valida el código al mismo tiempo que el usuario cancela, prevalece el estado registrado por el dispensador y la cancelación es rechazada. Origen: contexto 3.7.

### 11. Criterios de aceptación
- AC-001. Cancelación exitosa de cita sin entregas previas
  Dado que el paciente tiene una cita activa agendada y no ha recibido ningún medicamento de la fórmula,
  cuando el usuario confirma la cancelación de la cita desde la aplicación web o Telegram,
  entonces el sistema inhabilita el código de entrega de la cita, libera el cupo de la ventana en el punto, libera los medicamentos reservados y cambia el estado de la cita a cancelada.

- AC-002. Restricción de información sensible en notificaciones de cancelación
  Dado que una cita ha sido cancelada exitosamente,
  cuando el sistema envía los mensajes de confirmación por SMS, correo electrónico, Telegram y notificación web,
  entonces ninguna de las notificaciones incluye el nombre de los medicamentos ni los diagnósticos del paciente.

- AC-003. Cancelación rechazada por cita ya validada
  Dado que el dispensador ya registró la validación oficial del código de entrega en el punto,
  cuando el usuario intenta cancelar la cita desde el canal web o Telegram,
  entonces el sistema notifica que la cita ya fue atendida y no permite procesar la cancelación.

- AC-004. Desestimación de la cancelación por parte del usuario
  Dado que el usuario inicia el flujo de cancelación de cita y se le presenta la pantalla de confirmación,
  cuando el usuario selecciona la opción de no confirmar la cancelación,
  entonces la cita se mantiene activa con su código de entrega, cupo y reserva intactos.

### 12. Dependencias
- Módulo de Identidad y Vinculación de canales (contexto 3.2, 3.3).
- Módulo de Reserva y Agendamiento (contexto 3.5).
- Servicio simulado de Inventario y Puntos de dispensación (contexto 3.5, 3.8).
- Servicios reales de envío de notificaciones: Telegram, SMS y Correo (contexto 3.6, 3.8).

### 13. Restricciones
- La solución debe desarrollarse dentro del marco de prototipo funcional de 8 semanas por un equipo de 4 personas (contexto 3.9).
- No se debe integrar con el sistema real Disfarma (contexto 3.9).
- Las notificaciones deben respetar estrictamente las normas de datos sensibles y Ley 1581 de 2012 (contexto 3.6, 3.11).

### 14. Fuera de alcance
- Reprogramación directa de la cita sin cancelar (contexto 3.10).
- Modificación parcial de los medicamentos contenidos en la reserva de la cita.

### 15. Preguntas abiertas
- OPEN-Q-001: Pendiente.
- OPEN-Q-002: Pendiente.
- OPEN-Q-003: Pendiente.
- OPEN-Q-004: Pendiente.

### 16. Trazabilidad
- HU-001: RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007, RF-008, RF-009, RF-010; RNF-001, RNF-002; BR-001, BR-002, BR-003; AC-001, AC-002, AC-003, AC-004; CL-001, CL-002.

### 17. Historial de cambios
- Versión 0.1: creación inicial de la especificación a partir de la necesidad planteada por el usuario.

## Verificación
- Completitud: no cumple. Hay 4 preguntas abiertas pendientes de respuesta del equipo (OPEN-Q-001 a OPEN-Q-004).
- Consistencia: cumple. Alineado con el contexto de la sección 3 (canales, reservas, notificaciones y restricciones).
- No ambigüedad: cumple. Los términos y flujos están definidos expresamente y lo no definido se marcó como pregunta abierta.
- Verificabilidad: cumple. Los criterios de aceptación están en estructura Dado/Cuando/Entonces y cada RF/RNF cuenta con mecanismos de comprobación.
- Trazabilidad: cumple. Matriz de trazabilidad mapea HU, RF, RNF, BR, AC y CL.
- No invención: cumple. Se respetaron las reglas del contexto y lo inferido se marcó con su OPEN-Q.
- Delimitación: cumple. Mantiene dentro de alcance la cancelación voluntaria y explícitamente fuera de alcance la reprogramación.
- Utilidad: cumple. Establece claramente qué debe hacer el sistema para cancelar una cita.

## Siguiente paso
Respondan las preguntas abiertas (OPEN-Q-001 a OPEN-Q-004) y ejecuten de nuevo el agente adjuntando este archivo.
