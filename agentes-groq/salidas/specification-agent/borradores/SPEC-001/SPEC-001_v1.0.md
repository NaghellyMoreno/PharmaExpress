<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.6-flash
Fecha: 2026-09-30 21:31
Petición: Respuestas del equipo.OPEN-Q-001:Se cancela las citas asocidas a la fórmula OPEN-Q-002:Se puede cancelar hasta la otra de la cita OPEN-Q-003:Se requiere una confirmación a traves de un codigo. OPEN-Q-004:la formula se queda igual que al inicio del flujo y se debe hacer nuevamente la prevalidación al momento de solicitar la cita nuevamente
-->

# SPEC-001. Cancelación de cita de entrega de medicamentos - Versión 1.0

Estado: Candidata
Modo: Iteración
Necesidad original: "Necesitamos que el paciente pueda cancelar su cita"

## Análisis
- Objetivo: permitir que el paciente o la persona autorizada cancele una cita agendada previamente, liberando los medicamentos reservados y el cupo de la ventana de atención mediante la confirmación por código de un solo uso.
- Alcance inicial: cancelación voluntaria de cita desde la aplicación web o el bot de Telegram por parte del paciente, cuidador o facilitador vinculado, afectando a todas las citas de la fórmula asociada.
- Actores: Paciente, Persona que actúa por el paciente (cuidador, tutor, familiar), Facilitador comunitario.
- Contexto aplicable: secciones 2.3, 2.4, 3.1, 3.2, 3.3, 3.5, 3.6, 3.10.

## Contradicciones detectadas
- Ninguna.

## Preguntas de aclaración
- OPEN-Q-001. Si una solicitud generó múltiples citas en puntos de dispensación distintos (porque los medicamentos estaban en diferentes puntos), ¿el usuario puede cancelar una sola cita o la cancelación aplica obligatoriamente a todas las citas de la solicitud?
  Por qué importa: define la granularidad del requisito funcional, el flujo de cancelación, las reglas de liberación de reserva y los criterios de aceptación.
  Crítica: sí
  Propuesta del agente: permitir cancelar cita por cita de forma independiente, liberando únicamente la reserva del punto y medicamentos correspondientes a esa cita.
  Estado: Respondida (DEC-001)
  Responsable: equipo

- OPEN-Q-002. ¿Hasta qué momento exacto se permite la cancelación voluntaria de una cita?
  Por qué importa: define el límite temporal para habilitar la opción de cancelación (por ejemplo, hasta antes de que inicie la ventana, durante la ventana antes de ser atendido, o hasta que el dispensador valide el código).
  Crítica: sí
  Propuesta del agente: permitir la cancelación en cualquier momento antes de que el dispensador registre la validación oficial del código de entrega en el punto.
  Estado: Respondida (DEC-002)
  Responsable: equipo

- OPEN-Q-003. ¿El sistema debe solicitar una confirmación explícita al usuario antes de procesar la cancelación de la cita?
  Por qué importa: impacta la usabilidad del flujo en web y Telegram y previene cancelaciones accidentales.
  Crítica: no
  Propuesta del agente: solicitar confirmación indicando que la acción liberará la reserva y la cita no se podrá recuperar.
  Estado: Respondida (DEC-003)
  Responsable: equipo

- OPEN-Q-004. Cuando se cancela una cita antes de haber reclamado ningún medicamento de la fórmula, ¿qué estado adquiere la fórmula y la prevalidación en el sistema?
  Por qué importa: la sección 3.5 indica que si no recibió nada, todo se libera, pero se debe precisar si el usuario puede agendar de inmediato una nueva cita con los datos prevalidados o si debe iniciar una nueva prevalidación/solicitud.
  Crítica: sí
  Propuesta del agente: liberar todos los medicamentos y exigir iniciar una nueva solicitud para obtener otra cita, ya que el sistema no contempla reprogramación (sección 3.5 y 3.10).
  Estado: Respondida (DEC-004)
  Responsable: equipo

## Especificación

