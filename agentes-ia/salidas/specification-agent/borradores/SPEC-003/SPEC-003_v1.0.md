<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:54
Petición: FASE=RESPUESTAS

Necesidad original: Carga de documentos y prevalidación. Con la autorización de datos de salud, el usuario carga las fórmulas y la historia clínica en foto o PDF por la web o por Telegram. Una solicitud admite varias fórmulas del mismo paciente y de los documentos se obtienen los medicamentos de cada fórmula y el diagnóstico. La prevalidación verifica en orden: afiliación activa una vez por solicitud; vigencia de cada fórmula con el dato de la EPS simulada; cobertura PBS de cada medicamento; autorización de cada medicamento en la EPS simulada; y, solo para fórmulas crónicas, que la fecha habilitada de la próxima entrega sea igual o anterior a la fecha de la cita posible. Cada fórmula es todo o nada; si un medicamento falla, la fórmula completa queda no apta, y las fórmulas separadas son independientes. El tratamiento se clasifica como agudo o crónico según un catálogo configurable de diagnósticos crónicos. Se muestra el resultado preliminar por fórmula con motivo y siguiente paso, y se indica que la validación oficial ocurre en el punto. Si no hay ninguna fórmula apta, termina el flujo digital. EPIC-003.

Preguntas y respuestas del equipo:
- OPEN-Q-001. Cuando un documento es ilegible, incompleto, no trae diagnóstico o no coincide con la EPS simulada, el contexto 3.4 indica que se pide cargarlo de nuevo y, si el problema persiste, la fórmula queda no apta y se orienta a la atención presencial. ¿Cuál es el número exacto de intentos permitidos para volver a cargar el documento antes de declarar la fórmula no apta?
  Respuesta: Se permite un reintento de carga por documento, es decir, dos intentos en total. Si el segundo intento también es ilegible, está incompleto, no trae diagnóstico o no coincide con la EPS simulada, la fórmula queda no apta y se orienta a la atención presencial (contexto 3.4, DEC-42).
- OPEN-Q-002. Si una solicitud incluye varias fórmulas y una de ellas queda no apta por un documento ilegible después de agotar los intentos, ¿las demás fórmulas aptas pueden continuar con el agendamiento o se detiene la solicitud completa?
  Respuesta: Las fórmulas separadas son independientes. Solo se detiene la fórmula afectada; las demás fórmulas aptas continúan con la disponibilidad y el agendamiento, y para la no apta se indica que puede gestionarse con la EPS o acudir a la atención presencial (DEC-16).
- OPEN-Q-003. ¿Qué canales específicos (web, Telegram o ambos) deben mostrar la interfaz para cargar fotos o archivos PDF de fórmulas y la historia clínica?
  Respuesta: Ambos canales, aplicación web y bot de Telegram, deben permitir la carga de fórmulas e historia clínica en foto o PDF (DEC-12, contexto 3.1).
-->

# SPEC-003. Carga de documentos y prevalidación - Versión 1.0

Estado: Candidata
Modo: Iteración
Necesidad original: "Carga de documentos y prevalidación. Con la autorización de datos de salud, el usuario carga las fórmulas y la historia clínica en foto o PDF por la web o por Telegram. Una solicitud admite varias fórmulas del mismo paciente y de los documentos se obtienen los medicamentos de cada fórmula y el diagnóstico. La prevalidación verifica en orden: afiliación activa una vez por solicitud; vigencia de cada fórmula con el dato de la EPS simulada; cobertura PBS de cada medicamento; autorización de cada medicamento en la EPS simulada; y, solo para fórmulas crónicas, que la fecha habilitada de la próxima entrega sea igual o anterior a la fecha de la cita posible. Cada fórmula es todo o nada; si un medicamento falla, la fórmula completa queda no apta, y las fórmulas separadas son independientes. El tratamiento se clasifica como agudo o crónico según un catálogo configurable de diagnósticos crónicos. Se muestra el resultado preliminar por fórmula con motivo y siguiente paso, y se indica que la validación oficial ocurre en el punto. Si no hay ninguna fórmula apta, termina el flujo digital."
Épica: EPIC-003

## Análisis
- Objetivo: permitir al usuario cargar documentos de salud (fórmulas e historia clínica) por la web o Telegram y ejecutar la prevalidación en el orden definido para determinar si las fórmulas son aptas para continuar.
- Alcance inicial: carga de fotos y PDF de fórmulas y la historia clínica, procesamiento para extraer medicamentos y diagnóstico, clasificación de tratamiento (agudo o crónico), ejecución secuencial de la prevalidación por fórmula y presentación de resultados preliminares.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- Contexto aplicable: 3.1, 3.2, 3.3, 3.4, 3.8.

