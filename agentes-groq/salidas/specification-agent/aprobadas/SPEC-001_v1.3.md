<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.6-flash
Fecha: 2026-09-30 22:08
Petición: El equipo aprueba la SPEC-001 versión 1.3
-->

# SPEC-001. Cancelación de cita de entrega de medicamentos - Versión 1.3

Estado: Aprobada y congelada
Modo: Aprobación
Necesidad original: "Necesitamos que el paciente pueda cancelar su cita"

## Análisis
- Objetivo: permitir que el paciente o la persona autorizada cancele una cita agendada previamente, retirando la fórmula de sus citas y liberando los medicamentos reservados y el cupo de la ventana de atención mediante la confirmación por código de un solo uso.
- Alcance inicial: cancelación voluntaria de una fórmula desde la aplicación web, el bot de Telegram o desde el enlace del recordatorio de una hora antes, afectando de manera individual a cada una de sus citas que aún no hayan sido validadas por el dispensador ni hayan expirado, manteniendo las citas ya validadas como entregadas sin modificación, y conservando la cita, su código de entrega y su cupo vigentes para las demás fórmulas si la cita agrupaba múltiples fórmulas.
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
Permitir la cancelación voluntaria de una fórmula agendada a través de la aplicación web, el bot de Telegram o el recordatorio de una hora antes, evaluada por cita de modo que afecte únicamente a las citas que aún no han sido validadas por el dispensador ni han expirado, exigiendo confirmación mediante un código de un solo uso (OTP) que sigue las reglas de identidad, asegurando la retirada de la fórmula de sus citas no validadas, la liberación de medicamentos e inventario y el ajuste de la cita (cancelación y liberación de cupo si queda sin medicamentos, o mantenimiento del mismo código y cupo si conserva otras fórmulas), notificando por todos los medios sin datos sensibles.

### 2. Contexto
Pharma Express gestiona pre-dispensaciones farmacéuticas y citas en puntos de Disfarma en Manizales. De acuerdo con las secciones 3.4, 3.5 y 3.10 del contexto, las fórmulas separadas son independientes y no existe reprogramación de citas; si el usuario desea cambiar su cita, debe cancelar e iniciar una nueva solicitud. El código de entrega y el cupo en la ventana pertenecen a la cita y no a la fórmula.

Decisiones del equipo:
- DEC-001. La cancelación opera por fórmula y la retira de sus citas asociadas. Responde a OPEN-Q-001.
- DEC-002. La cancelación voluntaria se evalúa por cita y aplica en cualquier momento hasta que el dispensador valide el código de entrega en el punto o termine la ventana de 1 hora de la cita. Responde a OPEN-Q-002.
- DEC-003. La confirmación de la cancelación requiere la validación de un código de un solo uso (OTP), siguiendo las reglas del código de identidad del contexto 3.2: dura 10 minutos, admite 3 intentos y se envía por SMS al celular registrado y por correo si existe. Responde a OPEN-Q-003.
- DEC-004. Al cancelar la fórmula sin entregas previas, la fórmula retorna a su estado inicial previo a la prevalidación, debiendo realizarse todo el proceso nuevamente para solicitar una cita en el futuro. Responde a OPEN-Q-004.
- DEC-005. El código de entrega y el cupo pertenecen a la cita, no a la fórmula. Al cancelar una fórmula, el sistema la retira de todas sus citas asociadas no validadas ni expiradas y libera sus medicamentos reservados. Una cita que queda sin medicamentos se cancela, se anula su código de entrega y se libera su cupo. Una cita que conserva medicamentos de otras fórmulas sigue vigente con el mismo código de entrega y el mismo cupo. Respalda la independencia de fórmulas del contexto 3.4 y ajusta la inconsistencia funcional detectada por el equipo.

