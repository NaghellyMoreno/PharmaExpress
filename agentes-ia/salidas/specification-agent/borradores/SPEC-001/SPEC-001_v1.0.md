<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:53
Petición: FASE=RESPUESTAS

Necesidad original: Consentimiento, identidad y derechos del titular. Antes de pedir cualquier dato, el sistema muestra el aviso de privacidad y exige aceptar el tratamiento de datos con la declaración "soy el titular o actúo con su autorización", registrando si aceptó el titular o un tercero, la fecha, la hora y el canal. Si no acepta, se informa la atención presencial y no se registra nada. La identidad se verifica con la cédula y un código de un solo uso enviado por SMS al celular registrado en la EPS simulada y, si existe, por correo; el código vence a los 10 minutos y admite 3 intentos. Si falla, se ofrece ruta alterna: nuevo código, orientación para actualizar datos en la EPS o atención presencial. Antes de cargar documentos se pide una autorización separada para datos de salud. Con identidad verificada, el titular puede revocar el consentimiento y pedir la eliminación de sus datos; se cancelan citas, se anulan códigos, se liberan existencias y cupos, se desvinculan los canales y se eliminan los datos personales y de salud. EPIC-001.

Preguntas y respuestas del equipo:
- OPEN-Q-001. Cuando se ofrece la ruta alterna tras fallar la verificación de identidad, ¿el sistema permite reintentar inmediatamente con un nuevo código tantas veces como se quiera, o existe un límite global de generación de códigos por tiempo o por número de cédula?
  Respuesta: No se impone un límite global adicional en el prototipo. Se mantienen las reglas aprobadas del código: vence a los 10 minutos y admite 3 intentos (DEC-07). Si la persona pide un nuevo código mientras otro sigue vigente, el anterior queda anulado y solo vale el último (CL-04). La ruta alterna también ofrece orientación para actualizar datos en la EPS y atención presencial.
- OPEN-Q-002. Respecto a la revocación del consentimiento y eliminación de datos, cuando se eliminan los datos personales y de salud del titular, ¿qué registro queda en el sistema (por ejemplo, para auditoría o estadísticas) o se borra absolutamente todo sin dejar rastro?
  Respuesta: Se eliminan los datos personales y de salud tratados por el sistema. Se conservan únicamente los registros de auditoría disociados de la identidad, necesarios para la trazabilidad que exige RNF-08, sin datos personales ni de salud. La revocación se confirma al titular.
- OPEN-Q-003. Cuando la persona indica que es un tercero actuando en nombre del titular, ¿el sistema le solicita algún dato adicional de identificación del tercero (como su cédula o nombre), o solo registra que aceptó un tercero con la declaración exigida?
  Respuesta: Solo registra que aceptó un tercero con la declaración exigida, junto con la fecha, la hora y el canal. No solicita cédula ni nombre del tercero, porque el sistema no distingue entre paciente, cuidador, tutor o facilitador (DEC-09, DEC-11).
-->

# SPEC-001. Consentimiento, identidad y derechos del titular - Versión 1.0

Estado: Candidata
Modo: Iteración
Necesidad original: "Consentimiento, identidad y derechos del titular. Antes de pedir cualquier dato, el sistema muestra el aviso de privacidad y exige aceptar el tratamiento de datos con la declaración 'soy el titular o actúo con su autorización', registrando si aceptó el titular o un tercero, la fecha, la hora y el canal. Si no acepta, se informa la atención presencial y no se registra nada. La identidad se verifica con la cédula y un código de un solo uso enviado por SMS al celular registrado en la EPS simulada y, si existe, por correo; el código vence a los 10 minutos y admite 3 intentos. Si falla, se ofrece ruta alterna: nuevo código, orientación para actualizar datos en la EPS o atención presencial. Antes de cargar documentos se pide una autorización separada para datos de salud. Con identidad verificada, el titular puede revocar el consentimiento y pedir la eliminación de sus datos; se cancelan citas, se anulan códigos, se liberan existencias y cupos, se desvinculan los canales y se eliminan los datos personales y de salud. EPIC-001."
Épica: EPIC-001

