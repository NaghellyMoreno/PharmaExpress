<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash
Fecha: 2026-10-31 19:35
Petición: Corrige la SPEC-003 y publícala como versión 1.2 en estado Candidata, sin cambiar lo que no se menciona aquí. (1) DEC-P13: el sábado es día hábil; solo se saltan domingos y festivos. Corrige SPEC-003/AC-002 y SPEC-003/CL-011: una prevalidación en viernes da cita posible el sábado. Añade un AC con el ejemplo de DEC-P13: prevalidación en sábado antes de lunes festivo da cita posible el martes. (2) DEC-P01 y T-011: quita el agendamiento de BR-014 y de AC-020; una fórmula apta queda apta y se muestra su resultado. (3) DEC-P11: en el paso 9 del flujo principal la autorización se consulta para todos los medicamentos y solo decide para los no PBS. (4) Quita la palabra vigente aplicada a la autorización en BR-011, AC-017 y DEC-P02: DEC-P11 solo exige que esté autorizado. (5) Quita de BR-014 el siguiente paso inventado para fecha habilitada posterior a la cita posible y regístralo como OPEN-Q; el contexto 3.4 no lo define. (6) Añade un AC Dado/Cuando/Entonces, con resultado observable, para cada uno de estos casos: número existente de otro paciente; medicamentos leídos distintos de los de la EPS simulada; historia clínica sin diagnóstico; historia clínica con un diagnóstico que aplica a todas las fórmulas; historia clínica con varios diagnósticos; fecha habilitada igual a la cita posible. Reescribe AC-001 para que su resultado sea observable. Actualiza la trazabilidad para estos AC. (7) Registra como OPEN-Q qué pasa con las fórmulas de la solicitud si la historia clínica falla en sus dos intentos, porque RF-029 habla de la fórmula asociada y la historia es una por solicitud. (8) Regla de datos de salud: reemplaza artritis y amigdalitis en AC-019 por los marcadores ficticios diagnóstico crónico A y diagnóstico agudo B. (9) Corrige el Análisis de impacto para que cite identificadores que existan y correspondan, y en Contradicciones detectadas señala que DEC-P13 modifica el contexto 3.5. Corrige context por contexto en AC-003. (10) La sección Verificación debe decir cumple solo si se comprobó; no inventes reglas.
-->

# SPEC-003. Carga de documentos y prevalidación - Versión 1.2

Estado: Candidata
Modo: Iteración
Necesidad original: "Carga de documentos y prevalidación. Con la autorización de datos de salud, el usuario carga las fórmulas y la historia clínica en foto o PDF por la web o por Telegram. Una solicitud admite varias fórmulas del mismo paciente y de los documentos se obtienen los medicamentos de cada fórmula y el diagnóstico. La prevalidación verifica en orden: afiliación activa una vez por solicitud; vigencia de cada fórmula con el dato de la EPS simulada; cobertura PBS de cada medicamento; autorización de cada medicamento en la EPS simulada; y, solo para fórmulas crónicas, que la fecha habilitada de la próxima entrega sea igual o anterior a la fecha de la cita posible. Cada fórmula es todo o nada; si un medicamento falla, la fórmula completa queda no apta, y las fórmulas separadas son independientes. El tratamiento se clasifica como agudo o crónico según un catálogo configurable de diagnósticos crónicos. Se muestra el resultado preliminar por fórmula con motivo y siguiente paso, y se indica que la validación oficial ocurre en el punto. Si no hay ninguna fórmula apta, termina el flujo digital."
Épica: EPIC-003

## Análisis
- Objetivo: permitir al usuario cargar documentos de salud (fórmulas e historia clínica) desde la aplicación web o la Telegram Mini App, confirmar el contenido reconocido por OCR sin edición manual, y ejecutar la prevalidación técnica en el orden establecido para determinar cuáles fórmulas son aptas y cuáles requieren gestión directa o atención presencial.
- Alcance inicial: carga de fotos y archivos PDF de fórmulas y de una historia clínica por solicitud; extracción por OCR del número de prescripción (20 dígitos tipo MIPRES), medicamentos y diagnóstico; confirmación de lectura por el usuario (sin edición manual); clasificación de tratamiento (agudo o crónico); ejecución secuencial de la prevalidación por fórmula; cálculo de fecha de cita posible para crónicas (primer día hábil omitiendo domingos y festivos colombianos, considerando el sábado como día hábil); presentación de resultados preliminares por fórmula con indicación de motivo y siguiente paso; y cierre del flujo digital si ninguna fórmula es apta.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- Contexto aplicable: 3.1, 3.2, 3.3, 3.4, 3.5, 3.8, 3.11.

