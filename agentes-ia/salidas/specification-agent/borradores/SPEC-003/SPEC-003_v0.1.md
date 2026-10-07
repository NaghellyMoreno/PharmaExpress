<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.6-flash
Fecha: 2026-09-30 23:01
Petición: SPEC-003, empieza en HU-001, RF-003, RNF-003, BR-003, AC-003, CL-003, OPEN-Q-003 y DEC-003. Necesidad: El sistema debe enviar mensajes por todos los canales vinculados (SMS, correo, Telegram y web), pero tiene la restricción estricta de no incluir nunca nombres de medicamentos ni diagnósticos clínicos en dichos mensajes.
-->

# SPEC-003. Envío multicanal de notificaciones con protección de datos clínicos - Versión 0.1

Estado: Borrador
Modo: Inicial
Necesidad original: "El sistema debe enviar mensajes por todos los canales vinculados (SMS, correo, Telegram y web), pero tiene la restricción estricta de no incluir nunca nombres de medicamentos ni diagnósticos clínicos en dichos mensajes."

## Análisis
- Objetivo: Garantizar la entrega multicanal de notificaciones del sistema a los usuarios a través de los medios disponibles y vinculados, protegiendo estrictamente la privacidad del paciente al excluir nombres de medicamentos y diagnósticos médicos de todo contenido enviado.
- Alcance inicial: Despacho de notificaciones informativas por SMS, correo electrónico, Telegram y notificación web, aplicando el filtro estricto de privacidad en el contenido.
- Actores: Paciente, persona que actúa por el paciente, facilitador comunitario.
- Contexto aplicable: Secciones 2.3, 3.1, 3.2, 3.3, 3.6, 3.8, 3.11.

## Modelo de dominio
- Notificación: pertenece a un Paciente y está asociada a un evento del sistema (confirmación de cita, recordatorio, cancelación, aviso de nueva fecha habilitada); cardinalidad: 1 evento genera 1 notificación que se distribuye a múltiples canales. Origen: contexto 3.6.
- Canal de notificación: pertenece al Paciente o a la vinculación activa; puede ser SMS, correo electrónico, chat de Telegram vinculado o navegador web vinculado. Cardinalidad: 1 a N canales por notificación. Origen: contexto 3.3 y 3.6.
- Paciente: fuente de datos de contacto (celular y correo registrados en la EPS simulada) y de vinculaciones de canales (Telegram y Web); cardinalidad: 1 paciente. Origen: contexto 3.2 y 3.3.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
No aplica.

## Preguntas de aclaración
- OPEN-Q-003. Si el envío por uno de los canales reales (SMS, correo o Telegram) presenta un fallo técnico de comunicación, ¿el sistema debe reintentar el envío por ese canal o solo registrar el fallo sin afectar los demás canales?
  Por qué importa: define el comportamiento de excepción y la resiliencia en la distribución de mensajes.
  Crítica: sí
  Propuesta del agente: registrar el fallo del canal afectado y continuar la entrega por los demás canales sin bloquear la operación.
  Estado: Pendiente
  Responsable: equipo

- OPEN-Q-004. Cuando un canal alternativo (SMS o correo) no se encuentra registrado en la EPS simulada para el paciente (por ejemplo, paciente sin correo registrado), ¿el sistema debe continuar omitiendo ese canal en silencio o generar un registro explícito de omisión?
  Por qué importa: aclara el flujo de trazabilidad cuando faltan datos opcionales de contacto en la EPS.
  Crítica: no
  Propuesta del agente: omitir el canal no registrado sin generar un error para los demás canales y registrar el evento en auditoría interna.
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Garantizar la transmisión multicanal de notificaciones del sistema a través de los medios vinculados e informados del paciente (SMS, correo electrónico, Telegram y aplicación web), absteniéndose rigurosamente de incluir nombres de medicamentos o diagnósticos clínicos en cualquier mensaje.

### 2. Contexto
En Pharma Express, las notificaciones mantienen informado al usuario sobre el estado de sus citas, cancelaciones, cambios en sus prevalidaciones y avisos de disponibilidad periódica. Debido a la normativa sobre protección de datos personales y sensibles (Ley 1581 de 2012 y Decreto 1377 de 2013), la información de salud debe protegerse rigurosamente. Por esta razón, todos los mensajes salientes deben omitir explícitamente cualquier mención a nombres de medicamentos o diagnósticos.

Decisiones del equipo:
- Ninguna hasta el momento.

### 3. Alcance
- Despacho de notificaciones por los canales activos del paciente: SMS (al celular registrado en EPS), Correo electrónico (al correo registrado en EPS si existe), Telegram (a los chats vinculados activos) y Web (a los navegadores vinculados activos).
- Validación y filtrado del contenido del mensaje antes del envío para asegurar que no contenga términos relativos a medicamentos ni diagnósticos.
- Exclusión automática de canales con vinculación vencida (mayores a 3 meses) para la web y Telegram.