### 1. Objetivo
Permitir la cancelación voluntaria de citas agendadas a través de la aplicación web o el bot de Telegram hasta antes de la hora de inicio de la cita, exigiendo confirmación mediante un código de un solo uso (OTP), asegurando la liberación inmediata de cupos e inventario reservado de la fórmula y la notificación por los canales del paciente.

### 2. Contexto
Pharma Express permite gestionar pre-dispensaciones y agendar citas en puntos de Disfarma en Manizales. Según la sección 3.5 del contexto del producto, no existe reprogramación de citas; si el usuario desea cambiar su cita, debe cancelar la existente e iniciar una nueva solicitud. La cancelación liberará los recursos asignados para que queden disponibles para otros usuarios.

Decisiones del equipo:
- DEC-001. La cancelación aplica de manera conjunta a todas las citas asociadas a la fórmula. Responde a OPEN-Q-001.
- DEC-002. La cancelación voluntaria se puede realizar únicamente hasta la hora de inicio de la cita. Responde a OPEN-Q-002.
- DEC-003. La confirmación de la cancelación requiere obligatoriamente la validación de un código de un solo uso (OTP). Responde a OPEN-Q-003.
- DEC-004. Al cancelar la cita, la fórmula retorna a su estado inicial previo a la prevalidación, debiendo realizarse todo el proceso nuevamente para solicitar una cita en el futuro. Responde a OPEN-Q-004.

### 3. Alcance
Incluye:
- Consulta de citas activas por parte del canal vinculado (Web o Telegram).
- Solicitud de cancelación voluntaria de la cita antes de su hora de inicio.
- Generación, envío e ingreso de un código de confirmación de un solo uso (OTP) enviado a los medios del paciente (SMS y correo si existe).
- Cancelación conjunta de todas las citas asociadas a la fórmula.
- Liberación inmediata de los cupos en las ventanas de los puntos y de las existencias de medicamentos reservados.
- Restitución de la fórmula a su estado inicial previo a la prevalidación.
- Inactivación de los códigos de entrega (QR y numérico).
- Envío de notificaciones de cancelación sin datos sensibles a través de todos los medios registrados del paciente (Web, Telegram, SMS, correo).

No incluye:
- Reprogramación directa de la cita (sección 3.10).
- Cancelación individual de solo una cita cuando la fórmula generó múltiples citas en distintos puntos.
- Cancelación posterior a la hora de inicio de la cita o tras la validación oficial en punto.

### 4. Actores e historias de usuario
Actores:
- Paciente: afiliado que consulta y cancela su cita.
- Persona que actúa por el paciente / Facilitador comunitario: opera desde un canal vinculado en nombre del paciente.

Historias de usuario:
- HU-001. Como paciente o persona autorizada, quiero cancelar la cita agendada de una fórmula validando un código de confirmación enviado a mis medios, para liberar la reserva y permitir gestionar una nueva prevalidación en el futuro si lo requiero.

### 5. Requisitos funcionales
- RF-001. El sistema debe permitir al usuario consultar las citas activas vinculadas al paciente seleccionado en la aplicación web o en el bot de Telegram. Origen: contexto 3.1, 3.3.
- RF-002. El sistema debe ofrecer la opción de cancelar la cita activa seleccionada. Origen: necesidad.
- RF-003. El sistema debe permitir la cancelación voluntaria de una cita únicamente hasta antes de la hora de inicio de la ventana agendada. Origen: DEC-002.
- RF-004. Al solicitar la cancelación de una cita, el sistema debe generar y enviar un código de confirmación de un solo uso (OTP) a los medios registrados del paciente (SMS y correo si existe) y solicitar su ingreso en pantalla para proceder. Origen: DEC-003, contexto 3.2.
- RF-005. Al validar correctamente el código de confirmación, el sistema debe cancelar todas las citas agendadas que estén asociadas a la misma fórmula. Origen: DEC-001.
- RF-006. Al concretar la cancelación, el sistema debe inactivar los códigos de entrega (QR y numérico) vinculados a las citas canceladas. Origen: contexto 3.5, 3.7.
- RF-007. Al concretar la cancelación, el sistema debe liberar inmediatamente el cupo ocupado en la ventana de atención del punto de dispensación y las existencias reservadas de los medicamentos. Origen: contexto 3.2, 3.5.
- RF-008. Si el paciente ya recibió una entrega parcial en el punto y cancela la cita del faltante, el sistema debe registrar lo no entregado como perdido y cerrar la fórmula. Origen: contexto 3.5.
- RF-009. Al concretar la cancelación de una cita sin entregas previas, el sistema debe dejar la fórmula en su estado inicial previo a la prevalidación, exigiendo un nuevo proceso completo de prevalidación si se desea agendar de nuevo. Origen: DEC-004.
- RF-010. Tras concretar la cancelación, el sistema debe enviar una notificación de confirmación de cancelación a todos los medios del paciente (notificación web, Telegram, SMS y correo si existe). Origen: contexto 3.6.
- RF-011. Las notificaciones de cancelación emitidas por el sistema no deben incluir nombres de medicamentos ni diagnósticos. Origen: contexto 3.6.
- RF-012. El sistema debe rechazar la cancelación de una cita si la hora actual es igual o posterior a la hora de inicio de la ventana agendada o si el dispensador ya registró la validación oficial en el punto. Origen: DEC-002, contexto 3.7.