## Modelo de dominio
- Solicitud: conjunto de fórmulas y medicamentos de un mismo paciente gestionados en una misma gestión; admite varias fórmulas. Origen: contexto 2.4 y 3.4.
- Fórmula: prescripción con uno o más medicamentos y un diagnóstico; unidad de validación (todo o nada). Origen: contexto 2.4 y 3.4.
- Medicamento: elemento integrante de una fórmula, evaluado para cobertura PBS y autorización. Origen: contexto 3.4.
- Historia clínica: documento cargado que aporta el diagnóstico para clasificar el tratamiento. Origen: contexto 3.4.
- Catálogo de diagnósticos crónicos: fuente configurable que define qué diagnósticos corresponden a un tratamiento crónico. Origen: contexto 3.4.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- DEC-42 (reemplaza inferencia de intentos): afecta RF-003, RF-004, CL-001, AC-003. Todos actualizados.
- DEC-16 (independencia de fórmulas con error en documentos): afecta RF-004, CL-002, AC-004. Todos actualizados.
- DEC-12 (canales web y Telegram): afecta RF-001, AC-001. Todos actualizados.

## Preguntas de aclaración
- No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Permitir la carga de fórmulas e historia clínica en foto o PDF por la web o Telegram, y ejecutar la prevalidación en el orden establecido para determinar cuáles fórmulas son aptas para el agendamiento y cuáles requieren gestión directa con la EPS.

### 2. Contexto
El sistema procesa los documentos cargados por el usuario para extraer medicamentos y diagnóstico. La prevalidación verifica de forma secuencial la afiliación activa, la vigencia de la fórmula, la cobertura PBS, la autorización de cada medicamento y, en tratamientos crónicos, la habilitación de entrega. Si un documento presenta problemas o un medicamento no cumple, la fórmula se declara no apta aplicando el principio de todo o nada, mientras que las fórmulas independientes continúan su curso.
Decisiones del equipo:
- DEC-42. Se permite un reintento de carga por documento (dos intentos en total). Si persiste el problema, la fórmula queda no apta y se orienta a la atención presencial. Responde a OPEN-Q-001.
- DEC-16. Las fórmulas separadas son independientes. Solo se detiene la fórmula afectada por el documento no apto; las demás fórmulas continúan. Responde a OPEN-Q-002.
- DEC-12. Ambos canales (web y Telegram) permiten la carga de documentos. Responde a OPEN-Q-003.

### 3. Alcance
- Carga de fotos o archivos PDF de fórmulas y la historia clínica mediante la aplicación web o el bot de Telegram.
- Extracción de datos de medicamentos y diagnóstico a partir de los documentos cargados.
- Verificación del orden de prevalidación: afiliación activa por solicitud, vigencia de fórmula, cobertura PBS, autorización y fecha habilitada de entrega para crónicos.
- Clasificación de tratamiento agudo o crónico según catálogo configurable de diagnósticos.
- Presentación de resultados preliminares por fórmula con motivo, siguiente paso y el aviso de que la validación oficial ocurre en el punto.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-005. Como usuario, quiero cargar las fórmulas y la historia clínica en foto o PDF por la web o Telegram, para iniciar la prevalidación de mis medicamentos.

### 5. Requisitos funcionales
- RF-021. El sistema debe permitir al usuario cargar fórmulas y la historia clínica en formato de foto o PDF a través de la aplicación web y del bot de Telegram, previa aceptación de la autorización de datos de salud. Origen: necesidad y DEC-12 (contexto 3.1, 3.4).
- RF-022. El sistema debe extraer de los documentos cargados los medicamentos de cada fórmula y el diagnóstico asociado. Origen: necesidad y contexto 3.4.
- RF-023. El sistema debe clasificar el tratamiento como agudo o crónico utilizando un catálogo configurable de diagnósticos crónicos, tratando cualquier otro diagnóstico como agudo. Origen: necesidad y contexto 3.4.
- RF-024. El sistema debe ejecutar la prevalidación de la solicitud verificando en estricto orden: 1) Afiliación activa una vez por solicitud; 2) Vigencia de cada fórmula con el dato de la EPS simulada; 3) Cobertura PBS de cada medicamento; 4) Autorización de cada medicamento en la EPS simulada; 5) Fecha habilitada de entrega igual o anterior a la fecha de la cita posible, exclusivamente para fórmulas crónicas. Origen: necesidad y contexto 3.4.
- RF-025. El sistema debe aplicar el principio de todo o nada por fórmula: si un documento es ilegible, incompleto, no trae diagnóstico o no coincide con la EPS simulada tras agotar los intentos permitidos, o si cualquier medicamento de la fórmula falla en un criterio de prevalidación, la fórmula completa queda no apta. Origen: necesidad, contexto 3.4 y DEC-42.
- RF-026. El sistema debe tratar las fórmulas separadas de una solicitud como independientes, de modo que si una fórmula queda no apta, las demás fórmulas aptas continúan con el flujo digital. Origen: necesidad, contexto 3.4 y DEC-16.
- RF-027. El sistema debe mostrar el resultado preliminar por fórmula indicando si es apta o no apta, el motivo correspondiente, el siguiente paso y el aviso de que la validación oficial ocurre en el punto. Origen: necesidad y contexto 3.4.
- RF-028. El sistema debe terminar el flujo digital de prevalidación si ninguna de las fórmulas de la solicitud resulta apta. Origen: necesidad y contexto 3.4.
- RF-029. Si un documento es ilegible, incompleto, no trae diagnóstico o no coincide con la EPS simulada, el sistema debe permitir un reintento de carga por documento (dos intentos en total). Origen: contexto 3.4 y DEC-42.

