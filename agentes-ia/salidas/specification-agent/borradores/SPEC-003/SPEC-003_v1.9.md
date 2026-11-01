<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash
Fecha: 2026-11-01 12:07
Petición: Corrige la SPEC-003 y publícala como versión 1.9 en estado Candidata. Aplica solo estos cambios, sin reescribir nada más, y regístralos en el historial y en el Análisis de impacto. No resuelvas ninguna OPEN-Q ni decidas reglas nuevas. Todas las fechas son sintéticas de prueba y cada AC declara en su «Dado» los festivos del catálogo.

(1) H-053. AC-037 queda: «Dada una fórmula crónica prevalidada el lunes 2026-12-07 con el martes 2026-12-08 registrado como festivo en el catálogo, cuando la fecha habilitada es el miércoles 2026-12-09, entonces el sistema toma ese miércoles como cita posible y marca la fórmula como apta; y cuando la fecha habilitada es el jueves 2026-12-10, entonces marca la fórmula como no apta por fecha habilitada posterior.»
(2) H-052. AC-038 queda: «Dada una fórmula crónica prevalidada el jueves 2026-12-31 con los años 2026 y 2027 cargados en el catálogo y el viernes 2027-01-01 registrado como festivo, cuando la fecha habilitada es el sábado 2027-01-02, entonces el sistema toma ese sábado como cita posible y marca la fórmula como apta; y cuando la fecha habilitada es el domingo 2027-01-03, entonces marca la fórmula como no apta por fecha habilitada posterior.»
(3) H-015. Añade AC-043: «Dada una fórmula crónica prevalidada el martes 2026-12-08, registrado como festivo en el catálogo, cuando la fecha habilitada es el miércoles 2026-12-09, entonces el sistema toma ese miércoles como cita posible y marca la fórmula como apta.» Añade AC-044: «Dada una fórmula crónica prevalidada el viernes 2027-04-30 con el sábado 2027-05-01 registrado como festivo, cuando la fecha habilitada es el lunes 2027-05-03, entonces el sistema toma ese lunes como cita posible y marca la fórmula como apta; y cuando la fecha habilitada es el martes 2027-05-04, entonces marca la fórmula como no apta por fecha habilitada posterior.» Origen de ambos: DEC-P13, BR-015.
(4) H-054. Añade AC-045: «Dados una fórmula y una historia clínica leídas por OCR, cuando el sistema presenta la vista previa, entonces muestra el número de prescripción y los medicamentos de la fórmula y los diagnósticos de la historia clínica, ofrece únicamente confirmar o rechazar y ningún campo se puede editar.» Origen: DEC-P04, DEC-P24, RF-030.
(5) H-016. Usa los textos exactos de BR-014. En AC-013, AC-024 y AC-025 el «entonces» debe mostrar el motivo «No fue posible validar los datos del documento con la EPS simulada.» y el siguiente paso «Acudir a la atención presencial en el punto de dispensación con sus documentos físicos.». En AC-031 debe mostrar el motivo de fórmula crónica sin fecha habilitada y su siguiente paso de BR-014. En AC-030 añade solo el siguiente paso; no fijes el motivo, porque depende de PREG-041.
(6) H-057. AC-003 y AC-022 empiezan por «Dada una fórmula» en vez de «Dado un documento», porque la historia clínica se rige por AC-030 y DEC-P15. En AC-022, cuando falla el segundo intento, muestra el motivo y el siguiente paso de documento ilegible de BR-014. AC-040 queda: «Dado un documento que agotó sus 2 intentos de carga y confirmación, cuando el usuario intenta cargarlo de nuevo en esa solicitud, entonces el sistema no permite un tercer intento; la fórmula queda no apta o, si el documento es la historia clínica, todas las fórmulas de la solicitud quedan no aptas.»
(7) H-053 de la revisión de SPEC-008. Añade AC-046: «Dada una fórmula crónica con un medicamento no PBS sin autorización que además no tiene fecha habilitada registrada en la EPS simulada, cuando el sistema ejecuta la prevalidación en orden, entonces se detiene en el paso 4 y muestra únicamente el motivo y el siguiente paso de medicamento no PBS sin autorización.» Origen: RF-024, BR-008.
(8) H-056. Registra como preguntas pendientes, con Crítica: no, Estado: Pendiente y Responsable: equipo, en «Preguntas de aclaración» y en la sección 15, sin responderlas: OPEN-Q-014 (PREG-016 y PREG-020, medicamento ausente del catálogo), OPEN-Q-015 (PREG-017, formato, tamaño y dígitos inválidos), OPEN-Q-016 (PREG-018 y PREG-026, instante y zona horaria de la fecha de prevalidación), OPEN-Q-017 (PREG-021, origen del indicador PBS), OPEN-Q-018 (PREG-024, número de prescripción mal formado), OPEN-Q-019 (PREG-040, ilegible frente a incompleto) y OPEN-Q-020 (PREG-041, motivo si los intentos fallan por causas distintas). Toma el texto de cada pregunta de los archivos adjuntos.
(9) H-044. Corrige en RF-021 «fórmulas médica» por «fórmulas médicas».
(10) H-047 y trazabilidad. En la sección 16 incluye AC-043 a AC-046 en HU-005; AC-043, AC-044 y AC-046 en RF-024; AC-045 en RF-030; AC-043, AC-044, AC-034 y AC-038 en BR-015; AC-046 en BR-008; AC-013, AC-024, AC-025 y AC-030 en BR-014. En las filas RF-029, RF-030 y BR-009 quita los CL de la lista de verificación.
(11) H-051 y H-064. Rehaz la sección «Verificación» para que describa toda la SPEC, no solo el cambio: no escribas «cumple» en Verificabilidad, No ambigüedad, Completitud, Consistencia ni Trazabilidad; escribe «parcial» y nombra lo que sigue abierto (OPEN-Q pendientes y la lectura parcial de PREG-040).
-->

# SPEC-003. Carga de documentos y prevalidación - Versión 1.9

Estado: Candidata
Modo: Iteración
Necesidad original: "Carga de documentos y prevalidación. Con la autorización de datos de salud, el usuario carga las fórmulas y la historia clínica en foto o PDF por la web o por Telegram. Una solicitud admite varias fórmulas del mismo paciente y de los documentos se obtienen los medicamentos de cada fórmula y el diagnóstico. La prevalidación verifica en orden: afiliación activa una vez por solicitud; vigencia de cada fórmula con el dato de la EPS simulada; cobertura PBS de cada medicamento; autorización de cada medicamento en la EPS simulada; y, solo para fórmulas crónicas, que la fecha habilitada de la próxima entrega sea igual o anterior a la fecha de la cita posible. Cada fórmula es todo o nada; si un medicamento falla, la fórmula completa queda no apta, y las fórmulas separadas son independientes. El tratamiento se clasifica como agudo o crónico según un catálogo configurable de diagnósticos crónicos. Se muestra el resultado preliminar por fórmula con motivo y siguiente paso, y se indica que la validación oficial ocurre en el punto. Si no hay ninguna fórmula apta, termina el flujo digital."
Épica: EPIC-003

## Análisis
- Objetivo: permitir al usuario cargar documentos de salud (fórmulas e historia clínica) desde la aplicación web o la Telegram Mini App, confirmar el contenido reconocido por OCR sin edición manual (incluyendo los diagnósticos leídos de la historia clínica), y ejecutar la prevalidación técnica en el orden establecido para determinar cuáles fórmulas son aptas y cuáles requieren gestión directa o atención presencial.
- Alcance inicial: carga de fotos y archivos PDF de fórmulas y de una historia clínica por solicitud; extracción por OCR del número de prescripción (20 dígitos tipo MIPRES), medicamentos y diagnóstico; confirmación de lectura de fórmulas e historia clínica por el usuario (sin edición manual); clasificación de tratamiento (agudo o crónico); ejecución secuencial de la prevalidación por fórmula; cálculo de fecha de cita posible para crónicas (primer día hábil omitiendo domingos y festivos colombianos, considerando el sábado como día hábil); presentación de resultados preliminares por fórmula con indicación de motivo y siguiente paso; y cierre del flujo digital si ninguna fórmula es apta.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- Contexto aplicable: 3.1, 3.2, 3.3, 3.4, 3.5, 3.8, 3.11.

## Modelo de dominio
- Solicitud: conjunto de fórmulas e historia clínica de un mismo paciente gestionados en una misma sesión; admite varias fórmulas. Origen: contexto 2.4, 3.4 y DEC-P03.
- Fórmula: prescripción identificada por un número numérico de 20 dígitos (estilo MIPRES), que incluye uno o más medicamentos y un diagnóstico; es la unidad de prevalidación (todo o nada). Origen: contexto 2.4, 3.4, DEC-P05 y DEC-P12.
- Medicamento: elemento de una fórmula evaluado individualmente en cobertura PBS (con prevalencia del catálogo simulado de cobertura ante diferencias con el indicador de la fórmula devuelto por la EPS simulada) y estado de autorización. Origen: contexto 3.4, DEC-P11 y DEC-P17.
- Historia clínica: documento cargado una sola vez por solicitud que aporta el diagnóstico o diagnósticos para clasificar el tratamiento y que es objeto de confirmación de lectura por OCR. Origen: contexto 3.4, DEC-P03, DEC-P09, DEC-P15 y DEC-P24.
- Catálogo de diagnósticos crónicos: fuente configurable que define qué diagnósticos corresponden a tratamiento crónico. Origen: contexto 3.4.
- Catálogo de festivos colombianos: fuente configurable por año para determinar días hábiles en el cálculo de la cita posible para fórmulas crónicas. Origen: DEC-P13 y DEC-P19.

