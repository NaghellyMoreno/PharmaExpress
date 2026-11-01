<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash
Fecha: 2026-11-01 14:23
Petición: El equipo aprueba la SPEC-002
-->

# SPEC-002. Canales, vinculación y gestión multicanal - Versión 1.11

Estado: Aprobada y congelada
Modo: Aprobación
Necesidad original: "Canales, vinculación y selección de paciente. La aplicación web y el bot de Telegram permiten el flujo completo: verificar identidad, vincular el canal, cargar documentos, prevalidar, agendar, consultar el estado, ver el código de entrega, cancelar, desvincular y revocar. El bot solo interactúa después de que la persona lo inicia y publica una política de privacidad. Después de verificar la identidad, el chat o el navegador queda vinculado al paciente; un mismo canal puede quedar vinculado a varios pacientes sin límite y, si hay más de uno, se exige escoger el paciente antes de cada gestión y se muestra durante toda la gestión. La vinculación vence a los 3 meses y se reactiva con un nuevo código; mientras está vencida no muestra información, no permite gestiones y no recibe notificaciones por ese canal, aunque los SMS y correos continúan. Se puede desvincular un paciente. La web ofrece un enlace profundo al bot sin cédula, diagnósticos, medicamentos ni otros datos sensibles. El usuario consulta el estado de cada fórmula, las citas con punto y ventana, y el código de entrega en QR y numérico."
Épica: EPIC-002

## Análisis
- Objetivo: administrar los canales de interacción (aplicación web adaptable y bot de Telegram con Mini App), la vinculación segura de pacientes tras la verificación de identidad (exigiendo cédula y código solo en una vinculación nueva, reactivando una vinculación vencida solo con código nuevo y sin pedir código nuevo si la vinculación está vigente a pesar de los datos de Telegram), la selección explícita de paciente sin exponer datos sensibles (identificación en pantalla únicamente como `CC ***1234`), la expiración e independencia de las vinculaciones a los 3 meses calendario vigentes todo el día de vencimiento en hora de Colombia y vencidas a las 00:00 del día siguiente (con ajuste al último día del mes si la fecha exacta no existe), la reactivación mediante código nuevo, la desvinculación voluntaria y los enlaces profundos seguros.
- Alcance inicial: interacción multicanal mediante aplicación web responsiva (sin instalación) y Telegram (chat para avisos de plantilla fija que abren la Mini App y no identifican al paciente, y Mini App para gestiones), vinculación individual o múltiple por canal, exigencia de cédula y código solo para vinculaciones nuevas, vencimiento a los 3 meses calendario (vigentes todo el día de vencimiento hasta las 00:00 del día siguiente, con ajuste al último día del mes si la fecha no existe), reactivación mediante código de verificación sin exigir cédula de nuevo, desvinculación con confirmación y consulta de estado de fórmulas y prevalidaciones preliminares.
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
- DEC-P29: afecta RNF-009. La verificación no depende de user_id, chat_id, username ni nombre visible. Responde PREG-002 y aporta la verificación de REQ-009.
- DEC-P37 y DEC-P52: afectan RF-013. Se indica que la vinculación es del chat sea quien sea que lo use y que el bot solo opera en chats privados. OPEN-Q-033 queda Respondida (DEC-P37, DEC-P52). Se adicionan AC-031 y AC-032.
- DEC-P38: afecta RF-011. OPEN-Q-036 queda Respondida (DEC-P38). Se adiciona AC-033 para revocación sin pedir código nuevo con vinculación vigente.
- DEC-P39: afecta RF-013, paso 3 del flujo principal y AC-022. OPEN-Q-070 queda Respondida (DEC-P39). Se reemplaza «nunca estuvo vinculado» por «no existe vinculación activa ni vencida con ese paciente, incluida la desvinculación y la revocación».
- DEC-P40: afecta RF-012. OPEN-Q-061 queda Respondida (DEC-P40). Volver a vincular tras desvinculación exige aceptar el aviso otra vez. Se adiciona AC-034.
- DEC-P44: afecta RF-085. OPEN-Q-035 queda Respondida (DEC-P44). Se precisa que de los archivos enviados al chat no se descarga ni guarda el archivo, nombre ni ID, solo el intento sin contenido. Se adiciona AC-035.
- DEC-P45: afecta la sección 3 (Alcance). OPEN-Q-037 queda Respondida (DEC-P45). Se explicita que sin agendamiento no hay notificaciones en el MVP; AC-012 (notificaciones), AC-021 y AC-023 se aplazan a SPEC-005.
- DEC-P46: afecta paso 7 del flujo principal. OPEN-Q-038 queda Respondida (DEC-P46). La autorización de datos de salud se pide una vez por paciente y se conserva mientras no se revoque. Se adiciona AC-036.
- DEC-P47: afecta RF-086 (nuevo requisito). OPEN-Q-060 queda Respondida (DEC-P47). Liga la aceptación previa del aviso al paciente y canal al verificar la identidad. Se adiciona AC-037.
- DEC-P48: afecta RF-016. OPEN-Q-062 queda Respondida (DEC-P48). La lista muestra vinculaciones vencidas con su máscara y marca de vencida. Se adiciona AC-038.
- Actualización de la sección 16 (Trazabilidad) con RF-086 y AC-031 a AC-038 en RF e HUs.
- Actualización de la sección Verificación reflejando que solo OPEN-Q-034 permanece abierta.
- DEC-P45 / H-068: precisión en la sección 3 (Alcance) indicando que la respuesta del bot a un archivo sigue en el MVP. Adición de AC-039 (contenido seguro en respuesta de archivo) y trazabilidad en RF-085 y BR-008.
- DEC-P48 / H-071: precisión en BR-007 estableciendo que la máscara de BR-009 no se considera información.
- DEC-P22 / H-072: precisión en RNF-009 indicando que con vinculación vigente aplica DEC-P22 y actualizando su método de verificación con AC-022 y AC-032.
- DEC-P57: adición de RF-087 (confirmación previa simple antes de revocar) y AC-040. Trazabilidad de RF-087 verificada por AC-033 y AC-040.
- H-038: unificación de la redacción en A1 cambiando «SMS/correo» por «SMS y, si existe, correo».
- Versión 1.11: actualización de RF-087 (precisión sobre la confirmación previa simple de revocación e interpretación de SPEC-001/AC-007), ajuste en DEC-P38 refiriendo a RF-087 (DEC-P57) y adición de RF-087 y AC-040 a la trazabilidad de HU-005, HU-006 y HU-007 en la sección 16.

