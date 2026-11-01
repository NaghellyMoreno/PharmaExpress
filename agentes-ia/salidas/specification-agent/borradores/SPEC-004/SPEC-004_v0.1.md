<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:55
Petición: Disponibilidad, reserva y agenda. Para las fórmulas aptas, el sistema consulta el inventario simulado y muestra los puntos con existencias de cada medicamento. Ofrece solo ventanas de 1 hora con cupo: para una cita solo aguda, ventanas del mismo día que inicien al menos una hora después del momento de agendar, y del día siguiente; para una cita con algún medicamento crónico, solo el día calendario siguiente. Si los medicamentos están en puntos distintos, se informa y se permite escoger una cita en cada punto; cada cita agrupa los medicamentos de la solicitud que se recogen en ese punto. Al confirmar, se reservan existencias y cupo de forma atómica y todas las citas de una misma fórmula se confirman juntas o ninguna; si otra persona confirmó antes, se informa y se muestran opciones actualizadas. Cada cita emite un código de entrega de un solo uso en QR y numérico. El usuario puede cancelar en cualquier momento; la cancelación y la expiración al terminar la ventana anulan el código y liberan existencias y cupo. Si ya se entregó parte de una fórmula, lo no recogido se pierde y la fórmula se cierra; si no se entregó nada, se libera y se puede iniciar una nueva solicitud. Sin disponibilidad o sin ventanas con cupo, se informa una espera de 48 horas y se programa un único recordatorio de revalidación. EPIC-004.
-->

# SPEC-004. Disponibilidad, reserva y agenda - Versión 0.1

Estado: Borrador
Modo: Inicial
Need original: "SPEC-004, empieza en HU-006, RF-030, RNF-011, BR-011, CL-009, AC-014. Disponibilidad, reserva y agenda. Para las fórmulas aptas, el sistema consulta el inventario simulado y muestra los puntos con existencias de cada medicamento. Ofrece solo ventanas de 1 hora con cupo: para una cita solo aguda, ventanas del mismo día que inicien al menos una hora después del momento de agendar, y del día siguiente; para una cita con algún medicamento crónico, solo el día calendario siguiente. Si los medicamentos están en puntos distintos, se informa y se permite escoger una cita en cada punto; cada cita agrupa los medicamentos de la solicitud que se recogen en ese punto. Al confirmar, se reservan existencias y cupo de forma atómica y todas las citas de una misma fórmula se confirman juntas o ninguna; si otra persona confirmó antes, se informa y se muestran opciones actualizadas. Cada cita emite un código de entrega de un solo uso en QR y numérico. El usuario puede cancelar en cualquier momento; la cancelación y la expiración al terminar la ventana anulan el código y liberan existencias y cupo. Si ya se entregó parte de una fórmula, lo no recogido se pierde y la fórmula se cierra; si no se entregó nada, se libera y se puede iniciar una nueva solicitud. Sin disponibilidad o sin ventanas con cupo, se informa una espera de 48 horas y se programa un único recordatorio de revalidación."
Épica: EPIC-004

## Análisis
- Objetivo: consultar disponibilidad de inventario para fórmulas aptas, ofrecer ventanas de tiempo con cupo según el tipo de tratamiento, y gestionar la reserva atómica, la asignación de citas, la emisión de códigos de entrega, la cancelación, la expiración y el manejo de falta de disponibilidad.
- Alcance inicial: consulta de inventario por punto, cálculo y presentación de ventanas de agenda para tratamientos agudos y crónicos, separación de puntos si los medicamentos están dispersos, reserva atómica de existencias y cupo, emisión de código de entrega (QR y numérico), cancelación en cualquier momento, expiración al finalizar la ventana, liberación o cierre parcial de fórmulas, y manejo de la espera de 48 horas con su recordatorio de revalidación.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario, dispensador, inventario simulado.
- Contexto aplicable: 2.1, 2.3, 2.4, 3.5, 3.8, 3.9, 3.10, 3.11.

