<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: ninguno (aprobación sin modelo)
Fecha: 2026-11-02 14:04
Petición: El equipo aprueba la SPEC-001
-->

# SPEC-001. Consentimiento, identidad y derechos del titular - Versión 1.6

Estado: Aprobada y congelada
Modo: Aprobación
Necesidad original: "Consentimiento, identidad y derechos del titular. Antes de pedir cualquier dato, el sistema muestra el aviso de privacidad y exige aceptar el tratamiento de datos con la declaración 'soy el titular o actúo con su autorización', registrando si aceptó el titular o un tercero, la fecha, la hora y el canal. Si no acepta, se informa la atención presencial y no se registra nada. La identidad se verifica con la cédula y un código de un solo uso enviado por SMS al celular registrado en la EPS simulada y, si existe, por correo; el código vence a los 10 minutos y admite 3 intentos. Si falla, se ofrece ruta alterna: nuevo código, orientación para actualizar datos en la EPS o atención presencial. Antes de cargar documentos se pide una autorización separada para datos de salud. Con identidad verificada, el titular puede revocar el consentimiento y pedir la eliminación de sus datos; se cancelan citas, se anulan códigos, se liberan existencias y cupos, se desvinculan los canales y se eliminan los datos personales y de salud. EPIC-001."
Épica: EPIC-001

## Análisis
- Objetivo: gestionar el aviso de privacidad, el consentimiento general y de salud, la verificación de identidad mediante código de un solo uso y el derecho de revocación y eliminación de datos del titular, corrigiendo AC-003 y AC-005 según PREG-004 y PREG-005.
- Alcance inicial: aceptación de aviso de privacidad y consentimiento, verificación de identidad, manejo de intentos y expiración, tratamiento de excepciones de consulta y envío, autorización separada de datos de salud y proceso de revocación con eliminación de datos y liberación de recursos.
- Actores: paciente (titular), persona que actúa por el paciente (tercero), facilitador comunitario, EPS simulada, servicios externos (SMS, correo).
- Contexto aplicable: 3.1, 3.2, 3.3, 3.8, 3.11.

## Modelo de dominio
- Consentimiento: pertenece al paciente o tercero; registra si aceptó el titular o un tercero, la fecha, la hora y el canal. Origen: contexto 3.2.
- Código de un solo uso: pertenece al proceso de verificación de identidad; vigencia de 10 minutos, máximo 3 intentos, anulable al solicitar un nuevo código por debajo del tope de RF-012 (DEC-P78). Origen: contexto 3.2 y DEC-01.
- Autorización de datos de salud: consentimiento separado exigido antes de cargar documentos. Origen: contexto 3.2.
- Revocación: acción del titular con identidad verificada para eliminar datos y liberar recursos. Origen: contexto 3.2 y DEC-02.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- PREG-004 y PREG-005: afecta AC-003 y AC-005. Ambos actualizados para reflejar correctamente la condición inicial y los parámetros de la verificación.
- DEC-P61 y DEC-P68: afecta DEC-01, RF-006, RF-012, BR-003, AC-015, AC-016. Todos actualizados.
- DEC-P78: afecta BR-003, CL-001, RF-012, E2, E3, AC-011, AC-013, AC-015, AC-017. Todos actualizados.
- DEC-P82: afecta RF-012, AC-018 y añade AC-020; ajustes H-012 a H-016 en RF-012, BR-003, CL-001, AC-003, AC-019, sección 7.2 y sección 8. Todos actualizados.

## Preguntas de aclaración
No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Asegurar el cumplimiento normativo mediante la aceptación previa del aviso de privacidad y tratamiento de datos (incluyendo la declaración de titularidad o autorización), la verificación de identidad mediante código de un solo uso con canales reales, el manejo riguroso de límites de tiempo e intentos, la atención de excepciones de red/EPS, la obtención de autorización separada para datos de salud, y la ejecución del derecho de revocación con eliminación de datos y liberación de reservas.