## Preguntas de aclaración
- OPEN-Q-034. ¿Cómo debe proceder el sistema si dos pacientes vinculados al mismo canal tienen exactamente los mismos últimos 4 dígitos de cédula? (Origen: PREG-034 / H-009). Crítica: no. Estado: Pendiente. Responsable: equipo.

## Especificación

### 1. Objetivo
Garantizar el acceso multicanal seguro mediante una aplicación web adaptable sin instalación y un bot de Telegram integrado con Mini App, administrando la vinculación de múltiples pacientes por canal, su expiración independiente a los 3 meses calendario (vigentes todo el día de vencimiento en hora de Colombia y vencidas a las 00:00 del día siguiente, ajustando al último día del mes si la fecha no existe), la reactivación mediante código nuevo sin exigir cédula, la selección explícita de paciente mediante enmascaramiento seguro (`CC ***1234`), la autenticación exigiendo cédula y código solo para una vinculación nueva en la Mini App (reactivando una vinculación vencida solo con código nuevo y sin pedir código nuevo con vinculación vigente), la aceptación previa única del aviso de privacidad antes de solicitar cédula y las operaciones de desvinculación y consulta.

### 2. Contexto
El sistema opera a través de una aplicación web adaptable (en navegador) y un bot de Telegram con Mini App. Los identificadores de los canales (chats o navegadores) no constituyen prueba de identidad, por lo que la vinculación requiere la verificación previa mediante cédula y código de un solo uso enviado por SMS y, si existe, correo.
Decisiones del equipo:
- DEC-P01. La prevalidación completa entra al MVP, en web y en Telegram. El agendamiento (SPEC-004) queda en evaluación. Origen: docs/decisiones.md.
- DEC-P10. Una sola interfaz web, adaptable al celular y sin instalación (contexto 3.10), que se usa de dos formas: en el navegador y como Mini App de Telegram. El chat del bot solo lleva avisos con plantilla fija y botones que abren la Mini App. La identidad sigue exigiendo cédula + código también dentro de la Mini App. Una foto enviada al chat no se procesa. Origen: docs/decisiones.md (T-012, PREG-007).
- DEC-P20. El paciente se identifica en pantalla solo con los últimos 4 dígitos de la cédula (`CC ***1234`). Los avisos del chat no identifican al paciente: abren la Mini App. Responde a T-027. Origen: docs/decisiones.md.
- DEC-P21. Una vinculación vence a los 3 meses calendario, el mismo día del mes. Si ese día no existe en el mes de vencimiento, vence el último día de ese mes. Responde a T-017. Origen: docs/decisiones.md.
- DEC-P22. Precisa DEC-P10: los datos de Telegram nunca prueban la identidad. La Mini App exige cédula y código cuando el chat no tiene una vinculación vigente con ese paciente; con vinculación vigente no se pide un código nuevo en cada gestión (contexto 3.3). Origen: docs/decisiones.md.
- DEC-P25. La vinculación sigue vigente todo el día de vencimiento, en hora de Colombia, y queda vencida a las 00:00 del día siguiente. Responde a PREG-030. Origen: docs/decisiones.md.
- DEC-P26. Reactivar una vinculación vencida exige solo un código nuevo. Cédula y código se exigen en una vinculación nueva. Precisa DEC-P22. Responde a PREG-031. Origen: docs/decisiones.md.
- DEC-P27. La aceptación del aviso de privacidad es una por paciente y canal: no se repite al reactivar, pero sí con un segundo paciente en el mismo canal. Responde a PREG-032. Origen: docs/decisiones.md.
- DEC-P29. La verificación no depende de user_id, chat_id, username ni nombre visible. Responde a PREG-002. Origen: docs/decisiones.md.
- DEC-P37. La vinculación es del chat, sea quien sea el que lo use: el sistema no distingue personas. Una cuenta que abra desde otro chat no tiene esa vinculación y debe verificar. Responde a PREG-033. Origen: docs/decisiones.md.
- DEC-P38. Con vinculación vigente se puede revocar sin código nuevo, con la confirmación simple previa de RF-087 (DEC-P57). Responde a PREG-036. Origen: docs/decisiones.md.
- DEC-P39. Volver a vincular tras una desvinculación o una revocación es una vinculación nueva: exige cédula y código. Reemplaza «nunca estuvo vinculado». Responde a PREG-070. Origen: docs/decisiones.md.
- DEC-P40. Agregar un paciente sigue todo el flujo de identidad, así que tras desvincular se acepta otra vez el aviso. Responde a PREG-061. Origen: docs/decisiones.md.
- DEC-P44. De un archivo enviado al chat no se descarga ni se guarda el archivo, su nombre ni su identificador; solo se registra que hubo un intento, sin contenido. Responde a PREG-035. Origen: docs/decisiones.md.
- DEC-P45. Sin agendamiento, el MVP no tiene notificaciones; los AC que dependen de ellas se aplazan hasta SPEC-005. La respuesta del bot a un archivo enviado al chat no es una notificación. Responde a PREG-037. Origen: docs/decisiones.md.
- DEC-P46. La autorización de datos de salud se da una vez por paciente y se conserva mientras no se revoque. Responde a PREG-038. Origen: docs/decisiones.md.
- DEC-P47. Al verificar la identidad, la aceptación del aviso se liga al paciente y al canal. Responde a PREG-060. Origen: docs/decisiones.md.
- DEC-P48. La lista de pacientes muestra las vinculaciones vencidas con su máscara y una marca de vencida. Todas cuentan para exigir la selección. Responde a PREG-062. Origen: docs/decisiones.md.
- DEC-P52. El bot solo opera en chats privados: en un grupo no vincula ni muestra información. Responde a PREG-072. Origen: docs/decisiones.md.
- DEC-P57. Antes de aplicar una revocación se pide una confirmación simple previa, igual a la de desvincular; si la persona no confirma, no se revoca. SPEC-002 la define y SPEC-001 no cambia. Responde a PREG-075. Origen: docs/decisiones.md.
- DEC-10. La expiración de la vinculación a los 3 meses calendario es independiente por cada vinculación entre un canal y un paciente. Un mismo canal puede conservar pacientes con vinculación vigente mientras otra vinculación vence. Se reactiva con un nuevo código solo para ese paciente. Responde a OPEN-Q-001 (T-017).
- DEC-11. La desvinculación voluntaria de un paciente requiere una confirmación simple por parte del usuario antes de eliminar la asociación del canal. No elimina datos y detiene las notificaciones por ese canal, manteniendo los SMS y correos. (Nota: las acciones de no cancelar citas, no anular códigos de entrega y no liberar reservas están sujetas a la activación del agendamiento en evaluación de SPEC-004). Responde a OPEN-Q-002.
- DEC-12. Cuando un canal intenta realizar cualquier gestión o consulta con una vinculación vencida (más de 3 meses calendario), el sistema muestra el mensaje de vinculación vencida e inicia de inmediato el flujo para solicitar un nuevo código de verificación. Responde a OPEN-Q-003.