## Modelo de dominio
- Solicitud: conjunto de fórmulas y medicamentos de un mismo paciente gestionados en una misma gestión. Pertenece al paciente; una solicitud puede tener varias fórmulas. Origen: contexto 2.4.
- Fórmula: prescripción con uno o más medicamentos. Pertenece a la solicitud; una fórmula tiene uno o más medicamentos. Origen: contexto 2.4.
- Medicamento: fármaco prescrito en una fórmula. Pertenece a la fórmula; un medicamento tiene existencias en los puntos del inventario simulado. Origen: contexto 2.4.
- Cita: ventana escogida en un punto para recoger los medicamentos reservados en ese punto. Pertenece a la solicitud y a un punto; una solicitud puede tener varias citas si los medicamentos están en puntos distintos. Origen: contexto 2.4 y 3.5.
- Ventana: bloque de 1 hora en un punto, con capacidad limitada. Pertenece a un punto; equivalente a franja. Origen: contexto 2.4 y 3.5.
- Reserva: existencias y cupo apartados para una cita. Pertenece a una cita y a un punto. Origen: contexto 2.4 y 3.5.
- Código de entrega: código de un solo uso, en QR y numérico, ligado a una cita. Pertenece a una cita. Origen: contexto 2.4 y 3.5.
- Inventario simulado: fuente de existencias por medicamento y por punto. Origen: contexto 2.3 y 3.8.
- Punto de dispensación: punto de dispensación del gestor farmacéutico Disfarma en Manizales, Caldas. Origen: contexto 2.1 y 3.8.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
No aplica.

## Preguntas de aclaración
- OPEN-Q-001. Cuando se informa la espera de 48 horas por falta de disponibilidad o sin ventanas con cupo, ¿exactamente por qué medio se notifica o se muestra esta información y cómo se programa el único recordatorio de revalidación a las 48 horas?
  Por qué importa: define el canal y el mecanismo exacto para el aviso de espera y el recordatorio posterior, asegurando que se cumpla la regla de notificaciones multicanal si aplica.
  Crítica: sí
  Propuesta del agente: se muestra en la interfaz web o Telegram donde se realiza la gestión y se envía por los canales activos del paciente (correo y SMS si existen, web y Telegram), programando el único recordatorio exactamente a las 48 horas por los mismos canales.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-002. Si una solicitud contiene varias fórmulas (por ejemplo, una aguda y una crónica), y las fórmulas se reservan y confirman juntas o ninguna, ¿cómo se maneja la regla de agendamiento si una fórmula exige el día siguiente (crónico) y la otra permite el mismo día (agudo)? El contexto 3.5 dice que si una cita incluye algún medicamento crónico, aplica la regla del crónico, pero ¿qué pasa si se procesan en la misma solicitud y van a puntos distintos o al mismo punto?
  Por qué importa: aclara la restricción de agendamiento para solicitudes mixtas y la atomicidad de las citas.
  Crítica: sí
  Propuesta del agente: si la solicitud o cita incluye algún medicamento crónico, aplica la regla del crónico para todas las citas de esa solicitud (solo el día calendario siguiente), manteniendo la coherencia de la regla del contexto 3.5.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-003. Cuando ocurre una cancelación por parte del usuario o una expiración al terminar la ventana, ¿qué mensaje o confirmación recibe el usuario y por qué medios se le comunica?
  Por qué importa: define la experiencia de usuario y las notificaciones asociadas a la liberación de existencias y cupo.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Permitir a los usuarios consultar el inventario simulado para fórmulas aptas, seleccionar ventanas de agendamiento según las reglas de tratamientos agudos o crónicos, asegurar reservas atómicas sin sobre-reservas, emitir códigos de entrega únicos en QR y numérico, y gestionar cancelaciones, expiraciones y el escenario de falta de disponibilidad con su espera de 48 horas.

### 2. Contexto
El sistema opera en los puntos de dispensación de Disfarma en Manizales. Para las fórmulas aptas, se verifica la disponibilidad en el inventario simulado y se muestran los puntos con existencias. Se asignan citas en ventanas de 1 hora respetando las reglas de tiempo para agudos y crónicos. Nunca existe una cita sin medicamentos reservados ni se supera la capacidad de una ventana, buscando cero sobre-reservas.
Decisiones del equipo:
- Ninguna por el momento.

