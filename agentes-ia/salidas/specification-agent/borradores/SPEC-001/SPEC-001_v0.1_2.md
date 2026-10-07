<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash
Fecha: 2026-09-30 20:25
Petición: Necesitamos que el paciente pueda cancelar su cita
-->

# SPEC-001. Cancelación de Citas por el Paciente - Versión 0.1

Estado: Borrador
Modo: Inicial
Necesidad original: "Necesitamos que el paciente pueda cancelar su cita"

## Análisis
- Objetivo: permitir que el paciente, o un tercero autorizado que actúe en su nombre, cancele una cita agendada de manera voluntaria a través de la aplicación web o el bot de Telegram, liberando inmediatamente el cupo de la ventana de atención y los medicamentos reservados.
- Alcance inicial: la funcionalidad abarca la selección de la cita activa, la confirmación de la cancelación por parte del usuario, la liberación de los recursos (cupo de la ventana y reserva de medicamentos) en los sistemas simulados, el cambio de estado de la cita en el sistema, y el envío de las notificaciones de confirmación correspondientes.
- Actores: Paciente, Persona que actúa por el paciente, Facilitador comunitario. Todos operan bajo las mismas condiciones de canal vinculado.
- Contexto aplicable: secciones 3.1, 3.2, 3.3, 3.5, 3.6 y 3.10.

## Contradicciones detectadas
- Ninguna. El contexto define que el usuario puede cancelar en cualquier momento y que no existe la reprogramación (sección 3.5), lo cual es consistente con la necesidad.

## Preguntas de aclaración

- OPEN-Q-001. Cuando una solicitud de pre-dispensación genera múltiples citas (por ejemplo, porque los medicamentos de la fórmula están en puntos de dispensación distintos), ¿la cancelación se realiza de forma individual por cada cita o se cancelan automáticamente todas las citas asociadas a esa fórmula?
  Por qué importa: define si el usuario tiene control granular sobre sus citas o si el sistema debe aplicar una cancelación atómica para mantener la integridad de la fórmula.
  Crítica: sí
  Propuesta del agente: la cancelación debe ser individual por cita. Si el paciente decide no ir a un punto específico, puede cancelar esa cita en particular, liberando sus recursos, sin afectar las citas programadas en otros puntos para la misma fórmula.
  Estado: Pendiente
  Responsable: equipo

- OPEN-Q-002. El contexto 3.5 indica que si el paciente ya recibió parte de una fórmula y no recoge el resto (porque cancela o no llega), lo no recogido se pierde y la fórmula se cierra. Dado que la entrega parcial y su gestión están fuera de alcance (sección 3.10), ¿cómo debe comportarse el sistema al cancelar una cita respecto al estado de la fórmula?
  Por qué importa: define si el sistema debe interactuar con un estado de entrega parcial simulado o si simplemente libera todas las reservas de la cita cancelada.
  Crítica: sí
  Propuesta del agente: para el prototipo, si la cita se cancela antes de su inicio, se asume que no se ha entregado nada y se liberan todos los medicamentos reservados. Si se cancela durante o después de la ventana de atención sin registro de entrega, se liberan igualmente. No se gestionarán estados de entrega parcial.
  Estado: Pendiente
  Responsable: equipo

- OPEN-Q-003. ¿Cuál debe ser el texto de la notificación de confirmación de cancelación para asegurar que no se violen las restricciones de privacidad?
  Por qué importa: el contexto 3.6 prohíbe incluir nombres de medicamentos o diagnósticos en cualquier notificación.
  Crítica: no
  Propuesta del agente: la notificación enviada por todos los medios activos debe decir: "Pharma Express informa: Su cita programada para el [Fecha] a las [Hora] en el punto [Nombre del Punto] ha sido cancelada exitosamente. Los medicamentos reservados han sido liberados. Si requiere una nueva cita, por favor inicie una nueva solicitud en el sistema."
  Estado: Pendiente
  Responsable: equipo

---

## Especificación

### 1. Objetivo
Permitir que el usuario cancele una cita de pre-dispensación activa desde la aplicación web o el bot de Telegram, liberando el cupo de la ventana de atención y los medicamentos reservados para que queden disponibles para otros pacientes.

### 2. Contexto
En el modelo de Pharma Express, el paciente agenda una cita en una ventana de 1 hora en un punto de dispensación específico, con medicamentos previamente reservados (sección 2.4 y 3.5). Dado que no existe la reprogramación, la cancelación es el único mecanismo para desistir de una cita y liberar los recursos asignados antes de que expire la ventana de atención. Esta acción puede realizarse en cualquier momento desde los canales vinculados (sección 3.1 y 3.3).

Decisiones del equipo:
- Ninguna hasta el momento (versión inicial).