### 3. Alcance
- Uso de la aplicación web adaptable (sin instalación) y bot de Telegram (chat de avisos + Mini App) para la gestión multicanal con paridad de recorrido.
- Vinculación y gestión de múltiples pacientes en un mismo canal sin límite de asociatividad.
- Vencimiento y renovación independiente de cada vinculación a los 3 meses calendario (manteniéndose vigente todo el día de vencimiento en hora de Colombia hasta las 00:00 del día siguiente, ajustando al último día del mes si el día de vencimiento no existe en el calendario).
- Exigencia de cédula y código de un solo uso aplicada exclusivamente a una vinculación nueva.
- Reactivación de vinculaciones vencidas exigiendo únicamente un código nuevo de verificación (sin reingresar cédula).
- Selección obligatoria del paciente a gestionar previa a cada trámite, mostrada en pantalla exclusivamente mediante el formato enmascarado `CC ***1234`.
- Presentación y aceptación única del aviso de privacidad por paciente y canal (mismo y único aviso definido en SPEC-001/RF-001) antes de solicitar cualquier dato como la cédula.
- Autenticación exigiendo cédula y código en la Mini App solo para una vinculación nueva, reactivando una vinculación vencida solo con código nuevo y evitando pedir código nuevo cuando la vinculación ya se encuentra vigente.
- Desvinculación voluntaria de un paciente por canal con confirmación simple.
- Generación de enlaces profundos seguros hacia la Mini App o bot de Telegram sin incluir datos sensibles en la URL.
- Consulta de estado de fórmulas y prevalidaciones preliminares en ambas interfaces (web y Mini App) y de citas con punto/ventana y códigos de entrega QR/numérico cuando se active la funcionalidad de agendamiento de SPEC-004.
- Sin agendamiento, el MVP no tiene notificaciones; AC-012 en su parte de notificaciones, AC-023 y AC-021 en lo que toca a notificaciones se aplazan hasta SPEC-005 (DEC-P45). La respuesta del bot a un archivo enviado al chat no es una notificación y sigue en el MVP.

### 4. Actores e historias de usuario
Actores: paciente, cuidador, tutor, facilitador comunitario.
- HU-004. Como paciente, quiero vincular mi canal preferido (navegador web o Telegram) y consultar el estado de mis prevalidaciones, para hacer el seguimiento de mis fórmulas sin realizar desplazamientos innecesarios.
- HU-005. Como cuidador, quiero vincular y gestionar las pre-dispensaciones de la persona a mi cuidado desde mi canal, para ayudarle a coordinar la revisión de sus medicamentos de manera oportuna.
- HU-006. Como tutor, quiero vincular a mi representado en un canal seguro y acceder a sus trámites de prevalidación, para garantizar el seguimiento continuo de sus tratamientos farmacéuticos.
- HU-007. Como facilitador comunitario, quiero vincular a múltiples pacientes en mi chat o navegador y elegir a cuál gestiono en cada trámite, para brindar apoyo a varios miembros de la comunidad con absoluta claridad e independencia.

