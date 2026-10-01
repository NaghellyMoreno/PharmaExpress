<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.6-flash
Fecha: 2026-09-30 22:58
Petición: El sistema debe enviar mensajes por todos los canales vinculados (SMS, correo, Telegram y web), pero tiene la restricción estricta de no incluir nunca nombres de medicamentos ni diagnósticos clínicos en dichos mensajes.
-->

# SPEC-001. Envío de Notificaciones Multicanal - Versión 0.1

Estado: Borrador
Modo: Inicial
Necesidad original: "El sistema debe enviar mensajes por todos los canales vinculados (SMS, correo, Telegram y web), pero tiene la restricción estricta de no incluir nunca nombres de medicamentos ni diagnósticos clínicos en dichos mensajes."

## Análisis
- Objetivo: Garantizar la entrega oportuna de notificaciones a través de todos los canales de comunicación configurados y vinculados del paciente, protegiendo estrictamente la privacidad de sus datos de salud al omitir nombres de medicamentos y diagnósticos.
- Alcance inicial: Reglas generales de despacho multicanal (SMS, correo electrónico, Telegram y notificación web) y políticas de privacidad en la redacción del contenido de los mensajes.
- Actores: Paciente, persona que actúa por el paciente (cuidador, tutor, familiar), facilitador comunitario.
- Contexto aplicable: Sección 2.3 (Actores), Sección 3.1 (Canales), Sección 3.2 (Identidad y consentimiento), Sección 3.3 (Vinculación de canales), Sección 3.6 (Notificaciones y recordatorios), Sección 3.8 (Datos simulados) y Sección 3.11 (Contexto normativo).

## Modelo de dominio
- Paciente: Entidad principal asociada a los datos de contacto (celular y correo) provenientes de la EPS simulada. Origen: contexto 2.3.
- Canal: Medio de transmisión de mensajes (SMS, correo, Telegram, web). Origen: contexto 3.1.
- Vinculación: Asociación activa entre un canal específico (chat de Telegram o navegador web) y un paciente. Tienen una vigencia máxima de 3 meses. Origen: contexto 3.3.
- Notificación: Mensaje generado por el sistema ante un evento funcional. Pertenece a un paciente y se distribuye a través de sus canales habilitados. Origen: contexto 3.6.
- Evento disparador: Suceso del sistema que origina una notificación (ej. confirmación de cita, recordatorio, cancelación, vencimiento o aviso previo a fecha habilitada). Origen: contexto 3.5 y 3.6.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
No aplica.

## Preguntas de aclaración
- OPEN-Q-001. Si un canal específico (por ejemplo, SMS o correo) presenta una falla técnica en la entrega de la notificación, ¿el sistema debe reintentar el envío por ese canal o debe registrar la falla y continuar con los demás canales sin bloquear la operación?
  Por qué importa: Define la regla de resiliencia y el comportamiento del sistema ante fallas parciales en los canales de comunicación.
  Crítica: sí
  Propuesta del agente: Registrar el estado de entrega por canal, no reintentar de forma indefinida y asegurar que el fallo de un canal no impida el envío por los demás.
  Estado: Pendiente
  Responsable: equipo

- OPEN-Q-002. Para garantizar la claridad del mensaje sin incluir nombres de medicamentos ni diagnósticos, ¿qué datos mínimos del contexto operacional deben estructurar cada tipo de notificación (por ejemplo: fecha, hora, nombre del punto de dispensación, código de entrega o número de solicitud)?
  Por qué importa: Establece la plantilla o estructura requerida para los mensajes, asegurando que sean comprensibles para el paciente sin revelar datos sensibles.
  Crítica: sí
  Propuesta del agente: Utilizar únicamente identificadores operacionales (fecha, hora, punto de dispensación, código de entrega numérico/QR) sin referencias a la patología ni al tratamiento.
  Estado: Pendiente
  Responsable: equipo

- OPEN-Q-003. En el caso de la web, ¿las notificaciones se envían únicamente a navegadores con vinculación activa y no vencida mediante el mecanismo del navegador, o requieren que el usuario esté navegando en la aplicación en ese momento?
  Por qué importa: Delimita la condición técnica funcional para considerar que un navegador web es un destinatario válido.
  Crítica: no
  Propuesta del agente: Enviar la notificación web a todos los navegadores vinculados activamente cuyo periodo de vinculación de 3 meses no haya expirado.
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Despachar todas las notificaciones del sistema a través de los canales reales habilitados (SMS y correo) y los canales vinculados activos (Telegram y web) de un paciente, asegurando bajo cualquier circunstancia que no se expongan nombres de medicamentos ni diagnósticos clínicos en los mensajes.

