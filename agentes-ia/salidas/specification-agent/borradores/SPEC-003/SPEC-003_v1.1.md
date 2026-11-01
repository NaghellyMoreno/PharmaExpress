<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash
Fecha: 2026-10-31 19:32
Petición: Actualiza la SPEC-003 a la versión 1.1 en estado Candidata. Aplica como decisiones del equipo DEC-P02 (modificada), DEC-P03, DEC-P04, DEC-P05, DEC-P07, DEC-P08, DEC-P09, DEC-P10, DEC-P11 DEC-P12 y DEC-P13 del archivo docs/decisiones.md (DEC-P13 fija la fecha de la cita posible para crónicas: el día siguiente a la prevalidación, saltando domingos y festivos de Colombia; añade casos límite para sábado, víspera de festivo y festivo en lunes). Cítalas con su id global DEC-Pxx. Resuelve los hallazgos T-001, T-002, T-003, T-004, T-005, T-007, T-008, T-009, T-010 y T-011 de la revisión transversal adjunta: (1) regla por medicamento: PBS apto sin autorización, no PBS apto solo si está autorizado; (2) identificación de la fórmula por su número y significado de coincide con la EPS simulada según DEC-P08; (3) tabla motivo → siguiente paso tomada del contexto 3.4; (4) una historia clínica por solicitud y diagnóstico por fórmula según DEC-P09; (5) requisito nuevo de confirmación del OCR: la persona solo confirma o rechaza y el rechazo cuenta como intento (DEC-P04, DEC-P07); (6) un AC Dado/Cuando/Entonces por cada criterio y resultado (afiliación inactiva, vigencia vencida, no PBS sin autorización, no PBS autorizado, PBS sin autorización, clasificación aguda y crónica, ninguna fórmula apta, aviso de resultado preliminar); (7) AC-004 termina en el resultado preliminar, no en el agendamiento. Las fórmulas manuscritas se tratan como fuera de alcance con mensaje propio. Deja como tema para arquitectura los límites de tamaño y la retención de documentos si no los decide el contexto. No inventes reglas: lo que falte va como OPEN-Q.
-->

# SPEC-003. Carga de documentos y prevalidación - Versión 1.1

Estado: Candidata
Modo: Iteración
Necesidad original: "Carga de documentos y prevalidación. Con la autorización de datos de salud, el usuario carga las fórmulas y la historia clínica en foto o PDF por la web o por Telegram. Una solicitud admite varias fórmulas del mismo paciente y de los documentos se obtienen los medicamentos de cada fórmula y el diagnóstico. La prevalidación verifica en orden: afiliación activa una vez por solicitud; vigencia de cada fórmula con el dato de la EPS simulada; cobertura PBS de cada medicamento; autorización de cada medicamento en la EPS simulada; y, solo para fórmulas crónicas, que la fecha habilitada de la próxima entrega sea igual o anterior a la fecha de la cita posible. Cada fórmula es todo o nada; si un medicamento falla, la fórmula completa queda no apta, y las fórmulas separadas son independientes. El tratamiento se clasifica como agudo o crónico según un catálogo configurable de diagnósticos crónicos. Se muestra el resultado preliminar por fórmula con motivo y siguiente paso, y se indica que la validación oficial ocurre en el punto. Si no hay ninguna fórmula apta, termina el flujo digital."
Épica: EPIC-003

## Análisis
- Objetivo: permitir al usuario cargar documentos de salud (fórmulas e historia clínica) desde la interfaz web o mediante la Telegram Mini App, confirmar el contenido reconocido por OCR, y ejecutar la prevalidación en el orden establecido para determinar cuáles fórmulas son aptas para continuar y cuáles requieren gestión directa o atención presencial.
- Alcance inicial: carga de fotos y archivos PDF de fórmulas y de una historia clínica por solicitud; extracción por OCR de número de prescripción (20 dígitos tipo MIPRES), medicamentos y diagnóstico; confirmación de lectura por el usuario (sin edición manual); clasificación de tratamiento (agudo o crónico); ejecución secuencial de la prevalidación por fórmula; cálculo de fecha de cita posible para crónicas (primer día hábil saltando domingos y festivos colombianos); presentación de resultados preliminares con tabla de motivos y siguientes pasos; y cierre del flujo si ninguna fórmula es apta.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- Contexto aplicable: 3.1, 3.2, 3.3, 3.4, 3.5, 3.8, 3.11.