## Modelo de dominio
- Solicitud: conjunto de fórmulas e historia clínica de un mismo paciente gestionados en una misma sesión; admite varias fórmulas. Origen: contexto 2.4, 3.4 y DEC-P03.
- Fórmula: prescripción identificada por un número numérico de 20 dígitos (estilo MIPRES), que incluye uno o más medicamentos y un diagnóstico; es la unidad de prevalidación (todo o nada). Origen: contexto 2.4, 3.4, DEC-P05 y DEC-P12.
- Medicamento: elemento de una fórmula evaluado individualmente en cobertura PBS y estado de autorización. Origen: contexto 3.4 y DEC-P11.
- Historia clínica: documento cargado una sola vez por solicitud que aporta el diagnóstico o diagnósticos para clasificar el tratamiento. Origen: contexto 3.4, DEC-P03 y DEC-P09.
- Catálogo de diagnósticos crónicos: fuente configurable que define qué diagnósticos corresponden a tratamiento crónico. Origen: contexto 3.4.
- Catálogo de festivos colombianos: fuente configurable por año para determinar días hábiles en el cálculo de la cita posible para fórmulas crónicas. Origen: DEC-P13.

## Contradicciones detectadas
- DEC-P13 modifica la regla del contexto 3.5 sobre la cita posible para tratamientos crónicos ("solo el día calendario siguiente"), al establecer que la cita posible para fórmulas crónicas es el primer día hábil siguiente a la prevalidación, omitiendo domingos y festivos oficiales de Colombia y considerando el día sábado como día hábil.

## Análisis de impacto
- DEC-P01: elimina la referencia al agendamiento en el siguiente paso de fórmula apta en BR-014 y en el resultado final de AC-020, ajustándolos a mostrar únicamente el resultado preliminar apto o no apto.
- DEC-P02 y DEC-P11: modifican la regla de prevalidación de cobertura PBS y autorización en RF-024 (paso 4), RF-025, BR-011, BR-014, AC-016, AC-017, AC-018 y el paso 9 del flujo principal. La consulta de autorización se realiza para todos los medicamentos, pero solo decide para los medicamentos no PBS (los medicamentos PBS son aptos sin requerir autorización; los no PBS solo son aptos si están autorizados). Se remueve el término "vigente" de la verificación de autorización.
- DEC-P03 y DEC-P09: afectan RF-021, RF-022, RF-023, BR-012, AC-019, AC-026, AC-027, AC-028 y CL-012 al establecer una única historia clínica por solicitud.
- DEC-P04 y DEC-P07: afectan RF-029, RF-030, BR-009, Flujo alternativo A1, Excepción E1, AC-003, AC-026 y CL-001 al exigir confirmación de OCR por el usuario sin edición manual y contabilizar el rechazo como intento.
- DEC-P05, DEC-P08 y DEC-P12: afectan RF-022, RF-029, BR-013, AC-013, AC-024, AC-025 y CL-008 al definir la coincidencia con la EPS simulada por número de prescripción de 20 dígitos.
- DEC-P10: afecta RF-021, RNF-010 y AC-001 al establecer la aplicación web responsive y Telegram Mini App como canales de prevalidación.
- DEC-P13: afecta RF-024 (paso 5), BR-015, AC-002, AC-023, AC-029, CL-009, CL-010 y CL-011 al definir el sábado como día hábil y omitir domingos y festivos colombianos en el cálculo de la cita posible.

## Preguntas de aclaración
- OPEN-Q-004. ¿Cuál es el siguiente paso que debe presentarse en la tabla de resultados preliminares cuando una fórmula crónica resulta no apta por tener una fecha habilitada de entrega posterior a la cita posible?
  Por qué importa: BR-014 requiere una tabla con motivo y siguiente paso, pero el contexto 3.4 no especifica el texto del siguiente paso para este escenario.
  Crítica: no
  Propuesta del agente: Esperar a la fecha habilitada por la EPS e iniciar una nueva prevalidación por el canal digital.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-005. ¿Qué sucede con las fórmulas de una solicitud si el documento de la historia clínica falla en sus dos intentos de carga (o es rechazado dos veces), dado que se carga una sola historia clínica por solicitud y el requisito RF-029 solo se refiere a la fórmula asociada?
  Por qué importa: define si la falla de lectura de la historia clínica deja no aptas todas las fórmulas de la solicitud o si se aplica otro criterio de excepción.
  Crítica: no
  Propuesta del agente: Si la historia clínica no se puede validar tras dos intentos, todas las fórmulas de la solicitud quedan no aptas y se orienta a atención presencial.
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Permitir la carga de fórmulas médicas e historia clínica (en foto o PDF) mediante la aplicación web o la Telegram Mini App, confirmar la lectura realizada por OCR sin edición manual, y ejecutar la prevalidación técnica en el orden establecido para informar los resultados preliminares por fórmula, indicando motivo y siguiente paso, e informando que la validación oficial ocurre en el punto de dispensación.