### 5. Requisitos funcionales
- RF-011. El sistema debe ofrecer el recorrido completo de uso (incluyendo verificación de identidad, vinculación, carga de documentos, prevalidación, consulta de estado, desvinculación y revocación) con paridad de funcionamiento tanto en la aplicación web adaptable (sin instalación) como en Telegram (mediante Mini App para interacción y chat para notificaciones). El agendamiento, la visualización del código de entrega y la cancelación de citas quedan sujetos a la activación de la funcionalidad de agendamiento (SPEC-004 en evaluación). Origen: contexto 3.1, necesidad, DEC-P01, DEC-P10.
- RF-012. El bot de Telegram solo debe interactuar después de que la persona lo inicie de manera voluntaria, presentando el aviso de privacidad de Pharma Express (el cual es el mismo y único aviso definido en SPEC-001/RF-001, aplicándose una sola aceptación por paciente y canal según DEC-P27), y transmitiendo en el chat avisos informativos de plantilla fija estrictamente exentos de nombres, medicamentos, diagnósticos y datos de identificación del paciente, provistos con botones que abren la Mini App. Tras una desvinculación, volver a vincular exige aceptar otra vez el aviso (DEC-P40). Origen: contexto 3.1, necesidad, DEC-P10, DEC-P27, DEC-P40, T-026, SPEC-001/RF-001.
- RF-013. El sistema debe permitir vincular un canal (chat de Telegram o navegador web) a un paciente tras verificar su identidad satisfactoriamente mediante cédula y código de un solo uso válido en una vinculación nueva (mientras que una vinculación vencida se reactiva solo con código nuevo según DEC-P26), admitiendo asociar múltiples pacientes a un mismo canal sin límite. Los datos de Telegram nunca prueban la identidad; la Mini App debe exigir cédula y código solo en una vinculación nueva cuando no existe vinculación activa ni vencida con ese paciente, incluida la desvinculación y la revocación (DEC-P39), no debe pedir un código nuevo en cada gestión si ya existe una vinculación vigente, y exige únicamente un código nuevo si la vinculación está vencida. La vinculación es del chat, sea quien sea el que lo use (DEC-P37). El bot solo opera en chats privados: en un grupo no vincula ni muestra información (DEC-P52). Cualquier fallo en la validación del código o una cédula inexistente no debe crear ni registrar ninguna vinculación. Origen: contexto 3.3, necesidad, DEC-P10, DEC-P22, DEC-P26, DEC-P37, DEC-P39, DEC-P52.
- RF-014. El sistema debe evaluar la expiración de la vinculación de forma independiente para cada asociación entre un canal y un paciente a los 3 meses calendario de haber sido establecida o renovada. La vinculación permanecerá plenamente vigente durante todo el día calendario de vencimiento en hora de Colombia (GMT-5), quedando formalmente vencida a las 00:00 del día siguiente. Si el día numérico correspondiente no existe en el mes de vencimiento, la vinculación vence el último día de ese mes. Origen: DEC-10, DEC-P21, DEC-P25, T-017.
- RF-015. Cuando un canal intente realizar una gestión o consulta utilizando una vinculación vencida, el sistema debe mostrar un mensaje explícito de vinculación vencida e iniciar de inmediato el flujo de revalidación solicitando únicamente un nuevo código de verificación (sin exigir reingresar la cédula). Origen: DEC-12, DEC-P26.
- RF-016. Si un canal tiene más de un paciente vinculado, el sistema debe exigir la selección explícita del paciente a gestionar antes de iniciar cualquier trámite y mantener visible su identificación enmascarada únicamente en formato de cédula enmascarada (`CC ***1234`) durante toda la gestión, sin mostrar nombres ni iniciales. La lista muestra las vinculaciones vencidas con su máscara y una marca de vencida, y todas cuentan para exigir la selección (DEC-P48). Origen: contexto 3.3, necesidad, DEC-P20, DEC-P48, T-027.
- RF-017. La aplicación web debe ofrecer enlaces profundos hacia Telegram que redirijan a la persona sin incluir cédula, diagnósticos, medicamentos ni ningún otro dato sensible en la URL. Origen: contexto 3.1, necesidad.
- RF-018. El sistema debe permitir al usuario consultar el estado de prevalidación de cada fórmula tanto en la aplicación web adaptable como en la Mini App de Telegram. La visualización de citas asignadas (con punto de dispensación y ventana de 1 hora) y el código de entrega (QR y numérico) estará disponible cuando la funcionalidad de agendamiento (SPEC-004) sea activada. Origen: contexto 3.4, 3.5, necesidad, DEC-P01.
- RF-019. El sistema debe permitir la desvinculación voluntaria de un paciente por canal a solicitud del usuario, exigiendo una confirmación simple antes de proceder. Origen: DEC-11.
- RF-020. La desvinculación voluntaria solo debe eliminar la asociación entre el canal y el paciente específico, deteniendo las notificaciones por dicho canal sin eliminar datos del paciente y manteniendo los envíos por SMS y correo electrónico. Las acciones de no cancelar citas, no anular códigos de entrega y no liberar reservas están condicionadas a la activación de la funcionalidad de agendamiento en evaluación (SPEC-004). Origen: DEC-11, DEC-P01.
- RF-085. El sistema no debe procesar fotos ni documentos enviados como mensajes de archivo o imagen directamente al chat de Telegram; en su lugar, debe responder con un aviso de plantilla fija y un botón que dirija a la persona a la Mini App para realizar la carga. No se descarga ni se guarda el archivo, su nombre ni su identificador; solo se registra que hubo un intento, sin contenido (DEC-P44). Origen: DEC-P10, DEC-P44.
- RF-086. Al verificar la identidad, el sistema debe ligar al paciente y al canal la aceptación del aviso registrada antes de conocer al paciente. Origen: DEC-P27, DEC-P47.
- RF-087. Antes de aplicar una revocación, el sistema debe pedir una confirmación simple previa, igual a la de desvincular y en la web y la Mini App, y si la persona no confirma no debe revocar. SPEC-001 no cambia: en SPEC-001/AC-007, «solicita» se entiende como la solicitud ya confirmada. Origen: DEC-P38, DEC-P57.