## Modelo de dominio
- Solicitud: conjunto de fórmulas e historia clínica de un mismo paciente gestionados en una misma sesión; admite varias fórmulas. Origen: contexto 2.4, 3.4 y DEC-P03.
- Fórmula: prescripción identificada por un número numérico de 20 dígitos (estilo MIPRES), que incluye uno o más medicamentos y un diagnóstico; es la unidad de prevalidación (todo o nada). Origen: contexto 2.4, 3.4, DEC-P05 y DEC-P12.
- Medicamento: elemento de una fórmula evaluado individualmente en cobertura PBS y estado de autorización. Origen: contexto 3.4 y DEC-P11.
- Historia clínica: documento cargado una vez por solicitud que aporta el diagnóstico o diagnósticos para clasificar el tratamiento. Origen: contexto 3.4, DEC-P03 y DEC-P09.
- Catálogo de diagnósticos crónicos: fuente configurable que define qué diagnósticos corresponden a tratamiento crónico. Origen: contexto 3.4.
- Catálogo de festivos colombianos: fuente configurable por año para determinar días hábiles en el cálculo de la cita posible para fórmulas crónicas. Origen: DEC-P13.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- DEC-P02 y DEC-P11: modifican la regla de prevalidación de cobertura PBS y autorización (paso 3 y 4 del RF-024, RF-025, BR-008, AC-015, AC-016, AC-017). Se consulta autorización en EPS simulada para todos los medicamentos, pero solo decide el resultado para los medicamentos no PBS. Medicamento PBS es apto sin autorización; medicamento no PBS solo es apto si está autorizado.
- DEC-P03 y DEC-P09: establecen que se carga una sola historia clínica por solicitud. Si trae un diagnóstico, aplica a todas las fórmulas; si trae varios, cada fórmula usa el asociado por la EPS simulada a su número. Si no trae diagnóstico, cuenta como documento incompleto. Afecta RF-021, RF-022, RF-023, BR-012, AC-018.
- DEC-P04 y DEC-P07: introducen el paso obligatorio de confirmación de OCR por el usuario (solo confirmar o rechazar, sin editar). El rechazo por la persona cuenta como intento fallido de carga (máximo 2 intentos en total por documento). Se incorporan consejos para la toma de fotos antes del reintento. Afecta RF-030, RF-029, BR-009, E1, AC-003, CL-001.
- DEC-P05, DEC-P08 y DEC-P12: definen la coincidencia de una fórmula con la EPS simulada a través del número de prescripción de 20 dígitos (MIPRES). Exigen que el número exista en la EPS simulada, pertenezca al paciente verificado y los medicamentos leídos coincidan con el registro oficial. Afecta RF-022, RF-029, BR-013, AC-019.
- DEC-P10: especifica el canal único web adaptable a móvil, utilizado directamente en el navegador o como Mini App de Telegram. Las notificaciones del bot solo envían mensajes con plantilla fija y botones que abren la Mini App. Exige cédula y código OTP dentro de la Mini App. Afecta RF-021, RNF-010, AC-001.
- DEC-P13: redefine la fecha de cita posible para fórmulas crónicas (paso 5 de prevalidación) como el primer día hábil siguiente a la prevalidación, omitiendo domingos y festivos de Colombia. Afecta RF-024 (paso 5), AC-002, CL-009, CL-010, CL-011.
- T-003: incorpora la tabla explícita de motivos y siguientes pasos del contexto 3.4 a RF-027 y BR-014.
- T-008: añade criterios de aceptación (AC-014 a AC-022) para verificar independientemente cada motivo de rechazo, combinación de PBS/autorización, clasificación aguda/crónica, finalización por ninguna fórmula apta, aviso preliminar y fórmulas manuscritas.
- T-011: reformula AC-004 para que finalice en el resultado preliminar de fórmula apta y no en el agendamiento.

## Preguntas de aclaración
- No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Permitir la carga de fórmulas médica e historia clínica (en foto o PDF) mediante la aplicación web o la Telegram Mini App, confirmar la lectura realizada por OCR sin edición manual, y ejecutar la prevalidación técnica en el orden establecido para informar los resultados preliminares, indicando motivos, siguientes pasos y notificando que la validación oficial ocurre en el punto de dispensación.

### 2. Contexto
El usuario inicia la prevalidación tras verificar su identidad y aceptar la autorización de datos de salud. El sistema procesa los documentos cargados para extraer el número de prescripción (20 dígitos), los medicamentos y los diagnósticos. La prevalidación evalúa en orden la afiliación del paciente, la vigencia de la fórmula, la cobertura PBS, las autorizaciones requeridas para medicamentos no PBS y la fecha habilitada de entrega para tratamientos crónicos. Se aplica el principio de todo o nada por fórmula, mientras que las fórmulas independientes de una misma solicitud continúan su proceso digital.

