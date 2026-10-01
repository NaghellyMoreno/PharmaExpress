<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.8-flash
Fecha: 2026-09-30 21:38
Petición: Correcciones del equipo sobre la versión 1.0. 1) DEC-002 contradice el contexto 3.5, que permite cancelar en cualquier momento. Decisión corregida: la cancelación se permite hasta que el dispensador valide el código o termine la ventana de la cita. Actualiza todos los elementos afectados. 2) El código de confirmación de la cancelación sigue las mismas reglas del código de identidad del contexto 3.2: dura 10 minutos, admite 3 intentos y se envía por SMS y por correo si existe. 3) Agrega criterios de aceptación para RF-008 y para BR-002, y en la trazabilidad indica qué criterio verifica cada requisito. 4) Agrega el flujo alternativo de cancelación iniciada desde el recordatorio de una hora antes (contexto 3.6). 5) Reescribe RNF-001 sin metas de tiempo, como comportamiento verificable.
-->

# SPEC-001. Cancelación de cita de entrega de medicamentos - Versión 1.0

Estado: Candidata
Modo: Iteración
Necesidad original: "Necesitamos que el paciente pueda cancelar su cita"

## Análisis
- Objetivo: permitir que el paciente o la persona autorizada cancele una cita agendada previamente, liberando los medicamentos reservados y el cupo de la ventana de atención mediante la confirmación por código de un solo uso.
- Alcance inicial: cancelación voluntaria de cita desde la aplicación web, el bot de Telegram o desde el enlace del recordatorio de una hora antes, afectando de manera conjunta a todas las citas de la fórmula asociada hasta que el dispensador valide el código o termine la ventana.
- Actores: Paciente, Persona que actúa por el paciente (cuidador, tutor, familiar), Facilitador comunitario.
- Contexto aplicable: secciones 2.3, 2.4, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.10.

## Contradicciones detectadas
- La decisión DEC-002 previa limitaba la cancelación hasta antes del inicio de la cita, lo cual contradecía la sección 3.5 del contexto ("El usuario puede cancelar en cualquier momento"). Con la corrección del equipo, la contradicción queda resuelta: la cancelación se permite en cualquier momento hasta que el dispensador registre la validación oficial en el punto o termine la ventana de la cita.

## Preguntas de aclaración
- OPEN-Q-001. Si una solicitud generó múltiples citas en puntos de dispensación distintos (porque los medicamentos estaban en diferentes puntos), ¿el usuario puede cancelar una sola cita o la cancelación aplica obligatoriamente a todas las citas de la solicitud?
  Por qué importa: define la granularidad del requisito funcional, el flujo de cancelación, las reglas de liberación de reserva y los criterios de aceptación.
  Crítica: sí
  Propuesta del agente: permitir cancelar cita por cita de forma independiente, liberando únicamente la reserva del punto y medicamentos correspondientes a esa cita.
  Estado: Respondida (DEC-001)
  Responsable: equipo

- OPEN-Q-002. ¿Hasta qué momento exacto se permite la cancelación voluntaria de una cita?
  Por qué importa: define el límite temporal para habilitar la opción de cancelación frente al ciclo de atención y la vigencia de la reserva.
  Crítica: sí
  Propuesta del agente: permitir la cancelación en cualquier momento antes de que el dispensador registre la validación oficial del código de entrega en el punto o expire la ventana.
  Estado: Respondida (DEC-002 corregida)
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
Permitir la cancelación voluntaria de citas agendadas a través de la aplicación web, el bot de Telegram o el recordatorio de una hora antes, hasta que el dispensador valide el código o termine la ventana de la cita, exigiendo confirmación mediante un código de un solo uso (OTP) que sigue las reglas de identidad, asegurando la liberación de cupos e inventario de la fórmula y la notificación sin datos sensibles.

### 2. Contexto
Pharma Express gestiona pre-dispensaciones farmacéuticas y citas en puntos de Disfarma en Manizales. De acuerdo con las secciones 3.5 y 3.10 del contexto, no existe reprogramación de citas; si el usuario desea cambiar su cita, debe cancelar e iniciar una nueva solicitud. La cancelación libera los medicamentos y cupos para que queden disponibles para otras personas.