## Contradicciones detectadas
- DEC-P13 modifica la regla del contexto 3.5 sobre la cita posible para tratamientos crónicos ("solo el día calendario siguiente"), al establecer que la cita posible para fórmulas crónicas es el primer día hábil siguiente a la prevalidación, omitiendo domingos y festivos oficiales de Colombia y considerando el día sábado como día hábil.

## Análisis de impacto
- DEC-P01: elimina la referencia al agendamiento en el siguiente paso de fórmula apta en BR-014 y en el resultado final de AC-020, ajustándolos a mostrar únicamente el resultado preliminar apto o no apto.
- DEC-P02 y DEC-P11: modifican la regla de prevalidación de cobertura PBS y autorización en RF-024 (paso 4), RF-025, BR-011, BR-014, AC-016, AC-017, AC-018 y el paso 9 del flujo principal. La consulta de autorización se realiza para todos los medicamentos, pero solo decide para los medicamentos no PBS.
- DEC-P03 y DEC-P09: afectan RF-021, RF-022, RF-023, BR-012, AC-019, AC-027, AC-028 y CL-012 al establecer una única historia clínica por solicitud.
- DEC-P04 y DEC-P07: afectan RF-029, RF-030, BR-009, Flujo alternativo A1, Excepción E1, AC-003, AC-045 y CL-001 al exigir confirmación de OCR por el usuario sin edición manual y contabilizar el rechazo como intento.
- DEC-P05, DEC-P08 y DEC-P12: afectan RF-022, RF-029, BR-013, AC-013, AC-024, AC-025 y CL-008 al definir la coincidencia con la EPS simulada por número de prescripción de 20 dígitos.
- DEC-P10: afectan RF-021, RNF-010 y AC-001 al establecer la aplicación web responsive y Telegram Mini App como canales de prevalidación.
- DEC-P13: afecta RF-024 (paso 5), BR-015, AC-002, AC-023, AC-029, AC-037, AC-038, AC-043, AC-044, CL-009, CL-010 y CL-011 al definir el sábado como día hábil y omitir domingos y festivos colombianos en el cálculo de la cita posible.
- DEC-P14: afecta BR-014 y responde OPEN-Q-004. Establece el siguiente paso presentado para fórmulas crónicas con fecha habilitada posterior a la cita posible como la gestión directa del usuario con su EPS.
- DEC-P15: afectan RF-029, BR-009, Excepción E1, añaden AC-030 y responden OPEN-Q-005. Establecen que si la historia clínica falla en sus dos intentos de carga o confirmación, todas las fórmulas de la solicitud quedan no aptas y se orienta a la atención presencial.
- DEC-P16: afectan RF-024 (paso 5), BR-014 y añaden AC-031. Establecen que una fórmula crónica sin fecha habilitada registrada en la EPS simulada queda no apta y se orienta a la atención presencial.
- DEC-P17: afectan RF-024 (paso 3). Establecen que la cobertura PBS se determine a partir del catálogo simulado de cobertura, el cual prevalece si difiere del indicador de la fórmula devuelto por la EPS simulada.
- DEC-P19: afectan RF-024 (paso 5) y añaden AC-032. Definen que si el catálogo de festivos no contiene el año requerido para la evaluación, no se emite resultado preliminar para esa fórmula crónica, se despliega un mensaje de error de sistema y se registra el evento.
- DEC-P22 y DEC-P26: afectan la sección 2 al precisar que la Mini App exige cédula y código para una vinculación nueva; una vinculación vencida se reactiva solo con código nuevo.
- DEC-P23 y DEC-P28: afectan RF-031, BR-009, BR-014, Excepción E3 y AC-022 al unificar el tratamiento de la fórmula manuscrita como documento ilegible que muestra el mensaje común «No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial», con los mismos 2 intentos de carga. Responde OPEN-Q-013.
- DEC-P24: afectan RF-030, AC-030 y AC-045 al incluir los diagnósticos leídos de la historia clínica en la vista previa de confirmación para que la persona confirme o rechace.
- Correcciones v1.9 (H-015, H-016, H-044, H-047, H-051, H-052, H-053, H-054, H-056, H-057, H-064): actualizan AC-003, AC-013, AC-022, AC-024, AC-025, AC-030, AC-031, AC-037 y AC-038 con textos explícitos de motivos, siguientes pasos y fechas sintéticas concretas; añaden AC-043, AC-044, AC-045 y AC-046; ajustan errata en RF-021; corrigen trazabilidad en la sección 16; registran OPEN-Q-014 a OPEN-Q-020 como preguntas abiertas pendientes; y actualizan la sección Verificación reflejando estado parcial en los criterios con temas abiertos.

## Preguntas de aclaración
- OPEN-Q-006 (H-006/PREG-019). ¿La afiliación se verifica antes de los documentos y qué resultado gana si falla junto con otro documento?
  Por qué importa: define la precedencia de errores globales frente a errores por documento en la solicitud.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-007 (H-007/PREG-013). ¿Cómo debe tratarse y presentarse una fórmula crónica sin resultado por falta de año en el catálogo de festivos?
  Por qué importa: define el comportamiento y los mensajes ante errores de configuración del sistema.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-008 (H-008/PREG-012). ¿Qué comportamiento debe tener el sistema si la EPS simulada o un catálogo externo no responde durante la prevalidación?
  Por qué importa: define la resiliencia y el manejo de excepciones por fallas de servicios simulados.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-009 (H-009/PREG-010). ¿Bajo qué criterio exacto se considera que los medicamentos leídos por OCR "corresponden" con los registrados en la EPS simulada?
  Por qué importa: previene rechazos erróneos o aceptación indebida por variaciones tipográficas del OCR.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-010 (H-010/PREG-011). ¿Cuál es el criterio de coincidencia y validación para la historia clínica frente a la EPS simulada?
  Por qué importa: asegura que la historia clínica pertenezca al paciente y sea válida antes de extraer diagnósticos.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-011 (H-011/PREG-015). ¿Cuál es el tiempo y la política de retención y almacenamiento de los archivos de fórmulas e historias clínicas cargadas?
  Por qué importa: cumplimiento normativo (Ley 1581) y directrices de arquitectura y almacenamiento.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-012 (H-012/PREG-014). Si una solicitud no apta es corregida y devuelta a prevalidación, ¿los intentos de carga se reinician o continúan acumulados?
  Por qué importa: define la regla de negocio para el ciclo de vida de los reintentos en solicitudes rechazadas.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-013. ¿Cómo distingue el sistema una fórmula manuscrita de otro tipo de documento ilegible para aplicarle su mensaje propio?
  Por qué importa: define el criterio técnico de detección de fórmulas manuscritas frente a otros errores de lectura OCR.
  Crítica: no
  Estado: Respondida (DEC-P28)
  Responsable: equipo
- OPEN-Q-014 (PREG-016 y PREG-020). ¿Qué resultado y tratamiento tiene un medicamento que no figura en el catálogo simulado de cobertura PBS?
  Por qué importa: define el comportamiento, el oráculo y el resultado cuando un medicamento prescrito no aparece en el catálogo simulado de cobertura PBS.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-015 (PREG-017). ¿Qué entradas inválidas (formatos distintos a JPG/PNG/PDF, exceso de tamaño/páginas, o dígitos no válidos) se rechazan y cuáles cuentan como intento de carga?
  Por qué importa: define el manejo funcional de archivos e insumos inválidos y su efecto sobre el conteo de intentos de carga.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-016 (PREG-018 y PREG-026). ¿Qué instante y qué zona horaria definen la fecha de prevalidación?
  Por qué importa: determina el resultado de evaluaciones de vigencia, primer día hábil y cálculo de cita posible cerca de la medianoche.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-017 (PREG-021). ¿El indicador PBS de la fórmula es un dato devuelto por la EPS simulada o extraído del documento físico por OCR?
  Por qué importa: define si la discrepancia frente al catálogo simulado se prepara contra la EPS o contra la lectura del documento.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-018 (PREG-024). ¿Qué tratamiento se aplica si el número de fórmula no tiene 20 dígitos numéricos?
  Por qué importa: define si un número malformado por error de OCR cuenta como no coincidente, ilegible/incompleto o se rechaza antes.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-019 (PREG-040). ¿Cuándo un documento es ilegible y cuándo es incompleto si el OCR lee solo una parte de la información?
  Por qué importa: define qué motivo de BR-014 se presenta al usuario ante lecturas parciales o con datos faltantes.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-020 (PREG-041). Si un documento falla por causas distintas en sus dos intentos, ¿qué motivo de la tabla BR-014 se despliega al usuario?
  Por qué importa: establece la regla para seleccionar el motivo final ante intentos fallidos por causas combinadas.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Permitir la carga de fórmulas médicas e historia clínica (en foto o PDF) mediante la aplicación web o la Telegram Mini App, confirmar la lectura realizada por OCR sin edición manual (incluyendo diagnóstico e historia clínica), y ejecutar la prevalidación técnica en el orden establecido para informar los resultados preliminares por fórmula, indicando motivo y siguiente paso, e informando que la validación oficial ocurre en el punto de dispensación.