Decisiones del equipo:
- DEC-P02 (modificada por DEC-P11). La consulta de autorización en la EPS simulada se realiza sobre todos los medicamentos, pero solo determina el resultado para los medicamentos fuera del PBS. Un medicamento PBS es apto sin autorización. Un medicamento no PBS solo es apto si registra autorización vigente en la EPS simulada.
- DEC-P03. Se carga una sola historia clínica por solicitud. Responde a T-004.
- DEC-P04. En la confirmación de OCR la persona solo confirma o rechaza lo leído de los documentos; no puede editar campos manualmente. Responde a T-005.
- DEC-P05. Cada fórmula se identifica mediante un número de prescripción (estilo MIPRES de 20 dígitos), que actúa como llave de búsqueda en la EPS simulada. Responde a T-002.
- DEC-P07. El rechazo por parte del usuario de la lectura OCR cuenta como un intento de carga del documento (máximo 2 intentos por documento). Tras el primer rechazo o error, el sistema presenta recomendaciones para capturar una foto legible. Al segundo rechazo o falla, la fórmula queda no apta y se orienta a la atención presencial.
- DEC-P08. Una fórmula coincide con la EPS simulada si y solo si: a) su número existe en la EPS simulada; b) la fórmula pertenece al paciente verificado; c) los medicamentos leídos corresponden con los registrados para esa fórmula en la EPS simulada.
- DEC-P09. El diagnóstico de la historia clínica se asigna así: si la historia trae un único diagnóstico, aplica a todas las fórmulas de la solicitud; si trae múltiples diagnósticos, cada fórmula adopta el diagnóstico asociado a su número en la EPS simulada; si no incluye diagnóstico, el documento se califica como incompleto.
- DEC-P10. La prevalidación opera desde una aplicación web responsive, accesible directamente en navegador o mediante Telegram Mini App. Las notificaciones del bot de Telegram son estructuradas y abren la Mini App con botones interactivos. La identidad requiere cédula y código OTP en ambos accesos.
- DEC-P12. El número de prescripción imita el formato numérico de 20 dígitos de MIPRES y vincula en la EPS simulada los datos de paciente, fecha, diagnóstico CIE-10 y lista de medicamentos.
- DEC-P13. La fecha de la cita posible para fórmulas crónicas (paso 5 de la prevalidación) se calcula como el primer día hábil siguiente a la fecha de la prevalidación, omitiendo domingos y festivos oficiales de Colombia según un catálogo configurable por año.

### 3. Alcance
- Carga de archivos en formato foto (JPG, PNG) o PDF de las fórmulas médicas y de una historia clínica por solicitud mediante interfaz web o Telegram Mini App.
- Extracción automatizada por OCR del número de prescripción de 20 dígitos, medicamentos y diagnóstico.
- Pantalla de confirmación de lectura OCR donde el usuario valida o rechaza el texto leído (sin opción de edición manual).
- Verificación secuencial de prevalidación: 1) Afiliación activa por solicitud; 2) Vigencia de la fórmula; 3) Cobertura PBS por medicamento; 4) Autorización en EPS simulada (decisiva únicamente para no PBS); 5) Fecha habilitada de entrega igual o anterior a la fecha de cita posible (solo crónicas).
- Clasificación de fórmula como agudo o crónico según el diagnóstico extraído y el catálogo configurable de diagnósticos crónicos.
- Presentación de resultados preliminares por fórmula con indicación explícita de apta/no apta, tabla de motivo y siguiente paso, y advertencia de validación oficial en ventanilla.
- Detección de fórmulas manuscritas para marcarlas como no aptas e informar que están fuera del alcance digital.
- Finalización del flujo digital si ninguna fórmula de la solicitud resulta apta.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-005. Como usuario, quiero cargar las fórmulas y la historia clínica por la web o mediante la Mini App de Telegram y confirmar los datos extraídos, para verificar preliminarmente si mis medicamentos son aptos para entrega sin tener que editar manualmente la información.

### 5. Requisitos funcionales
- RF-021. El sistema debe permitir al usuario cargar los documentos (fotos o PDF de fórmulas médica y de una única historia clínica por solicitud) a través de la aplicación web responsive y de la Telegram Mini App, previa aceptación de la autorización de tratamiento de datos de salud. Origen: necesidad, contexto 3.1, 3.4, DEC-P03, DEC-P10.
- RF-022. El sistema debe extraer de los documentos cargados el número de prescripción (20 dígitos), los medicamentos de cada fórmula y el diagnóstico o diagnósticos de la historia clínica. Origen: necesidad, contexto 3.4, DEC-P05, DEC-P12.
- RF-023. El sistema debe clasificar cada fórmula como agudo o crónico comparando su diagnóstico contra un catálogo configurable de diagnósticos crónicos. Si la historia clínica contiene varios diagnósticos, el sistema debe asignar a cada fórmula el diagnóstico asociado a su número de prescripción en la EPS simulada. Si el diagnóstico no está en el catálogo de crónicos, se clasifica como agudo. Origen: necesidad, contexto 3.4, DEC-P09.
- RF-024. El sistema debe ejecutar la prevalidación de la solicitud respetando estrictamente el siguiente orden:
  1. Afiliación activa del paciente en la EPS simulada (evaluada una única vez por solicitud).
  2. Vigencia de la fórmula médica en la EPS simulada (fecha de vigencia mayor o igual a la fecha actual de prevalidación).
  3. Cobertura PBS de cada medicamento.
  4. Estado de autorización en la EPS simulada para cada medicamento. (Se consulta para todos los medicamentos, pero solo determina el resultado para los no cubiertos por el PBS: si es PBS, es apto sin autorización; si es no PBS, requiere estar autorizado).
  5. Fecha habilitada de entrega de la EPS simulada igual o anterior a la fecha de la cita posible, aplicada exclusivamente a fórmulas crónicas. La fecha de la cita posible se calcula como el primer día hábil siguiente a la prevalidación, omitiendo domingos y festivos del catálogo oficial de Colombia.
  Origen: necesidad, contexto 3.4, DEC-P02, DEC-P11, DEC-P13.