### 6. Requisitos no funcionales
- RNF-001. Tiempo de respuesta. La liberación de la reserva, la inactivación de los códigos de entrega y la actualización del estado de la fórmula deben realizarse de forma inmediata en el sistema tras la validación exitosa del código de confirmación. Se verifica mediante prueba de integración de cancelación y disponibilidad de inventario/cupo. Origen: contexto 3.5.
- RNF-002. Privacidad y seguridad. La operación de cancelación solo se procesa desde un canal con vinculación vigente (menor a 3 meses) y tras la validación correcta del código OTP de confirmación enviada al celular/correo del paciente. Se verifica mediante pruebas de autorización y de código inválido o expirado. Origen: contexto 3.2, 3.3, DEC-003.

### 7. Reglas de negocio
- BR-001. Ausencia de reprogramación. El sistema no permite modificar la fecha u hora de una cita. Para cambiar una cita, el usuario debe cancelar la existente y realizar una nueva solicitud completa. Origen: contexto 3.5, 3.10.
- BR-002. Múltiples vinculaciones. Un canal con varios pacientes vinculados debe requerir la selección previa del paciente antes de listar o cancelar citas. Origen: contexto 3.3.
- BR-003. Anonimización en comunicaciones. Ninguna notificación enviada por SMS, correo, Telegram o web tras la cancelación contendrá información sensible de salud (medicamentos o diagnósticos). Origen: contexto 3.6.
- BR-004. Cancelación por fórmula. La cancelación se realiza a nivel de fórmula. Si la fórmula originó citas en múltiples puntos de dispensación, la cancelación invalida de manera conjunta todas las citas y reservas ligadas a esa fórmula. Origen: DEC-001.
- BR-005. Ventana temporal de cancelación. Un usuario puede cancelar su cita únicamente hasta antes de la hora de inicio de la ventana agendada. A partir de la hora de inicio de la ventana, la opción se deshabilita. Origen: DEC-002.
- BR-006. Verificación obligatoria por código OTP. Ninguna cancelación se ejecuta sin la validación previa de un código de un solo uso enviado a los canales de contacto del paciente. Origen: DEC-003.
- BR-007. Estado de la fórmula tras la cancelación. Al cancelar una cita sin entregas previas, la fórmula regresa a su estado inicial, requiriendo un nuevo proceso completo de prevalidación para agendar una cita futura. Origen: DEC-004.