### 2. Contexto
El usuario inicia la prevalidación tras verificar su identidad y autorizar el tratamiento de datos de salud. La Mini App exige cédula y código para una vinculación nueva; una vinculación vencida se reactiva solo con código nuevo (DEC-P22, DEC-P26). El sistema procesa los documentos cargados para extraer el número de prescripción (20 dígitos), los medicamentos y el diagnóstico. La prevalidación evalúa en orden la afiliación del paciente, la vigencia de la fórmula, la cobertura PBS, las autorizaciones requeridas para medicamentos no PBS y la fecha habilitada de entrega para tratamientos crónicos. Se aplica el principio de todo o nada por fórmula, mientras que las fórmulas independientes de una misma solicitud continúan su proceso digital.

Decisiones del equipo:
- DEC-P01. La prevalidación completa entra al MVP, en web y Telegram Mini App.
- DEC-P02 (modificada por DEC-P11). La consulta de autorización en la EPS simulada se realiza sobre todos los medicamentos, pero solo determina el resultado para los medicamentos fuera del PBS. Un medicamento PBS es apto sin autorización. Un medicamento no PBS solo es apto si registra estado Autorizado en la EPS simulada.
- DEC-P03. Se carga una sola historia clínica por solicitud.
- DEC-P04. En la confirmación de OCR la persona solo confirma o rechaza lo leído de los documentos; no puede editar campos manualmente.
- DEC-P05. Cada fórmula se identifica mediante un número de prescripción (estilo MIPRES de 20 dígitos), que actúa como llave de búsqueda en la EPS simulada.
- DEC-P07. El rechazo por parte del usuario de la lectura OCR cuenta como un intento de carga del documento (máximo 2 intentos por documento). Tras el primer rechazo o error, el sistema presenta recomendaciones para capturar una foto legible. Al segundo rechazo o falla, la fórmula queda no apta y se orienta a la atención presencial.
- DEC-P08. Una fórmula coincide con la EPS simulada si y solo si: a) su número existe en la EPS simulada; b) la fórmula pertenece al paciente verificado; c) los medicamentos leídos corresponden con los registrados para esa fórmula en la EPS simulada.
- DEC-P09. El diagnóstico de la historia clínica se asigna así: si la historia trae un único diagnóstico, aplica a todas las fórmulas de la solicitud; si trae múltiples diagnósticos, cada fórmula adopta el diagnóstico asociado a su número en la EPS simulada; si no incluye diagnóstico, el documento se califica como incompleto.
- DEC-P10. La prevalidación opera desde una aplicación web responsive, accesible directamente en navegador o mediante Telegram Mini App. Las notificaciones del bot de Telegram son estructuradas y abren la Mini App con botones interactivos. La Mini App exige cédula y código para una vinculación nueva; una vinculación vencida se reactiva solo con código nuevo (DEC-P22, DEC-P26).
- DEC-P12. El número de prescripción imita el formato numérico de 20 dígitos de MIPRES y vincula en la EPS simulada los datos de paciente, fecha, diagnóstico CIE-10 y lista de medicamentos.
- DEC-P13. La fecha de la cita posible para fórmulas crónicas (paso 5 de la prevalidación) se calcula como el primer día hábil siguiente a la fecha de la prevalidación, omitiendo domingos y festivos oficiales de Colombia según un catálogo configurable por año. El sábado es considerado día hábil.
- DEC-P14. Si la fecha habilitada de entrega de una fórmula crónica es posterior a la cita posible, el siguiente paso presentado indica que el usuario debe gestionarla directamente con su EPS. Responde OPEN-Q-004.
- DEC-P15. Si el documento de historia clínica falla en sus dos intentos de carga o confirmación, todas las fórmulas de la solicitud quedan no aptas y se orienta a la atención presencial. Responde OPEN-Q-005.
- DEC-P16. Una fórmula clasificada como crónica que no tenga fecha habilitada de entrega registrada en la EPS simulada queda no apta y se orienta a la atención presencial.
- DEC-P17. La cobertura PBS de cada medicamento se determina mediante el catálogo simulado de cobertura. Si el indicador de la fórmula devuelto por la EPS simulada y el catálogo difieren, prevalece la información del catálogo simulado.
- DEC-P19. Si el catálogo de festivos colombianos no contiene el año necesario para calcular la fecha de cita posible de una fórmula crónica, no se emite resultado preliminar para dicha fórmula, se despliega un mensaje de error de sistema y se registra el evento.
- DEC-P22. Precisa DEC-P10: los datos de Telegram nunca prueban la identidad. La Mini App exige cédula y código cuando el chat no tiene una vinculación vigente con ese paciente; con vinculación vigente no se pide un código nuevo en cada gestión.
- DEC-P23 (modificada por DEC-P28). El sistema no distingue las fórmulas manuscritas. Un documento ilegible, manuscrito o no, muestra un solo mensaje común: «No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial». Se mantienen los 2 intentos de carga. Responde OPEN-Q-013.
- DEC-P24. La historia clínica también se confirma: se muestran los diagnósticos leídos y la persona solo confirma o rechaza, dentro de la web o la Mini App. Responde PREG-009.
- DEC-P26. Reactivar una vinculación vencida exige solo un código nuevo. Cédula y código se exigen en una vinculación nueva.
- DEC-P28. Modifica DEC-P23: el sistema no distingue las fórmulas manuscritas. Un documento ilegible, manuscrito o no, muestra un solo mensaje común: «No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial». Se mantienen los 2 intentos de carga.

### 3. Alcance
- Carga de archivos en formato foto (JPG, PNG) o PDF de las fórmulas médicas y de una historia clínica por solicitud mediante interfaz web o Telegram Mini App.
- Extracción automatizada por OCR del número de prescripción de 20 dígitos, medicamentos y diagnóstico.
- Pantalla de confirmación de lectura OCR donde el usuario valida o rechaza el texto leído de las fórmulas y de la historia clínica (sin opción de edición manual).
- Verificación secuencial de prevalidación: 1) Afiliación activa por solicitud; 2) Vigencia de la fórmula; 3) Cobertura PBS por medicamento basada en el catálogo simulado (prevaleciendo sobre el indicador de la EPS simulada); 4) Autorización en EPS simulada (decisiva únicamente para no PBS); 5) Fecha habilitada de entrega igual o anterior a la fecha de cita posible (solo crónicas, considerando el sábado como día hábil y gestionando la ausencia de fecha o falta de catálogo anual).
- Clasificación de fórmula como agudo o crónico según el diagnóstico extraído y el catálogo configurable de diagnósticos crónicos.
- Presentación de resultados preliminares por fórmula con indicación explícita de apta/no apta, motivo y siguiente paso, y advertencia de validación oficial en ventanilla.
- Tratamiento de documentos ilegibles (manuscritos o no) con 2 intentos de carga y mensaje común orientando a la atención presencial.
- Finalización del flujo digital si ninguna fórmula de la solicitud resulta apta o si la historia clínica falla sus reintentos.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-005. Como usuario, quiero cargar las fórmulas y la historia clínica por la web o mediante la Mini App de Telegram y confirmar los datos extraídos (incluyendo los diagnósticos), para verificar preliminarmente si mis medicamentos son aptos para entrega sin tener que editar manualmente la información.

