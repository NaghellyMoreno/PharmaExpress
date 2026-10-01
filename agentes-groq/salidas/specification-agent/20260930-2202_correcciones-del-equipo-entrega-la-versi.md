<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.6-flash
Fecha: 2026-09-30 22:02
Petición: Correcciones del equipo. Entrega la versión 1.3 candidata en modo Iteración. 1) RF-012 y BR-005 son ambiguos frente a A3 y AC-007: la condición se evalúa por cita. Reescríbelos así: la cancelación de una fórmula afecta solo sus citas que aún no han sido validadas por el dispensador ni han expirado; las citas ya validadas quedan como entregadas y no se modifican. Ajusta RF-003, E2 y AC-002 si es necesario. 2) Agrega en el paso 5 del flujo principal que, cuando la cita tiene una sola fórmula, el usuario selecciona la opción de cancelar. 3) Registra en el historial que RF-013 de la versión 1.1 se integró en RF-007.
-->

# SPEC-001. Cancelación de cita de entrega de medicamentos - Versión 1.3

Estado: Candidata
Modo: Iteración
Necesidad original: "Necesitamos que el paciente pueda cancelar su cita"

## Análisis
- Objetivo: permitir que el paciente o la persona autorizada cancele una cita agendada previamente, retirando la fórmula de sus citas no validadas ni expiradas y liberando los medicamentos reservados y el cupo de la ventana de atención mediante la confirmación por código de un solo uso.
- Alcance inicial: cancelación voluntaria de una fórmula desde la aplicación web, el bot de Telegram o desde el enlace del recordatorio de una hora antes, afectando únicamente a las citas asociadas no validadas ni expiradas, manteniendo como entregadas las citas ya validadas y conservando la cita, su código de entrega y su cupo para las demás fórmulas si la cita agrupaba múltiples fórmulas.
- Actores: Paciente, Persona que actúa por el paciente (cuidador, tutor, familiar), Facilitador comunitario.
- Contexto aplicable: secciones 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.10.

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
  Por qué importa: define el límite temporal para habilitar la opción de cancelación frente al ciclo de atención y la vigencia de la reserva.
  Crítica: sí
  Propuesta del agente: permitir la cancelación en cualquier momento antes de que el dispensador registre la validación oficial del código de entrega en el punto o expire la ventana.
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
Permitir la cancelación voluntaria de una fórmula agendada a través de la aplicación web, el bot de Telegram o el recordatorio de una hora antes, afectando solo a sus citas que no han sido validadas por el dispensador ni han expirado, exigiendo confirmación mediante un código de un solo uso (OTP) que sigue las reglas de identidad, asegurando la retirada de la fórmula de sus citas pendientes, la liberación de medicamentos e inventario y el ajuste de la cita (cancelación y liberación de cupo si queda sin medicamentos, o mantenimiento del mismo código y cupo si conserva otras fórmulas), manteniendo como entregadas las citas ya validadas, y notificando por todos los medios sin datos sensibles.

### 2. Contexto
Pharma Express gestiona pre-dispensaciones farmacéuticas y citas en puntos de Disfarma en Manizales. De acuerdo con las secciones 3.4, 3.5 y 3.10 del contexto, las fórmulas separadas son independientes y no existe reprogramación de citas; si el usuario desea cambiar su cita, debe cancelar e iniciar una nueva solicitud. El código de entrega y el cupo en la ventana pertenecen a la cita y no a la fórmula.

Decisiones del equipo:
- DEC-001. La cancelación opera por fórmula y la retira de sus citas asociadas. Responde a OPEN-Q-001.
- DEC-002. La cancelación voluntaria de una fórmula afecta solo sus citas que aún no han sido validadas por el dispensador ni han expirado; las citas ya validadas quedan como entregadas y no se modifican. Responde a OPEN-Q-002.
- DEC-003. La confirmación de la cancelación requiere la validación de un código de un solo uso (OTP), siguiendo las reglas del código de identidad del contexto 3.2: dura 10 minutos, admite 3 intentos y se envía por SMS al celular registrado y por correo si existe. Responde a OPEN-Q-003.
- DEC-004. Al cancelar la fórmula sin entregas previas, la fórmula retorna a su estado inicial previo a la prevalidación, debiendo realizarse todo el proceso nuevamente para solicitar una cita en el futuro. Responde a OPEN-Q-004.
- DEC-005. El código de entrega y el cupo pertenecen a la cita, no a la fórmula. Al cancelar una fórmula, el sistema la retira de todas sus citas asociadas no validadas ni expiradas y libera sus medicamentos reservados. Una cita que queda sin medicamentos se cancela, se anula su código de entrega y se libera su cupo. Una cita que conserva medicamentos de otras fórmulas sigue vigente con el mismo código de entrega y el mismo cupo. Respalda la independencia de fórmulas del contexto 3.4 y ajusta la inconsistencia funcional detectada por el equipo.

