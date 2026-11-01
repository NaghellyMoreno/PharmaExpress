<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash
Fecha: 2026-10-31 20:02
Petición: Actualiza la SPEC-002 a la versión 1.2 en estado Candidata. Aplica DEC-P01 y DEC-P10 de docs/decisiones.md: la web es adaptable y sin instalación, y en Telegram la carga de documentos, la confirmación y los resultados se hacen en la Mini App, mientras el chat solo lleva avisos con plantilla fija; una foto enviada al chat no se procesa. Resuelve T-017 (vigencia de la vinculación de 3 meses calendario), T-026 (relación entre la política del bot y el aviso de SPEC-001), T-027 (qué identifica al paciente en pantalla sin datos sensibles) y T-028. Marca agendamiento, citas y código de entrega de RF-011 y RF-018 como dependientes del agendamiento en evaluación.
-->

# SPEC-002. Canales, vinculación y gestión multicanal - Versión 1.2

Estado: Candidata
Modo: Iteración
Necesidad original: "Canales, vinculación y selección de paciente. La aplicación web y el bot de Telegram permiten el flujo completo: verificar identidad, vincular el canal, cargar documentos, prevalidar, agendar, consultar el estado, ver el código de entrega, cancelar, desvincular y revocar. El bot solo interactúa después de que la persona lo inicia y publica una política de privacidad. Después de verificar la identidad, el chat o el navegador queda vinculado al paciente; un mismo canal puede quedar vinculado a varios pacientes sin límite y, si hay más de uno, se exige escoger el paciente antes de cada gestión y se muestra durante toda la gestión. La vinculación vence a los 3 meses y se reactiva con un nuevo código; mientras está vencida no muestra información, no permite gestiones y no recibe notificaciones por ese canal, aunque los SMS y correos continúan. Se puede desvincular un paciente. La web ofrece un enlace profundo al bot sin cédula, diagnósticos, medicamentos ni otros datos sensibles. El usuario consulta el estado de cada fórmula, las citas con punto y ventana, y el código de entrega en QR y numérico."
Épica: EPIC-002

## Análisis
- Objetivo: administrar los canales de interacción (aplicación web adaptable y bot de Telegram con Mini App), la vinculación segura de pacientes tras la verificación de identidad, la selección explícita de paciente sin exponer datos sensibles, la expiración e independencia de las vinculaciones a los 3 meses calendario, la desvinculación voluntaria y los enlaces profundos seguros.
- Alcance inicial: interacción multicanal mediante aplicación web responsiva (sin instalación) y Telegram (chat para avisos de plantilla fija y Mini App para gestiones), vinculación individual o múltiple por canal, vencimiento a los 3 meses calendario, reactivación mediante código de verificación, desvinculación con confirmación y consulta de estado de fórmulas y prevalidaciones preliminares.
- Actores: paciente, cuidador, tutor, facilitador comunitario.
- Contexto aplicable: 3.1, 3.2, 3.3, 3.5, 3.6, 3.8, 3.10.

## Modelo de dominio
- Canal: aplicación web adaptable (en navegador) o chat/Mini App de Telegram utilizado por la persona para interactuar con el sistema. Origen: contexto 3.1, DEC-P10.
- Vinculación: asociación entre un canal y un paciente después de verificar la identidad. Un canal puede tener varias vinculaciones y cada vinculación es independiente. Origen: contexto 3.3, DEC-10.
- Paciente: afiliado cuyos datos provienen de la EPS simulada. Origen: contexto 2.3.
- Código de entrega: código de un solo uso, en formato QR y numérico, ligado a una cita (funcionalidad de agendamiento dependiente de SPEC-004, en evaluación para el MVP según DEC-P01). Origen: contexto 2.4, 3.5, DEC-P01.

## Contradicciones detectadas
- Ninguna.