### 5. Requisitos funcionales
- RF-021. El sistema debe permitir al usuario cargar los documentos (fotos o PDF de fórmulas médicas y de una única historia clínica por solicitud) a través de la aplicación web responsive y de la Telegram Mini App, previa aceptación de la autorización de tratamiento de datos de salud. Origen: necesidad, contexto 3.1, 3.4, DEC-P03, DEC-P10.
- RF-022. El sistema debe extraer de los documentos cargados el número de prescripción (20 dígitos), los medicamentos de cada fórmula y el diagnóstico o diagnósticos de la historia clínica. Origen: necesidad, contexto 3.4, DEC-P05, DEC-P12.
- RF-023. El sistema debe clasificar cada fórmula como agudo o crónico comparando su diagnóstico contra un catálogo configurable de diagnósticos crónicos. Si la historia clínica contiene un único diagnóstico, este aplica a todas las fórmulas de la solicitud. Si la historia clínica contiene varios diagnósticos, el sistema debe asignar a cada fórmula el diagnóstico asociado a su número de prescripción en la EPS simulada. Si el diagnóstico asignado no está en el catálogo de crónicos, se clasifica como agudo. Origen: necesidad, contexto 3.4, DEC-P09.
- RF-024. El sistema debe ejecutar la prevalidación de la solicitud respetando estrictamente el siguiente orden:
  1. Afiliación activa del paciente en la EPS simulada (evaluada una única vez por solicitud).
  2. Vigencia de la fórmula médica en la EPS simulada (fecha de vigencia mayor o igual a la fecha actual de prevalidación).
  3. Cobertura PBS de cada medicamento, determinada mediante el catálogo simulado de cobertura. Si el indicador de cobertura de la fórmula devuelto por la EPS simulada difiere del catálogo simulado, prevalece la información registrada en el catálogo simulado.
  4. Estado de autorización en la EPS simulada para cada medicamento. (Se consulta para todos los medicamentos, pero solo determina el resultado para los medicamentos no cubiertos por el PBS: si es PBS, es apto sin requerir autorización; si es no PBS, requiere estar en estado Autorizado).
  5. Fecha habilitada de entrega de la EPS simulada igual o anterior a la fecha de la cita posible, aplicada exclusivamente a fórmulas crónicas. La fecha de la cita posible se calcula como el primer día hábil siguiente a la prevalidación, omitiendo domingos y festivos del catálogo oficial de Colombia, considerando el día sábado como día hábil. Si la fórmula crónica no posee fecha habilitada registrada en la EPS simulada, se marca como no apta y se orienta a la atención presencial. Si el catálogo de festivos colombianos no contiene el año necesario para calcular la cita posible, no se emite resultado para esa fórmula crónica, se despliega un mensaje de error de sistema y se registra el evento.
  Origen: necesidad, contexto 3.4, DEC-P02, DEC-P11, DEC-P13, DEC-P16, DEC-P17, DEC-P19.
- RF-025. El sistema debe aplicar la regla de todo o nada por fórmula: si un solo medicamento de la fórmula no cumple con los criterios de la prevalidación, o si el documento de la fórmula presenta falla de lectura o no coincidencia tras los intentos permitidos, la fórmula completa se marca como no apta. Origen: necesidad, contexto 3.4, DEC-P11.
- RF-026. El sistema debe tratar cada fórmula de una solicitud como una unidad independiente, permitiendo que las fórmulas aptas continúen en el flujo digital aunque otras fórmulas de la misma solicitud resulten no aptas. Origen: necesidad, contexto 3.4, DEC-16.
- RF-027. El sistema debe presentar en pantalla el resultado preliminar por fórmula (apta o no apta), desplegando el motivo específico y el siguiente paso correspondiente de acuerdo con la tabla de la regla BR-014, e incluir visiblemente el mensaje: "Este resultado es preliminar. La validación oficial se realiza en el punto de dispensación por el personal farmacéutico." Origen: necesidad, contexto 3.4, T-003.
- RF-028. El sistema debe finalizar el flujo digital e informar al usuario si ninguna de las fórmulas de la solicitud resulta apta tras la prevalidación. Origen: necesidad, contexto 3.4.
- RF-029. El sistema debe permitir un máximo de dos (2) intentos de carga por documento (el intento inicial y un reintento). Si en el primer intento la lectura de una fórmula o de la historia clínica no es exitosa por ser ilegible (manuscrita o no), incompleta, carecer de diagnóstico, no coincidir con la EPS simulada o ser rechazada por el usuario, el sistema debe mostrar recomendaciones para tomar la foto antes de permitir el reintento. Si la falla persiste en el segundo intento, la fórmula asociada queda no apta. Si la falla de lectura o confirmación en sus dos intentos ocurre en el documento de historia clínica, todas las fórmulas de la solicitud quedan no aptas y se orienta a la atención presencial. Origen: contexto 3.4, DEC-42, DEC-P07, DEC-P08, DEC-P15, DEC-P24, DEC-P28.
- RF-030. El sistema debe presentar al usuario una vista previa de los datos extraídos por OCR de las fórmulas (número de prescripción de 20 dígitos y medicamentos) y de la historia clínica (diagnósticos leídos) para que únicamente confirme o rechace la lectura. El sistema no debe permitir la edición manual de los campos extraídos. El rechazo por parte del usuario contabilizará como un intento fallido de carga del documento. Origen: DEC-P04, DEC-P07, DEC-P24.
- RF-031. El sistema no distingue las fórmulas manuscritas. Un documento ilegible, manuscrito o no, muestra el mensaje común «No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial» y sigue los 2 intentos de carga de RF-029. Origen: DEC-P23, DEC-P28.

### 6. Requisitos no funcionales
- RNF-010. Usabilidad / Multicanal. La interfaz de carga, confirmación de OCR y consulta de resultados preliminares debe ser una aplicación web responsive, operativa en navegadores móviles/escritorio y accesible como Telegram Mini App sin requerir la instalación de una aplicación nativa. Se verifica con: pruebas de ejecución en navegadores Chrome/Safari y apertura de la Mini App desde el bot de Telegram en dispositivos iOS y Android. Origen: necesidad, contexto 3.1, DEC-P10.

### 7. Reglas de negocio
- BR-008. Evaluación secuencial y detención por afiliación. Si la verificación de afiliación en la EPS simulada da estado inactivo, el sistema detiene inmediatamente la evaluación de toda la solicitud. Si la afiliación es activa, cada fórmula se evalúa en orden y, ante la primera regla incumplida, esa fórmula queda no apta con su motivo. Origen: necesidad, contexto 3.4.
- BR-009. Control de intentos de carga y confirmación. Cada documento cuenta con dos (2) intentos de procesamiento. Se considera intento fallido cuando la imagen no permite extracción OCR (incluyendo documentos ilegibles o manuscritos), está incompleta, falta el diagnóstico en la historia clínica, los datos extraídos no coinciden con la EPS simulada o el usuario rechaza la confirmación de lectura. Al segundo intento fallido en una fórmula, esta queda no apta. Si los dos intentos fallidos corresponden a la historia clínica de la solicitud, todas las fórmulas de la solicitud quedan no aptas y se orienta a la atención presencial. Origen: contexto 3.4, DEC-42, DEC-P07, DEC-P15, DEC-P23, DEC-P28.
- BR-010. Independencia entre fórmulas. Las decisiones sobre una fórmula no afectan el procesamiento ni el resultado de las demás fórmulas de la misma solicitud. Origen: contexto 3.4, DEC-16.
- BR-011. Lógica de evaluación de Cobertura PBS y Autorización.
  - Medicamento PBS: Apto sin requerir autorización.
  - Medicamento NO PBS: Requiere estar en estado "Autorizado" en la EPS simulada para ser apto. Si no está autorizado, la fórmula queda no apta.
  Origen: contexto 3.4, DEC-P02, DEC-P11.
- BR-012. Diagnóstico e historia clínica única. La solicitud acepta únicamente una historia clínica. Si la historia clínica carece de diagnóstico, se marca como incompleta y activa el reintento de carga. Si la historia clínica contiene un solo diagnóstico, este aplica a todas las fórmulas; si contiene varios, se asigna a cada fórmula el diagnóstico que corresponde a su número de prescripción en la EPS simulada. Origen: DEC-P03, DEC-P09, DEC-P24.
- BR-013. Criterio de coincidencia con EPS simulada. Una fórmula se considera coincidente con la EPS simulada cuando concurren tres condiciones: a) El número de prescripción de 20 dígitos existe en la EPS; b) Está registrada a nombre del paciente validado; c) Los medicamentos leídos corresponden a la lista prescrita registrada bajo ese número en la EPS simulada. Origen: DEC-P05, DEC-P08, DEC-P12.
- BR-014. Motivo y Siguiente Paso. Toda fórmula prevalidada debe mostrar el resultado correspondiente según las siguientes causas:

| Escenario / Causa | Motivo presentado | Siguiente paso presentado |
|---|---|---|
| Afiliación inactiva en EPS | Afiliación inactiva en la EPS simulada. | Comunicarse o acudir a su EPS para actualizar o reactivar su afiliación. |
| Fórmula no vigente | La fórmula médica se encuentra vencida o fuera de fecha. | Solicitar una nueva valoración médica en su EPS. |
| Medicamento no PBS sin autorización | Medicamento no cubierto por el PBS y sin autorización registrada en la EPS. | Consultar los puntos de atención, enlaces o trámites de autorización de su EPS. |
| Documento ilegible (manuscrito o no) | No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial. | Acudir a la atención presencial en el punto de dispensación con sus documentos físicos. |
| Documento incompleto, sin diagnóstico, no coincidente o 2 rechazos OCR | No fue posible validar los datos del documento con la EPS simulada. | Acudir a la atención presencial en el punto de dispensación con sus documentos físicos. |
| Fecha habilitada de entrega (crónica) posterior a cita posible | La fecha habilitada de entrega por la EPS es posterior a la cita más próxima disponible. | Indicar que lo gestione directamente con su EPS. |
| Fórmula crónica sin fecha habilitada registrada en EPS | Fórmula crónica sin fecha habilitada de entrega registrada en la EPS simulada. | Acudir a la atención presencial en el punto de dispensación. |
| Fórmula prevalidada exitosamente | Todos los medicamentos cumplen las validaciones preliminares. | Muestra el resultado preliminar de la fórmula como apta. |