- RF-025. El sistema debe aplicar la regla de todo o nada por fórmula: si un solo medicamento de la fórmula no cumple con los criterios de la prevalidación, o si el documento de la fórmula presenta falla de lectura o no coincidencia tras los intentos permitidos, la fórmula completa se marca como no apta. Origen: necesidad, contexto 3.4, DEC-P11.
- RF-026. El sistema debe tratar cada fórmula de una solicitud como una unidad independiente, permitiendo que las fórmulas aptas continúen en el flujo digital aunque otras fórmulas de la misma solicitud resulten no aptas. Origen: necesidad, contexto 3.4, DEC-16.
- RF-027. El sistema debe presentar en pantalla el resultado preliminar por fórmula (apta o no apta), desplegando el motivo específico y el siguiente paso correspondiente de acuerdo con la tabla de la regla BR-014, e incluir visiblemente el mensaje: "Este resultado es preliminar. La validación oficial se realiza en el punto de dispensación por el personal farmacéutico." Origen: necesidad, contexto 3.4, T-003.
- RF-028. El sistema debe finalizar el flujo digital e informar al usuario si ninguna de las fórmulas de la solicitud resulta apta tras la prevalidación. Origen: necesidad, contexto 3.4.
- RF-029. El sistema debe permitir un máximo de dos (2) intentos de carga por documento (el intento inicial y un reintento). Si en el primer intento la lectura no es exitosa por ser ilegible, incompleta, carecer de diagnóstico, no coincidir con la EPS simulada o ser rechazada por el usuario, el sistema debe mostrar recomendaciones para tomar la foto antes de permitir el reintento. Si la falla persiste en el segundo intento, la fórmula asociada queda no apta. Origen: contexto 3.4, DEC-42, DEC-P07, DEC-P08.
- RF-030. El sistema debe presentar al usuario una vista previa de los datos extraídos por OCR (número de prescripción de 20 dígitos y medicamentos) para que únicamente confirme o rechace la lectura. El sistema no debe permitir la edición manual de los campos extraídos. El rechazo por parte del usuario contabilizará como un intento fallido de carga del documento. Origen: DEC-P04, DEC-P07.
- RF-031. El sistema debe identificar si una fórmula cargada es manuscrita. De detectarse prescripción manuscrita, el sistema debe marcar la fórmula como no apta e informar expresamente que las fórmulas manuscritas no están soportadas en el canal digital y deben presentarse en la atención presencial. Origen: T-009, propuesta tecnológica.

### 6. Requisitos no funcionales
- RNF-010. Usabilidad / Multicanal. La interfaz de carga, confirmación de OCR y consulta de resultados preliminares debe ser una aplicación web responsive, operativa en navegadores móviles/escritorio y accesible como Telegram Mini App sin requerir la instalación de una aplicación nativa. Se verifica con: pruebas de ejecución en navegadores Chrome/Safari y apertura de la Mini App desde el bot de Telegram en dispositivos iOS y Android. Origen: necesidad, contexto 3.1, DEC-P10.

### 7. Reglas de negocio
- BR-008. Evaluación secuencial y detención por afiliación. Si la verificación de afiliación en la EPS simulada da estado inactivo, el sistema detiene inmediatamente la evaluación de toda la solicitud. Si la afiliación es activa, cada fórmula se evalúa secuencial e independientemente bajo el principio de todo o nada. Origen: necesidad y contexto 3.4.
- BR-009. Control de intentos de carga y confirmación. Cada documento cuenta con dos (2) intentos de procesamiento. Se considera intento fallido cuando la imagen no permite extracción OCR, está incompleta, falta el diagnóstico en la historia clínica, los datos extraídos no coinciden con la EPS simulada o el usuario rechaza la confirmación de lectura. Al segundo intento fallido, la fórmula queda no apta y se orienta a atención presencial. Origen: contexto 3.4, DEC-42, DEC-P07.
- BR-010. Independencia entre fórmulas. Las decisiones sobre una fórmula no afectan el procesamiento ni el resultado de las demás fórmulas de la misma solicitud. Origen: contexto 3.4, DEC-16.
- BR-011. Lógica de evaluación de Cobertura PBS y Autorización.
  - Medicamento PBS: Apto sin requerir autorización.
  - Medicamento NO PBS: Requiere estar en estado "Autorizado" y vigente en la EPS simulada para ser Apto. Si no está autorizado, la fórmula queda no apta.
  Origen: contexto 3.4, DEC-P02, DEC-P11.
- BR-012. Diagnóstico e historia clínica única. La solicitud acepta únicamente una historia clínica. Si la historia clínica carece de diagnóstico, se marca como incompleta y activa el reintento de carga. Si la historia clínica contiene un solo diagnóstico, este aplica a todas las fórmulas; si contiene varios, se asigna a cada fórmula el diagnóstico que corresponde a su número de prescripción en la EPS simulada. Origen: DEC-P03, DEC-P09.
- BR-013. Criterio de coincidencia con EPS simulada. Una fórmula se considera coincidente con la EPS simulada cuando concurren tres condiciones: a) El número de prescripción de 20 dígitos existe en la EPS; b) Está registrada a nombre del paciente validado; c) Los medicamentos leídos corresponden a la lista prescrita registrada bajo ese número. Origen: DEC-P05, DEC-P08, DEC-P12.
- BR-014. Motivo y Siguiente Paso. Toda fórmula prevalidada debe mostrar el resultado correspondiente según las siguientes causas:

| Escenario / Causa | Motivo presentado | Siguiente paso presentado |
|---|---|---|
| Afiliación inactiva en EPS | Afiliación inactiva en la EPS simulada. | Comunicarse o acudir a su EPS para actualizar o reactivar su afiliación. |
| Fórmula no vigente | La fórmula médica se encuentra vencida o fuera de fecha. | Solicitar una nueva valoración médica en su EPS. |
| Medicamento no PBS sin autorización | Medicamento no cubierto por el PBS y sin autorización registrada en la EPS. | Consultar los puntos de atención, enlaces o trámites de autorización de su EPS. |
| Documento ilegible, incompleto, sin diagnóstico, no coincidente o 2 rechazos OCR | No fue posible validar los datos del documento con la EPS simulada. | Acudir a la atención presencial en el punto de dispensación con sus documentos físicos. |
| Fórmula manuscrita | Las fórmulas manuscritas no son procesables digitalmente. | Acudir a la atención presencial en el punto de dispensación con la fórmula física. |
| Fecha habilitada de entrega (crónica) posterior a cita posible | La fecha habilitada de entrega por la EPS es posterior a la cita más próxima disponible. | Esperar hasta la fecha habilitada por su EPS e iniciar una nueva prevalidación. |
| Fórmula prevalidada exitosamente | Todos los medicamentos cumplen las validaciones preliminares. | Continuar con la consulta de disponibilidad y agendamiento de cita. |

Origen: contexto 3.4, DEC-P02, DEC-P07, DEC-P11, T-003.

- BR-015. Regla de cita posible para crónicos. La fecha de la cita posible para prevalidar fórmulas crónicas es el día hábil inmediatamente posterior a la fecha de la prevalidación. Los días domingos y los festivos nacionales colombianos del catálogo anual configurable no se consideran días hábiles. Origen: DEC-P13.

### 8. Flujo principal
1. El usuario accede a la sección de carga de documentos desde la web o mediante la Telegram Mini App tras verificar su identidad y autorizar el tratamiento de datos de salud.
2. El usuario adjunta las fotos o PDF de las fórmulas médicas y de la única historia clínica de la solicitud.
3. El sistema procesa los documentos por OCR y extrae los números de prescripción de 20 dígitos, medicamentos y diagnósticos.
4. El sistema presenta la vista previa de confirmación de lectura. El usuario verifica y presiona "Confirmar datos".
5. El sistema valida la coincidencia de cada fórmula con la EPS simulada (existencia del número, coincidencia de paciente y medicamentos).
6. El sistema clasifica el tratamiento de cada fórmula en agudo o crónico según el diagnóstico asignado y el catálogo configurable.
7. El sistema verifica la afiliación activa del paciente en la EPS simulada (una vez por solicitud).
8. Para cada fórmula, el sistema verifica la vigencia en la EPS simulada.
9. Para cada medicamento de la fórmula, el sistema verifica la cobertura PBS. Si el medicamento no es PBS, consulta el estado de autorización en la EPS simulada.
10. Para fórmulas crónicas, el sistema calcula la fecha de cita posible (siguiente día hábil omitiendo domingos y festivos) y verifica que la fecha habilitada de entrega sea igual o anterior a ella.
11. El sistema despliega el resultado preliminar por fórmula con su motivo, siguiente paso y la leyenda legal de validación oficial en el punto de dispensación.

### 9. Flujos alternativos y de excepción
- A1. Reintento por rechazo del usuario o falla de lectura (intento 1):
  1. El usuario observa un error en la vista previa OCR y presiona "Rechazar lectura" (o el sistema detecta documento ilegible, incompleto, sin diagnóstico o no coincidente).
  2. El sistema contabiliza el intento 1 de 2.
  3. El sistema muestra una pantalla intermedia con consejos para la captura de documentos (buena iluminación, enfoque claro, sin sombras ni cortes).
  4. El usuario carga nuevamente el documento y el sistema retorna al paso 3 del flujo principal.
- A2. Solicitud con múltiples fórmulas y fallas parciales:
  1. Si una de las fórmulas resulta no apta (por ejemplo, medicamento no PBS sin autorización), el sistema registra dicha fórmula como no apta con su motivo y siguiente paso.
  2. Las demás fórmulas de la misma solicitud que superen todas las validaciones continúan como aptas.
- E1. Falla persistente en el segundo intento de carga:
  1. Si en el segundo intento el usuario rechaza la lectura OCR o el documento sigue fallando en legibilidad, completitud, diagnóstico o coincidencia con la EPS, el sistema marca la fórmula como no apta.
  2. El sistema muestra el motivo "No fue posible validar los datos..." y el siguiente paso "Acudir a la atención presencial...".