### 3. Alcance
Incluye:
- Consulta de citas y fórmulas activas por parte del canal vinculado (Web o Telegram).
- Selección explícita de la fórmula a cancelar cuando una cita contiene medicamentos de varias fórmulas, o selección directa de la opción de cancelar si la cita tiene una sola fórmula.
- Solicitud de cancelación voluntaria desde la consulta de citas/fórmulas o iniciada desde el recordatorio de una hora antes recibido por SMS, correo, Telegram o web.
- Verificación previa de identidad si el usuario inicia la cancelación desde un SMS o correo en un canal sin vincular.
- Generación, envío y verificación de un código de un solo uso (OTP) con vigencia de 10 minutos y 3 intentos, enviado por SMS y correo si existe.
- Retirada de la fórmula cancelada únicamente de las citas asociadas que no han sido validadas por el dispensador ni han expirado.
- Preservación como entregadas de las citas de la fórmula que ya fueron validadas por el dispensador.
- Liberación de los medicamentos reservados pertenecientes a la fórmula en las citas canceladas.
- Cancelación de la cita, inactivación de su código de entrega (QR y numérico) y liberación del cupo en la ventana si la cita queda sin medicamentos.
- Mantenimiento de la cita vigente con el mismo código de entrega y el mismo cupo si conserva medicamentos de otras fórmulas independientes.
- Cierre de fórmula y registro de medicamentos no recogidos como perdidos en caso de cancelación tras entregas parciales.
- Retorno de la fórmula a su estado inicial si no hubo entregas previas.
- Notificación de confirmación de cancelación por todos los canales registrados del paciente sin incluir nombres de medicamentos ni diagnósticos.

No incluye:
- Reprogramación directa de la cita (contexto 3.10).
- Modificación o cancelación de citas que ya fueron validadas por el dispensador en el punto (DEC-002).
- Cancelación de citas que ya expiraron por haber finalizado su ventana de 1 hora (DEC-002).
- Gestión de pendientes o reclamos de faltantes en el punto (contexto 3.7, 3.10).

### 4. Actores e historias de usuario
Actores:
- Paciente: afiliado que consulta y cancela la reserva de una fórmula.
- Persona que actúa por el paciente / Facilitador comunitario: opera desde un canal vinculado en nombre del paciente.

Historias de usuario:
- HU-001. Como paciente o persona autorizada, quiero cancelar la reserva de una fórmula validando un código de confirmación enviado a mis medios de contacto, para retirarla de sus citas no validadas ni expiradas y liberar sus medicamentos sin perjudicar citas ya entregadas ni otras fórmulas o citas vigentes, pudiendo realizar una nueva prevalidación en el futuro si lo requiero.

### 5. Requisitos funcionales
- RF-001. El sistema debe permitir al usuario consultar las citas activas y las fórmulas asociadas a ellas para el paciente seleccionado en la aplicación web o en el bot de Telegram. Origen: contexto 3.1, 3.3.
- RF-002. El sistema debe ofrecer la opción de seleccionar y cancelar una fórmula activa dentro del flujo autenticado. Si la cita agrupa varias fórmulas, el sistema debe exigir que el usuario elija explícitamente cuál fórmula desea cancelar; si la cita tiene una sola fórmula, el usuario selecciona la opción de cancelar. Origen: necesidad, contexto 3.4, DEC-005.
- RF-003. El sistema debe permitir solicitar la cancelación de una fórmula afectando únicamente aquellas citas asociadas que no hayan sido validadas por el dispensador en el punto y cuya ventana de 1 hora no haya finalizado. Origen: DEC-002, contexto 3.5, 3.7.
- RF-004. Al solicitar la cancelación de una fórmula, el sistema debe generar y enviar un código de un solo uso (OTP) al celular registrado por SMS y al correo registrado si existe, con vigencia de 10 minutos y límite de 3 intentos de validación. Origen: DEC-003, contexto 3.2.
- RF-005. Al cancelar una fórmula tras validar el código OTP, el sistema debe retirarla de sus citas asociadas no validadas ni expiradas y liberar los medicamentos reservados de dicha fórmula en esas citas. Origen: DEC-001, DEC-002, DEC-005.
- RF-006. Si una cita queda sin medicamentos tras retirar la fórmula cancelada, el sistema debe cancelar la cita, inactivar su código de entrega (QR y numérico) y liberar el cupo ocupado en la ventana del punto. Origen: DEC-005, contexto 3.5.
- RF-007. Si una cita conserva medicamentos de otras fórmulas tras retirar la fórmula cancelada, el sistema debe mantener la cita vigente con el mismo código de entrega y el mismo cupo en la ventana del punto. Origen: DEC-005, contexto 3.4.
- RF-008. Si el paciente ya recibió una entrega parcial en el punto y cancela la fórmula de los medicamentos restantes, el sistema debe registrar lo no recogido como perdido y cerrar la fórmula, manteniendo como entregadas las citas ya validadas. Origen: contexto 3.5, DEC-002.
- RF-009. Al concretar la cancelación de una fórmula sin entregas previas, el sistema debe retornar la fórmula a su estado inicial previo a la prevalidación, requiriendo un nuevo proceso completo para solicitar cita. Origen: DEC-004.
- RF-010. Tras concretar la cancelación, el sistema debe enviar un mensaje de confirmación por todos los medios del paciente: notificación web en navegadores vinculados, mensaje en chats de Telegram vinculados, SMS al celular registrado y correo si existe. Origen: contexto 3.6.
- RF-011. Ningún mensaje de confirmación de cancelación debe contener nombres de medicamentos ni diagnósticos. Origen: contexto 3.6.
- RF-012. La cancelación de una fórmula afecta solo sus citas que aún no han sido validadas por el dispensador ni han expirado; las citas ya validadas quedan como entregadas y no se modifican. Origen: DEC-002, contexto 3.5, 3.7.

