<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.7-flash
Fecha: 2026-10-31 20:47
Petición: Corrige la SPEC-002 y publícala como versión 1.6 en estado Candidata, cambiando solo esto. (1) AC-020: la vinculación del 30 de noviembre vence el último día de febrero y queda vencida a las 00:00 del 1 de marzo, tanto en año común como bisiesto; quita la frase del día posterior en año bisiesto y deja CL-008 coherente. (2) Añade un AC por DEC-P25: en el día de vencimiento a las 23:59 hora de Colombia la vinculación sigue vigente, y a las 00:00 del día siguiente está vencida. (3) Añade dos AC por DEC-P27: un segundo paciente en el mismo canal exige aceptar el aviso; reactivar una vinculación vencida no exige aceptarlo otra vez. (4) AC-013 vuelve a tratar solo que Telegram no procesa archivos en el chat y ofrece el botón de la Mini App; añade un AC con el recorrido observable por la web y otro por la Mini App: aceptar el aviso, verificar identidad, vincular, cargar documentos, confirmar la lectura y ver el resultado preliminar. Actualiza trazabilidad e historial. No inventes reglas.
-->

# SPEC-002. Canales, vinculación y gestión multicanal - Versión 1.6

Estado: Candidata
Modo: Iteración
Necesidad original: "Canales, vinculación y selección de paciente. La aplicación web y el bot de Telegram permiten el flujo completo: verificar identidad, vincular el canal, cargar documentos, prevalidar, agendar, consultar el estado, ver el código de entrega, cancelar, desvincular y revocar. El bot solo interactúa después de que la persona lo inicia y publica una política de privacidad. Después de verificar la identidad, el chat o el navegador queda vinculado al paciente; un mismo canal puede quedar vinculado a varios pacientes sin límite y, si hay más de uno, se exige escoger el paciente antes de cada gestión y se muestra durante toda la gestión. La vinculación vence a los 3 meses y se reactiva con un nuevo código; mientras está vencida no muestra información, no permite gestiones y no recibe notificaciones por ese canal, aunque los SMS y correos continúan. Se puede desvincular un paciente. La web ofrece un enlace profundo al bot sin cédula, diagnósticos, medicamentos ni otros datos sensibles. El usuario consulta el estado de cada fórmula, las citas con punto y ventana, y el código de entrega en QR y numérico."
Épica: EPIC-002

## Análisis
- Objetivo: administrar los canales de interacción (aplicación web adaptable y bot de Telegram con Mini App), la vinculación segura de pacientes tras la verificación de identidad (exigiendo cédula y código si no hay vinculación vigente, sin pedirlo de nuevo si la vinculación está vigente a pesar de los datos de Telegram), la selección explícita de paciente sin exponer datos sensibles (identificación en pantalla únicamente como `CC ***1234`), la expiración e independencia de las vinculaciones a los 3 meses calendario vigentes todo el día de vencimiento en hora de Colombia y vencidas a las 00:00 del día siguiente (con ajuste al último día del mes si la fecha exacta no existe), la reactivación mediante código nuevo, la desvinculación voluntaria y los enlaces profundos seguros.
- Alcance inicial: interacción multicanal mediante aplicación web responsiva (sin instalación) y Telegram (chat para avisos de plantilla fija que abren la Mini App y no identifican al paciente, y Mini App para gestiones), vinculación individual o múltiple por canal, vencimiento a los 3 meses calendario (vigentes todo el día de vencimiento hasta las 00:00 del día siguiente, con ajuste al último día del mes si la fecha no existe), reactivación mediante código de verificación sin exigir cédula de nuevo, desvinculación con confirmación y consulta de estado de fórmulas y prevalidaciones preliminares.
- Actores: paciente, cuidador, tutor, facilitador comunitario.
- Contexto aplicable: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8, 3.10.

## Modelo de dominio
- Canal: aplicación web adaptable (en navegador) o chat/Mini App de Telegram utilizado por la persona para interactuar con el sistema. Origen: contexto 3.1, DEC-P10.
- Vinculación: asociación entre un canal y un paciente después de verificar la identidad. Un canal puede tener varias vinculaciones y cada vinculación es independiente. Origen: contexto 3.3, DEC-10.
- Paciente: afiliado cuyos datos provienen de la EPS simulada. Origen: contexto 2.3.
- Código de entrega: código de un solo uso, en formato QR y numérico, ligado a una cita (funcionalidad de agendamiento dependiente de SPEC-004, en evaluación para el MVP según DEC-P01). Origen: contexto 2.4, 3.5, DEC-P01.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- DEC-P21 y DEC-P25: afecta CL-008 y AC-020. Se unifica el tratamiento del 30 de noviembre para que venza el último día de febrero (28 o 29 en bisiesto) y quede vencida a las 00:00 del 1 de marzo en ambos casos, eliminando la frase de día posterior en año bisiesto.
- DEC-P25: afecta RF-014, BR-005 y añade AC-026. Se añade la verificación explícita de los dos lados del límite temporal en el día de vencimiento (vigente a las 23:59 hora de Colombia y vencida a las 00:00 del día siguiente).
- DEC-P27: afecta RF-012 y añade AC-027 y AC-028. Se valida que un segundo paciente en el mismo canal exige aceptar el aviso de privacidad, mientras que reactivar una vinculación vencida no exige aceptarlo otra vez.
- DEC-P10: afecta AC-013, que se restringe exclusivamente a verificar que el chat de Telegram no procesa archivos y ofrece el botón de la Mini App. Se añaden AC-029 (recorrido observable por la web) y AC-030 (recorrido observable por la Mini App) cubriendo: aceptar aviso, verificar identidad, vincular, cargar documentos, confirmar lectura OCR y ver resultado preliminar.
- Actualización de trazabilidad e historial de cambios conforme a la adición de AC-026 a AC-030.