Decisiones del equipo:
- DEC-001. La cancelación aplica de manera conjunta a todas las citas asociadas a la fórmula. Responde a OPEN-Q-001.
- DEC-002. La cancelación voluntaria se permite en cualquier momento hasta que el dispensador valide el código de entrega en el punto o termine la ventana de 1 hora de la cita. Responde a OPEN-Q-002 (corregida tras señalar contradicción con contexto 3.5).
- DEC-003. La confirmación de la cancelación requiere la validación de un código de un solo uso (OTP), siguiendo las reglas del código de identidad del contexto 3.2: dura 10 minutos, admite 3 intentos y se envía por SMS al celular registrado y por correo si existe. Responde a OPEN-Q-003.
- DEC-004. Al cancelar la cita sin entregas previas, la fórmula retorna a su estado inicial previo a la prevalidación, debiendo realizarse todo el proceso nuevamente para solicitar una cita en el futuro. Responde a OPEN-Q-004.

### 3. Alcance
Incluye:
- Consulta de citas activas por parte del canal vinculado (Web o Telegram).
- Solicitud de cancelación voluntaria desde la consulta de citas o iniciada desde el recordatorio de una hora antes.
- Generación, envío y verificación de un código de un solo uso (OTP) con vigencia de 10 minutos y 3 intentos, enviado por SMS y correo si existe.
- Cancelación conjunta de todas las citas asociadas a la fórmula.
- Liberación de los cupos en las ventanas de los puntos y de las existencias de medicamentos reservados.
- Cierre de fórmula y registro de medicamentos como perdidos en caso de cancelación tras entregas parciales.
- Retorno de la fórmula a su estado inicial si no hubo entregas previas.
- Inactivación de los códigos de entrega (QR y numérico).
- Notificación de confirmación de cancelación por todos los canales registrados del paciente sin incluir nombres de medicamentos ni diagnósticos.

No incluye:
- Reprogramación directa de la cita (contexto 3.10).
- Cancelación individual de una sola cita cuando la fórmula generó citas en puntos distintos (DEC-001).
- Cancelación posterior a la validación del código por parte del dispensador en el punto o posterior a la finalización de la ventana de la cita (DEC-002).
- Gestión de pendientes o reclamos de faltantes en el punto (contexto 3.7, 3.10).

### 4. Actores e historias de usuario
Actores:
- Paciente: afiliado que consulta y cancela su cita.
- Persona que actúa por el paciente / Facilitador comunitario: opera desde un canal vinculado en nombre del paciente.

Historias de usuario:
- HU-001. Como paciente o persona autorizada, quiero cancelar la cita agendada de una fórmula validando un código de confirmación enviado a mis medios de contacto, para liberar la reserva y cupos y poder gestionar una nueva prevalidación en el futuro si lo requiero.

### 5. Requisitos funcionales
- RF-001. El sistema debe permitir al usuario consultar las citas activas vinculadas al paciente seleccionado en la aplicación web o en el bot de Telegram. Origen: contexto 3.1, 3.3.
- RF-002. El sistema debe ofrecer la opción de cancelar una cita activa consultada. Origen: necesidad.
- RF-003. El sistema debe permitir solicitar la cancelación voluntaria de una cita en cualquier momento, siempre que el dispensador no haya validado el código de entrega en el punto y la ventana de 1 hora de la cita no haya finalizado. Origen: DEC-002, contexto 3.5, 3.7.
- RF-004. Al solicitar la cancelación, el sistema debe generar y enviar un código de un solo uso (OTP) al celular registrado por SMS y al correo registrado si existe, con vigencia de 10 minutos y límite de 3 intentos de validación. Origen: DEC-003, contexto 3.2.
- RF-005. Al validar correctamente el código OTP de confirmación, el sistema debe cancelar de manera conjunta todas las citas agendadas asociadas a la misma fórmula. Origen: DEC-001.
- RF-006. Al cancelar las citas, el sistema debe marcar como inactivos los códigos de entrega (QR y numérico) asociados. Origen: contexto 3.5, 3.7.
- RF-007. Al cancelar las citas, el sistema debe liberar el cupo ocupado en la ventana del punto y las existencias reservadas de los medicamentos. Origen: contexto 3.2, 3.5.
- RF-008. Si el paciente ya recibió una entrega parcial en el punto y cancela la cita de los medicamentos restantes, el sistema debe registrar lo no recogido como perdido y cerrar la fórmula. Origen: contexto 3.5.
- RF-009. Al concretar la cancelación de una cita sin entregas previas, el sistema debe retornar la fórmula a su estado inicial previo a la prevalidación, requiriendo un nuevo proceso completo para solicitar cita. Origen: DEC-004.
- RF-010. Tras concretar la cancelación, el sistema debe enviar un mensaje de confirmación de cancelación por todos los medios del paciente: notificación web en navegadores vinculados, mensaje en chats de Telegram vinculados, SMS al celular registrado y correo si existe. Origen: contexto 3.6.
- RF-011. Ningún mensaje de confirmación de cancelación debe contener nombres de medicamentos ni diagnósticos. Origen: contexto 3.6.
- RF-012. El sistema debe rechazar la cancelación si el dispensador ya registró la validación oficial del código en el punto o si la ventana de 1 hora de la cita ya finalizó. Origen: DEC-002, contexto 3.5, 3.7.