### 6. Requisitos no funcionales
- RNF-001. Consistencia del estado de citas y reservas. Al registrarse la confirmación válida de cancelación de una fórmula, el sistema debe actualizar de forma atómica la liberación de existencias reservadas y el estado de cada cita afectada no validada ni expirada (cancelando la cita, anulando su código y liberando el cupo si queda sin medicamentos; o conservando la cita, el código y el cupo si mantiene otras fórmulas), manteniendo inalteradas las citas ya validadas como entregadas, reflejando la disponibilidad para consultas posteriores y rechazando el uso de códigos inactivados en el punto. Se verifica mediante pruebas de integración entre cancelación y validación en ventanilla/disponibilidad. Origen: contexto 3.5, DEC-002, DEC-005.
- RNF-002. Seguridad del canal y autorización. La cancelación solo debe procesarse si el canal (web o Telegram) cuenta con una vinculación vigente (menor a 3 meses) y tras verificar el código OTP de confirmación. Se verifica mediante pruebas con vinculación vencida y con códigos OTP expirados o erróneos. Origen: contexto 3.2, 3.3, DEC-003.

### 7. Reglas de negocio
- BR-001. Ausencia de reprogramación. El sistema no permite modificar la fecha, hora o punto de una cita. Toda modificación requiere cancelar la fórmula existente y realizar una nueva solicitud. Origen: contexto 3.5, 3.10.
- BR-002. Selección obligatoria de paciente. En canales vinculados a más de un paciente, el sistema debe exigir la selección del paciente antes de consultar citas o solicitar cancelaciones. Origen: contexto 3.3.
- BR-003. Anonimización en comunicaciones. Las confirmaciones de cancelación emitidas por cualquier medio no deben incluir nombres de medicamentos ni diagnósticos. Origen: contexto 3.6.
- BR-004. Cancelación indivisible por fórmula en citas pendientes. La cancelación opera por fórmula: al cancelar una fórmula, esta se retira de todas sus citas asociadas que no hayan sido validadas ni expiradas y se liberan todos sus medicamentos reservados en ellas. Origen: DEC-001, DEC-002, DEC-005.
- BR-005. Oportunidad y alcance de cancelación por cita. La cancelación de una fórmula afecta solo sus citas que aún no han sido validadas por el dispensador ni han expirado; las citas ya validadas quedan como entregadas y no se modifican. Origen: DEC-002, contexto 3.5, 3.7.
- BR-006. Reglas del código OTP de confirmación. El código de confirmación de cancelación sigue las reglas del código de identidad: vigencia de 10 minutos, máximo 3 intentos permitidos y envío concurrente por SMS y correo si existe. Si expira o se agotan los intentos, no se realiza la cancelación y se orienta a solicitar un código nuevo. Origen: contexto 3.2, DEC-003.
- BR-007. Destino de la fórmula sin entregas. Al cancelar una cita/fórmula sin ninguna entrega previa, la fórmula retorna a su estado inicial y exige prevalidación completa para volver a agendar. Origen: DEC-004.
- BR-008. Pertenencia de código y cupo a la cita. El código de entrega y el cupo pertenecen a la cita. Si una cita agrupa varias fórmulas y se cancela una de ellas, la cita y su cupo continúan activos con el mismo código de entrega para las fórmulas restantes. La cita solo se cancela, inactiva su código y libera su cupo cuando queda totalmente vacía de medicamentos. Origen: DEC-005, contexto 3.4.