## Análisis
- Objetivo: gestionar el aviso de privacidad, el consentimiento general y de salud, la verificación de identidad mediante código de un solo uso y el derecho de revocación y eliminación de datos del titular.
- Alcance inicial: aceptación de aviso de privacidad y consentimiento, verificación de identidad, autorización separada de datos de salud y proceso de revocación con eliminación de datos y liberación de recursos.
- Actores: paciente (titular), persona que actúa por el paciente (tercero), facilitador comunitario, EPS simulada, servicios externos (SMS, correo).
- Contexto aplicable: 3.1, 3.2, 3.3, 3.8, 3.11.

## Modelo de dominio
- Consentimiento: pertenece al paciente o tercero; registra si aceptó el titular o un tercero, la fecha, la hora y el canal. Origen: contexto 3.2.
- Código de un solo uso: pertenece al proceso de verificación de identidad; vigencia de 10 minutos, máximo 3 intentos, anulable al solicitar uno nuevo. Origen: contexto 3.2 y DEC-01.
- Autorización de datos de salud: consentimiento separado exigido antes de cargar documentos. Origen: contexto 3.2.
- Revocación: acción del titular con identidad verificada para eliminar datos y liberar recursos. Origen: contexto 3.2 y DEC-02.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- DEC-01: afecta BR-003, CL-001 y AC-003. Todos actualizados.
- DEC-02: afecta RF-010, BR-004 y AC-008. Todos actualizados.
- DEC-03: afecta RF-002, BR-001 y AC-001. Todos actualizados.

## Preguntas de aclaración
- No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Asegurar el cumplimiento normativo mediante la aceptación previa del aviso de privacidad y tratamiento de datos (incluyendo la declaración de titularidad o autorización), la verificación de identidad mediante código de un solo uso con canales reales, la obtención de autorización separada para datos de salud, y la ejecución del derecho de revocación con eliminación de datos y liberación de reservas.

### 2. Contexto
El sistema opera en canales web y bot de Telegram para afiliados de Salud Total y Sanitas en Manizales. Los datos de contacto provienen de la EPS simulada. El tratamiento de datos sensibles exige autorización explícita conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.
Decisiones del equipo:
- DEC-01. No se impone un límite global adicional de generación de códigos de verificación. Se mantienen las reglas de vigencia de 10 minutos y 3 intentos; si se pide un nuevo código mientras otro sigue vigente, el anterior queda anulado y solo vale el último. Responde a OPEN-Q-001.
- DEC-02. Al revocar el consentimiento y eliminar los datos personales y de salud, se conservan únicamente registros de auditoría disociados de la identidad necesarios para la trazabilidad, sin datos personales ni de salud. Se confirma la revocación al titular. Responde a OPEN-Q-002.
- DEC-03. Cuando la persona indica que es un tercero actuando en nombre del titular, el sistema solo registra que aceptó un tercero con la declaración exigida, junto con la fecha, la hora y el canal, sin solicitar cédula ni nombre del tercero. Responde a OPEN-Q-003.

### 3. Alcance
- Presentación del aviso de privacidad y consentimiento general antes de pedir cualquier dato.
- Verificación de identidad con cédula y código de un solo uso (SMS y correo).
- Gestión de rutas alternas ante fallos de verificación (nuevo código, orientación EPS, atención presencial).
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
- RF-005. El código de verificación debe tener una vigencia de 10 minutos y admitir máximo 3 intentos de ingreso. Origen: contexto 3.2.
- RF-006. Si el código vence o se agotan los 3 intentos, el sistema debe ofrecer una ruta alterna que incluye pedir un código nuevo, recibir orientación para actualizar datos en la EPS o acudir a la atención presencial. Origen: contexto 3.2.
- RF-007. El sistema debe exigir una autorización separada para el tratamiento de datos de salud antes de permitir la carga de documentos de fórmulas o historia clínica. Origen: contexto 3.2.
- RF-008. El sistema debe permitir que el titular con identidad verificada revoque el consentimiento y solicite la eliminación de sus datos. Origen: contexto 3.2.
- RF-009. Ante la revocación del consentimiento, el sistema debe cancelar las citas activas, anular los códigos de entrega, liberar existencias y cupos reservados, desvincular los canales (Telegram y web), eliminar los datos personales y de salud tratados, conservar únicamente registros de auditoría disociados de la identidad y confirmar la revocación al titular. Origen: contexto 3.2, 3.3 y DEC-02.