### 6. Requisitos no funcionales
- RNF-001. Consistencia del estado de reservas. Al registrarse la confirmación válida de cancelación, el sistema debe reflejar la liberación del cupo en la ventana del punto y de las existencias reservadas, de manera que consultas posteriores de disponibilidad reconozcan dichos recursos como disponibles para nuevas solicitudes, y el código de entrega asociado sea rechazado si se presenta en el punto. Se verifica mediante prueba de integración entre la cancelación y la consulta de disponibilidad e intento de uso del código en el punto. Origen: contexto 3.5.
- RNF-002. Seguridad del canal y autorización. La cancelación solo debe procesarse si el canal (web o Telegram) cuenta con una vinculación vigente (menor a 3 meses) y tras verificar el código OTP de confirmación. Se verifica mediante pruebas con vinculación vencida y con códigos OTP expirados o erróneos. Origen: contexto 3.2, 3.3, DEC-003.

### 7. Reglas de negocio
- BR-001. Ausencia de reprogramación. El sistema no permite modificar la fecha, hora o punto de una cita. Toda modificación requiere cancelar la cita existente y realizar una nueva solicitud. Origen: contexto 3.5, 3.10.
- BR-002. Selección obligatoria de paciente. En canales vinculados a más de un paciente, el sistema debe exigir la selección del paciente antes de consultar citas o solicitar cancelaciones. Origen: contexto 3.3.
- BR-003. Anonimización en comunicaciones. Las confirmaciones de cancelación emitidas por cualquier medio no deben incluir nombres de medicamentos ni diagnósticos. Origen: contexto 3.6.
- BR-004. Cancelación indivisible por fórmula. La cancelación opera por fórmula: si una fórmula tiene citas asociadas en puntos distintos, se cancelan todas las citas y se liberan todas las reservas de esa fórmula. Origen: DEC-001.
- BR-005. Oportunidad de cancelación. La cancelación se puede realizar en cualquier momento hasta que el dispensador valide el código en el punto o finalice la ventana de 1 hora de la cita. Al cumplirse cualquiera de estos dos eventos, la opción queda inhabilitada. Origen: DEC-002, contexto 3.5, 3.7.
- BR-006. Reglas del código OTP de confirmación. El código de confirmación de cancelación sigue las reglas del código de identidad: vigencia de 10 minutos, máximo 3 intentos permitidos y envío concurrente por SMS y correo si existe. Si expira o se agotan los intentos, no se realiza la cancelación y se orienta a solicitar un código nuevo. Origen: contexto 3.2, DEC-003.
- BR-007. Destino de la fórmula sin entregas. Al cancelar una cita sin ninguna entrega previa, la fórmula retorna a su estado inicial y exige prevalidación completa para volver a agendar. Origen: DEC-004.

### 8. Flujo principal
1. El usuario ingresa a Pharma Express por la web o por el bot de Telegram.
2. Si el canal tiene varios pacientes vinculados, el usuario selecciona el paciente a gestionar.
3. El usuario accede a la sección de consulta de citas activas.
4. El sistema muestra las citas agendadas del paciente con su fecha, ventana de 1 hora, punto y código de entrega.
5. El usuario selecciona la opción de cancelar cita (disponible mientras no haya sido validada en punto ni haya vencido la ventana).
6. El sistema advierte que se cancelarán todas las citas ligadas a la fórmula, se liberarán las reservas y se requerirá prevalidar de nuevo para una futura cita.
7. El sistema genera un código OTP de 10 minutos de vigencia, lo envía por SMS al celular del paciente y al correo si existe, e informa que tiene 3 intentos para ingresarlo.
8. El usuario ingresa el código OTP recibido.
9. El sistema valida el código OTP dentro del tiempo y de los intentos permitidos.
10. El sistema cancela todas las citas asociadas a la fórmula e inactiva los códigos de entrega (QR y numérico).
11. El sistema libera el cupo de la ventana en el punto y las existencias reservadas de los medicamentos.
12. El sistema devuelve la fórmula a su estado inicial previo a la prevalidación.
13. El sistema muestra la confirmación de la cancelación en pantalla.
14. El sistema envía la notificación de confirmación de cancelación por notificación web, Telegram, SMS y correo si existe, sin nombres de medicamentos ni diagnósticos.