### 3. Alcance
Incluye:
- Consulta de citas y fórmulas activas por parte del canal vinculado (Web o Telegram).
- Selección de la opción de cancelar cuando la cita tiene una sola fórmula, o selección explícita de la fórmula a cancelar cuando una cita contiene medicamentos de varias fórmulas.
- Solicitud de cancelación voluntaria desde la consulta de citas/fórmulas o iniciada desde el recordatorio de una hora antes recibido por SMS, correo, Telegram o web.
- Verificación previa de identidad si el usuario inicia la cancelación desde un SMS o correo en un canal sin vincular.
- Generación, envío y verificación de un código de un solo uso (OTP) con vigencia de 10 minutos y 3 intentos, enviado por SMS y correo si existe.
- Retirada de la fórmula cancelada únicamente de las citas que no han sido validadas por el dispensador ni hayan expirado.
- Preservación del estado como entregado y sin modificaciones para las citas de la fórmula que ya fueron validadas por el dispensador en el punto.
- Liberación de los medicamentos reservados pertenecientes a la fórmula cancelada en las citas no validadas.
- Cancelación de la cita, inactivación de su código de entrega (QR y numérico) y liberación del cupo en la ventana si la cita queda sin medicamentos.
- Mantenimiento de la cita vigente con el mismo código de entrega y el mismo cupo si conserva medicamentos de otras fórmulas independientes.
- Cierre de fórmula y registro de medicamentos como perdidos en caso de cancelación tras entregas parciales previa validación en punto.
- Retorno de la fórmula a su estado inicial si no hubo entregas previas.
- Notificación de confirmación de cancelación por todos los canales registrados del paciente sin incluir nombres de medicamentos ni diagnósticos.

No incluye:
- Reprogramación directa de la cita (contexto 3.10).
- Modificación o cancelación de entregas ya validadas por el dispensador en el punto (DEC-002, contexto 3.7).
- Gestión de pendientes o reclamos de faltantes en el punto (contexto 3.7, 3.10).

### 4. Actores e historias de usuario
Actores:
- Paciente: afiliado que consulta y cancela la reserva de una fórmula.
- Persona que actúa por el paciente / Facilitador comunitario: opera desde un canal vinculado en nombre del paciente.

Historias de usuario:
- HU-001. Como paciente o persona autorizada, quiero cancelar la reserva de una fórmula validando un código de confirmación enviado a mis medios de contacto, para retirarla de sus citas no validadas ni expiradas y liberar sus medicamentos sin perjudicar otras fórmulas ni citas que sigan vigentes, pudiendo realizar una nueva prevalidación en el futuro si lo requiero.

### 5. Requisitos funcionales
- RF-001. El sistema debe permitir al usuario consultar las citas activas y las fórmulas asociadas a ellas para el paciente seleccionado en la aplicación web o en el bot de Telegram. Origen: contexto 3.1, 3.3.
- RF-002. El sistema debe ofrecer la opción de cancelar una fórmula activa dentro del flujo autenticado. Si la cita tiene una sola fórmula, el usuario selecciona la opción de cancelar; si la cita agrupaba varias fórmulas, el sistema debe exigir que el usuario elija explícitamente cuál fórmula desea cancelar. Origen: necesidad, contexto 3.4, DEC-005.
- RF-003. El sistema debe permitir solicitar la cancelación de una fórmula en cualquier momento, evaluando la condición por cita, de modo que la cancelación aplique a las citas asociadas a la fórmula que aún no han sido validadas por el dispensador y cuya ventana no ha finalizado. Origen: DEC-002, contexto 3.5, 3.7.
- RF-004. Al solicitar la cancelación de una fórmula, el sistema debe generar y enviar un código de un solo uso (OTP) al celular registrado por SMS y al correo registrado si existe, con vigencia de 10 minutos y límite de 3 intentos de validación. Origen: DEC-003, contexto 3.2.
- RF-005. Al cancelar una fórmula tras validar el código OTP, el sistema debe retirarla de sus citas asociadas que no hayan sido validadas ni hayan expirado, y liberar los medicamentos reservados correspondientes. Origen: DEC-001, DEC-005.
- RF-006. Si una cita queda sin medicamentos tras retirar la fórmula cancelada, el sistema debe cancelar la cita, inactivar su código de entrega (QR y numérico) y liberar el cupo ocupado en la ventana del punto. Origen: DEC-005, contexto 3.5.
- RF-007. Si una cita conserva medicamentos de otras fórmulas tras retirar la fórmula cancelada, el sistema debe mantener la cita vigente con el mismo código de entrega y el mismo cupo en la ventana del punto. Origen: DEC-005, contexto 3.4.
- RF-008. Si el paciente ya recibió una entrega parcial en el punto y cancela la fórmula de los medicamentos restantes, el sistema debe registrar lo no recogido como perdido y cerrar la fórmula. Origen: contexto 3.5.
- RF-009. Al concretar la cancelación de una fórmula sin entregas previas, el sistema debe retornar la fórmula a su estado inicial previo a la prevalidación, requiriendo un nuevo proceso completo para solicitar cita. Origen: DEC-004.
- RF-010. Tras concretar la cancelación, el sistema debe enviar un mensaje de confirmación por todos los medios del paciente: notificación web en navegadores vinculados, mensaje en chats de Telegram vinculados, SMS al celular registrado y correo si existe. Origen: contexto 3.6.
- RF-011. Ningún mensaje de confirmación de cancelación debe contener nombres de medicamentos ni diagnósticos. Origen: contexto 3.6.
- RF-012. La cancelación de una fórmula afecta solo sus citas que aún no han sido validadas por el dispensador ni han expirado; las citas ya validadas quedan como entregadas y no se modifican. Origen: DEC-002, contexto 3.5, 3.7.