### 2. Contexto
El sistema opera en canales web y bot de Telegram para afiliados de Salud Total y Sanitas en Manizales. Los datos de contacto provienen de la EPS simulada. El tratamiento de datos sensibles exige autorización explícita conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.
Decisiones del equipo:
- DEC-01. No se impone un límite global adicional de generación de códigos de verificación. Se mantienen las reglas de vigencia de 10 minutos y 3 intentos; si se pide un nuevo código mientras otro sigue vigente, el anterior queda anulado y solo vale el último. Responde a OPEN-Q-001. Modificada por DEC-P61, DEC-P68 y DEC-P78: existe un tope configurable de envíos de código por celular y ventana de tiempo.
- DEC-02. Al revocar el consentimiento y eliminar los datos personales y de salud, se conservan únicamente registros de auditoría disociados de la identidad necesarios para la trazabilidad, sin datos personales ni de salud. Se confirma la revocación al titular. Responde a OPEN-Q-002.
- DEC-03. Cuando la persona indica que es un tercero actuando en nombre del titular, el sistema solo registra que aceptó un tercero con la declaración exigida, junto con la fecha, la hora y el canal, sin solicitar cédula ni nombre del tercero. Responde a OPEN-Q-003.
- DEC-P53. El manejo de fallas de las fuentes simuladas durante la prevalidación queda fuera de alcance; esta SPEC conserva RF-010 y AC-012 para la verificación de identidad.
- DEC-P78. Responde PREG-079 y precisa DEC-P68. Con el tope alcanzado, pedir otro código no anula el vigente, que vale hasta vencer o agotar sus intentos; solo se muestra la ruta alterna. Un envío fallido no cuenta para el tope, y un código enviado por SMS y correo cuenta como un solo envío.
- DEC-P82. Responde PREG-080 y precisa DEC-P78. Un envío cuenta para el tope si el código llegó por al menos un canal; solo es fallido si fallan todos los canales.

### 3. Alcance
- Presentación del aviso de privacidad y consentimiento general antes de pedir cualquier dato.
- Verificación de identidad con cédula y código de un solo uso (SMS y correo).
- Control estricto de vigencia (10 minutos) e intentos (máximo 3).
- Gestión de fallos de consulta en EPS y fallos de envío de SMS/correo.
- Gestión de rutas alternas ante fallos de verificación (nuevo código salvo con el tope de RF-012 alcanzado, orientación EPS, atención presencial).
- Solicitud de autorización separada para datos de salud antes de cargar documentos.
- Revocación de consentimiento y eliminación de datos con cancelación de citas, anulación de códigos, liberación de existencias y cupos, y desvinculación de canales.

### 4. Actores e historias de usuario
Actores: paciente (titular), persona que actúa por el paciente (tercero), facilitador comunitario, EPS simulada, servicios externos (SMS, correo).
- HU-001. Como usuario que ingresa al sistema, quiero aceptar el aviso de privacidad con la declaración de titularidad o autorización para poder iniciar cualquier gestión.
- HU-002. Como usuario, quiero verificar mi identidad mediante un código de un solo uso enviado a mis medios de contacto para acceder a mis datos de la EPS.
- HU-003. Como titular con identidad verificada, quiero revocar mi consentimiento y eliminar mis datos personales y de salud, cancelando mis reservas y desvinculando mis canales.