## Preguntas de aclaración
- OPEN-Q-001. ¿En qué instante exacto vence una vinculación a los 3 meses calendario? (Origen: PREG-030 / H-001). Estado: Respondida (DEC-P25).
- OPEN-Q-002. ¿La reactivación de una vinculación vencida exige ingresar cédula y código, o únicamente el código nuevo? (Origen: PREG-031 / H-002). Estado: Respondida (DEC-P26).
- OPEN-Q-003. ¿Cuál es el alcance exacto de «una sola aceptación» del aviso de privacidad? (Origen: PREG-032 / H-003). Estado: Respondida (DEC-P27).
- OPEN-Q-033. ¿La vinculación en Telegram corresponde al chat privado de la persona o a su cuenta global de Telegram? (Origen: PREG-033 / H-006). Crítica: no. Estado: Pendiente. Responsable: equipo.
- OPEN-Q-035. ¿Un archivo o imagen enviado directamente al chat del bot puede ser conservado o almacenado temporalmente? (Origen: PREG-035 / H-008). Crítica: no. Estado: Pendiente. Responsable: equipo.
- OPEN-Q-034. ¿Cómo debe proceder el sistema si dos pacientes vinculados al mismo canal tienen exactamente los mismos últimos 4 dígitos de cédula? (Origen: PREG-034 / H-009). Crítica: no. Estado: Pendiente. Responsable: equipo.
- OPEN-Q-036. ¿Se requiere ingresar un código nuevo para revocar el consentimiento de un paciente si el canal ya cuenta con vinculación vigente? (Origen: PREG-036 / H-011). Crítica: no. Estado: Pendiente. Responsable: equipo.
- OPEN-Q-037. ¿Qué notificaciones específicas existen en el MVP sin la funcionalidad de agendamiento activa? (Origen: PREG-037 / H-012). Crítica: no. Estado: Pendiente. Responsable: equipo.

## Especificación

### 1. Objetivo
Garantizar el acceso multicanal seguro mediante una aplicación web adaptable sin instalación y un bot de Telegram integrado con Mini App, administrando la vinculación de múltiples pacientes por canal, su expiración independiente a los 3 meses calendario (vigentes todo el día de vencimiento en hora de Colombia y vencidas a las 00:00 del día siguiente, ajustando al último día del mes si la fecha no existe), la reactivación mediante código nuevo sin exigir cédula, la selección explícita de paciente mediante enmascaramiento seguro (`CC ***1234`), la autenticación exigiendo cédula y código cuando no hay vinculación vigente en la Mini App (sin pedir código nuevo con vinculación vigente), la aceptación previa única del aviso de privacidad antes de solicitar cédula y las operaciones de desvinculación y consulta.

### 2. Contexto
El sistema opera a través de una aplicación web adaptable (en navegador) y un bot de Telegram con Mini App. Los identificadores de los canales (chats o navegadores) no constituyen prueba de identidad, por lo que la vinculación requiere la verificación previa mediante cédula y código de un solo uso enviado por SMS y correo.
Decisiones del equipo:
- DEC-P01. La prevalidación completa entra al MVP, en web y en Telegram. El agendamiento (SPEC-004) queda en evaluación. Origen: docs/decisiones.md.
- DEC-P10. Una sola interfaz web, adaptable al celular y sin instalación (contexto 3.10), que se usa de dos formas: en el navegador y como Mini App de Telegram. El chat del bot solo lleva avisos con plantilla fija y botones que abren la Mini App. La identidad sigue exigiendo cédula + código también dentro de la Mini App. Una foto enviada al chat no se procesa. Origen: docs/decisiones.md (T-012, PREG-007).
- DEC-P20. El paciente se identifica en pantalla solo con los últimos 4 dígitos de la cédula (`CC ***1234`). Los avisos del chat no identifican al paciente: abren la Mini App. Responde a T-027. Origen: docs/decisiones.md.
- DEC-P21. Una vinculación vence a los 3 meses calendario, el mismo día del mes. Si ese día no existe en el mes de vencimiento, vence el último día de ese mes. Responde a T-017. Origen: docs/decisiones.md.
- DEC-P22. Precisa DEC-P10: los datos de Telegram nunca prueban la identidad. La Mini App exige cédula y código cuando el chat no tiene una vinculación vigente con ese paciente; con vinculación vigente no se pide un código nuevo en cada gestión (contexto 3.3). Origen: docs/decisiones.md.
- DEC-P25. La vinculación sigue vigente todo el día de vencimiento, en hora de Colombia, y queda vencida a las 00:00 del día siguiente. Responde a PREG-030. Origen: docs/decisiones.md.
- DEC-P26. Reactivar una vinculación vencida exige solo un código nuevo. Cédula y código se exigen en una vinculación nueva. Precisa DEC-P22. Responde a PREG-031. Origen: docs/decisiones.md.
- DEC-P27. La aceptación del aviso de privacidad es una por paciente y canal: no se repite al reactivar, pero sí con un segundo paciente en el mismo canal. Responde a PREG-032. Origen: docs/decisiones.md.
- DEC-10. La expiración de la vinculación a los 3 meses calendario es independiente por cada vinculación entre un canal y un paciente. Un mismo canal puede conservar pacientes con vinculación vigente mientras otra vinculación vence. Se reactiva con un nuevo código solo para ese paciente. Responde a OPEN-Q-001 (T-017).
- DEC-11. La desvinculación voluntaria de un paciente requiere una confirmación simple por parte del usuario antes de eliminar la asociación del canal. No elimina datos y detiene las notificaciones por ese canal, manteniendo los SMS y correos. (Nota: las acciones de no cancelar citas, no anular códigos de entrega y no liberar reservas están sujetas a la activación del agendamiento en evaluación de SPEC-004). Responde a OPEN-Q-002.
- DEC-12. Cuando un canal intenta realizar cualquier gestión o consulta con una vinculación vencida (más de 3 meses calendario), el sistema muestra el mensaje de vinculación vencida e inicia de inmediato el flujo para solicitar un nuevo código de verificación. Responde a OPEN-Q-003.