### 3. Alcance
- Consulta de inventario simulado para fórmulas aptas.
- Presentación de puntos de dispensación con existencias para cada medicamento.
- Ofrecimiento exclusivo de ventanas de 1 hora con cupo disponible.
- Reglas de agendamiento diferenciadas: cita solo aguda (mismo día si inicia al menos una hora después de agendar, o día siguiente) y cita con algún medicamento crónico (solo el día calendario siguiente).
- Asignación de citas por punto si los medicamentos están en puntos distintos, agrupando los medicamentos correspondientes a cada punto.
- Reserva atómica de existencias y cupo; confirmación de todas las citas de una misma fórmula juntas o ninguna, informando y mostrando opciones actualizadas si otra persona confirmó antes.
- Emisión de código de entrega de un solo uso en formato QR y numérico para cada cita, consultable en la web o Telegram.
- Cancelación en cualquier momento por el usuario, y expiración automática al terminar la ventana, lo cual anula el código y libera existencias y cupo.
- Manejo de entregas parciales: si ya se entregó parte de una fórmula, lo no recogido se pierde y la fórmula se cierra; si no se entregó nada, todo se libera y se puede iniciar una nueva solicitud.
- Manejo de falta de disponibilidad o sin ventanas con cupo: se informa una espera de 48 horas y se programa un único recordatorio de revalidación.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario, dispensador, inventario simulado.
- HU-006. Como paciente o cuidador, quiero consultar la disponibilidad de inventario y agendar una cita con reserva de mis medicamentos aptos para no desplazarme en vano, para recibir mis medicamentos sin esperas innecesarias.

### 5. Requisitos funcionales
- RF-030. El sistema debe consultar el inventario simulado para las fórmulas aptas y mostrar los puntos de dispensación que cuentan con existencias de cada medicamento. Origen: contexto 3.5 y necesidad.
- RF-031. El sistema debe ofrecer únicamente ventanas de 1 hora con cupo disponible en los puntos que tengan existencias. Origen: contexto 3.5 y necesidad.
- RF-032. Para una cita solo aguda, el sistema debe ofrecer ventanas del mismo día que inicien al menos una hora después del momento de agendar, y ventanas del día siguiente. Origen: contexto 3.5 y necesidad.
- RF-033. Para una cita con algún medicamento crónico, el sistema debe ofrecer únicamente ventanas del día calendario siguiente. Origen: contexto 3.5 y necesidad.
- RF-034. Si los medicamentos de una solicitud están en puntos distintos, el sistema debe informar esta situación al usuario y permitirle escoger una cita en cada punto, agrupando en cada cita los medicamentos de la solicitud que se recogen en ese punto. Origen: contexto 3.5 y necesidad.
- RF-035. Al confirmar la agenda, el sistema debe realizar la reserva de existencias y cupo de forma atómica, garantizando que todas las citas de una misma fórmula se confirmen juntas o ninguna. Origen: contexto 3.5 y necesidad.
- RF-036. Si al intentar confirmar otra persona reservó antes y no hay disponibilidad o cupo, el sistema debe informar la situación y mostrar las opciones de agendamiento actualizadas. Origen: contexto 3.5 y necesidad.
- RF-037. El sistema debe emitir para cada cita confirmada un código de entrega de un solo uso, disponible en formato QR y numérico, consultable en la web o en Telegram en el momento en que el usuario lo necesite. Origen: contexto 3.5 y necesidad.
- RF-038. El sistema debe permitir al usuario cancelar la cita en cualquier momento. Origen: contexto 3.5 y necesidad.
- RF-039. El sistema debe anular el código de entrega y liberar las existencias y el cupo tanto en caso de cancelación por el usuario como por expiración al terminar la ventana de la cita. Origen: contexto 3.5 y necesidad.
- RF-040. Si ya se entregó parte de una fórmula y el resto no se recoge (por cancelación o por no llegar), el sistema debe cerrar la fórmula y dar por perdido lo no recogido. Origen: contexto 3.5 y necesidad.
- RF-041. Si no se entregó nada de la fórmula y la cita se cancela o expira, el sistema debe liberar por completo la reserva para que se pueda iniciar una nueva solicitud. Origen: contexto 3.5 y necesidad.
- RF-042. Si un medicamento no tiene existencias en ningún punto, o no hay ventanas con cupo en los días permitidos, el sistema debe informar que debe esperar 48 horas para volver a validar y programar un único recordatorio a las 48 horas. Origen: contexto 3.5 y necesidad.

### 6. Requisitos no funcionales
- RNF-011. Concurrencia y atomicidad. La reserva de existencias y cupo debe ejecutarse de forma atómica para evitar sobre-reservas bajo alta concurrencia. Se verifica con: pruebas de concurrencia simulando reservas simultáneas sobre el mismo cupo y punto. Origen: contexto 3.5 y necesidad.

### 7. Reglas de negocio
- BR-011. Nunca existe una cita sin medicamentos reservados ni se supera la capacidad de una ventana, buscando cero sobre-reservas. Origen: contexto 3.5 y necesidad.
- BR-012. Si una cita incluye algún medicamento crónico, aplica la regla de agendamiento del crónico (solo el día calendario siguiente). Origen: contexto 3.5.
- BR-013. El código de entrega es de un solo uso y está ligado estrictamente a la cita confirmada. Origen: contexto 3.5.
- BR-014. El sistema no realiza vigilancia automática del inventario; la espera de 48 horas es un plazo propio para que el usuario vuelva a validar manualmente. Origen: contexto 3.5 y 3.10.