### 5. Requisitos funcionales
- RF-001. El sistema debe mostrar el aviso de privacidad y exigir la aceptación del tratamiento de datos con la declaración "soy el titular o actúo con su autorización" antes de pedir cualquier dato. Origen: contexto 3.2.
- RF-002. El sistema debe registrar si la aceptación fue realizada por el titular o por un tercero, indicando la fecha, la hora y el canal, sin solicitar cédula ni nombre del tercero. Origen: contexto 3.2 y DEC-03.
- RF-003. Si el usuario no acepta el tratamiento de datos, el sistema debe informar la atención presencial y no registrar ningún dato. Origen: contexto 3.2.
- RF-004. El sistema debe verificar la identidad solicitando la cédula y enviando un código de un solo uso por SMS al celular registrado en la EPS simulada y, si existe, por correo electrónico. Origen: contexto 3.2.
- RF-005. El código de verificación debe tener una vigencia de 10 minutos y admitir máximo 3 intentos de ingreso. Origen: contexto 3.2 y DEC-01.
- RF-006. Si el código vence o se agotan los 3 intentos, el sistema debe ofrecer una ruta alterna que incluye pedir un código nuevo, recibir orientación para actualizar datos en la EPS o acudir a la atención presencial. La opción de pedir un código nuevo no se ofrece cuando se alcanzó el tope de RF-012. Origen: contexto 3.2.
- RF-007. El sistema debe exigir una autorización separada para el tratamiento de datos de salud antes de permitir la carga de documentos de fórmulas o historia clínica. Origen: contexto 3.2.
- RF-008. El sistema debe permitir que el titular con identidad verificada revoque el consentimiento y solicite la eliminación de sus datos. Origen: contexto 3.2.
- RF-009. Ante la revocación del consentimiento, el sistema debe cancelar las citas activas, anular los códigos de entrega, liberar existencias y cupos reservados, desvincular los canales (Telegram y web), eliminar los datos personales y de salud tratados, conservar únicamente registros de auditoría disociados y confirmar la revocación al titular. Origen: contexto 3.2, 3.3 y DEC-02.
- RF-010. Ante fallo de consulta en la EPS simulada (cédula no registrada o indisponibilidad del servicio), el sistema debe notificar el inconveniente y orientar al usuario a verificar sus datos en la EPS o acudir a atención presencial. Origen: contexto 3.2 y 3.8.
- RF-011. Ante fallo en los servicios externos de envío de SMS o correo, el sistema debe notificar la falla en la entrega del mensaje y permitir reintentar el envío o dirigirse a la atención presencial. Origen: contexto 2.3 y 3.2.
- RF-012. El sistema debe limitar el envío de códigos con un tope configurable por celular y ventana de tiempo. Al alcanzarlo, no envía más códigos y presenta la ruta alterna solo con la orientación para actualizar datos en la EPS y la atención presencial, sin la opción de pedir un código nuevo. No rechaza una solicitud por tiempo de espera. El valor del tope y de la ventana lo fija el equipo. Un envío fallido no cuenta para el tope, y un código enviado por SMS y por correo cuenta como un solo envío (DEC-P78). Un envío cuenta para el tope si el código llegó por al menos un canal; solo es fallido si fallan todos los canales (DEC-P82). Origen: DEC-P61, DEC-P68, DEC-P78, DEC-P82.

### 6. Requisitos no funcionales
- RNF-001. Canal de notificación. El envío de SMS y correo electrónico para el código de un solo uso debe utilizar los servicios externos reales configurados. Origen: contexto 2.3 y 3.2.
- RNF-002. Seguridad de datos. Los datos personales y de salud tratados deben ser eliminados de forma segura al revocar el consentimiento, reteniendo únicamente registros de auditoría disociados. Origen: contexto 3.2 y DEC-02.

### 7. Reglas de negocio y estados del proceso

#### 7.1. Reglas de negocio
- BR-001. No se realiza ningún registro de datos personales ni de salud si el usuario no acepta el aviso de privacidad. Origen: contexto 3.2.
- BR-002. La identidad se verifica estrictamente con la cédula y el código de un solo uso validado contra los datos de la EPS simulada. Origen: contexto 2.3 y 3.2.
- BR-003. Si el usuario solicita un nuevo código mientras otro sigue vigente, el código anterior queda anulado de inmediato y solo es válido el último emitido. Con el tope de RF-012 alcanzado, la petición no anula el código vigente, que sigue valiendo hasta vencer o agotar sus intentos (DEC-P78). Origen: contexto 3.2, DEC-01, DEC-P78.
- BR-004. La revocación del consentimiento por parte del titular implica la eliminación total de sus datos personales y de salud del sistema, liberando de forma inmediata cualquier recurso reservado (citas, cupos y existencias) y desvinculando todos los canales asociados. Origen: contexto 3.2 y DEC-02.
- BR-005. Semántica de intentos y vigencia: el código emitido es válido únicamente si se ingresa dentro de los 10 minutos exactos transcurridos desde su generación y en un máximo de 3 intentos. Los intentos 1 y 2 fallidos permiten reintentar indicando los intentos restantes; el 3er intento fallido o el transcurso de 10 minutos (10m 00s o más) inactivan el código y activan obligatoriamente la ruta alterna. Origen: contexto 3.2 y DEC-01.

