<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-31 20:43
Petición: Corrige la SPEC-008 y publícala como versión 1.4 en estado Candidata, sin reescribir lo que no se menciona. Usa el informe adjunto. (1) H-001 y H-002: reescribe el flujo principal en el orden estricto de SPEC-003/RF-024: afiliación, vigencia, cobertura PBS, autorización y fecha habilitada solo para crónicas. Incluye la evaluación de afiliación con detención de la solicitud y la de vigencia. (2) H-004: el indicador PBS es el devuelto por la EPS simulada; es la misma lectura que SPEC-003 v1.4. (3) H-006: en AC-042 y RF-083 exige que los registros de eventos conservados tras una revocación queden disociados de la identidad, según SPEC-001/RF-009; no inventes campos. (4) Registra como OPEN-Q pendiente, citando la PREG y sin decidir: H-003/PREG-020 y H-005/PREG-022. Actualiza trazabilidad, impacto, historial y verificación. Di cumple solo si se comprobó. No inventes reglas.
-->

# SPEC-008. Datos simulados, parámetros y catálogos - Versión 1.4

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
- Punto de dispensación: entidad ficticia con horario, ventanas de 1 hora, capacidad por ventana e inventario por medicamento configurables. Origen: necesidad y contexto 3.5, 3.8. (Fuera del alcance del MVP según DEC-P01).
- Contenido de EPS: información configurable de puntos, enlaces, trámites de autorización y orientación para actualizar datos. Origen: necesidad y contexto 3.4, 3.8.
- Catálogo de motivos de no entrega: listado de razones oficiales para no entregar un medicamento en el punto. Origen: necesidad y contexto 3.7. (Fuera del alcance del MVP según DEC-P01).
- Datos de prueba: conjuntos de datos donde las fórmulas de prueba tienen vigencias de 8 a 9 meses tras la consulta y se usan únicamente celulares y correos reales del equipo con su consentimiento. Origen: necesidad, contexto 3.2, 3.8.
- Registro de eventos: eventos almacenados para métricas de evaluación de la prevalidación y transacciones del sistema. Los registros de eventos conservados tras una revocación de consentimiento deben quedar disociados de la identidad, según SPEC-001/RF-009, sin inventar campos adicionales. Origen: necesidad, contexto 3.10, DEC-011, DEC-P01, SPEC-001/RF-009.

## Contradicciones detectadas
- Corrección por DEC-P09 y SPEC-003/RF-023: el diagnóstico que se compara contra el catálogo de crónicos es el asignado a la fórmula. Si la historia clínica trae un solo diagnóstico, aplica a todas las fórmulas de la solicitud; si trae varios, cada fórmula usa el diagnóstico que la EPS simulada asocia a su número de prescripción.

## Análisis de impacto
- DEC-P01: afecta alcance general, RF-079, RF-081, RF-082, RF-083, RNF-018, HU-011, Flujo alternativo A1 y fuera de alcance. Se marcan los componentes de puntos, ventanas, inventario, motivos de no entrega, HU-011, acciones de cancelación/notificación de citas en RF-082/A1 y métricas de agendamiento/atención en punto en RF-083 como fuera del alcance del MVP por DEC-P01, conservando los requisitos en la SPEC.
- DEC-P05, DEC-P08, DEC-P09, DEC-P12: afectan RF-076, RF-078, AC-035, AC-037, AC-044, AC-045, AC-046. La fórmula se identifica mediante un número de 20 dígitos tipo MIPRES que guarda paciente, fecha, diagnóstico CIE-10 y medicamentos. El diagnóstico a comparar con el catálogo de crónicos es el asignado a la fórmula.
- DEC-P11: afecta RF-077, BR-026, AC-036, AC-047, AC-048. Un medicamento PBS es apto sin autorización; uno no PBS requiere estar autorizado.
- DEC-P13: afecta RF-084, BR-027, AC-043. Incorpora el catálogo configurable de festivos de Colombia por año para el cálculo del primer día hábil en fórmulas crónicas.
- T-036: afecta RF-076 y paso 3 del flujo principal. La EPS simulada almacena y devuelve la fecha habilitada cuando la tiene registrada.
- DEC-P16: afecta RF-076, modelo de dominio y añade AC-050. Si una fórmula clasificada como crónica no tiene fecha habilitada registrada en la EPS simulada, queda no apta y se orienta a la atención presencial. Responde a OPEN-Q-003.
- DEC-P17: afecta RF-076, RF-077, modelo de dominio, reescribe AC-036, AC-047, AC-048 y añade AC-051. El catálogo simulado de cobertura PBS prevalece sobre el indicador individual de la fórmula devuelto por la EPS simulada en caso de discrepancia. Responde a OPEN-Q-004.
- DEC-P18: afecta E1, AC-049 y fuera de alcance (sección 14). Asigna el rechazo de envíos en pruebas exclusivamente al entorno de pruebas, eliminando el sistema como alternativa, y deriva su mecanismo a arquitectura. Responde a OPEN-Q-005.
- DEC-P19: afecta RF-084, BR-027, modelo de dominio y añade AC-052. Exige la inclusión del año en curso y el año siguiente en el catálogo de festivos; establece que si falta el año necesario no se emite resultado para la fórmula crónica afectada, se notifica un error de sistema y se registra el evento. Responde a OPEN-Q-006.
- Alineación del flujo principal con SPEC-003/RF-024 (H-001 y H-002): se reestructura el flujo principal de la sección 8 para seguir estrictamente el orden: afiliación, vigencia, cobertura PBS, autorización y fecha habilitada solo para crónicas. Se incluye la evaluación explícita de la afiliación (con detención de la solicitud si está inactiva) y la evaluación de vigencia.
- Disociación de registros de eventos (H-006): se actualiza RF-083 y AC-042 para exigir que los registros de eventos conservados tras una revocación queden disociados de la identidad, conforme a SPEC-001/RF-009, sin inventar campos adicionales.
- Corrección de orígenes: se quita DEC-P12 como origen de BR-025 y CL-019 en las secciones 7, 10 y 16 por no aplicar a vigencia.

