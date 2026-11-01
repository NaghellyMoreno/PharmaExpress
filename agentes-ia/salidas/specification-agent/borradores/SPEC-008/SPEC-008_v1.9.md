<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash
Fecha: 2026-11-01 13:57
Petición: Corrige la SPEC-008 y publícala como versión 1.9 en estado Candidata. Haz solo estos reemplazos literales y nada más. Reglas estrictas: no toques otras líneas de la sección «Verificación»; no borres ninguna línea del historial ni del Análisis de impacto, solo añade una línea de esta versión.

(1) H-065. En la sección 2, al final de DEC-P09, añade: «Precisada por DEC-P54: se trata como ilegible.»
(2) H-056. En «Verificación», la línea «Completitud» queda: «- Completitud: parcial. Siguen pendientes OPEN-Q-009 y OPEN-Q-010, y siguen sin AC la obligación de cargar el año siguiente (RF-084) y el rango de 8 a 9 meses (BR-025).»
(3) H-066. Añade DEC-P43 y DEC-P50 al origen de RF-084 y de BR-027, en sus líneas y en la sección 16. En la sección 16, añade AC-050 a esas dos filas.
-->

# SPEC-008. Datos simulados, parámetros y catálogos - Versión 1.9

Estado: Candidata
Modo: Iteración
Necesidad original: "Datos simulados, parámetros y catálogos. La EPS simulada provee por paciente cédula, EPS, estado de afiliación, celular registrado y correo registrado si existe; por fórmula provee vigencia, estado de autorización por medicamento y, si es crónica, la fecha habilitada de la próxima entrega. Existe un catálogo simulado de cobertura PBS y un catálogo configurable de diagnósticos crónicos. Cada punto ficticio tiene horario, ventanas de 1 hora, capacidad por ventana e inventario por medicamento configurables. Por cada EPS existe contenido configurable con puntos, enlaces o trámites de autorización y orientación para actualizar datos. Existe el catálogo de motivos de no entrega aprobado. Los datos de prueba usan solo números y correos de los integrantes del equipo, con su consentimiento, y ningún dato de pacientes reales; las vigencias de las fórmulas de prueba están entre 8 y 9 meses después de la consulta médica. Los cambios de estado en la EPS simulada deben poder provocarse durante las pruebas. El sistema registra los eventos necesarios para estas métricas."
Épica: EPIC-007

## Análisis
- Objetivo: definir la estructura y el comportamiento de los datos simulados, parámetros y catálogos (incluyendo el catálogo de festivos de Colombia por año y la estructura de fórmulas MIPRES en la EPS simulada) que alimentan el funcionamiento de Pharma Express durante la operación y las pruebas.
- Alcance inicial: datos de paciente y fórmula de la EPS simulada, catálogo de cobertura PBS, catálogo de diagnósticos crónicos, catálogo configurable de festivos de Colombia por año, configuración de puntos de dispensación, contenido de EPS, catálogo de motivos de no entrega, datos de prueba restringidos, provocación de cambios de estado y registro de eventos para métricas de evaluación.
- Actores: paciente, dispensador. (Sistemas externos simulados: EPS simulada, inventario simulado).
- Contexto aplicable: 2.3, 3.2, 3.4, 3.5, 3.7, 3.8, 3.10, 3.11.

## Modelo de dominio
- EPS simulada: fuente de datos de paciente y fórmula. Origen: contexto 2.3, DEC-P12.
- Paciente: entidad con cédula, EPS, estado de afiliación, celular registrado y correo registrado (si existe). Origen: necesidad y contexto 3.2.
- Fórmula de la EPS simulada: entidad identificada por un número numérico de 20 dígitos (tipo MIPRES) que almacena la asociación con el paciente, fecha de prescripción, diagnóstico principal CIE-10 y lista de medicamentos (según DEC-P12); además almacena la indicación de cobertura PBS por medicamento, estado de autorización por medicamento, vigencia (fecha límite de vigencia) y la fecha habilitada de entrega si está registrada en la EPS simulada. Si la fórmula es clasificada como crónica y carece de fecha habilitada registrada en la EPS simulada, queda no apta y se orienta a la atención presencial. Origen: necesidad, contexto 3.4, DEC-P05, DEC-P08, DEC-P09, DEC-P12, DEC-P16, T-036.
- Catálogo de cobertura PBS: fuente de verificación de cobertura por medicamento. Prevalece sobre el indicador individual de la fórmula devuelto por la EPS simulada. Origen: necesidad, contexto 3.4, DEC-P11, DEC-P17.
- Catálogo de diagnósticos crónicos: catálogo configurable que define qué diagnósticos CIE-10 corresponden a tratamientos crónicos. Origen: necesidad y contexto 3.4.
- Catálogo de festivos de Colombia: catálogo configurable por año que contiene las fechas de los festivos oficiales de Colombia para el cálculo de días hábiles. Debe incluir el año en curso y el año siguiente. Origen: DEC-P13, DEC-P19.
- Punto de dispensación: entidad ficticia con horario, ventanas de 1 hora, capacidad por ventana e inventario por medicamento configurables. Origen: necesidad y contexto 3.5, 3.8. (En evaluación (DEC-P35) por DEC-P01).
- Contenido de EPS: información configurable de puntos, enlaces, trámites de autorización y orientación para actualizar datos. Origen: necesidad y contexto 3.4, 3.8.
- Catálogo de motivos de no entrega: listado de razones oficiales para no entregar un medicamento en el punto. Origen: necesidad y contexto 3.7. (En evaluación (DEC-P35) por DEC-P01).
- Datos de prueba: conjuntos de datos donde las fórmulas de prueba tienen vigencias de 8 a 9 meses tras la consulta y se usan únicamente celulares y correos reales del equipo con su consentimiento. Origen: necesidad, contexto 3.2, 3.8.
- Registro de eventos: eventos almacenados para métricas de evaluación de la prevalidación y transacciones del sistema. Tras una revocación solo se conservan el tipo de evento y su fecha, sin resultado, novedades ni dato que identifique al paciente; las métricas de novedades usan totales ya agregados (DEC-P51). Origen: necesidad, contexto 3.10, DEC-011, DEC-P01, SPEC-001/RF-009 y DEC-P51.