### 8. Flujo principal
1. El usuario ingresa a Pharma Express por la aplicación web o el bot de Telegram.
2. Si el canal tiene más de un paciente vinculado, el usuario selecciona el paciente correspondiente.
3. El usuario accede a la opción de consultar citas activas.
4. El sistema muestra la cita agendada con su fecha, ventana de 1 hora, punto de dispensación y código de entrega.
5. El usuario selecciona la opción de cancelar cita antes de la hora de inicio de la ventana.
6. El sistema advierte que se cancelarán las citas asociadas a la fórmula, se liberará la reserva y la fórmula volverá a su estado inicial.
7. El sistema genera y envía un código de un solo uso (OTP) por SMS al celular del paciente y al correo (si está registrado), y solicita ingresarlo.
8. El usuario ingresa el código OTP recibido.
9. El sistema valida el código OTP.
10. El sistema cancela todas las citas asociadas a la fórmula, inactiva los códigos de entrega (QR y numérico), libera los cupos de las ventanas en los puntos y libera el inventario reservado.
11. El sistema coloca la fórmula en su estado inicial previo a la prevalidación.
12. El sistema muestra en pantalla el mensaje de cancelación exitosa e informa que para agendar nuevamente deberá realizar un nuevo proceso de prevalidación.
13. El sistema envía en segundo plano la notificación de confirmación de cancelación a través de web, Telegram, SMS y correo (si está registrado), sin mencionar nombres de medicamentos ni diagnósticos.

### 9. Flujos alternativos y de excepción
- A1. El usuario ingresa un código OTP de confirmación erróneo o vencido:
  1. En el paso 9 del flujo principal, la validación del código falla.
  2. El sistema informa que el código es inválido o ha expirado y permite solicitar un nuevo código o reintentar hasta agotar los intentos permitidos.
  3. La cita, reservas y fórmula se mantienen activas sin cambios.

- E1. Intento de cancelación cuando ya inició la hora de la cita o después:
  1. En el paso 5 del flujo principal, la hora actual es igual o posterior a la hora de inicio de la ventana de la cita.
  2. El sistema inhabilita o rechaza la opción de cancelación e informa que la cita ya no puede ser cancelada por haber alcanzado su hora de inicio. Origen: DEC-002.

- E2. Intento de cancelación de cita con código ya validado en el punto:
  1. El dispensador registró la validación oficial en punto.
  2. El usuario intenta cancelar la cita.
  3. El sistema rechaza la solicitud e informa que la cita ya fue atendida en el punto. Origen: contexto 3.7.

- E3. Canal con vinculación vencida (mayor a 3 meses):
  1. El usuario intenta acceder a la consulta o cancelación de citas desde un canal cuya vinculación ha expirado.
  2. El sistema no muestra la cita y solicita realizar de nuevo la verificación de identidad con código de un solo uso. Origen: contexto 3.3.

### 10. Casos límite
- CL-001. Solicitud de cancelación un minuto antes de la hora de inicio de la cita: si la confirmación con el código OTP se completa exitosamente antes de marcar la hora exacta de inicio de la ventana, el sistema procesa la cancelación y libera los recursos. Origen: DEC-002, DEC-003.
- CL-002. Solicitud de cancelación en el minuto exacto de inicio de la ventana: el sistema rechaza la operación informando que la hora de la cita ha iniciado. Origen: DEC-002.
- CL-003. Fórmula con citas en múltiples puntos: al confirmar la cancelación de una de las citas de la fórmula, el sistema cancela automáticamente todas las citas asociadas en los demás puntos y libera sus respectivas reservas y cupos. Origen: DEC-001.

### 11. Criterios de aceptación
- AC-001. Cancelación exitosa de cita con código OTP
  Dado que el paciente tiene una cita activa agendada cuya ventana no ha iniciado,
  cuando el usuario solicita la cancelación, ingresa el código de confirmación OTP enviado por SMS/correo y el sistema lo valida correctamente,
  entonces el sistema inactiva los códigos de entrega, cancela todas las citas asociadas a la fórmula, libera los cupos de las ventanas, libera las existencias reservadas, regresa la fórmula a su estado inicial y envía la notificación de cancelación sin datos sensibles.

- AC-002. Intento de cancelación cuando la ventana de la cita ya inició
  Dado que la hora actual es igual o posterior a la hora de inicio de la ventana de la cita,
  cuando el usuario intenta solicitar la cancelación de la cita desde la aplicación web o Telegram,
  entonces el sistema rechaza la solicitud e informa que la cita no se puede cancelar por haber alcanzado su hora de inicio.

- AC-003. Rechazo de cancelación por código OTP inválido
  Dado que el usuario inicia la solicitud de cancelación de cita y el sistema envía el código de confirmación OTP,
  cuando el usuario ingresa un código erróneo o expirado,
  entonces el sistema no procesa la cancelación, mantiene la cita y sus reservas activas y notifica el error de validación del código.