## Preguntas de aclaración
- OPEN-Q-003. Pregunta original H-003/PREG-020: ¿Qué resultado tiene un medicamento que no figura en el catálogo simulado de cobertura PBS?
  Por qué importa: define el comportamiento y la regla de negocio ante medicamentos ausentes en el catálogo.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-004. Pregunta original H-005/PREG-022: ¿Qué pasa si la EPS simulada o un catálogo falla durante la prevalidación?
  Por qué importa: define la resiliencia y el manejo de errores del sistema ante caídas de fuentes simuladas.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Establecer los parámetros, catálogos, estructura de datos simulados (EPS, fórmulas MIPRES, festivos de Colombia) y mecanismos de prueba para Pharma Express, delimitando los componentes activos para el MVP de prevalidación según DEC-P01.

### 2. Contexto
El sistema opera utilizando datos simulados para la EPS, el inventario, los puntos de dispensación y la validación oficial. En cumplimiento de DEC-P01, la prevalidación entra al MVP y las funciones de agendamiento, inventario y dispensación en punto se mantienen especificadas pero quedan fuera del alcance del MVP inicial. Los datos de prueba se restringen a los integrantes del equipo con su consentimiento.

Decisiones del equipo:
- DEC-010. El mecanismo concreto para provocar cambios de estado en la EPS simulada durante las pruebas es tema de arquitectura. La SPEC exige que los datos de prueba permitan provocar cambios de afiliación, vigencia y autorizaciones antes de una cita/prevalidación y que la prevalidación los detecte. Responde a OPEN-Q-001.
- DEC-011. El sistema registra los eventos necesarios para las métricas de evaluación aprobadas (tiempo estimado de espera, desplazamientos evitados, novedades detectadas antes del desplazamiento, tasa de éxito por tarea, sobre-reservas en cero y escenarios asistidos) y los eventos transaccionales correspondientes, excluyendo la medición SUS. Responde a OPEN-Q-002.
- DEC-P01. La prevalidación completa entra al MVP en web y Telegram. El agendamiento (SPEC-004) queda en evaluación.
- DEC-P05. Cada fórmula tiene un número de identificación, que es la llave para buscarla en la EPS simulada.
- DEC-P08. Una fórmula coincide con la EPS simulada si: (a) su número existe, (b) pertenece al paciente verificado y (c) los medicamentos leídos son los que la EPS tiene para ese número.
- DEC-P09. Con una sola historia clínica: si trae un diagnóstico, aplica a todas las fórmulas; si trae varios, cada fórmula usa el diagnóstico que la EPS simulada asocia a su número. Si la historia no trae diagnóstico, cuenta como documento incompleto.
- DEC-P11. Un medicamento PBS es apto sin autorización; uno no PBS solo es apto si está autorizado en la EPS simulada.
- DEC-P12. El número de fórmula de la EPS simulada imita el número de prescripción MIPRES (numérico, 20 dígitos) y guarda con él el paciente, la fecha, el diagnóstico CIE-10 y los medicamentos.
- DEC-P13. La cita posible de una fórmula crónica es el primer día hábil siguiente a la prevalidación: se saltan domingos y festivos de Colombia. Los festivos salen de un catálogo configurable por año.
- DEC-P16. Una fórmula clasificada como crónica sin fecha habilitada registrada en la EPS simulada queda no apta y se orienta a la atención presencial. Responde a OPEN-Q-003.
- DEC-P17. Si el indicador PBS de la fórmula y el catálogo simulado de cobertura difieren, manda el catálogo. Responde a OPEN-Q-004.
- DEC-P18. En pruebas, el rechazo de un celular o correo fuera de la lista del equipo lo hace el entorno de pruebas; no es una regla del producto. La forma de hacerlo es tema de arquitectura. Responde a OPEN-Q-005.
- DEC-P19. Si el catálogo de festivos no tiene el año necesario, no se emite resultado para la fórmula crónica afectada, se muestra un error de sistema y se registra. El catálogo debe tener cargado también el año siguiente. Responde a OPEN-Q-006.