### 2. Contexto
Pharma Express es un sistema multicanal de pre-dispensación farmacéutica. Cuando ocurre un evento que requiere informar al usuario (confirmación, recordatorio, cancelación o aviso de fecha habilitada), la comunicación debe llegar por múltiples vías para garantizar la accesibilidad, especialmente a personas crónicas, adultos mayores o con barreras digitales.
Dado que la información de salud es altamente sensible bajo la Ley 1581 de 2012, el sistema impone una regla absoluta de restricción de datos en las notificaciones.

Decisiones del equipo:
- Ninguna hasta el momento.

### 3. Alcance
- Envío simultáneo de notificaciones por los canales directos del paciente (SMS al celular registrado en la EPS simulada y correo electrónico si existe).
- Envío simultáneo a los canales digitales vinculados activamente (chats de Telegram vinculados y navegadores web vinculados).
- Exclusión estricta de nombres de medicamentos y diagnósticos en la totalidad de los mensajes enviados por cualquier canal.
- Exclusión de envío de notificaciones a canales cuya vinculación esté vencida (mayor a 3 meses).

### 4. Actores e historias de usuario
Actores: Paciente, persona que actúa por el paciente (cuidador, tutor, familiar), facilitador comunitario.
- HU-001. Como paciente o persona que actúa en su nombre, quiero recibir la información de mis citas y solicitudes por todos mis canales disponibles (SMS, correo, Telegram y web), para estar al tanto de mis gestiones sin importar la plataforma que use.
- HU-002. Como paciente, quiero que los mensajes de notificación no muestren el nombre de mis medicamentos ni mis diagnósticos clínicos, para proteger la privacidad de mi información médica ante terceros que puedan ver mi pantalla o mis mensajes.

### 5. Requisitos funcionales
- RF-001. El sistema debe despachar cada notificación generada por un evento funcional hacia todos los medios de contacto disponibles del paciente: SMS al celular registrado en la EPS simulada, correo electrónico registrado (si existe), chats de Telegram vinculados activamente y navegadores web vinculados activamente. Origen: contexto 3.6.
- RF-002. El sistema debe omitir estrictamente cualquier nombre de medicamento, principio activo, marca comercial o diagnóstico clínico en el texto, asunto, encabezado o cuerpo de toda notificación enviada por cualquier canal. Origen: contexto 3.6 y necesidad.
- RF-003. El sistema debe verificar la validez temporal de las vinculaciones antes del despacho por canales digitales (Telegram y web), suprimiendo el envío hacia chats o navegadores cuya vinculación haya superado los 3 meses desde su última verificación de identidad. Origen: contexto 3.3.
- RF-004. Si el canal digital (Telegram o web) se encuentra vencido o desvinculado, el sistema debe mantener el envío de las notificaciones a los canales directos del paciente (SMS y correo electrónico registrado). Origen: contexto 3.3.
- RF-005. El sistema debe permitir que una misma notificación sea distribuida a múltiples chats de Telegram o múltiples navegadores web si el paciente tiene más de un canal vinculado activo. Origen: contexto 3.3 y 3.6.

### 6. Requisitos no funcionales
- RNF-001. Privacidad y Seguridad. Ninguna notificación en tránsito ni almacenada para envío debe contener datos sensibles de salud (medicamentos o diagnósticos). Se verifica mediante auditoría automatizada de contenido de mensajes antes de la salida. Origen: contexto 3.6 y 3.11.
- RNF-002. Concurrencia multicanal. El despacho de una notificación por un canal no debe bloquear ni demorar en forma secuencial la entrega por los demás canales. Se verifica mediante prueba de envío simultáneo multicanal. Origen: inferido, requiere confirmación (OPEN-Q-001).

### 7. Reglas de negocio
- BR-001. Regla de privacidad absoluta de notificaciones: Ningún mensaje enviado por SMS, correo electrónico, Telegram o notificación web contendrá palabras correspondientes a nombres de medicamentos ni a diagnósticos o condiciones médicas. Origen: contexto 3.6.
- BR-002. Regla de distribución multicanal: Toda notificación se enviará a la totalidad de los canales disponibles y activos del paciente. Los canales SMS y correo dependen de la información de la EPS simulada; los canales Telegram y web dependen de las vinculaciones activas. Origen: contexto 3.3 y 3.6.
- BR-003. Regla de vigencia de canal para notificaciones: Un chat de Telegram o navegador web cuya vinculación tenga una antigüedad mayor a 3 meses no recibirá notificaciones. Los SMS y correos continúan enviándose independientemente del estado de la vinculación de Telegram o web. Origen: contexto 3.3.
- BR-004. Estructura de mensajes permitida: Los mensajes solo podrán referirse a la gestión utilizando identificadores operacionales como: código de entrega, fecha de la cita, ventana horaria, punto de dispensación o estado de la solicitud. Pendiente de OPEN-Q-002.