### 9. Flujos alternativos y de excepción
- A1. Código OTP erróneo, vencido o agotamiento de intentos:
  1. En el paso 9 del flujo principal, el código ingresado no coincide o pasaron más de 10 minutos.
  2. Si no ha superado 3 intentos y está vigente, el sistema indica el error y los intentos restantes.
  3. Si pasaron los 10 minutos o se agotaron los 3 intentos, el sistema rechaza la operación, mantiene la cita activa y ofrece solicitar un nuevo código o mantener la cita. Origen: contexto 3.2, DEC-003.

- A2. Cancelación iniciada desde el recordatorio de una hora antes:
  1. El usuario recibe el recordatorio una hora antes de la cita por sus canales registrados.
  2. El recordatorio ofrece la opción de cancelar la cita.
  3. El usuario selecciona la opción de cancelar desde el mensaje de recordatorio.
  4. El sistema abre el canal (web o bot de Telegram vinculado) y muestra la confirmación de advertencia de cancelación.
  5. El flujo continúa en el paso 6 del flujo principal. Origen: contexto 3.6.

- A3. Cancelación tras entrega parcial previa:
  1. En el paso 10 del flujo principal, el paciente ya recibió una entrega parcial de la fórmula en un punto anterior.
  2. El sistema cancela la cita pendiente del faltante e inactiva su código de entrega.
  3. El sistema libera el cupo y las existencias reservadas de la cita pendiente.
  4. El sistema marca los medicamentos no recogidos como perdidos y cierra la fórmula de manera definitiva (no vuelve a estado inicial).
  5. El sistema notifica la cancelación informando el cierre de la fórmula sin incluir nombres de medicamentos ni diagnósticos. Origen: contexto 3.5.

- E1. Intento de cancelación posterior a la finalización de la ventana de la cita:
  1. El usuario intenta cancelar cuando la ventana de 1 hora de la cita ya terminó.
  2. El sistema rechaza la solicitud e informa que la cita ha expirado y no admite cancelación. Origen: DEC-002, contexto 3.5.

- E2. Intento de cancelación cuando el dispensador ya validó el código en el punto:
  1. El dispensador registró la validación oficial del código en el punto dentro de la ventana de la cita.
  2. El usuario intenta cancelar la cita desde el canal.
  3. El sistema rechaza la solicitud e informa que la cita ya se encuentra en atención presencial en el punto y no se puede cancelar. Origen: DEC-002, contexto 3.7.

- E3. Canal con vinculación vencida (superior a 3 meses):
  1. El usuario intenta consultar o cancelar citas desde un navegador o chat cuya vinculación superó los 3 meses.
  2. El sistema bloquea la gestión y solicita una nueva verificación de identidad con código de un solo uso. Origen: contexto 3.3.

### 10. Casos límite
- CL-001. Solicitud de cancelación durante el transcurso de la ventana de atención antes de la atención en punto: si la ventana de 1 hora ya inició, pero el dispensador aún no valida el código de entrega, el sistema permite y procesa la cancelación con el código OTP. Origen: DEC-002, contexto 3.5.
- CL-002. Solicitud de cancelación en el minuto exacto de terminación de la ventana: si la ventana de 1 hora ya concluyó, el sistema rechaza la operación por expiración de la cita. Origen: DEC-002, contexto 3.5.
- CL-003. Concurrencia entre validación del dispensador y confirmación de cancelación: si el dispensador valida el código en el punto mientras el usuario ingresa el código OTP, el sistema procesa primero la acción del dispensador y rechaza la cancelación por encontrarse ya en atención. Origen: DEC-002, contexto 3.7.
- CL-004. Fórmula con citas en puntos diferentes: si la fórmula generó dos citas en puntos distintos, la confirmación de cancelación de cualquiera de ellas cancela de manera simultánea ambas citas y libera los cupos y reservas de ambos puntos. Origen: DEC-001.