### 3. Alcance
- Provisión de datos de paciente y fórmula por la EPS simulada con estructura MIPRES (20 dígitos).
- Consulta de catálogo simulado de cobertura PBS y catálogo de diagnósticos crónicos.
- Consulta de catálogo configurable de festivos de Colombia por año (requiriendo año en curso y año siguiente).
- Contenido configurable por EPS para autorizaciones y orientación de actualización de datos.
- Uso exclusivo de datos de prueba del equipo con fórmulas de prueba vigentes entre 8 y 9 meses tras la consulta.
- Mecanismo para provocar cambios de estado en la EPS simulada durante las pruebas.
- Registro de eventos de prevalidación y transacciones para métricas de evaluación, con disociación de la identidad tras revocación (SPEC-001/RF-009).
- [Fuera del alcance de DEC-P01 en el MVP]: Configuración activa de puntos de dispensación, ventanas, capacidad, inventario, catálogo de motivos de no entrega, HU-011, acciones de cancelación/notificación de citas asociadas a cambios provocados y métricas de agendamiento/atención en punto (se mantienen especificados en la SPEC para fases posteriores).

### 4. Actores e historias de usuario
Actores: paciente, facilitador comunitario, persona que actúa por el paciente (cuidador, tutor o familiar), dispensador. (Sistemas externos simulados: EPS simulada, inventario simulado).
- HU-010. Como paciente (o persona que actúa por él / facilitador comunitario), quiero que el sistema valide la información de mis fórmulas MIPRES, diagnósticos y cobertura en los catálogos y EPS simulada, para conocer de forma anticipada la validez preliminar de mis medicamentos. Origen: necesidad, contexto 2.3 y 3.3.
- HU-011. Como dispensador, quiero consultar el catálogo oficial de motivos de no entrega y los datos simulados de dispensación, para registrar adecuadamente la validación oficial en el punto cuando aplique la fase presencial. (Nota: Fuera del alcance del MVP por DEC-P01). Origen: necesidad y contexto 2.3, 3.7.