Origen: contexto 3.4, DEC-P01, DEC-P02, DEC-P07, DEC-P11, DEC-P14, DEC-P16, DEC-P23, DEC-P28, T-003.

- BR-015. Regla de cita posible para crónicos. La fecha de la cita posible para prevalidar fórmulas crónicas es el primer día hábil inmediatamente posterior a la fecha de la prevalidación. Los días domingos y los festivos nacionales colombianos del catálogo anual configurable no se consideran días hábiles; el día sábado se considera día hábil. Origen: DEC-P13.

### 8. Flujo principal
1. El usuario accede a la sección de carga de documentos desde la web o mediante la Telegram Mini App tras verificar su identidad y autorizar el tratamiento de datos de salud.
2. El usuario adjunta las fotos o PDF de las fórmulas médicas y de la única historia clínica de la solicitud.
3. El sistema procesa los documentos por OCR y extrae los números de prescripción de 20 dígitos, medicamentos y diagnósticos.
4. El sistema presenta la vista previa de confirmación de lectura tanto para las fórmulas como para la historia clínica. El usuario verifica y presiona "Confirmar datos".
5. El sistema valida la coincidencia de cada fórmula con la EPS simulada (existencia del número, coincidencia de paciente y medicamentos).
6. El sistema clasifica el tratamiento de cada fórmula en agudo o crónico según el diagnóstico asignado y el catálogo configurable.
7. El sistema verifica la afiliación activa del paciente en la EPS simulada (una vez por solicitud).
8. Para cada fórmula, el sistema verifica la vigencia en la EPS simulada.
9. Para cada medicamento de la fórmula, el sistema verifica la cobertura PBS en el catálogo simulado (prevaleciendo sobre el indicador de la EPS simulada) y consulta el estado de autorización en la EPS simulada para todos los medicamentos, pero el resultado de autorización solo decide la aptitud para los medicamentos no PBS (los medicamentos PBS son aptos sin importar su autorización; los no PBS requieren estar en estado Autorizado).
10. Para fórmulas crónicas, el sistema calcula la fecha de cita posible (siguiente día hábil considerando el sábado como hábil y omitiendo domingos y festivos del catálogo anual) y verifica que posea fecha habilitada y que esta sea igual o anterior a la cita posible.
11. El sistema despliega el resultado preliminar por fórmula con su motivo, siguiente paso y la leyenda legal de validación oficial en el punto de dispensación.

### 9. Flujos alternativos y de excepción
- A1. Reintento por rechazo del usuario o falla de lectura (intento 1):
  1. El usuario observa un error en la vista previa OCR de un documento (fórmula o historia clínica) y presiona "Rechazar lectura" (o el sistema detecta documento ilegible —manuscrito o no—, incompleto, sin diagnóstico o no coincidente).
  2. El sistema contabiliza el intento 1 de 2.
  3. El sistema muestra una pantalla intermedia con consejos para la captura de documentos (buena iluminación, enfoque claro, sin sombras ni cortes).
  4. El usuario carga nuevamente el documento y el sistema retorna al paso 3 del flujo principal.
- A2. Solicitud con múltiples fórmulas y fallas parciales:
  1. Si una de las fórmulas resulta no apta (por ejemplo, medicamento no PBS sin autorización), el sistema registra dicha fórmula como no apta con su motivo y siguiente paso.
  2. Las demás fórmulas de la misma solicitud que superen todas las validaciones continúan como aptas.
- E1. Falla persistente en el segundo intento de carga:
  1. Si en el segundo intento el usuario rechaza la lectura OCR de una fórmula o esta sigue fallando en legibilidad (manuscrita o no), completitud, diagnóstico o coincidencia con la EPS, el sistema marca esa fórmula como no apta.
  2. Si el fallo en dos intentos corresponde a la historia clínica de la solicitud, todas las fórmulas de la solicitud quedan no aptas.
  3. El sistema muestra el motivo correspondiente y el siguiente paso de atención presencial.
- E2. Afiliación inactiva:
  1. Si la verificación de afiliación en la EPS simulada retorna estado inactivo, el sistema detiene inmediatamente el procesamiento de la solicitud.
  2. Muestra a nivel global el motivo "Afiliación inactiva en la EPS simulada" y el siguiente paso para contactar a la EPS, bloqueando la prevalidación de todas las fórmulas.
- E3. Documento ilegible (manuscrito o no):
  1. El sistema identifica que el documento cargado no se puede leer, mostrando el mensaje común «No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial», contabilizándolo como intento 1.
  2. Si se agotan los dos intentos sin superar la lectura, marca la fórmula como no apta, despliega el motivo y siguiente paso específico para documento ilegible y orienta a la atención presencial.
- E4. Ninguna fórmula apta:
  1. Si al finalizar la prevalidación todas las fórmulas resultan no aptas, el sistema muestra el resumen de resultados no aptos e informa que la prevalidación digital ha concluido sin fórmulas aptas.

### 10. Casos límite
- CL-001. Documento rechazado dos veces consecutivas por el usuario en la pantalla de confirmación OCR: el sistema marca la fórmula como no apta tras el segundo rechazo y orienta a la atención presencial. Origen: DEC-P04, DEC-P07.
- CL-008. Solicitud con dos fórmulas en la que la primera falla por no estar registrada en la EPS simulada (número no coincide): el sistema marca la primera fórmula como no apta tras agotar reintentos y permite que la segunda fórmula apta avance con su resultado preliminar. Origen: DEC-16, DEC-P08.
- CL-009. Prevalidación de fórmula crónica realizada un día sábado: el sistema calcula la fecha de la cita posible para el día lunes (si el lunes es hábil) o para el martes (si el lunes es festivo nacional), verificando contra esa fecha la habilitación de entrega. Origen: DEC-P13.
- CL-010. Prevalidación de fórmula crónica en víspera de festivo (ejemplo: día laboral previo a un festivo de mitad de semana): el sistema calcula la cita posible para el primer día hábil siguiente al festivo. Origen: DEC-P13.
- CL-011. Prevalidación de fórmula crónica realizada un día viernes sin festivo el sábado: el sistema calcula como cita posible el día sábado inmediatamente siguiente. Si la prevalidación se realiza un día sábado previo a un lunes festivo, el sistema calcula como cita posible el día martes. Origen: DEC-P13.
- CL-012. Historia clínica cargada sin ningún diagnóstico expreso: el sistema la clasifica como documento incompleto en el intento 1 y solicita nueva carga con consejos de captura. Origen: DEC-P09.