### 3. Alcance
- Uso de la aplicación web adaptable (sin instalación) y bot de Telegram (chat de avisos + Mini App) para la gestión multicanal con paridad de recorrido.
- Vinculación y gestión de múltiples pacientes en un mismo canal sin límite de asociatividad.
- Vencimiento y renovación independiente de cada vinculación a los 3 meses calendario (manteniéndose vigente todo el día de vencimiento en hora de Colombia hasta las 00:00 del día siguiente, ajustando al último día del mes si el día de vencimiento no existe en el calendario).
- Reactivación de vinculaciones vencidas exigiendo únicamente un código nuevo de verificación (sin reingresar cédula).
- Selección obligatoria del paciente a gestionar previa a cada trámite, mostrada en pantalla exclusivamente mediante el formato enmascarado `CC ***1234`.
- Presentación y aceptación única del aviso de privacidad por paciente y canal (mismo y único aviso definido en SPEC-001/RF-001) antes de solicitar cualquier dato como la cédula.
- Autenticación exigiendo cédula y código en la Mini App cuando no exista vinculación vigente, evitando pedir código nuevo cuando la vinculación ya se encuentra vigente.
- Desvinculación voluntaria de un paciente por canal con confirmación simple.
- Generación de enlaces profundos seguros hacia la Mini App o bot de Telegram sin incluir datos sensibles en la URL.
- Consulta de estado de fórmulas y prevalidaciones preliminares en ambas interfaces (web y Mini App) y de citas con punto/ventana y códigos de entrega QR/numérico cuando se active la funcionalidad de agendamiento de SPEC-004.

### 4. Actores e historias de usuario
Actores: paciente, cuidador, tutor, facilitador comunitario.
- HU-004. Como paciente, quiero vincular mi canal preferido (navegador web o Telegram) y consultar el estado de mis prevalidaciones, para hacer el seguimiento de mis fórmulas sin realizar desplazamientos innecesarios.
- HU-005. Como cuidador, quiero vincular y gestionar las pre-dispensaciones de la persona a mi cuidado desde mi canal, para ayudarle a coordinar la revisión de sus medicamentos de manera oportuna.
- HU-006. Como tutor, quiero vincular a mi representado en un canal seguro y acceder a sus trámites de prevalidación, para garantizar el seguimiento continuo de sus tratamientos farmacéuticos.
- HU-007. Como facilitador comunitario, quiero vincular a múltiples pacientes en mi chat o navegador y elegir a cuál gestiono en cada trámite, para brindar apoyo a varios miembros de la comunidad con absoluta claridad e independencia.

