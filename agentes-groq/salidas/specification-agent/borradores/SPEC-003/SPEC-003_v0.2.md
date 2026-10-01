<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.6-flash
Fecha: 2026-09-30 23:04
Petición: Respuestas y correcciones del equipo. OPEN-Q-003: si falla el envío por un canal real, el sistema registra el fallo y continúa con los demás canales, sin reintentos automáticos. OPEN-Q-004: el sistema omite el canal no registrado sin error y deja constancia en el registro de eventos. Correcciones: 1) Elimina RNF-004: la cifra de 5 segundos no la decidió el equipo y el contexto 3.10 excluye las metas de desempeño. 2) Quita el lenguaje técnico (asíncrono, en paralelo, revisión de código de plantillas, CIE-10) y describe solo comportamiento observable. 3) Las notificaciones no incluyen el código de entrega; el usuario lo consulta en la web o en Telegram (contexto 3.5). Ajusta AC-004. 4) Formula una pregunta sobre cómo identifica cada notificación al paciente cuando un facilitador tiene varios vinculados, sin incluir datos de salud.
-->

# SPEC-003. Envío multicanal de notificaciones con protección de datos clínicos - Versión 0.2

Estado: Borrador
Modo: Iteración
Necesidad original: "El sistema debe enviar mensajes por todos los canales vinculados (SMS, correo, Telegram y web), pero tiene la restricción estricta de no incluir nunca nombres de medicamentos ni diagnósticos clínicos en dichos mensajes."

## Análisis
- Objetivo: garantizar la entrega multicanal de notificaciones del sistema a los usuarios a través de sus medios de contacto registrados y vinculados, protegiendo estrictamente la privacidad del paciente al excluir nombres de medicamentos y diagnósticos médicos de todo texto enviado.
- Alcance inicial: envío de notificaciones por SMS, correo electrónico, Telegram y notificación web, aplicando la restricción de privacidad clínica.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- Contexto aplicable: secciones 2.3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.8, 3.11.

## Modelo de dominio
- Notificación: pertenece a un paciente y está asociada a un evento del sistema (confirmación de cita, recordatorio, cancelación, aviso de nueva fecha habilitada); cardinalidad: 1 evento genera 1 notificación que se distribuye a múltiples canales. Origen: contexto 3.6.
- Canal de notificación: pertenece al paciente o a la vinculación activa; puede ser SMS, correo electrónico, chat de Telegram vinculado o navegador web vinculado. Cardinalidad: 1 a N canales por notificación. Origen: contexto 3.3 y 3.6.
- Paciente: fuente de datos de contacto (celular y correo registrados en la EPS simulada) y de vinculaciones de canales (Telegram y web); cardinalidad: 1 paciente. Origen: contexto 3.2 y 3.3.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- DEC-003: afecta a BR-005, el flujo de excepción E2 y el criterio AC-007. Se define que las fallas en canales reales se registran sin realizar reintentos automáticos ni bloquear la entrega en otros canales.
- DEC-004: afecta a RF-006, el flujo alternativo A1 y el criterio AC-006. Se precisa que la ausencia de correo en la EPS simulada se omite silenciosamente para el usuario y se deja constancia en el registro de eventos del sistema.
- Corrección 1: elimina RNF-004 de la especificación por tratarse de una cifra no acordada y estar las metas de desempeño fuera de alcance (contexto 3.10).
- Corrección 2: reescribe RNF-003 y el paso 5 del flujo principal para eliminar lenguaje técnico (términos como asíncrono, en paralelo, revisión de código de plantillas o CIE-10) y describir únicamente comportamiento observable.
- Corrección 3: ajusta AC-004 para eliminar la mención del código de entrega dentro del mensaje de notificación, dado que este solo se consulta en la web o Telegram cuando el usuario lo necesita (contexto 3.5).
- Corrección 4: genera la pregunta OPEN-Q-005 para definir la forma de identificar al paciente en notificaciones dirigidas a canales vinculados a múltiples personas, sin vulnerar los datos sensibles.