### 5. Requisitos funcionales
- RF-075. El sistema debe consultar a la EPS simulada los datos del paciente identificándolo por su cédula, retornando cédula, EPS a la que pertenece, estado de afiliación (activa/inactiva), número de celular registrado y correo electrónico registrado (si existe). Origen: necesidad y contexto 3.2.
- RF-076. El sistema debe consultar a la EPS simulada la información de cada fórmula utilizando un número numérico de 20 dígitos (tipo MIPRES) como llave de identificación, obteniendo el paciente asociado, fecha de prescripción, diagnóstico principal CIE-10, lista de medicamentos prescritos (según DEC-P12), la fecha límite de vigencia de la fórmula (origen: contexto 3.4), el indicador de cobertura PBS por medicamento y estado de autorización por medicamento (origen: contexto 3.4, DEC-P11), y la fecha habilitada de entrega si está registrada en la EPS simulada (origen: necesidad, contexto 3.4, T-036). El sistema obtiene la fecha habilitada sin depender de la clasificación de agudo/crónico, y solo la utiliza en la prevalidación si la fórmula es clasificada como crónica. Si una fórmula es clasificada como crónica por el sistema y no tiene fecha habilitada registrada en la EPS simulada, la fórmula queda no apta y se orienta a la atención presencial (origen: DEC-P16). Si el indicador de cobertura PBS de la fórmula devuelto por la EPS simulada difiere del catálogo simulado de cobertura PBS, prevalece la indicación del catálogo simulado (origen: DEC-P17). Origen: necesidad, contexto 3.4, DEC-P05, DEC-P08, DEC-P09, DEC-P12, DEC-P16, DEC-P17, T-036.
- RF-077. El sistema debe verificar si cada medicamento de la fórmula está cubierto por el PBS mediante el catálogo simulado de cobertura PBS (el cual prevalece sobre el indicador individual de la fórmula devuelto por la EPS simulada en caso de discrepancia), determinando que un medicamento PBS no requiere autorización y un medicamento no PBS requiere estar autorizado en la EPS simulada para ser apto. Origen: necesidad, contexto 3.4, DEC-P11 y DEC-P17.
- RF-078. El sistema debe clasificar el tratamiento de una fórmula como agudo o crónico comparando el código de diagnóstico CIE-10 asignado a la fórmula contra el catálogo configurable de diagnósticos crónicos. El diagnóstico asignado corresponde al único diagnóstico de la historia clínica cuando esta contiene solo uno, o al diagnóstico que la EPS simulada asocia al número de prescripción de la fórmula cuando la historia clínica contiene varios diagnósticos. Si el diagnóstico asignado figura en el catálogo de crónicos se clasifica como crónico, y en caso contrario como agudo. Origen: necesidad, contexto 3.4, DEC-P09 y SPEC-003/RF-023.
- RF-079. El sistema debe permitir definir y almacenar para cada punto de dispensación ficticio su horario de atención, ventanas de 1 hora, capacidad máxima de citas por ventana e inventario de existencias por medicamento. (Nota: Fuera del alcance del MVP por DEC-P01). Origen: necesidad y contexto 3.5, 3.8.
- RF-080. El sistema debe proveer contenido configurable por cada EPS que contenga la información oficial de puntos de atención presencial, enlaces o trámites de autorización y la guía de orientación para actualización de datos del afiliado. Origen: necesidad y contexto 3.4, 3.8.
- RF-081. El sistema debe disponer del catálogo aprobado de motivos de no entrega para el registro de novedades durante la validación presencial en punto. (Nota: Fuera del alcance del MVP por DEC-P01). Origen: necesidad y contexto 3.7.
- RF-082. El sistema debe permitir provocar modificaciones de prueba en los datos de la EPS simulada (afiliación, vigencia de fórmula o estado de autorizaciones) antes de una cita o prevalidación, permitiendo verificar que la prevalidación del sistema detecte dichos cambios y ejecute las acciones correspondientes (las acciones de cancelación de citas y notificación de citas asociadas están fuera del alcance del MVP por DEC-P01). Origen: necesidad y DEC-010.
- RF-083. El sistema debe registrar los eventos transaccionales y de prevalidación requeridos para las métricas de evaluación (tiempo estimado de espera, desplazamientos evitados, novedades detectadas antes del desplazamiento, tasa de éxito por tarea, sobre-reservas en cero y escenarios asistidos), incluyendo resultados de prevalidación por fórmula (las métricas y eventos sobre confirmación/cancelación/expiración de citas, llegadas/cierres por medicamento, sobre-reservas y atención en punto están fuera del alcance del MVP por DEC-P01). Los registros de eventos conservados tras una revocación de consentimiento deben quedar disociados de la identidad, según SPEC-001/RF-009, sin inventar campos adicionales. Origen: necesidad, DEC-011, DEC-P01 y SPEC-001/RF-009.
- RF-084. El sistema debe mantener un catálogo configurable de festivos de Colombia por año para determinar los días no hábiles (domingos y festivos) utilizados en el cálculo del primer día hábil siguiente para fórmulas crónicas. El catálogo debe tener cargado el año en curso y el año siguiente. Si al prevalidar una fórmula crónica el catálogo no tiene configurado el año necesario para calcular la cita posible, el sistema no emite resultado para la fórmula crónica afectada, muestra un error de sistema y registra el evento. Origen: DEC-P13 y DEC-P19.

### 6. Requisitos no funcionales
- RNF-017. Privacidad y datos de prueba. Los conjuntos de datos de prueba del sistema deben utilizar única y exclusivamente números de teléfono celular y correos electrónicos pertenecientes a los integrantes del equipo con su consentimiento explícito, estando estrictamente prohibido el uso de datos de pacientes reales. Origen: necesidad y contexto 3.2. Se verifica con: auditoría directa de la base de datos de prueba y de las configuraciones de prueba; verificado por AC-049.
- RNF-018. Registro de métricas de prevalidación. El sistema debe almacenar el registro de eventos transaccionales de prevalidación y uso para permitir el cálculo de métricas de desplazamientos evitados, novedades detectadas antes del desplazamiento y tasa de éxito por tarea, asegurando la disociación de la identidad tras una revocación según SPEC-001/RF-009. Origen: DEC-011, DEC-P01 y SPEC-001/RF-009. Se verifica con: inspección de logs y auditoría de eventos de prevalidación; verificado por AC-042.