### 2. Contexto
El usuario inicia la prevalidación tras verificar su identidad y autorizar el tratamiento de datos de salud. El sistema procesa los documentos cargados para extraer el número de prescripción (20 dígitos), los medicamentos y el diagnóstico. La prevalidación evalúa en orden la afiliación del paciente, la vigencia de la fórmula, la cobertura PBS, las autorizaciones requeridas para medicamentos no PBS y la fecha habilitada de entrega para tratamientos crónicos. Se aplica el principio de todo o nada por fórmula, mientras que las fórmulas independientes de una misma solicitud continúan su proceso digital.

Decisiones del equipo:
- DEC-P01. La prevalidación completa entra al MVP, en web y Telegram Mini App.
- DEC-P02 (modificada por DEC-P11). La consulta de autorización en la EPS simulada se realiza sobre todos los medicamentos, pero solo determina el resultado para los medicamentos fuera del PBS. Un medicamento PBS es apto sin autorización. Un medicamento no PBS solo es apto si registra estado Autorizado en la EPS simulada.
- DEC-P03. Se carga una sola historia clínica por solicitud.
- DEC-P04. En la confirmación de OCR la persona solo confirma o rechaza lo leído de los documentos; no puede editar campos manualmente.
- DEC-P05. Cada fórmula se identifica mediante un número de prescripción (estilo MIPRES de 20 dígitos), que actúa como llave de búsqueda en la EPS simulada.
- DEC-P07. El rechazo por parte del usuario de la lectura OCR cuenta como un intento de carga del documento (máximo 2 intentos por documento). Tras el primer rechazo o error, el sistema presenta recomendaciones para capturar una foto legible. Al segundo rechazo o falla, la fórmula queda no apta y se orienta a la atención presencial.
- DEC-P08. Una fórmula coincide con la EPS simulada si y solo si: a) su número existe en la EPS simulada; b) la fórmula pertenece al paciente verificado; c) los medicamentos leídos corresponden con los registrados para esa fórmula en la EPS simulada.
- DEC-P09. El diagnóstico de la historia clínica se asigna así: si la historia trae un único diagnóstico, aplica a todas las fórmulas de la solicitud; si trae múltiples diagnósticos, cada fórmula adopta el diagnóstico asociado a su número en la EPS simulada; si no incluye diagnóstico, el documento se califica como incompleto.
- DEC-P10. La prevalidación opera desde una aplicación web responsive, accesible directamente en navegador o mediante Telegram Mini App. Las notificaciones del bot de Telegram son estructuradas y abren la Mini App con botones interactivos. La identidad requiere cédula y código OTP en ambos accesos.
- DEC-P12. El número de prescripción imita el formato numérico de 20 dígitos de MIPRES y vincula en la EPS simulada los datos de paciente, fecha, diagnóstico CIE-10 y lista de medicamentos.
- DEC-P13. La fecha de la cita posible para fórmulas crónicas (paso 5 de la prevalidación) se calcula como el primer día hábil siguiente a la fecha de la prevalidación, omitiendo domingos y festivos oficiales de Colombia según un catálogo configurable por año. El sábado es considerado día hábil.

### 3. Alcance
- Carga de archivos en formato foto (JPG, PNG) o PDF de las fórmulas médicas y de una historia clínica por solicitud mediante interfaz web o Telegram Mini App.
- Extracción automatizada por OCR del número de prescripción de 20 dígitos, medicamentos y diagnóstico.
- Pantalla de confirmación de lectura OCR donde el usuario valida o rechaza el texto leído (sin opción de edición manual).
- Verificación secuencial de prevalidación: 1) Afiliación activa por solicitud; 2) Vigencia de la fórmula; 3) Cobertura PBS por medicamento; 4) Autorización en EPS simulada (decisiva únicamente para no PBS); 5) Fecha habilitada de entrega igual o anterior a la fecha de cita posible (solo crónicas, considerando el sábado como día hábil).
- Clasificación de fórmula como agudo o crónico según el diagnóstico extraído y el catálogo configurable de diagnósticos crónicos.
- Presentación de resultados preliminares por fórmula con indicación explícita de apta/no apta, motivo y siguiente paso, y advertencia de validación oficial en ventanilla.
- Detección de fórmulas manuscritas para marcarlas como no aptas e informar que están fuera del alcance digital.
- Finalización del flujo digital si ninguna fórmula de la solicitud resulta apta.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-005. Como usuario, quiero cargar las fórmulas y la historia clínica por la web o mediante la Mini App de Telegram y confirmar los datos extraídos, para verificar preliminarmente si mis medicamentos son aptos para entrega sin tener que editar manualmente la información.

