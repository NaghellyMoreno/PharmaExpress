# SPEC-003. Envío multicanal de notificaciones con protección de datos clínicos - Versión 1.1

Estado: Aprobada y congelada
Modo: Aprobación
Necesidad original: "El sistema debe enviar mensajes por todos los canales vinculados (SMS, correo, Telegram y web), pero tiene la restricción estricta de no incluir nunca nombres de medicamentos ni diagnósticos clínicos en dichos mensajes."

## Análisis
- Objetivo: garantizar la entrega multicanal de notificaciones del sistema a los usuarios a través de sus medios de contacto registrados y vinculados, protegiendo estrictamente la privacidad del paciente al excluir nombres de medicamentos y diagnósticos médicos de todo texto enviado, e identificando al paciente únicamente por su primer nombre e inicial de su primer apellido.
- Alcance inicial: envío de notificaciones por SMS, correo electrónico, Telegram y notificación web, aplicando la restricción de privacidad clínica e identificación estandarizada del paciente.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- Contexto aplicable: secciones 2.3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.8, 3.11.

## Modelo de dominio
- Notificación: pertenece a un paciente y está asociada a un evento del sistema (confirmación de cita, recordatorio, cancelación, aviso de nueva fecha habilitada); cardinalidad: 1 evento genera 1 notificación que se distribuye a múltiples canales. Origen: contexto 3.6.
- Canal de notificación: pertenece al paciente o a la vinculación activa; puede ser SMS, correo electrónico, chat de Telegram vinculado o navegador web vinculado. Cardinalidad: 1 a N canales por notificación. Origen: contexto 3.3 y 3.6.
- Paciente: fuente de datos de contacto (celular y correo registrados en la EPS simulada) y de vinculaciones de canales (Telegram y web); cardinalidad: 1 paciente. Origen: contexto 3.2 y 3.3.

## Contradicciones detectadas
- Ninguna con la sección 3 del contexto. DEC-010 no cambia requisitos, reglas ni comportamientos; solo identificadores.
- Constancia: DEC-010 es una excepción a la convención del agente "Nunca reutilices ni renumeres un identificador". El equipo la conoce y la aprobó de forma explícita como excepción única, por lo que no requiere pregunta.
- Revisé todos los identificadores presentes en la versión 1.0 aprobada: HU-001; RF-003 a RF-008; RNF-003 y RNF-004 (este último solo en el historial, eliminado en la versión 0.2); BR-003 a BR-006; AC-003 a AC-008; CL-003 y CL-004; OPEN-Q-003 a OPEN-Q-005; DEC-003 a DEC-005. Todos están en la tabla de equivalencias del equipo. No encontré identificadores de SPEC-003 por fuera de la tabla. Las etiquetas de flujo A1, E1 y E2 no son identificadores de las convenciones y se conservan.

## Análisis de impacto
- DEC-010: afecta HU-003 (antes HU-001); RF-023 a RF-028 (antes RF-003 a RF-008); RNF-005 (antes RNF-003) y RNF-006 (antes RNF-004, eliminado en la versión 0.2, solo aparece en el historial); BR-014 a BR-017 (antes BR-003 a BR-006); AC-019 a AC-024 (antes AC-003 a AC-008); CL-008 y CL-009 (antes CL-003 y CL-004); OPEN-Q-008 a OPEN-Q-010 (antes OPEN-Q-003 a OPEN-Q-005); DEC-007 a DEC-009 (antes DEC-003 a DEC-005). Secciones actualizadas: 2 (decisiones), 4, 5, 6, 7, 10, 11, 15, 16, 17 y Verificación, incluidos los orígenes que citaban decisiones. El flujo principal y los flujos A1, E1 y E2 no contienen identificadores, por lo que su texto no cambia. El contenido de requisitos, reglas, flujos, casos límite y criterios no cambia. Todos actualizados.

## Preguntas de aclaración
No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Garantizar el envío multicanal de notificaciones del sistema a través de los medios vinculados e informados del paciente (SMS, correo electrónico, Telegram y aplicación web), absteniéndose de incluir nombres de medicamentos o diagnósticos clínicos en cualquier mensaje e identificando al paciente únicamente por su primer nombre e inicial de su primer apellido.