### 7. Reglas de negocio
- BR-025. Evaluación de vigencia de fórmulas y datos de prueba. Una fórmula médica es preliminarmente vigente si y solo si su fecha límite de vigencia provista por la EPS simulada es mayor o igual a la fecha de prevalidación en que se realiza la consulta. Las fórmulas del conjunto de datos de prueba deben configurarse con vigencias comprendidas estrictamente entre 8 y 9 meses posteriores a la fecha de consulta médica simulada. Origen: necesidad y contexto 3.4.
- BR-026. Aprobación preliminar por PBS y autorización. Un medicamento de una fórmula se considera preliminarmente apto si figura como cubierto por el PBS en el catálogo simulado (independientemente de autorización) o si figurando como no PBS en el catálogo cuenta con estado autorizado en la EPS simulada. Si un medicamento no PBS según el catálogo carece de autorización, la fórmula no es apta. Origen: contexto 3.4, DEC-P11 y DEC-P17.
- BR-027. Días hábiles y catálogo de festivos. El cálculo de la fecha hábil siguiente para prevalidación y agendamiento de fórmulas crónicas debe excluir los días domingos y las fechas incluidas en el catálogo de festivos de Colombia del año correspondiente. El catálogo debe incluir el año en curso y el año siguiente. Si al prevalidar una fórmula crónica falta la configuración del año requerido, no se emite resultado de prevalidación para la fórmula crónica afectada, se despliega un error de sistema y se registra la novedad. Origen: DEC-P13 y DEC-P19.

### 8. Flujo principal
1. El sistema recibe una solicitud de prevalidación o consulta referente a una solicitud de paciente y sus fórmulas de 20 dígitos.
2. El sistema verifica la afiliación activa del paciente en la EPS simulada; si el estado de afiliación es inactivo, se detiene toda la solicitud y se orienta hacia la EPS.
3. El sistema evalúa la vigencia de la fórmula consultando la fecha límite de vigencia provista por la EPS simulada frente a la fecha de prevalidación (si no está vigente, se indica que requiere nueva valoración médica).
4. El sistema verifica la cobertura PBS de cada medicamento de la fórmula consultando el catálogo simulado de cobertura PBS (prevaleciendo sobre el indicador de la fórmula en caso de discrepancia).
5. El sistema verifica el estado de autorización de cada medicamento de la fórmula en la EPS simulada (si un medicamento no PBS carece de autorización, la fórmula no es apta).
6. El sistema evalúa la fecha habilitada de entrega exclusivamente para fórmulas crónicas (el tratamiento se clasifica comparando el diagnóstico con el catálogo de diagnósticos crónicos); si la fórmula es crónica y no tiene fecha habilitada registrada en la EPS simulada, queda no apta y se orienta a la atención presencial, y si requiere cálculo de fecha hábil, consulta el catálogo de festivos de Colombia (si falta el año requerido, suspende el resultado de la fórmula afectada, muestra error de sistema y lo registra).
7. El sistema registra el evento de prevalidación y resultado en el registro de auditoría y métricas, garantizando la disociación de la identidad en caso de revocación (SPEC-001/RF-009).

### 9. Flujos alternativos y de excepción
- A1. Cambio de estado en pruebas: Durante una sesión de prueba se provoca una modificación en los datos de la EPS simulada (por ejemplo, afiliación inactiva o fórmula vencida). Al ejecutarse la nueva prevalidación, el sistema detecta el cambio en la EPS simulada y actualiza el resultado de prevalidación correspondiente. (Nota: Las acciones de cancelación de cita y notificación de cita asociadas a este flujo están fuera del alcance del MVP por DEC-P01). Origen: DEC-010.
- E1. Intento de uso de datos de prueba no autorizados: Si en un entorno de pruebas se intenta ejecutar una verificación o envío utilizando un número de celular o correo que no pertenezca a la lista autorizada del equipo de proyecto, el entorno de pruebas rechaza la operación. Origen: RNF-017 y DEC-P18.

### 10. Casos límite
- CL-019. Vigencia en la EPS simulada vencida antes de la prevalidación: Si una fórmula tiene una fecha límite de vigencia menor a la fecha actual de prevalidación, el sistema la declara como no vigente e indica que requiere nueva valoración médica. Origen: necesidad y contexto 3.4. Verificado por: AC-045.
- CL-020. Prevalidación de fórmula crónica en día previo a festivo oficial: Si la prevalidación de una fórmula crónica se realiza un sábado o previo a un festivo registrado en el catálogo de festivos de Colombia, el cálculo de la fecha posible omite los días no hábiles y asigna el primer día hábil siguiente. Origen: DEC-P13. Verificado por: AC-043.