### 6. Requisitos no funcionales
- RNF-009. Seguridad y privacidad en canales. Los identificadores de canales (ID de chat de Telegram o cookies/sesiones de navegador) no deben considerarse prueba de identidad. La verificación no depende de user_id, chat_id, username ni nombre visible (DEC-P29). Con vinculación vigente aplica DEC-P22. Los enlaces profundos, parámetros de URL y avisos informativos del bot deben estar estrictamente libres de datos sensibles de salud, diagnósticos, medicamentos o de identificación. Se verifica mediante AC-022, AC-032, inspección de rutas, parámetros URL y análisis de tráfico de red. Origen: contexto 3.1, necesidad, DEC-P29, DEC-P22.
- RNF-019. Usabilidad y arquitectura web sin instalación. La aplicación web debe ser totalmente adaptable a navegadores móviles y de escritorio sin requerir instalación (se excluye empaquetado PWA instalable o aplicación nativa). Se verifica mediante prueba de acceso en navegador móvil sin aviso ni dependencia de instalación local. Origen: contexto 3.10, DEC-P10, T-012.

### 7. Reglas de negocio
- BR-005. La vigencia de cada vinculación entre un canal y un paciente es de exactamente 3 meses calendario desde el momento de su verificación, evaluándose de forma independiente por cada paciente asociado a ese canal. La vinculación se mantiene vigente durante todo el día de vencimiento en hora de Colombia, expirando a las 00:00 del día siguiente. Si el día del mes en que se realizó la vinculación no existe en el mes de vencimiento, la vinculación vence el último día de dicho mes. Origen: contexto 3.3, DEC-10, DEC-P21, DEC-P25, T-017.
- BR-006. La desvinculación voluntaria de un paciente en un canal detiene únicamente las notificaciones y accesos de ese paciente en ese canal específico, sin alterar sus prevalidaciones ni sus datos registrados en la EPS simulada. Las reglas relativas a no alterar citas ni reservas aplican en caso de estar activada la funcionalidad de agendamiento de SPEC-004 (en evaluación). Origen: contexto 3.2, DEC-11, DEC-P01.
- BR-007. Una vinculación vencida bloquea la consulta de información, la ejecución de gestiones y la recepción de notificaciones en ese canal para el paciente afectado hasta completar la revalidación ingresando únicamente un nuevo código de verificación (sin reingresar cédula), manteniendo la recepción de notificaciones por SMS y correo electrónico, y sin interrumpir otros canales vinculados ni a otros pacientes asociados al mismo canal. La máscara de BR-009 no se considera información (DEC-P48). Origen: contexto 3.3, DEC-12, DEC-P26, DEC-P48.
- BR-008. Operación de Telegram mediante Mini App. El chat de Telegram se limita a la recepción de mensajes informativos mediante plantillas fijas y botones de acción, exentos de nombres, medicamentos, diagnósticos y datos de identificación. Toda interacción que requiera ingreso de datos, carga de documentos, confirmación de OCR o consulta de resultados se ejecuta dentro de la Mini App. Cualquier archivo o imagen recibido directamente en el chat es ignorado operacionalmente y responde con la redirección a la Mini App. Origen: DEC-P10.
- BR-009. Máscara de privacidad para la identificación del paciente. La identificación del paciente seleccionado en pantalla y en la Mini App debe estructurarse obligatoriamente como `CC ***1234` (tipo de documento y últimos 4 dígitos de la cédula). Se prohíbe mostrar nombres, apellidos, iniciales, el número de cédula completo o datos de diagnóstico en cabeceras o listas de selección. Los avisos del chat de Telegram no identifican al paciente y solo abren la Mini App. Origen: DEC-P20, T-027.

### 8. Flujo principal
1. La persona ingresa al canal (aplicación web adaptable en navegador o bot de Telegram).
2. Si ingresa por Telegram o por la web, antes de pedir la cédula o cualquier dato personal, el sistema presenta el aviso de privacidad y tratamiento de datos (el cual es el mismo y único aviso de SPEC-001/RF-001) y exige su aceptación explícita (aplicando una sola vez por paciente y canal según DEC-P27). En Telegram, el bot despliega este aviso con un botón para abrir la Mini App.
3. Tras la aceptación del aviso de privacidad, si se trata de una vinculación nueva porque no existe vinculación activa ni vencida con ese paciente, incluida la desvinculación y la revocación (DEC-P39), la persona ingresa su número de cédula y código de un solo uso recibido por SMS y, si existe, correo (incluso si interactúa dentro de la Mini App de Telegram). Si la vinculación está vencida, se reactiva únicamente con un código nuevo sin exigir cédula; y si ya cuenta con vinculación vigente, la Mini App no exige un código nuevo.
4. Tras validar el código (si no existía vinculación vigente), el sistema establece la vinculación entre el canal y el paciente por 3 meses calendario (vigente todo el día de vencimiento hasta las 00:00 del día siguiente, o hasta el último día del mes si la fecha no existe).
5. Si el canal ya posee otros pacientes vinculados, el sistema mantiene cada asociación de forma independiente y agrega al nuevo paciente.
6. Antes de iniciar cualquier gestión, si existen múltiples pacientes vinculados, el sistema exige seleccionar al paciente a gestionar y despliega exclusivamente su identificación enmascarada (`CC ***1234`) durante todo el procedimiento.
7. El usuario realiza la prevalidación o consulta el estado preliminar de las fórmulas del paciente seleccionado tanto en la web como en la Mini App. Si el paciente aún no autorizó el tratamiento de datos de salud, el sistema la pide antes de la carga; se da una vez por paciente y se conserva mientras no se revoque (DEC-P46).