### 5. Requisitos funcionales
- RF-021. El sistema debe permitir al usuario cargar los documentos (fotos o PDF de fórmulas médica y de una única historia clínica por solicitud) a través de la aplicación web responsive y de la Telegram Mini App, previa aceptación de la autorización de tratamiento de datos de salud. Origen: necesidad, contexto 3.1, 3.4, DEC-P03, DEC-P10.
- RF-022. El sistema debe extraer de los documentos cargados el número de prescripción (20 dígitos), los medicamentos de cada fórmula y el diagnóstico o diagnósticos de la historia clínica. Origen: necesidad, contexto 3.4, DEC-P05, DEC-P12.
- RF-023. El sistema debe clasificar cada fórmula como agudo o crónico comparando su diagnóstico contra un catálogo configurable de diagnósticos crónicos. Si la historia clínica contiene un único diagnóstico, este aplica a todas las fórmulas de la solicitud. Si la historia clínica contiene varios diagnósticos, el sistema debe asignar a cada fórmula el diagnóstico asociado a su número de prescripción en la EPS simulada. Si el diagnóstico asignado no está en el catálogo de crónicos, se clasifica como agudo. Origen: necesidad, contexto 3.4, DEC-P09.
- RF-024. El sistema debe ejecutar la prevalidación de la solicitud respetando estrictamente el siguiente orden:
  1. Afiliación activa del paciente en la EPS simulada (evaluada una única vez por solicitud).
  2. Vigencia de la fórmula médica en la EPS simulada (fecha de vigencia mayor o igual a la fecha actual de prevalidación).
  3. Cobertura PBS de cada medicamento.
  4. Estado de autorización en la EPS simulada para cada medicamento. (Se consulta para todos los medicamentos, pero solo determina el resultado para los medicamentos no cubiertos por el PBS: si es PBS, es apto sin requerir autorización; si es no PBS, requiere estar en estado Autorizado).
  5. Fecha habilitada de entrega de la EPS simulada igual o anterior a la fecha de la cita posible, aplicada exclusivamente a fórmulas crónicas. La fecha de la cita posible se calcula como el primer día hábil siguiente a la prevalidación, omitiendo domingos y festivos del catálogo oficial de Colombia, considerando el día sábado como día hábil.
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
  - Medicamento NO PBS: Requiere estar en estado "Autorizado" en la EPS simulada para ser apto. Si no está autorizado, la fórmula queda no apta.
  Origen: contexto 3.4, DEC-P02, DEC-P11.
- BR-012. Diagnóstico e historia clínica única. La solicitud acepta únicamente una historia clínica. Si la historia clínica carece de diagnóstico, se marca como incompleta y activa el reintento de carga. Si la historia clínica contiene un solo diagnóstico, este aplica a todas las fórmulas; si contiene varios, se asigna a cada fórmula el diagnóstico que corresponde a su número de prescripción en la EPS simulada. Origen: DEC-P03, DEC-P09.
- BR-013. Criterio de coincidencia con EPS simulada. Una fórmula se considera coincidente con la EPS simulada cuando concurren tres condiciones: a) El número de prescripción de 20 dígitos existe en la EPS; b) Está registrada a nombre del paciente validado; c) Los medicamentos leídos corresponden a la lista prescrita registrada bajo ese número en la EPS simulada. Origen: DEC-P05, DEC-P08, DEC-P12.
- BR-014. Motivo y Siguiente Paso. Toda fórmula prevalidada debe mostrar el resultado correspondiente según las siguientes causas:

| Escenario / Causa | Motivo presentado | Siguiente paso presentado |
|---|---|---|
| Afiliación inactiva en EPS | Afiliación inactiva en la EPS simulada. | Comunicarse o acudir a su EPS para actualizar o reactivar su afiliación. |
| Fórmula no vigente | La fórmula médica se encuentra vencida o fuera de fecha. | Solicitar una nueva valoración médica en su EPS. |
| Medicamento no PBS sin autorización | Medicamento no cubierto por el PBS y sin autorización registrada en la EPS. | Consultar los puntos de atención, enlaces o trámites de autorización de su EPS. |
| Documento ilegible, incompleto, sin diagnóstico, no coincidente o 2 rechazos OCR | No fue posible validar los datos del documento con la EPS simulada. | Acudir a la atención presencial en el punto de dispensación con sus documentos físicos. |
| Fórmula manuscrita | Las fórmulas manuscritas no son procesables digitalmente. | Acudir a la atención presencial en el punto de dispensación con la fórmula física. |
| Fecha habilitada de entrega (crónica) posterior a cita posible | La fecha habilitada de entrega por la EPS es posterior a la cita más próxima disponible. | Pendiente de definición (OPEN-Q-004). |
| Fórmula prevalidada exitosamente | Todos los medicamentos cumplen las validaciones preliminares. | Muestra el resultado preliminar de la fórmula como apta. |

Origen: contexto 3.4, DEC-P01, DEC-P02, DEC-P07, DEC-P11, T-003.