### 2. Contexto
En Pharma Express, las notificaciones mantienen informado al usuario sobre el estado de sus citas, cancelaciones, cambios en sus prevalidaciones y avisos de disponibilidad periódica. Debido a la normativa sobre protección de datos personales y sensibles (Ley 1581 de 2012 y Decreto 1377 de 2013), la información de salud debe protegerse. Por esta razón, todos los mensajes salientes omiten cualquier mención a nombres de medicamentos o diagnósticos, y limitan la identificación del paciente a su primer nombre e inicial del primer apellido para proteger su identidad cuando los canales son compartidos por cuidadores o facilitadores.

Decisiones del equipo:
- DEC-007. Si el envío por uno de los canales reales (SMS, correo o Telegram) presenta un fallo técnico, el sistema registra el fallo en el registro de eventos y continúa el envío por los demás canales disponibles, sin realizar reintentos automáticos. Responde a OPEN-Q-008.
- DEC-008. Cuando un canal alternativo (como el correo electrónico) no está registrado en la EPS simulada, el sistema omite el envío por ese canal sin mostrar un mensaje de error al usuario y deja constancia del evento en el registro del sistema. Responde a OPEN-Q-009.
- DEC-009. Toda notificación, en todos los canales, identifica al paciente utilizando únicamente su primer nombre y la inicial de su primer apellido (por ejemplo, María G.). Se excluye explícitamente la cédula (completa o parcial) y cualquier dato de salud. El detalle completo de la gestión se consulta dentro del flujo autenticado de la web o de Telegram. Responde a OPEN-Q-010.
- DEC-010. Se renumeran los identificadores de SPEC-003 para que no se crucen con SPEC-001 ni SPEC-002. Es una excepción única aprobada por el equipo. No cambia ningún requisito, regla ni comportamiento. Responde a una solicitud de cambio del equipo sobre la versión 1.0 aprobada (no responde a una pregunta abierta).

### 3. Alcance
- Despacho de notificaciones por los canales activos del paciente: SMS (al celular registrado en la EPS simulada), correo electrónico (al correo registrado en la EPS simulada, si existe), Telegram (a los chats vinculados activos) y web (a los navegadores vinculados activos).
- Garantía de exclusión de medicamentos y diagnósticos en el texto enviado.
- Identificación uniforme del paciente en las notificaciones mediante su primer nombre e inicial de su primer apellido.
- Exclusión de canales cuya vinculación haya superado los 3 meses.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-003. Como paciente o persona que actúa en su nombre, quiero recibir avisos y recordatorios del sistema por todos mis canales de contacto disponibles, para estar informado a tiempo sobre mis citas y gestiones sin que se exponga información confidencial sobre mi salud ni la cédula completa en las notificaciones.

### 5. Requisitos funcionales
- RF-023. El sistema debe enviar cada notificación requerida a través de todos los medios configurados y habilitados para el paciente: mensaje SMS al número celular registrado en la EPS simulada, correo electrónico a la dirección registrada en la EPS simulada (si está registrada), mensaje de Telegram a todos los chats con vinculación activa para dicho paciente, y notificación web a todos los navegadores con vinculación activa para dicho paciente. Origen: contexto 3.6.
- RF-024. El sistema debe garantizar que ninguna notificación enviada por ningún canal incluya nombres de medicamentos ni diagnósticos clínicos. Origen: necesidad y contexto 3.6.
- RF-025. Si una vinculación de Telegram o de navegador web se encuentra vencida por superar los 3 meses desde su verificación, el sistema no debe enviar notificaciones a través de dicho chat o navegador, manteniendo el envío por SMS y correo electrónico. Origen: contexto 3.3.
- RF-026. El sistema debe omitir el envío por correo electrónico si el paciente no tiene una dirección de correo registrada en la EPS simulada, continuando el envío por los demás canales disponibles y dejando constancia en el registro de eventos del sistema. Origen: DEC-008 y contexto 3.6.
- RF-027. El sistema debe registrar cada fallo de envío en un canal real y continuar la entrega por los demás canales activos del paciente, sin programar reintentos automáticos para el canal fallido. Origen: DEC-007.
- RF-028. El sistema debe identificar al paciente en el texto de toda notificación enviada en cualquiera de los canales utilizando únicamente su primer nombre y la inicial de su primer apellido, omitiendo el número de cédula (completo o parcial) y guiando al usuario a consultar el detalle en la web o Telegram. Origen: DEC-009.