### 11. Criterios de aceptación
- AC-034. Dado un paciente consultado en la EPS simulada por su número de cédula, cuando el sistema realiza la consulta, entonces retorna la cédula, el nombre de la EPS, estado de afiliación (activa/inactiva), el teléfono celular registrado y el correo electrónico registrado si existe. Origen: RF-075.
- AC-035. Dado un número de fórmula de 20 dígitos existente en la EPS simulada, cuando el sistema realiza la consulta por ese número, entonces retorna el paciente asociado, fecha de prescripción, diagnóstico principal CIE-10, lista de medicamentos, fecha límite de vigencia, indicador PBS por medicamento, estado de autorización por medicamento y la fecha habilitada de entrega si está registrada. Origen: RF-076, BR-025.
- AC-036. Dado un medicamento prescrito en una fórmula figurando como 'cubierto' en el catálogo simulado de cobertura PBS, cuando se evalúa su aptitud preliminar en la prevalidación, entonces el sistema lo determina como apto sin requerir estado de autorización. Origen: RF-077, BR-026, DEC-P17.
- AC-037. Dado el código de diagnóstico CIE-10 asignado a una fórmula (proveniente de la historia clínica si es único, o del registro de la EPS simulada si la historia trae varios), cuando el sistema lo compara contra el catálogo de diagnósticos crónicos, entonces clasifica el tratamiento como crónico si el código figura en el catálogo o como agudo en caso contrario. Origen: RF-078.
- AC-038. Dado un punto de dispensación ficticio en la configuración del sistema, cuando se consultan sus parámetros, entonces el sistema retorna su horario, capacidad por ventanas de 1 hora e inventario por medicamento. (Nota: Fuera del alcance del MVP por DEC-P01). Origen: RF-079.
- AC-039. Dada una EPS configurada en el sistema, cuando se requiere informar al usuario sobre autorizaciones o actualización de datos, entonces el sistema provee los enlaces, puntos de atención presencial y guía de trámites configurados para esa EPS. Origen: RF-080.
- AC-040. Dado el catálogo de motivos de no entrega, cuando el dispensador registra una no entrega en el punto, entonces el sistema despliega las opciones oficiales (afiliación inactiva, fórmula vencida, autorización no vigente, medicamento no cubierto, datos no coinciden, sin existencias, otro). (Nota: Fuera del alcance del MVP por DEC-P01). Origen: RF-081.
- AC-041. Dado un cambio provocado en el estado de una fórmula o afiliación en la EPS simulada durante las pruebas, cuando el sistema ejecuta la nueva prevalidación, entonces detecta el nuevo estado y actualiza el resultado de prevalidación en consecuencia. Origen: RF-082.
- AC-042. Dado un flujo de prevalidación completado, cuando finaliza el procesamiento, entonces el sistema almacena el registro del evento transaccional con el resultado de la prevalidación y las novedades detectadas, garantizando que tras una revocación de consentimiento los registros conservados queden disociados de la identidad (SPEC-001/RF-009) sin inventar campos adicionales. Origen: RF-083, RNF-018, SPEC-001/RF-009.
- AC-043. Dado el año en curso y el catálogo de festivos de Colombia configurado, cuando se calcula el primer día hábil siguiente para una fórmula crónica prevalidada en sábado antes de un lunes festivo, entonces el sistema retorna la fecha del martes siguiente. Origen: RF-084, BR-027.
- AC-044. Dado un número de prescripción de 20 dígitos que no existe en la EPS simulada, cuando el sistema realiza la consulta, entonces retorna que la fórmula no fue encontrada. Origen: RF-076, DEC-P08.
- AC-045. Dada una fórmula en la EPS simulada cuya fecha límite de vigencia es menor que la fecha actual de prevalidación, cuando el sistema evalúa su vigencia, entonces determina que la fórmula está vencida y requiere nueva valoración médica. Origen: RF-076, BR-025, CL-019.
- AC-046. Dada una fórmula en la EPS simulada cuya fecha límite de vigencia es exactamente igual a la fecha actual de prevalidación, cuando el sistema evalúa su vigencia, entonces confirma que la fórmula se encuentra vigente. Origen: RF-076, BR-025.
- AC-047. Dado un medicamento prescrito figurando como 'no cubierto' en el catálogo simulado de cobertura PBS y con estado 'Autorizado' en la EPS simulada, cuando se evalúa su aptitud preliminar, entonces el sistema lo determina como apto. Origen: RF-077, BR-026, DEC-P17.
- AC-048. Dado un medicamento prescrito figurando como 'no cubierto' en el catálogo simulado de cobertura PBS y con estado 'No autorizado' (o sin autorización) en la EPS simulada, cuando se evalúa su aptitud preliminar, entonces el sistema determina que la fórmula es no apta. Origen: RF-077, BR-026, DEC-P17.
- AC-049. Dado un entorno de pruebas configurado con los números y correos autorizados del equipo, cuando se intenta realizar un envío a un número de celular o correo no incluido en la lista autorizada, entonces el entorno de pruebas rechaza la operación y no se realiza el envío. Origen: RNF-017, E1, DEC-P18.
- AC-050. Dada una fórmula clasificada como crónica que no tiene fecha habilitada de entrega registrada en la EPS simulada, cuando el sistema realiza la prevalidación, entonces determina que la fórmula es no apta y orienta a la atención presencial. Origen: RF-076, DEC-P16.
- AC-051. Dado un medicamento cuyo indicador PBS en la fórmula difiere de su clasificación en el catálogo simulado de cobertura PBS, cuando el sistema evalúa la cobertura PBS en la prevalidación, entonces prevalece la indicación del catálogo simulado de cobertura PBS sobre el indicador de la fórmula. Origen: RF-076, RF-077, DEC-P17.
- AC-052. Dada una prevalidación de fórmula crónica que requiere consultar un año no cargado en el catálogo de festivos de Colombia, cuando el sistema realiza el cálculo del primer día hábil siguiente, entonces no emite resultado para la fórmula crónica afectada, despliega un error de sistema y registra el evento de error. Origen: RF-084, BR-027, DEC-P19.