### 11. Criterios de aceptación
- AC-001. Dado un usuario con la identidad verificada que carga una fórmula vigente con medicamentos PBS y su historia clínica en la web o Telegram Mini App, cuando presiona "Confirmar datos" en la vista previa OCR, entonces el sistema despliega el resultado preliminar de la fórmula marcado como apta. Origen: necesidad, contexto 3.4, DEC-P10.
- AC-002. Dada una fórmula crónica prevalidada un día viernes (sin festivo el sábado), cuando la fecha habilitada de entrega en la EPS simulada es el día domingo (posterior a la fecha de cita posible, que es el sábado), entonces el sistema marca la fórmula como no apta, muestra el motivo de fecha habilitada posterior y despliega el siguiente paso de gestionarlo directamente con su EPS. Origen: necesidad, contexto 3.4, DEC-P13, DEC-P14.
- AC-003. Dada una fórmula cuya lectura OCR presenta errores, cuando el usuario presiona "Rechazar lectura", entonces el sistema contabiliza el intento 1, muestra recomendaciones para la foto y permite volver a cargar el archivo. Si en el segundo intento el usuario vuelve a rechazar, la fórmula queda no apta y se orienta a atención presencial. Origen: contexto 3.4, DEC-P04, DEC-P07.
- AC-004. Dada una solicitud con dos fórmulas independientes, cuando la primera fórmula no es apta por falta de autorización y la segunda es apta, entonces el sistema muestra el resultado preliminar de la primera como no apta y el de la segunda como apta. Origen: contexto 3.4, DEC-16, T-011.
- AC-013. Dado un usuario que carga una fórmula en la web o Telegram Mini App y el número de prescripción de 20 dígitos no existe en la EPS simulada, cuando se agota el segundo intento, entonces el sistema marca la fórmula como no apta, muestra el motivo «No fue posible validar los datos del documento con la EPS simulada.» y despliega el siguiente paso «Acudir a la atención presencial en el punto de dispensación con sus documentos físicos.». Origen: DEC-P05, DEC-P08, BR-014.
- AC-014. Dado un paciente con estado de afiliación inactivo en la EPS simulada, cuando inicia la prevalidación de una solicitud con múltiples fórmulas, entonces el sistema detiene inmediatamente el proceso, declara toda la solicitud no apta y muestra el mensaje para comunicarse con la EPS. Origen: contexto 3.4, BR-008.
- AC-015. Dada una fórmula médica cuya fecha de vigencia en la EPS simulada es anterior a la fecha actual de prevalidación, cuando se ejecuta el paso 2 de prevalidación, entonces el sistema marca la fórmula como no apta y muestra el motivo de fórmula vencida y el siguiente paso de nueva valoración médica. Origen: contexto 3.4, BR-014.
- AC-016. Dado un medicamento prescrito que no está cubierto por el PBS y registra estado "No autorizado" en la EPS simulada, cuando se evalúa la fórmula, entonces la fórmula completa resulta no apta y muestra el enlace/puntos de trámite de la EPS. Origen: DEC-P02, DEC-P11, BR-011.
- AC-017. Dado un medicamento prescrito no cubierto por el PBS que registra estado "Autorizado" en la EPS simulada, cuando se evalúa la fórmula y los demás medicamentos son PBS, entonces el sistema marca la fórmula como apta. Origen: DEC-P02, DEC-P11, BR-011.
- AC-018. Dado un medicamento cubierto por el PBS sin registro de autorización en la EPS simulada, cuando se prevalida la fórmula, entonces el sistema lo marca como apto (la autorización no aplica a medicamentos PBS). Origen: DEC-P11, BR-011.
- AC-019. Dada una solicitud con dos fórmulas asociadas a los diagnósticos ficticios diagnóstico crónico A (incluido en el catálogo crónico) y diagnóstico agudo B (no incluido en el catálogo crónico), cuando se completa la prevalidación, entonces el sistema clasifica la primera fórmula como crónica y la segunda como aguda. Origen: contexto 3.4, RF-023.
- AC-020. Dada una solicitud en la que todas las fórmulas resultan no aptas en la prevalidación, cuando finaliza el procesamiento, entonces el sistema muestra el resultado preliminar de cada fórmula como no apta con su motivo de rechazo y finaliza el flujo digital. Origen: contexto 3.4, DEC-P01, RF-028.
- AC-021. Dada cualquier fórmula que complete el proceso de prevalidación (apta o no apta), cuando el sistema despliega la pantalla de resultados, entonces incluye explícitamente la leyenda: "Este resultado es preliminar. La validación oficial se realiza en el punto de dispensación por el personal farmacéutico." Origen: necesidad, contexto 3.4, RF-027.
- AC-022. Dada una fórmula que no se puede leer, cuando falla el primer intento, entonces el sistema muestra el mensaje común «No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial» y recomendaciones para volver a cargarlo; y cuando falla el segundo intento, entonces la fórmula queda no apta, muestra el motivo «No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial.» y despliega el siguiente paso «Acudir a la atención presencial en el punto de dispensación con sus documentos físicos.». Origen: DEC-P23, DEC-P28, RF-031, BR-014.
- AC-023. Dada una prevalidación realizada un día sábado previo a un lunes festivo (donde la fecha de cita posible calculada es el martes), cuando se evalúa una fórmula crónica con fecha habilitada del martes, entonces la fórmula resulta apta; y cuando la fecha habilitada es del miércoles, entonces la fórmula resulta no apta. Origen: DEC-P13, BR-015.
- AC-024. Dada una fórmula cuyo número de prescripción existe en la EPS simulada pero está registrado a nombre de otro paciente, cuando el sistema evalúa la coincidencia en la prevalidación tras agotar los intentos de carga, entonces el sistema marca la fórmula como no apta, muestra el motivo «No fue posible validar los datos del documento con la EPS simulada.» y despliega el siguiente paso «Acudir a la atención presencial en el punto de dispensación con sus documentos físicos.». Origen: DEC-P08, BR-013, BR-014.
- AC-025. Dada una fórmula cargada cuyos medicamentos leídos por OCR difieren de los registrados para ese número de prescripción en la EPS simulada, cuando el sistema verifica la coincidencia tras agotar los intentos de carga, entonces marca la fórmula como no apta, muestra el motivo «No fue posible validar los datos del documento con la EPS simulada.» y despliega el siguiente paso «Acudir a la atención presencial en el punto de dispensación con sus documentos físicos.». Origen: DEC-P08, BR-013, BR-014.
- AC-026. Dado un usuario que carga una historia clínica que no contiene ningún diagnóstico, cuando el sistema procesa el documento en el primer intento, entonces califica la historia clínica como incompleta, contabiliza el primer intento fallido y muestra una pantalla con consejos para tomar una foto legible. Origen: DEC-P09, BR-012.
- AC-027. Dada una solicitud con dos fórmulas y una historia clínica que contiene un único diagnóstico clasificado como crónico en el catálogo, cuando el sistema procesa la prevalidación, entonces clasifica ambas fórmulas como crónicas. Origen: DEC-P09, BR-012, RF-023.
- AC-028. Dada una solicitud con dos fórmulas y una historia clínica con múltiples diagnósticos, cuando el sistema ejecuta la prevalidación, entonces asigna a cada fórmula el diagnóstico que la EPS simulada tiene asociado a su respectivo número de prescripción. Origen: DEC-P09, BR-012, RF-023.
- AC-029. Dada una fórmula crónica cuya fecha habilitada de entrega en la EPS simulada coincide exactamente con la fecha de la cita posible (siguiente día hábil), cuando se ejecuta la prevalidación y las demás verificaciones cumplen, entonces el sistema marca la fórmula como apta. Origen: DEC-P13, RF-024.
- AC-030. Dada una solicitud con historia clínica cargada que falla en sus dos intentos de procesamiento OCR o confirmación por el usuario (incluyendo la confirmación de los diagnósticos leídos), cuando finaliza el flujo de carga, entonces todas las fórmulas de la solicitud son marcadas como no aptas y despliega el siguiente paso «Acudir a la atención presencial en el punto de dispensación con sus documentos físicos.». Origen: DEC-P15, DEC-P24, RF-029, BR-009, BR-014.
- AC-031. Dada una fórmula clasificada como crónica que no tiene fecha habilitada de entrega registrada en la EPS simulada, cuando se ejecuta el paso 5 de prevalidación, entonces el sistema marca la fórmula como no apta, muestra el motivo «Fórmula crónica sin fecha habilitada de entrega registrada en la EPS simulada.» y despliega el siguiente paso «Acudir a la atención presencial en el punto de dispensación.». Origen: DEC-P16, RF-024, BR-014.
- AC-032. Dada una fórmula crónica en proceso de prevalidación cuando el catálogo de festivos colombianos no cuenta con el año necesario para calcular la cita posible, cuando se evalúa el paso 5, entonces el sistema no emite resultado preliminar para esa fórmula, despliega un mensaje de error de sistema y registra el evento. Origen: DEC-P19, RF-024.
- AC-033. Dada una fórmula médica vencida en la EPS simulada que adicionalmente contiene un medicamento no PBS sin autorización, cuando el sistema ejecuta la prevalidación en orden estricto, entonces se detiene en el paso 2, marca la fórmula como no apta y despliega únicamente el motivo de fórmula vencida y su siguiente paso. Origen: RF-024, BR-008.
- AC-034. Dada una fórmula crónica prevalidada un domingo, cuando se calcula la fecha de la cita posible para el lunes ordinario y la fecha habilitada es anterior o igual a dicho lunes, entonces el sistema marca la fórmula como apta. Origen: DEC-P13, RF-024.
- AC-035. Dada una fórmula crónica prevalidada un día jueves ordinario, cuando la fecha habilitada es el viernes siguiente (día hábil ordinario), entonces el sistema calcula la cita posible para el viernes y marca la fórmula como apta. Origen: DEC-P13, BR-015.
- AC-036. Dada una fórmula crónica prevalidada un día sábado (día hábil), cuando la fecha habilitada es el lunes siguiente (saltando el domingo), entonces el sistema calcula la cita posible para el lunes y marca la fórmula como apta. Origen: DEC-P13, BR-015, CL-009.
- AC-037. Dada una fórmula crónica prevalidada el lunes 2026-12-07 con el martes 2026-12-08 registrado como festivo en el catálogo, cuando la fecha habilitada es el miércoles 2026-12-09, entonces el sistema toma ese miércoles como cita posible y marca la fórmula como apta; y cuando la fecha habilitada es el jueves 2026-12-10, entonces marca la fórmula como no apta por fecha habilitada posterior. Origen: DEC-P13, BR-015, CL-010.
- AC-038. Dada una fórmula crónica prevalidada el jueves 2026-12-31 con los años 2026 y 2027 cargados en el catálogo y el viernes 2027-01-01 registrado como festivo, cuando la fecha habilitada es el sábado 2027-01-02, entonces el sistema toma ese sábado como cita posible y marca la fórmula como apta; y cuando la fecha habilitada es el domingo 2027-01-03, entonces marca la fórmula como no apta por fecha habilitada posterior. Origen: DEC-P13, DEC-P19.
- AC-039. Dado un documento (fórmula o historia clínica) que falla en el intento inicial de lectura OCR o confirmación, cuando el usuario sigue las recomendaciones y vuelve a cargarlo, entonces el sistema procesa el reintento exitosamente y permite avanzar en la prevalidación. Origen: RF-029, BR-009.
- AC-040. Dado un documento que agotó sus 2 intentos de carga y confirmación, cuando el usuario intenta cargarlo de nuevo en esa solicitud, entonces el sistema no permite un tercer intento; la fórmula queda no apta o, si el documento es la historia clínica, todas las fórmulas de la solicitud quedan no aptas. Origen: RF-029, BR-009.
- AC-041. Dada una fórmula crónica con fecha habilitada de entrega posterior a la cita posible, cuando el sistema emite el resultado preliminar de no apta, entonces muestra textualmente el motivo de fecha habilitada posterior y el siguiente paso para gestionarlo directamente con su EPS. Origen: DEC-P14, BR-014.
- AC-042. Dada una fórmula crónica con festivos consecutivos (por ejemplo, lunes y martes festivos), cuando se calcula la fecha de la cita posible desde el sábado anterior, entonces el sistema salta los dos días festivos y establece el miércoles como fecha de la cita posible. Origen: DEC-P13, BR-015.
- AC-043. Dada una fórmula crónica prevalidada el martes 2026-12-08, registrado como festivo en el catálogo, cuando la fecha habilitada es el miércoles 2026-12-09, entonces el sistema toma ese miércoles como cita posible y marca la fórmula como apta. Origen: DEC-P13, BR-015.
- AC-044. Dada una fórmula crónica prevalidada el viernes 2027-04-30 con el sábado 2027-05-01 registrado como festivo, cuando la fecha habilitada es el lunes 2027-05-03, entonces el sistema toma ese lunes como cita posible y marca la fórmula como apta; y cuando la fecha habilitada es el martes 2027-05-04, entonces marca la fórmula como no apta por fecha habilitada posterior. Origen: DEC-P13, BR-015.
- AC-045. Dada una fórmula leída por OCR junto con su historia clínica, cuando el sistema presenta la vista previa, entonces muestra el número de prescripción y los medicamentos de la fórmula y los diagnósticos de la historia clínica, ofrece únicamente confirmar o rechazar y ningún campo se puede editar. Origen: DEC-P04, DEC-P24, RF-030.
- AC-046. Dada una fórmula crónica con un medicamento no PBS sin autorización que además no tiene fecha habilitada registrada en la EPS simulada, cuando el sistema ejecuta la prevalidación en orden, entonces se detiene en el paso 4 y muestra únicamente el motivo y el siguiente paso de medicamento no PBS sin autorización. Origen: RF-024, BR-008.