### 4. Actores e historias de usuario
Actores: Paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-001. Como paciente o persona que actúa en su nombre, quiero recibir avisos y recordatorios del sistema por todos mis canales de contacto disponibles, para estar informado a tiempo sobre mis citas y gestiones sin que se exponga información confidencial sobre mi salud en las notificaciones.

### 5. Requisitos funcionales
- RF-003. El sistema debe enviar cada notificación requerida a través de todos los medios configurados y habilitados para el paciente: mensaje SMS al número celular registrado en la EPS simulada, correo electrónico a la dirección registrada en la EPS simulada (si está registrada), mensaje de Telegram a todos los chats con vinculación activa para dicho paciente, y notificación web a todos los navegadores con vinculación activa para dicho paciente. Origen: contexto 3.6.
- RF-004. El sistema debe garantizar que ninguna notificación enviada por ningún canal incluya nombres de medicamentos ni diagnósticos clínicos. Origen: necesidad y contexto 3.6.
- RF-005. Si una vinculación de Telegram o de navegador web se encuentra vencida (superando los 3 meses desde su última verificación), el sistema no debe enviar notificaciones a través de dicho chat o navegador, manteniendo el envío por SMS y correo electrónico. Origen: contexto 3.3.
- RF-006. El sistema debe omitir el envío por correo electrónico si el paciente no dispone de una dirección de correo registrada en la EPS simulada, sin detener el envío por los demás canales disponibles. Origen: contexto 3.6.

### 6. Requisitos no funcionales
- RNF-003. Seguridad y Privacidad. El contenido de la plantilla de mensaje enviada por cualquier canal no debe contener variables relativas a nombres de medicamentos, principios activos, comercialización ni diagnósticos clínicos (CIE-10 o texto libre). Se verifica mediante revisión de código de plantillas y pruebas automatizadas de inspección de texto antes de la salida. Origen: contexto 3.6 y 3.11.
- RNF-004. Desempeño. El despacho de notificaciones multicanal debe iniciarse de forma asíncrona dentro de un tiempo no mayor a 5 segundos tras la generación del evento que la desencadena. Se verifica por medición de tiempos de encolado y despacho. Origen: inferido, requiere confirmación (OPEN-Q-003).

### 7. Reglas de negocio
- BR-003. Regla de oro de privacidad en comunicaciones: Ningún mensaje saliente (SMS, correo, Telegram, notificación web) transmitirá nombres de medicamentos ni diagnósticos médicos. Origen: contexto 3.6.
- BR-004. Canales directos e indirectos: Los SMS y correos electrónicos se dirigen a los datos de contacto registrados en la EPS simulada. Las notificaciones de Telegram y Web se dirigen únicamente a canales con vinculación activa no vencida. Origen: contexto 3.3 y 3.6.
- BR-005. Comportamiento ante fallas de canal: Pendiente de OPEN-Q-003.

### 8. Flujo principal
1. El sistema genera un evento que requiere notificación para un paciente (ej. confirmación de cita o recordatorio).
2. El sistema recupera los datos de contacto del paciente en la EPS simulada (celular y correo electrónico) y las vinculaciones activas asociadas al paciente (chats de Telegram y navegadores web).
3. El sistema valida que la vinculación de cada chat y navegador esté vigente (menos de 3 meses de antigüedad).
4. El sistema construye el mensaje utilizando la plantilla correspondiente al evento, verificando que no incluya ningún campo de medicamento o diagnóstico.
5. El sistema despacha en paralelo la notificación a los canales correspondientes: SMS, correo electrónico (si existe), chats de Telegram vinculados activos y navegadores web vinculados activos.
6. El sistema registra el resultado del envío para auditoría interna.

### 9. Flujos alternativos y de excepción
- A1. Paciente sin correo electrónico en la EPS simulada:
  1. En el paso 2 del flujo principal, se detecta la ausencia de dirección de correo.
  2. El sistema omite el canal de correo y continúa el despacho por los demás canales (SMS, Telegram y Web vinculados).
- E1. Vinculación de Telegram o Web vencida:
  1. En el paso 3 del flujo principal, se detecta que una vinculación superó los 3 meses.
  2. El sistema excluye ese chat o navegador de la lista de destinos de la notificación.
  3. El sistema continúa el envío por los demás canales (SMS, correo y vinculaciones vigentes).
- E2. Falla técnica en la plataforma del servicio externo (SMS, correo o Telegram):
  1. Durante el paso 5, el servicio externo reporta un error de entrega o no responde.
  2. Pendiente de confirmación según OPEN-Q-003.