## Análisis of impacto
- DEC-P01: afecta RF-011 y RF-018. El agendamiento, la asignación de citas y la visualización de códigos de entrega (QR y numérico) quedan identificados explícitamente como dependientes de la funcionalidad de agendamiento (SPEC-004), la cual está en evaluación para el MVP. La prevalidación completa ingresa al MVP.
- DEC-P10: afecta RF-011, RF-012, RNF-009, BR-008, Flujo principal, Flujo alternativo A2 y AC-013. Se establece que la aplicación web es de una sola interfaz, adaptable a dispositivos móviles y sin instalación (se excluye PWA instalable). En Telegram, la carga de documentos, confirmación y resultados se realizan en la Mini App; el chat del bot solo entrega avisos de plantilla fija con botones hacia la Mini App. Cualquier foto o documento enviado directamente al chat de Telegram no se procesa.
- T-017: afecta BR-005, RF-014 y AC-009. Se aclara que la vigencia de la vinculación es de exactamente 3 meses calendario (no 90 días).
- T-026: afecta RF-012 y BR-004. Se especifica que la política de privacidad publicada por el bot de Telegram corresponde al aviso y declaración de tratamiento de datos personales de Pharma Express (definido en SPEC-001 y contexto 3.2).
- T-027: afecta RF-016, BR-009 y AC-011. Se define el formato de identificación visual del paciente en pantalla ("Primer nombre + Inicial del primer apellido + Tipo y últimos 4 dígitos de cédula enmascarada", ej.: "Juan P. - CC ***1234") para evitar la exposición de cédula completa o datos sensibles.
- T-028: afecta la estructura del documento. Se eliminan encabezados duplicados y se reemplaza el término ambiguo "dispositivo" por "canal".

## Preguntas de aclaración
- No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Garantizar el acceso multicanal seguro mediante una aplicación web adaptable sin instalación y un bot de Telegram integrado con Mini App, administrando la vinculación de múltiples pacientes por canal, su expiración independiente a los 3 meses calendario, la selección explícita de paciente mediante enmascaramiento seguro y las operaciones de desvinculación y consulta.

### 2. Contexto
El sistema opera a través de una aplicación web adaptable (en navegador) y un bot de Telegram con Mini App. Los identificadores de los canales (chats o navegadores) no constituyen prueba de identidad, por lo que la vinculación requiere la verificación previa mediante cédula y código de un solo uso enviado por SMS y correo.
Decisiones del equipo:
- DEC-P01. La prevalidación completa entra al MVP, en web y en Telegram. El agendamiento (SPEC-004) queda en evaluación. Origen: docs/decisiones.md.
- DEC-P10. Una sola interfaz web, adaptable al celular y sin instalación (contexto 3.10), que se usa de dos formas: en el navegador y como Mini App de Telegram. El chat del bot solo lleva avisos con plantilla fija y botones que abren la Mini App. La identidad sigue exigiendo cédula + código también dentro de la Mini App. Una foto enviada al chat no se procesa. Origen: docs/decisiones.md (T-012, PREG-007).
- DEC-10. La expiración de la vinculación a los 3 meses calendario es independiente por cada vinculación entre un canal y un paciente. Un mismo canal puede conservar pacientes con vinculación vigente mientras otra vinculación vence. Se reactiva con un nuevo código solo para ese paciente. Responde a OPEN-Q-001 (T-017).
- DEC-11. La desvinculación voluntaria de un paciente requiere una confirmación simple por parte del usuario antes de eliminar la asociación del canal. No cancela citas, no anula códigos, no libera reservas y no elimina datos; solo detiene las notificaciones por ese canal, manteniendo los SMS y correos. Responde a OPEN-Q-002.
- DEC-12. Cuando un canal intenta realizar cualquier gestión o consulta con una vinculación vencida (más de 3 meses calendario), el sistema muestra el mensaje de vinculación vencida e inicia de inmediato el flujo para solicitar un nuevo código de verificación. Responde a OPEN-Q-003.