### 6. Requisitos no funcionales
- RNF-005. Seguridad y Privacidad. Ningún mensaje o notificación generado por el sistema debe contener nombres de medicamentos, marcas, principios activos, diagnósticos clínicos ni números de identificación del paciente (cédula completa o parcial). Se verifica mediante inspección del texto recibido en las pruebas de envío por cada canal. Origen: contexto 3.6, 3.11 y DEC-009.

### 7. Reglas de negocio
- BR-014. Regla de oro de privacidad en comunicaciones: ningún mensaje saliente (SMS, correo, Telegram, notificación web) transmitirá nombres de medicamentos ni diagnósticos médicos. Origen: contexto 3.6.
- BR-015. Canales directos e indirectos: los SMS y correos electrónicos se dirigen a los datos de contacto registrados en la EPS simulada. Las notificaciones de Telegram y web se dirigen únicamente a canales con vinculación activa no vencida. Origen: contexto 3.3 y 3.6.
- BR-016. Manejo de fallas de entrega: la interrupción o falla de envío en un canal no detiene la entrega en los demás canales activos ni genera reintentos automáticos posteriores. Origen: DEC-007.
- BR-017. Identificación del paciente en notificaciones: toda notificación enviada por cualquier canal identificará al paciente únicamente por su primer nombre y la inicial de su primer apellido (por ejemplo, María G.), omitiendo el documento de identidad y remitiendo la consulta de detalles al flujo autenticado del sistema. Origen: DEC-009.

### 8. Flujo principal
1. El sistema genera un evento que requiere notificación para un paciente (por ejemplo, confirmación de cita o recordatorio).
2. El sistema consulta los datos de contacto del paciente en la EPS simulada (celular y correo electrónico) y las vinculaciones activas asociadas al paciente (chats de Telegram y navegadores web).
3. El sistema valida que la vinculación de cada chat y navegador tenga una antigüedad menor o igual a 3 meses.
4. El sistema prepara el mensaje correspondiente al evento, identificando al paciente con su primer nombre y la inicial de su primer apellido (ejemplo: María G.) y verificando que no contenga cédula (completa ni parcial), medicamentos ni diagnósticos.
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
- CL-008. Paciente sin ningún chat de Telegram ni navegador web vinculado y sin correo en la EPS simulada: el sistema envía la notificación únicamente mediante SMS al celular registrado en la EPS. Origen: contexto 3.6.
- CL-009. Paciente con múltiples chats de Telegram vinculados o facilitador con múltiples pacientes vinculados a un mismo chat: el sistema envía la notificación a cada chat vinculado activo identificando al paciente correspondiente con su primer nombre e inicial de su primer apellido, sin incluir su cédula ni datos de salud. Origen: contexto 3.3, 3.6 y DEC-009.

### 11. Criterios de aceptación
- AC-019. Dado un paciente con un celular registrado en la EPS, un correo registrado en la EPS, un chat de Telegram vinculado activo y un navegador web vinculado activo, cuando el sistema genera una notificación, entonces se despacha un mensaje por SMS, un mensaje por correo, un mensaje por Telegram y una notificación web, y ninguno de ellos contiene nombres de medicamentos, diagnósticos ni el número de cédula.
- AC-020. Dado un mensaje de notificación de cita reservada, cuando el usuario examina el texto recibido en SMS, correo, Telegram o web, entonces el texto contiene únicamente la identificación del paciente en formato primer nombre e inicial del primer apellido (por ejemplo, María G.), los datos de la cita (como fecha, hora y punto de dispensación) o las opciones de cancelación, pero no incluye el código de entrega, número de cédula, nombres de medicamentos ni diagnósticos médicos.
- AC-021. Dado un paciente cuya vinculación de Telegram venció hace más de 3 meses, cuando se genera una notificación para dicho paciente, entonces no se envía el mensaje al chat de Telegram vencido, pero sí se envía por SMS y al correo registrado.
- AC-022. Dado un paciente que no tiene correo electrónico registrado en la EPS simulada, cuando el sistema despacha una notificación, entonces la notificación se entrega por SMS y canales vinculados activos sin generar un mensaje de error al usuario, dejando constancia de la omisión en el registro de eventos.
- AC-023. Dado un fallo técnico en el envío del mensaje de SMS durante una notificación, cuando el sistema procesa el envío, entonces registra la falla del SMS en el evento, entrega la notificación en los demás canales activos disponibles y no programa reintentos para el SMS.
- AC-024. Dado un facilitador comunitario con dos pacientes vinculados a su chat de Telegram, cuando se genera una notificación para uno de ellos, entonces el mensaje recibido en Telegram nombra al paciente únicamente como primer nombre e inicial de su primer apellido (por ejemplo, Carlos R.), no incluye números de cédula ni datos de salud, y remite a la plataforma para consultar los detalles.