### 6. Requisitos no funcionales
- RNF-001. Canal de notificación. El envío de SMS y correo electrónico para el código de un solo uso debe utilizar los servicios externos reales configurados. Origen: contexto 2.3 y 3.2.
- RNF-002. Seguridad de datos. Los datos personales y de salud tratados deben ser eliminados de forma segura al revocar el consentimiento, reteniendo únicamente registros de auditoría disociados. Origen: contexto 3.2 y DEC-02.

### 7. Reglas de negocio
- BR-001. No se realiza ningún registro de datos personales ni de salud si el usuario no acepta el aviso de privacidad. Origen: contexto 3.2.
- BR-002. La identidad se verifica estrictamente con la cédula y el código de un solo uso validado contra los datos de la EPS simulada. Origen: contexto 2.3 y 3.2.
- BR-003. Si el usuario solicita un nuevo código mientras otro sigue vigente, el código anterior queda anulado de inmediato y solo es válido el último emitido. Origen: contexto 3.2 y DEC-01.
- BR-004. La revocación del consentimiento por parte del titular implica la eliminación total de sus datos personales y de salud del sistema, liberando de forma inmediata cualquier recurso reservado (citas, cupos y existencias) y desvinculando todos los canales asociados. Origen: contexto 3.2 y DEC-02.

### 8. Flujo principal
1. El usuario accede a la aplicación web o al bot de Telegram.
2. El sistema muestra el aviso de privacidad y la opción para aceptar el tratamiento de datos con la declaración de titularidad o autorización.
3. El usuario acepta el aviso indicando si actúa como titular o como tercero.
4. El sistema registra la aceptación, la fecha, la hora y el canal.
5. El usuario ingresa su número de cédula.
6. El sistema consulta la EPS simulada para obtener el celular y correo registrados.
7. El sistema genera y envía el código de un solo uso por SMS y correo (si existe).
8. El usuario ingresa el código recibido en el sistema.
9. El sistema valida el código dentro del plazo de 10 minutos y dentro de los 3 intentos permitidos.
10. Verificada la identidad, el sistema habilita el acceso a la gestión de solicitudes y documentos.
11. Antes de cargar documentos, el sistema solicita y registra la autorización separada para el tratamiento de datos de salud.
12. En cualquier momento posterior con identidad verificada, el titular puede solicitar la revocación del consentimiento y la eliminación de sus datos.
13. El sistema procesa la revocación cancelando citas, anulando códigos, liberando cupos y existencias, desvinculando canales, eliminando los datos personales y de salud, conservando registros de auditoría disociados y enviando confirmación al titular.

### 9. Flujos alternativos y de excepción
- A1. El usuario rechaza el aviso de privacidad.
  1. El sistema informa que debe acudir a la atención presencial.
  2. El sistema no registra ningún dato y finaliza la sesión.
- E1. El código de verificación expira (pasan más de 10 minutos) o se agotan los 3 intentos.
  1. El sistema bloquea el intento actual y muestra la ruta alterna.
  2. El usuario elige solicitar un nuevo código, recibir orientación para actualizar datos en la EPS o acudir a la atención presencial.
- E2. El usuario solicita un nuevo código mientras el anterior aún está vigente.
  1. El sistema anula el código anterior.
  2. El sistema emite y envía un nuevo código que reemplaza al anterior.

### 10. Casos límite
- CL-001. Solicitud simultánea de códigos: si el usuario solicita un código nuevo antes de ingresar el anterior, el código previo queda invalidado de inmediato y solo el nuevo es aceptado. Origen: contexto 3.2 y DEC-01.
- CL-002. Revocación con citas activas: si el titular revoca el consentimiento teniendo citas reservadas, el sistema cancela las citas, libera los cupos y las existencias para otros usuarios antes de borrar los datos. Origen: contexto 3.2 y 3.5.

