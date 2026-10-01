<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.6-flash
Fecha: 2026-09-30 22:33
Petición: SPEC-002, empieza en HU-002, RF-013, RNF-003, BR-009, AC-013, CL-006, OPEN-Q-005 y DEC-006. Necesidad: El paciente debe poder conocer la validez preliminar de su solicitud antes de desplazarse al punto de dispensación.
-->

# SPEC-002. Prevalidación preliminar de solicitudes de medicamentos - Versión 0.1

Estado: Borrador
Modo: Inicial
Necesidad original: "El paciente debe poder conocer la validez preliminar de su solicitud antes de desplazarse al punto de dispensación."

## Análisis
- Objetivo: permitir que el usuario verifique de forma anticipada la validez de sus fórmulas médicas e historias clínicas (afiliación, vigencia, cobertura PBS, autorizaciones y habilitación de entregas crónicas) antes de acudir presencialmente al punto de dispensación.
- Alcance inicial: recepción de autorización de datos de salud, carga de documentos (foto o PDF), evaluación de la solicitud según los datos de la EPS simulada, presentación del resultado preliminar fórmula por fórmula e indicación de pasos a seguir según los hallazgos.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario, EPS simulada.
- Contexto aplicable: 2.3, 2.4, 3.1, 3.2, 3.4, 3.8, 3.10, 3.11.

## Modelo de dominio
- Solicitud: pertenece a un paciente; contiene una o varias fórmulas médicas. Origen: contexto 2.4.
- Fórmula: pertenece a una solicitud; contiene uno o varios medicamentos; tiene un tipo de tratamiento (agudo o crónico) definido por el diagnóstico de la historia clínica. Origen: contexto 2.4 y 3.4.
- Medicamento: pertenece a una fórmula; evaluado por cobertura PBS, autorización y fecha habilitada de entrega. Origen: contexto 3.4.
- Documento: pertenece a una fórmula o historia clínica; cargado en formato de imagen o PDF. Origen: contexto 3.4.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
No aplica.

## Preguntas de aclaración
- OPEN-Q-005. ¿Cuántos intentos de recarga de documentos ilegibles o incompletos se permiten antes de declarar la fórmula como no apta y enviar al usuario a atención presencial?
  Por qué importa: define el flujo de excepción E1, el número máximo de reintentos y el criterio de aceptación asociado.
  Crítica: sí
  Propuesta del agente: permitir hasta 2 reintentos de recarga del documento antes de marcar la fórmula como no apta de forma definitiva para esa solicitud.
  Estado: Pendiente
  Responsable: equipo

- OPEN-Q-006. En la prevalidación de fórmulas crónicas, ¿cuál es la fecha de cita de referencia utilizada para evaluar si la fecha habilitada de entrega es igual o anterior (paso 5 de prevalidación)?
  Por qué importa: determina el parámetro exacto contra el cual se compara la fecha habilitada antes de ir a la pantalla de disponibilidad de agenda.
  Crítica: sí
  Propuesta del agente: usar como referencia la primera fecha posible de agendamiento según las reglas del contexto (día calendario siguiente para crónicos).
  Estado: Pendiente
  Responsable: equipo

- OPEN-Q-007. ¿La prevalidación preliminar aprobada tiene un tiempo máximo de vigencia para avanzar al agendamiento antes de caducar?
  Por qué importa: impacta la persistencia de los resultados preliminares en caso de que el usuario no complete el agendamiento en el mismo momento.
  Crítica: no
  Propuesta del agente: la prevalidación es válida durante la sesión activa del usuario; si la sesión se cierra, se debe iniciar una nueva prevalidación.
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Evaluar preliminarmente las fórmulas e historias clínicas presentadas por un usuario autenticado para determinar su aptitud de entrega antes de desplazar al paciente a un punto de dispensación.

### 2. Contexto
En los puntos de dispensación, los pacientes descubren tardíamente que sus fórmulas no están vigentes, carecen de autorización o no están habilitadas para entrega crónica. Pharma Express resuelve esto ejecutando una prevalidación multicanal previa al desplazamiento.
Decisiones del equipo:
- Ninguna registrada aún para esta SPEC.