### 12. Dependencias
- Verificación de identidad del paciente y confirmación de autorización de datos de salud (SPEC-001, SPEC-002).
- Servidor / Servicio simulado de la EPS (afiliación, vigencia de prescripción por número de 20 dígitos, estado PBS, autorizaciones y fechas habilitadas de entrega).
- Catálogo configurable de diagnósticos crónicos.
- Catálogo anual configurable de festivos nacionales de Colombia.
- Catálogo simulado de cobertura PBS.

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
- [Límites de tamaño de archivo y número de páginas en archivos PDF]: tema para arquitectura. Origen: T-009.
- [Política y tiempo de retención y almacenamiento de archivos de documentos de salud de fórmulas e historias clínicas]: tema para arquitectura. Origen: T-010.
- [Motor y ubicación del procesamiento OCR de imágenes y PDF]: tema para arquitectura. Origen: RF-022.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-42 / DEC-P07)
- OPEN-Q-002: Respondida (DEC-16)
- OPEN-Q-003: Respondida (DEC-12 / DEC-P10)
- OPEN-Q-004: Respondida (DEC-P14)
- OPEN-Q-005: Respondida (DEC-P15)
- OPEN-Q-006: Pendiente
- OPEN-Q-007: Pendiente
- OPEN-Q-008: Pendiente
- OPEN-Q-009: Pendiente
- OPEN-Q-010: Pendiente
- OPEN-Q-011: Pendiente
- OPEN-Q-012: Pendiente
- OPEN-Q-013: Respondida (DEC-P28)
- OPEN-Q-014: Pendiente
- OPEN-Q-015: Pendiente
- OPEN-Q-016: Pendiente
- OPEN-Q-017: Pendiente
- OPEN-Q-018: Pendiente
- OPEN-Q-019: Pendiente
- OPEN-Q-020: Pendiente