### 11. Criterios de aceptación
- AC-001. Cancelación exitosa de cita con código OTP antes o durante la ventana
  Dado que un paciente tiene una cita activa agendada cuya ventana no ha finalizado y el dispensador no ha validado el código en el punto,
  cuando el usuario solicita la cancelación, ingresa el código OTP enviado a su celular/correo dentro de los 10 minutos y antes de 3 intentos fallidos,
  entonces el sistema cancela todas las citas de la fórmula, inactiva los códigos de entrega, libera los cupos y medicamentos reservados, retorna la fórmula a su estado inicial y envía la notificación de confirmación a todos los medios del paciente.

- AC-002. Rechazo de cancelación por finalización de ventana o atención iniciada
  Dado que la ventana de 1 hora de una cita ya concluyó o el dispensador ya validó el código de entrega en el punto,
  cuando el usuario intenta solicitar la cancelación desde la web o Telegram,
  entonces el sistema no permite la acción e informa que la cita no se puede cancelar por haber expirado o encontrarse en atención presencial.

- AC-003. Control de intentos y vigencia del código OTP de cancelación
  Dado que el usuario solicitó la cancelación y recibió el código OTP en su celular/correo,
  cuando el usuario ingresa un código incorrecto por tercera vez o ingresa el código pasados 10 minutos desde su emisión,
  entonces el sistema rechaza la confirmación, mantiene la cita y sus reservas activas e informa que debe solicitar un código nuevo.

- AC-004. Cancelación indivisible de citas de una misma fórmula
  Dado que una fórmula tiene dos citas agendadas en puntos distintos de dispensación,
  cuando el usuario confirma la cancelación mediante el código OTP,
  entonces el sistema cancela ambas citas, inactiva ambos códigos de entrega y libera los cupos e inventarios reservados en los dos puntos.

- AC-005. Exclusión de datos sensibles en la confirmación de cancelación
  Dado que una cita fue cancelada exitosamente,
  cuando el sistema emite los mensajes de confirmación a través de SMS, correo, Telegram y web,
  entonces los mensajes informan la cancelación de la cita sin mencionar ningún nombre de medicamento ni diagnóstico.

- AC-006. Obligatoriedad de nueva prevalidación tras cancelar cita sin entregas
  Dado que una cita sin entregas previas fue cancelada y la fórmula regresó a su estado inicial,
  cuando el usuario intenta agendar una nueva cita para dicha fórmula,
  entonces el sistema no permite agendar directamente y exige realizar una nueva prevalidación completa.

- AC-007. Cancelación de cita con entrega parcial previa
  Dado que un paciente ya recibió una entrega parcial de su fórmula en un punto y tiene una cita agendada pendiente para reclamar el resto de medicamentos,
  cuando el usuario confirma la cancelación de dicha cita pendiente con el código OTP,
  entonces el sistema inactiva el código de entrega de la cita pendiente, libera su cupo y reservas, registra los medicamentos pendientes como perdidos, cierra definitivamente la fórmula y notifica la cancelación sin datos sensibles.

- AC-008. Selección de paciente en canal con múltiples vinculaciones
  Dado un canal (web o bot de Telegram) que tiene vinculados dos o más pacientes,
  cuando el usuario ingresa a la opción de consultar o cancelar citas,
  entonces el sistema presenta la lista de pacientes vinculados y exige seleccionar a cuál de ellos corresponde la gestión antes de mostrar las citas o procesar cancelaciones.

- AC-009. Cancelación iniciada desde el recordatorio de una hora antes
  Dado que el paciente recibe el mensaje de recordatorio una hora antes de su cita,
  cuando el usuario selecciona la opción de cancelar ofrecida en dicho recordatorio,
  entonces el sistema lo dirige al flujo de confirmación de cancelación, envía el código OTP a su celular/correo y procede con la cancelación una vez validado el código.

### 12. Dependencias
- Módulo de Identidad y Vinculación de canales (contexto 3.2, 3.3).
- Módulo de Reserva y Agendamiento (contexto 3.5).
- Módulo de Notificaciones y Recordatorios (contexto 3.6).
- Módulo de Atención en el punto (contexto 3.7).
- Inventario simulado y Puntos de dispensación simulados (contexto 3.5, 3.8).
- Servicios reales de SMS, correo y bot de Telegram (contexto 3.1, 3.2, 3.6, 3.8).