### 9. Flujos alternativos y de excepción
- A1. Vinculación vencida: Si la vinculación del paciente seleccionado ha superado los 3 meses calendario (tras finalizar el día de vencimiento a las 00:00), el sistema muestra el mensaje de vencimiento e inicia de inmediato el flujo de revalidación solicitando únicamente un nuevo código de verificación por SMS y, si existe, correo sin exigir cédula.
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
- AC-022. Dado un chat de Telegram sin vinculación activa ni vencida con el paciente, incluso tras una desvinculación o una revocación, cuando la persona abre la Mini App, entonces el sistema exige cédula y código de un solo uso aunque Telegram envíe los datos del usuario. Origen: DEC-P10, DEC-P22, DEC-P26, DEC-P39.
- AC-023. Dado un paciente con una vinculación vencida en un canal, cuando el sistema genera notificaciones para ese paciente, entonces las notificaciones por ese canal quedan detenidas pero los envíos por SMS y correo electrónico continúan. Origen: contexto 3.3, DEC-12.
- AC-024. Dado un chat con vinculación vigente con el paciente, cuando la persona abre la Mini App para una gestión, entonces el sistema no pide un código nuevo. Origen: DEC-P22, contexto 3.3.
- AC-025. Dado un usuario que ingresa un código erróneo, vencido, agotado en intentos o una cédula inexistente en el flujo de vinculación, cuando el sistema valida la entrada, entonces rechaza la autenticación y no crea ni registra ninguna vinculación en el canal. Origen: H-010.
- AC-026. Dado un canal con una vinculación cuyo día de vencimiento es hoy, cuando el usuario interactúa a las 23:59:59 hora de Colombia, entonces la vinculación sigue vigente y permite la gestión; y cuando interactúa a las 00:00 del día siguiente, la vinculación está vencida y bloquea la gestión hasta reactivarla. Origen: DEC-P25.
- AC-027. Dado un canal que ya tiene un paciente vinculado habiendo aceptado el aviso de privacidad, cuando el usuario inicia la vinculación de un segundo paciente en ese mismo canal, entonces el sistema exige presentar y aceptar el aviso de privacidad antes de solicitar la cédula del segundo paciente. Origen: DEC-P27.
- AC-028. Dado un canal con una vinculación vencida cuyo aviso de privacidad ya fue aceptado al vincularse, cuando el usuario realiza el flujo de revalidación con el código nuevo, entonces el sistema no le exige aceptar el aviso de privacidad otra vez. Origen: DEC-P27.
- AC-029. Dado un usuario que accede por la aplicación web adaptable, cuando realiza el recorrido completo, entonces el sistema le permite de forma observable aceptar el aviso de privacidad, verificar su identidad mediante cédula y código, vincular el canal, autorizar el tratamiento de datos de salud (SPEC-001/RF-007), cargar los documentos (fórmulas e historia clínica), confirmar la lectura del OCR y ver el resultado preliminar de la prevalidación. Origen: contexto 3.1, 3.2, DEC-P01, DEC-P04, DEC-P10, SPEC-001/RF-007.
- AC-030. Dado un usuario que accede mediante la Mini App de Telegram, cuando realiza el recorrido completo, entonces el sistema le permite de forma observable aceptar el aviso de privacidad, verificar su identidad mediante cédula y código, vincular el canal, autorizar el tratamiento de datos de salud (SPEC-001/RF-007), cargar los documentos (fórmulas e historia clínica), confirmar la lectura del OCR y ver el resultado preliminar de la prevalidación. Origen: contexto 3.1, 3.2, DEC-P01, DEC-P04, DEC-P10, SPEC-001/RF-007.
- AC-031. Dado un grupo de Telegram al que se agregó el bot, cuando una persona intenta vincular o abrir la Mini App desde el grupo, entonces el sistema no vincula ni muestra información de ningún paciente. Origen: DEC-P52.
- AC-032. Dada una cuenta de Telegram que abre la Mini App desde un chat sin vinculación con el paciente, cuando intenta una gestión, entonces el sistema exige cédula y código. Origen: DEC-P37.
- AC-033. Dado un canal con vinculación vigente, cuando la persona solicita revocar el consentimiento y lo confirma, entonces el sistema aplica la revocación sin pedir un código nuevo. Origen: DEC-P38, SPEC-001/RF-008.
- AC-034. Dado un paciente desvinculado de un canal, cuando se vuelve a vincular en ese canal, entonces el sistema exige aceptar el aviso antes de pedir la cédula. Origen: DEC-P40.
- AC-035. Dado un archivo enviado al chat, cuando se revisan los registros y el almacenamiento, entonces no contienen el archivo, su nombre ni su identificador, y solo consta que hubo un intento. Origen: DEC-P44.
- AC-036. Dado un paciente que ya autorizó el tratamiento de datos de salud sin revocarlo, cuando se inicia otra gestión desde cualquier canal, entonces el sistema no la pide de nuevo. Origen: DEC-P46.
- AC-037. Dada una aceptación registrada antes de ingresar la cédula, cuando la identidad se verifica, entonces la aceptación queda ligada a ese paciente y canal; y si la verificación falla, no queda ligada a ningún paciente. Origen: DEC-P47, RF-086.
- AC-038. Dado un canal con una vinculación vigente y una vencida, cuando la persona quiere gestionar, entonces el sistema muestra ambas con su máscara, marca la vencida y exige seleccionar una; y si selecciona la vencida, pide un código nuevo. Origen: DEC-P26, DEC-P48.
- AC-039. Dado un archivo enviado al chat, cuando el bot responde con su plantilla fija, entonces el mensaje no contiene medicamentos, diagnósticos ni cédula. Origen: RF-085, BR-008, DEC-P45.
- AC-040. Dado un canal con vinculación vigente, cuando la persona solicita revocar y no confirma, entonces el sistema no aplica la revocación y los datos del paciente permanecen. Origen: DEC-P57, RF-087.

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
- OPEN-Q-030: Respondida (DEC-P25)
- OPEN-Q-031: Respondida (DEC-P26)
- OPEN-Q-032: Respondida (DEC-P27)
- OPEN-Q-033: Respondida (DEC-P37, DEC-P52)
- OPEN-Q-034: Pendiente
- OPEN-Q-035: Respondida (DEC-P44)
- OPEN-Q-036: Respondida (DEC-P38)
- OPEN-Q-037: Respondida (DEC-P45)
- OPEN-Q-038: Respondida (DEC-P46)
- OPEN-Q-060: Respondida (DEC-P47)
- OPEN-Q-061: Respondida (DEC-P40)
- OPEN-Q-062: Respondida (DEC-P48)
- OPEN-Q-070: Respondida (DEC-P39)