- E2. Afiliación inactiva:
  1. Si la verificación de afiliación en la EPS simulada retorna estado inactivo, el sistema detiene inmediatamente el procesamiento de la solicitud.
  2. Muestra a nivel global el motivo "Afiliación inactiva en la EPS simulada" y el siguiente paso para contactar a la EPS, bloqueando la prevalidación de todas las fórmulas.
- E3. Detección de fórmula manuscrita:
  1. El sistema identifica que el documento cargado corresponde a una fórmula manuscrita.
  2. Marca la fórmula como no apta, despliega el motivo y siguiente paso específico para fórmulas manuscritas y orienta a la atención presencial.
- E4. Ninguna fórmula apta:
  1. Si al finalizar la prevalidación todas las fórmulas resultan no aptas, el sistema muestra el resumen de resultados no aptos y finaliza el flujo digital sin permitir avanzar a fases posteriores.

### 10. Casos límite
- CL-001. Documento rechazado dos veces consecutivas por el usuario en la pantalla de confirmación OCR: el sistema marca la fórmula como no apta tras el segundo rechazo y orienta a la atención presencial. Origen: DEC-P04, DEC-P07.
- CL-008. Solicitud con dos fórmulas en la que la primera falla por no estar registrada en la EPS simulada (número no coincide): el sistema marca la primera fórmula como no apta tras agotar reintentos y permite que la segunda fórmula apta avance con su resultado preliminar. Origen: DEC-16, DEC-P08.
- CL-009. Prevalidación de fórmula crónica realizada un día sábado: el sistema calcula la fecha de la cita posible para el día lunes (si es hábil) o para el martes (si el lunes es festivo nacional), verificando contra esa fecha la habilitación de entrega. Origen: DEC-P13.
- CL-010. Prevalidación de fórmula crónica en víspera de festivo (ejemplo: domingo previo a lunes festivo, o día laboral previo a un festivo de mitad de semana): el sistema calcula la cita posible para el primer día hábil siguiente al festivo. Origen: DEC-P13.
- CL-011. Prevalidación de fórmula crónica con festivo en día lunes: si se prevalida un viernes o sábado, el sistema calcula como cita posible el día martes. Origen: DEC-P13.
- CL-012. Historia clínica cargada sin ningún diagnóstico expreso: el sistema la clasifica como documento incompleto en el intento 1 y solicita nueva carga con consejos de captura. Origen: DEC-P09.

### 11. Criterios de aceptación
- AC-001. Dado un usuario con la identidad verificada en la web o en la Telegram Mini App, cuando carga las fotos o PDF de su fórmula e historia clínica y presiona "Confirmar datos" en la pantalla de vista previa OCR, entonces el sistema ejecuta la prevalidación en el orden establecido. Origen: necesidad, contexto 3.4, DEC-P10.
- AC-002. Dada una fórmula crónica prevalidada un día viernes en víspera de lunes festivo, cuando la fecha habilitada de entrega en la EPS simulada es el día miércoles (posterior a la fecha de cita posible que es el martes), entonces la fórmula queda no apta con el motivo de fecha habilitada posterior. Origen: necesidad, contexto 3.4, DEC-P13.
- AC-003. Dado un documento cuya lectura OCR presenta errores, cuando el usuario presiona "Rechazar lectura", entonces el sistema contabiliza el intento 1, muestra recomendaciones para la foto y permite volver a cargar el archivo. Si en el segundo intento el usuario vuelve a rechazar, la fórmula queda no apta y se orienta a atención presencial. Origen: context 3.4, DEC-P04, DEC-P07.
- AC-004. Dada una solicitud con dos fórmulas independientes, cuando la primera fórmula no es apta por falta de autorización y la segunda es apta, entonces el sistema muestra el resultado preliminar de la primera como no apta y el de la segunda como apta para continuar. Origen: contexto 3.4, DEC-16, T-011.
- AC-013. Dado un usuario que carga una fórmula en la web o Telegram Mini App y el número de prescripción de 20 dígitos no existe en la EPS simulada, cuando se agota el segundo intento, entonces el sistema marca la fórmula como no apta por no coincidencia con la EPS. Origen: DEC-P05, DEC-P08.
- AC-014. Dado un paciente con estado de afiliación inactivo en la EPS simulada, cuando inicia la prevalidación de una solicitud con múltiples fórmulas, entonces el sistema detiene inmediatamente el proceso, declara toda la solicitud no apta y muestra el mensaje para comunicarse con la EPS. Origen: contexto 3.4, BR-008.
- AC-015. Dada una fórmula médica cuya fecha de vigencia en la EPS simulada es anterior a la fecha actual de prevalidación, cuando se ejecuta el paso 2 de prevalidación, entonces el sistema marca la fórmula como no apta y muestra el motivo de fórmula vencida y el siguiente paso de nueva valoración médica. Origen: contexto 3.4, BR-014.
- AC-016. Dado un medicamento prescrito que no está cubierto por el PBS y registra estado "No autorizado" en la EPS simulada, cuando se evalúa la fórmula, entonces la fórmula completa resulta no apta y muestra el enlace/puntos de trámite de la EPS. Origen: DEC-P02, DEC-P11, BR-011.
- AC-017. Dado un medicamento prescrito no cubierto por el PBS que registra estado "Autorizado" vigente en la EPS simulada, cuando se evalúa la fórmula y los demás medicamentos son PBS, entonces la fórmula resulta prevalidada como apta. Origen: DEC-P02, DEC-P11, BR-011.
- AC-018. Dado un medicamento cubierto por el PBS sin registro de autorización en la EPS simulada, cuando se prevalida la fórmula, entonces el sistema lo marca como apto (la autorización no aplica a medicamentos PBS). Origen: DEC-P11, BR-011.
- AC-019. Dada una solicitud con dos fórmulas clasificadas con diagnósticos de artritis (crónico en catálogo) y amigdalitis (agudo), cuando se completa la prevalidación, entonces el sistema califica la primera fórmula como crónica (requiere validación de fecha habilitada de cita hábil) y la segunda como aguda. Origen: contexto 3.4, RF-023.
- AC-020. Dada una solicitud en la que todas las fórmulas prevalidables resultan no aptas, cuando finaliza el procesamiento, entonces el sistema muestra los motivos de rechazo de cada una e informa que el flujo digital ha terminado sin permitir agendamiento. Origen: contexto 3.4, RF-028.
- AC-021. Dada cualquier fórmula que complete el proceso de prevalidación (apta o no apta), cuando el sistema despliega la pantalla de resultados, entonces incluye explícitamente la leyenda: "Este resultado es preliminar. La validación oficial se realiza en el punto de dispensación por el personal farmacéutico." Origen: necesidad, contexto 3.4, RF-027.
- AC-022. Dado un usuario que carga una foto correspondiente a una fórmula escrita a mano, cuando el sistema detecta la condición de manuscrita, entonces marca la fórmula como no apta y muestra la indicación de que las fórmulas manuscritas requieren atención presencial. Origen: T-009, RF-031.