### 12. Dependencias
- EPS simulada: fuente de número celular, correo electrónico y nombres del paciente.
- Servicio de vinculación de canales: fuente del estado y vigencia de vinculación de chats de Telegram y navegadores web.
- Servicios externos reales: Telegram, envío de SMS y envío de correo.

### 13. Restricciones
- Ley 1581 de 2012 y Decreto 1377 de 2013 sobre protección de datos de salud y personales (sección 3.11).
- Prohibición estricta de divulgar diagnósticos y medicamentos en notificaciones (sección 3.6).
- Respeto a la antigüedad máxima de vinculación de 3 meses por canal web o Telegram (sección 3.3).

### 14. Fuera de alcance
- Notificaciones vía WhatsApp o aplicaciones móviles instalables (sección 3.10).
- Notificaciones de confirmación de aprobación de autorizaciones por la EPS o llegada de inventario al punto (sección 3.6).
- Creación, modificación o reintento manual de datos de contacto del paciente desde Pharma Express (sección 3.2 y 3.10).
- Metas de desempeño o medición de tiempos de encolado (sección 3.10).

### 15. Preguntas abiertas
- OPEN-Q-008: Respondida (DEC-007).
- OPEN-Q-009: Respondida (DEC-008).
- OPEN-Q-010: Respondida (DEC-009).

### 16. Trazabilidad
- HU-003: RF-023, RF-024, RF-025, RF-026, RF-027, RF-028; BR-014, BR-015, BR-016, BR-017; AC-019, AC-020, AC-021, AC-022, AC-023, AC-024; CL-008, CL-009.
- RF-023: verificado por AC-019.
- RF-024: verificado por AC-020, RNF-005.
- RF-025: verificado por AC-021.
- RF-026: verificado por AC-022.
- RF-027: verificado por AC-023.
- RF-028: verificado por AC-020, AC-024.
- BR-014: verificado por AC-020, RNF-005.
- BR-015: verificado por AC-019, AC-021.
- BR-016: verificado por AC-023.
- BR-017: verificado por AC-020, AC-024.
- CL-008: verificado por AC-022.
- CL-009: verificado por AC-024.

### 17. Historial de cambios
Nota: en las entradas de las versiones 0.1 a 1.0 los identificadores se muestran ya con la numeración vigente desde la versión 1.1 (DEC-010). La equivalencia con la numeración original está en la entrada de la versión 1.1.
- Versión 0.1: creación a partir de la necesidad original del envío multicanal y restricción de privacidad clínica.
- Versión 0.2: incorporación de decisiones DEC-007 (manejo de fallas sin reintentos) y DEC-008 (omisión de correo sin error). Eliminación de RNF-006 por fuera de alcance. Remoción de lenguaje técnico en flujos y RNF-005. Remoción del código de entrega del texto de notificación en AC-020. Apertura de OPEN-Q-010 sobre identificación del paciente en canales vinculados a terceros.
- Versión 1.0: incorporación de DEC-009 (identificación del paciente mediante primer nombre e inicial del primer apellido sin incluir cédula ni datos de salud). Cierre de OPEN-Q-010. Cambio de estado a Candidata.
- Versión 1.0 (Aprobada): Aprobación oficial por parte del equipo. Cambio de estado a Aprobada y congelada.
- Versión 1.1: modo Cambio sobre la versión 1.0 aprobada y congelada. Se registra DEC-010: renumeración única de los identificadores de SPEC-003 para que no se crucen con SPEC-001 ni SPEC-002, aprobada por el equipo como excepción a la regla de no renumerar. No cambia el contenido de ningún requisito, regla, flujo, caso límite ni criterio. Cambio de estado a Candidata. Equivalencias aplicadas (identificador anterior → nuevo):
  - HU-001 → HU-003
  - RF-003 → RF-023
  - RF-004 → RF-024
  - RF-005 → RF-025
  - RF-006 → RF-026
  - RF-007 → RF-027
  - RF-008 → RF-028
  - RNF-003 → RNF-005
  - RNF-004 → RNF-006 (elemento eliminado en la versión 0.2; el nuevo identificador solo aparece en el historial)
  - BR-003 → BR-014
  - BR-004 → BR-015
  - BR-005 → BR-016
  - BR-006 → BR-017
  - AC-003 → AC-019
  - AC-004 → AC-020
  - AC-005 → AC-021
  - AC-006 → AC-022
  - AC-007 → AC-023
  - AC-008 → AC-024
  - CL-003 → CL-008
  - CL-004 → CL-009
  - OPEN-Q-003 → OPEN-Q-008
  - OPEN-Q-004 → OPEN-Q-009
  - OPEN-Q-005 → OPEN-Q-010
  - DEC-003 → DEC-007
  - DEC-004 → DEC-008
  - DEC-005 → DEC-009
