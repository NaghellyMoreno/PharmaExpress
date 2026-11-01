<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:54
Petición: FASE=RESPUESTAS

Necesidad original: Canales, vinculación y selección de paciente. La aplicación web y el bot de Telegram permiten el flujo completo: verificar identidad, vincular el canal, cargar documentos, prevalidar, agendar, consultar el estado, ver el código de entrega, cancelar, desvincular y revocar. El bot solo interactúa después de que la persona lo inicia y publica una política de privacidad. Después de verificar la identidad, el chat o el navegador queda vinculado al paciente; un mismo canal puede quedar vinculado a varios pacientes sin límite y, si hay más de uno, se exige escoger el paciente antes de cada gestión y se muestra durante toda la gestión. La vinculación vence a los 3 meses y se reactiva con un nuevo código; mientras está vencida no muestra información, no permite gestiones y no recibe notificaciones por ese canal, aunque los SMS y correos continúan. Se puede desvincular un paciente. La web ofrece un enlace profundo al bot sin cédula, diagnósticos, medicamentos ni otros datos sensibles. El usuario consulta el estado de cada fórmula, las citas con punto y ventana, y el código de entrega en QR y numérico. EPIC-002.

Preguntas y respuestas del equipo:
- OPEN-Q-001. Cuando un canal (chat de Telegram o navegador) tiene múltiples pacientes vinculados y uno de ellos vence a los 3 meses, ¿la expiración es independiente por cada paciente vinculado al mismo canal o expira toda la sesión del canal bloqueando a todos los pacientes?
  Respuesta: La expiración es independiente por cada vinculación entre el canal y un paciente. Un mismo canal puede conservar pacientes con vinculación vigente mientras otra vinculación vence. Cada vinculación vence a los 3 meses y se reactiva con un nuevo código solo para ese paciente (DEC-10, BR-07).
- OPEN-Q-002. Al realizar una desvinculación voluntaria de un paciente por parte del usuario, ¿el sistema debe exigir una confirmación adicional antes de eliminar la vinculación del canal?
  Respuesta: Sí, el sistema pide una confirmación simple antes de desvincular. La desvinculación solo elimina la asociación entre ese canal y ese paciente: no cancela citas, no anula códigos, no libera reservas y no elimina datos. El canal deja de recibir notificaciones de ese paciente, pero los SMS y correos continúan (RF-20, BR-07).
- OPEN-Q-003. Cuando un canal intenta realizar cualquier gestión o consulta con una vinculación vencida (más de 3 meses), ¿el sistema debe guiar automáticamente al usuario para renovarla con un código nuevo o simplemente rechaza la acción sin iniciar el flujo de autenticación?
  Respuesta: El sistema muestra el mensaje de vinculación vencida e inicia de inmediato el flujo para solicitar un nuevo código de verificación. Mientras no se reverifique, no muestra información, no permite gestiones y no envía notificaciones por ese canal; los SMS y correos continúan (BR-07, flujo alterno A1 de la SPEC-02).
-->

# SPEC-002. Canales, vinculación y gestión multicanal - Versión 1.0

Estado: Candidata
Modo: Iteración
Necesidad original: "Canales, vinculación y selección de paciente. La aplicación web y el bot de Telegram permiten el flujo completo: verificar identidad, vincular el canal, cargar documentos, prevalidar, agendar, consultar el estado, ver el código de entrega, cancelar, desvincular y revocar. El bot solo interactúa después de que la persona lo inicia y publica una política de privacidad. Después de verificar la identidad, el chat o el navegador queda vinculado al paciente; un mismo canal puede quedar vinculado a varios pacientes sin límite y, si hay más de uno, se exige escoger el paciente antes de cada gestión y se muestra durante toda la gestión. La vinculación vence a los 3 meses y se reactiva con un nuevo código; mientras está vencida no muestra información, no permite gestiones y no recibe notificaciones por ese canal, aunque los SMS y correos continúan. Se puede desvincular un paciente. La web ofrece un enlace profundo al bot sin cédula, diagnósticos, medicamentos ni otros datos sensibles. El usuario consulta el estado de cada fórmula, las citas con punto y ventana, y el código de entrega en QR y numérico."
Épica: EPIC-002

## Análisis
- Objetivo: gestionar los canales de comunicación (aplicación web y bot de Telegram), la vinculación de pacientes tras verificar identidad, la selección obligatoria de paciente cuando hay múltiples asociaciones, la expiración e independencia de las vinculaciones a los 3 meses, la desvinculación voluntaria y los enlaces profundos seguros.
- Alcance inicial: canales de la aplicación web y bot de Telegram, vinculación de uno o múltiples pacientes por canal, vencimiento individual a los 3 meses, revalidación con código, desvinculación con confirmación y consulta de estado, citas y códigos de entrega.
- Actores: paciente, persona que actúa por el paciente (cuidador, tutor o facilitador comunitario).
- Contexto aplicable: 3.1, 3.2, 3.3, 3.5, 3.6, 3.8.