#### 7.2. Estados y transiciones
- Estado: Sin Consentimiento
  - Transición a "Pendiente de Verificación": provocada por Usuario al aceptar el aviso de privacidad.
  - Transición a "Rechazado": provocada por Usuario al no aceptar el aviso (estado final en canal digital; deriva a Atención Presencial).
- Estado: Pendiente de Verificación
  - Transición a "Código Emitido": provocada por Sistema al validar cédula en EPS simulada y enviar código por SMS/correo si el celular no alcanzó el tope de RF-012; con el tope alcanzado, se aplica AC-015.
  - Transición a "Error EPS / Orientación": provocada por Sistema si la cédula no existe en la EPS simulada o el servicio falla.
- Estado: Código Emitido
  - Transición a "Identidad Verificada": provocada por Usuario al ingresar el código correcto dentro de los 10 minutos y en un intento <= 3.
  - Transición a "Código Emitido (Intento Incrementado)": provocada por Usuario al ingresar código incorrecto en los intentos 1 o 2 dentro de los 10 minutos.
  - Transición a "Expirado / Agotado": provocada por Sistema/Usuario al fallar el 3er intento o superar los 10 minutos (deriva a Ruta Alterna).
  - Transición a "Código Emitido (Nuevo)": provocada por Usuario al solicitar nuevo código con el celular por debajo del tope de RF-012 (anula el anterior). Con el tope alcanzado no hay transición y el código vigente conserva su estado (DEC-P78).
- Estado: Identidad Verificada
  - Transición a "Autorización Salud Registrada": provocada por Usuario al aceptar la autorización separada para datos de salud.
  - Transición a "Revocado": provocada por Titular al solicitar la revocación de consentimiento (estado final; elimina datos y libera recursos).
- Estado: Autorización Salud Registrada
  - Transición a "Revocado": provocada por Titular al solicitar la revocación de consentimiento (estado final).

### 8. Flujo principal
1. El usuario accede a la aplicación web o al bot de Telegram.
2. El sistema muestra el aviso de privacidad y la opción para aceptar el tratamiento de datos con la declaración de titularidad o autorización.
3. El usuario acepta el aviso indicando si actúa como titular o como tercero.
4. El sistema registra la aceptación, la fecha, la hora y el canal.
5. El usuario ingresa su número de cédula.
6. El sistema consulta la EPS simulada para obtener el celular y correo registrados.
7. El sistema genera y envía el código de un solo uso por SMS y correo (si existe) si el celular no alcanzó el tope de RF-012; si lo alcanzó, se aplica AC-015.
8. El usuario ingresa el código recibido en el sistema.
9. El sistema valida el código comprobando que el tiempo transcurrido sea menor a 10 minutos y que el intento sea el 1, 2 o 3.
10. El sistema confirma que el código es correcto, valida exitosamente la identidad y habilita el acceso a la gestión.
11. Antes de cargar documentos, el sistema solicita y registra la autorización separada para el tratamiento de datos de salud.
12. En cualquier momento posterior con identidad verificada, el titular puede solicitar la revocación del consentimiento y la eliminación de sus datos.
13. El sistema procesa la revocación cancelando citas, anulando códigos, liberando cupos y existencias, desvinculando canales, eliminando los datos personales y de salud, conservando registros de auditoría disociados y enviando confirmación al titular.