### 6. Requisitos no funcionales
- RNF-001. Consistencia del estado de citas y reservas. Al registrarse la confirmación válida de cancelación de una fórmula, el sistema debe actualizar de forma atómica la liberación de existencias reservadas y el estado de cada cita afectada que no haya sido validada ni haya expirado (cancelando la cita, anulando su código y liberando el cupo si queda sin medicamentos; o conservando la cita, el código y el cupo si mantiene otras fórmulas), reflejando la disponibilidad para consultas posteriores y rechazando el uso de códigos inactivados en el punto. Se verifica mediante pruebas de integración entre cancelación y validación en ventanilla/disponibilidad. Origen: contexto 3.5, DEC-005.
- RNF-002. Seguridad del canal y autorización. La cancelación solo debe procesarse si el canal (web o Telegram) cuenta con una vinculación vigente (menor a 3 meses) y tras verificar el código OTP de confirmación. Se verifica mediante pruebas con vinculación vencida y con códigos OTP expirados o erróneos. Origen: contexto 3.2, 3.3, DEC-003.

### 7. Reglas de negocio
- BR-001. Ausencia de reprogramación. El sistema no permite modificar la fecha, hora o punto de una cita. Toda modificación requiere cancelar la fórmula existente y realizar una nueva solicitud. Origen: contexto 3.5, 3.10.
- BR-002. Selección obligatoria de paciente. En canales vinculados a más de un paciente, el sistema debe exigir la selección del paciente antes de consultar citas o solicitar cancelaciones. Origen: contexto 3.3.
- BR-003. Anonimización en comunicaciones. Las confirmaciones de cancelación emitidas por cualquier medio no deben incluir nombres de medicamentos ni diagnósticos. Origen: contexto 3.6.
- BR-004. Cancelación indivisible por fórmula. La cancelación opera por fórmula: al cancelar una fórmula, esta se retira de todas las citas no validadas ni expiradas en las que se encontraba agendada y se liberan todos sus medicamentos reservados no entregados. Origen: DEC-001, DEC-005.
- BR-005. Oportunidad de cancelación por cita. La cancelación de una fórmula afecta solo sus citas que aún no han sido validadas por el dispensador ni han expirado; las citas ya validadas quedan como entregadas y no se modifican. Origen: DEC-002, contexto 3.5, 3.7.
- BR-006. Reglas del código OTP de confirmación. El código de confirmación de cancelación sigue las reglas del código de identidad: vigencia de 10 minutos, máximo 3 intentos permitidos y envío concurrente por SMS y correo si existe. Si expira o se agotan los intentos, no se realiza la cancelación y se orienta a solicitar un código nuevo. Origen: contexto 3.2, DEC-003.
- BR-007. Destino de la fórmula sin entregas. Al cancelar una cita/fórmula sin ninguna entrega previa, la fórmula retorna a su estado inicial y exige prevalidación completa para volver a agendar. Origen: DEC-004.
- BR-008. Pertenencia de código y cupo a la cita. El código de entrega y el cupo pertenecen a la cita. Si una cita agrupa varias fórmulas y se cancela una de ellas, la cita y su cupo continúan activos con el mismo código de entrega para las fórmulas restantes. La cita solo se cancela, inactiva su código y libera su cupo cuando queda totalmente vacía de medicamentos. Origen: DEC-005, contexto 3.4.