## Contradicciones detectadas
- Corrección por DEC-P09 y SPEC-003/RF-023: el diagnóstico que se compara contra el catálogo de crónicos es el asignado a la fórmula. Si la historia clínica trae un solo diagnóstico, aplica a todas las fórmulas de la solicitud; si trae varios, cada fórmula usa el diagnóstico que la EPS simulada asocia a su número de prescripción.

## Análisis de impacto
- DEC-010: afecta RF-082, A1 y fuera de alcance.
- DEC-011: afecta RF-083, RNF-018, AC-042.
- DEC-P01: afecta alcance general, RF-079, RF-081, RF-082, RF-083, RNF-018, HU-011, Flujo alternativo A1 y fuera de alcance. Se marcan los componentes de agendamiento como en evaluación (DEC-P35) por DEC-P01.
- DEC-P05, DEC-P08, DEC-P09, DEC-P12: afectan RF-076, RF-078, AC-035, AC-037, AC-044, AC-045, AC-046.
- DEC-P11: afecta RF-077, BR-026, AC-036, AC-047, AC-048.
- DEC-P13: afecta RF-084, BR-027, AC-043.
- DEC-P16: afecta RF-076, modelo de dominio y AC-050.
- DEC-P17: afecta RF-076, RF-077, modelo de dominio, AC-036, AC-047, AC-048 y AC-051.
- DEC-P18: afecta E1, AC-049 y fuera de alcance.
- DEC-P19: afecta RF-084, BR-027, modelo de dominio y AC-052.
- DEC-P31: responde a OPEN-Q-008. Las fuentes simuladas siempre responden y el manejo de fallas de fuentes simuladas queda fuera de alcance (sección 14).
- DEC-P32: responde a OPEN-Q-007. Afecta BR-026 y añade AC-053. Un medicamento sin entrada en el catálogo simulado de cobertura se trata como no PBS y requiere estado autorizado; si carece de autorización, la fórmula es no apta.
- DEC-P34: añade decisión en la sección 2. El indicador PBS de la fórmula es un dato de la EPS simulada.
- DEC-P35: afecta sección 2, sección 3, sección 14, RF-079, RF-081, RF-082, RF-083 y A1. Los elementos ligados al agendamiento se expresan como «en evaluación (DEC-P35)».
- DEC-P36: afecta RF-080, RF-082 y A1. Las modificaciones de prueba las realiza el equipo mediante datos o configuración sin interfaz de producto ni rol nuevo; se explicita la condición de valor configurable en RF-080.
- DEC-P42: añade decisión en la sección 2. Un número de fórmula que no tenga 20 dígitos numéricos se trata según SPEC-003/BR-009.
- DEC-P43 y DEC-P50: afecta el paso 6 del flujo principal y AC-052. La falta de fecha habilitada se resuelve antes de consultar el catálogo de festivos (DEC-P50); si falta el año en el catálogo de festivos para una fórmula crónica con fecha habilitada, se indica que la persona debe iniciar una solicitud nueva (DEC-P43).
- DEC-P51: afecta modelo de dominio, RF-083, RNF-018, AC-042 y añade AC-054. Tras la revocación del consentimiento solo se conservan el tipo de evento y su fecha, sin resultado, novedades ni dato que identifique al paciente; las métricas usan totales agregados.
- DEC-P53: precisa DEC-P31. Afecta la sección 2 y la sección 14. El manejo de fallas de las fuentes simuladas durante la prevalidación queda fuera de alcance; la verificación de identidad conserva SPEC-001/RF-010.
- H-058 (DEC-P43, DEC-P50): afecta RF-084 y BR-027. Se añade la precisión de que una fórmula crónica sin fecha habilitada queda no apta antes de consultar el catálogo (DEC-P50) y que la fórmula sin resultado no tiene estado propio debiendo iniciar solicitud nueva (DEC-P43).
- H-059 (DEC-P51): afecta AC-054. Se ajusta la condición inicial a «Dado un evento almacenado».
- H-056: añade OPEN-Q-009 y OPEN-Q-010 a la sección Preguntas de aclaración y a la sección 15.
- H-065 (DEC-P54): precisa DEC-P09 en la sección 2.
- H-056: actualiza Completitud en la sección Verificación.
- H-066 (DEC-P43, DEC-P50): actualiza el origen de RF-084 y BR-027 (añade DEC-P43 y DEC-P50) en sus definiciones y en la sección 16, y añade AC-050 a sus trazas en la sección 16.

## Preguntas de aclaración
- OPEN-Q-009 (PREG-018 y PREG-026). ¿Qué instante y qué zona horaria definen la fecha de prevalidación?
  Por qué importa: define los límites temporales exactos para la vigencia y la fecha de prevalidación.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-010 (PREG-025). ¿Cómo se mide el rango de 8 a 9 meses de los datos de prueba?
  Por qué importa: define los límites para la configuración y verificación de datos de prueba.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Establecer los parámetros, catálogos, estructura de datos simulados (EPS, fórmulas MIPRES, festivos de Colombia) y mecanismos de prueba para Pharma Express, delimitando los componentes activos para el MVP de prevalidación según DEC-P01.

### 2. Contexto
El sistema opera utilizando datos simulados para la EPS, el inventario, los puntos de dispensación y la validación oficial. En cumplimiento de DEC-P01, la prevalidación entra al MVP y las funciones de agendamiento, inventario y dispensación en punto se mantienen especificadas pero quedan en evaluación (DEC-P35). Los datos de prueba se restringen a los integrantes del equipo con su consentimiento.