### 5. Requisitos funcionales
- RF-011. El sistema debe ofrecer el recorrido completo de uso (incluyendo verificación de identidad, vinculación, carga de documentos, prevalidación, consulta de estado, desvinculación y revocación) con paridad de funcionamiento tanto en la aplicación web adaptable (sin instalación) como en Telegram (mediante Mini App para interacción y chat para notificaciones). El agendamiento, la visualización del código de entrega y la cancelación de citas quedan sujetos a la activación de la funcionalidad de agendamiento (SPEC-004 en evaluación). Origen: contexto 3.1, necesidad, DEC-P01, DEC-P10.
- RF-012. El bot de Telegram solo debe interactuar después de que la persona lo inicie de manera voluntaria, presentando el aviso de privacidad de Pharma Express (el cual es el mismo y único aviso definido en SPEC-001/RF-001, aplicándose una sola aceptación por paciente y canal según DEC-P27), y transmitiendo en el chat avisos informativos de plantilla fija estrictamente exentos de nombres, medicamentos, diagnósticos y datos de identificación del paciente, provistos con botones que abren la Mini App. Origen: contexto 3.1, necesidad, DEC-P10, DEC-P27, T-026, SPEC-001/RF-001.
- RF-013. El sistema debe permitir vincular un canal (chat de Telegram o navegador web) a un paciente tras verificar su identidad satisfactoriamente mediante cédula y código de un solo uso válido, admitiendo asociar múltiples pacientes a un mismo canal sin límite. Los datos de Telegram nunca prueban la identidad; la Mini App debe exigir cédula y código cuando el chat no tenga una vinculación vigente con el paciente, y no debe pedir un código nuevo en cada gestión si ya existe una vinculación vigente. Cualquier fallo en la validación del código o una cédula inexistente no debe crear ni registrar ninguna vinculación. Origen: contexto 3.3, necesidad, DEC-P10, DEC-P22.
- RF-014. El sistema debe evaluar la expiración de la vinculación de forma independiente para cada asociación entre un canal y un paciente a los 3 meses calendario de haber sido establecida o renovada. La vinculación permanecerá plenamente vigente durante todo el día calendario de vencimiento en hora de Colombia (GMT-5), quedando formalmente vencida a las 00:00 del día siguiente. Si el día numérico correspondiente no existe en el mes de vencimiento, la vinculación vence el último día de ese mes. Origen: DEC-10, DEC-P21, DEC-P25, T-017.
- RF-015. Cuando un canal intente realizar una gestión o consulta utilizando una vinculación vencida, el sistema debe mostrar un mensaje explícito de vinculación vencida e iniciar de inmediato el flujo de revalidación solicitando únicamente un nuevo código de verificación (sin exigir reingresar la cédula). Origen: DEC-12, DEC-P26.
- RF-016. Si un canal tiene más de un paciente vinculado, el sistema debe exigir la selección explícita del paciente a gestionar antes de iniciar cualquier trámite y mantener visible su identificación enmascarada únicamente en formato de cédula enmascarada (`CC ***1234`) durante toda la gestión, sin mostrar nombres ni iniciales. Origen: contexto 3.3, necesidad, DEC-P20, T-027.
- RF-017. La aplicación web debe ofrecer enlaces profundos hacia Telegram que redirijan a la persona sin incluir cédula, diagnósticos, medicamentos ni ningún otro dato sensible en la URL. Origen: contexto 3.1, necesidad.
- RF-018. El sistema debe permitir al usuario consultar el estado de prevalidación de cada fórmula tanto en la aplicación web adaptable como en la Mini App de Telegram. La visualización de citas asignadas (con punto de dispensación y ventana de 1 hora) y el código de entrega (QR y numérico) estará disponible cuando la funcionalidad de agendamiento (SPEC-004) sea activada. Origen: contexto 3.4, 3.5, necesidad, DEC-P01.
- RF-019. El sistema debe permitir la desvinculación voluntaria de un paciente por canal a solicitud del usuario, exigiendo una confirmación simple antes de proceder. Origen: DEC-11.
- RF-020. La desvinculación voluntaria solo debe eliminar la asociación entre el canal y el paciente específico, deteniendo las notificaciones por dicho canal sin eliminar datos del paciente y manteniendo los envíos por SMS y correo electrónico. Las acciones de no cancelar citas, no anular códigos de entrega y no liberar reservas están condicionadas a la activación de la funcionalidad de agendamiento en evaluación (SPEC-004). Origen: DEC-11, DEC-P01.
- RF-085. El sistema no debe procesar fotos ni documentos enviados como mensajes de archivo o imagen directamente al chat de Telegram; en su lugar, debe responder con un aviso de plantilla fija y un botón que dirija a la persona a la Mini App para realizar la carga. Origen: DEC-P10.

### 6. Requisitos no funcionales
- RNF-009. Seguridad y privacidad en canales. Los identificadores de canales (ID de chat de Telegram o cookies/sesiones de navegador) no deben considerarse prueba de identidad. Los enlaces profundos, parámetros de URL y avisos informativos del bot deben estar estrictamente libres de datos sensibles de salud, diagnósticos, medicamentos o de identificación. Se verifica mediante inspección de rutas, parámetros URL y análisis de tráfico de red. Origen: contexto 3.1, necesidad.
- RNF-019. Usabilidad y arquitectura web sin instalación. La aplicación web debe ser totalmente adaptable a navegadores móviles y de escritorio sin requerir instalación (se excluye empaquetado PWA instalable o aplicación nativa). Se verifica mediante prueba de acceso en navegador móvil sin aviso ni dependencia de instalación local. Origen: contexto 3.10, DEC-P10, T-012.

### 7. Reglas de negocio
- BR-005. La vigencia de cada vinculación entre un canal y un paciente es de exactamente 3 meses calendario desde el momento de su verificación, evaluándose de forma independiente por cada paciente asociado a ese canal. La vinculación se mantiene vigente durante todo el día de vencimiento en hora de Colombia, expirando a las 00:00 del día siguiente. Si el día del mes en que se realizó la vinculación no existe en el mes de vencimiento, la vinculación vence el último día de dicho mes. Origen: contexto 3.3, DEC-10, DEC-P21, DEC-P25, T-017.
- BR-006. La desvinculación voluntaria de un paciente en un canal detiene únicamente las notificaciones y accesos de ese paciente en ese canal específico, sin alterar sus prevalidaciones ni sus datos registrados en la EPS simulada. Las reglas relativas a no alterar citas ni reservas aplican en caso de estar activada la funcionalidad de agendamiento de SPEC-004 (en evaluación). Origen: contexto 3.2, DEC-11, DEC-P01.
- BR-007. Una vinculación vencida bloquea la consulta de información, la ejecución de gestiones y la recepción de notificaciones en ese canal para el paciente afectado hasta completar la revalidación ingresando únicamente un nuevo código de verificación (sin reingresar cédula), manteniendo la recepción de notificaciones por SMS y correo electrónico, y sin interrumpir otros canales vinculados ni a otros pacientes asociados al mismo canal. Origen: contexto 3.3, DEC-12, DEC-P26.
- BR-008. Operación de Telegram mediante Mini App. El chat de Telegram se limita a la recepción de mensajes informativos mediante plantillas fijas y botones de acción, exentos de nombres, medicamentos, diagnósticos y datos de identificación. Toda interacción que requiera ingreso de datos, carga de documentos, confirmación de OCR o consulta de resultados se ejecuta dentro de la Mini App. Cualquier archivo o imagen recibido directamente en el chat es ignorado operacionalmente y responde con la redirección a la Mini App. Origen: DEC-P10.
- BR-009. Máscara de privacidad para la identificación del paciente. La identificación del paciente seleccionado en pantalla y en la Mini App debe estructurarse obligatoriamente como `CC ***1234` (tipo de documento y últimos 4 dígitos de la cédula). Se prohíbe mostrar nombres, apellidos, iniciales, el número de cédula completo o datos de diagnóstico en cabeceras o listas de selección. Los avisos del chat de Telegram no identifican al paciente y solo abren la Mini App. Origen: DEC-P20, T-027.