### 9. Flujos alternativos y de excepción
- A1. El usuario rechaza el aviso de privacidad.
  1. El sistema informa que debe acudir a la atención presencial.
  2. El sistema no registra ningún dato y finaliza la sesión.
- E1. El código ingresado es incorrecto en el intento 1 o 2 (dentro de los 10 minutos).
  1. El sistema informa el error, indica los intentos restantes (2 o 1) y permite reintentar el ingreso con el mismo código.
- E2. El código expira (pasan 10 minutos o más) o se agota el 3er intento fallido.
  1. El sistema inactiva el código actual y bloquea nuevos intentos sobre dicho código.
  2. El sistema muestra la ruta alterna: solicitar nuevo código (salvo con el tope de RF-012 alcanzado), orientación para actualizar datos en la EPS o atención presencial.
- E3. Solicitud de nuevo código con código previo activo.
  1. Si el celular está por debajo del tope de RF-012, el sistema anula de inmediato el código previo; con el tope alcanzado, el código previo sigue vigente (DEC-P78).
  2. El sistema genera, emite y envía un nuevo código restableciendo el contador de intentos y el tiempo de 10 minutos. Con el tope de RF-012 alcanzado, no emite código nuevo y se aplica AC-017.
- E4. Cédula no encontrada o falla en el servicio de la EPS simulada.
  1. El sistema informa que no fue posible validar la cédula en la EPS simulada.
  2. El sistema presenta orientación para dirigirse a la EPS o acudir a la atención presencial.
- E5. Fallo en el envío de SMS o correo por los servicios externos reales.
  1. El sistema detecta la falla del servicio de mensajería y notifica la novedad al usuario.
  2. El sistema ofrece la opción de reintentar el envío del código o acudir a la atención presencial.

### 10. Casos límite
- CL-001. Solicitud simultánea de códigos: si el usuario solicita un código nuevo antes de ingresar el anterior, el código previo queda invalidado de inmediato y solo el nuevo es aceptado. Con el tope de RF-012 alcanzado, la petición no anula el código vigente, que sigue valiendo hasta vencer o agotar sus intentos (DEC-P78). Origen: contexto 3.2, DEC-01, DEC-P78.
- CL-002. Revocación con citas activas: si el titular revoca el consentimiento teniendo citas reservadas, el sistema cancela las citas, libera los cupos y las existencias para otros usuarios antes de borrar los datos. Origen: contexto 3.2 y 3.5.
- CL-003. Ingreso de código en el límite de tiempo de 10 minutos: un código correcto ingresado a los 9 minutos y 59 segundos es validado exitosamente; si se ingresa a los 10 minutos exactos (10m 00s) o después, el sistema lo rechaza por expiración y despliega la ruta alterna. Origen: contexto 3.2.
- CL-004. Comportamiento según el número de intentos: el 1er y 2do intento fallidos permiten continuar la digitación indicando intentos restantes; el 3er intento fallido bloquea definitivamente ese código y deriva automáticamente a la ruta alterna. Cualquier intento posterior sobre ese código inactivo es rechazado. Origen: contexto 3.2 y DEC-01.