Decisiones del equipo:
- DEC-010. El mecanismo concreto para provocar cambios de estado en la EPS simulada durante las pruebas es tema de arquitectura. La SPEC exige que los datos de prueba permitan provocar cambios de afiliación, vigencia y autorizaciones antes de una cita/prevalidación y que la prevalidación los detecte. Responde a OPEN-Q-001.
- DEC-011. El sistema registra los eventos necesarios para las métricas de evaluación aprobadas (tiempo estimado de espera, desplazamientos evitados, novedades detectadas antes del desplazamiento, tasa de éxito por tarea, sobre-reservas en cero y escenarios asistidos) y los eventos transaccionales correspondientes, excluyendo la medición SUS. Responde a OPEN-Q-002.
- DEC-P01. La prevalidación completa entra al MVP en web y Telegram. El agendamiento (SPEC-004) queda en evaluación.
- DEC-P05. Cada fórmula tiene un número de identificación, que es la llave para buscarla en la EPS simulada.
- DEC-P08. Una fórmula coincide con la EPS simulada si: (a) su número existe, (b) pertenece al paciente verificado y (c) los medicamentos leídos son los que la EPS tiene para ese número.
- DEC-P09. Con una sola historia clínica: si trae un diagnóstico, aplica a todas las fórmulas; si trae varios, cada fórmula usa el diagnóstico que la EPS simulada asocia a su número. Si la historia no trae diagnóstico, cuenta como documento incompleto. Precisada por DEC-P54: se trata como ilegible.
- DEC-P11. Un medicamento PBS es apto sin autorización; uno no PBS solo es apto si está autorizado en la EPS simulada.
- DEC-P12. El número de fórmula de la EPS simulada imita el número de prescripción MIPRES (numérico, 20 dígitos) y guarda con él el paciente, la fecha, el diagnóstico CIE-10 y los medicamentos.
- DEC-P13. La cita posible de una fórmula crónica es el primer día hábil siguiente a la prevalidación: se saltan domingos y festivos de Colombia. Los festivos salen de un catálogo configurable por año.
- DEC-P16. Una fórmula clasificada como crónica sin fecha habilitada registrada en la EPS simulada queda no apta y se orienta a la atención presencial. Responde a OPEN-Q-003.
- DEC-P17. Si el indicador PBS de la fórmula y el catálogo simulado de cobertura difieren, manda el catálogo. Responde a OPEN-Q-004.
- DEC-P18. En pruebas, el rechazo de un celular o correo fuera de la lista del equipo lo hace el entorno de pruebas; no es una regla del producto. La forma de hacerlo es tema de arquitectura. Responde a OPEN-Q-005.
- DEC-P19. Si el catálogo de festivos no tiene el año necesario, no se emite resultado para la fórmula crónica afectada, se muestra un error de sistema y se registra. El catálogo debe tener cargado también el año siguiente. Responde a OPEN-Q-006.
- DEC-P31 y DEC-P53. El manejo de fallas de las fuentes simuladas durante la prevalidación queda fuera de alcance. La verificación de identidad conserva SPEC-001/RF-010.
- DEC-P32. Un medicamento sin entrada en el catálogo simulado de cobertura se trata como no PBS y requiere estado autorizado. Responde a OPEN-Q-007.
- DEC-P34. El indicador PBS de la fórmula es un dato de la EPS simulada.
- DEC-P35. Los elementos de agendamiento quedan en evaluación.
- DEC-P36. El equipo realiza las modificaciones de prueba mediante datos o configuración sin interfaz de producto ni rol nuevo. Un valor es configurable si al cambiarlo el equipo se observa el efecto sin modificar el comportamiento del sistema.
- DEC-P42. Un número de fórmula que no tenga 20 dígitos numéricos se trata según SPEC-003/BR-009.
- DEC-P43. Si no se emite resultado por falta de año en festivos, la persona debe iniciar una solicitud nueva.
- DEC-P50. La falta de fecha habilitada en fórmula crónica se resuelve antes de consultar el catálogo de festivos.
- DEC-P51. Tras una revocación solo se conservan el tipo de evento y su fecha, sin resultado, novedades ni dato que identifique al paciente; las métricas de novedades usan totales ya agregados.

### 3. Alcance
- Provisión de datos de paciente y fórmula por la EPS simulada con estructura MIPRES (20 dígitos).
- Consulta de catálogo simulado de cobertura PBS y catálogo de diagnósticos crónicos.
- Consulta de catálogo configurable de festivos de Colombia por año (requiriendo año en curso y año siguiente).
- Contenido configurable por EPS para autorizaciones y orientación de actualización de datos.
- Uso exclusivo de datos de prueba del equipo con fórmulas de prueba vigentes entre 8 y 9 meses tras la consulta.
- Mecanismo para provocar cambios de estado en la EPS simulada durante las pruebas.
- Registro de eventos de prevalidación y transacciones para métricas de evaluación, con disociación de la identidad tras revocación (SPEC-001/RF-009, DEC-P51).
- [En evaluación (DEC-P35) por DEC-P01]: Configuración activa de puntos de dispensación, ventanas, capacidad, inventario, catálogo de motivos de no entrega, HU-011, acciones de cancelación/notificación de citas asociadas a cambios provocados y métricas de agendamiento/atención en punto (se mantienen especificados en la SPEC para fases posteriores).

### 4. Actores e historias de usuario
Actores: paciente, facilitador comunitario, persona que actúa por el paciente (cuidador, tutor o familiar), dispensador. (Sistemas externos simulados: EPS simulada, inventario simulado).
- HU-010. Como paciente (o persona que actúa por él / facilitador comunitario), quiero que el sistema valide la información de mis fórmulas MIPRES, diagnósticos y cobertura en los catálogos y EPS simulada, para conocer de forma anticipada la validez preliminar de mis medicamentos. Origen: necesidad, contexto 2.3 y 3.3.
- HU-011. Como dispensador, quiero consultar el catálogo oficial de motivos de no entrega y los datos simulados de dispensación, para registrar adecuadamente la validación oficial en el punto cuando aplique la fase presencial. (Nota: En evaluación (DEC-P35) por DEC-P01). Origen: necesidad y contexto 2.3, 3.7.