### 3. Alcance
- Uso de la aplicación web adaptable (sin instalación) y bot de Telegram (chat de avisos + Mini App) para la gestión multicanal.
- Vinculación y gestión de múltiples pacientes en un mismo canal sin límite de asociatividad.
- Vencimiento y renovación independiente de cada vinculación a los 3 meses calendario.
- Selección obligatoria del paciente a gestionar previa a cada trámite, mostrada en pantalla mediante formato enmascarado seguro.
- Desvinculación voluntaria de un paciente por canal con confirmación simple.
- Generación de enlaces profundos seguros hacia la Mini App o bot de Telegram sin incluir datos sensibles en la URL.
- Consulta de estado de fórmulas y prevalidaciones preliminares (y de citas con punto/ventana y códigos de entrega QR/numérico cuando se active la funcionalidad de agendamiento de SPEC-004).

### 4. Actores e historias de usuario
Actores: paciente, cuidador, tutor, facilitador comunitario.
- HU-004. Como paciente, quiero vincular mi canal preferido (navegador web o Telegram) y consultar el estado de mis prevalidaciones, para hacer el seguimiento de mis fórmulas sin realizar desplazamientos innecesarios.
- HU-005. Como cuidador, quiero vincular y gestionar las pre-dispensaciones de la persona a mi cuidado desde mi canal, para ayudarle a coordinar la revisión de sus medicamentos de manera oportuna.
- HU-006. Como tutor, quiero vincular a mi representado en un canal seguro y acceder a sus trámites de prevalidación, para garantizar el seguimiento continuo de sus tratamientos farmacéuticos.
- HU-007. Como facilitador comunitario, quiero vincular a múltiples pacientes en mi chat o navegador y elegir a cuál gestiono en cada trámite, para brindar apoyo a varios miembros de la comunidad con absoluta claridad e independencia.

### 5. Requisitos funcionales
- RF-011. El sistema debe ofrecer el recorrido de uso en la aplicación web adaptable (sin instalación) y en Telegram (mediante Mini App para interacción y chat para notificaciones), incluyendo verificación de identidad, vinculación, carga de documentos, prevalidación, consulta de estado, desvinculación y revocación. El agendamiento, la visualización del código de entrega y la cancelación de citas quedan sujetos a la activación de la funcionalidad de agendamiento (SPEC-004 en evaluación). Origen: contexto 3.1, necesidad, DEC-P01, DEC-P10.
- RF-012. El bot de Telegram solo debe interactuar después de que la persona lo inicie de manera voluntaria y presente el enlace o texto del aviso de privacidad de Pharma Express (conforme a SPEC-001). El chat del bot solo debe transmitir avisos informativos de plantilla fija con botones que abran la Mini App. Origen: contexto 3.1, necesidad, DEC-P10, T-026.
- RF-013. El sistema debe permitir vincular un canal (chat de Telegram o navegador web) a un paciente tras verificar su identidad satisfactoriamente mediante cédula y código de un solo uso, admitiendo asociar múltiples pacientes a un mismo canal sin límite. Origen: contexto 3.3, necesidad, DEC-P10.
- RF-014. El sistema debe evaluar la expiración de la vinculación de forma independiente para cada asociación entre un canal y un paciente exactamente a los 3 meses calendario de haber sido establecida o renovada. Origen: DEC-10, T-017.
- RF-015. Cuando un canal intente realizar una gestión o consulta utilizando una vinculación vencida, el sistema debe mostrar un mensaje explícito de vinculación vencida e iniciar de inmediato el flujo de revalidación solicitando un nuevo código de verificación. Origen: DEC-12.
- RF-016. Si un canal tiene más de un paciente vinculado, el sistema debe exigir la selección explícita del paciente a gestionar antes de iniciar cualquier trámite y mantener visible su identificación enmascarada ("Primer nombre + Inicial del primer apellido + Tipo y 4 últimos dígitos de cédula", ej.: "Juan P. - CC ***1234") durante toda la gestión. Origen: contexto 3.3, necesidad, T-027.
- RF-017. La aplicación web debe ofrecer enlaces profundos hacia Telegram que redirijan a la persona sin incluir cédula, diagnósticos, medicamentos ni ningún otro dato sensible en la URL. Origen: contexto 3.1, necesidad.
- RF-018. El sistema debe permitir al usuario consultar el estado de prevalidación de cada fórmula. La visualización de citas asignadas (con punto de dispensación y ventana de 1 hora) y el código de entrega (QR y numérico) estará disponible cuando la funcionalidad de agendamiento (SPEC-004) sea activada. Origen: contexto 3.5, necesidad, DEC-P01.
- RF-019. El sistema debe permitir la desvinculación voluntaria de un paciente por canal a solicitud del usuario, exigiendo una confirmación simple antes de proceder. Origen: DEC-11.
- RF-020. La desvinculación voluntaria solo debe eliminar la asociación entre el canal y el paciente específico, deteniendo las notificaciones por dicho canal sin cancelar citas, anular códigos, liberar reservas ni eliminar datos del paciente, mientras los envíos por SMS y correo electrónico continúan. Origen: DEC-11.
- RF-021. El sistema no debe procesar fotos ni documentos enviados como mensajes de archivo o imagen directamente al chat de Telegram; en su lugar, debe responder con un aviso de plantilla fija y un botón que dirija a la persona a la Mini App para realizar la carga. Origen: DEC-P10.

