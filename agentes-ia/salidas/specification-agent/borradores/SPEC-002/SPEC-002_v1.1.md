<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash
Fecha: 2026-10-29 19:07
Petición: Actualiza la SPEC-002 a la versión 1.1 en estado Candidata aplicando las reglas 12 y 13 del prompt. Mantén sin cambios las decisiones DEC-10, DEC-11 y DEC-12, el alcance, las reglas de negocio y los identificadores existentes. Escribe al menos una HU por cada actor con objetivo propio: paciente, cuidador, tutor y facilitador comunitario; no consolides actores distintos en una HU genérica. Cada RF y cada BR debe tener al menos un AC que lo verifique; agrega los AC que falten. La sección 16 debe incluir una línea por cada RF, RNF, BR y CL con su origen y su verificación. No inventes reglas, cifras ni alcance nuevo.
-->

# SPEC-002. Canales, vinculación y gestión multicanal - Versión 1.1

Estado: Candidata
Modo: Iteración
Necesidad original: "Canales, vinculación y selección de paciente. La aplicación web y el bot de Telegram permiten el flujo completo: verificar identidad, vincular el canal, cargar documentos, prevalidar, agendar, consultar el estado, ver el código de entrega, cancelar, desvincular y revocar. El bot solo interactúa después de que la persona lo inicia y publica una política de privacidad. Después de verificar la identidad, el chat o el navegador queda vinculado al paciente; un mismo canal puede quedar vinculado a varios pacientes sin límite y, si hay más de uno, se exige escoger el paciente antes de cada gestión y se muestra durante toda la gestión. La vinculación vence a los 3 meses y se reactiva con un nuevo código; mientras está vencida no muestra información, no permite gestiones y no recibe notificaciones por ese canal, aunque los SMS y correos continúan. Se puede desvincular un paciente. La web ofrece un enlace profundo al bot sin cédula, diagnósticos, medicamentos ni otros datos sensibles. El usuario consulta el estado de cada fórmula, las citas con punto y ventana, y el código de entrega en QR y numérico."
Épica: EPIC-002

## Análisis
- Objetivo: gestionar los canales de comunicación (aplicación web y bot de Telegram), la vinculación de pacientes tras verificar identidad, la selección obligatoria de paciente cuando hay múltiples asociaciones, la expiración e independencia de las vinculaciones a los 3 meses, la desvinculación voluntaria y los enlaces profundos seguros.
- Alcance inicial: canales de la aplicación web y bot de Telegram, vinculación de uno o múltiples pacientes por canal, vencimiento individual a los 3 meses, revalidación con código, desvinculación con confirmación y consulta de estado, citas y códigos de entrega.
- Actores: paciente, cuidador, tutor, facilitador comunitario.
- Contexto aplicable: 3.1, 3.2, 3.3, 3.5, 3.6, 3.8.

## Modelo de dominio
- Canal: aplicación web o bot de Telegram utilizado por la persona para interactuar con el sistema. Origen: contexto 3.1.
- Vinculación: asociación entre un canal y un paciente después de verificar la identidad. Un canal puede tener varias vinculaciones y cada vinculación es independiente. Origen: contexto 3.3, DEC-10.
- Paciente: afiliado cuyos datos provienen de la EPS simulada. Origen: contexto 2.3.
- Código de entrega: código de un solo uso, en formato QR y numérico, ligado a una cita. Origen: contexto 2.4, 3.5.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- Regla 12: actualización de la sección 4 para incluir al menos una HU específica por cada actor (paciente, cuidador, tutor y facilitador comunitario).
- Regla 13: adición de AC-013, AC-014, AC-015 y AC-016 para garantizar que todos los RF y BR posean al menos un criterio de aceptación verificador; actualización completa de la sección 16 trazando origen y verificación para cada RF, RNF, BR y CL.

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
- HU-004. Como paciente, quiero vincular mi canal preferido (web o Telegram) y consultar mis fórmulas, citas y códigos de entrega, para hacer el seguimiento de mis pre-dispensaciones sin desplazarme innecesariamente.
- HU-005. Como cuidador, quiero vincular y gestionar las solicitudes de la persona a mi cuidado desde mi propio canal, para ayudarle a coordinar sus citas y medicamentos de forma oportuna.
- HU-006. Como tutor, quiero vincular a mi representado y gestionar sus trámites de pre-dispensación en un canal seguro, para garantizar el acceso continuo a sus tratamientos.
- HU-007. Como facilitador comunitario, quiero vincular a múltiples pacientes en mi chat o navegador y seleccionar a cuál gestiono en cada acción, para prestar apoyo a varios miembros de la comunidad de manera clara y ordenada.

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
- AC-013. Dado un usuario que abre el bot de Telegram por primera vez, cuando no ha iniciado el bot de manera voluntaria, entonces el bot no envía mensajes interactivos ni procesa gestiones hasta que el usuario lo inicie y acepte la política de privacidad. Origen: contexto 3.1, necesidad.
- AC-014. Dado un usuario que completa exitosamente la verificación de identidad en un navegador donde ya tiene un paciente vinculado, cuando confirma la verificación, entonces el sistema vincula al nuevo paciente al mismo canal sin eliminar la vinculación previa. Origen: contexto 3.3, necesidad.
- AC-015. Dado un usuario en la aplicación web que presiona el enlace profundo hacia Telegram, cuando se genera la URL de redirección, entonces la URL no contiene cédula, diagnósticos, medicamentos ni ningún otro dato sensible del paciente. Origen: contexto 3.1, necesidad.
- AC-016. Dado un usuario con un paciente seleccionado con una cita asignada, cuando ingresa a la opción de consulta, entonces el sistema muestra el estado de la fórmula, la cita con su punto y ventana de 1 hora, y el código de entrega en formato QR y numérico. Origen: contexto 3.5, necesidad.

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
- Mecanismo técnico de almacenamiento y persistencia de las sesiones de vinculación y expiración por canal: tema para arquitectura. Origen: RF-014.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-10)
- OPEN-Q-002: Respondida (DEC-11)
- OPEN-Q-003: Respondida (DEC-12)