## Modelo de dominio
- Canal: aplicación web o bot de Telegram utilizado por la persona para interactuar con el sistema. Origen: contexto 3.1.
- Vinculación: asociación entre un canal y un paciente después de verificar la identidad. Un canal puede tener varias vinculaciones y cada vinculación es independiente. Origen: contexto 3.3, DEC-10.
- Paciente: afiliado cuyos datos provienen de la EPS simulada. Origen: contexto 2.3.
- Código de entrega: código de un solo uso, en formato QR y numérico, ligado a una cita. Origen: contexto 2.4, 3.5.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- DEC-10: afecta BR-005, RF-014, AC-009, CL-005. Todos actualizados.
- DEC-11: afecta RF-019, RF-020, BR-006, AC-012, CL-006. Todos actualizados.
- DEC-12: afecta RF-015, RNF-009, BR-007, AC-010, CL-007. Todos actualizados.

## Preguntas de aclaración
- No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Garantizar el acceso multicanal seguro y estructurado a través de la web y el bot de Telegram, administrando la vinculación de múltiples pacientes por canal, su expiración independiente de tres meses, la selección explícita de paciente para cada gestión y las operaciones de desvinculación y consulta.

### 2. Contexto
El sistema opera mediante la aplicación web y un bot de Telegram. Los identificadores de los canales no prueban la identidad por sí mismos, por lo que se requiere un proceso de verificación con cédula y código de un solo uso por SMS y correo. Tras la verificación, el canal queda vinculado al paciente.
Decisiones del equipo:
- DEC-10. La expiración de la vinculación a los 3 meses es independiente por cada vinculación entre un canal y un paciente. Un mismo canal puede conservar pacientes con vinculación vigente mientras otra vinculación vence. Se reactiva con un nuevo código solo para ese paciente. Responde a OPEN-Q-001.
- DEC-11. La desvinculación voluntaria de un paciente requiere una confirmación simple por parte del usuario antes de eliminar la asociación del canal. No cancela citas, no anula códigos, no libera reservas y no elimina datos; solo detiene las notificaciones por ese canal, manteniendo los SMS y correos. Responde a OPEN-Q-002.
- DEC-12. Cuando un canal intenta realizar cualquier gestión o consulta con una vinculación vencida (más de 3 meses), el sistema muestra el mensaje de vinculación vencida e inicia de inmediato el flujo para solicitar un nuevo código de verificación. Responde a OPEN-Q-003.

### 3. Alcance
- Uso de la aplicación web y bot de Telegram para todo el flujo de pre-dispensación.
- Vinculación y gestión de múltiples pacientes en un mismo canal sin límite.
- Vencimiento y renovación independiente de cada vinculación a los 3 meses.
- Selección obligatoria de paciente antes de cada gestión cuando existen múltiples vinculaciones activas.
- Desvinculación voluntaria con confirmación simple.
- Generación de enlaces profundos seguros hacia el bot de Telegram sin datos sensibles.
- Consulta de estado de fórmulas, citas con punto y ventana, y códigos de entrega en QR y numérico.

### 4. Actores e historias de usuario
Actores: paciente, cuidador, tutor, facilitador comunitario.
- HU-004. Como persona que interactúa con el sistema por web o Telegram, quiero vincular canales y gestionar múltiples pacientes de forma segura y transparente, para realizar consultas y trámites sin exponer datos sensibles.