- BR-015. Regla de cita posible para crónicos. La fecha de la cita posible para prevalidar fórmulas crónicas es el primer día hábil inmediatamente posterior a la fecha de la prevalidación. Los días domingos y los festivos nacionales colombianos del catálogo anual configurable no se consideran días hábiles; el día sábado se considera día hábil. Origen: DEC-P13.

### 8. Flujo principal
1. El usuario accede a la sección de carga de documentos desde la web o mediante la Telegram Mini App tras verificar su identidad y autorizar el tratamiento de datos de salud.
2. El usuario adjunta las fotos o PDF de las fórmulas médicas y de la única historia clínica de la solicitud.
3. El sistema procesa los documentos por OCR y extrae los números de prescripción de 20 dígitos, medicamentos y diagnósticos.
4. El sistema presenta la vista previa de confirmación de lectura. El usuario verifica y presiona "Confirmar datos".
5. El sistema valida la coincidencia de cada fórmula con la EPS simulada (existencia del número, coincidencia de paciente y medicamentos).
6. El sistema clasifica el tratamiento de cada fórmula en agudo o crónico según el diagnóstico asignado y el catálogo configurable.
7. El sistema verifica la afiliación activa del paciente en la EPS simulada (una vez por solicitud).
8. Para cada fórmula, el sistema verifica la vigencia en la EPS simulada.
9. Para cada medicamento de la fórmula, el sistema verifica la cobertura PBS y consulta el estado de autorización en la EPS simulada para todos los medicamentos, pero el resultado de autorización solo decide la aptitud para los medicamentos no PBS (los medicamentos PBS son aptos sin importar su autorización; los no PBS requieren estar en estado Autorizado).
10. Para fórmulas crónicas, el sistema calcula la fecha de cita posible (siguiente día hábil considerando el sábado como hábil y omitiendo domingos y festivos) y verifica que la fecha habilitada de entrega sea igual o anterior a ella.
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
  1. Si al finalizar la prevalidación todas las fórmulas resultan no aptas, el sistema muestra el resumen de resultados no aptos e informa que la prevalidación digital ha concluido sin formulas aptas.

### 10. Casos límite
- CL-001. Documento rechazado dos veces consecutivas por el usuario en la pantalla de confirmación OCR: el sistema marca la fórmula como no apta tras el segundo rechazo y orienta a la atención presencial. Origen: DEC-P04, DEC-P07.
- CL-008. Solicitud con dos fórmulas en la que la primera falla por no estar registrada en la EPS simulada (número no coincide): el sistema marca la primera fórmula como no apta tras agotar reintentos y permite que la segunda fórmula apta avance con su resultado preliminar. Origen: DEC-16, DEC-P08.
- CL-009. Prevalidación de fórmula crónica realizada un día sábado: el sistema calcula la fecha de la cita posible para el día lunes (si el lunes es hábil) o para el martes (si el lunes es festivo nacional), verificando contra esa fecha la habilitación de entrega. Origen: DEC-P13.
- CL-010. Prevalidación de fórmula crónica en víspera de festivo (ejemplo: día laboral previo a un festivo de mitad de semana): el sistema calcula la cita posible para el primer día hábil siguiente al festivo. Origen: DEC-P13.
- CL-011. Prevalidación de fórmula crónica realizada un día viernes sin festivo el sábado: el sistema calcula como cita posible el día sábado inmediatamente siguiente. Si la prevalidación se realiza un día sábado previo a un lunes festivo, el sistema calcula como cita posible el día martes. Origen: DEC-P13.
- CL-012. Historia clínica cargada sin ningún diagnóstico expreso: el sistema la clasifica como documento incompleto en el intento 1 y solicita nueva carga con consejos de captura. Origen: DEC-P09.