### 12. Dependencias
- Verificación de identidad del paciente y confirmación de autorización de datos de salud (SPEC-001, SPEC-002).
- Servidor / Servicio simulado de la EPS (afiliación, vigencia de prescripción por número de 20 dígitos, estado PBS, autorizaciones y fechas habilitadas de entrega).
- Catálogo configurable de diagnósticos crónicos.
- Catálogo anual configurable de festivos nacionales de Colombia.

### 13. Restricciones
- Equipo de cuatro personas y aproximadamente 8 semanas. Origen: contexto 3.9.
- El equipo no tiene acceso a los sistemas de Disfarma y trabaja desde afuera. Origen: contexto 3.9.
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites de autorización. Origen: contexto 3.11.

### 14. Fuera de alcance
- Trámite de autorizaciones o vigilancia de su estado por parte del sistema (contexto 3.10).
- Facturación, prescripción o modificación de fórmulas médicas (contexto 3.10).
- Uso de datos reales de pacientes (contexto 3.10).
- Integración real con EPS, MIPRES o ADRES (contexto 3.10).
- Fórmulas manuscritas: no se procesan por canal digital y se orientan directamente a la atención presencial. Origen: T-009, propuesta tecnológica.
- [Límites de tamaño de archivo y número de páginas en archivos PDF]: tema para arquitectura. Origen: T-009.
- [Política y tiempo de retención y almacenamiento de archivos de documentos de salud de fórmulas e historias clínicas]: tema para arquitectura. Origen: T-010.
- [Motor y ubicación del procesamiento OCR de imágenes y PDF]: tema para arquitectura. Origen: RF-022.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-42 / DEC-P07)
- OPEN-Q-002: Respondida (DEC-16)
- OPEN-Q-003: Respondida (DEC-12 / DEC-P10)