### 12. Dependencias
- EPS simulada (fuente de datos de paciente y fórmula MIPRES de 20 dígitos).
- Inventario simulado (fuente de existencias por punto).
- Catálogos configurables de diagnósticos crónicos, cobertura PBS, festivos de Colombia y motivos de no entrega.

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
- Funcionalidades de agendamiento, ventanas, inventario y validación presencial en punto dentro de la fase MVP. Origen: DEC-P01.
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
- OPEN-Q-007. Pregunta H-003/PREG-020: ¿Qué resultado tiene un medicamento que no figura en el catálogo simulado de cobertura PBS?
  Por qué importa: define el comportamiento y la regla de negocio ante medicamentos ausentes en el catálogo.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-008. Pregunta H-005/PREG-022: ¿Qué pasa si la EPS simulada o un catálogo falla durante la prevalidación?
  Por qué importa: define la resiliencia y el manejo de errores del sistema ante caídas de fuentes simuladas.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo

### 16. Trazabilidad
- HU-010: RF-075, RF-076, RF-077, RF-078, RF-080, RF-082, RF-083, RF-084; RNF-017, RNF-018; BR-025, BR-026, BR-027; AC-034, AC-035, AC-036, AC-037, AC-039, AC-041, AC-042, AC-043, AC-044, AC-045, AC-046, AC-047, AC-048, AC-049, AC-050, AC-051, AC-052; CL-019, CL-020.
- HU-011: RF-079, RF-081; AC-038, AC-040.
- RF-075: Origen: necesidad y contexto 3.2; verificado por AC-034.
- RF-076: Origen: necesidad, contexto 3.4, DEC-P05, DEC-P08, DEC-P09, DEC-P12, DEC-P16, DEC-P17, T-036; verificado por AC-035, AC-044, AC-045, AC-046, AC-050, AC-051.
- RF-077: Origen: necesidad, contexto 3.4, DEC-P11 y DEC-P17; verificado por AC-036, AC-047, AC-048, AC-051.
- RF-078: Origen: necesidad, contexto 3.4, DEC-P09 y SPEC-003/RF-023; verificado por AC-037.
- RF-079: Origen: necesidad y contexto 3.5, 3.8; verificado por AC-038.
- RF-080: Origen: necesidad y contexto 3.4, 3.8; verificado por AC-039.
- RF-081: Origen: necesidad y contexto 3.7; verificado por AC-040.
- RF-082: Origen: necesidad y DEC-010; verificado por AC-041.
- RF-083: Origen: necesidad, DEC-011, DEC-P01 y SPEC-001/RF-009; verificado por AC-042.
- RF-084: Origen: DEC-P13 y DEC-P19; verificado por AC-043, AC-052.
- RNF-017: Origen: necesidad y contexto 3.2; verificado con auditoría directa de la base de datos de prueba y configuraciones de prueba; verificado por AC-049.
- RNF-018: Origen: DEC-011, DEC-P01 y SPEC-001/RF-009; verificado con inspección de logs y auditoría de eventos de prevalidación; verificado por AC-042.
- BR-025: Origen: necesidad y contexto 3.4; verificado por AC-035, AC-045, AC-046.
- BR-026: Origen: contexto 3.4, DEC-P11 y DEC-P17; verificado por AC-036, AC-047, AC-048, AC-051.
- BR-027: Origen: DEC-P13 y DEC-P19; verificado por AC-043, AC-052.
- CL-019: Origen: necesidad y contexto 3.4; verificado por AC-045.
- CL-020: Origen: DEC-P13; verificado por AC-043.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y del contexto.
- Versión 1.0: incorporación de las respuestas del equipo a OPEN-Q-001 y OPEN-Q-002, definición de eventos para métricas específicas y exclusión del mecanismo de arquitectura.
- Versión 1.1: incorporación de decisiones globales DEC-P01, DEC-P05, DEC-P08, DEC-P09, DEC-P11, DEC-P12 y DEC-P13. Solución a los hallazgos T-002, T-006, T-034, T-035, T-036 y T-037.
- Versión 1.2: actualización a estado Candidata aplicando observaciones de la revisión. Alineación de RF-078, paso 4 del flujo y AC-037 con DEC-P09 y SPEC-003/RF-023. Ajuste de RF-076, paso 3 del flujo y modelo de dominio por T-036. Registro de OPEN-Q-004 sobre la fuente prevalente de cobertura PBS. Delimitación de componentes fuera de alcance MVP. Adición de AC-044, AC-045, AC-046 y AC-049. División de AC-036 en tres criterios. Registro de OPEN-Q-005 para E1 y OPEN-Q-006 para catálogo de festivos. Descripción exacta de DEC-P12.
- Versión 1.3: publicación en estado Candidata aplicando DEC-P16, DEC-P17, DEC-P18 y DEC-P19. Definición de resultado no apto para fórmulas crónicas sin fecha habilitada (DEC-P16, AC-050). Establecimiento de prevalencia del catálogo simulado de cobertura PBS sobre el indicador de la fórmula y reescritura de AC-036, AC-047 y AC-048 más adición de AC-051 (DEC-P17). Asignación del rechazo en pruebas al entorno de pruebas exclusivamente y derivación de su mecanismo a arquitectura (DEC-P18, E1, AC-049). Inclusión de la exigencia del año siguiente en festivos y manejo de fallo por año faltante (DEC-P19, RF-084, BR-027, AC-052). Corrección del título de Análisis de impacto y eliminación de DEC-P12 como origen de BR-025 y CL-019.
- Versión 1.4: actualización a estado Candidata aplicando el informe de revisión estricta. Reestructuración del flujo principal al orden estricto de SPEC-003/RF-024 (afiliación, vigencia, cobertura PBS, autorización y fecha habilitada de crónicas), incorporando la evaluación de afiliación con detención de solicitud y la de vigencia (H-001, H-002). Inclusión de exigencia de disociación de la identidad en registros de eventos tras revocación según SPEC-001/RF-009 en modelo de dominio, RF-083, RNF-018 y AC-042 sin inventar campos (H-006). Registro como OPEN-Q pendientes de H-003/PREG-020 y H-005/PREG-022. Actualización de trazabilidad, análisis de impacto, historial y verificación.