### 5. Requisitos funcionales
- RF-075. El sistema debe consultar a la EPS simulada los datos del paciente identificándolo por su cédula, retornando cédula, EPS a la que pertenece, estado de afiliación (activa/inactiva), número de celular registrado y correo electrónico registrado (si existe). Origen: necesidad y contexto 3.2.
- RF-076. El sistema debe consultar a la EPS simulada la información de cada fórmula utilizando un número numérico de 20 dígitos (tipo MIPRES) como llave de identificación, obteniendo el paciente asociado, fecha de prescripción, diagnóstico principal CIE-10, lista de medicamentos prescritos (según DEC-P12), la fecha límite de vigencia de la fórmula (origen: contexto 3.4), el indicador de cobertura PBS por medicamento (el cual es un dato de la EPS simulada según DEC-P34) y estado de autorización por medicamento (origen: contexto 3.4, DEC-P11), y la fecha habilitada de entrega si está registrada en la EPS simulada (origen: necesidad, contexto 3.4, T-036). El sistema obtiene la fecha habilitada sin depender de la clasificación de agudo/crónico, y solo la utiliza en la prevalidación si la fórmula es clasificada como crónica. Si una fórmula es clasificada como crónica por el sistema y no tiene fecha habilitada registrada en la EPS simulada, la fórmula queda no apta y se orienta a la atención presencial (origen: DEC-P16). Si el indicador de cobertura PBS de la fórmula devuelto por la EPS simulada difiere del catálogo simulado de cobertura PBS, prevalece la indicación del catálogo simulado (origen: DEC-P17). Origen: necesidad, contexto 3.4, DEC-P05, DEC-P08, DEC-P09, DEC-P12, DEC-P16, DEC-P17, DEC-P34, T-036.
- RF-077. El sistema debe verificar si cada medicamento de la fórmula está cubierto por el PBS mediante el catálogo simulado de cobertura PBS (el cual prevalece sobre el indicador individual de la fórmula devuelto por la EPS simulada en caso de discrepancia), determinando que un medicamento PBS no requiere autorización y un medicamento no PBS requiere estar autorizado en la EPS simulada para ser apto. Un medicamento sin entrada en el catálogo simulado se trata como no PBS y requiere estado autorizado (DEC-P32). Origen: necesidad, contexto 3.4, DEC-P11, DEC-P17 y DEC-P32.
- RF-078. El sistema debe clasificar el tratamiento de una fórmula como agudo o crónico comparando el código de diagnóstico CIE-10 asignado a la fórmula contra el catálogo configurable de diagnósticos crónicos. El diagnóstico asignado corresponde al único diagnóstico de la historia clínica cuando esta contiene solo uno, o al diagnóstico que la EPS simulada asocia al número de prescripción de la fórmula cuando la historia clínica contiene varios diagnósticos. Si el diagnóstico asignado figura en el catálogo de crónicos se clasifica como crónico, y en caso contrario como agudo. Origen: necesidad, contexto 3.4, DEC-P09 y SPEC-003/RF-023.
- RF-079. El sistema debe permitir definir y almacenar para cada punto de dispensación ficticio su horario de atención, ventanas de 1 hora, capacidad máxima de citas por ventana e inventario de existencias por medicamento. (Nota: En evaluación (DEC-P35) por DEC-P01). Origen: necesidad y contexto 3.5, 3.8.
- RF-080. El sistema debe proveer contenido configurable por cada EPS que contenga la información oficial de puntos de atención presencial, enlaces o trámites de autorización y la guía de orientación para actualización de datos del afiliado. Un valor es configurable si, al cambiarlo el equipo, el efecto se observa sin cambiar el comportamiento del sistema (DEC-P36). Origen: necesidad, contexto 3.4, 3.8 y DEC-P36.
- RF-081. El sistema debe disponer del catálogo aprobado de motivos de no entrega para el registro de novedades durante la validación presencial en punto. (Nota: En evaluación (DEC-P35) por DEC-P01). Origen: necesidad y contexto 3.7.
- RF-082. El sistema debe permitir provocar modificaciones de prueba en los datos de la EPS simulada (afiliación, vigencia de fórmula o estado de autorizaciones) antes de una cita o prevalidación, permitiendo verificar que la prevalidación del sistema detecte dichos cambios y ejecute las acciones correspondientes (las acciones de cancelación de citas y notificación de citas asociadas están en evaluación (DEC-P35) por DEC-P01). El equipo lo hace mediante datos o configuración del entorno, sin interfaz de producto ni rol nuevo (DEC-P36). Origen: necesidad, DEC-010 y DEC-P36.
- RF-083. El sistema debe registrar los eventos transaccionales y de prevalidación requeridos para las métricas de evaluación (tiempo estimado de espera, desplazamientos evitados, novedades detectadas antes del desplazamiento, tasa de éxito por tarea, sobre-reservas en cero y escenarios asistidos), incluyendo resultados de prevalidación por fórmula (las métricas y eventos sobre confirmación/cancelación/expiración de citas, llegadas/cierres por medicamento, sobre-reservas y atención en punto están en evaluación (DEC-P35) por DEC-P01). Tras una revocación solo se conservan el tipo de evento y su fecha, sin resultado, novedades ni dato que identifique al paciente; las métricas de novedades usan totales ya agregados (DEC-P51). Origen: necesidad, DEC-011, DEC-P01, SPEC-001/RF-009 y DEC-P51.
- RF-084. El sistema debe mantener un catálogo configurable de festivos de Colombia por año para determinar los días no hábiles (domingos y festivos) utilizados en el cálculo del primer día hábil siguiente para fórmulas crónicas. El catálogo debe tener cargado el año en curso y el año siguiente. Si al prevalidar una fórmula crónica el catálogo no tiene configurado el año necesario para calcular la cita posible, el sistema no emite resultado para la fórmula crónica afectada, muestra un error de sistema y registra el evento. Una fórmula crónica sin fecha habilitada queda no apta antes de consultar el catálogo (DEC-P50). La fórmula sin resultado no tiene estado propio y la persona inicia una solicitud nueva (DEC-P43). Origen: DEC-P13, DEC-P19, DEC-P43 y DEC-P50.

### 6. Requisitos no funcionales
- RNF-017. Privacidad y datos de prueba. Los conjuntos de datos de prueba del sistema deben utilizar única y exclusivamente números de teléfono celular y correos electrónicos pertenecientes a los integrantes del equipo con su consentimiento explícito, estando estrictamente prohibido el uso de datos de pacientes reales. Origen: necesidad y contexto 3.2. Se verifica con: auditoría directa de la base de datos de prueba y de las configuraciones de prueba; verificado por AC-049.
- RNF-018. Registro de métricas de prevalidación. El sistema debe almacenar el registro de eventos transaccionales de prevalidación y uso para permitir el cálculo de métricas de desplazamientos evitados, novedades detectadas antes del desplazamiento y tasa de éxito por tarea, asegurando que tras una revocación solo se conserven el tipo de evento y su fecha (DEC-P51). Origen: DEC-011, DEC-P01, SPEC-001/RF-009 y DEC-P51. Se verifica con: inspección de logs y auditoría de eventos de prevalidación; verificado por AC-042, AC-054.