### 8. Flujo principal
1. El usuario ingresa a Pharma Express por la web o por el bot de Telegram.
2. Si el canal tiene varios pacientes vinculados, el usuario selecciona el paciente a gestionar.
3. El usuario accede a la sección de consulta de citas activas.
4. El sistema muestra las citas agendadas del paciente con su fecha, ventana de 1 hora, punto, código de entrega y las fórmulas asociadas.
5. Cuando la cita tiene una sola fórmula, el usuario selecciona la opción de cancelar. Si una cita agrupa medicamentos de varias fórmulas, el usuario selecciona explícitamente dentro del flujo autenticado qué fórmula desea cancelar.
6. El sistema advierte que la fórmula se retirará de todas sus citas asociadas no validadas ni expiradas y liberará sus medicamentos; aclara además que si una cita queda sin medicamentos se cancelará y liberará su cupo, mientras que si conserva otras fórmulas seguirá vigente con el mismo código y cupo.
7. El sistema genera un código OTP de 10 minutos de vigencia, lo envía por SMS al celular del paciente y al correo si existe, e informa que tiene 3 intentos para ingresarlo.
8. El usuario ingresa el código OTP recibido.
9. El sistema valida el código OTP dentro del tiempo y de los intentos permitidos.
10. El sistema retira la fórmula de sus citas asociadas que no hayan sido validadas ni hayan expirado y libera los medicamentos reservados correspondientes.
11. Para cada cita afectada no validada: si la cita queda sin medicamentos, el sistema la cancela, inactiva su código de entrega y libera su cupo en la ventana del punto; si la cita conserva medicamentos de otras fórmulas, se mantiene vigente con el mismo código de entrega y el mismo cupo.
12. El sistema gestiona el estado final de la fórmula: si la fórmula no tuvo entregas previas, vuelve a su estado inicial previo a la prevalidación; si la fórmula tuvo entregas previas en alguna cita ya validada, aplica el procedimiento del flujo A3 (registra lo no recogido como perdido y cierra la fórmula de manera definitiva).
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
  5. Una vez verificada la identidad y vinculado el canal, el sistema ejecuta el paso 5 del flujo principal (selección de opción de cancelar si la cita tiene una sola fórmula, o selección explícita de fórmula si hay varias) y muestra la advertencia de cancelación.
  6. El flujo continúa en el paso 7 del flujo principal generando el código OTP de confirmación de la cancelación. Origen: contexto 3.2, 3.6, DEC-003.

- A3. Cancelación tras entrega parcial previa:
  1. En el paso 10 del flujo principal, el paciente ya recibió una entrega parcial de la fórmula en un punto anterior mediante una cita previamente validada por el dispensador.
  2. El sistema retira los medicamentos pendientes de la fórmula en las citas asociadas que no han sido validadas ni han expirado.
  3. Si la cita pendiente del faltante queda sin medicamentos, el sistema la cancela, inactiva su código de entrega y libera su cupo.
  4. El sistema mantiene la cita previa validada como entregada sin modificación, marca los medicamentos no recogidos como perdidos y cierra la fórmula de manera definitiva.
  5. El sistema notifica la cancelación informando el cierre de la fórmula sin incluir nombres de medicamentos ni diagnósticos. Origen: contexto 3.5.

- A4. Cancelación de una fórmula en cita con múltiples fórmulas:
  1. En el paso 5 del flujo principal, la cita contiene medicamentos de la fórmula seleccionada y de otra fórmula independiente.
  2. Al confirmar el código OTP, el sistema retira únicamente la fórmula seleccionada de la cita (si no ha sido validada ni ha expirado) y libera sus medicamentos reservados.
  3. El sistema verifica que la cita mantiene medicamentos de la otra fórmula, por lo que la cita sigue vigente con el mismo código de entrega y conservando el mismo cupo en la ventana.
  4. Si no tuvo entregas previas, la fórmula cancelada regresa a su estado inicial.
  5. El sistema notifica la confirmación de cancelación de la fórmula correspondiente sin nombres de medicamentos ni diagnósticos. Origen: DEC-005, contexto 3.4.

- E1. Intento de cancelación posterior a la finalización de la ventana de la cita:
  1. El usuario intenta cancelar una fórmula cuyas citas asociadas ya finalizaron su ventana de 1 hora.
  2. El sistema rechaza la solicitud para las citas expiradas e informa que la cita ha expirado y no admite cancelación. Origen: DEC-002, contexto 3.5.

- E2. Intento de cancelación cuando una cita ya fue validada por el dispensador en el punto:
  1. El dispensador registró la validación oficial del código en el punto para una de las citas de la fórmula.
  2. El usuario intenta cancelar la fórmula desde el canal.
  3. El sistema procesa la cancelación únicamente para las citas de la fórmula que aún no han sido validadas ni han expirado; la cita ya validada en el punto permanece como entregada y no se modifica. Origen: DEC-002, contexto 3.5, 3.7.