### 8. Flujo principal
1. La persona ingresa al canal (aplicación web adaptable en navegador o bot de Telegram).
2. Si ingresa por Telegram o por la web, antes de pedir la cédula o cualquier dato personal, el sistema presenta el aviso de privacidad y tratamiento de datos (el cual es el mismo y único aviso de SPEC-001/RF-001) y exige su aceptación explícita (aplicando una sola vez por paciente y canal según DEC-P27). En Telegram, el bot despliega este aviso con un botón para abrir la Mini App.
3. Tras la aceptación del aviso de privacidad, si el canal no cuenta con una vinculación vigente con el paciente, la persona ingresa su número de cédula y completa el proceso de verificación de identidad mediante el código de un solo uso recibido por SMS o correo electrónico (incluso si interactúa dentro de la Mini App de Telegram). Si el canal ya cuenta con vinculación vigente, la Mini App no exige un código nuevo.
4. Tras validar el código (si no existía vinculación vigente), el sistema establece la vinculación entre el canal y el paciente por 3 meses calendario (vigente todo el día de vencimiento hasta las 00:00 del día siguiente, o hasta el último día del mes si la fecha no existe).
5. Si el canal ya posee otros pacientes vinculados, el sistema mantiene cada asociación de forma independiente y agrega al nuevo paciente.
6. Antes de iniciar cualquier gestión, si existen múltiples pacientes vinculados, el sistema exige seleccionar al paciente a gestionar y despliega exclusivamente su identificación enmascarada (`CC ***1234`) durante todo el procedimiento.
7. El usuario realiza la prevalidación o consulta el estado preliminar de las fórmulas del paciente seleccionado tanto en la web como en la Mini App.

### 9. Flujos alternativos y de excepción
- A1. Vinculación vencida: Si la vinculación del paciente seleccionado ha superado los 3 meses calendario (tras finalizar el día de vencimiento a las 00:00), el sistema muestra el mensaje de vencimiento e inicia de inmediato el flujo de revalidación solicitando únicamente un nuevo código de verificación por SMS/correo sin exigir cédula.
- A2. Envío directo de fotos al chat de Telegram: Si la persona envía una foto o documento PDF directamente al chat del bot, el sistema no procesa el archivo, responde con una plantilla fija indicando que el trámite se realiza en la Mini App y proporciona el botón para abrirla.
- E1. Desvinculación voluntaria: Si el usuario solicita desvincular un paciente del canal, el sistema presenta una confirmación simple. Al ser aceptada, se elimina la vinculación del canal y cesan las notificaciones por ese medio, conservando intactos los registros y vías de contacto por SMS y correo.

### 10. Casos límite
- CL-005. Canal con múltiples pacientes donde la vinculación de uno cumple 3 meses calendario: el sistema exige revalidación únicamente para el paciente cuya vinculación venció, permitiendo continuar operando con normalidad a los demás pacientes cuya vinculación siga vigente en el mismo canal. Origen: DEC-10, T-017.
- CL-006. Desvinculación de un paciente con registros activos en el sistema: el sistema solicita confirmación simple y remueve la vinculación del canal sin anular ni modificar las prevalidaciones o datos del paciente. Origen: DEC-11.
- CL-007. Intento de consulta o gestión en un canal con vinculación vencida: se suspenden las notificaciones por ese canal y se deniega el acceso a la información hasta ingresar únicamente el código de revalidación, mientras las notificaciones por SMS y correo continúan llegando. Origen: contexto 3.3, DEC-12, DEC-P26.
- CL-008. Vinculación realizada en un día inexistente en el mes de vencimiento: si una vinculación se establece el 30 de noviembre, al cumplirse los 3 meses calendario en febrero (mes que no tiene día 30), la vinculación vence el último día de febrero (28 o 29 en año bisiesto) y queda formalmente vencida a las 00:00 del 1 de marzo en ambos casos. Origen: DEC-P21, DEC-P25, T-017.