### 11. Criterios de aceptación
- AC-001. Dado un nuevo usuario en la web o Telegram, cuando intenta realizar cualquier acción, entonces el sistema muestra obligatoriamente el aviso de privacidad y la declaración de titularidad o autorización antes de permitir ingresar ningún dato.
- AC-002. Dado que el usuario no acepta el aviso de privacidad, cuando selecciona rechazar, entonces el sistema informa la atención presencial y no registra ningún dato en el sistema.
- AC-003. Dado un usuario con identidad ya verificada y un código de verificación activo de un intento previo, cuando solicita un nuevo código estando por debajo del tope de RF-012, entonces el sistema emite el nuevo código y el anterior queda anulado de inmediato. Origen: RF-006, BR-003, PREG-004.
- AC-004. Dado un usuario que ingresa su cédula registrada en la EPS, cuando ingresa el código correcto dentro de los 10 minutos y en uno de los 3 intentos permitidos, entonces el sistema valida exitosamente su identidad y habilita el acceso a la gestión.
- AC-005. Dado un usuario con identidad verificada que se dispone a cargar documentos, cuando el sistema presenta la solicitud de carga, entonces exige explícitamente la aceptación de la autorización separada para datos de salud antes de continuar. Origen: RF-007, PREG-005.
- AC-006. Dado que el usuario actúa como tercero en nombre del titular, cuando acepta el tratamiento de datos, entonces el sistema registra la aceptación como tercero con fecha, hora y canal, sin exigir la cédula ni el nombre del tercero.
- AC-007. Dado que el titular tiene identidad verificada, cuando solicita la revocación del consentimiento, entonces el sistema elimina sus datos personales y de salud, conserva únicamente los registros de auditoría disociados y confirma la revocación.
- AC-008. Dado que el titular revoca el consentimiento teniendo citas y reservas activas, cuando se ejecuta la eliminación, entonces se cancelan las citas, se anulan los códigos de entrega, se liberan las existencias y cupos y se desvinculan los canales.
- AC-009. Dado un código emitido a las 10:00:00, cuando el usuario ingresa el código correcto a las 10:09:59, entonces el sistema valida la identidad exitosamente; cuando lo ingresa a las 10:10:00 o posterior, entonces el sistema rechaza el código por expirado y muestra la ruta alterna.
- AC-010. Dado que el usuario ingresa un código incorrecto en el 1er o 2do intento dentro de los 10 minutos, cuando el sistema procesa el fallo, entonces indica que el código es erróneo, muestra los intentos restantes y permite reintentar la digitación.
- AC-011. Dado que el usuario comete un 3er intento fallido de ingreso de código, cuando el sistema registra el fallo, entonces inactiva el código actual y muestra de inmediato las opciones de la ruta alterna (nuevo código salvo con el tope de RF-012 alcanzado, orientación EPS, atención presencial).
- AC-012. Dado que la cédula ingresada no existe en la EPS simulada o la EPS no responde, cuando el sistema realiza la consulta, entonces notifica la novedad y presenta la orientación para dirigirse a la EPS o acudir a la atención presencial.
- AC-013. Dado un fallo en el servicio externo de SMS o correo al enviar el código, cuando el sistema detecta la falla de entrega, entonces informa la novedad al usuario y ofrece las opciones de reintentar el envío o acudir a atención presencial. Un envío fallido no cuenta para el tope de RF-012 (DEC-P78).
- AC-015. Dado un celular que alcanzó el tope de envíos de su ventana de tiempo, cuando se solicita otro código para una cédula cuyo celular registrado es ese, entonces el sistema no envía ningún código y presenta la ruta alterna con la orientación para actualizar datos en la EPS y la atención presencial, sin la opción de pedir un código nuevo.
- AC-016. Dado un celular por debajo del tope, cuando se solicita un código nuevo mientras otro sigue vigente, entonces el sistema envía el nuevo y anula el anterior de inmediato, sin rechazar la solicitud por tiempo de espera.
- AC-017. Dado un celular que alcanzó el tope y un código todavía vigente, cuando se solicita otro código, entonces el sistema no envía ninguno, muestra la ruta alterna sin la opción de pedir un código nuevo, y el código vigente sigue siendo aceptado. Origen: BR-003, RF-012, DEC-P78.
- AC-018. Dado un celular a un envío del tope de RF-012, cuando fallan todos los canales al enviar el código, entonces ese envío no cuenta para el tope y la siguiente petición de código se envía. Origen: RF-012, DEC-P78, DEC-P82.
- AC-019. Dado un celular a dos envíos del tope de RF-012 y un paciente con celular y correo registrados, cuando el sistema envía un código por SMS y por correo, entonces cuenta un solo envío y la siguiente petición de código todavía se envía. Origen: RF-012, DEC-P78.
- AC-020. Dado un celular a un envío del tope de RF-012 y un paciente con celular y correo registrados, cuando el SMS falla y el correo llega, entonces ese envío cuenta para el tope y la siguiente petición muestra la ruta alterna sin la opción de pedir un código nuevo. Origen: RF-012, DEC-P82.