- E3. Canal con vinculación vencida (superior a 3 meses):
  1. El usuario intenta consultar o cancelar desde un navegador o chat cuya vinculación superó los 3 meses.
  2. El sistema bloquea la gestión y solicita una nueva verificación de identidad con código de un solo uso. Origen: contexto 3.3.

### 10. Casos límite
- CL-001. Solicitud de cancelación durante el transcurso de la ventana de atención antes de la atención en punto: si la ventana de 1 hora ya inició, pero el dispensador aún no valida el código de entrega, el sistema permite y procesa la cancelación con el código OTP. Origen: DEC-002, contexto 3.5.
- CL-002. Solicitud de cancelación en el minuto exacto de terminación de la ventana: si la ventana de 1 hora ya concluyó, el sistema rechaza la operación por expiración de la cita. Origen: DEC-002, contexto 3.5.
- CL-003. Concurrencia entre validación del dispensador y confirmación de cancelación: si el dispensador valida el código en el punto mientras el usuario ingresa el código OTP, el sistema procesa primero la acción del dispensador; al evaluar la cita en la cancelación, el sistema la identifica como ya validada, manteniéndola como entregada y aplicando la cancelación solo a otras citas no validadas si existieran. Origen: DEC-002, contexto 3.7.
- CL-004. Fórmula con citas en puntos diferentes: si una fórmula generó dos citas en puntos distintos, la confirmación de cancelación de la fórmula aplica a cada cita no validada ni expirada; las citas que queden vacías se cancelan inactivando sus códigos y liberando sus cupos. Origen: DEC-001, DEC-005.
- CL-005. Cita compartida entre múltiples fórmulas: si una cita no validada contiene medicamentos de dos fórmulas distintas y se cancela una de ellas, la cita permanece activa en el punto conservando el mismo código de entrega y el mismo cupo para la fórmula restante, liberando únicamente los medicamentos de la fórmula cancelada. Origen: DEC-005, contexto 3.4.

### 11. Criterios de aceptación
- AC-001. Cancelación exitosa de fórmula sin entregas previas antes o durante la ventana
  Dado que un paciente tiene agendada una fórmula sin entregas previas en una cita cuyo dispensador no ha validado el código y cuya ventana no ha finalizado,
  cuando el usuario solicita la cancelación, ingresa el código OTP enviado a su celular/correo dentro de los 10 minutos y antes de 3 intentos fallidos,
  entonces el sistema retira la fórmula de sus citas, libera sus medicamentos reservados, cancela las citas que hayan quedado vacías inactivando su código y liberando el cupo, retorna la fórmula a su estado inicial y envía la notificación de confirmación por todos los canales del paciente.

- AC-002. Evaluación por cita al cancelar fórmula con citas ya validadas o expiradas
  Dado que una fórmula tiene citas asociadas y al menos una de ellas ya fue validada por el dispensador en el punto o su ventana ya concluyó,
  cuando el usuario solicita la cancelación de la fórmula desde la web o Telegram,
  entonces el sistema aplica la cancelación únicamente a las citas que no han sido validadas ni han expirado (retirando sus medicamentos, inactivando códigos y liberando cupos si quedan vacías), mientras que las citas ya validadas se mantienen como entregadas sin modificación.

- AC-003. Control de intentos y vigencia del código OTP de cancelación
  Dado que el usuario solicitó la cancelación y recibió el código OTP en su celular/correo,
  cuando el usuario ingresa un código incorrecto por tercera vez o ingresa el código pasados 10 minutos desde su emisión,
  entonces el sistema rechaza la confirmación, mantiene la cita y sus reservas activas e informa que debe solicitar un código nuevo.

- AC-004. Cancelación indivisible de fórmulas distribuidas en múltiples citas no validadas
  Dado que una fórmula tiene medicamentos distribuidos en dos citas no validadas en puntos distintos,
  cuando el usuario confirma la cancelación de la fórmula mediante el código OTP,
  entonces el sistema retira la fórmula de ambas citas, inactiva los códigos de entrega y libera los cupos e inventarios reservados si las citas quedan vacías.

- AC-005. Exclusión de datos sensibles en la confirmación de cancelación
  Dado que una fórmula/cita fue cancelada exitosamente,
  cuando el sistema emite los mensajes de confirmación a través de SMS, correo, Telegram y web,
  entonces los mensajes informan la cancelación sin mencionar ningún nombre de medicamento ni diagnóstico.