### 6. Requisitos no funcionales
- RNF-009. Seguridad y privacidad en canales. Los identificadores de canales (ID de chat de Telegram o cookies/sesiones de navegador) no deben considerarse prueba de identidad. Los enlaces profundos y parámetros de URL deben estar libres de datos sensibles de salud o de identificación. Se verifica mediante inspección de rutas, parámetros URL y análisis de trafico de red. Origen: contexto 3.1, necesidad.
- RNF-010. Usabilidad y arquitectura web sin instalación. La aplicación web debe ser totalmente adaptable a navegadores móviles y de escritorio sin requerir instalación (se excluye empaquetado PWA instalable o aplicación nativa). Se verifica mediante prueba de acceso en navegador móvil sin aviso ni dependencia de instalación local. Origen: contexto 3.10, DEC-P10, T-012.

### 7. Reglas de negocio
- BR-005. La vigencia de cada vinculación entre un canal y un paciente es de exactamente 3 meses calendario desde el momento de su verificación, evaluándose de forma independiente por cada paciente asociado a ese canal. Origen: contexto 3.3, DEC-10, T-017.
- BR-006. La desvinculación voluntaria de un paciente en un canal detiene únicamente las notificaciones y accesos de ese paciente en ese canal específico, sin alterar sus prevalidaciones, citas, reservas ni datos registrados en la EPS simulada. Origen: contexto 3.2, DEC-11.
- BR-007. Una vinculación vencida bloquea la consulta de información, la ejecución de gestiones y la recepción de notificaciones en ese canal para el paciente afectado hasta completar la revalidación con un nuevo código de verificación, sin interrumpir otros canales vinculados ni a otros pacientes asociados al mismo canal. Origen: contexto 3.3, DEC-12.
- BR-008. Operación de Telegram mediante Mini App. El chat de Telegram se limita a la recepción de mensajes informativos mediante plantillas fijas y botones de acción. Toda interacción que requiera ingreso de datos, carga de documentos, confirmación de OCR o consulta de resultados se ejecuta dentro de la Mini App. Cualquier archivo o imagen recibido directamente en el chat es ignorado operacionalmente y responde con la redirección a la Mini App. Origen: DEC-P10.
- BR-009. Máscara de privacidad para la identificación del paciente. La identificación del paciente seleccionado en pantalla y en la Mini App debe estructurarse obligatoriamente como: "Primer nombre + Inicial del primer apellido + Tipo de documento + Últimos 4 dígitos de la cédula" (ejemplo: "María G. - CC ***5678"). Se prohíbe mostrar el número de cédula completo o datos de diagnóstico en cabeceras o listas de selección sin autenticar. Origen: T-027.