## Verificación
- Completitud: cumple. Se verificaron y aplicaron las correcciones del flujo principal (orden estricto de afiliación, vigencia, PBS, autorización y fecha habilitada), la disociación de la identidad en registros de eventos tras revocación (SPEC-001/RF-009) y el registro de las preguntas H-003/PREG-020 y H-005/PREG-022 como OPEN-Q pendientes.
- Consistencia interna: cumple. Se comprobó que el flujo principal (sección 8) sigue estrictamente el orden de SPEC-003/RF-024, evaluando afiliación, vigencia, cobertura PBS, autorización y fecha habilitada en orden correcto, y que las reglas de negocio, requisitos y criterios de aceptación son coherentes entre sí.
- Consistencia con el contexto: cumple. Se verificó que la SPEC se mantiene alineada con las secciones 2.3, 3.2, 3.4, 3.5, 3.7, 3.8, 3.10 y 3.11 del contexto de Pharma Express y con SPEC-001/RF-009.
- No ambigüedad: cumple. Los flujos de validación, las reglas de disociación de eventos y el manejo de excepciones se encuentran expresados de forma inequívoca.
- Verificabilidad: cumple. Todos los criterios de aceptación (AC-034 a AC-052) emplean el formato Dado/Cuando/Entonces con resultados observables y verificables.
- Cobertura de actores: cumple. Se contemplan las historias de usuario del paciente, facilitador comunitario, persona que actúa por el paciente y dispensador.
- Cobertura de AC: cumple. Todos los RF, RNF, BR y CL cuentan con criterios de aceptación observables trazados en la sección 16.
- Trazabilidad: cumple. Se actualizó la sección 16 verificando que cada elemento contenga sus orígenes precisos y sus correspondientes ACs de verificación.
- No invención: cumple. Se tomaron exactamente las reglas estipuladas en el contexto, decisiones y directrices del informe sin inventar campos ni comportamientos no autorizados.
- Delimitación: cumple. Se identificaron adecuadamente las exclusiones de negocio y se agregaron en la sección 14 los temas de arquitectura correspondientes.

## Siguiente paso
La SPEC-008 versión 1.4 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