- Versión 1.1 (Aprobada): modo Aprobación. El equipo aprueba la versión 1.1 Candidata (borradores/SPEC-003/SPEC-003_v1.1.md). Cambio de estado a Aprobada y congelada. Se conservan el número de versión y todo el contenido de la especificación; solo cambian el estado, el modo, esta entrada del historial y el siguiente paso.

## Verificación
- Completitud: cumple. Revisé que estén las 17 secciones de la especificación y que no queden preguntas pendientes, contenido inferido ni elementos "Pendiente de". Las tres preguntas (OPEN-Q-008 a OPEN-Q-010) están respondidas por DEC-007 a DEC-009.
- Consistencia interna: cumple. Comparé RF-023 a RF-028 con BR-014 a BR-017, el flujo principal, A1, E1, E2, CL-008, CL-009 y AC-019 a AC-024; el texto es idéntico al de la versión 1.0 aprobada salvo los identificadores, y cada referencia cruzada (orígenes con DEC-007, DEC-008, DEC-009; preguntas en la sección 2 y en la 15; matriz de la sección 16) apunta al identificador nuevo correcto según la tabla de equivalencias. No quedan referencias a identificadores anteriores fuera de la tabla de equivalencias del historial.
- Consistencia con el contexto: cumple. DEC-010 solo cambia identificadores y no toca ninguna regla de la sección 3. Las decisiones DEC-007, DEC-008 y DEC-009 conservan su texto y siguen siendo compatibles con 3.3 (vinculación vencida no recibe notificaciones, SMS y correo siguen llegando) y 3.6 (envío por todos los medios, sin medicamentos ni diagnósticos).
- No ambigüedad: cumple. Revisé que cada identificador anterior tenga un único identificador nuevo y que no haya dos elementos con el mismo identificador dentro de SPEC-003. El caso de RNF-004 (eliminado) quedó explícito en la tabla de equivalencias.
- Verificabilidad: cumple. Cada RF (RF-023 a RF-028) y cada BR (BR-014 a BR-017) tiene al menos un AC en formato Dado, Cuando, Entonces según la sección 16; CL-008 y CL-009 tienen AC-022 y AC-024.
- Trazabilidad: cumple. Revisé que la matriz de la sección 16 cubra HU-003, los seis RF, las cuatro BR y los dos CL con los identificadores nuevos, y que el historial conserve la equivalencia completa con la numeración anterior. Limitación: no comparé contra los identificadores de SPEC-001 ni SPEC-002 porque mis instrucciones solo me permiten leer el contexto y la SPEC anterior de SPEC-003; la ausencia de cruces depende de la tabla entregada por el equipo.
- No invención: cumple. Apliqué solo las equivalencias entregadas por el equipo, usé el texto de DEC-010 sugerido por el equipo y no agregué ni modifiqué requisitos, reglas, cifras ni comportamientos.
- Delimitación: cumple. La sección 14 conserva lo que está fuera de alcance, con referencia a 3.6, 3.2 y 3.10, sin cambios.

## Siguiente paso
La SPEC-003 versión 1.1 quedó aprobada y congelada.