### 8. Flujo principal
1. El usuario visualiza los resultados de la prevalidación con fórmulas aptas.
2. El sistema consulta el inventario simulado y presenta los puntos de dispensación que tienen existencias para cada medicamento de las fórmulas aptas.
3. El sistema calcula y muestra las ventanas de 1 hora con cupo disponible, aplicando las reglas de tiempo según el tipo de tratamiento (agudo o crónico).
4. Si los medicamentos se encuentran en puntos distintos, el sistema informa al usuario y le permite seleccionar una cita en cada punto, agrupando los medicamentos respectivos.
5. El usuario selecciona las ventanas de cita en el punto o puntos correspondientes y confirma la operación.
6. El sistema procesa la confirmación de manera atómica, reservando existencias y cupo para todas las citas de la fórmula de forma conjunta.
7. El sistema genera el código de entrega de un solo uso en formatos QR y numérico para cada cita confirmada, accesible en la web o Telegram.

### 9. Flujos alternativos y de excepción
- A1. Cancelación de cita por el usuario:
  1. El usuario selecciona la opción de cancelar la cita en la web o Telegram.
  2. El sistema anula el código de entrega correspondiente.
  3. El sistema libera las existencias y el cupo reservados.
  4. Si no se había entregado nada de la fórmula, la reserva se libera por completo permitiendo iniciar una nueva solicitud.
- E1. Conflicto de concurrencia al confirmar:
  1. Al intentar confirmar la cita, el sistema detecta que otra persona reservó el último cupo o existencias.
  2. El sistema informa que la ventana o existencias ya no están disponibles.
  3. El sistema muestra las opciones de agendamiento actualizadas para que el usuario seleccione de nuevo.
- E2. Falta de disponibilidad o sin cupos:
  1. Al consultar el inventario o las ventanas, se determina que no hay existencias en ningún punto o no hay ventanas con cupo en los días permitidos.
  2. El sistema informa la situación, indica que debe esperar 48 horas para volver a validar y programa un único recordatorio de revalidación a las 48 horas.
- E3. Expiración de la cita:
  1. El tiempo de la ventana de la cita finaliza sin que el usuario se presente a validar en el punto.
  2. El sistema marca la cita como expirada, anula el código de entrega y libera existencias y cupo.
  3. Si ya se había entregado parte de la fórmula, lo no recogido se pierde y la fórmula se cierra. Si no se entregó nada, la reserva se libera por completo.

### 10. Casos límite
- CL-009. Solicitud con medicamentos en múltiples puntos: el sistema muestra claramente la división de puntos y exige agendar una cita por cada punto involucrado, garantizando la atomicidad por fórmula. Origen: contexto 3.5 y necesidad.
- CL-010. Agendamiento de tratamiento mixto (agudo y crónico): si la solicitud contiene medicamentos agudos y al menos uno crónico, el sistema aplica la regla restrictiva del tratamiento crónico (solo el día calendario siguiente) para todas las citas. Origen: contexto 3.5.
- CL-011. Expiración exacta al finalizar la ventana: si la ventana termina y el usuario no ha validado, las existencias y cupos se liberan de inmediato y el código deja de ser válido. Origen: contexto 3.5.

### 11. Criterios de aceptación
- AC-014. Dado un conjunto de fórmulas aptas con existencias en inventario simulado, cuando el usuario solicita agendar una cita de tratamiento agudo, entonces el sistema ofrece ventanas del mismo día (con al menos una hora posterior a la hora actual) y del día siguiente. Origen: necesidad y contexto 3.5.
- AC-015. Dado un conjunto de fórmulas aptas con medicamentos crónicos, cuando el usuario solicita agendar una cita, entonces el sistema ofrece únicamente ventanas del día calendario siguiente. Origen: necesidad y contexto 3.5.
- AC-016. Dada una solicitud cuyos medicamentos se encuentran en puntos distintos, cuando el sistema presenta la agenda, entonces informa la dispersión y permite escoger una cita independiente en cada punto, agrupando los medicamentos correspondientes. Origen: necesidad y contexto 3.5.
- AC-017. Al confirmar una cita, si otra persona reserva el cupo de forma concurrente, entonces el sistema rechaza la confirmación, informa el cambio y muestra opciones de agendamiento actualizadas. Origen: necesidad y contexto 3.5.
- AC-018. Cuando se confirma una cita exitosamente, entonces el sistema emite un código de entrega de un solo uso en formato QR y numérico, consultable en la web o Telegram. Origen: necesidad y contexto 3.5.
- AC-019. Si una cita expira al terminar la ventana o el usuario la cancela, entonces el sistema anula el código de entrega y libera las existencias y el cupo correspondientes. Origen: necesidad y contexto 3.5.
- AC-020. Si no hay existencias en ningún punto o no hay ventanas con cupo en los días permitidos, entonces el sistema informa la espera de 48 horas y programa un único recordatorio de revalidación. Origen: necesidad y contexto 3.5.