- AC-006. Obligatoriedad de nueva prevalidación tras cancelar fórmula sin entregas
  Dado que una fórmula sin entregas previas fue cancelada y regresó a su estado inicial,
  cuando el usuario intenta agendar una nueva cita para dicha fórmula,
  entonces el sistema no permite agendar directamente y exige realizar una nueva prevalidación completa.

- AC-007. Cancelación de fórmula con entrega parcial previa
  Dado que un paciente ya recibió una entrega parcial de su fórmula en un punto y tiene una cita agendada pendiente para reclamar el resto de medicamentos,
  cuando el usuario confirma la cancelación de dicha fórmula con el código OTP,
  entonces el sistema inactiva el código de entrega de la cita pendiente si queda vacía, libera su cupo y reservas, mantiene la entrega parcial previa realizada en el punto como entregada, registra los medicamentos pendientes como perdidos, cierra definitivamente la fórmula y notifica la cancelación sin datos sensibles.

- AC-008. Selección de paciente en canal con múltiples vinculaciones
  Dado un canal (web o bot de Telegram) que tiene vinculados dos o más pacientes,
  cuando el usuario ingresa a la opción de consultar o cancelar citas,
  entonces el sistema presenta la lista de pacientes vinculados y exige seleccionar a cuál de ellos corresponde la gestión antes de mostrar las citas o procesar cancelaciones.

- AC-009. Cancelación iniciada desde el recordatorio de una hora antes con verificación previa si el canal no está vinculado
  Dado que el paciente recibe el recordatorio de una hora antes por SMS o correo y abre la opción de cancelar en un navegador o chat sin vinculación activa,
  cuando el usuario ingresa sus datos de identidad, valida el código OTP de identidad según el contexto 3.2 y posteriormente confirma la cancelación con el código OTP de confirmación,
  entonces el sistema procesa la cancelación de la fórmula, ajusta las citas y notifica la confirmación por todos los canales.

- AC-010. Concurrencia entre validación en ventanilla y confirmación de cancelación
  Dado que un paciente tiene una cita activa y el dispensador registra la validación oficial del código de entrega en el punto en concurrencia con la confirmación de cancelación enviada por el usuario,
  cuando el sistema procesa primero la validación del dispensador,
  entonces el sistema registra la cita como validada y entregada, manteniendo dicha entrega sin modificación y aplicando la cancelación únicamente a otras citas no validadas si las hubiera.

- AC-011. Independencia de cita y cupo al cancelar una fórmula en cita compartida
  Dado que una misma cita contiene medicamentos reservados pertenecientes a dos fórmulas independientes del paciente,
  cuando el usuario confirma la cancelación de una de las fórmulas mediante el código OTP,
  entonces el sistema retira la fórmula seleccionada, libera únicamente sus medicamentos y mantiene la cita vigente con el mismo código de entrega y el mismo cupo en el punto para la otra fórmula.

- AC-012. Selección explícita de fórmula a cancelar en cita con múltiples fórmulas
  Dado que un paciente consulta en la web o Telegram una cita que agrupa medicamentos de más de una fórmula,
  cuando el usuario selecciona la opción de cancelar en el flujo autenticado,
  entonces el sistema despliega el listado de fórmulas asociadas a la cita y exige que el usuario seleccione cuál fórmula desea cancelar antes de generar y enviar el código OTP de confirmación.

### 12. Dependencias
- Módulo de Identidad y Vinculación de canales (contexto 3.2, 3.3).
- Módulo de Prevalidación y Documentos (contexto 3.4).
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
- Cancelación individual parcial de los medicamentos de una misma fórmula (contexto 3.4, 3.5).
- Modificación o cancelación de citas ya validadas por el dispensador en ventanilla (DEC-002, contexto 3.7).
- Gestión de entregas parciales o reclamos de faltantes por parte del sistema (contexto 3.7, 3.10).

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-001).
- OPEN-Q-002: Respondida (DEC-002).
- OPEN-Q-003: Respondida (DEC-003).
- OPEN-Q-004: Respondida (DEC-004).

### 16. Trazabilidad
- HU-001: RF-001 a RF-012; RNF-001, RNF-002; BR-001 a BR-008; AC-001 a AC-012; CL-001 a CL-005.