## Preguntas de aclaración
- OPEN-Q-005. Cuando un chat de Telegram o un navegador web está vinculado a varios pacientes (por ejemplo, en el caso de un cuidador o facilitador comunitario), ¿qué datos del paciente debe incluir la notificación para que el destinatario identifique a quién corresponde el aviso, sin exponer datos sensibles de salud?
  Por qué importa: define el contenido de la notificación en canales compartidos garantizando la claridad para el usuario y el cumplimiento de la privacidad de datos.
  Crítica: sí
  Propuesta del agente: incluir únicamente las iniciales del nombre y los últimos tres dígitos del documento de identidad del paciente.
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Garantizar el envío multicanal de notificaciones del sistema a través de los medios vinculados e informados del paciente (SMS, correo electrónico, Telegram y aplicación web), absteniéndose de incluir nombres de medicamentos o diagnósticos clínicos en cualquier mensaje.

### 2. Contexto
En Pharma Express, las notificaciones mantienen informado al usuario sobre el estado de sus citas, cancelaciones, cambios en sus prevalidaciones y avisos de disponibilidad periódica. Debido a la normativa sobre protección de datos personales y sensibles (Ley 1581 de 2012 y Decreto 1377 de 2013), la información de salud debe protegerse. Por esta razón, todos los mensajes salientes omiten cualquier mención a nombres de medicamentos o diagnósticos.

Decisiones del equipo:
- DEC-003. Si el envío por uno de los canales reales (SMS, correo o Telegram) presenta un fallo técnico, el sistema registra el fallo en el registro de eventos y continúa el envío por los demás canales disponibles, sin realizar reintentos automáticos. Responde a OPEN-Q-003.
- DEC-004. Cuando un canal alternativo (como el correo electrónico) no está registrado en la EPS simulada, el sistema omite el envío por ese canal sin mostrar un mensaje de error al usuario y deja constancia del evento en el registro del sistema. Responde a OPEN-Q-004.

### 3. Alcance
- Despacho de notificaciones por los canales activos del paciente: SMS (al celular registrado en la EPS simulada), correo electrónico (al correo registrado en la EPS simulada, si existe), Telegram (a los chats vinculados activos) y web (a los navegadores vinculados activos).
- Garantía de exclusión de medicamentos y diagnósticos en el texto enviado.
- Exclusión de canales cuya vinculación haya superado los 3 meses.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-001. Como paciente o persona que actúa en su nombre, quiero recibir avisos y recordatorios del sistema por todos mis canales de contacto disponibles, para estar informado a tiempo sobre mis citas y gestiones sin que se exponga información confidencial sobre mi salud en las notificaciones.

### 5. Requisitos funcionales
- RF-003. El sistema debe enviar cada notificación requerida a través de todos los medios configurados y habilitados para el paciente: mensaje SMS al número celular registrado en la EPS simulada, correo electrónico a la dirección registrada en la EPS simulada (si está registrada), mensaje de Telegram a todos los chats con vinculación activa para dicho paciente, y notificación web a todos los navegadores con vinculación activa para dicho paciente. Origen: contexto 3.6.
- RF-004. El sistema debe garantizar que ninguna notificación enviada por ningún canal incluya nombres de medicamentos ni diagnósticos clínicos. Origen: necesidad y contexto 3.6.
- RF-005. Si una vinculación de Telegram o de navegador web se encuentra vencida por superar los 3 meses desde su verificación, el sistema no debe enviar notificaciones a través de dicho chat o navegador, manteniendo el envío por SMS y correo electrónico. Origen: contexto 3.3.
- RF-006. El sistema debe omitir el envío por correo electrónico si el paciente no tiene una dirección de correo registrada en la EPS simulada, continuando el envío por los demás canales disponibles y dejando constancia en el registro de eventos del sistema. Origen: DEC-004 y contexto 3.6.
- RF-007. El sistema debe registrar cada fallo de envío en un canal real y continuar la entrega por los demás canales activos del paciente, sin programar reintentos automáticos para el canal fallido. Origen: DEC-003.

### 6. Requisitos no funcionales
- RNF-003. Seguridad y Privacidad. Ningún mensaje o notificación generado por el sistema debe contener nombres de medicamentos, marcas, principios activos ni diagnósticos clínicos. Se verifica mediante inspección del texto recibido en las pruebas de envío por cada canal. Origen: contexto 3.6 y 3.11.