### 11. Criterios de aceptación
- AC-009. Dado un canal con dos pacientes vinculados en fechas distintas, cuando la vinculación de uno cumple 3 meses calendario (permaneciendo vigente durante todo el día de vencimiento hasta las 00:00 del día siguiente), entonces solo esa vinculación expira a partir de las 00:00 exigiendo un código nuevo para reactivarse, mientras la otra vinculación del mismo canal permanece activa. Origen: DEC-10, DEC-P25, T-017.
- AC-010. Dado un canal con una vinculación vencida tras 3 meses calendario, cuando el usuario intenta consultar información o realizar una gestión de ese paciente, entonces el sistema muestra el aviso de vencimiento e inicia de inmediato el flujo de código nuevo exigiendo únicamente el código de verificación sin pedir la cédula. Origen: DEC-12, DEC-P26, T-017.
- AC-011. Dado un canal con múltiples pacientes vinculados, cuando el usuario inicia una gestión, entonces el sistema exige seleccionar explícitamente al paciente y muestra su identificación enmascarada únicamente en formato `CC ***1234` durante toda la sesión. Origen: contexto 3.3, DEC-P20, T-027.
- AC-012. Dado un paciente vinculado a un canal, cuando el usuario solicita su desvinculación y acepta la confirmación simple, entonces la asociación se elimina del canal, cesan las notificaciones por esa vía y las prevalidaciones o registros del paciente permanecen intactos. Origen: DEC-11.
- AC-013. Dado un usuario que envía un archivo o documento directamente al chat de Telegram, cuando el sistema lo recibe, entonces no procesa el archivo en el chat y responde con un mensaje que incluye el botón para abrir la Mini App. Origen: DEC-P10.
- AC-014. Dado un usuario que completa exitosamente la verificación de identidad en un navegador web o Mini App donde ya tiene un paciente vinculado, cuando se confirma la verificación, entonces el sistema vincula al nuevo paciente al mismo canal sin eliminar la vinculación previa. Origen: contexto 3.3, necesidad.
- AC-015. Dado un usuario en la aplicación web que presiona un enlace profundo hacia Telegram, cuando se genera la URL de redirección, entonces la URL no contiene cédula, diagnósticos, medicamentos ni ningún otro dato sensible del paciente. Origen: contexto 3.1, necesidad.
- AC-016. Dado un usuario con un paciente seleccionado, cuando ingresa a la opción de consulta de prevalidación tanto en la web como en la Mini App, entonces el sistema muestra el estado preliminar de las fórmulas registradas con paridad en ambos canales. Origen: contexto 3.4, 3.5, necesidad, DEC-P01, H-005.
- AC-017. Dado un usuario que accede a la aplicación web desde un navegador móvil, cuando interactúa con la interfaz, entonces la aplicación se adapta responsivamente sin exigir la instalación de un paquete PWA ni de una aplicación móvil. Origen: contexto 3.10, DEC-P10, T-012.
- AC-018. Dado un usuario que envía un documento o imagen directamente al chat de Telegram, cuando el sistema recibe el mensaje, entonces el bot responde de inmediato con una plantilla fija que informa que la carga se debe realizar en la Mini App y proporciona el botón para abrirla. Origen: DEC-P10.
- AC-019. Dado un usuario que ingresa por cualquier canal (web o Telegram), cuando intenta iniciar el proceso de vinculación o verificación, entonces el sistema presenta el aviso de privacidad de SPEC-001/RF-001 (aplicando una sola vez por paciente y canal) y exige su aceptación antes de solicitar la cédula o cualquier otro dato personal. Origen: SPEC-001/RF-001, DEC-P27, T-026.
- AC-020. Dado un paciente cuya vinculación se realizó el 30 de noviembre, cuando transcurren los 3 meses calendario manteniendo plena vigencia durante todo el último día de febrero, entonces la vinculación queda formalmente vencida a las 00:00 del 1 de marzo, tanto en año común como en año bisiesto. Origen: DEC-P21, DEC-P25, T-017.
- AC-021. Dado un usuario que recibe avisos informativos en el chat del bot de Telegram, cuando los visualiza, entonces el aviso no contiene nombres, medicamentos, diagnósticos ni datos de identificación del paciente y proporciona un botón que abre la Mini App. Origen: DEC-P20, DEC-P27, T-027, H-007.
- AC-022. Dado un chat de Telegram sin vinculación vigente con el paciente, cuando la persona abre la Mini App, entonces el sistema exige cédula y código de un solo uso aunque Telegram envíe los datos del usuario. Origen: DEC-P10, DEC-P22.
- AC-023. Dado un paciente con una vinculación vencida en un canal, cuando el sistema genera notificaciones para ese paciente, entonces las notificaciones por ese canal quedan detenidas pero los envíos por SMS y correo electrónico continúan. Origen: contexto 3.3, DEC-12.
- AC-024. Dado un chat con vinculación vigente con el paciente, cuando la persona abre la Mini App para una gestión, entonces el sistema no pide un código nuevo. Origen: DEC-P22, contexto 3.3.
- AC-025. Dado un usuario que ingresa un código erróneo, vencido, agotado en intentos o una cédula inexistente en el flujo de vinculación, cuando el sistema valida la entrada, entonces rechaza la autenticación y no crea ni registra ninguna vinculación en el canal. Origen: H-010.
- AC-026. Dado un canal con una vinculación cuyo día de vencimiento es hoy, cuando el usuario interactúa a las 23:59 hora de Colombia, entonces la vinculación sigue vigente y permite la gestión; y cuando interactúa a las 00:00 del día siguiente, la vinculación está vencida y bloquea la gestión hasta reactivarla. Origen: DEC-P25.
- AC-027. Dado un canal que ya tiene un paciente vinculado habiendo aceptado el aviso de privacidad, cuando el usuario inicia la vinculación de un segundo paciente en ese mismo canal, entonces el sistema exige presentar y aceptar el aviso de privacidad antes de solicitar la cédula del segundo paciente. Origen: DEC-P27.
- AC-028. Dado un canal con una vinculación vencida cuyo aviso de privacidad ya fue aceptado al vincularse, cuando el usuario realiza el flujo de revalidación con el código nuevo, entonces el sistema no le exige aceptar el aviso de privacidad otra vez. Origen: DEC-P27.
- AC-029. Dado un usuario que accede por la aplicación web adaptable, cuando realiza el recorrido completo, entonces el sistema le permite de forma observable aceptar el aviso de privacidad, verificar su identidad mediante cédula y código, vincular el canal, cargar los documentos (fórmulas e historia clínica), confirmar la lectura del OCR y ver el resultado preliminar de la prevalidación. Origen: contexto 3.1, DEC-P01, DEC-P04, DEC-P10.
- AC-030. Dado un usuario que accede mediante la Mini App de Telegram, cuando realiza el recorrido completo, entonces el sistema le permite de forma observable aceptar el aviso de privacidad, verificar su identidad mediante cédula y código, vincular el canal, cargar los documentos (fórmulas e historia clínica), confirmar la lectura del OCR y ver el resultado preliminar de la prevalidación. Origen: contexto 3.1, DEC-P01, DEC-P04, DEC-P10.

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
- OPEN-Q-033: Pendiente
- OPEN-Q-034: Pendiente
- OPEN-Q-035: Pendiente
- OPEN-Q-036: Pendiente
- OPEN-Q-037: Pendiente