Detalle de verificación de requisitos funcionales por criterio de aceptación:
- RF-001: verificado por AC-001, AC-008, AC-012.
- RF-002: verificado por AC-001, AC-009, AC-012.
- RF-003: verificado por AC-001, AC-002, AC-010.
- RF-004: verificado por AC-001, AC-003, AC-009.
- RF-005: verificado por AC-001, AC-004, AC-011.
- RF-006: verificado por AC-001, AC-004, AC-007.
- RF-007: verificado por AC-011.
- RF-008: verificado por AC-007.
- RF-009: verificado por AC-001, AC-006.
- RF-010: verificado por AC-001, AC-005, AC-007.
- RF-011: verificado por AC-005, AC-007.
- RF-012: verificado por AC-002, AC-010.

Detalle de verificación de reglas de negocio por criterio de aceptación:
- BR-001: verificado por AC-006.
- BR-002: verificado por AC-008.
- BR-003: verificado por AC-005, AC-007.
- BR-004: verificado por AC-001, AC-004.
- BR-005: verificado por AC-001, AC-002, AC-010.
- BR-006: verificado por AC-001, AC-003, AC-009.
- BR-007: verificado por AC-001, AC-006.
- BR-008: verificado por AC-011.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad planteada por el usuario.
- Versión 1.0: incorporación de decisiones DEC-001 a DEC-004, corrección de oportunidad de cancelación hasta validación en punto o fin de ventana, incorporación de código OTP con reglas de identidad (10 min, 3 intentos), flujo alternativo desde recordatorio de 1 hora, adición de AC-007 a AC-009 y reescritura de RNF-001. No aprobada por el equipo.
- Versión 1.1: incorporación de DEC-005 sobre independencia de fórmulas en citas compartidas; precisión en AC-001 de fórmula sin entregas previas; actualización del flujo A2 para exigir verificación de identidad previa si la cancelación inicia desde SMS o correo en canal no vinculado (AC-009); adición de AC-010 para verificación de concurrencia en CL-003; actualización completa de trazabilidad. Se registra que el requisito funcional RF-013 de esta versión se integró posteriormente en RF-007.
- Versión 1.2: corrección de la inconsistencia en el dominio de código de entrega y cupo (pertenecen a la cita, no a la fórmula) reescribiendo RF-005, RF-006, RF-007 y los pasos 6, 10 y 11 del flujo principal conforme a las observaciones del equipo; adición de la selección explícita de fórmula a cancelar en citas compartidas (paso 5 del flujo principal, RF-002 y AC-012); precisión en el paso 12 sobre el retorno a estado inicial solo en fórmulas sin entregas previas (remitiendo a A3 si hubo entregas); actualización de DEC-005, RNF-001, BR-004, BR-008, CL-004, CL-005 y matriz de trazabilidad.
- Versión 1.3: reescritura de RF-012 y BR-005 para evaluar la condición de cancelación por cita (afectando únicamente a las citas no validadas ni expiradas y manteniendo como entregadas las citas ya validadas); ajuste de RF-003, E2 y AC-002; actualización del paso 5 del flujo principal para incluir la selección de la opción de cancelar cuando la cita tiene una sola fórmula; e integración explícita de RF-013 de la versión 1.1 en RF-007. Aprobada y congelada por el equipo.

## Verificación
- Completitud: cumple. La especificación cuenta con todos los elementos requeridos, sin vacíos ni preguntas abiertas pendientes.
- Consistencia: cumple. Mantiene coherencia con las reglas del contexto del producto y decisiones DEC-001 a DEC-005.
- No ambigüedad: cumple. Los criterios y flujos definen sin equívocos la conducta del sistema en todos los escenarios.
- Verificabilidad: cumple. Todos los requisitos y reglas poseen criterios de aceptación estructurados en formato Dado/Cuando/Entonces.
- Trazabilidad: cumple. Matriz de trazabilidad bidireccional completa.
- No invención: cumple. Se respetan estrictamente las decisiones del equipo y el contexto de Pharma Express.
- Delimitación: cumple. Lo que está fuera de alcance queda explícitamente acotado.
- Utilidad: cumple. La especificación sirve como insumo directo, congelado y definitivo para el Architecture Agent.

## Siguiente paso
La SPEC-001 versión 1.3 ha sido APROBADA Y CONGELADA por el equipo. Queda disponible de forma definitiva para el Architecture Agent para proceder con el diseño de arquitectura y componentes.