### 6. Requisitos no funcionales
- RNF-010. Usabilidad / Multicanal. La interfaz de carga de documentos y visualización de resultados debe estar disponible y operativa tanto en la aplicación web como en el bot de Telegram. Se verifica con: pruebas funcionales en ambos canales. Origen: necesidad y contexto 3.1.

### 7. Reglas de negocio
- BR-008. Orden estricto de prevalidación. La prevalidación detiene la solicitud de inmediato si la afiliación está inactiva; para los demás criterios, evalúa cada fórmula de forma independiente aplicando el criterio de todo o nada. Origen: necesidad y contexto 3.4.
- BR-009. Límite de intentos de carga de documentos. Se permite un reintento de carga por documento; si el segundo intento falla en legibilidad, completitud, diagnóstico o coincidencia con la EPS, la fórmula se declara no apta y se orienta a la atención presencial. Origen: contexto 3.4 y DEC-42.
- BR-010. Independencia de fórmulas. Las fórmulas en una solicitud son independientes; un fallo en una fórmula no invalida ni detiene las demás fórmulas aptas de la misma solicitud. Origen: contexto 3.4 y DEC-16.

### 8. Flujo principal
1. El usuario accede a la sección de carga de documentos en la web o en Telegram tras aceptar la autorización de datos de salud.
2. El usuario carga las fotos o archivos PDF correspondientes a las fórmulas y a la historia clínica.
3. El sistema extrae los medicamentos y el diagnóstico de los documentos cargados.
4. El sistema clasifica cada tratamiento como agudo o crónico según el catálogo configurable de diagnósticos crónicos.
5. El sistema verifica la afiliación activa del paciente (una vez por solicitud).
6. El sistema verifica la vigencia de cada fórmula con el dato de la EPS simulada.
7. El sistema verifica la cobertura PBS de cada medicamento.
8. El sistema verifica la autorización de cada medicamento en la EPS simulada.
9. El sistema verifica la fecha habilitada de entrega para las fórmulas clasificadas como crónicas.
10. El sistema presenta el resultado preliminar por fórmula con su motivo, siguiente paso y la advertencia de que la validación oficial ocurre en el punto.

### 9. Flujos alternativos y de excepción
- A1. Carga con datos no extraíbles o discrepantes:
  1. El sistema detecta que un documento es ilegible, incompleto, no trae diagnóstico o no coincide con la EPS simulada.
  2. El sistema solicita al usuario volver a cargar el documento (primer reintento).
  3. Si el nuevo documento es válido, el sistema continúa con el flujo principal.
- E1. Falla persistente en la carga del documento:
  1. Si el segundo intento del documento sigue siendo ilegible, incompleto, sin diagnóstico o sin coincidencia con la EPS, el sistema marca la fórmula como no apta.
  2. El sistema indica que la fórmula debe gestionarse mediante la atención presencial o con la EPS.
  3. Si existen otras fórmulas en la solicitud, el sistema permite que continúen con el flujo digital.
- E2. Afiliación inactiva:
  1. Si la verificación de afiliación arroja estado inactivo, el sistema detiene toda la solicitud y orienta al usuario hacia la EPS.
- E3. Ninguna fórmula apta:
  1. Si todas las fórmulas de la solicitud resultan no aptas tras la prevalidación, el sistema muestra el resultado y finaliza el flujo digital.

### 10. Casos límite
- CL-008. Solicitud con múltiples fórmulas donde una fórmula falla en el segundo intento de carga de documentos: el sistema marca dicha fórmula como no apta pero permite que las demás fórmulas aptas continúen con el flujo. Origen: necesidad, contexto 3.4 y DEC-16.
- CL-001. Documento cargado dos veces con errores persistentes: el sistema rechaza el segundo intento, declara la fórmula no apta y orienta a la atención presencial. Origen: contexto 3.4 y DEC-42.