- AC-004. Cancelación conjunta para fórmula con múltiples citas
  Dado que una misma fórmula generó dos citas en puntos distintos de dispensación,
  cuando el usuario confirma la cancelación ingresando el código OTP válido,
  entonces el sistema cancela ambas citas, inactiva los códigos de entrega de ambas y libera las reservas de medicamentos y cupos en ambos puntos de dispensación.

- AC-005. Restricción de información sensible en notificaciones de cancelación
  Dado que una cita ha sido cancelada exitosamente,
  cuando el sistema envía los mensajes de confirmación por SMS, correo electrónico, Telegram y notificación web,
  entonces ninguna de las notificaciones incluye el nombre de los medicamentos ni los diagnósticos del paciente.

- AC-006. Exigencia de nueva prevalidación tras cancelar
  Dado que una cita fue cancelada exitosamente y la fórmula retornó a su estado inicial,
  cuando el usuario desea agendar una nueva cita para dicha fórmula,
  entonces el sistema le exige realizar todo el proceso de prevalidación desde el principio.

### 12. Dependencias
- Módulo de Identidad y Vinculación de canales (contexto 3.2, 3.3).
- Módulo de Reserva y Agendamiento (contexto 3.5).
- Servicio simulado de Inventario y Puntos de dispensación (contexto 3.5, 3.8).
- Servicios reales de envío de notificaciones y SMS/correo para OTP: Telegram, SMS y Correo (contexto 3.2, 3.6, 3.8).

### 13. Restricciones
- La solución debe desarrollarse dentro del marco de prototipo funcional de 8 semanas por un equipo de 4 personas (contexto 3.9).
- No se debe integrar con el sistema real Disfarma (contexto 3.9).
- Las notificaciones deben respetar estrictamente las normas de datos sensibles y Ley 1581 de 2012 (contexto 3.6, 3.11).

### 14. Fuera de alcance
- Reprogramación directa de la cita sin cancelar (contexto 3.10).
- Cancelación parcial de citas de una misma fórmula.
- Cancelación voluntaria iniciada la ventana de la cita o con posterioridad a esta.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-001).
- OPEN-Q-002: Respondida (DEC-002).
- OPEN-Q-003: Respondida (DEC-003).
- OPEN-Q-004: Respondida (DEC-004).

### 16. Trazabilidad
- HU-001: RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007, RF-008, RF-009, RF-010, RF-011, RF-012; RNF-001, RNF-002; BR-001, BR-002, BR-003, BR-004, BR-005, BR-006, BR-007; AC-001, AC-002, AC-003, AC-004, AC-005, AC-006; CL-001, CL-002, CL-003.

### 17. Historial de cambios
- Versión 0.1: creación inicial de la especificación a partir de la necesidad planteada por el usuario.
- Versión 1.0: incorporación de las decisiones del equipo (DEC-001 a DEC-004) sobre cancelación conjunta por fórmula, límite de inicio de la hora de la cita, confirmación mediante código OTP y retorno de la fórmula a su estado inicial.

## Verificación
- Completitud: cumple. Todas las preguntas abiertas han sido respondidas por el equipo (DEC-001 a DEC-004) y no quedan vacíos ni inferencias sin confirmar.
- Consistencia: cumple. Alineado con las reglas del contexto de la sección 3 y sin contradicciones internas.
- No ambigüedad: cumple. Los términos, reglas, límites temporales y flujos están definidos expresamente.
- Verificabilidad: cumple. Los requisitos tienen criterios de aceptación en formato Dado/Cuando/Entonces y formas claras de verificación.
- Trazabilidad: cumple. Matriz mapea HU, RF, RNF, BR, AC y CL.
- No invención: cumple. Se respetaron estrictamente las reglas del contexto y las respuestas del equipo.
- Delimitación: cumple. Alcance delimitado claramente, dejando la reprogramación y la cancelación extemporánea fuera de alcance.
- Utilidad: cumple. Define con precisión el comportamiento esperado para la cancelación de citas.

## Siguiente paso
La SPEC-001 versión 1.0 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