### 7. Reglas de negocio
- BR-003. Regla de oro de privacidad en comunicaciones: ningún mensaje saliente (SMS, correo, Telegram, notificación web) transmitirá nombres de medicamentos ni diagnósticos médicos. Origen: contexto 3.6.
- BR-004. Canales directos e indirectos: los SMS y correos electrónicos se dirigen a los datos de contacto registrados en la EPS simulada. Las notificaciones de Telegram y web se dirigen únicamente a canales con vinculación activa no vencida. Origen: contexto 3.3 y 3.6.
- BR-005. Manejo de fallas de entrega: la interrupción o falla de envío en un canal no detiene la entrega en los demás canales activos ni genera reintentos automáticos posteriores. Origen: DEC-003.

### 8. Flujo principal
1. El sistema genera un evento que requiere notificación para un paciente (por ejemplo, confirmación de cita o recordatorio).
2. El sistema consulta los datos de contacto del paciente en la EPS simulada (celular y correo electrónico) y las vinculaciones activas asociadas al paciente (chats de Telegram y navegadores web).
3. El sistema valida que la vinculación de cada chat y navegador tenga una antigüedad menor o igual a 3 meses.
4. El sistema prepara el mensaje correspondiente al evento, verificando que no contenga datos de medicamentos ni diagnósticos.
5. El sistema envía la notificación a cada uno de los canales correspondientes: SMS, correo electrónico (si existe), chats de Telegram vinculados activos y navegadores web vinculados activos.
6. El sistema registra el resultado de la entrega de cada canal para auditoría interna.

### 9. Flujos alternativos y de excepción
- A1. Paciente sin correo electrónico en la EPS simulada:
  1. En el paso 2 del flujo principal, se detecta la ausencia de dirección de correo.
  2. El sistema omite el canal de correo, registra la omisión en el historial del sistema y continúa el envío por los demás canales (SMS, Telegram y web vinculados).
- E1. Vinculación de Telegram o web vencida:
  1. En el paso 3 del flujo principal, se detecta que una vinculación superó los 3 meses.
  2. El sistema excluye ese chat o navegador de la lista de destinos de la notificación.
  3. El sistema continúa el envío por los demás canales disponibles.
- E2. Falla técnica en un canal de servicio externo (SMS, correo o Telegram):
  1. Durante el paso 5, un servicio externo reporta una falla o no completa la entrega.
  2. El sistema registra el fallo del canal afectado en el historial del sistema.
  3. El sistema continúa la entrega en los demás canales sin realizar reintentos automáticos.

### 10. Casos límite
- CL-003. Paciente sin ningún chat de Telegram ni navegador web vinculado y sin correo en la EPS simulada: el sistema envía la notificación únicamente mediante SMS al celular registrado en la EPS. Origen: contexto 3.6.
- CL-004. Paciente con múltiples chats de Telegram vinculados: el sistema envía la notificación a cada uno de los chats de Telegram que mantengan la vinculación activa con dicho paciente. Origen: contexto 3.3 y 3.6.

### 11. Criterios de aceptación
- AC-003. Dado un paciente con un celular registrado en la EPS, un correo registrado en la EPS, un chat de Telegram vinculado activo y un navegador web vinculado activo, cuando el sistema genera una notificación, entonces se despacha un mensaje por SMS, un mensaje por correo, un mensaje por Telegram y una notificación web, y ninguno de ellos contiene nombres de medicamentos ni diagnósticos.
- AC-004. Dado un mensaje de notificación de cita reservada, cuando el usuario examina el texto recibido en SMS, correo, Telegram o web, entonces el texto contiene únicamente los datos de la cita (como fecha, hora y punto de dispensación) o las opciones de cancelación, pero no incluye el código de entrega, nombres de medicamentos ni diagnósticos médicos.
- AC-005. Dado un paciente cuya vinculación de Telegram venció hace más de 3 meses, cuando se genera una notificación para dicho paciente, entonces no se envía el mensaje al chat de Telegram vencido, pero sí se envía por SMS y al correo registrado.
- AC-006. Dado un paciente que no tiene correo electrónico registrado en la EPS simulada, cuando el sistema despacha una notificación, entonces la notificación se entrega por SMS y canales vinculados activos sin generar un mensaje de error al usuario, dejando constancia de la omisión en el registro de eventos.
- AC-007. Dado un fallo técnico en el envío del mensaje de SMS durante una notificación, cuando el sistema procesa el envío, entonces registra la falla del SMS en el evento, entrega la notificación en los demás canales activos disponibles y no programa reintentos para el SMS.