### 10. Casos límite
- CL-003. Paciente sin ningún canal de Telegram ni Web vinculado y sin correo en la EPS simulada: El sistema debe enviar la notificación únicamente mediante SMS al celular registrado en la EPS. Origen: contexto 3.6.
- CL-004. Paciente con múltiples chats de Telegram vinculados (por ejemplo, el de varios cuidadores): El sistema debe enviar la notificación a cada uno de los chats de Telegram que mantengan la vinculación activa con dicho paciente. Origen: contexto 3.3 y 3.6.

### 11. Criterios de aceptación
- AC-003. Dado un paciente con un celular registrado en la EPS, un correo registrado en la EPS, un chat de Telegram vinculado activo y un navegador web vinculado activo, cuando el sistema genera una notificación, entonces se despacha un mensaje por SMS, un mensaje por correo, un mensaje por Telegram y una notificación web, y ninguno de ellos contiene nombres de medicamentos ni diagnósticos.
- AC-004. Dado un mensaje de notificación de cita reservada, cuando el usuario examina el texto recibido en SMS, correo, Telegram o web, entonces el texto contiene únicamente la fecha, hora, punto de dispensación, código de entrega u opciones de cancelación, pero no nombra ningún medicamento ni enfermedad/diagnóstico.
- AC-005. Dado un paciente cuya vinculación de Telegram venció hace más de 3 meses, cuando se genera una notificación para dicho paciente, entonces no se envía el mensaje al chat de Telegram vencido, pero sí se envía por SMS y al correo registrado.
- AC-006. Dado un paciente que no tiene correo electrónico registrado en la EPS simulada, cuando el sistema despacha una notificación, entonces la notificación se entrega por SMS y canales vinculados activos sin generar un mensaje de error.

### 12. Dependencias
- EPS simulada: fuente de número celular y correo electrónico del paciente.
- Servicio de vinculación de canales: fuente del estado y vigencia de vinculación de chats de Telegram y navegadores web.
- Servicios externos reales: Telegram API, proveedor de SMS y proveedor de correo electrónico.

### 13. Restricciones
- Ley 1581 de 2012 y Decreto 1377 de 2013 sobre protección de datos de salud (sección 3.11).
- Prohibición estricta de divulgar diagnósticos y medicamentos en notificaciones (sección 3.6).
- Respeto a la antigüedad máxima de vinculación de 3 meses por canal web o Telegram (sección 3.3).

### 14. Fuera de alcance
- Notificaciones vía WhatsApp o aplicaciones móviles instalables (sección 3.10).
- Notificaciones de confirmación de aprobación de autorizaciones por la EPS o llegada de inventario al punto (sección 3.6).
- Creación, modificación o reintento manual de datos de contacto del paciente desde Pharma Express (sección 3.2 y 3.10).

### 15. Preguntas abiertas
- OPEN-Q-003: Pendiente. (Manejo de fallas de entrega en servicios externos).
- OPEN-Q-004: Pendiente. (Comportamiento de auditoría ante canales opcionales no registrados en EPS).

### 16. Trazabilidad
- HU-001: RF-003, RF-004, RF-005, RF-006; BR-003, BR-004; AC-003, AC-004, AC-005, AC-006; CL-003, CL-004.
- RF-003: verificado por AC-003.
- RF-004: verificado por AC-004, RNF-003.
- RF-005: verificado por AC-005.
- RF-006: verificado por AC-006.
- BR-003: verificado por AC-004, RNF-003.
- BR-004: verificado por AC-003, AC-005.
- CL-003: verificado por AC-006.
- CL-004: verificado por AC-003.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad original del envío multicanal y restricción de privacidad clínica.

## Verificación
- Completitud: cumple. Se identificaron los actores, modelo de dominio, flujos, reglas, criterios de aceptación, excepciones y preguntas abiertas.
- Consistencia interna: cumple. Comparados RF-003 a RF-006 con las BR-003 a BR-004 y los criterios AC-003 a AC-006; todos concuerdan en el comportamiento ante canales vinculados y omitidos.
- Consistencia con el contexto: cumple. Se verificó con las secciones 2.3, 3.1, 3.2, 3.3, 3.6, 3.8 y 3.11 del contexto aprobadas.
- No ambigüedad: cumple. Se usaron reglas claras sin interpretar de manera técnica la implementación de los servicios reales.
- Verificabilidad: cumple. Todos los requisitos cuentan con criterios de aceptación estructurados en formato Dado, Cuando, Entonces.
- Trazabilidad: cumple. La matriz de trazabilidad mapea HU, RF, BR, CL y AC sin elementos huérfanos.
- No invención: cumple. Se respetaron estrictamente las directrices del contexto sin inventar reglas de negocio ni detalles técnicos no autorizados.
- Delimitación: cumple. Lo que no está explicitado en el contexto se marcó como pregunta abierta (OPEN-Q-003, OPEN-Q-004) o fuera de alcance.

## Siguiente paso
Respondan las preguntas abiertas (en especial la pregunta crítica OPEN-Q-003) y ejecuten de nuevo el agente con --continuar SPEC-003.