### 11. Criterios de aceptación
- AC-001. Dado un usuario con la identidad verificada que carga una fórmula vigente con medicamentos PBS y su historia clínica en la web o Telegram Mini App, cuando presiona "Confirmar datos" en la vista previa OCR, entonces el sistema despliega el resultado preliminar de la fórmula marcado como apta. Origen: necesidad, contexto 3.4, DEC-P10.
- AC-002. Dada una fórmula crónica prevalidada un día viernes (sin festivo el sábado), cuando la fecha habilitada de entrega en la EPS simulada es el día domingo (posterior a la fecha de cita posible, que es el sábado), entonces el sistema marca la fórmula como no apta y muestra el motivo de fecha habilitada posterior. Origen: necesidad, contexto 3.4, DEC-P13.
- AC-003. Dado un documento cuya lectura OCR presenta errores, cuando el usuario presiona "Rechazar lectura", entonces el sistema contabiliza el intento 1, muestra recomendaciones para la foto y permite volver a cargar el archivo. Si en el segundo intento el usuario vuelve a rechazar, la fórmula queda no apta y se orienta a atención presencial. Origen: contexto 3.4, DEC-P04, DEC-P07.
- AC-004. Dada una solicitud con dos fórmulas independientes, cuando la primera fórmula no es apta por falta de autorización y la segunda es apta, entonces el sistema muestra el resultado preliminar de la primera como no apta y el de la segunda como apta. Origen: contexto 3.4, DEC-16, T-011.
- AC-013. Dado un usuario que carga una fórmula en la web o Telegram Mini App y el número de prescripción de 20 dígitos no existe en la EPS simulada, cuando se agota el segundo intento, entonces el sistema marca la fórmula como no apta por no coincidencia con la EPS. Origen: DEC-P05, DEC-P08.
- AC-014. Dado un paciente con estado de afiliación inactivo en la EPS simulada, cuando inicia la prevalidación de una solicitud con múltiples fórmulas, entonces el sistema detiene inmediatamente el proceso, declara toda la solicitud no apta y muestra el mensaje para comunicarse con la EPS. Origen: contexto 3.4, BR-008.
- AC-015. Dada una fórmula médica cuya fecha de vigencia en la EPS simulada es anterior a la fecha actual de prevalidación, cuando se ejecuta el paso 2 de prevalidación, entonces el sistema marca la fórmula como no apta y muestra el motivo de fórmula vencida y el siguiente paso de nueva valoración médica. Origen: contexto 3.4, BR-014.
- AC-016. Dado un medicamento prescrito que no está cubierto por el PBS y registra estado "No autorizado" en la EPS simulada, cuando se evalúa la fórmula, entonces la fórmula completa resulta no apta y muestra el enlace/puntos de trámite de la EPS. Origen: DEC-P02, DEC-P11, BR-011.
- AC-017. Dado un medicamento prescrito no cubierto por el PBS que registra estado "Autorizado" en la EPS simulada, cuando se evalúa la fórmula y los demás medicamentos son PBS, entonces el sistema marca la fórmula como apta. Origen: DEC-P02, DEC-P11, BR-011.
- AC-018. Dado un medicamento cubierto por el PBS sin registro de autorización en la EPS simulada, cuando se prevalida la fórmula, entonces el sistema lo marca como apto (la autorización no aplica a medicamentos PBS). Origen: DEC-P11, BR-011.
- AC-019. Dada una solicitud con dos fórmulas asociadas a los diagnósticos ficticios diagnóstico crónico A (incluido en el catálogo crónico) y diagnóstico agudo B (no incluido en el catálogo crónico), cuando se completa la prevalidación, entonces el sistema clasifica la primera fórmula como crónica y la segunda como aguda. Origen: contexto 3.4, RF-023.
- AC-020. Dada una solicitud en la que todas las fórmulas resultan no aptas en la prevalidación, cuando finaliza el procesamiento, entonces el sistema muestra el resultado preliminar de cada fórmula como no apta con su motivo de rechazo y finaliza el flujo digital. Origen: contexto 3.4, DEC-P01, RF-028.
- AC-021. Dada cualquier fórmula que complete el proceso de prevalidación (apta o no apta), cuando el sistema despliega la pantalla de resultados, entonces incluye explícitamente la leyenda: "Este resultado es preliminar. La validación oficial se realiza en el punto de dispensación por el personal farmacéutico." Origen: necesidad, contexto 3.4, RF-027.
- AC-022. Dado un usuario que carga una foto correspondiente a una fórmula escrita a mano, cuando el sistema detecta la condición de manuscrita, entonces marca la fórmula como no apta y muestra la indicación de que las fórmulas manuscritas requieren atención presencial. Origen: T-009, RF-031.
- AC-023. Dada una fórmula crónica prevalidada un día sábado previo a un lunes festivo, cuando se evalúa la fecha de cita posible, entonces el sistema determina que la cita posible es el día martes (saltando el domingo y el lunes festivo). Origen: DEC-P13, BR-015.
- AC-024. Dada una fórmula cuyo número de prescripción existe en la EPS simulada pero está registrado a nombre de otro paciente, cuando el sistema evalúa la coincidencia en la prevalidación tras agotar los intentos de carga, entonces el sistema marca la fórmula como no apta y despliega el motivo de no coincidencia con la EPS simulada. Origen: DEC-P08, BR-013.
- AC-025. Dada una fórmula cargada cuyos medicamentos leídos por OCR difieren de los registrados para ese número de prescripción en la EPS simulada, cuando el sistema verifica la coincidencia tras agotar los intentos de carga, entonces marca la fórmula como no apta por no coincidencia con la EPS simulada. Origen: DEC-P08, BR-013.
- AC-026. Dado un usuario que carga una historia clínica que no contiene ningún diagnóstico, cuando el sistema procesa el documento en el primer intento, entonces califica la historia clínica como incompleta, contabiliza el primer intento fallido y muestra una pantalla con consejos para tomar una foto legible. Origen: DEC-P09, BR-012.
- AC-027. Dada una solicitud con dos fórmulas y una historia clínica que contiene un único diagnóstico clasificado como crónico en el catálogo, cuando el sistema procesa la prevalidación, entonces clasifica ambas fórmulas como crónicas. Origen: DEC-P09, BR-012, RF-023.
- AC-028. Dada una solicitud con dos fórmulas y una historia clínica con múltiples diagnósticos, cuando el sistema ejecuta la prevalidación, entonces asigna a cada fórmula el diagnóstico que la EPS simulada tiene asociado a su respectivo número de prescripción. Origen: DEC-P09, BR-012, RF-023.
- AC-029. Dada una fórmula crónica cuya fecha habilitada de entrega en la EPS simulada coincide exactamente con la fecha de la cita posible (siguiente día hábil), cuando se ejecuta la prevalidación y las demás verificaciones cumplen, entonces el sistema marca la fórmula como apta. Origen: DEC-P13, RF-024.

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
- OPEN-Q-004: Pendiente
- OPEN-Q-005: Pendiente