### 12. Dependencias
- EPS simulada (fuente de datos de afiliación y contacto).
- Servicios externos reales de mensajería (SMS y correo).
- Módulo de gestión de citas, inventario y canales para la liberación y desvinculación al revocar.

### 13. Restricciones
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites de autorización. Origen: contexto 3.11.
- El proyecto cuenta con un equipo de cuatro personas y aproximadamente 8 semanas. Origen: contexto 3.9.
- El equipo no tiene acceso a los sistemas de Disfarma y trabaja desde afuera. Origen: contexto 3.9.

### 14. Fuera de alcance
- Registro de pacientes y creación de cuentas propias por parte del sistema (contexto 3.10).
- Actualización de datos de contacto o afiliación dentro del sistema (la actualización se realiza en la EPS, el sistema solo orienta; contexto 3.2 y 3.10).
- Modificación de fórmulas médicas (contexto 3.10).
- Mecanismo de almacenamiento y disociación segura de los registros de auditoría: tema para arquitectura. Origen: RF-009.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-01)
- OPEN-Q-002: Respondida (DEC-02)
- OPEN-Q-003: Respondida (DEC-03)

### 16. Trazabilidad
- HU-001: RF-001, RF-002, RF-003; BR-001; AC-001, AC-002, AC-006.
- HU-002: RF-004, RF-005, RF-006, RF-007, RF-010, RF-011, RF-012; BR-002, BR-003, BR-005; AC-003, AC-004, AC-005, AC-009, AC-010, AC-011, AC-012, AC-013, AC-015, AC-016, AC-017, AC-018, AC-019, AC-020.
- HU-003: RF-008, RF-009; BR-004; AC-007, AC-008.

- RF-001: Origen: contexto 3.2; verificado por AC-001.
- RF-002: Origen: contexto 3.2 y DEC-03; verificado por AC-006.
- RF-003: Origen: contexto 3.2; verificado por AC-002.
- RF-004: Origen: contexto 3.2; verificado por AC-004.
- RF-005: Origen: contexto 3.2 y DEC-01; verificado por AC-004, AC-009, AC-010, AC-011.
- RF-006: Origen: contexto 3.2; verificado por AC-003, AC-009, AC-011, AC-012, AC-013, AC-015, AC-017.
- RF-007: Origen: contexto 3.2; verificado por AC-005.
- RF-008: Origen: contexto 3.2; verificado por AC-007.
- RF-009: Origen: contexto 3.2, 3.3 y DEC-02; verificado por AC-007, AC-008.
- RF-010: Origen: contexto 3.2 y 3.8; verificado por AC-012.
- RF-011: Origen: contexto 2.3 y 3.2; verificado por AC-013.
- RF-012: Origen: DEC-P61, DEC-P68, DEC-P78, DEC-P82; verificado por AC-015, AC-016, AC-017, AC-018, AC-019, AC-020.

- RNF-001: Origen: contexto 2.3 y 3.2; verificado con pruebas de integración con los servicios externos reales de SMS y correo electrónico.
- RNF-002: Origen: contexto 3.2 y DEC-02; verificado con inspección de almacén de datos tras revocación para confirmar ausencia de PII/datos de salud y persistencia de registros de auditoría disociados.

- BR-001: Origen: contexto 3.2; verificado por AC-002.
- BR-002: Origen: contexto 2.3 y 3.2; verificado por AC-004.
- BR-003: Origen: contexto 3.2, DEC-01, DEC-P78; verificado por AC-003, AC-016, AC-017.
- BR-004: Origen: contexto 3.2 y DEC-02; verificado por AC-007, AC-008.
- BR-005: Origen: contexto 3.2 y DEC-01; verificado por AC-009, AC-010, AC-011.