### 7. Reglas de negocio
- BR-025. Evaluación de vigencia de fórmulas y datos de prueba. Una fórmula médica es preliminarmente vigente si y solo si su fecha límite de vigencia provista por la EPS simulada es mayor o igual a la fecha de prevalidación en que se realiza la consulta. Las fórmulas del conjunto de datos de prueba deben configurarse con vigencias comprendidas estrictamente entre 8 y 9 meses posteriores a la fecha de consulta médica simulada. Origen: necesidad y contexto 3.4.
- BR-026. Aprobación preliminar por PBS y autorización. Un medicamento de una fórmula se considera preliminarmente apto si figura como cubierto por el PBS en el catálogo simulado (independientemente de autorización) o si figurando como no PBS en el catálogo cuenta con estado autorizado en la EPS simulada. Si un medicamento no PBS según el catálogo carece de autorización, la fórmula no es apta. Un medicamento sin entrada en el catálogo simulado de cobertura se trata como no PBS y requiere estado autorizado. Origen: contexto 3.4, DEC-P11, DEC-P17 y DEC-P32.
- BR-027. Días hábiles y catálogo de festivos. El cálculo de la fecha hábil siguiente para prevalidación y agendamiento de fórmulas crónicas debe excluir los días domingos y las fechas incluidas en el catálogo de festivos de Colombia del año correspondiente. El catálogo debe incluir el año en curso y el año siguiente. Si al prevalidar una fórmula crónica falta la configuración del año requerido, no se emite resultado de prevalidación para la fórmula crónica afectada, se despliega un error de sistema y se registra la novedad. Una fórmula crónica sin fecha habilitada queda no apta antes de consultar el catálogo (DEC-P50). La fórmula sin resultado no tiene estado propio y la persona inicia una solicitud nueva (DEC-P43). Origen: DEC-P13, DEC-P19, DEC-P43 y DEC-P50.

### 8. Flujo principal
1. El sistema recibe una solicitud de prevalidación o consulta referente a una solicitud de paciente y sus fórmulas de 20 dígitos.
2. El sistema verifica la afiliación activa del paciente en la EPS simulada; si el estado de afiliación es inactivo, se detiene toda la solicitud y se orienta hacia la EPS.
3. El sistema evalúa la vigencia de la fórmula consultando la fecha límite de vigencia provista por la EPS simulada frente a la fecha de prevalidación (si no está vigente, se indica que requiere nueva valoración médica).
4. El sistema verifica la cobertura PBS de cada medicamento de la fórmula consultando el catálogo simulado de cobertura PBS (prevaleciendo sobre el indicador de la fórmula en caso de discrepancia; si no figura en el catálogo se trata como no PBS).
5. El sistema verifica el estado de autorización de cada medicamento de la fórmula en la EPS simulada (si un medicamento no PBS carece de autorización, la fórmula no es apta).
6. El sistema evalúa la fecha habilitada de entrega exclusivamente para fórmulas crónicas (el tratamiento se clasifica comparando el diagnóstico con el catálogo de diagnósticos crónicos); si la fórmula es crónica y no tiene fecha habilitada registrada en la EPS simulada, queda no apta y se orienta a la atención presencial; la falta de fecha habilitada se resuelve antes de consultar el catálogo de festivos (DEC-P50); si tiene fecha habilitada, se compara con la cita posible según SPEC-003/RF-024 paso 5 y SPEC-003/BR-015, y si requiere cálculo de fecha hábil, consulta el catálogo de festivos de Colombia (si falta el año requerido, suspende el resultado de la fórmula afectada, muestra error de sistema y lo registra). La evaluación de cada fórmula se detiene en la primera regla incumplida, como SPEC-003/BR-008.
7. El sistema registra el evento de prevalidación y resultado en el registro de auditoría y métricas, garantizando que tras una revocación solo se conserven el tipo de evento y su fecha (DEC-P51).

### 9. Flujos alternativos y de excepción
- A1. Cambio de estado en pruebas: Durante una sesión de prueba el equipo provoca una modificación en los datos de la EPS simulada (por ejemplo, afiliación inactiva o fórmula vencida). Al ejecutarse la nueva prevalidación, el sistema detecta el cambio en la EPS simulada y actualiza el resultado de prevalidación correspondiente. (Nota: Las acciones de cancelación de cita y notificación de cita asociadas a este flujo están en evaluación (DEC-P35) por DEC-P01). Origen: DEC-010 y DEC-P36.
- E1. Intento de uso de datos de prueba no autorizados: Si en un entorno de pruebas se intenta ejecutar una verificación o envío utilizando un número de celular o correo que no pertenezca a la lista autorizada del equipo de proyecto, el entorno de pruebas rechaza la operación. Origen: RNF-017 y DEC-P18.

### 10. Casos límite
- CL-019. Vigencia en la EPS simulada vencida antes de la prevalidación: Si una fórmula tiene una fecha límite de vigencia menor a la fecha actual de prevalidación, el sistema la declara como no vigente e indica que requiere nueva valoración médica. Origen: necesidad y contexto 3.4. Verificado por: AC-045.
- CL-020. Prevalidación de fórmula crónica en día previo a festivo oficial: Si la prevalidación de una fórmula crónica se realiza un sábado o previo a un festivo registrado en el catálogo de festivos de Colombia, el cálculo de la fecha posible omite los días no hábiles y asigna el primer día hábil siguiente. Origen: DEC-P13. Verificado por: AC-043.