### 3. Alcance
- Captura del consentimiento explícito para el tratamiento de datos de salud.
- Carga de imágenes o archivos PDF de fórmulas e historias clínicas vía web y Telegram.
- Clasificación de tipo de tratamiento (agudo o crónico) mediante diagnóstico de la historia clínica.
- Ejecución secuencial de la prevalidación: afiliación activa, vigencia de fórmula, cobertura PBS, autorización EPS y fecha habilitada de entrega para crónicos.
- Presentación de resultados independientes por fórmula con avisos explicativos de carácter preliminar.
- Orientación hacia la EPS o atención presencial cuando no se supere la prevalidación.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-002. Como persona interesada en reclamar medicamentos, quiero cargar los documentos de la fórmula e historia clínica para validar preliminarmente si están aptos para entrega antes de ir al punto de dispensación.

### 5. Requisitos funcionales
- RF-013. El sistema debe solicitar la autorización explícita para el tratamiento de datos de salud antes de permitir la carga de cualquier documento. Origen: contexto 3.2.
- RF-014. El sistema debe permitir al usuario cargar fórmulas médicas e historias clínicas en formatos de imagen o PDF desde la aplicación web o el bot de Telegram. Origen: contexto 3.4.
- RF-015. El sistema debe clasificar el tratamiento de cada fórmula como crónico o agudo según el diagnóstico de la historia clínica cargada, utilizando el catálogo configurable de diagnósticos crónicos. Origen: contexto 3.4.
- RF-016. El sistema debe verificar la afiliación activa del paciente en la EPS simulada como primer paso de la prevalidación. Si la afiliación no está activa, debe detener la evaluación de toda la solicitud e indicar la orientación correspondiente. Origen: contexto 3.4.
- RF-017. El sistema debe verificar la vigencia de la fórmula médica consultada en la EPS simulada. Origen: contexto 3.4.
- RF-018. El sistema debe verificar la cobertura PBS de cada medicamento de la fórmula y, si un medicamento no es PBS, verificar si cuenta con autorización registrada en la EPS simulada. Origen: contexto 3.4.
- RF-019. El sistema debe verificar, en fórmulas crónicas, que la fecha habilitada de entrega sea igual o menor a la fecha posible de la cita. Origen: contexto 3.4.
- RF-020. El sistema debe marcar una fórmula como no apta en su totalidad si al menos uno de sus medicamentos no supera alguno de los pasos de la prevalidación. Origen: contexto 3.4.
- RF-021. El sistema debe presentar el resultado de cada fórmula de forma independiente, dejando continuar las fórmulas aptas e indicando el trámite en la EPS para las no aptas. Origen: contexto 3.4.
- RF-022. El sistema debe incluir en toda presentación de resultados el mensaje explícito de que la validación es preliminar y que la validación oficial ocurre en el punto de dispensación. Origen: contexto 3.4.

### 6. Requisitos no funcionales
- RNF-003. Usabilidad. La interfaz de carga de documentos y de despliegue de resultados de la prevalidación debe ser idéntica en alcance tanto en el canal web como en el bot de Telegram. Se verifica mediante pruebas funcionales comparativas entre canales. Origen: contexto 3.1.
- RNF-004. Seguridad. Los documentos cargados y los datos procesados durante la prevalidación no deben ser expuestos a canales no vinculados al paciente. Se verifica mediante inspección de logs y pruebas de acceso sin autenticación. Origen: contexto 3.2 y 3.3.

### 7. Reglas de negocio
- BR-009. Regla de todo o nada por fórmula: si un solo medicamento de una fórmula falla la prevalidación (vigencia, autorización o fecha habilitada), toda la fórmula queda calificada como no apta. Origen: contexto 3.4.
- BR-010. Independencia entre fórmulas: el rechazo de una fórmula dentro de una solicitud no impide que las demás fórmulas aptas de la misma solicitud continúen al agendamiento. Origen: contexto 3.4.
- BR-011. Clasificación por diagnóstico: todo diagnóstico no incluido en el catálogo configurable de tratamientos crónicos se califica y trata como tratamiento agudo. Origen: contexto 3.4.
- BR-012. Límite de actuación en autorizaciones: el sistema no gestiona, no tramita ni realiza seguimiento a las autorizaciones de la EPS; únicamente despliega la información de orientación proporcionada para la EPS del paciente. Origen: contexto 3.4 y 3.11.
- BR-013. Intento de re-carga de documentos ilegibles: los reintentos permitidos para documentos no legibles se gestionan dentro de la misma solicitud. Pendiente de OPEN-Q-005.