### 16. Trazabilidad
- HU-004: RF-011, RF-012, RF-013, RF-014, RF-015, RF-016, RF-017, RF-018, RF-019, RF-020, RF-085; RNF-009, RNF-019; BR-005, BR-006, BR-007, BR-008, BR-009; AC-009, AC-010, AC-011, AC-012, AC-013, AC-014, AC-015, AC-016, AC-017, AC-018, AC-019, AC-020, AC-021, AC-022, AC-023, AC-024, AC-025, AC-026, AC-027, AC-028, AC-029, AC-030; CL-005, CL-006, CL-007, CL-008.
- HU-005: RF-011, RF-013, RF-016, RF-018, RF-085; BR-008, BR-009; AC-011, AC-013, AC-014, AC-016, AC-018, AC-021, AC-022, AC-024, AC-025, AC-029, AC-030.
- HU-006: RF-011, RF-013, RF-016, RF-018, RF-085; BR-008, BR-009; AC-011, AC-013, AC-014, AC-016, AC-018, AC-021, AC-022, AC-024, AC-025, AC-029, AC-030.
- HU-007: RF-011, RF-013, RF-016, RF-085; BR-008, BR-009; AC-011, AC-013, AC-014, AC-018, AC-021, AC-022, AC-025, AC-027.
- RF-011: Origen: contexto 3.1, necesidad, DEC-P01, DEC-P10; verificado por AC-017, AC-029, AC-030.
- RF-012: Origen: contexto 3.1, necesidad, DEC-P10, DEC-P27, T-026, SPEC-001/RF-001; verificado por AC-019, AC-021, AC-027, AC-028.
- RF-013: Origen: contexto 3.3, necesidad, DEC-P10, DEC-P22; verificado por AC-014, AC-022, AC-024, AC-025, AC-029, AC-030.
- RF-014: Origen: DEC-10, DEC-P21, DEC-P25, T-017; verificado por AC-009, AC-020, AC-026.
- RF-015: Origen: DEC-12, DEC-P26; verificado por AC-010, AC-026, AC-028.
- RF-016: Origen: contexto 3.3, necesidad, DEC-P20, T-027; verificado por AC-011.
- RF-017: Origen: contexto 3.1, necesidad; verificado por AC-015.
- RF-018: Origen: contexto 3.4, 3.5, necesidad, DEC-P01; verificado por AC-016, AC-029, AC-030.
- RF-019: Origen: DEC-11; verificado por AC-012.
- RF-020: Origen: DEC-11, DEC-P01; verificado por AC-012.
- RF-085: Origen: DEC-P10; verificado por AC-013, AC-018.
- RNF-009: Origen: contexto 3.1, necesidad; verificado con inspección de rutas, parámetros URL y análisis de tráfico de red.
- RNF-019: Origen: contexto 3.10, DEC-P10, T-012; verificado con prueba de acceso en navegador móvil sin aviso ni dependencia de instalación local.
- BR-005: Origen: contexto 3.3, DEC-10, DEC-P21, DEC-P25, T-017; verificado por AC-009, AC-010, AC-020, AC-024, AC-026.
- BR-006: Origen: contexto 3.2, DEC-11, DEC-P01; verificado por AC-012.
- BR-007: Origen: contexto 3.3, DEC-12, DEC-P26; verificado por AC-010, AC-023, AC-026, AC-028.
- BR-008: Origen: DEC-P10; verificado por AC-013, AC-018, AC-021, AC-030.
- BR-009: Origen: DEC-P20, T-027; verificado por AC-011, AC-021.
- CL-005: Origen: DEC-10, T-017; verificado por AC-009.
- CL-006: Origen: DEC-11; verificado por AC-012.
- CL-007: Origen: contexto 3.3, DEC-12, DEC-P26; verificado por AC-010, AC-023.
- CL-008: Origen: DEC-P21, DEC-P25, T-017; verificado por AC-020.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y contexto.
- Versión 1.0: incorporación de respuestas del equipo a OPEN-Q-001, OPEN-Q-002 y OPEN-Q-003 (DEC-10, DEC-11, DEC-12), pasando a estado Candidata.
- Versión 1.1: actualización conforme a las reglas 12 y 13. Desagregación de historias de usuario (HU-004 a HU-007), adición de AC-013 a AC-016 y completitud de la sección 16.
- Versión 1.2: actualización aplicando DEC-P01 y DEC-P10 (web adaptable sin instalación, Telegram con Mini App y chat de avisos con plantilla fija, fotos en el chat no procesadas, agendamiento en evaluación). Resolución de T-017 (vigencia de 3 meses calendario), T-026 (política bot alineada con aviso de privacidad de SPEC-001), T-027 (formato de identificación enmascarada del paciente) y T-028 (corrección de formato y sinonimia canal vs dispositivo). Adición de RF-021, RNF-010, BR-008, BR-009, AC-017 y AC-018.
- Versión 1.3: actualización aplicando DEC-P20 y DEC-P21 de docs/decisiones.md. Ajuste de identificación en pantalla únicamente a `CC ***1234` omitiendo nombres en RF-016, BR-009, flujo principal y AC-011. Adición de regla de vencimiento el último día del mes en RF-014 y BR-005, con CL-008 y AC-020 (ejemplo del 30 de noviembre a febrero). Declaración del aviso del bot como el mismo aviso único de SPEC-001/RF-001 exigido antes de pedir la cédula (Flujo principal, RF-012, AC-019). Adición de exigencia de cédula y código en Mini App (AC-022). Adición de suspensión de notificaciones en canal vencido manteniendo SMS y correo (AC-023). Adición de AC-021 para avisos del chat sin datos del paciente. Renumeración de RF-021 a RF-085 y RNF-010 a RNF-019. Marcación en RF-020, BR-006 y DEC-11 de aspectos de agendamiento como en evaluación de SPEC-004. Corrección tipográfica de "tráfico" en RNF-009 y "Análisis de impacto".
- Versión 1.4: actualización aplicando DEC-P22 de docs/decisiones.md. Reescribe AC-022 especificando que la Mini App exige cédula y código de un solo uso si no hay vinculación vigente, y añade AC-024 para comprobar que con vinculación vigente no se pide código nuevo al abrir la Mini App. Actualización de trazabilidad, análisis de impacto e historial.
- Versión 1.5: corrección integral a partir del informe de revisión S1. Incorporación de DEC-P25 (vigencia todo el día de vencimiento hasta las 00:00 del día siguiente), DEC-P26 (reactivación con código nuevo sin exigir cédula) y DEC-P27 (aceptación única del aviso de privacidad por paciente y canal). Corrección de A1, adición de AC negativos para autenticación fallida (AC-025), fortalecimiento de AC-013 e inclusión de paridad de canales, extensión de prohibición de datos sensibles en avisos (H-007), corrección ortográfica de RF-085 y registro formal de OPEN-Q para preguntas pendientes (PREG-033 a PREG-037).
- Versión 1.6: ajuste puntual según instrucciones del equipo: (1) AC-020 y CL-008 unificados para vencer el último día de febrero y quedar vencidos a las 00:00 del 1 de marzo tanto en año común como bisiesto, quitando la frase de día posterior en bisiesto; (2) adición de AC-026 (DEC-P25) comprobando vigencia a las 23:59 y vencimiento a las 00:00 del día siguiente; (3) adición de AC-027 y AC-028 (DEC-P27) para exigir aviso ante un segundo paciente y omitirlo en reactivación; (4) redefinición de AC-013 exclusivamente para tratamiento de archivos en el chat de Telegram y adición de AC-029 y AC-030 con el recorrido completo observable en la web y en la Mini App. Actualización completa de trazabilidad e impacto.