### 11. Criterios de aceptación
- AC-034. Dado un paciente consultado en la EPS simulada por su número de cédula, cuando el sistema realiza la consulta, entonces retorna la cédula, el nombre de la EPS, estado de afiliación (activa/inactiva), el teléfono celular registrado y el correo electrónico registrado si existe. Origen: RF-075.
- AC-035. Dado un número de fórmula de 20 dígitos existente en la EPS simulada, cuando el sistema realiza la consulta por ese número, entonces retorna el paciente asociado, fecha de prescripción, diagnóstico principal CIE-10, lista de medicamentos, fecha límite de vigencia, indicador PBS por medicamento, estado de autorización por medicamento y la fecha habilitada de entrega si está registrada. Origen: RF-076, BR-025.
- AC-036. Dado un medicamento prescrito en una fórmula figurando como 'cubierto' en el catálogo simulado de cobertura PBS, cuando se evalúa su aptitud preliminar en la prevalidación, entonces el sistema lo determina como apto sin requerir estado de autorización. Origen: RF-077, BR-026, DEC-P17.
- AC-037. Dado el código de diagnóstico CIE-10 asignado a una fórmula (proveniente de la historia clínica si es único, o del registro de la EPS simulada si la historia trae varios), cuando el sistema lo compara contra el catálogo de diagnósticos crónicos, entonces clasifica el tratamiento como crónico si el código figura en el catálogo o como agudo en caso contrario. Origen: RF-078.
- AC-038. Dado un punto de dispensación ficticio en la configuración del sistema, cuando se consultan sus parámetros, entonces el sistema retorna su horario, capacidad por ventanas de 1 hora e inventario por medicamento. (Nota: En evaluación (DEC-P35) por DEC-P01). Origen: RF-079.
- AC-039. Dada una EPS configurada en el sistema, cuando se requiere informar al usuario sobre autorizaciones o actualización de datos, entonces el sistema provee los enlaces, puntos de atención presencial y guía de trámites configurados para esa EPS. Origen: RF-080.
- AC-040. Dado el catálogo de motivos de no entrega, cuando el dispensador registra una no entrega en el punto, entonces el sistema despliega las opciones oficiales (afiliación inactiva, fórmula vencida, autorización no vigente, medicamento no cubierto, datos no coinciden, sin existencias, otro). (Nota: En evaluación (DEC-P35) por DEC-P01). Origen: RF-081.
- AC-041. Dado un cambio provocado en el estado de una fórmula o afiliación en la EPS simulada durante las pruebas, cuando el sistema ejecuta la nueva prevalidación, entonces detecta el nuevo estado y actualiza el resultado de prevalidación en consecuencia. Origen: RF-082.
- AC-042. Dado un flujo de prevalidación completado, cuando finaliza el procesamiento, entonces el sistema almacena el registro del evento transaccional con el resultado de la prevalidación y las novedades detectadas. Origen: RF-083, RNF-018.
- AC-043. Dado el año en curso y el catálogo de festivos de Colombia configurado, cuando se calcula el primer día hábil siguiente para una fórmula crónica prevalidada en sábado antes de un lunes festivo, entonces el sistema retorna la fecha del martes siguiente. Origen: RF-084, BR-027.
- AC-044. Dado un número de prescripción de 20 dígitos que no existe en la EPS simulada, cuando el sistema realiza la consulta, entonces retorna que la fórmula no fue encontrada. Origen: RF-076, DEC-P08.
- AC-045. Dada una fórmula en la EPS simulada cuya fecha límite de vigencia es menor que la fecha actual de prevalidación, cuando el sistema evalúa su vigencia, entonces determina que la fórmula está vencida y requiere nueva valoración médica. Origen: RF-076, BR-025, CL-019.
- AC-046. Dada una fórmula en la EPS simulada cuya fecha límite de vigencia es exactamente igual a la fecha actual de prevalidación, cuando el sistema evalúa su vigencia, entonces confirma que la fórmula se encuentra vigente. Origen: RF-076, BR-025.
- AC-047. Dado un medicamento prescrito figurando como 'no cubierto' en el catálogo simulado de cobertura PBS y con estado 'Autorizado' en la EPS simulada, cuando se evalúa su aptitud preliminar, entonces el sistema lo determina como apto. Origen: RF-077, BR-026, DEC-P17.
- AC-048. Dado un medicamento prescrito figurando como 'no cubierto' en el catálogo simulado de cobertura PBS y con estado 'No autorizado' (o sin autorización) en la EPS simulada, cuando se evalúa su aptitud preliminar, entonces el sistema determina que la fórmula es no apta. Origen: RF-077, BR-026, DEC-P17.
- AC-049. Dado un entorno de pruebas configurado con los números y correos autorizados del equipo, cuando se intenta realizar un envío a un número de celular o correo no incluido en la lista autorizada, entonces el entorno de pruebas rechaza la operación y no se realiza el envío. Origen: RNF-017, E1, DEC-P18.
- AC-050. Dada una fórmula clasificada como crónica que superó las verificaciones anteriores y no tiene fecha habilitada de entrega registrada en la EPS simulada, cuando el sistema realiza la prevalidación, entonces determina que la fórmula es no apta y orienta a la atención presencial. Origen: RF-076, DEC-P16.
- AC-051. Dado un medicamento que el catálogo simulado de cobertura registra como PBS y cuyo indicador en la fórmula dice no PBS, cuando el sistema evalúa la cobertura sin autorización registrada, entonces el medicamento es apto; y dado un medicamento que el catálogo registra como no PBS y cuyo indicador en la fórmula dice PBS, cuando no tiene estado Autorizado, entonces la fórmula es no apta. Origen: RF-076, RF-077, DEC-P17.
- AC-052. Dada una fórmula crónica con fecha habilitada registrada que requiere consultar un año no cargado en el catálogo de festivos de Colombia, cuando el sistema realiza el cálculo del primer día hábil siguiente, entonces no emite resultado para la fórmula crónica afectada, despliega un error de sistema, registra el evento de error y la persona debe iniciar una solicitud nueva. Origen: RF-084, BR-027, DEC-P19, DEC-P43 y DEC-P50.
- AC-053. Dado un medicamento sin entrada en el catálogo simulado de cobertura y sin estado autorizado en la EPS simulada, cuando el sistema evalúa la cobertura y la autorización, entonces la fórmula es no apta. Origen: DEC-P32, BR-026.
- AC-054. Dado un evento almacenado, cuando el titular revoca el consentimiento, entonces del evento solo quedan el tipo y la fecha, sin resultado, novedades ni dato que identifique al paciente. Origen: RF-083, SPEC-001/RF-009, DEC-P51.