### 16. Trazabilidad
- HU-005: RF-021, RF-022, RF-023, RF-024, RF-025, RF-026, RF-027, RF-028, RF-029, RF-030, RF-031, RNF-010; BR-008, BR-009, BR-010, BR-011, BR-012, BR-013, BR-014, BR-015; AC-001, AC-002, AC-003, AC-004, AC-013, AC-014, AC-015, AC-016, AC-017, AC-018, AC-019, AC-020, AC-021, AC-022, AC-023, AC-024, AC-025, AC-026, AC-027, AC-028, AC-029; CL-001, CL-008, CL-009, CL-010, CL-011, CL-012.
- RF-021: Origen: necesidad, contexto 3.1, 3.4, DEC-P03, DEC-P10; verificado por AC-001, RNF-010.
- RF-022: Origen: necesidad, contexto 3.4, DEC-P05, DEC-P12; verificado por AC-001, AC-013, AC-024, AC-025.
- RF-023: Origen: necesidad, contexto 3.4, DEC-P09; verificado por AC-019, AC-027, AC-028.
- RF-024: Origen: necesidad, contexto 3.4, DEC-P02, DEC-P11, DEC-P13; verificado por AC-001, AC-002, AC-014, AC-015, AC-016, AC-017, AC-018, AC-023, AC-029.
- RF-025: Origen: necesidad, contexto 3.4, DEC-P11; verificado por AC-004, AC-016.
- RF-026: Origen: necesidad, contexto 3.4, DEC-16; verificado por AC-004, CL-008.
- RF-027: Origen: necesidad, contexto 3.4, T-003; verificado por AC-004, AC-015, AC-016, AC-021.
- RF-028: Origen: necesidad, contexto 3.4; verificado por AC-020.
- RF-029: Origen: contexto 3.4, DEC-42, DEC-P07, DEC-P08; verificado por AC-003, AC-013, AC-024, AC-025, CL-001.
- RF-030: Origen: DEC-P04, DEC-P07; verificado por AC-001, AC-003, CL-001.
- RF-031: Origen: T-009, propuesta tecnológica; verificado por AC-022.
- RNF-010: Origen: necesidad, contexto 3.1, DEC-P10; verificado con pruebas funcionales en navegadores Chrome/Safari y apertura de la Mini App en Telegram iOS/Android.
- BR-008: Origen: necesidad, contexto 3.4; verificado por AC-014.
- BR-009: Origen: contexto 3.4, DEC-42, DEC-P07; verificado por AC-003, AC-026, CL-001.
- BR-010: Origen: contexto 3.4, DEC-16; verificado por AC-004, CL-008.
- BR-011: Origen: contexto 3.4, DEC-P02, DEC-P11; verificado por AC-016, AC-017, AC-018.
- BR-012: Origen: DEC-P03, DEC-P09; verificado por AC-019, AC-026, AC-027, AC-028, CL-012.
- BR-013: Origen: DEC-P05, DEC-P08, DEC-P12; verificado por AC-013, AC-024, AC-025, CL-008.
- BR-014: Origen: contexto 3.4, DEC-P01, DEC-P02, DEC-P07, DEC-P11, T-003; verificado por AC-004, AC-014, AC-015, AC-016, AC-021, AC-022.
- BR-015: Origen: DEC-P13; verificado por AC-002, AC-023, AC-029, CL-009, CL-010, CL-011.
- CL-001: Origen: DEC-P04, DEC-P07; verificado por AC-003.
- CL-008: Origen: DEC-16, DEC-P08; verificado por AC-004, AC-013.
- CL-009: Origen: DEC-P13; verificado por AC-002, AC-023.
- CL-010: Origen: DEC-P13; verificado por AC-002, AC-023.
- CL-011: Origen: DEC-P13; verificado por AC-002, AC-023.
- CL-012: Origen: DEC-P09; verificado por AC-026.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad y las preguntas iniciales.
- Versión 1.0: incorporación de las respuestas del equipo (DEC-12, DEC-16, DEC-42), actualización de requisitos, flujos, casos límite y criterios de aceptación, pasando a estado Candidata.
- Versión 1.1: actualización a estado Candidata incorporando decisiones globales DEC-P02 (modificada por DEC-P11), DEC-P03, DEC-P04, DEC-P05, DEC-P07, DEC-P08, DEC-P09, DEC-P10, DEC-P11, DEC-P12 y DEC-P13; resolución de hallazgos T-001 a T-005, T-007 a T-011; reglas de coincidencia EPS con número MIPRES (20 dígitos), confirmación OCR sin edición, fecha hábil para crónicas saltando domingos/festivos, tabla motivo-siguiente paso, fuera de alcance para fórmulas manuscritas, temas de arquitectura para retención y límites de documentos, y cobertura completa de ACs.
- Versión 1.2: actualización a estado Candidata aplicando observaciones del equipo. Corrección de la regla de día hábil en DEC-P13 (el sábado es hábil; prevalidación en viernes da cita el sábado; prevalidación en sábado previo a lunes festivo da cita el martes) en AC-002, AC-023 y CL-011. Eliminación de agendamiento en BR-014 y AC-020 por DEC-P01. Actualización del paso 9 del flujo principal para consultar autorización en todos los medicamentos pero decidir solo sobre no PBS. Remoción del término "vigente" de autorización en BR-011, AC-017 y DEC-P02. Registro de OPEN-Q-004 (siguiente paso para fecha habilitada posterior) y OPEN-Q-005 (falla de historia clínica en 2 intentos). Adición de AC-024 a AC-029 para verificar casos de número ajeno, medicamentos no coincidentes, historia sin diagnóstico, diagnóstico único o múltiple y fecha habilitada igual a cita posible. Reescritura de AC-001 con resultado observable. Corrección de datos de salud ficticios en AC-019 (diagnóstico crónico A y agudo B). Corrección de errata en AC-003 (contexto) y actualización del Análisis de impacto y Contradicciones detectadas.

