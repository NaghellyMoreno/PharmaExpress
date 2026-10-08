# SPEC-002. Prevalidación preliminar de solicitudes de medicamentos - Versión 0.2

Estado: Borrador
Modo: Iteración
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
- Ninguna con la sección 3 del contexto. DEC-011 no cambia requisitos, reglas, flujos, casos límite ni criterios; solo un identificador.
- Constancia: DEC-011 es una excepción a la convención del agente "Nunca reutilices ni renumeres un identificador". La responsable del equipo la conoce y la aprobó de forma explícita como excepción única, por lo que no requiere pregunta.
- Revisé que RF-029 no esté ocupado: los identificadores ocupados informados por el equipo para SPEC-003 son RF-023 a RF-028; RF-029 no aparece en ellos ni en esta SPEC. El número DEC-011 lo fijó el equipo porque DEC-007 a DEC-010 están ocupados por SPEC-003.

## Análisis de impacto
- DEC-011: afecta RF-029 (antes RF-013) en la sección 5; la línea de HU-002 y la línea de verificación del requisito en la sección 16 (trazabilidad); el criterio de trazabilidad de la Verificación; y el historial (sección 17). Busqué RF-013 en todo el documento: no aparece en orígenes, en el flujo principal, en los flujos A1, A2, E1 y E2, en las reglas, en los casos límite ni en los criterios de aceptación, por lo que su texto no cambia. AC-013, BR-013 y los demás identificadores con terminación 013 son identificadores distintos y se conservan. El contenido de RF-029 es idéntico al de RF-013 en la versión 0.1. Todos actualizados.

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
- DEC-011. Se renumera RF-013 de SPEC-002 a RF-029 para que no se cruce con SPEC-001. Es una excepción única aprobada por el equipo. Responde a la corrección pedida por la responsable del equipo en la iteración de la versión 0.2 (no responde a ninguna OPEN-Q).

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
- RF-029. El sistema debe solicitar la autorización explícita para el tratamiento de datos de salud antes de permitir la carga de cualquier documento. Origen: contexto 3.2.
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
- HU-002: RF-029, RF-014, RF-015, RF-016, RF-017, RF-018, RF-019, RF-020, RF-021, RF-022; BR-009, BR-010, BR-011, BR-012, BR-013; AC-013, AC-014, AC-015, AC-016, AC-017, AC-018; CL-006, CL-007.
- RF-029: verificado por AC-013.
- RF-016: verificado por AC-014, CL-006.
- RF-018: verificado por AC-015.
- RF-020: verificado por BR-009, AC-015.
- RF-021: verificado por BR-010, AC-016.
- RF-022: verificado por AC-018.
- CL-007: verificado por AC-017.

### 17. Historial de cambios
- Versión 0.1: creación de la especificación a partir de la necesidad planteada para prevalidación preliminar de solicitudes.
- Versión 0.2: se registra DEC-011. Equivalencia de identificadores: RF-013 → RF-029 (mismo contenido, misma posición en la sección 5). Es una excepción única a la regla de no renumerar, aprobada por la responsable del equipo para que RF-013 de SPEC-002 no se cruce con RF-013 de SPEC-001 (aprobada). Ningún otro identificador cambia. No se modificó el contenido de ningún requisito, regla, flujo, caso límite ni criterio. OPEN-Q-005, OPEN-Q-006 y OPEN-Q-007 siguen pendientes.