### 16. Trazabilidad
- HU-005: RF-021, RF-022, RF-023, RF-024, RF-025, RF-026, RF-027, RF-028, RF-029, RF-030, RF-031, RNF-010; BR-008, BR-009, BR-010, BR-011, BR-012, BR-013, BR-014, BR-015; AC-001, AC-002, AC-003, AC-004, AC-013, AC-014, AC-015, AC-016, AC-017, AC-018, AC-019, AC-020, AC-021, AC-022; CL-001, CL-008, CL-009, CL-010, CL-011, CL-012.
- RF-021: Origen: necesidad, contexto 3.1, 3.4, DEC-P03, DEC-P10; verificado por AC-001, RNF-010.
- RF-022: Origen: necesidad, contexto 3.4, DEC-P05, DEC-P12; verificado por AC-001, AC-013.
- RF-023: Origen: necesidad, contexto 3.4, DEC-P09; verificado por AC-019.
- RF-024: Origen: necesidad, contexto 3.4, DEC-P02, DEC-P11, DEC-P13; verificado por AC-001, AC-002, AC-014, AC-015, AC-016, AC-017, AC-018.
- RF-025: Origen: necesidad, contexto 3.4, DEC-P11; verificado por AC-004, AC-016.
- RF-026: Origen: necesidad, contexto 3.4, DEC-16; verificado por AC-004, CL-008.
- RF-027: Origen: necesidad, contexto 3.4, T-003; verificado por AC-004, AC-015, AC-016, AC-021.
- RF-028: Origen: necesidad, contexto 3.4; verificado por AC-020.
- RF-029: Origen: contexto 3.4, DEC-42, DEC-P07, DEC-P08; verificado por AC-003, AC-013, CL-001.
- RF-030: Origen: DEC-P04, DEC-P07; verificado por AC-001, AC-003, CL-001.
- RF-031: Origen: T-009, propuesta tecnológica; verificado por AC-022.
- RNF-010: Origen: necesidad, contexto 3.1, DEC-P10; verificado con pruebas funcionales en navegadores Chrome/Safari y apertura de la Mini App en Telegram iOS/Android.
- BR-008: Origen: necesidad, contexto 3.4; verificado por AC-014.
- BR-009: Origen: contexto 3.4, DEC-42, DEC-P07; verificado por AC-003, CL-001.
- BR-010: Origen: contexto 3.4, DEC-16; verificado por AC-004, CL-008.
- BR-011: Origen: contexto 3.4, DEC-P02, DEC-P11; verificado por AC-016, AC-017, AC-018.
- BR-012: Origen: DEC-P03, DEC-P09; verificado por AC-019, CL-012.
- BR-013: Origen: DEC-P05, DEC-P08, DEC-P12; verificado por AC-013, CL-008.
- BR-014: Origen: contexto 3.4, DEC-P02, DEC-P07, DEC-P11, T-003; verificado por AC-004, AC-014, AC-015, AC-016, AC-021, AC-022.
- BR-015: Origen: DEC-P13; verificado por AC-002, CL-009, CL-010, CL-011.
- CL-001: Origen: DEC-P04, DEC-P07; verificado por AC-003.
- CL-008: Origen: DEC-16, DEC-P08; verificado por AC-004, AC-013.
- CL-009: Origen: DEC-P13; verificado por AC-002.
- CL-010: Origen: DEC-P13; verificado por AC-002.
- CL-011: Origen: DEC-P13; verificado por AC-002.
- CL-012: Origen: DEC-P09; verificado por AC-003.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad y las preguntas iniciales.
- Versión 1.0: incorporación de las respuestas del equipo (DEC-12, DEC-16, DEC-42), actualización de requisitos, flujos, casos límite y criterios de aceptación, pasando a estado Candidata.
- Versión 1.1: actualización a estado Candidata incorporando decisiones globales DEC-P02 (modificada por DEC-P11), DEC-P03, DEC-P04, DEC-P05, DEC-P07, DEC-P08, DEC-P09, DEC-P10, DEC-P11, DEC-P12 y DEC-P13; resolución de hallazgos T-001 a T-005, T-007 a T-011; reglas de coincidencia EPS con número MIPRES (20 dígitos), confirmación OCR sin edición, fecha hábil para crónicas saltando domingos/festivos, tabla motivo-siguiente paso, fuera de alcance para fórmulas manuscritas, temas de arquitectura para retención y límites de documentos, y cobertura completa de ACs.

## Verificación
- Completitud: cumple. La SPEC especifica la carga multicanal (web y Telegram Mini App), confirmación OCR sin edición, validación de coincidencia EPS por número de 20 dígitos, evaluación de PBS y autorización por medicamento, regla de día hábil para citas de crónicos (saltando domingos/festivos), tabla explicativa de motivos y siguientes pasos, manejo de fórmulas manuscritas y finalización si ninguna fórmula es apta.
- Consistencia interna: cumple. Comparé los requisitos RF-021 a RF-031 con las reglas de negocio BR-008 a BR-015, los flujos principal y alternativos, los casos límite CL-001 a CL-012 y los criterios AC-001 a AC-022. Todos mantienen coherencia estricta en las entidades y condiciones.
- Consistencia con el contexto: cumple. Las reglas de prevalidación coinciden con el contexto 3.4 y con las decisiones de equipo DEC-P02/DEC-P11, DEC-P03 a DEC-P05, DEC-P07 a DEC-P10, DEC-P12 y DEC-P13.
- No ambigüedad: cumple. Se definieron claramente los límites de 2 intentos de carga, la prohibición de edición manual en OCR, las condiciones exactas de coincidencia con la EPS simulada y la tabla unívoca de motivo y siguiente paso.
- Verificabilidad: cumple. Cada requisito funcional y regla de negocio posee criterios de aceptación observables formateados en Dado/Cuando/Entonces.
- Cobertura de actores: cumple. Se identificaron paciente, persona que actúa por el paciente y facilitador comunitario, asignando la HU-005 a todos ellos sin crear interfaces diferenciadas.
- Cobertura de AC: cumple. Todos los RF y BR cuentan con al menos un AC asignado en la matriz de trazabilidad.
- Trazabilidad: cumple. La sección 16 mapea individualmente cada RF, RNF, BR y CL con su origen y su método/criterio de verificación.
- No invención: cumple. No se incluyeron reglas ni plazos ajenos al contexto o al registro global de decisiones `docs/decisiones.md`.
- Delimitación: cumple. Las decisiones técnicas de almacenamiento de archivos, límites de peso/páginas y motor de OCR se enviaron formalmente a la sección 14 como temas para arquitectura.

## Siguiente paso
La SPEC-003 versión 1.1 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