## Verificación
- Completitud: cumple. Revisé que la SPEC incorpore los puntos solicitados: el ajuste de AC-020 y CL-008 para el 1 de marzo a las 00:00 sin distinción de año bisiesto, AC-026 con los dos extremos del límite horario (23:59 / 00:00), AC-027 y AC-028 para el aviso de privacidad según DEC-P27, la focalización de AC-013 en el chat de Telegram y la inclusión de AC-029 y AC-030 con el recorrido observable en web y Mini App.
- Consistencia interna: cumple. Comparé CL-008 con AC-020, verificando que ambos indican exactamente que la vinculación del 30 de noviembre queda vencida a las 00:00 del 1 de marzo tanto en año común como bisiesto. Comparé RF-014, BR-005 y AC-026, verificando coherencia en el horario de corte. Comparé RF-012 con AC-027 y AC-028. Comparé RF-011 y DEC-P10 con AC-013, AC-029 y AC-030.
- Consistencia con el contexto: cumple. Comparé las decisiones DEC-P10, DEC-P21, DEC-P25 y DEC-P27 con la sección 3 del contexto del producto y docs/decisiones.md, comprobando total alineación.
- No ambigüedad: cumple. Los criterios AC-026, AC-027, AC-028, AC-029 y AC-030 especifican condiciones iniciales unívocas, acciones claras y resultados observables.
- Verificabilidad: cumple. Todos los criterios de aceptación AC-009 a AC-030 están formulados en estructura Dado/Cuando/Entonces y son directamente comprobables mediante pruebas funcionales de caja negra.
- Cobertura de actores: cumple. Las historias de usuario HU-004, HU-005, HU-006 y HU-007 cubren a paciente, cuidador, tutor y facilitador comunitario.
- Cobertura de AC: cumple. Todos los RF (RF-011 a RF-085) y BR (BR-005 a BR-009) cuentan con al menos un AC asignado.
- Trazabilidad: cumple. Cada RF, RNF, BR y CL está registrado en la sección 16 con su origen explícito y sus AC o método de verificación correspondiente.
- No invención: cumple. Se aplicaron únicamente los cambios explícitamente instruidos por el equipo sin agregar reglas no derivadas de las decisiones DEC-Pxx o del contexto.
- Delimitación: cumple. Los aspectos técnicos de persistencia de sesiones e implementación de la Mini App permanecen delimitados en la sección 14 fuera de alcance.

## Siguiente paso
La SPEC-002 versión 1.6 en estado Candidata está lista para revisión final por parte del equipo. Confirmen el objetivo, alcance, decisiones DEC-P01, DEC-P10, DEC-P20, DEC-P21, DEC-P22, DEC-P25, DEC-P26 y DEC-P27, reglas de negocio y criterios de aceptación. Al ser aprobada, quedará congelada para el Architecture Agent.