### 8. Flujo principal
1. Ocurre un evento en el sistema que requiere enviar una notificación al paciente (ej. agendamiento de cita, recordatorio o cancelación).
2. El sistema identifica al paciente asociado a la gestión.
3. El sistema consulta la información de contacto registrada en la EPS simulada (número de celular y correo electrónico).
4. El sistema identifica las vinculaciones activas asociadas al paciente en chats de Telegram y navegadores web.
5. El sistema filtra las vinculaciones activas y descarta aquellas que hayan superado los 3 meses desde su verificación de identidad.
6. El sistema redacta el contenido de la notificación aplicando la regla BR-001 (omitir medicamentos y diagnósticos) y usando datos operacionales.
7. El sistema despacha el mensaje de forma simultánea a:
   a. Celular registrado (SMS).
   b. Correo electrónico registrado (si existe).
   c. Chats de Telegram con vinculación activa no vencida.
   d. Navegadores web con vinculación activa no vencida.
8. El sistema registra el resultado del intento de envío por cada canal.

### 9. Flujos alternativos y de excepción
- A1. Paciente sin correo electrónico registrado en la EPS simulada:
  1. En el paso 3, el sistema detecta que el paciente no tiene correo registrado.
  2. El sistema continúa el flujo despachando únicamente por SMS y por los canales vinculados activos (Telegram y web).

- A2. Paciente sin canales vinculados (sin Telegram y sin web):
  1. En el paso 4, el sistema detecta que no existen chats ni navegadores vinculados.
  2. El sistema realiza el despacho exclusivamente a través de SMS y correo electrónico (si existe).

- E1. Vinculación de Telegram o web vencida (mayor a 3 meses):
  1. En el paso 5, el sistema detecta que la vinculación del chat de Telegram o del navegador web superó los 3 meses de antigüedad.
  2. El sistema excluye dicho chat o navegador del despacho de la notificación.
  3. El sistema continúa el envío por los canales directos (SMS, correo) y por otros canales vinculados que sigan vigentes.

- E2. Falla técnica en la entrega por uno de los canales:
  1. En el paso 7, el envío por uno de los canales (ej. SMS) falla por problemas externos.
  2. El sistema registra el fallo de ese canal específico y no interrumpe ni revoca la entrega en los demás canales. Pendiente de OPEN-Q-001.

### 10. Casos límite
- CL-001. Múltiples cuidadores/chats vinculados al mismo paciente: Un paciente tiene 3 chats de Telegram vinculados por diferentes familiares (todos con menos de 3 meses de vinculación). El sistema debe enviar la notificación a los 3 chats de Telegram, además del SMS y correo del paciente. Origen: contexto 3.3 y 3.6.
- CL-002. Intento de inclusión de datos de medicamentos o diagnósticos en la plantilla de mensaje: Se intenta generar una notificación a partir de un evento. El sistema debe validar que el texto procesado no contenga nombres de medicamentos ni diagnósticos antes de salir. Origen: contexto 3.6.
- CL-003. Paciente con vinculación de Telegram vencida a los 91 días: Se genera un recordatorio de cita. El sistema no debe enviar el mensaje al chat de Telegram vencido, pero sí debe enviarlo por SMS y por correo electrónico. Origen: contexto 3.3.

### 11. Criterios de aceptación
- AC-001. Dado un paciente con celular, correo, un chat de Telegram vinculado activo (menos de 3 meses) y un navegador web vinculado activo, cuando se genera una notificación de confirmación de cita, entonces el sistema envía la notificación a los 4 medios sin incluir nombres de medicamentos ni diagnósticos.
- AC-002. Dado un mensaje de notificación de recordatorio de cita generado por el sistema, cuando se inspecciona su texto enviado por cualquier canal (SMS, correo, Telegram, web), entonces se verifica que contiene únicamente fecha, hora, punto de dispensación o código operacional, y no menciona ningún medicamento ni diagnóstico.
- AC-003. Dado un paciente cuyo chat de Telegram fue vinculado hace 100 días (vinculación vencida), cuando el sistema genera una notificación, entonces no envía el mensaje al chat de Telegram, pero sí lo envía al SMS y correo electrónico del paciente.
- AC-004. Dado un paciente con 2 chats de Telegram diferentes vinculados de forma activa, cuando se genera una notificación, entonces ambos chats de Telegram reciben el mensaje simultáneamente.
- AC-005. Dado un paciente que no tiene correo electrónico registrado en la EPS simulada pero sí celular y un chat de Telegram activo, cuando se genera una notificación, entonces el sistema envía el mensaje por SMS y por Telegram sin generar error por la ausencia de correo.