### 5. Requisitos funcionales
- RF-011. El sistema debe permitir el recorrido completo por la aplicación web y el bot de Telegram, incluyendo verificación de identidad, vinculación, carga de documentos, prevalidación, agendamiento, consulta de estado, visualización de código de entrega, cancelación, desvinculación y revocación. Origen: contexto 3.1, necesidad.
- RF-012. El bot de Telegram solo debe interactuar después de que la persona lo inicia de manera voluntaria y publica la política de privacidad. Origen: contexto 3.1, necesidad.
- RF-013. El sistema debe permitir vincular un chat de Telegram o un navegador a un paciente tras verificar su identidad satisfactoriamente, permitiendo asociar múltiples pacientes a un mismo canal sin límite. Origen: contexto 3.3, necesidad.
- RF-014. El sistema debe evaluar la expiración de la vinculación de forma independiente para cada asociación entre un canal y un paciente cada 3 meses. Origen: DEC-10.
- RF-015. Cuando un canal intente realizar una gestión con una vinculación vencida, el sistema debe mostrar el mensaje correspondiente e iniciar de inmediato el flujo para solicitar un código nuevo de verificación. Origen: DEC-12.
- RF-016. Si un canal tiene más de un paciente vinculado, el sistema debe exigir que se escoja cuál paciente se va a gestionar antes de iniciar cualquier trámite y mantener visible la selección durante toda la gestión. Origen: contexto 3.3, necesidad.
- RF-017. La aplicación web debe ofrecer enlaces profundos al bot de Telegram que nunca incluyan cédula, diagnósticos, medicamentos ni otros datos sensibles. Origen: contexto 3.1, necesidad.
- RF-018. El sistema debe permitir al usuario consultar el estado de cada fórmula, las citas asignadas con su punto y ventana, y el código de entrega en formato QR y numérico. Origen: contexto 3.5, necesidad.
- RF-019. El sistema debe permitir la desvinculación voluntaria de un paciente por parte del usuario, exigiendo una confirmación simple antes de ejecutar la acción. Origen: DEC-11.
- RF-020. La desvinculación voluntaria solo debe eliminar la asociación entre el canal y el paciente, deteniendo las notificaciones por dicho canal sin cancelar citas, anular códigos, liberar reservas ni eliminar datos del paciente, mientras los SMS y correos continúan. Origen: DEC-11.

### 6. Requisitos no funcionales
- RNF-009. Seguridad y privacidad. Los identificadores de canales no deben ser considerados prueba de identidad y los enlaces profundos deben carecer de información sensible. Se verifica mediante revisión de rutas y parámetros de URL en la aplicación web. Origen: contexto 3.1, necesidad.

### 7. Reglas de negocio
- BR-005. La vigencia de cada vinculación entre canal y paciente es de exactamente 3 meses, evaluándose de forma independiente por cada paciente asociado al mismo canal. Origen: contexto 3.3, DEC-10.
- BR-006. La desvinculación voluntaria de un paciente en un canal no afecta las citas activas, las reservas ni la vigencia de los datos del paciente en el sistema general, deteniendo únicamente las notificaciones y accesos en ese canal específico. Origen: contexto 3.2, DEC-11.
- BR-007. Una vinculación vencida bloquea el acceso a la información, la ejecución de gestiones y la recepción de notificaciones en ese canal para ese paciente específico hasta que se realice la revalidación con un código nuevo, sin afectar otros canales ni otros pacientes vinculados al mismo dispositivo. Origen: contexto 3.3, DEC-12.

### 8. Flujo principal
1. La persona inicia el canal (web o bot de Telegram tras aceptar política de privacidad).
2. La persona ingresa la cédula y completa el proceso de verificación de identidad mediante código de un solo uso por SMS y correo.
3. El sistema vincula el canal al paciente.
4. Si el canal ya tiene otros pacientes vinculados, el sistema los conserva de forma independiente y permite agregar al nuevo paciente.
5. Al realizar una gestión, si hay múltiples pacientes vinculados, el sistema exige seleccionar cuál paciente se gestionará, mostrando su indicador durante todo el proceso.
6. El usuario consulta estados, fórmulas, citas con punto y ventana, o solicita códigos de entrega.

### 9. Flujos alternativos y de excepción
- A1. Vinculación vencida: Si una vinculación supera los 3 meses y el usuario intenta interactuar, el sistema muestra el mensaje de vinculación vencida e inicia de inmediato el flujo de revalidación con código nuevo.
- E1. Desvinculación: Si el usuario solicita desvincular un paciente, el sistema pide una confirmación simple; al aceptarla, elimina la asociación del canal, detiene las notificaciones por esa vía y conserva intactas las citas y reservas del paciente.

### 10. Casos límite
- CL-005. Canal con múltiples pacientes donde la vinculación de uno de ellos vence a los 3 meses: el sistema bloquea y exige revalidación únicamente para ese paciente vencido, permitiendo gestionar con normalidad a los demás pacientes cuya vinculación siga vigente en el mismo canal. Origen: DEC-10.
- CL-006. Intento de desvincular a un paciente que posee citas activas: el sistema solicita confirmación simple y ejecuta la desvinculación del canal sin alterar ni cancelar las citas ni los códigos asociados. Origen: DEC-11.
- CL-007. Recepción de notificaciones tras vencer una vinculación de canal: el canal afectado deja de recibir notificaciones para ese paciente, pero el paciente continúa recibiendo notificaciones por SMS y correo electrónico. Origen: contexto 3.3, DEC-12.