### 16. Trazabilidad
- HU-005: RF-021, RF-022, RF-023, RF-024, RF-025, RF-026, RF-027, RF-028, RF-029, RF-030, RF-031, RNF-010; BR-008, BR-009, BR-010, BR-011, BR-012, BR-013, BR-014, BR-015; AC-001, AC-002, AC-003, AC-004, AC-013, AC-014, AC-015, AC-016, AC-017, AC-018, AC-019, AC-020, AC-021, AC-022, AC-023, AC-024, AC-025, AC-026, AC-027, AC-028, AC-029, AC-030, AC-031, AC-032, AC-033, AC-034, AC-035, AC-036, AC-037, AC-038, AC-039, AC-040, AC-041, AC-042, AC-043, AC-044, AC-045, AC-046; CL-001, CL-008, CL-009, CL-010, CL-011, CL-012.
- RF-021: Origen: necesidad, contexto 3.1, 3.4, DEC-P03, DEC-P10; verificado por AC-001, RNF-010.
- RF-022: Origen: necesidad, contexto 3.4, DEC-P05, DEC-P12; verificado por AC-001, AC-013, AC-024, AC-025.
- RF-023: Origen: necesidad, contexto 3.4, DEC-P09; verificado por AC-019, AC-027, AC-028.
- RF-024: Origen: necesidad, contexto 3.4, DEC-P02, DEC-P11, DEC-P13, DEC-P16, DEC-P17, DEC-P19; verificado por AC-001, AC-002, AC-014, AC-015, AC-016, AC-017, AC-018, AC-023, AC-029, AC-031, AC-032, AC-033, AC-034, AC-035, AC-036, AC-037, AC-038, AC-042, AC-043, AC-044, AC-046.
- RF-025: Origen: necesidad, contexto 3.4, DEC-P11; verificado por AC-004, AC-016.
- RF-026: Origen: necesidad, contexto 3.4, DEC-16; verificado por AC-004, AC-013.
- RF-027: Origen: necesidad, contexto 3.4, T-003; verificado por AC-004, AC-015, AC-016, AC-021, AC-041.
- RF-028: Origen: necesidad, contexto 3.4; verificado por AC-020.
- RF-029: Origen: contexto 3.4, DEC-42, DEC-P07, DEC-P08, DEC-P15, DEC-P24, DEC-P28; verificado por AC-003, AC-013, AC-024, AC-025, AC-030, AC-039, AC-040.
- RF-030: Origen: DEC-P04, DEC-P07, DEC-P24; verificado por AC-001, AC-003, AC-030, AC-045.
- RF-031: Origen: DEC-P23, DEC-P28; verificado por AC-022.
- RNF-010: Origen: necesidad, contexto 3.1, DEC-P10; verificado con pruebas funcionales en navegadores Chrome/Safari y apertura de la Mini App en Telegram iOS/Android.
- BR-008: Origen: necesidad, contexto 3.4; verificado por AC-014, AC-033, AC-046.
- BR-009: Origen: contexto 3.4, DEC-42, DEC-P07, DEC-P15, DEC-P23, DEC-P28; verificado por AC-003, AC-026, AC-030, AC-039, AC-040.
- BR-010: Origen: contexto 3.4, DEC-16; verificado por AC-004, AC-013.
- BR-011: Origen: contexto 3.4, DEC-P02, DEC-P11; verificado por AC-016, AC-017, AC-018.
- BR-012: Origen: DEC-P03, DEC-P09, DEC-P24; verificado por AC-019, AC-026, AC-027, AC-028, AC-030, CL-012.
- BR-013: Origen: DEC-P05, DEC-P08, DEC-P12; verificado por AC-013, AC-024, AC-025, CL-008.
- BR-014: Origen: contexto 3.4, DEC-P01, DEC-P02, DEC-P07, DEC-P11, DEC-P14, DEC-P16, DEC-P23, DEC-P28, T-003; verificado por AC-002, AC-004, AC-013, AC-014, AC-015, AC-016, AC-021, AC-022, AC-024, AC-025, AC-030, AC-031, AC-041.
- BR-015: Origen: DEC-P13; verificado por AC-002, AC-023, AC-029, AC-034, AC-035, AC-036, AC-037, AC-038, AC-042, AC-043, AC-044, CL-009, CL-010, CL-011.
- CL-001: Origen: DEC-P04, DEC-P07; verificado por AC-003, AC-040.
- CL-008: Origen: DEC-16, DEC-P08; verificado por AC-004, AC-013.
- CL-009: Origen: DEC-P13; verificado por AC-036.
- CL-010: Origen: DEC-P13; verificado por AC-037.
- CL-011: Origen: DEC-P13; verificado por AC-002, AC-023.
- CL-012: Origen: DEC-P09; verificado por AC-026.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad y las preguntas iniciales.
- Versión 1.0: incorporación de las respuestas del equipo (DEC-12, DEC-16, DEC-42), actualización de requisitos, flujos, casos límite y criterios de aceptación, pasando a estado Candidata.
- Versión 1.1: actualización a estado Candidata incorporando decisiones globales DEC-P02 (modificada por DEC-P11), DEC-P03, DEC-P04, DEC-P05, DEC-P07, DEC-P08, DEC-P09, DEC-P10, DEC-P11, DEC-P12 y DEC-P13; resolución de hallazgos T-001 a T-005, T-007 a T-011; reglas de coincidencia EPS con número MIPRES (20 dígitos), confirmación OCR sin edición, fecha hábil para crónicas saltando domingos/festivos, tabla motivo-siguiente paso, fuera de alcance para fórmulas manuscritas, temas de arquitectura para retención y límites de documentos, y cobertura completa de ACs.
- Versión 1.2: actualización a estado Candidata aplicando observaciones del equipo. Corrección de la regla de día hábil en DEC-P13 (el sábado es hábil; prevalidación en viernes da cita el sábado; prevalidación en sábado previo a lunes festivo da cita el martes) en AC-002, AC-023 y CL-011. Eliminación de agendamiento en BR-014 y AC-020 por DEC-P01. Actualización del paso 9 del flujo principal para consultar autorización en todos los medicamentos pero decidir solo sobre no PBS. Remoción del término "vigente" de autorización en BR-011, AC-017 y DEC-P02. Registro de OPEN-Q-004 (siguiente paso para fecha habilitada posterior) y OPEN-Q-005 (falla de historia clínica en 2 intentos). Adición de AC-024 a AC-029 para verificar casos de número ajeno, medicamentos no coincidentes, historia sin diagnóstico, diagnóstico único o múltiple y fecha habilitada igual a cita posible. Reescritura de AC-001 con resultado observable. Corrección de datos de salud ficticios en AC-019 (diagnóstico crónico A y agudo B). Corrección de errata en AC-003 (contexto) y actualización del Análisis de impacto y Contradicciones detectadas.
- Versión 1.3: actualización a estado Candidata aplicando las decisiones DEC-P14, DEC-P15, DEC-P16, DEC-P17 y DEC-P19. Se completó el siguiente paso de BR-014 para fecha habilitada posterior (gestionar con EPS, DEC-P14, respondiendo OPEN-Q-004). Se ajustaron RF-029, BR-009, E1 y se añadió AC-030 para falla de historia clínica en dos intentos declarando no aptas todas las fórmulas (DEC-P15, respondiendo OPEN-Q-005). Se incluyó el manejo de fórmulas crónicas sin fecha habilitada en RF-024 paso 5, BR-014 y AC-031 (DEC-P16). Se incorporó la prevalencia del catálogo simulado sobre la fórmula en cobertura PBS en RF-024 paso 3 (DEC-P17). Se incorporó en RF-024 paso 5 y AC-032 el manejo de catálogo de festivos sin el año requerido (error de sistema, sin emisión de resultado y registro, DEC-P19). Se reescribió AC-023 para evaluar la fecha habilitada del martes (apta) y miércoles (no apta) en prevalidación de sábado previo a lunes festivo. Se añadió AC-033 para verificar la detención temprana en el paso 2 al prevalecer fórmula vencida sobre medicamentos no PBS sin autorización.
- Versión 1.4: actualización a estado Candidata aplicando el informe de revisión (H-002 a H-005, H-013 a H-017) y decisiones del equipo DEC-P22, DEC-P23 y DEC-P24. Se corrigió RF-031, BR-009, BR-014, E3 y AC-022 para tratar la fórmula manuscrita como documento ilegible con sus 2 intentos y mensaje propio sin reintento exitoso (DEC-P23). Se actualizó RF-030 y AC-030 para incluir la confirmación de la historia clínica y los diagnósticos leídos (DEC-P24). Se actualizó la sección 2 incorporando DEC-P22 y DEC-P26 sobre vinculación vigente y exigencia de código. Se añadieron AC-034 a AC-041 para cubrir fechas habilitadas anteriores, días ordinarios, domingos, festivos entre semana y consecutivos, cruce de año, reintento correcto, bloqueo del tercer intento y verificación explícita del siguiente paso ante fecha habilitada posterior. Se corrigió la trazabilidad de CL-009 y CL-010 a AC-036 y AC-037. Se registraron como preguntas abiertas pendientes OPEN-Q-006 a OPEN-Q-012 correspondientes a H-006 a H-012.
- Versión 1.5: actualización a estado Candidata incorporando los requerimientos de corrección solicitados: se añadió AC-034 para prevalidación en domingo con lunes ordinario como cita posible, se añadió AC-042 para festivos consecutivos, y se corrigió la trazabilidad de CL-009 y CL-010 a AC-036 y AC-037 respectivamente. Se registró la OPEN-Q-013 para indagar la distinción de fórmulas manuscritas. Se eliminó de BR-008 cualquier regla sobre precedencia de afiliación frente a fallos de documento (manteniéndose en OPEN-Q-006) y se ajustó el inicio de AC-003 a "Dado un documento...".
- Versión 1.6: actualización a estado Candidata aplicando las correcciones solicitadas en BR-008 (evaluación secuencial y detención por afiliación), AC-022 (redacción específica para fórmula manuscrita que falla intentos) y AC-003 (inicio con "Dado un documento...").
- Versión 1.7: actualización a estado Candidata aplicando DEC-P28. Se modificó RF-031, BR-014 (tabla), Excepción E3 y AC-022 para unificar el tratamiento de la fórmula manuscrita con un documento ilegible que muestra el mensaje común «No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial» y mantiene los 2 intentos de carga. Se marcó OPEN-Q-013 como respondida por DEC-P28.
- Versión 1.8: actualización a estado Candidata aplicando la corrección solicitada: en la sección 2 y en el análisis de impacto, se actualizó la redacción sobre la exigencia de cédula y código para indicar que la Mini App exige cédula y código para una vinculación nueva y que una vinculación vencida se reactiva solo con código nuevo (DEC-P22, DEC-P26).
- Versión 1.9: actualización a estado Candidata aplicando observaciones de revisión (H-015, H-016, H-044, H-047, H-051, H-052, H-053, H-054, H-056, H-057, H-064). Reescritura de AC-037 y AC-038 con fechas sintéticas concretas de oráculo de pasa/no pasa. Adición de AC-043 y AC-044 para prevalidación en festivo y viernes con sábado festivo. Adición de AC-045 para vista previa OCR no editable de fórmulas e historia clínica. Inclusión de motivo y siguiente paso exactos de BR-014 en AC-013, AC-024, AC-025, AC-030 y AC-031. Ajuste de AC-003, AC-022 y AC-040 para desambiguar fórmula e historia clínica. Adición de AC-046 para verificar detención en paso 4. Inclusión de OPEN-Q-014 a OPEN-Q-020 como preguntas pendientes. Corrección de errata en RF-021 («fórmulas médicas»). Ajuste de trazabilidad en la sección 16 y actualización global de la sección Verificación reflejando estado parcial en los rubros con preguntas pendientes.
- Versión 1.9, ajuste de edición sin cambio de reglas: se restauró OPEN-Q-013 y CL-012 en BR-012, retirados sin pedido; se corrigió una errata en OPEN-Q-012 y el formato de AC-045.

## Verificación
- Completitud: parcial. Quedan abiertas las preguntas de aclaración OPEN-Q-006 a OPEN-Q-012 y OPEN-Q-014 a OPEN-Q-020 (incluyendo el comportamiento de medicamentos ausentes del catálogo, entradas inválidas, instante/zona horaria de prevalidación, origen del indicador PBS, números malformados y la lectura parcial de PREG-040).
- Consistencia interna: parcial. Se verificó la alineación entre RF, BR, flujos y AC, pero persiste la ambigüedad en la distinción de motivos entre ilegible e incompleto ante lecturas parciales (PREG-040) y motivos combinados (PREG-041).
- Consistencia con el contexto: cumple. Se compararon las reglas con la sección 3 del contexto y las decisiones de `docs/decisiones.md` (DEC-P01 a DEC-P28). La modificación sobre la cita posible en sábado (DEC-P13) está registrada en Contradicciones detectadas.
- No ambigüedad: parcial. La mayoría de motivos y siguientes pasos están definidos, pero se mantienen abiertas preguntas sobre la delimitación de ilegible e incompleto con lectura parcial (PREG-040) y el motivo ante causas distintas en reintentos (PREG-041).
- Verificabilidad: parcial. Los criterios de aceptación AC-001 a AC-046 están en formato Dado/Cuando/Entonces con resultados observables, aunque algunos escenarios límite dependen de las OPEN-Q pendientes para completar su oráculo.
- Cobertura de actores: cumple. La HU-005 cubre las necesidades de todos los actores del sistema (paciente, persona que actúa por el paciente, facilitador comunitario).
- Cobertura de AC: cumple. Todos los RF y BR tienen asignado al menos un criterio de aceptación en la sección 16.
- Trazabilidad: parcial. La sección 16 mapea todos los RF, RNF, BR, CL y AC, pero algunas trazas de casos límite fueron ajustadas y quedan pendientes de relacionar con las OPEN-Q de negocio abiertas.
- No invención: cumple. Todos los requisitos y reglas provienen del contexto o de las decisiones del equipo (DEC-P01 a DEC-P28).
- Delimitación: cumple. Los aspectos técnicos de almacenamiento, límites de archivo y motor OCR están aislados en la sección 14.

## Siguiente paso
La SPEC-003 versión 1.9 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