### 12. Dependencias
- EPS simulada: fuente de número celular y correo electrónico del paciente.
- Servicio de vinculación de canales: fuente del estado y vigencia de vinculación de chats de Telegram y navegadores web.
- Servicios externos reales: Telegram, envío de SMS y envío de correo.

### 13. Restricciones
- Ley 1581 de 2012 y Decreto 1377 de 2013 sobre protección de datos de salud (sección 3.11).
- Prohibición estricta de divulgar diagnósticos y medicamentos en notificaciones (sección 3.6).
- Respeto a la antigüedad máxima de vinculación de 3 meses por canal web o Telegram (sección 3.3).

### 14. Fuera de alcance
- Notificaciones vía WhatsApp o aplicaciones móviles instalables (sección 3.10).
- Notificaciones de confirmación de aprobación de autorizaciones por la EPS o llegada de inventario al punto (sección 3.6).
- Creación, modificación o reintento manual de datos de contacto del paciente desde Pharma Express (sección 3.2 y 3.10).
- Metas de desempeño o medición de tiempos de encolado (sección 3.10).

### 15. Preguntas abiertas
- OPEN-Q-003: Respondida (DEC-003).
- OPEN-Q-004: Respondida (DEC-004).
- OPEN-Q-005: Pendiente.

### 16. Trazabilidad
- HU-001: RF-003, RF-004, RF-005, RF-006, RF-007; BR-003, BR-004, BR-005; AC-003, AC-004, AC-005, AC-006, AC-007; CL-003, CL-004.
- RF-003: verificado por AC-003.
- RF-004: verificado por AC-004, RNF-003.
- RF-005: verificado por AC-005.
- RF-006: verificado por AC-006.
- RF-007: verificado por AC-007.
- BR-003: verificado por AC-004, RNF-003.
- BR-004: verificado por AC-003, AC-005.
- BR-005: verificado por AC-007.
- CL-003: verificado por AC-006.
- CL-004: verificado por AC-003.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad original del envío multicanal y restricción de privacidad clínica.
- Versión 0.2: incorporación de decisiones DEC-003 (manejo de fallas sin reintentos) y DEC-004 (omisión de correo sin error). Eliminación de RNF-004 por fuera de alcance. Remoción de lenguaje técnico en flujos y RNF-003. Remoción del código de entrega del texto de notificación en AC-004. Apertura de OPEN-Q-005 sobre identificación del paciente en canales vinculados a terceros.

## Verificación
- Completitud: no cumple. Queda pendiente la pregunta crítica OPEN-Q-005 para precisar la identificación del paciente en notificaciones dirigidas a canales vinculados a múltiples personas.
- Consistencia interna: cumple. Comparados RF-003 a RF-007 con las BR-003 a BR-005, flujos A1/E2 y criterios AC-003 a AC-007; todos concuerdan en el comportamiento observable del envío y manejo de excepciones.
- Consistencia con el contexto: cumple. Se verificó con las secciones 2.3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.8 y 3.11 del contexto. Las notificaciones no contienen medicamentos, diagnósticos ni código de entrega.
- No ambigüedad: cumple. Se eliminó todo término técnico de implementación (como asíncrono, en paralelo o CIE-10) manteniendo la redacción en función del comportamiento observable del sistema.
- Verificabilidad: cumple. Todos los requisitos funcionales y no funcionales cuentan con criterios comprobables en formato Dado, Cuando, Entonces o por inspección visual del texto.
- Trazabilidad: cumple. Todos los RF, BR, CL y AC están mapeados a la historia HU-001 y cruzados entre sí en la matriz de trazabilidad.
- No invención: cumple. Se respetaron las respuestas del equipo y las reglas explicitadas en el contexto sin presuponer acuerdos de desempeño ni datos en plantillas.
- Delimitación: cumple. Lo no cubierto se mantiene explícitamente en la sección Fuera de alcance y en la pregunta abierta OPEN-Q-005.

## Siguiente paso
Respondan la pregunta abierta OPEN-Q-005 y ejecuten de nuevo el agente con `--continuar SPEC-003`.