### 11. Criterios de aceptación
- AC-009. Dado un canal con dos pacientes vinculados en fechas distintas, cuando una de las vinculaciones cumple 3 meses, entonces solo esa vinculación expira y exige código nuevo, mientras la otra vinculación del mismo canal permanece activa. Origen: DEC-10.
- AC-010. Dado un canal con una vinculación vencida hace más de 3 meses, cuando el usuario intenta consultar información de ese paciente, entonces el sistema muestra el aviso de vencimiento e inicia de inmediato el flujo de código nuevo. Origen: DEC-12.
- AC-011. Dado un canal con múltiples pacientes vinculados, cuando el usuario inicia una nueva gestión, entonces el sistema exige seleccionar explícitamente al paciente y muestra su identificación durante todo el proceso. Origen: contexto 3.3.
- AC-012. Dado un paciente con citas activas vinculado a un canal, cuando el usuario solicita la desvinculación y confirma el mensaje simple, entonces la asociación se elimina del canal, cesan las notificaciones por esa vía y las citas y reservas del paciente permanecen intactas. Origen: DEC-11.

### 12. Dependencias
- Verificación de identidad y códigos de un solo uso.
- Fuente de datos de la EPS simulada.

### 13. Restricciones
- Equipo de cuatro personas y aproximadamente 8 semanas. Origen: contexto 3.9.
- Sin acceso a los sistemas de Disfarma y trabajo desde afuera. Origen: contexto 3.9.
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites de autorización. Origen: contexto 3.11.

### 14. Fuera de alcance
- Domicilio. Origen: contexto 3.10.
- Aplicación móvil instalable y WhatsApp. Origen: contexto 3.10.
- Uso de datos reales de pacientes. Origen: contexto 3.10.
- Tema para arquitectura: mecanismo técnico de almacenamiento y persistencia de las sesiones de vinculación y expiración por canal. Origen: RF-014.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-10)
- OPEN-Q-002: Respondida (DEC-11)
- OPEN-Q-003: Respondida (DEC-12)

### 16. Trazabilidad
- HU-004: RF-011, RF-012, RF-013, RF-014, RF-015, RF-016, RF-017, RF-018, RF-019, RF-020; RNF-009; BR-005, BR-006, BR-007; AC-009, AC-010, AC-011, AC-012; CL-005, CL-006, CL-007.
- RF-014: verificado por AC-009.
- RF-015: verificado por AC-010.
- RF-016: verificado por AC-011.
- RF-019, RF-020: verificado por AC-012.
- BR-005: verificado por AC-009.
- BR-006: verificado por AC-012.
- BR-007: verificado por AC-010.
- CL-005: verificado por AC-009.
- CL-006: verificado por AC-012.
- CL-007: verificado por AC-010.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y contexto.
- Versión 1.0: incorporación de respuestas del equipo a OPEN-Q-001, OPEN-Q-002 y OPEN-Q-003 (DEC-10, DEC-11, DEC-12), actualización de requisitos funcionales, reglas de negocio, casos límite y criterios de aceptación, pasando a estado Candidata.

## Verificación
- Completitud: cumple. La SPEC cubre los canales web y Telegram, la vinculación múltiple, la expiración independiente a los 3 meses, la selección de paciente, los enlaces profundos y la desvinculación voluntaria con confirmación.
- Consistencia interna: cumple. Los requisitos RF-014 y RF-015 son coherentes con las reglas BR-005 y BR-007 y los criterios AC-009 y AC-010 sobre la expiración independiente y el flujo de revalidación.
- Consistencia con el contexto: cumple. Las decisiones DEC-10, DEC-11 y DEC-12 respetan estrictamente lo indicado en las secciones 3.1, 3.2 y 3.3 del contexto del producto.
- No ambigüedad: cumple. Los flujos de vencimiento, confirmación de desvinculación y selección de paciente están redactados sin términos vagos.
- Verificabilidad: cumple. Cada criterio de aceptación especifica un comportamiento observable y comprobable (Dado/Cuando/Entonces).
- Trazabilidad: cumple. Todos los requisitos funcionales, reglas y casos límite están enlazados con la historia de usuario HU-004 y sus respectivos criterios de aceptación.
- No invención: cumple. No se introdujeron canales adicionales, cifras de plazos no autorizadas ni tecnologías específicas de almacenamiento.
- Delimitación: cumple. Se mantienen claramente delimitados los límites del alcance y se registran las exclusiones correspondientes.

## Siguiente paso
La SPEC-002 versión 1.0 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