### 12. Dependencias
- EPS simulada: Fuente de datos de contacto del paciente (número de celular para SMS y correo electrónico).
- Servicio de vinculación de canales: Estado y fecha de la última verificación de identidad para chats de Telegram y navegadores web.
- Servicios externos reales: Proveedores de envío de SMS, envío de correo electrónico y Bot de Telegram.

### 13. Restricciones
- Ley 1581 de 2012 / Decreto 1377 de 2013: Protección de datos personales sensibles de salud. Origen: contexto 3.11.
- Restricción del proyecto: Los servicios de Telegram, SMS y correo son reales y solo transportan mensajes; no constituyen fuente de identidad del paciente. Origen: contexto 2.3 y 3.8.

### 14. Fuera de alcance
- Notificaciones vía WhatsApp o aplicaciones móviles instalables (contexto 3.10).
- Notificaciones automáticas de llegada de inventario o aprobación de autorizaciones por la EPS (contexto 3.6 y 3.10).
- Reprogramación de citas desde el cuerpo del mensaje (contexto 3.5 y 3.10).
- Inclusión de detalles clínicos o listado de prescripciones en los mensajes.

### 15. Preguntas abiertas
- OPEN-Q-001: Pendiente. (Manejo de reintentos o fallos en canales individuales).
- OPEN-Q-002: Pendiente. (Estructura y datos operacionales mínimos en plantillas de notificación).
- OPEN-Q-003: Pendiente. (Mecanismo de notificación web para navegadores vinculados).

### 16. Trazabilidad
- HU-001: RF-001, RF-003, RF-004, RF-005; BR-002, BR-003; AC-001, AC-003, AC-004, AC-005; CL-001, CL-003.
- HU-002: RF-002; BR-001, BR-004; AC-002; CL-002.
- RF-001: verificado por AC-001, AC-005.
- RF-002: verificado por AC-002, AC-001.
- RF-003: verificado por AC-003.
- RF-004: verificado por AC-003, AC-005.
- RF-005: verificado por AC-004.
- BR-001: verificado por AC-002.
- BR-002: verificado por AC-001.
- BR-003: verificado por AC-003.
- BR-004: verificado por AC-002.
- CL-001: verificado por AC-004.
- CL-002: verificado por AC-002.
- CL-003: verificado por AC-003.

### 17. Historial de cambios
- Versión 0.1: Creación inicial del documento a partir de la necesidad express sobre notificaciones multicanal y restricción estricta de medicamentos y diagnósticos.

## Verificación
- Completitud: cumple. Se cubren el objetivo, alcance, actores, modelo de dominio, flujos, reglas, criterios de aceptación, dependencias, restricciones y fuera de alcance.
- Consistencia interna: cumple. Se verificó que los RF-001 a RF-005 concuerden con las Reglas de Negocio BR-001 a BR-004 y los Criterios de Aceptación AC-001 a AC-005.
- Consistencia con el contexto: cumple. Toda la especificación respeta estrictamente las reglas de la sección 3 del contexto, en particular 3.1, 3.3, 3.6, 3.8, 3.10 y 3.11. Ningún ejemplo o criterio contiene nombres de medicamentos ni diagnósticos.
- No ambigüedad: cumple. Los términos y comportamientos del despacho de mensajes están claramente delimitados y sin lenguaje vago.
- Verificabilidad: cumple. Todos los criterios de aceptación están estructurados en formato Dado / Cuando / Entonces y son observables sin ambiguidades.
- Trazabilidad: cumple. Toda la matriz de trazabilidad vincula de forma cruzada HUs, RFs, BRs, CLs y ACs.
- No invención: cumple. Los elementos confirmados citan las secciones 3.x del contexto. Las lagunas operacionales de reintentos y plantillas fueron abiertas como OPEN-Q.
- Delimitación: cumple. No se incluyen aspectos técnicos de arquitectura, APIs, bases de datos ni decisiones de implementación.

## Siguiente paso
Respondan las preguntas abiertas (OPEN-Q-001, OPEN-Q-002, OPEN-Q-003) y ejecuten de nuevo el agente indicando las respuestas para avanzar a la siguiente versión de SPEC-001.