### 11. Criterios de aceptación
- AC-013. Dado un usuario con una solicitud de dos fórmulas en la web o en Telegram, cuando carga los documentos y una de las fórmulas presenta un documento ilegible que vuelve a fallar en el segundo intento, entonces esa fórmula queda no apta y la otra fórmula apta continúa el flujo digital. Origen: necesidad y DEC-16.
- AC-001. Dado un afiliado activo, cuando carga las fotos o PDF de su fórmula e historia clínica por la web o por Telegram, entonces el sistema extrae los datos y ejecuta la prevalidación en el orden establecido. Origen: necesidad y contexto 3.4.
- AC-002. Dada una fórmula crónica, cuando la fecha habilitada de entrega es posterior a la fecha de la cita posible, entonces la fórmula queda no apta. Origen: necesidad y contexto 3.4.
- AC-003. Dado un documento ilegible, cuando el usuario intenta cargarlo de nuevo y vuelve a fallar, entonces el sistema declara la fórmula no apta y orienta a la atención presencial. Origen: contexto 3.4 y DEC-42.
- AC-004. Dada una solicitud con dos fórmulas independientes, cuando la primera fórmula falla la prevalidación por falta de autorización, entonces la segunda fórmula apta continúa con el agendamiento. Origen: contexto 3.4 y DEC-16.

### 12. Dependencias
- Verificación de identidad y aceptación de autorización de datos de salud.
- EPS simulada (afiliación, vigencia de fórmulas, cobertura PBS, autorizaciones y fechas habilitadas).
- Catálogo configurable de diagnósticos crónicos.

### 13. Restricciones
- Equipo de cuatro personas y aproximadamente 8 semanas. Origen: contexto 3.9.
- El equipo no tiene acceso a los sistemas de Disfarma y trabaja desde afuera. Origen: contexto 3.9.
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites de autorización. Origen: contexto 3.11.

### 14. Fuera de alcance
- Trámite de autorizaciones o vigilancia de su estado por parte del sistema (contexto 3.10).
- Facturación, prescripción o modificación de fórmulas (contexto 3.10).
- Uso de datos reales de pacientes (contexto 3.10).
- Integración real con EPS, MIPRES o ADRES (contexto 3.10).
- Mecanismo de procesamiento OCR o motor de extracción de imágenes: tema para arquitectura. Origen: RF-022.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-42)
- OPEN-Q-002: Respondida (DEC-16)
- OPEN-Q-003: Respondida (DEC-12)

### 16. Trazabilidad
- HU-005: RF-021, RF-022, RF-023, RF-024, RF-025, RF-026, RF-027, RF-028, RF-029, RNF-010; BR-008, BR-009, BR-010; AC-001, AC-002, AC-003, AC-004, AC-013; CL-001, CL-008.
- RF-021: verificado por AC-001, RNF-010.
- RF-022: verificado por AC-001.
- RF-023: verificado por AC-001.
- RF-024: verificado por AC-001, AC-002.
- RF-025: verificado por AC-003.
- RF-026: verificado por AC-004, AC-013, CL-008.
- RF-027: verificado por AC-001.
- RF-028: verificado por E3.
- RF-029: verificado por AC-003, CL-001.
- BR-008: verificado por AC-001, AC-002.
- BR-009: verificado por AC-003, CL-001.
- BR-010: verificado por AC-004, AC-013, CL-008.
- CL-001: verificado por AC-003.
- CL-008: verificado por AC-013.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad y las preguntas iniciales.
- Versión 1.0: incorporación de las respuestas del equipo (DEC-12, DEC-16, DEC-42), actualización de requisitos, flujos, casos límite y criterios de aceptación, pasando a estado Candidata.

## Verificación
- Completitud: cumple. La SPEC cubre la carga en ambos canales, extracción, clasificación, orden de prevalidación, manejo de todo o nada, independencia de fórmulas y límite de intentos.
- Consistencia interna: cumple. Los requisitos RF-021 a RF-029 se alinean con las reglas BR-008 a BR-010, los flujos y los criterios de aceptación AC-001 a AC-013 y AC-03.
- Consistencia con el contexto: cumple. Las reglas reflejan exactamente el contexto 3.1, 3.4 y las decisiones DEC-12, DEC-16 y DEC-42.
- No ambigüedad: cumple. Se especifica claramente el límite de dos intentos y la independencia por fórmula.
- Verificabilidad: cumple. Cada requisito cuenta con criterios de aceptación observables en formato Dado/Cuando/Entonces.
- Trazabilidad: cumple. Todos los elementos están vinculados en la sección 16.
- No invención: cumple. No se inventaron plazos ni reglas ajenas al contexto ni a las respuestas del equipo.
- Delimitación: cumple. Se excluyen explícitamente el trámite de autorizaciones y los detalles de arquitectura de procesamiento de imágenes.

## Siguiente paso
La SPEC-003 versión 1.0 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