### 12. Dependencias
- Verificación de identidad y prevalidación de fórmulas (SPEC previa de prevalidación).
- Inventario simulado y configuración de puntos de dispensación.
- Canales web y Telegram para visualización y emisión de códigos.

### 13. Restricciones
- Equipo de cuatro personas y aproximadamente 8 semanas. Origen: contexto 3.9.
- El equipo no tiene acceso a los sistemas de Disfarma y trabaja desde afuera. Origen: contexto 3.9.
- Ninguna notificación, por ningún medio, incluye nombres de medicamentos ni diagnósticos. Origen: contexto 3.6.
- El Decreto Ley 019 de 2012, artículo 131, y la Resolución 1604 de 2013 establecen que si la entrega queda incompleta al reclamar, la EPS debe entregar lo faltante en máximo 48 horas (obligación de la EPS, no de Pharma Express). Origen: contexto 3.11.

### 14. Fuera de alcance
- Cita de continuidad. Origen: contexto 3.10.
- Pendientes y entrega parcial gestionada por el sistema. Origen: contexto 3.10.
- Reprogramación de citas. Origen: contexto 3.10.
- Vigilancia automática del inventario. Origen: contexto 3.10.
- Domicilio. Origen: contexto 3.10.
- Facturación, prescripción o modificación de fórmulas. Origen: contexto 3.10.
- Integración real con inventarios de Disfarma. Origen: contexto 3.8 y 3.10.
- Mecanismo exacto de concurrencia en base de datos: tema para arquitectura. Origen: RF-035.

### 15. Preguntas abiertas
- OPEN-Q-001: Pendiente
- OPEN-Q-002: Pendiente
- OPEN-Q-003: Pendiente

### 16. Trazabilidad
- HU-006: RF-030, RF-031, RF-032, RF-033, RF-034, RF-035, RF-036, RF-037, RF-038, RF-039, RF-040, RF-041, RF-042; RNF-011; BR-011, BR-012, BR-013, BR-014; CL-009, CL-010, CL-011; AC-014, AC-015, AC-016, AC-017, AC-018, AC-019, AC-020.
- RF-030 a RF-042: verificados por AC-014 a AC-020.
- RNF-011: verificado por AC-017.
- BR-011 a BR-014: verificados por AC-014 a AC-020.
- CL-009 a CL-011: verificados por AC-016 y AC-019.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad y del contexto 3.5.

## Verificación
- Completitud: cumple. Se cubrieron la consulta de inventario, reglas de ventanas para agudos y crónicos, separación por puntos, atomicidad, emisión de códigos QR y numérico, cancelación, expiración, manejo de entregas parciales y espera de 48 horas.
- Consistencia interna: cumple. Los requisitos funcionales, reglas de negocio, flujos y criterios de aceptación coinciden en el tratamiento de agudos, crónicos y la atomicidad de las reservas.
- Consistencia con el contexto: cumple. Se alinean estrictamente con las reglas de la sección 3.5 y 3.8 del contexto del producto.
- No ambigüedad: cumple. Los plazos y condiciones de agendamiento se especifican claramente según las reglas del contexto.
- Verificabilidad: cumple. Todos los criterios de aceptación describen un resultado observable ante una acción específica.
- Trazabilidad: cumple. Cada requisito y regla de negocio está enlazado con su respectivo criterio de aceptación y con la historia de usuario HU-006.
- No invención: cumple. No se inventaron cifras, plazos ni canales adicionales fuera del contexto y la necesidad.
- Delimitación: cumple. Se mantuvieron fuera de alcance la reprogramación, la vigilancia automática de inventario y la gestión de pendientes por el sistema, conforme al contexto 3.10.

## Siguiente paso
Respondan las preguntas abiertas y ejecuten de nuevo el agente con --continuar SPEC-004.