- CL-001: Origen: contexto 3.2, DEC-01, DEC-P78; verificado por AC-003, AC-017.
- CL-002: Origen: contexto 3.2 y 3.5; verificado por AC-008.
- CL-003: Origen: contexto 3.2; verificado por AC-009.
- CL-004: Origen: contexto 3.2 y DEC-01; verificado por AC-010, AC-011.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y contexto.
- Versión 1.0: incorporación de las respuestas del equipo a OPEN-Q-001, OPEN-Q-002 y OPEN-Q-003 (DEC-01, DEC-02, DEC-03), actualización de requisitos, flujos, casos límite y criterios de aceptación, pasando a estado Candidata.
- Versión 1.1: resolución de hallazgos H-001 a H-005 (informe QA): adición de AC de éxito para verificación de identidad (RF-004/BR-002), definición de criterios en el límite de vigencia de 10 minutos (CL-003), semántica detallada de los 3 intentos (BR-005, CL-004), excepciones de consulta EPS y envío de mensajes (RF-010, RF-011), inclusión de estados y transiciones en la especificación y corrección completa de trazabilidad en la sección 16. Aprobada y congelada por el equipo.
- Versión 1.2: incorporación de DEC-P61 y DEC-P68 (tope configurable de envíos de código por celular y ventana de tiempo, adición de RF-012, AC-015, AC-016, modificación de DEC-01 y RF-006), incorporación de DEC-P53 y actualización de trazabilidad en sección 16.
- Versión 1.3: incorporación de DEC-P78 (ajustes al tope de envíos de RF-012 y validez de código previo), ajustes de redacción H-003, H-005 y adición de AC-017. No se usa el identificador AC-014: el código v0 del módulo identidad ya cita un AC-014 inexistente.
- Versión 1.3, ajuste de edición sin cambio de reglas: se corrigió una palabra en inglés en Verificación.
- Versión 1.4: correcciones de edición para aplicar DEC-P78 de forma completa (ajustes a AC-003, E3, sección 7.2, sección 3, modelo de dominio, DEC-01, adición de AC-018 y AC-019, y actualización de trazabilidad).
- Versión 1.4, ajuste de edición sin cambio de reglas: se corrigió una palabra en inglés en Verificación.
- Versión 1.5: incorporación de DEC-P82, resolución de hallazgos H-012 a H-016 (ajustes a RF-012, BR-003, CL-001, AC-003, AC-018, AC-019, adición de AC-020, actualización de flujo principal 8.7 y transiciones 7.2, y actualización de trazabilidad).
- Versión 1.5, ajuste de edición sin cambio de reglas: se corrigió una palabra en inglés en Verificación.
- Versión 1.6: actualización y corrección de AC-003 y AC-005 según PREG-004 y PREG-005.
- Versión 1.6 (aprobación): aprobada y congelada por el equipo, sin cambios de contenido.

## Verificación
- Completitud: cumple. La especificación cubre todos los requisitos, estados, flujos, excepciones, casos límite y trazabilidad completa.
- Consistencia interna: cumple. Todos los criterios de aceptación actualizados (AC-003 y AC-005) son consistentes con RF-006, RF-007 y BR-003.
- Consistencia con el contexto: cumple. Se alinea exactamente con las reglas de negocio y restricciones del producto (sección 3).
- No ambigüedad: cumple. Los plazos, intentos y conductas esperadas están explicitados de manera unívoca.
- Verificabilidad: cumple. Todos los AC están definidos en formato Dado/Cuando/Entonces directamente comprobables.
- Cobertura de actores: cumple. Se provee HU explícita para cada tipo de actor con objetivo propio.
- Cobertura de AC: cumple. Todos los RF, BR y CL tienen ACs de verificación asociados.
- Trazabilidad: cumple. Cada elemento está registrado en la sección 16 con su correspondiente origen y verificador.
- No invención: cumple. Todos los comportamientos provienen de la necesidad, el contexto o las decisiones del equipo.
- Delimitación: cumple. Mantienen estrictamente la separación respecto de las decisiones de construcción y elementos fuera de alcance.

## Siguiente paso
La SPEC-001 versión 1.6 quedó aprobada y congelada.