### 8. Flujo principal
1. La persona ingresa al canal (aplicación web adaptable en navegador o bot de Telegram).
2. Si ingresa por Telegram, el bot muestra la política/aviso de privacidad (conforme a SPEC-001) y proporciona un botón para abrir la Mini App.
3. La persona ingresa la cédula y completa el proceso de verificación de identidad mediante el código de un solo uso recibido por SMS o correo electrónico.
4. Tras validar el código, el sistema establece la vinculación entre el canal y el paciente por 3 meses calendario.
5. Si el canal ya posee otros pacientes vinculados, el sistema mantiene cada asociación de forma independiente y agrega al nuevo paciente.
6. Antes de iniciar cualquier gestión, si existen múltiples pacientes vinculados, el sistema exige seleccionar al paciente a gestionar y despliega su identificación enmascarada (ej.: "Juan P. - CC ***1234") durante todo el procedimiento.
7. El usuario realiza la prevalidación o consulta el estado preliminar de las fórmulas del paciente seleccionado en la web o Mini App.

### 9. Flujos alternativos y de excepción
- A1. Vinculación vencida: Si la vinculación del paciente seleccionado ha superado los 3 meses calendario, el sistema muestra el mensaje de vencimiento e inicia de inmediato el flujo de revalidación enviando un nuevo código de verificación por SMS/correo.
- A2. Envío directo de fotos al chat de Telegram: Si la persona envía una foto o documento PDF directamente al chat del bot, el sistema no procesa el archivo, responde con una plantilla fija indicando que el trámite se realiza en la Mini App y proporciona el botón para abrirla.
- E1. Desvinculación voluntaria: Si el usuario solicita desvincular un paciente del canal, el sistema presenta una confirmación simple. Al ser aceptada, se elimina la vinculación del canal y cesan las notificaciones por ese medio, conservando intactos los registros y vías de contacto por SMS y correo.

### 10. Casos límite
- CL-005. Canal con múltiples pacientes donde la vinculación de uno cumple 3 meses calendario: el sistema exige revalidación únicamente para el paciente cuya vinculación venció, permitiendo continuar operando con normalidad a los demás pacientes cuya vinculación siga vigente en el mismo canal. Origen: DEC-10, T-017.
- CL-006. Desvinculación de un paciente con registros activos en el sistema: el sistema solicita confirmación simple y remueve la vinculación del canal sin anular ni modificar las prevalidaciones o datos del paciente. Origen: DEC-11.
- CL-007. Intento de consulta en un canal con vinculación vencida: se suspenden las notificaciones por ese canal y se deniega el acceso a la información hasta ingresar el código de revalidación, mientras las notificaciones por SMS y correo continúan llegando. Origen: contexto 3.3, DEC-12.

### 11. Criterios de aceptación
- AC-009. Dado un canal con dos pacientes vinculados en fechas distintas, cuando la vinculación de uno cumple 3 meses calendario, entonces solo esa vinculación expira y exige un código nuevo, mientras la otra vinculación del mismo canal permanece activa. Origen: DEC-10, T-017.
- AC-010. Dado un canal con una vinculación vencida tras 3 meses calendario, cuando el usuario intenta consultar información de ese paciente, entonces el sistema muestra el aviso de vencimiento e inicia de inmediato el flujo de código nuevo. Origen: DEC-12, T-017.
- AC-011. Dado un canal con múltiples pacientes vinculados, cuando el usuario inicia una gestión, entonces el sistema exige seleccionar explícitamente al paciente y muestra su identificación enmascarada con el formato "Nombre + Inicial apellido + CC ***1234" durante toda la sesión. Origen: contexto 3.3, T-027.
- AC-012. Dado un paciente vinculado a un canal, cuando el usuario solicita su desvinculación y acepta la confirmación simple, entonces la asociación se elimina del canal, cesan las notificaciones por esa vía y las prevalidaciones o registros del paciente permanecen intactos. Origen: DEC-11.
- AC-013. Dado un usuario que interactúa por Telegram, cuando intenta cargar documentos o consultar resultados, entonces el bot no procesa archivos en el chat y despliega un aviso con botón para ejecutar la acción dentro de la Mini App. Origen: contexto 3.1, DEC-P10.
- AC-014. Dado un usuario que completa exitosamente la verificación de identidad en un navegador web donde ya tiene un paciente vinculado, cuando se confirma la verificación, entonces el sistema vincula al nuevo paciente al mismo canal sin eliminar la vinculación previa. Origen: contexto 3.3, necesidad.
- AC-015. Dado un usuario en la aplicación web que presiona un enlace profundo hacia Telegram, cuando se genera la URL de redirección, entonces la URL no contiene cédula, diagnósticos, medicamentos ni ningún otro dato sensible del paciente. Origen: contexto 3.1, necesidad.
- AC-016. Dado un usuario con un paciente seleccionado, cuando ingresa a la opción de consulta de prevalidación en la web o Mini App, entonces el sistema muestra el estado preliminar de las fórmulas registradas. Origen: contexto 3.5, necesidad, DEC-P01.
- AC-017. Dado un usuario que accede a la aplicación web desde un navegador móvil, cuando interactúa con la interfaz, entonces la aplicación se adapta responsivamente sin exigir la instalación de un paquete PWA ni de una aplicación móvil. Origen: contexto 3.10, DEC-P10, T-012.
- AC-018. Dado un usuario que envía un documento o imagen directamente al chat de Telegram, cuando el sistema recibe el mensaje, entonces el bot responde de inmediato con una plantilla fija que informa que la carga se debe realizar en la Mini App y proporciona el botón para abrirla. Origen: DEC-P10.