### 8. Flujo principal
1. El usuario ingresa a Pharma Express por la web o por el bot de Telegram.
2. Si el canal tiene varios pacientes vinculados, el usuario selecciona el paciente a gestionar.
3. El usuario accede a la sección de consulta de citas activas.
4. El sistema muestra las citas agendadas del paciente con su fecha, ventana de 1 hora, punto, código de entrega y las fórmulas asociadas.
5. Si una cita agrupa medicamentos de varias fórmulas, el usuario selecciona explícitamente dentro del flujo autenticado qué fórmula desea cancelar. Cuando la cita tiene una sola fórmula, el usuario selecciona la opción de cancelar.
6. El sistema advierte que la fórmula se retirará de todas sus citas asociadas pendientes (no validadas ni expiradas) y liberará sus medicamentos; aclara además que si una cita queda sin medicamentos se cancelará y liberará su cupo, mientras que si conserva otras fórmulas seguirá vigente con el mismo código y cupo, y que las citas ya validadas en el punto se mantienen como entregadas.
7. El sistema genera un código OTP de 10 minutos de vigencia, lo envía por SMS al celular del paciente y al correo si existe, e informa que tiene 3 intentos para ingresarlo.
8. El usuario ingresa el código OTP recibido.
9. El sistema valida el código OTP dentro del tiempo y de los intentos permitidos.
10. El sistema retira la fórmula de sus citas asociadas que no han sido validadas por el dispensador ni han expirado, y libera los medicamentos reservados de dicha fórmula en esas citas.
11. Para cada cita afectada no validada ni expirada: si la cita queda sin medicamentos, el sistema la cancela, inactiva su código de entrega y libera su cupo en la ventana del punto; si la cita conserva medicamentos de otras fórmulas, se mantiene vigente con el mismo código de entrega y el mismo cupo.
12. El sistema gestiona el estado final de la fórmula: si la fórmula no tuvo entregas previas, vuelve a su estado inicial previo a la prevalidación; si la fórmula tuvo entregas previas (citas validadas en el punto), aplica el procedimiento del flujo A3 (mantiene las citas validadas como entregadas, registra los medicamentos no recogidos de las citas pendientes como perdidos y cierra la fórmula de manera definitiva).
13. El sistema muestra la confirmación de la cancelación en pantalla.
14. El sistema envía la notificación de confirmación de cancelación por notificación web, Telegram, SMS y correo si existe, sin nombres de medicamentos ni diagnósticos.

### 9. Flujos alternativos y de excepción
- A1. Código OTP erróneo, vencido o agotamiento de intentos:
  1. En el paso 9 del flujo principal, el código ingresado no coincide o pasaron más de 10 minutos.
  2. Si no ha superado 3 intentos y está vigente, el sistema indica el error y los intentos restantes.
  3. Si pasaron los 10 minutos o se agotaron los 3 intentos, el sistema rechaza la operación, mantiene las citas y reservas activas y ofrece solicitar un nuevo código. Origen: contexto 3.2, DEC-003.

- A2. Cancelación iniciada desde el recordatorio de una hora antes:
  1. El usuario recibe el recordatorio una hora antes de la cita por notificación web, Telegram, SMS o correo.
  2. El recordatorio ofrece la opción de cancelar la cita/fórmula.
  3. El usuario selecciona la opción de cancelar desde el mensaje de recordatorio.
  4. Si la acción se inició desde un SMS o correo y el navegador o chat no cuenta con vinculación activa, el sistema solicita primero la verificación de identidad del paciente con cédula y código de un solo uso según el contexto 3.2.
  5. Una vez verificada la identidad y vinculado el canal, el sistema solicita seleccionar la fórmula a cancelar (o confirma la selección si la cita tiene una sola fórmula) y muestra la advertencia de cancelación.
  6. El flujo continúa en el paso 7 del flujo principal generando el código OTP de confirmación de la cancelación. Origen: contexto 3.2, 3.6, DEC-003.

- A3. Cancelación tras entrega parcial previa (citas validadas en el punto):
  1. En el paso 10 del flujo principal, el paciente ya recibió una entrega previa en el punto y la cita correspondiente figura como validada/entregada.
  2. El sistema mantiene inalterada la cita ya validada como entregada.
  3. El sistema retira los medicamentos pendientes de la fórmula de la cita pendiente no validada ni expirada.
  4. Si la cita pendiente queda sin medicamentos, el sistema la cancela, inactiva su código de entrega y libera su cupo.
  5. El sistema marca los medicamentos no recogidos de la cita cancelada como perdidos y cierra la fórmula de manera definitiva.
  6. El sistema notifica la cancelación informando el cierre de la fórmula sin incluir nombres de medicamentos ni diagnósticos. Origen: contexto 3.5, DEC-002.

- A4.