### 16. Trazabilidad
- HU-004: RF-011, RF-012, RF-013, RF-014, RF-015, RF-016, RF-017, RF-018, RF-019, RF-020, RF-085, RF-086, RF-087; RNF-009, RNF-019; BR-005, BR-006, BR-007, BR-008, BR-009; AC-009, AC-010, AC-011, AC-012, AC-013, AC-014, AC-015, AC-016, AC-017, AC-018, AC-019, AC-020, AC-021, AC-022, AC-023, AC-024, AC-025, AC-026, AC-027, AC-028, AC-029, AC-030, AC-031, AC-032, AC-033, AC-034, AC-035, AC-036, AC-037, AC-038, AC-039, AC-040; CL-005, CL-006, CL-007, CL-008.
- HU-005: RF-011, RF-012, RF-013, RF-016, RF-018, RF-085, RF-086, RF-087; BR-008, BR-009; AC-011, AC-013, AC-014, AC-016, AC-018, AC-021, AC-022, AC-024, AC-025, AC-029, AC-030, AC-031, AC-032, AC-034, AC-035, AC-036, AC-037, AC-038, AC-039, AC-040.
- HU-006: RF-011, RF-012, RF-013, RF-016, RF-018, RF-085, RF-086, RF-087; BR-008, BR-009; AC-011, AC-013, AC-014, AC-016, AC-018, AC-021, AC-022, AC-024, AC-025, AC-029, AC-030, AC-031, AC-032, AC-034, AC-035, AC-036, AC-037, AC-038, AC-039, AC-040.
- HU-007: RF-011, RF-012, RF-013, RF-016, RF-085, RF-086, RF-087; BR-008, BR-009; AC-011, AC-013, AC-014, AC-018, AC-021, AC-022, AC-025, AC-027, AC-031, AC-032, AC-034, AC-035, AC-036, AC-037, AC-038, AC-039, AC-040.
- RF-011: Origen: contexto 3.1, necesidad, DEC-P01, DEC-P10, DEC-P38, DEC-P46; verificado por AC-017, AC-029, AC-030, AC-033, AC-036.
- RF-012: Origen: contexto 3.1, necesidad, DEC-P10, DEC-P27, DEC-P40, T-026, SPEC-001/RF-001; verificado por AC-019, AC-021, AC-027, AC-028, AC-034.
- RF-013: Origen: contexto 3.3, necesidad, DEC-P10, DEC-P22, DEC-P26, DEC-P37, DEC-P39, DEC-P52; verificado por AC-010, AC-014, AC-022, AC-024, AC-025, AC-029, AC-030, AC-031, AC-032.
- RF-014: Origen: DEC-10, DEC-P21, DEC-P25, T-017; verificado por AC-009, AC-020, AC-026.
- RF-015: Origen: DEC-12, DEC-P26; verificado por AC-010, AC-026, AC-028.
- RF-016: Origen: contexto 3.3, necesidad, DEC-P20, DEC-P48, T-027; verificado por AC-011, AC-038.
- RF-017: Origen: contexto 3.1, necesidad; verificado por AC-015.
- RF-018: Origen: contexto 3.4, 3.5, necesidad, DEC-P01; verificado por AC-016, AC-029, AC-030.
- RF-019: Origen: DEC-11; verificado por AC-012.
- RF-020: Origen: DEC-11, DEC-P01; verificado por AC-012.
- RF-085: Origen: DEC-P10, DEC-P44, DEC-P45; verificado por AC-013, AC-018, AC-035, AC-039.
- RF-086: Origen: DEC-P27, DEC-P47; verificado por AC-037.
- RF-087: Origen: DEC-P38, DEC-P57; verificado por AC-033, AC-040.
- RNF-009: Origen: contexto 3.1, necesidad, DEC-P29, DEC-P22; verificado con AC-022, AC-032, inspección de rutas, parámetros URL y análisis de tráfico de red.
- RNF-019: Origen: contexto 3.10, DEC-P10, T-012; verificado con prueba de acceso en navegador móvil sin aviso ni dependencia de instalación local.
- BR-005: Origen: contexto 3.3, DEC-10, DEC-P21, DEC-P25, T-017; verificado por AC-009, AC-010, AC-020, AC-024, AC-026.
- BR-006: Origen: contexto 3.2, DEC-11, DEC-P01; verificado por AC-012.
- BR-007: Origen: contexto 3.3, DEC-12, DEC-P26, DEC-P48; verificado por AC-010, AC-023, AC-026, AC-028, AC-038.
- BR-008: Origen: DEC-P10, DEC-P44, DEC-P45; verificado por AC-013, AC-018, AC-021, AC-030, AC-035, AC-039.
- BR-009: Origen: DEC-P20, DEC-P48, T-027; verificado por AC-011, AC-021, AC-038.
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
- Versión 1.7: actualización conforme a DEC-P26 y SPEC-001/RF-007: (1) precisión en RF-013, paso 3 del flujo principal, Objetivo, Alcance y AC-022 indicando que la exigencia de cédula y código aplica solo a una vinculación nueva cuando el chat nunca estuvo vinculado con el paciente, mientras que una vinculación vencida se reactiva únicamente con un código nuevo; (2) adición en AC-029 y AC-030 de la autorización de tratamiento de datos de salud (SPEC-001/RF-007) entre verificar identidad y cargar documentos.
- Versión 1.8: actualización según correcciones de la revisión S1: (1) renumeración de preguntas respondidas en Preguntas de aclaración (OPEN-Q-030 a OPEN-Q-032) ajustando la sección 15 con OPEN-Q-030 a OPEN-Q-032 (DEC-P25 a DEC-P27) y conservando OPEN-Q-001 a OPEN-Q-003 (DEC-10 a DEC-12); (2) registro como pendientes de OPEN-Q-038, OPEN-Q-060, OPEN-Q-061, OPEN-Q-062 y OPEN-Q-070; (3) adición de AC-010 en la trazabilidad de RF-013 en la sección 16; (4) unificación de la redacción del envío de código a "SMS y, si existe, correo" en la sección 2 y en el paso 3 del flujo principal según SPEC-001/RF-004; (5) precisión del valor límite en AC-026 a "23:59:59"; (6) actualización de la sección Verificación reflejando estado parcial por las preguntas abiertas pendientes y PREG-002.
- Versión 1.8, ajuste de edición sin cambio de reglas: se restauró el origen de DEC-P01 (docs/decisiones.md), cambiado sin pedido.
- Versión 1.9: actualización aplicando las decisiones DEC-P29, DEC-P37, DEC-P38, DEC-P39, DEC-P40, DEC-P44, DEC-P45, DEC-P46, DEC-P47, DEC-P48 y DEC-P52. OPEN-Q-033, OPEN-Q-035, OPEN-Q-036, OPEN-Q-037, OPEN-Q-038, OPEN-Q-060, OPEN-Q-061, OPEN-Q-062 y OPEN-Q-070 quedan Respondidas. Se adicionan RF-086 y AC-031 a AC-038. PREG-002 resuelta por DEC-P29. Se publica en estado Candidata con únicamente OPEN-Q-034 abierta (no crítica).
- Versión 1.9, ajuste de edición sin cambio de reglas: se restauraron DEC-11, DEC-12 y la nota de ajuste de la versión 1.8, y la sección Verificación vuelve a «parcial» donde quedan puntos abiertos.
- Versión 1.10: actualización aplicando los cambios H-068 (DEC-P45, AC-039), H-071 (DEC-P48 en BR-007), H-072 (DEC-P22 en RNF-009, verificando con AC-022 y AC-032), DEC-P57 (RF-087 y AC-040 para confirmación previa de revocación) y H-038 (unificación de redacción a «SMS y, si existe, correo» en A1). Se mantiene en estado Candidata.
- Versión 1.10, ajuste de edición sin cambio de reglas: se restauró el texto de DEC-P48 y una línea de impacto, y se corrigió una palabra en inglés.
- Versión 1.11: actualización de RF-087 aclarando la confirmación simple previa de revocación e interpretación de SPEC-001/AC-007, ajuste en DEC-P38 enlazando a RF-087 (DEC-P57) y adición de RF-087 y AC-040 a la trazabilidad de HU-005, HU-006 y HU-007.
- Versión 1.11: aprobación formal del equipo. La SPEC queda aprobada y congelada.