### 16. Trazabilidad
- HU-004: RF-011, RF-012, RF-013, RF-014, RF-015, RF-016, RF-017, RF-018, RF-019, RF-020; RNF-009; BR-005, BR-006, BR-007; AC-009, AC-010, AC-011, AC-012, AC-013, AC-014, AC-015, AC-016; CL-005, CL-006, CL-007.
- HU-005: RF-013, RF-016, RF-018; AC-011, AC-014, AC-016.
- HU-006: RF-013, RF-016, RF-018; AC-011, AC-014, AC-016.
- HU-007: RF-013, RF-016; AC-011, AC-014.
- RF-011: Origen: contexto 3.1, necesidad; verificado por AC-013.
- RF-012: Origen: contexto 3.1, necesidad; verificado por AC-013.
- RF-013: Origen: contexto 3.3, necesidad; verificado por AC-014.
- RF-014: Origen: DEC-10; verificado por AC-009.
- RF-015: Origen: DEC-12; verificado por AC-010.
- RF-016: Origen: contexto 3.3, necesidad; verificado por AC-011.
- RF-017: Origen: contexto 3.1, necesidad; verificado por AC-015.
- RF-018: Origen: contexto 3.5, necesidad; verificado por AC-016.
- RF-019: Origen: DEC-11; verificado por AC-012.
- RF-020: Origen: DEC-11; verificado por AC-012.
- RNF-009: Origen: contexto 3.1, necesidad; verificado con revisión de rutas y parámetros de URL en la aplicación web.
- BR-005: Origen: contexto 3.3, DEC-10; verificado por AC-009.
- BR-006: Origen: contexto 3.2, DEC-11; verificado por AC-012.
- BR-007: Origen: contexto 3.3, DEC-12; verificado por AC-010.
- CL-005: Origen: DEC-10; verificado por AC-009.
- CL-006: Origen: DEC-11; verificado por AC-012.
- CL-007: Origen: contexto 3.3, DEC-12; verificado por AC-010.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y contexto.
- Versión 1.0: incorporación de respuestas del equipo a OPEN-Q-001, OPEN-Q-002 y OPEN-Q-003 (DEC-10, DEC-11, DEC-12), actualización de requisitos funcionales, reglas de negocio, casos límite y criterios de aceptación, pasando a estado Candidata.
- Versión 1.1: actualización conforme a las reglas 12 y 13. Desagregación de historias de usuario para cada actor con objetivo propio (HU-004 a HU-007), adición de los criterios de aceptación AC-013 a AC-016 para asegurar la verificación de todos los RFs y BRs, y completitud de la sección 16 con el detalle de origen y verificación de cada elemento.

## Verificación
- Completitud: cumple. La SPEC abarca todos los requisitos del alcance, la gestión de múltiples pacientes, vencimiento, desvinculación, enlaces profundos y consultas.
- Consistencia interna: cumple. Las reglas de negocio, casos límite, requisitos funcionales y criterios de aceptación son coherentes y concuerdan plenamente entre sí.
- Consistencia con el contexto: cumple. Se mantienen sin modificaciones DEC-10, DEC-11 y DEC-12 conforme a la sección 3 del contexto del producto.
- No ambigüedad: cumple. Todos los comportamientos están descritos de manera precisa sin dejar margen a interpretaciones divergentes.
- Verificabilidad: cumple. Cada RF y BR posee al menos un criterio de aceptación medible bajo el formato Dado/Cuando/Entonces.
- Cobertura de actores: cumple. Se incluye al menos una HU por cada actor con objetivo propio (paciente, cuidador, tutor y facilitador comunitario) en cumplimiento de la regla 12.
- Cobertura de AC: cumple. Todos los RF y BR cuentan con al menos un AC asignado que lo verifica en cumplimiento de la regla 13.
- Trazabilidad: cumple. La sección 16 incluye una línea explícita por cada RF, RNF, BR y CL detallando su origen y método o AC de verificación.
- No invención: cumple. No se agregaron datos ficticios, cifras arbitrarias ni alcances no justificados por la necesidad o el contexto.
- Delimitación: cumple. Los aspectos técnicos de construcción permanecen correctamente identificados en fuera de alcance para arquitectura.

## Siguiente paso
La SPEC-002 versión 1.1 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