### 13. Restricciones
- Prototipo funcional para el gestor Disfarma en Manizales con EPS simuladas (Salud Total y Sanitas) (contexto 2.1, 3.8).
- Sin integración técnica con los sistemas reales de Disfarma (contexto 3.9).
- Duración del proyecto de 8 semanas por un equipo de 4 personas (contexto 3.9).
- Cumplimiento de la Ley 1581 de 2012 respecto a no divulgar datos de salud sensibles en notificaciones abiertas (contexto 3.6, 3.11).

### 14. Fuera de alcance
- Reprogramación de citas (contexto 3.10).
- Cancelación individual de una sola cita cuando una misma fórmula requirió más de un punto (contexto 3.5, DEC-001).
- Cancelación después de que el dispensador valide el código en ventanilla o tras vencer la ventana (DEC-002).
- Gestión de entregas parciales o reclamos de faltantes por parte del sistema (contexto 3.7, 3.10).

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-001).
- OPEN-Q-002: Respondida (DEC-002 corregida).
- OPEN-Q-003: Respondida (DEC-003).
- OPEN-Q-004: Respondida (DEC-004).

### 16. Trazabilidad
- HU-001: RF-001 a RF-012; RNF-001, RNF-002; BR-001 a BR-007; AC-001 a AC-009; CL-001 a CL-004.

Detalle de verificación de requisitos funcionales por criterio de aceptación:
- RF-001: verificado por AC-001, AC-008.
- RF-002: verificado por AC-001, AC-009.
- RF-003: verificado por AC-001, AC-002.
- RF-004: verificado por AC-001, AC-003.
- RF-005: verificado por AC-001, AC-004.
- RF-006: verificado por AC-001, AC-004, AC-007.
- RF-007: verificado por AC-001, AC-004, AC-007.
- RF-008: verificado por AC-007.
- RF-009: verificado por AC-001, AC-006.
- RF-010: verificado por AC-001, AC-005, AC-007.
- RF-011: verificado por AC-005, AC-007.
- RF-012: verificado por AC-002.

Detalle de verificación de reglas de negocio por criterio de aceptación:
- BR-001: verificado por AC-006.
- BR-002: verificado por AC-008.
- BR-003: verificado por AC-005, AC-007.
- BR-004: verificado por AC-004.
- BR-005: verificado por AC-001, AC-002.
- BR-006: verificado por AC-001, AC-003.
- BR-007: verificado por AC-001, AC-006.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad planteada por el usuario.
- Versión 1.0 (candidata inicial): incorporación de respuestas a OPEN-Q-001 a OPEN-Q-004 (DEC-001 a DEC-004).
- Versión 1.0 (candidata ajustada): corrección de DEC-002 para permitir cancelación hasta la validación en punto o fin de ventana, incorporación de reglas de identidad al código OTP (10 min, 3 intentos, SMS y correo), adición del flujo alternativo desde recordatorio de 1 hora, adición de AC-007 para RF-008, AC-008 para BR-002, AC-009 para recordatorio, reescritura de RNF-001 como comportamiento verificable y mapeo detallado de trazabilidad requisito a criterio.

## Verificación
- Completitud: cumple. Todas las correcciones solicitadas por el equipo fueron incorporadas y no quedan preguntas críticas ni inferencias sin confirmar.
- Consistencia: cumple. Se eliminó la contradicción de DEC-002 con el contexto 3.5 y se armonizó con las reglas del código de identidad del contexto 3.2.
- No ambigüedad: cumple. Los límites de tiempo, los estados resultantes y las condiciones de rechazo están definidos con exactitud.
- Verificabilidad: cumple. Cada requisito funcional y cada regla de negocio cuentan con al menos un criterio de aceptación en formato Dado/Cuando/Entonces y RNF-001 se verifica por consistencia observable.
- Trazabilidad: cumple. Se mapea la HU con todos los elementos y se detalla qué criterio verifica cada RF y cada BR.
- No invención: cumple. Se siguen únicamente las reglas del contexto del producto y las decisiones confirmadas por el equipo.
- Delimitación: cumple. Se mantiene explícitamente fuera de alcance la reprogramación, la entrega parcial y la atención presencial.
- Utilidad: cumple. Define con rigor el alcance funcional y técnico verificable para el equipo de desarrollo y arquitectura.

## Siguiente paso
La SPEC-001 versión 1.0 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