### 12. Dependencias
- EPS simulada (fuente de datos de paciente y fórmula MIPRES de 20 dígitos).
- Inventario simulado (fuente de existencias por punto).
- Catálogos configurables de diagnósticos crónicos, cobertura PBS, festivos de Colombia y motivos de no entrega.
- SPEC-001 (RF-009) (exigencia de disociación de la identidad tras revocación de consentimiento).
- SPEC-003 (diagnóstico asignado y reglas de prevalidación).

### 13. Restricciones
- Equipo de cuatro personas y aproximadamente 8 semanas. Origen: contexto 3.9.
- El equipo no tiene acceso a los sistemas de Disfarma y trabaja desde afuera. Origen: contexto 3.9.
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 131, y Resolución 1604 de 2013: obligación de la EPS de entregar lo faltante en 48 horas. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites de autorización. Origen: contexto 3.11.

### 14. Fuera de alcance
- Medición SUS y metas de desempeño. Origen: contexto 3.10.
- Integración real con EPS, MIPRES, ADRES o inventarios reales. Origen: contexto 3.10.
- Uso de datos reales de pacientes. Origen: contexto 3.10.
- Funcionalidades de agendamiento, ventanas, inventario y validación presencial en punto en evaluación (DEC-P35). Origen: DEC-P01.
- Manejo de fallas de las fuentes simuladas durante la prevalidación: fuera de alcance. Origen: DEC-P31, DEC-P53.
- [Mecanismo de modificación de datos en la EPS simulada]: tema para arquitectura. Origen: RF-082 y DEC-010.
- [Estructura y almacenamiento físico del catálogo de festivos y fórmulas MIPRES]: tema para arquitectura. Origen: RF-076 y RF-084.
- [Mecanismo de rechazo de envíos no autorizados en entorno de pruebas]: tema para arquitectura. Origen: RNF-017, E1 y DEC-P18.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-010)
- OPEN-Q-002: Respondida (DEC-011)
- OPEN-Q-003: Respondida (DEC-P16)
- OPEN-Q-004: Respondida (DEC-P17)
- OPEN-Q-005: Respondida (DEC-P18)
- OPEN-Q-006: Respondida (DEC-P19)
- OPEN-Q-007: Respondida (DEC-P32)
- OPEN-Q-008: Respondida (DEC-P31)
- OPEN-Q-009: Pendiente
- OPEN-Q-010: Pendiente