### 12. Dependencias
- Verificación de identidad y códigos de un solo uso (SPEC-001).
- Servicio simulado de la EPS para consulta de afiliación y fórmulas (SPEC-008).
- Funcionalidad de agendamiento (SPEC-004), actualmente en evaluación para el MVP (DEC-P01).

### 13. Restricciones
- Equipo de cuatro personas y aproximadamente 8 semanas. Origen: contexto 3.9.
- Sin acceso a los sistemas de Disfarma y trabajo desde afuera. Origen: contexto 3.9.
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites de autorización. Origen: contexto 3.11.

### 14. Fuera de alcance
- Aplicación móvil instalable (nativa o PWA instalable) y WhatsApp. Origen: contexto 3.10, DEC-P10.
- Domicilio. Origen: contexto 3.10.
- Uso de datos reales de pacientes. Origen: contexto 3.10.
- Agendamiento y reserva de citas en el MVP preliminar hasta la aprobación de SPEC-004. Origen: DEC-P01.
- Mecanismo técnico de almacenamiento y persistencia de las sesiones de vinculación por canal: tema para arquitectura. Origen: RF-014.
- Implementación técnica del bot y Mini App en Telegram (bot API / webview): tema para arquitectura. Origen: RF-011, DEC-P10.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-10)
- OPEN-Q-002: Respondida (DEC-11)
- OPEN-Q-003: Respondida (DEC-12)