## Verificación
- Completitud: parcial. Sigue pendiente OPEN-Q-034, y quedan casos del informe S1 sin AC, como la reactivación fallida y el nuevo plazo tras reactivar.
- Consistencia interna: parcial. Siguen hallazgos del informe S1.
- Consistencia con el contexto: cumple. Comparé todas las decisiones registradas (DEC-P10, DEC-P22, DEC-P25 a DEC-P29, DEC-P37 a DEC-P40, DEC-P44 a DEC-P48, DEC-P52, DEC-P57) con la sección 3 del contexto del producto y docs/decisiones.md, comprobando total coherencia.
- No ambigüedad: parcial. Siguen sin definir «gestión» frente a «sesión» y la colisión de máscara (OPEN-Q-034).
- Verificabilidad: parcial. AC-017, AC-029 y AC-030 siguen sin oráculo suficiente, según el informe S1.
- Cobertura de actores: cumple. Las historias de usuario HU-004 a HU-007 cubren a todos los actores relevantes.
- Cobertura de AC: cumple. Todos los RF (RF-011 a RF-087) y BR (BR-005 a BR-009) cuentan con criterios de aceptación asociados en la sección 16.
- Trazabilidad: parcial. Quedan trazas parciales y orígenes en DEC internos, según el informe S1.
- No invención: cumple. Se aplicaron estrictamente los cambios solicitados por el equipo sin agregar suposiciones ni decisiones no autorizadas.
- Delimitación: cumple. Los temas de construcción técnica permanecen en la sección 14 fuera de alcance.

## Siguiente paso
La SPEC-002 versión 1.11 quedó aprobada y congelada.