### 3. Alcance
La funcionalidad incluye:
- Visualización de citas activas (futuras o en curso dentro de su ventana) asociadas al canal vinculado.
- Opción de cancelar una cita específica.
- Confirmación de la acción por parte del usuario.
- Actualización del estado de la cita a Cancelada.
- Liberación del cupo en la ventana de atención del punto de dispensación simulado.
- Liberación de las existencias de medicamentos reservados en el inventario simulado.
- Envío de notificaciones de confirmación de cancelación a través de los medios del paciente (notificación web, Telegram, SMS y correo electrónico real).

### 4. Actores e historias de usuario
Actores: Paciente, Persona que actúa por el paciente, Facilitador comunitario.
- HU-001. Como paciente con un canal vinculado, quiero cancelar mi cita activa desde la aplicación web o Telegram, para liberar los medicamentos y el cupo si no puedo asistir.

### 5. Requisitos funcionales
- RF-001. El sistema debe mostrar las citas activas del paciente en los canales vinculados (web y Telegram). Origen: contexto 3.1 y 3.3.
- RF-002. El sistema debe permitir al usuario seleccionar una cita activa y solicitar su cancelación. Origen: necesidad.
- RF-003. El sistema debe solicitar una confirmación explícita al usuario antes de proceder con la cancelación. Origen: inferido, requiere confirmación (OPEN-Q-001).
- RF-004. Al confirmar la cancelación, el sistema debe actualizar el estado de la cita a Cancelada en la base de datos simulada. Origen: necesidad.
- RF-005. El sistema debe incrementar en uno (1) el cupo disponible de la ventana de atención de la cita cancelada en el punto de dispensación simulado. Origen: contexto 3.5.
- RF-006. El sistema debe devolver al inventario simulado del punto de dispensación las cantidades de medicamentos que estaban reservadas para esa cita. Origen: contexto 3.5.
- RF-007. El sistema debe enviar una notificación de confirmación de la cancelación por todos los medios de contacto del paciente: notificación en navegadores vinculados, mensaje en chats de Telegram vinculados, SMS al celular registrado en la EPS simulada y correo electrónico registrado si existe. Origen: contexto 3.6.

### 6. Requisitos no funcionales
- RNF-001. Usabilidad. La opción de cancelación debe estar disponible a máximo dos clics o interacciones desde la pantalla de visualización de la cita en la web y en Telegram. Se verifica con: prueba de recorrido de usuario. Origen: contexto 2.1 (priorización de adultos mayores y barreras digitales).
- RNF-002. Concurrencia y Consistencia. La liberación de cupos y medicamentos en los sistemas simulados debe realizarse de forma transaccional para evitar inconsistencias en el inventario y la agenda. Se verifica con: pruebas de carga simulando cancelaciones concurrentes. Origen: contexto 3.5.

### 7. Reglas de negocio
- BR-001. Cancelación en cualquier momento. El usuario puede cancelar la cita en cualquier momento antes de que finalice la ventana de 1 hora asignada. Origen: contexto 3.5.
- BR-002. No reprogramación. El sistema no debe ofrecer la opción de modificar la fecha, hora o punto de una cita existente. Para cambiar una cita, el usuario debe cancelar la actual e iniciar una nueva solicitud de pre-dispensación. Origen: contexto 3.5.
- BR-003. Privacidad en notificaciones. Ninguna notificación de cancelación enviada por SMS, correo, Telegram o web debe incluir nombres de medicamentos, diagnósticos ni datos sensibles de salud. Origen: contexto 3.6 y 3.11.
- BR-004. Canal vinculado requerido. Solo se pueden cancelar citas de pacientes que tengan una vinculación activa y vigente (no mayor a 3 meses) con el canal desde el cual se realiza la solicitud. Origen: contexto 3.3.
- BR-005. Efecto sobre la fórmula. Pendiente de OPEN-Q-002.
- BR-006. Granularidad de la cancelación. Pendiente de OPEN-Q-001.

### 8. Flujo principal
1. El usuario ingresa a la aplicación web o al bot de Telegram desde un canal vinculado vigente.
2. El usuario selecciona la opción de consultar sus citas activas.
3. El sistema presenta la lista de citas activas del paciente.
4. El usuario selecciona la cita que desea cancelar y presiona el botón o comando de cancelar.
5. El sistema solicita confirmación de la cancelación.
6. El usuario confirma la acción.
7. El sistema marca la cita como Cancelada.
8. El sistema libera el cupo de la ventana de atención en el punto de dispensación simulado.
9. El sistema libera los medicamentos reservados en el inventario simulado del punto.
10. El sistema envía la notificación de confirmación de cancelación por notificación web, Telegram, SMS y correo electrónico.
11. El sistema muestra un mensaje en pantalla confirmando la transacción e indicando que para agendar nuevamente debe iniciar una nueva solicitud.

### 9. Flujos alternativos y de excepción
- A1. El canal de Telegram o navegador tiene múltiples pacientes vinculados:
  1. El sistema solicita seleccionar el paciente antes de mostrar las citas.
  2. El usuario selecciona el paciente.
  3. El flujo continúa en el paso 2 del flujo principal.
- E1. La vinculación del canal ha vencido (más de 3 meses):
  1. El sistema no muestra información de citas ni permite gestiones.
  2. El sistema solicita realizar una nueva verificación de identidad para vincular el canal.
  3. El flujo termina.