### 16. Trazabilidad
- HU-010: RF-075, RF-076, RF-077, RF-078, RF-080, RF-082, RF-083, RF-084; RNF-017, RNF-018; BR-025, BR-026, BR-027; AC-034, AC-035, AC-036, AC-037, AC-039, AC-041, AC-042, AC-043, AC-044, AC-045, AC-046, AC-047, AC-048, AC-049, AC-050, AC-051, AC-052, AC-053, AC-054; CL-019, CL-020.
- HU-011: RF-079, RF-081; AC-038, AC-040.
- RF-075: Origen: necesidad y contexto 3.2; verificado por AC-034.
- RF-076: Origen: necesidad, contexto 3.4, DEC-P05, DEC-P08, DEC-P09, DEC-P12, DEC-P16, DEC-P17, DEC-P34, T-036; verificado por AC-035, AC-044, AC-045, AC-046, AC-050, AC-051; la detención en la primera regla incumplida se verifica por SPEC-003/AC-033 y SPEC-003/AC-046.
- RF-077: Origen: necesidad, contexto 3.4, DEC-P11, DEC-P17 y DEC-P32; verificado por AC-036, AC-047, AC-048, AC-051, AC-053.
- RF-078: Origen: necesidad, contexto 3.4, DEC-P09 y SPEC-003/RF-023; verificado por AC-037.
- RF-079: Origen: necesidad y contexto 3.5, 3.8; verificado por AC-038.
- RF-080: Origen: necesidad, contexto 3.4, 3.8 y DEC-P36; verificado por AC-039.
- RF-081: Origen: necesidad y contexto 3.7; verificado por AC-040.
- RF-082: Origen: necesidad, DEC-010 y DEC-P36; verificado por AC-041.
- RF-083: Origen: necesidad, DEC-011, DEC-P01, SPEC-001/RF-009 y DEC-P51; verificado por AC-042, AC-054.
- RF-084: Origen: DEC-P13, DEC-P19, DEC-P43 y DEC-P50; verificado por AC-043, AC-050, AC-052.
- RNF-017: Origen: necesidad y contexto 3.2; verificado con auditoría directa de la base de datos de prueba y configuraciones de prueba; verificado por AC-049.
- RNF-018: Origen: DEC-011, DEC-P01, SPEC-001/RF-009 y DEC-P51; verificado con inspección de logs y auditoría de eventos de prevalidación; verificado por AC-042, AC-054.
- BR-025: Origen: necesidad y contexto 3.4; verificado por AC-035, AC-045, AC-046.
- BR-026: Origen: contexto 3.4, DEC-P11, DEC-P17 y DEC-P32; verificado por AC-036, AC-047, AC-048, AC-051, AC-053.
- BR-027: Origen: DEC-P13, DEC-P19, DEC-P43 y DEC-P50; verificado por AC-043, AC-050, AC-052.
- CL-019: Origen: necesidad y contexto 3.4; verificado por AC-045.
- CL-020: Origen: DEC-P13; verificado por AC-043.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y del contexto.
- Versión 1.0: incorporación de las respuestas del equipo a OPEN-Q-001 y OPEN-Q-002, definición de eventos para métricas específicas y exclusión del mecanismo de arquitectura.
- Versión 1.1: incorporación de decisiones globales DEC-P01, DEC-P05, DEC-P08, DEC-P09, DEC-P11, DEC-P12 y DEC-P13. Solución a los hallazgos T-002, T-006, T-034, T-035, T-036 y T-037.
- Versión 1.2: actualización a estado Candidata aplicando observaciones de la revisión. Alineación de RF-078, paso 4 del flujo y AC-037 con DEC-P09 y SPEC-003/RF-023. Ajuste de RF-076, paso 3 del flujo y modelo de dominio por T-036. Registro de OPEN-Q-004 sobre la fuente prevalente de cobertura PBS. Delimitación de componentes fuera de alcance MVP. Adición de AC-044, AC-045, AC-046 y AC-049. División de AC-036 en tres criterios. Registro de OPEN-Q-005 para E1 y OPEN-Q-006 para catálogo de festivos. Descripción exacta de DEC-P12.
- Versión 1.3: publicación en estado Candidata aplicando DEC-P16, DEC-P17, DEC-P18 y DEC-P19. Definición de resultado no apto para fórmulas crónicas sin fecha habilitada (DEC-P16, AC-050). Establecimiento de prevalencia del catálogo simulado de cobertura PBS sobre el indicador de la fórmula y reescritura de AC-036, AC-047 y AC-048 más adición de AC-051 (DEC-P17). Asignación del rechazo en pruebas al entorno de pruebas exclusivamente y derivación de su mecanismo a arquitectura (DEC-P18, E1, AC-049). Inclusión de la exigencia del año siguiente en festivos y manejo de fallo por año faltante (DEC-P19, RF-084, BR-027, AC-052). Corrección del título de Análisis de impacto y eliminación de DEC-P12 como origen de BR-025 y CL-019.
- Versión 1.4: actualización a estado Candidata aplicando el informe de revisión estricta. Reestructuración del flujo principal al orden estricto de SPEC-003/RF-024 (afiliación, vigencia, cobertura PBS, autorización y fecha habilitada de crónicas), incorporando la evaluación de afiliación con detención de solicitud y la de vigencia (H-001, H-002). Inclusión de exigencia de disociación de la identidad en registros de eventos tras revocación según SPEC-001/RF-009 en modelo de dominio, RF-083, RNF-018 y AC-042 sin inventar campos (H-006). Registro como OPEN-Q pendientes de H-003/PREG-020 y H-005/PREG-022. Actualización de trazabilidad, análisis de impacto, historial y verificación.
- Versión 1.5: actualización a estado Candidata. Adición de la frase al final del paso 6 del flujo principal indicando que la evaluación de cada fórmula se detiene en la primera regla incumplida, como SPEC-003/BR-008.
- Versión 1.6: actualización a estado Candidata aplicando correcciones H-008, H-025, H-043, H-044, H-045, H-047, H-053 y actualización de la sección Verificación a estado parcial para Verificabilidad, No ambigüedad, Completitud, Consistencia y Trazabilidad por OPEN-Q-007, OPEN-Q-008 y PREG-050.
- Versión 1.7: actualización a estado Candidata aplicando DEC-P31, DEC-P32, DEC-P34, DEC-P35, DEC-P36, DEC-P42, DEC-P43, DEC-P50 y DEC-P51. Cierre de OPEN-Q-007 y OPEN-Q-008. Ajuste de elementos de agendamiento a «en evaluación (DEC-P35)». Tratamiento de medicamentos ausentes en el catálogo como no PBS (DEC-P32, BR-026, AC-053). Modificaciones de prueba realizadas por el equipo sin rol nuevo y configurabilidad de valores (DEC-P36, RF-080, RF-082, A1). Disociación de eventos tras revocación conservando solo tipo y fecha (DEC-P51, modelo de dominio, RF-083, RNF-018, AC-042, AC-054). Prioridad en prevalidación crónica y solicitud nueva ante año faltante (DEC-P43, DEC-P50, paso 6 del flujo, AC-052). Exclusión del manejo de fallas de fuentes simuladas (DEC-P31, sección 14).
- Versión 1.7, ajuste de edición sin cambio de reglas: la sección Verificación vuelve a «parcial» donde quedan puntos abiertos.
- Versión 1.8: actualización a estado Candidata aplicando DEC-P53 (sección 2, sección 14), H-058/DEC-P43/DEC-P50 (RF-084, BR-027), H-059/DEC-P51 (AC-054) e inclusión de OPEN-Q-009 y OPEN-Q-010 (sección Preguntas de aclaración y sección 15).
- Versión 1.8, ajuste de edición sin cambio de reglas: se corrigió una palabra en inglés en RF-081.
- Versión 1.9: actualización a estado Candidata aplicando H-065/DEC-P54 (precisión de DEC-P09 en sección 2), H-056 (ajuste de Completitud en Verificación) y H-066/DEC-P43/DEC-P50 (actualización de origen y traza AC-050 en RF-084 y BR-027).
- Versión 1.9, ajuste de edición sin cambio de reglas: se corrigió una palabra en inglés en Verificación.

## Verificación
- Completitud: parcial. Siguen pendientes OPEN-Q-009 y OPEN-Q-010, y siguen sin AC la obligación de cargar el año siguiente (RF-084) y el rango de 8 a 9 meses (BR-025).
- Consistencia interna: parcial. Siguen hallazgos del informe S1, como la doble titularidad de reglas con SPEC-003.
- Consistencia con el contexto: cumple. Se comparó la especificación con la sección 3 del contexto de Pharma Express y con las decisiones registradas en `decisiones.md`.
- No ambigüedad: parcial. Siguen por definir la zona horaria (PREG-026) y los extremos del rango de vigencia (PREG-025).
- Verificabilidad: parcial. Quedan obligaciones sin observación, según el informe S1 (RF-084, BR-025, RNF-017).
- Cobertura de actores: cumple. Se incluyen y especifican las historias de usuario para el paciente, la persona que actúa por él, el facilitador comunitario y el dispensador.
- Cobertura de AC: cumple. Todos los RF, RNF, BR y CL cuentan con al menos un criterio de aceptación trazado en la sección 16.
- Trazabilidad: parcial. Quedan trazas más amplias que el AC que las verifica, según el informe S1.
- No invención: cumple. Se respetaron estrictamente las decisiones suministradas sin inventar comportamientos adicionales.
- Delimitación: cumple. Se delimitaron con claridad los elementos en evaluación por DEC-P35, las exclusiones de negocio y las decisiones que competen a arquitectura en la sección 14.

## Siguiente paso
La SPEC-008 versión 1.9 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