### 16. Trazabilidad
- HU-004: RF-011, RF-012, RF-013, RF-014, RF-015, RF-016, RF-017, RF-018, RF-019, RF-020, RF-021; RNF-009, RNF-010; BR-005, BR-006, BR-007, BR-008, BR-009; AC-009, AC-010, AC-011, AC-012, AC-013, AC-014, AC-015, AC-016, AC-017, AC-018; CL-005, CL-006, CL-007.
- HU-005: RF-013, RF-016, RF-018, RF-021; BR-008, BR-009; AC-011, AC-014, AC-016, AC-018.
- HU-006: RF-013, RF-016, RF-018, RF-021; BR-008, BR-009; AC-011, AC-014, AC-016, AC-018.
- HU-007: RF-013, RF-016, RF-021; BR-008, BR-009; AC-011, AC-014, AC-018.
- RF-011: Origen: contexto 3.1, necesidad, DEC-P01, DEC-P10; verificado por AC-013, AC-017.
- RF-012: Origen: contexto 3.1, necesidad, DEC-P10, T-026; verificado por AC-013.
- RF-013: Origen: contexto 3.3, necesidad, DEC-P10; verificado por AC-014.
- RF-014: Origen: DEC-10, T-017; verificado por AC-009.
- RF-015: Origen: DEC-12; verificado por AC-010.
- RF-016: Origen: contexto 3.3, necesidad, T-027; verificado por AC-011.
- RF-017: Origen: contexto 3.1, necesidad; verificado por AC-015.
- RF-018: Origen: contexto 3.5, necesidad, DEC-P01; verificado por AC-016.
- RF-019: Origen: DEC-11; verificado por AC-012.
- RF-020: Origen: DEC-11; verificado por AC-012.
- RF-021: Origen: DEC-P10; verificado por AC-018.
- RNF-009: Origen: contexto 3.1, necesidad; verificado con inspección de rutas, parámetros URL y análisis de tráfico de red.
- RNF-010: Origen: contexto 3.10, DEC-P10, T-012; verificado con prueba de acceso en navegador móvil sin aviso ni dependencia de instalación local.
- BR-005: Origen: contexto 3.3, DEC-10, T-017; verificado por AC-009, AC-010.
- BR-006: Origen: contexto 3.2, DEC-11; verificado por AC-012.
- BR-007: Origen: contexto 3.3, DEC-12; verificado por AC-010.
- BR-008: Origen: DEC-P10; verificado por AC-013, AC-018.
- BR-009: Origen: T-027; verificado por AC-011.
- CL-005: Origen: DEC-10, T-017; verificado por AC-009.
- CL-006: Origen: DEC-11; verificado por AC-012.
- CL-007: Origen: contexto 3.3, DEC-12; verificado por AC-010.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y contexto.
- Versión 1.0: incorporación de respuestas del equipo a OPEN-Q-001, OPEN-Q-002 y OPEN-Q-003 (DEC-10, DEC-11, DEC-12), pasando a estado Candidata.
- Versión 1.1: actualización conforme a las reglas 12 y 13. Desagregación de historias de usuario (HU-004 a HU-007), adición de AC-013 a AC-016 y completitud de la sección 16.
- Versión 1.2: actualización aplicando DEC-P01 y DEC-P10 (web adaptable sin instalación, Telegram con Mini App y chat de avisos con plantilla fija, fotos en el chat no procesadas, agendamiento en evaluación). Resolución de T-017 (vigencia de 3 meses calendario), T-026 (política bot alineada con aviso de privacidad de SPEC-001), T-027 (formato de identificación enmascarada del paciente) y T-028 (corrección de formato y sinonimia canal vs dispositivo). Adición de RF-021, RNF-010, BR-008, BR-009, AC-017 y AC-018.

## Verificación
- Completitud: cumple. La SPEC abarca todos los requisitos funcionales de canales, la delimitación de Telegram (Mini App y chat de avisos), la web adaptable y el enmascaramiento seguro de identidad.
- Consistencia interna: cumple. RF-011 a RF-021, BR-005 a BR-009, RNF-009, RNF-010, flujos y criterios de aceptación concuerdan plenamente entre sí.
- Consistencia con el contexto: cumple. Se alinean las decisiones transversales DEC-P01 y DEC-P10 con la sección 3 del contexto del producto y docs/decisiones.md.
- No ambigüedad: cumple. Se especifica exactamente el formato de identificación visual del paciente y las reglas de interacción en Telegram y web sin instalación.
- Verificabilidad: cumple. Cada RF y BR posee al menos un criterio de aceptación medible bajo la estructura Dado/Cuando/Entonces.
- Cobertura de actores: cumple. Se mantiene al menos una HU por cada actor con objetivo propio (paciente, cuidador, tutor y facilitador comunitario).
- Cobertura de AC: cumple. Todos los RF y BR cuentan con su correspondiente AC verificador.
- Trazabilidad: cumple. La sección 16 registra cada RF, RNF, BR y CL con su origen explícito y método/AC de verificación.
- No invención: cumple. Todos los cambios corresponden estrictamente a las decisiones del equipo (DEC-P01, DEC-P10) y hallazgos aprobados (T-017, T-026, T-027, T-028).
- Delimitación: cumple. Los aspectos técnicos de persistencia de sesión e integración de Mini App/bot de Telegram quedan remitidos a arquitectura en la sección 14.

## Siguiente paso
La SPEC-002 versión 1.2 en estado Candidata está lista para revisión final por parte del equipo. Confirmen el objetivo, alcance, decisiones DEC-P01/DEC-P10, reglas de negocio y criterios de aceptación. Al ser aprobada, quedará congelada para el Architecture Agent.