### 11. Criterios de aceptación
- AC-001. Dado un nuevo usuario en la web o Telegram, cuando intenta realizar cualquier acción, entonces el sistema muestra obligatoriamente el aviso de privacidad y la declaración de titularidad o autorización antes de permitir ingresar ningún dato.
- AC-002. Dado que el usuario no acepta el aviso de privacidad, cuando selecciona rechazar, entonces el sistema informa la atención presencial y no registra ningún dato en el sistema.
- AC-003. Dado que el usuario solicita un código de verificación y posteriormente pide otro antes de que venza el primero, cuando intenta usar el código anterior, entonces el sistema lo rechaza por estar anulado.
- AC-004. Dado que el usuario agota los 3 intentos o vence el plazo de 10 minutos del código, cuando el sistema detecta el fallo, entonces ofrece la ruta alterna con opción de nuevo código, orientación EPS o atención presencial.
- AC-005. Dado que el usuario tiene la identidad verificada y se dispone a cargar documentos, cuando el sistema lo solicita, entonces exige la aceptación de la autorización separada para datos de salud.
- AC-006. Dado que el usuario actúa como tercero en nombre del titular, cuando acepta el tratamiento de datos, entonces el sistema registra la aceptación como tercero con fecha, hora y canal, sin exigir la cédula ni el nombre del tercero.
- AC-007. Dado que el titular tiene identidad verificada, cuando solicita la revocación del consentimiento, entonces el sistema elimina sus datos personales y de salud, conserva únicamente los registros de auditoría disociados y confirma la revocación.
- AC-008. Dado que el titular revoca el consentimiento teniendo citas y reservas activas, cuando se ejecuta la eliminación, entonces se cancelan las citas, se anulan los códigos de entrega, se liberan las existencias y cupos y se desvinculan los canales.

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
- Tema para arquitectura: mecanismo de almacenamiento y disociación segura de los registros de auditoría tras la eliminación de datos personales. Origen: RF-009.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-01)
- OPEN-Q-002: Respondida (DEC-02)
- OPEN-Q-003: Respondida (DEC-03)

### 16. Trazabilidad
- HU-001: RF-001, RF-002, RF-003; BR-001; AC-001, AC-002, AC-006.
- HU-002: RF-004, RF-005, RF-006, RF-007; BR-002, BR-003; AC-003, AC-004, AC-005.
- HU-003: RF-008, RF-009; BR-004; AC-007, AC-008.
- RF-001: verificado por AC-001.
- RF-002: verificado por AC-006.
- RF-003: verificado por AC-002.
- RF-004: verificado por AC-004.
- RF-005: verificado por AC-004.
- RF-006: verificado por AC-004.
- RF-007: verificado por AC-005.
- RF-008: verificado por AC-007.
- RF-009: verificado por AC-007, AC-008.
- BR-001: verificado por AC-002.
- BR-002: verificado por AC-004.
- BR-003: verificado por AC-003.
- BR-004: verificado por AC-008.
- CL-001: verificado por AC-003.
- CL-002: verificado por AC-008.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y contexto.
- Versión 1.0: incorporación de las respuestas del equipo a OPEN-Q-001, OPEN-Q-002 y OPEN-Q-003 (DEC-01, DEC-02, DEC-03), actualización de requisitos, flujos, casos límite y criterios de aceptación, pasando a estado Candidata.

## Verificación
- Completitud: cumple. La SPEC cubre aviso de privacidad, consentimiento de tercero, verificación de código con reglas de intentos y vigencia, ruta alterna, autorización separada de salud y revocación completa con eliminación de datos y auditoría disociada.
- Consistencia interna: cumple. Los requisitos funcionales RF-001 a RF-009 están alineados con las reglas de negocio BR-001 a BR-004 y los criterios de aceptación AC-001 a AC-008.
- Consistencia con el contexto: cumple. Las reglas reflejan exactamente las secciones 3.1, 3.2, 3.3, 3.8 y 3.11 del contexto, incorporando fielmente las decisiones DEC-01, DEC-02 y DEC-03.
- No ambigüedad: cumple. Los plazos (10 minutos), intentos (3), canales y efectos de la revocación están definidos sin ambigüedad.
- Verificabilidad: cumple. Cada criterio de aceptación utiliza formato Dado, Cuando, Entonces con resultados observables.
- Trazabilidad: cumple. Todas las historias de usuario, requisitos, reglas, casos límite y criterios están enlazados en la sección 16.
- No invención: cumple. No se incluyeron límites globales ni datos adicionales del tercero no autorizados por el equipo ni por el contexto.
- Delimitación: cumple. Se respetan estrictamente los límites de alcance y las exclusiones de la sección 3.10.

## Siguiente paso
La SPEC-001 versión 1.0 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