- E2. La cita ya ha finalizado (la ventana de 1 hora expiró):
  1. El sistema no muestra la opción de cancelar para esa cita.
  2. El flujo termina.

### 10. Casos límite
- CL-001. Cancelación en el último minuto de la ventana de atención: si el usuario cancela la cita a las 15:59 para una ventana de 15:00 a 16:00, el sistema debe procesar la cancelación, liberar el cupo (aunque expire un minuto después) y devolver los medicamentos al inventario simulado. Origen: BR-001 y contexto 3.5.
- CL-002. Cancelación simultánea con la validación del dispensador: si el usuario cancela la cita en el mismo instante en que el dispensador en el punto ingresa el código para validación oficial, el sistema debe dar prioridad a la acción que se registre primero en el servidor. Si la cancelación se procesa primero, el código debe figurar como inválido para el dispensador. Origen: contexto 3.7.

### 11. Criterios de aceptación
- AC-001. Dado un paciente con una cita activa para mañana a las 10:00 en el punto "Manizales Centro", con 1 cupo ocupado en esa ventana y 2 unidades de Acetaminofén reservadas, cuando el paciente cancela la cita desde la web y confirma la acción, entonces el estado de la cita cambia a Cancelada, el cupo disponible de la ventana de 10:00 a 11:00 aumenta en 1, las 2 unidades de Acetaminofén se suman al inventario disponible del punto, y se envía una notificación sin nombres de medicamentos a su SMS y correo.
- AC-002. Dado un canal de Telegram cuya vinculación venció hace un día, cuando el usuario intenta acceder a la opción de cancelar cita, entonces el sistema no muestra ninguna cita activa y presenta el mensaje para iniciar la verificación de identidad.
- AC-003. Dado un paciente que cancela su cita, cuando se envían las notificaciones de confirmación, entonces el mensaje recibido por SMS y correo electrónico no contiene la palabra "Acetaminofén" ni el diagnóstico asociado a la fórmula.

### 12. Dependencias
- Sistema de EPS simulado: para validar la identidad del paciente si se requiere revincular.
- Sistema de Inventario simulado: para retornar los medicamentos liberados.
- Agenda de puntos simulada: para liberar el cupo de la ventana de atención.
- Servicios reales de envío de SMS, correo electrónico y API de Telegram.

### 13. Restricciones
- El desarrollo debe completarse dentro del marco de las 8 semanas del proyecto por el equipo de 4 personas. Origen: contexto 3.9.
- No se pueden utilizar integraciones reales con sistemas de Disfarma, EPS reales o inventarios reales. Todo debe ser simulado excepto el transporte de notificaciones. Origen: contexto 3.8 y 3.9.

### 14. Fuera de alcance
- Reprogramación directa de citas (cambiar fecha/hora sin cancelar). Origen: contexto 3.10.
- Gestión de entregas parciales o pendientes tras la cancelación. Origen: contexto 3.10.
- Reclamación de medicamentos a domicilio tras cancelar la cita presencial. Origen: contexto 3.10.

### 15. Preguntas abiertas
- OPEN-Q-001: Pendiente.
- OPEN-Q-002: Pendiente.
- OPEN-Q-003: Pendiente.

### 16. Trazabilidad
- HU-001: RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007; BR-001, BR-002, BR-003, BR-004; AC-001, AC-002, AC-003; CL-001, CL-002.

### 17. Historial de cambios
- Versión 0.1: creación de la especificación inicial para la funcionalidad de cancelación de citas por parte del paciente, basada en las reglas de negocio del contexto del producto.

---

## Verificación
- Completitud: cumple. Se definieron todos los aspectos de la cancelación, flujos, reglas y criterios.
- Consistencia: cumple. No hay contradicciones con el contexto de Pharma Express; se respeta la no reprogramación y la privacidad de las notificaciones.
- No ambigüedad: cumple. Se identificaron vacíos sobre la atomicidad de la cancelación y el estado de la fórmula, y se formularon como preguntas abiertas.
- Verificabilidad: cumple. Los criterios de aceptación están definidos en formato Dado, Cuando, Entonces con resultados observables y medibles en sistemas simulados.
- Trazabilidad: cumple. Se mapeó la historia de usuario con los requisitos, reglas, criterios y casos límite.
- No invención: cumple. No se definieron tecnologías, bases de datos ni endpoints. Se respetó el uso de sistemas simulados y servicios de notificación reales.
- Delimitación: cumple. Se especificó claramente qué queda fuera de alcance (reprogramación, entregas parciales).
- Utilidad: cumple. La especificación define claramente el comportamiento esperado del sistema ante la cancelación.

## Siguiente paso
Respondan las preguntas abiertas (OPEN-Q-001, OPEN-Q-002 y OPEN-Q-003) para poder incorporar las decisiones (DEC) en la especificación, resolver los elementos marcados como pendientes y avanzar con la versión 1.0 Candidata.