### 8. Flujo principal
1. El usuario, con identidad verificada en el canal (web o Telegram), selecciona la opción de prevalidar una nueva solicitud.
2. El sistema verifica si existe autorización de datos de salud previa; si no, la solicita y registra.
3. El sistema solicita adjuntar los documentos de fórmulas e historia clínica (imágenes o PDF).
4. El sistema procesa los documentos y extrae los datos de paciente, diagnósticos y medicamentos.
5. El sistema consulta la EPS simulada para verificar la afiliación.
6. El sistema clasifica el tipo de tratamiento por fórmula (agudo o crónico) según el diagnóstico.
7. El sistema evalúa secuencialmente para cada fórmula: vigencia de la fórmula, cobertura PBS / autorización EPS, y habilitación de fecha de entrega (para crónicos).
8. El sistema califica cada fórmula como apta o no apta.
9. El sistema despliega el resumen preliminar de la solicitud con el aviso legal explicativo de validación preliminar.
10. Para las fórmulas aptas, el sistema habilita el paso siguiente de consulta de disponibilidad y agendamiento.

### 9. Flujos alternativos y de excepción
- A1. La solicitud contiene únicamente fórmulas agudas:
  1. En el paso 7, el sistema omite la verificación de fecha habilitada de entrega crónica.
  2. El flujo continúa en el paso 8.
- A2. Alguna fórmula resulta no apta por falta de autorización:
  1. En el paso 8, el sistema marca esa fórmula como no apta.
  2. El sistema despliega los puntos de atención, enlaces web y trámites orientativos configurados para la EPS del paciente.
  3. Las demás fórmulas aptas de la solicitud continúan al paso 10.
- E1. Documento ilegible, incompleto o sin coincidencia con la EPS simulada:
  1. En el paso 4, el sistema informa al usuario que el documento no pudo procesarse.
  2. El sistema solicita al usuario cargar nuevamente el documento.
  3. Si la falla persiste tras los intentos permitidos (BR-013), la fórmula asociada se marca como no apta y se orienta a atención presencial.
- E2. Afiliación inactiva en la EPS simulada:
  1. En el paso 5, el sistema detecta que el paciente tiene estado inactivo.
  2. El sistema detiene todo el proceso de prevalidación de la solicitud.
  3. El sistema despliega un mensaje indicando que el paciente debe regularizar su estado con la EPS y no permite avanzar al agendamiento.

### 10. Casos límite
- CL-006. Paciente con afiliación inactiva intenta prevalidar varias fórmulas: el sistema detiene inmediatamente el proceso en el primer paso de verificación sin procesar de forma individual las fórmulas ni consultar existencias. Origen: contexto 3.4.
- CL-007. Documento ilegible en el último intento permitido: el sistema marca la fórmula como no apta y dirige al usuario a la atención presencial sin bloquear el procesamiento de otras fórmulas válidas adjuntadas en la misma solicitud. Origen: contexto 3.4.

### 11. Criterios de aceptación
- AC-013. Dado un usuario que no ha otorgado el consentimiento para datos de salud, cuando intenta iniciar la prevalidación y cargar documentos, entonces el sistema despliega el aviso de privacidad de datos de salud y exige su aceptación expresa antes de habilitar el botón de carga.
- AC-014. Dado un paciente con estado de afiliación inactivo en la EPS simulada, cuando solicita prevalidar una solicitud con una o más fórmulas, entonces el sistema detiene el proceso en la comprobación de afiliación, notifica que debe acudir a la EPS y no genera resultados individuales por fórmula.
- AC-015. Dado un documento de fórmula médica que contiene tres medicamentos donde dos están vigentes y autorizados y uno carece de autorización en la EPS simulada, cuando el sistema ejecuta la prevalidación, entonces califica toda la fórmula como no apta e informa cuál medicamento carece de autorización.
- AC-016. Dado un paciente que presenta dos fórmulas independientes en una misma solicitud (una fórmula agudamente apta y una fórmula crónica cuya fecha habilitada es posterior a la cita posible), cuando el sistema evalúa la prevalidación, entonces declara apta la fórmula aguda, declara no apta la fórmula crónica y permite continuar al agendamiento únicamente con la fórmula aguda.
- AC-017. Dado un usuario que carga una imagen ilegible de una fórmula médica, cuando el sistema procesa el archivo, entonces muestra un mensaje indicando la falla de lectura y permite adjuntar un nuevo archivo.
- AC-018. Dado un resultado de prevalidación donde todas las fórmulas resultaron aptas, cuando el sistema despliega la pantalla de confirmación previa al agendamiento, entonces incluye de forma visible la leyenda "Resultado preliminar: la validación oficial se realiza en la ventanilla del punto de dispensación".