## Verificación
- Completitud: cumple. Se comprobaron y aplicaron todos los 10 puntos de ajuste solicitados para la versión 1.2. La especificación cubre la prevalidación completa en web y Telegram Mini App, con reglas unívocas de prevalidación por medicamento y fórmulas independientes.
- Consistencia interna: cumple. Se verificó que los requisitos funcionales RF-021 a RF-031 guardan estricta alineación con las reglas de negocio BR-008 a BR-015, los pasos 1 a 11 del flujo principal, los flujos alternativos, los casos límite CL-001 a CL-012 y los criterios de aceptación AC-001 a AC-029. No existen discrepancias sobre el sábado como día hábil ni sobre el alcance de la prevalidación sin agendamiento.
- Consistencia con el contexto: cumple. Se compararon todas las reglas con la sección 3 del contexto y con las decisiones globales DEC-P01 a DEC-P13. La única diferencia con el contexto 3.5 respecto al cálculo de cita posible para tratamientos crónicos se declaró formalmente en la sección de Contradicciones detectadas.
- No ambigüedad: cumple. Se comprobó que los términos, identificadores y comportamientos en pantallas, mensajes y tablas no contienen conceptos indeterminados. Los dos vacíos identificados se marcaron como OPEN-Q-004 y OPEN-Q-005.
- Verificabilidad: cumple. Cada criterio de aceptación de AC-001 a AC-029 está estructurado en formato Dado/Cuando/Entonces y expresa un resultado observable en la interfaz o en el estado del proceso.
- Cobertura de actores: cumple. Se verificó la inclusión de paciente, persona que actúa por el paciente y facilitador comunitario, trazados explícitamente a la historia de usuario HU-005.
- Cobertura de AC: cumple. Se confirmó en la sección 16 que la totalidad de los Requisitos Funcionales (RF-021 a RF-031) y Reglas de Negocio (BR-008 a BR-015) disponen de al menos un criterio de aceptación asignado.
- Trazabilidad: cumple. La sección 16 contiene la correspondencia directa de cada RF, RNF, BR, CL y AC con sus fuentes de origen y sus métodos o criterios de verificación.
- No invención: cumple. Se eliminaron textos no soportados por el contexto (como el siguiente paso inventado de BR-014, ahora remitido a OPEN-Q-004) y se utilizaron calificadores de diagnósticos ficticios en AC-019.
- Delimitación: cumple. Los aspectos referentes al motor OCR, almacenamiento de archivos PDF/fotos y límites de tamaño fueron consignados exclusivamente en la sección 14 como temas para arquitectura.

## Siguiente paso
La SPEC-003 versión 1.2 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