## Verificación
- Completitud: no cumple. Revisé que cada RF y cada BR tenga al menos un criterio de aceptación (instrucción 8): RF-014, RF-015, RF-017 y RF-019 no tienen AC propio, y BR-010, BR-011, BR-012 y BR-013 no tienen AC asociado en la trazabilidad (BR-010 se cubre de hecho con AC-016, pero no está trazado así). Además, BR-013 y CL-007 dependen de OPEN-Q-005, que es crítica y sigue pendiente. Por instrucción del equipo, en esta iteración no se crean identificadores nuevos ni se modifica contenido, por lo que estos vacíos quedan para la siguiente iteración.
- Consistencia interna: no cumple. Comparé RF-029 con AC-013 y con el paso 2 del flujo principal: son coherentes. Comparé RF-020, BR-009 y AC-015: RF-020 aplica el todo o nada a cualquier paso de la prevalidación, pero BR-009 solo enumera vigencia, autorización o fecha habilitada y omite la cobertura PBS; conviene alinearlos. Comparé RF-021, BR-010 y AC-016: coherentes. Comparé RF-016, E2, CL-006 y AC-014: coherentes. No corregí las diferencias porque el equipo pidió no modificar contenido en esta iteración.
- Consistencia con el contexto: cumple con observaciones. Comparé DEC-011 con la sección 3: no cambia ningún comportamiento, por lo que no la contradice. Comparé RF-016 a RF-019 y el paso 7 del flujo con el orden de la sección 3.4. Observación: RF-018 condiciona la consulta de autorización a que el medicamento no sea PBS, mientras que la sección 3.4 lista la autorización de cada medicamento como paso 4 separado ("Autorización de cada medicamento, consultada en la EPS simulada"); requiere revisión del equipo en la siguiente iteración. CL-007 cita "Origen: contexto 3.4", pero el "último intento permitido" depende de OPEN-Q-005.
- No ambigüedad: no cumple. Revisé los términos de RF, BR y AC: BR-013 y CL-007 dependen del número de intentos sin definir (OPEN-Q-005); RF-019 y AC-016 usan "fecha posible de la cita" sin definir (OPEN-Q-006); AC-016 usa la expresión "agudamente apta", que debería redactarse como "fórmula aguda apta".
- Verificabilidad: cumple con observaciones. Revisé que AC-013 a AC-018 estén en formato Dado, Cuando, Entonces con resultados observables. AC-017 no verifica el comportamiento al agotar los intentos porque OPEN-Q-005 está pendiente.
- Trazabilidad: no cumple. Revisé que RF-013 ya no aparezca en ninguna sección y que RF-029 aparezca en la sección 5, en la línea de HU-002 y en su propia línea de la sección 16 con AC-013. Revisé que no haya otro identificador repetido con SPEC-003 (RF-023 a RF-028, BR-014 a BR-017, AC-019 a AC-024, CL-008, CL-009, OPEN-Q-008 a OPEN-Q-010, DEC-007 a DEC-010): no hay cruces. Persiste el vacío de trazabilidad de RF-014, RF-015, RF-017, RF-019, BR-011, BR-012 y BR-013 sin AC, y CL-006 aparece como verificador de RF-016 en lugar de tener su propio AC. Una revisión rápida de los demás identificadores de esta SPEC (RF-014 a RF-022, BR-009 a BR-013, AC-013 a AC-018) frente a SPEC-001 no fue posible porque mi contexto se limita a esta SPEC y a la indicación del equipo; el equipo solo reportó el cruce de RF-013.
- No invención: cumple. Revisé que DEC-011 reproduzca el texto sugerido por el equipo y que no se haya respondido ni modificado OPEN-Q-005, OPEN-Q-006 ni OPEN-Q-007. No agregué reglas, cifras ni comportamientos.
- Delimitación: no cumple. Revisé las secciones 12, 13 y 14: la dependencia "Verificación de identidad y consentimiento previa (módulo de autenticación/vinculación)" nombra un módulo, lo que contradice la instrucción de nombrar funcionalidades y no módulos; RNF-004 ("inspección de logs") y AC-013 ("botón de carga") incluyen detalles de solución. Lo fuera de alcance coincide con la sección 3.10. No se corrigió por la instrucción de no modificar contenido.

## Siguiente paso
Respondan las preguntas abiertas OPEN-Q-005, OPEN-Q-006 y OPEN-Q-007 y pidan al agente "continuar SPEC-002" con las respuestas. En esa iteración conviene que el equipo autorice también corregir las observaciones de la Verificación: alinear BR-009 con RF-020 (cobertura PBS), revisar RF-018 frente al paso 4 de la sección 3.4, agregar criterios de aceptación para RF-014, RF-015, RF-017, RF-019, BR-011, BR-012, BR-013 y CL-006, y reescribir la dependencia de identidad sin nombrar módulos.