### 12. Dependencias
- Verificación de identidad y consentimiento previa (módulo de autenticación/vinculación).
- EPS simulada (fuente de afiliación, vigencia de fórmulas y autorizaciones).
- Catálogo configurable de diagnósticos crónicos.
- Información configurable de trámites de autorización por EPS.

### 13. Restricciones
- No se realiza integración con EPS reales, MIPRES ni ADRES. Origen: contexto 3.10.
- El sistema no modifica fórmulas, no tramita autorizaciones ni altera prescripciones médicas. Origen: contexto 3.4 y 3.10.
- No se muestran diagnósticos ni nombres de medicamentos en notificaciones salientes. Origen: contexto 3.6.

### 14. Fuera de alcance
- Tramitación automática de autorizaciones ante la EPS.
- Corrección manual o edición de datos de la fórmula por parte del usuario.
- Notificación automática cuando una autorización pendiente sea aprobada en la EPS.
- Integración con el inventario de medicamentos durante la fase de prevalidación de documentos (la disponibilidad se evalúa en el agendamiento).

### 15. Preguntas abiertas
- OPEN-Q-005: Pendiente.
- OPEN-Q-006: Pendiente.
- OPEN-Q-007: Pendiente.

### 16. Trazabilidad
- HU-002: RF-013, RF-014, RF-015, RF-016, RF-017, RF-018, RF-019, RF-020, RF-021, RF-022; BR-009, BR-010, BR-011, BR-012, BR-013; AC-013, AC-014, AC-015, AC-016, AC-017, AC-018; CL-006, CL-007.
- RF-013: verificado por AC-013.
- RF-016: verificado por AC-014, CL-006.
- RF-018: verificado por AC-015.
- RF-020: verificado por BR-009, AC-015.
- RF-021: verificado por BR-010, AC-016.
- RF-022: verificado por AC-018.
- CL-007: verificado por AC-017.

### 17. Historial de cambios
- Versión 0.1: creación de la especificación a partir de la necesidad planteada para prevalidación preliminar de solicitudes.

## Verificación
- Completitud: cumple. Se cubren todas las etapas descritas en el contexto 3.4 para la prevalidación de documentos e información en la EPS simulada.
- Consistencia interna: cumple. Comparé RF-020, BR-009 y AC-015; todos aplican de forma consistente el principio de "todo o nada" por fórmula. Comparé RF-021, BR-010 y AC-016; todos sostienen la independencia de evaluación entre fórmulas.
- Consistencia con el contexto: cumple. Comparé el orden de validación en el flujo principal y RF-016 a RF-019 con la sección 3.4 del contexto; se respeta estrictamente la secuencia (afiliación -> vigencia -> PBS/autorización -> habilitación de entrega para crónicos).
- No ambigüedad: cumple. Todos los comportamientos del sistema quedan explícitamente delimitados a la EPS simulada y al carácter preliminar de los resultados.
- Verificabilidad: cumple. Cada criterio de aceptación está expresado en formato Dado / Cuando / Entonces con variables observables.
- Trazabilidad: cumple. Todos los requisitos, reglas, historias de usuario y casos límite están cruzados secuencialmente desde los identificadores indicados (HU-002, RF-013, RNF-003, BR-009, AC-013, CL-006, OPEN-Q-005).
- No invención: cumple. Se respetan estrictamente los límites del proyecto; las dudas sobre reintentos y referencia de fechas se mantuvieron como preguntas abiertas (OPEN-Q-005, OPEN-Q-006, OPEN-Q-007).
- Delimitación: cumple. Queda explícitamente establecido que la prevalidación no gestiona trámites de autorización ni modifica inventario.

## Siguiente paso
Respondan las preguntas abiertas OPEN-Q-005, OPEN-Q-006 y OPEN-Q-007 y ejecuten de nuevo el agente con --continuar SPEC-002.
