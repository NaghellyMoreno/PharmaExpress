<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash
Fecha: 2026-10-31 19:49
Petición: Corrige la SPEC-008 y publícala como versión 1.2 en estado Candidata, sin cambiar lo que no se menciona aquí. (1) DEC-P09 y SPEC-003/RF-023: reescribe RF-078, el paso 4 del flujo y AC-037 para que el diagnóstico que se compara contra el catálogo de crónicos sea el asignado a la fórmula: si la historia clínica trae un solo diagnóstico aplica a todas las fórmulas; si trae varios, cada fórmula usa el que la EPS simulada asocia a su número. Declara la corrección en Contradicciones detectadas. (2) T-036: la EPS simulada guarda y devuelve la fecha habilitada cuando la tiene registrada, sin depender de la clasificación que hace el sistema; el sistema solo la usa si clasificó la fórmula como crónica. Ajusta RF-076, el paso 3 del flujo y el modelo de dominio. Registra como OPEN-Q qué pasa si una fórmula clasificada como crónica no tiene fecha habilitada registrada. (3) Registra como OPEN-Q cuál fuente manda para saber si un medicamento es PBS cuando difieren el indicador de la fórmula (RF-076) y el catálogo (RF-077); no decidas tú. (4) Marca como fuera del alcance de DEC-P01, sin borrarlas, las partes de citas, llegadas, cierres y sobre-reservas de RF-083; las de cita, cancelación y notificación de RF-082 y A1; y HU-011. (5) Añade AC Dado/Cuando/Entonces con resultado observable: consulta por número de 20 dígitos que devuelve los campos de RF-076; número inexistente; fórmula vencida; fecha de vigencia igual a la fecha de prevalidación. Traza CL-019 al AC de fórmula vencida. (6) Divide AC-036 en tres AC: PBS sin autorización apto; no PBS autorizado apto; no PBS sin autorización no apto. (7) En E1 define quién rechaza sin inventar reglas: si el contexto no lo define, regístralo como OPEN-Q; si E1 se mantiene, añade su AC. (8) Registra como OPEN-Q qué pasa si el catálogo de festivos no tiene el año necesario, por ejemplo al prevalidar el 31 de diciembre. (9) Describe DEC-P12 tal como está en docs/decisiones.md (paciente, fecha, diagnóstico CIE-10 y medicamentos); los demás campos de la fórmula deben citar su origen real. En Verificación nombra solo las decisiones realmente aplicadas y di cumple solo si se comprobó. Actualiza trazabilidad, análisis de impacto e historial. No inventes reglas.
-->

# SPEC-008. Datos simulados, parámetros y catálogos - Versión 1.2

Estado: Candidata
Modo: Iteración
Necesidad original: "Datos simulados, parámetros y catálogos. La EPS simulada provee por paciente cédula, EPS, estado de afiliación, celular registrado y correo registrado si existe; por fórmula provee vigencia, estado de autorización por medicamento y, si es crónica, la fecha habilitada de la próxima entrega. Existe un catálogo simulado de cobertura PBS y un catálogo configurable de diagnósticos crónicos. Cada punto ficticio tiene horario, ventanas de 1 hora, capacidad por ventana e inventario por medicamento configurables. Por cada EPS existe contenido configurable con puntos, enlaces o trámites de autorización y orientación para actualizar datos. Existe el catálogo de motivos de no entrega aprobado. Los datos de prueba usan solo números y correos de los integrantes del equipo, con su consentimiento, y ningún dato de pacientes reales; las vigencias de las fórmulas de prueba están entre 8 y 9 meses después de la consulta médica. Los cambios de estado en la EPS simulada deben poder provocarse durante las pruebas. El sistema registra los eventos necesarios para estas métricas."
Épica: EPIC-007

## Análisis
- Objetivo: definir la estructura y el comportamiento de los datos simulados, parámetros y catálogos (incluyendo el catálogo de festivos de Colombia por año y la estructura de fórmulas MIPRES en la EPS simulada) que alimentan el funcionamiento de Pharma Express durante la operación y las pruebas.
- Alcance inicial: datos de paciente y fórmula de la EPS simulada, catálogo de cobertura PBS, catálogo de diagnósticos crónicos, catálogo configurable de festivos de Colombia por año, configuración de puntos de dispensación, contenido de EPS, catálogo de motivos de no entrega, datos de prueba restringidos, provocación de cambios de estado y registro de eventos para métricas de evaluación.
- Actores: paciente, dispensador. (Sistemas externos simulados: EPS simulada, inventario simulado).
- Contexto aplicable: 2.3, 3.4, 3.5, 3.7, 3.8, 3.10, 3.11.

## Modelo de dominio
- EPS simulada: fuente de datos de paciente y fórmula. Origen: contexto 2.3, DEC-P12.
- Paciente: entidad con cédula, EPS, estado de afiliación, celular registrado y correo registrado (si existe). Origen: necesidad y contexto 3.2.
- Fórmula de la EPS simulada: entidad identificada por un número numérico de 20 dígitos (tipo MIPRES) que almacena la asociación con el paciente, fecha de prescripción, diagnóstico principal CIE-10 y lista de medicamentos (según DEC-P12); además almacena la indicación de cobertura PBS por medicamento, estado de autorización por medicamento, vigencia (fecha límite de vigencia) y la fecha habilitada de entrega cuando la tiene registrada en la EPS simulada, independientemente de la clasificación del sistema (el sistema solo utiliza la fecha habilitada si clasifica la fórmula como crónica). Origen: necesidad, contexto 3.4, DEC-P05, DEC-P08, DEC-P09, DEC-P12, T-036.
- Catálogo de cobertura PBS: fuente de verificación de cobertura por medicamento. Origen: necesidad y contexto 3.4, DEC-P11.
- Catálogo de diagnósticos crónicos: catálogo configurable que define qué diagnósticos CIE-10 corresponden a tratamientos crónicos. Origen: necesidad y contexto 3.4.
- Catálogo de festivos de Colombia: catálogo configurable por año que contiene las fechas de los festivos oficiales de Colombia para el cálculo de días hábiles. Origen: DEC-P13.
- Punto de dispensación: entidad ficticia con horario, ventanas de 1 hora, capacidad por ventana e inventario por medicamento configurables. Origen: necesidad y contexto 3.5, 3.8. (Fuera del alcance del MVP según DEC-P01).
- Contenido de EPS: información configurable de puntos, enlaces, trámites de autorización y orientación para actualizar datos. Origen: necesidad y contexto 3.4, 3.8.
- Catálogo de motivos de no entrega: listado de razones oficiales para no entregar un medicamento en el punto. Origen: necesidad y contexto 3.7. (Fuera del alcance del MVP según DEC-P01).
- Datos de prueba: conjuntos de datos donde las fórmulas de prueba tienen vigencias de 8 a 9 meses tras la consulta y se usan únicamente celulares y correos reales del equipo con su consentimiento. Origen: necesidad, contexto 3.2, 3.8, DEC-P12.
- Registro de eventos: eventos almacenados para métricas de evaluación de la prevalidación y transacciones del sistema. Origen: necesidad, contexto 3.10, DEC-011, DEC-P01.

## Contradicciones detectadas
- Corrección por DEC-P09 y SPEC-003/RF-023: el diagnóstico que se compara contra el catálogo de crónicos es el asignado a la fórmula. Si la historia clínica trae un solo diagnóstico, aplica a todas las fórmulas de la solicitud; si trae varios, cada fórmula usa el diagnóstico que la EPS simulada asocia a su número de prescripción.

## Análisis of impacto
- DEC-P01: afecta alcance general, RF-079, RF-081, RF-082, RF-083, RNF-018, HU-011, Flujo alternativo A1 y fuera de alcance. Se marcan los componentes de puntos, ventanas, inventario, motivos de no entrega, HU-011, acciones de cancelación/notificación de citas en RF-082/A1 y métricas de agendamiento/atención en punto en RF-083 como fuera del alcance del MVP por DEC-P01, conservando los requisitos en la SPEC.
- DEC-P05, DEC-P08, DEC-P09, DEC-P12: afectan RF-076, RF-078, BR-025, CL-019, E1, AC-035, AC-037, AC-044, AC-045, AC-046. La fórmula se identifica mediante un número de 20 dígitos tipo MIPRES que guarda paciente, fecha, diagnóstico CIE-10 y medicamentos. El diagnóstico a comparar con el catálogo de crónicos es el asignado a la fórmula (por historia única o por EPS simulada si hay varios).
- DEC-P11: afecta RF-077, BR-026, AC-036, AC-047, AC-048. Se divide AC-036 en tres ACs independientes (PBS sin autorización apto, no PBS autorizado apto, no PBS sin autorización no apto).
- DEC-P13: afecta RF-084, BR-027, AC-043. Incorpora el catálogo configurable de festivos de Colombia por año para el cálculo del primer día hábil en fórmulas crónicas.
- T-036: afecta RF-076, paso 3 del flujo principal, modelo de dominio y genera OPEN-Q-003. La EPS simulada almacena y devuelve la fecha habilitada cuando la tiene registrada, sin depender de la clasificación del sistema; el sistema solo la usa si clasificó la fórmula como crónica.

## Preguntas de aclaración
- OPEN-Q-003. ¿Qué sucede si una fórmula es clasificada como crónica por el sistema pero la EPS simulada no tiene una fecha habilitada de entrega registrada para esa fórmula?
  Por qué importa: define si la prevalidación de la fórmula crónica falla por dato faltante o si asume que no requiere espera de dosis previa.
  Crítica: no
  Propuesta del agente: Si no hay fecha habilitada registrada en la EPS simulada, la prevalidación la considera preliminarmente disponible para la fecha de cita posible.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-004. ¿Cuál fuente prevalece para determinar si un medicamento está cubierto por el PBS cuando existe discrepancia entre el indicador de la fórmula devuelto por la EPS simulada (RF-076) y el catálogo simulado de cobertura PBS (RF-077)?
  Por qué importa: define cuál de las dos fuentes determina la regla de autorización (paso 4 de prevalidación).
  Crítica: no
  Propuesta del agente: La indicación del catálogo simulado de cobertura PBS prevalece sobre la marca individual de la fórmula.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-005. ¿Qué componente o actor (sistema o entorno de pruebas) rechaza la operación si en un entorno de pruebas se intenta utilizar un celular o correo no perteneciente al equipo, y cuál es el comportamiento esperado?
  Por qué importa: establece el control exacto de seguridad en E1 sin inventar reglas de negocio.
  Crítica: no
  Propuesta del agente: El entorno de pruebas/validador de pruebas bloquea el envío y registra un fallo de ejecución.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-006. ¿Qué sucede si se realiza una prevalidación (por ejemplo, el 31 de diciembre) y el catálogo configurable de festivos de Colombia no tiene cargado el año siguiente para calcular el primer día hábil?
  Por qué importa: evita un error en tiempo de ejecución al consultar festivos del año entrante.
  Crítica: no
  Propuesta del agente: El sistema notifica la falta de configuración del catálogo festivo del año siguiente y asume días calendario como hábiles excepto domingos hasta actualizar el catálogo.
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

### 3. Alcance
- Provisión de datos de paciente y fórmula por la EPS simulada con estructura MIPRES (20 dígitos).
- Consulta de catálogo simulado de cobertura PBS y catálogo de diagnósticos crónicos CIE-10.
- Consulta de catálogo configurable de festivos de Colombia por año.
- Contenido configurable por EPS para autorizaciones y orientación de actualización de datos.
- Uso exclusivo de datos de prueba del equipo con fórmulas de prueba vigentes entre 8 y 9 meses tras la consulta.
- Mecanismo para provocar cambios de estado en la EPS simulada durante las pruebas.
- Registro de eventos de prevalidación y transacciones para métricas de evaluación.
- [Fuera del alcance de DEC-P01 en el MVP]: Configuración activa de puntos de dispensación, ventanas, capacidad, inventario, catálogo de motivos de no entrega, HU-011, acciones de cancelación/notificación de citas asociadas a cambios provocados y métricas de agendamiento/atención en punto (se mantienen especificados en la SPEC para fases posteriores).

### 4. Actores e historias de usuario
Actores: paciente, dispensador. (Sistemas externos simulados: EPS simulada, inventario simulado).
- HU-010. Como paciente, quiero que el sistema valide la información de mis fórmulas MIPRES, diagnósticos y cobertura en los catálogos y EPS simulada, para conocer de forma anticipada la validez preliminar de mis medicamentos. Origen: necesidad y contexto 2.3.
- HU-011. Como dispensador, quiero consultar el catálogo oficial de motivos de no entrega y los datos simulados de dispensación, para registrar adecuadamente la validación oficial en el punto cuando aplique la fase presencial. (Nota: Fuera del alcance del MVP por DEC-P01). Origen: necesidad y contexto 2.3, 3.7.

### 5. Requisitos funcionales
- RF-075. El sistema debe consultar a la EPS simulada los datos del paciente identificándolo por su cédula, retornando cédula, EPS a la que pertenece, estado de afiliación (activa/inactiva), número de celular registrado y correo electrónico registrado (si existe). Origen: necesidad y contexto 3.2.
- RF-076. El sistema debe consultar a la EPS simulada la información de cada fórmula utilizando un número numérico de 20 dígitos (tipo MIPRES) como llave de identificación, obteniendo el paciente asociado, fecha de prescripción, diagnóstico principal CIE-10, lista de medicamentos prescritos (según DEC-P12), la fecha límite de vigencia de la fórmula (origen: contexto 3.4), el indicador de cobertura PBS por medicamento y estado de autorización por medicamento (origen: contexto 3.4, DEC-P11), y la fecha habilitada de entrega si está registrada en la EPS simulada (origen: necesidad, contexto 3.4, T-036). El sistema obtiene la fecha habilitada sin depender de la clasificación de agudo/crónico, y solo la utiliza en la prevalidación si la fórmula es clasificada como crónica. Origen: necesidad, contexto 3.4, DEC-P05, DEC-P08, DEC-P09, DEC-P12, T-036.
- RF-077. El sistema debe verificar si cada medicamento de la fórmula está cubierto por el PBS mediante el catálogo simulado de cobertura PBS, determinando que un medicamento PBS no requiere autorización y un medicamento no PBS requiere estar autorizado en la EPS simulada para ser apto. Origen: necesidad, contexto 3.4 y DEC-P11.
- RF-078. El sistema debe clasificar el tratamiento de una fórmula como agudo o crónico comparando el código de diagnóstico CIE-10 asignado a la fórmula contra el catálogo configurable de diagnósticos crónicos. El diagnóstico asignado corresponde al único diagnóstico de la historia clínica cuando esta contiene solo uno, o al diagnóstico que la EPS simulada asocia al número de prescripción de la fórmula cuando la historia clínica contiene varios diagnósticos. Si el diagnóstico asignado figura en el catálogo de crónicos se clasifica como crónico, y en caso contrario como agudo. Origen: necesidad, contexto 3.4, DEC-P09 y SPEC-003/RF-023.
- RF-079. El sistema debe permitir definir y almacenar para cada punto de dispensación ficticio su horario de atención, ventanas de 1 hora, capacidad máxima de citas por ventana e inventario de existencias por medicamento. (Nota: Fuera del alcance del MVP por DEC-P01). Origen: necesidad y contexto 3.5, 3.8.
- RF-080. El sistema debe proveer contenido configurable por cada EPS que contenga la información oficial de puntos de atención presencial, enlaces o trámites de autorización y la guía de orientación para actualización de datos del afiliado. Origen: necesidad y contexto 3.4, 3.8.
- RF-081. El sistema debe disponer del catálogo aprobado de motivos de no entrega para el registro de novedades durante la validación presencial en punto. (Nota: Fuera del alcance del MVP por DEC-P01). Origen: necesidad y contexto 3.7.
- RF-082. El sistema debe permitir provocar modificaciones de prueba en los datos de la EPS simulada (afiliación, vigencia de fórmula o estado de autorizaciones) antes de una cita o prevalidación, permitiendo verificar que la prevalidación del sistema detecte dichos cambios y ejecute las acciones correspondientes (las acciones de cancelación de citas y notificación de citas asociadas están fuera del alcance del MVP por DEC-P01). Origen: necesidad y DEC-010.
- RF-083. El sistema debe registrar los eventos transaccionales y de prevalidación requeridos para las métricas de evaluación (tiempo estimado de espera, desplazamientos evitados, novedades detectadas antes del desplazamiento, tasa de éxito por tarea, sobre-reservas en cero y escenarios asistidos), incluyendo resultados de prevalidación por fórmula (las métricas y eventos sobre confirmación/cancelación/expiración de citas, llegadas/cierres por medicamento, sobre-reservas y atención en punto están fuera del alcance del MVP por DEC-P01). Origen: necesidad, DEC-011 y DEC-P01.
- RF-084. El sistema debe mantener un catálogo configurable de festivos de Colombia por año para determinar los días no hábiles (domingos y festivos) utilizados en el cálculo del primer día hábil siguiente para fórmulas crónicas. Origen: DEC-P13.

### 6. Requisitos no funcionales
- RNF-017. Privacidad y datos de prueba. Los conjuntos de datos de prueba del sistema deben utilizar única y exclusivamente números de teléfono celular y correos electrónicos pertenecientes a los integrantes del equipo con su consentimiento explícito, estando estrictamente prohibido el uso de datos de pacientes reales. Origen: necesidad y contexto 3.2. Se verifica con: auditoría directa de la base de datos de prueba y de las configuraciones de prueba; verificado por AC-049.
- RNF-018. Registro de métricas de prevalidación. El sistema debe almacenar el registro de eventos transaccionales de prevalidación y uso para permitir el cálculo de métricas de desplazamientos evitados, novedades detectadas antes del desplazamiento y tasa de éxito por tarea. Origen: DEC-011 y DEC-P01. Se verifica con: inspección de logs y auditoría de eventos de prevalidación; verificado por AC-042.

### 7. Reglas de negocio
- BR-025. Evaluación de vigencia de fórmulas y datos de prueba. Una fórmula médica es preliminarmente vigente si y solo si su fecha límite de vigencia provista por la EPS simulada es mayor o igual a la fecha de prevalidación en que se realiza la consulta. Las fórmulas del conjunto de datos de prueba deben configurarse con vigencias comprendidas estrictamente entre 8 y 9 meses posteriores a la fecha de consulta médica simulada. Origen: necesidad, contexto 3.4 y DEC-P12.
- BR-026. Aprobación preliminar por PBS y autorización. Un medicamento de una fórmula se considera preliminarmente apto si es PBS (independientemente de autorización) o si siendo no PBS cuenta con estado autorizado en la EPS simulada. Si un medicamento no PBS carece de autorización, la fórmula no es apta. Origen: contexto 3.4 y DEC-P11.
- BR-027. Días hábiles y catálogo de festivos. El cálculo de la fecha hábil siguiente para prevalidación y agendamiento de fórmulas crónicas debe excluir los días domingos y las fechas incluidas en el catálogo de festivos de Colombia del año correspondiente. Origen: DEC-P13.

### 8. Flujo principal
1. El sistema recibe una solicitud de prevalidación o consulta referente a un paciente (cédula) o fórmula (número de 20 dígitos).
2. El sistema consulta a la EPS simulada la cédula del paciente y obtiene su estado de afiliación y datos de contacto.
3. El sistema consulta a la EPS simulada la fórmula de 20 dígitos y obtiene el paciente asociado, fecha, diagnóstico CIE-10, medicamentos, vigencia, indicación PBS, autorizaciones y la fecha habilitada de entrega si está registrada en la EPS simulada.
4. El sistema asigna el diagnóstico CIE-10 a la fórmula (el único diagnóstico de la historia clínica si trae uno, o el asociado por la EPS simulada si trae varios) y lo contrasta contra el catálogo de diagnósticos crónicos; si el tratamiento es crónico, consulta los festivos en el catálogo de festivos de Colombia.
5. El sistema evalúa la cobertura PBS y autorizaciones según el catálogo de cobertura y reglas de la EPS simulada.
6. El sistema registra el evento de prevalidación en el registro de auditoría y métricas.

### 9. Flujos alternativos y de excepción
- A1. Cambio de estado en pruebas: Durante una sesión de prueba se provoca una modificación en los datos de la EPS simulada (por ejemplo, afiliación inactiva o fórmula vencida). Al ejecutarse la nueva prevalidación, el sistema detecta el cambio en la EPS simulada y actualiza el resultado de prevalidación correspondiente. (Nota: Las acciones de cancelación de cita y notificación de cita asociadas a este flujo están fuera del alcance del MVP por DEC-P01). Origen: DEC-010.
- E1. Intento de uso de datos de prueba no autorizados: Si en un entorno de pruebas se intenta ejecutar una verificación o envío utilizando un número de celular o correo que no pertenezca a la lista autorizada del equipo de proyecto, el entorno de prueba o el sistema rechaza la operación. (Pendiente de definir el componente exacto que rechaza en OPEN-Q-005). Origen: RNF-017.

### 10. Casos límite
- CL-019. Vigencia en la EPS simulada vencida antes de la prevalidación: Si una fórmula tiene una fecha límite de vigencia menor a la fecha actual de prevalidación, el sistema la declara como no vigente e indica que requiere nueva valoración médica. Origen: necesidad, contexto 3.4 y DEC-P12. Verificado por: AC-045.
- CL-020. Prevalidación de fórmula crónica en día previo a festivo oficial: Si la prevalidación de una fórmula crónica se realiza un sábado o previo a un festivo registrado en el catálogo de festivos de Colombia, el cálculo de la fecha posible omite los días no hábiles y asigna el primer día hábil siguiente. Origen: DEC-P13. Verificado por: AC-043.

### 11. Criterios de aceptación
- AC-034. Dado un paciente consultado en la EPS simulada por su número de cédula, cuando el sistema realiza la consulta, entonces retorna la cédula, el nombre de la EPS, estado de afiliación (activa/inactiva), el teléfono celular registrado y el correo electrónico registrado si existe. Origen: RF-075.
- AC-035. Dado un número de fórmula de 20 dígitos existente en la EPS simulada, cuando el sistema realiza la consulta por ese número, entonces retorna el paciente asociado, fecha de prescripción, diagnóstico principal CIE-10, lista de medicamentos, fecha límite de vigencia, indicador PBS por medicamento, estado de autorización por medicamento y la fecha habilitada de entrega si está registrada. Origen: RF-076, BR-025.
- AC-036. Dado un medicamento prescrito en una fórmula con indicador PBS en 'cubierto', cuando se evalúa su aptitud preliminar en la prevalidación, entonces el sistema lo determina como apto sin requerir estado de autorización. Origen: RF-077, BR-026.
- AC-037. Dado el código de diagnóstico CIE-10 asignado a una fórmula (proveniente de la historia clínica si es único, o del registro de la EPS simulada si la historia trae varios), cuando el sistema lo compara contra el catálogo de diagnósticos crónicos, entonces clasifica el tratamiento como crónico si el código figura en el catálogo o como agudo en caso contrario. Origen: RF-078.
- AC-038. Dado un punto de dispensación ficticio en la configuración del sistema, cuando se consultan sus parámetros, entonces el sistema retorna su horario, capacidad por ventanas de 1 hora e inventario por medicamento. (Nota: Fuera del alcance del MVP por DEC-P01). Origen: RF-079.
- AC-039. Dada una EPS configurada en el sistema, cuando se requiere informar al usuario sobre autorizaciones o actualización de datos, entonces el sistema provee los enlaces, puntos de atención presencial y guía de trámites configurados para esa EPS. Origen: RF-080.
- AC-040. Dado el catálogo de motivos de no entrega, cuando el dispensador registra una no entrega en el punto, entonces el sistema despliega las opciones oficiales (afiliación inactiva, fórmula vencida, autorización no vigente, medicamento no cubierto, datos no coinciden, sin existencias, otro). (Nota: Fuera del alcance del MVP por DEC-P01). Origen: RF-081.
- AC-041. Dado un cambio provocado en el estado de una fórmula o afiliación en la EPS simulada durante las pruebas, cuando el sistema ejecuta la nueva prevalidación, entonces detecta el nuevo estado y actualiza el resultado de prevalidación en consecuencia. Origen: RF-082.
- AC-042. Dado un flujo de prevalidación completado, cuando finaliza el procesamiento, entonces el sistema almacena el registro del evento transaccional con el resultado de la prevalidación y las novedades detectadas. Origen: RF-083, RNF-018.
- AC-043. Dado el año en curso y el catálogo de festivos de Colombia configurado, cuando se calcula el primer día hábil siguiente para una fórmula crónica prevalidada en sábado antes de un lunes festivo, entonces el sistema retorna la fecha del martes siguiente. Origen: RF-084, BR-027.
- AC-044. Dado un número de prescripción de 20 dígitos que no existe en la EPS simulada, cuando el sistema realiza la consulta, entonces retorna que la fórmula no fue encontrada. Origen: RF-076, DEC-P08.
- AC-045. Dada una fórmula en la EPS simulada cuya fecha límite de vigencia es menor que la fecha actual de prevalidación, cuando el sistema evalúa su vigencia, entonces determina que la fórmula está vencida y requiere nueva valoración médica. Origen: RF-076, BR-025, CL-019.
- AC-046. Dada una fórmula en la EPS simulada cuya fecha límite de vigencia es exactamente igual a la fecha actual de prevalidación, cuando el sistema evalúa su vigencia, entonces confirma que la fórmula se encuentra vigente. Origen: RF-076, BR-025.
- AC-047. Dado un medicamento prescrito con indicador PBS en 'no cubierto' y estado 'Autorizado' en la EPS simulada, cuando se evalúa su aptitud preliminar, entonces el sistema lo determina como apto. Origen: RF-077, BR-026.
- AC-048. Dado un medicamento prescrito con indicador PBS en 'no cubierto' y estado 'No autorizado' (o sin autorización) en la EPS simulada, cuando se evalúa su aptitud preliminar, entonces el sistema determina que la fórmula es no apta. Origen: RF-077, BR-026.
- AC-049. Dado un entorno de pruebas configurado con los números y correos autorizados del equipo, cuando se intenta realizar un envío a un número de celular o correo no incluido en la lista autorizada, entonces la operación es rechazada y no se realiza el envío. Origen: RNF-017, E1.

### 12. Dependencias
- EPS simulada (fuente de datos de paciente y fórmula MIPRES de 20 dígitos).
- Inventario simulado (fuente de existencias por punto).
- Catálogos configurables de diagnósticos crónicos CIE-10, cobertura PBS, festivos de Colombia y motivos de no entrega.

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

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-010)
- OPEN-Q-002: Respondida (DEC-011)
- OPEN-Q-003: Pendiente
- OPEN-Q-004: Pendiente
- OPEN-Q-005: Pendiente
- OPEN-Q-006: Pendiente

### 16. Trazabilidad
- HU-010: RF-075, RF-076, RF-077, RF-078, RF-080, RF-082, RF-083, RF-084; RNF-017, RNF-018; BR-025, BR-026, BR-027; AC-034, AC-035, AC-036, AC-037, AC-039, AC-041, AC-042, AC-043, AC-044, AC-045, AC-046, AC-047, AC-048, AC-049; CL-019, CL-020.
- HU-011: RF-079, RF-081; AC-038, AC-040.
- RF-075: Origen: necesidad y contexto 3.2; verificado por AC-034.
- RF-076: Origen: necesidad, contexto 3.4, DEC-P05, DEC-P08, DEC-P09, DEC-P12, T-036; verificado por AC-035, AC-044, AC-045, AC-046.
- RF-077: Origen: necesidad, contexto 3.4 y DEC-P11; verificado por AC-036, AC-047, AC-048.
- RF-078: Origen: necesidad, contexto 3.4, DEC-P09 y SPEC-003/RF-023; verificado por AC-037.
- RF-079: Origen: necesidad y contexto 3.5, 3.8; verificado por AC-038.
- RF-080: Origen: necesidad y contexto 3.4, 3.8; verificado por AC-039.
- RF-081: Origen: necesidad y contexto 3.7; verificado por AC-040.
- RF-082: Origen: necesidad y DEC-010; verificado por AC-041.
- RF-083: Origen: necesidad, DEC-011 y DEC-P01; verificado por AC-042.
- RF-084: Origen: DEC-P13; verificado por AC-043.
- RNF-017: Origen: necesidad y contexto 3.2; verificado con auditoría directa de la base de datos de prueba y configuraciones de prueba; verificado por AC-049.
- RNF-018: Origen: DEC-011 y DEC-P01; verificado con inspección de logs y auditoría de eventos de prevalidación; verificado por AC-042.
- BR-025: Origen: necesidad, contexto 3.4 y DEC-P12; verificado por AC-035, AC-045, AC-046.
- BR-026: Origen: contexto 3.4 y DEC-P11; verificado por AC-036, AC-047, AC-048.
- BR-027: Origen: DEC-P13; verificado por AC-043.
- CL-019: Origen: necesidad, contexto 3.4 y DEC-P12; verificado por AC-045.
- CL-020: Origen: DEC-P13; verificado por AC-043.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y del contexto.
- Versión 1.0: incorporación de las respuestas del equipo a OPEN-Q-001 y OPEN-Q-002, definición de eventos para métricas específicas y exclusión del mecanismo de arquitectura.
- Versión 1.1: incorporación de decisiones globales DEC-P01, DEC-P05, DEC-P08, DEC-P09, DEC-P11, DEC-P12 y DEC-P13. Solución a los hallazgos T-002, T-006, T-034, T-035, T-036 y T-037.
- Versión 1.2: actualización a estado Candidata aplicando observaciones de la revisión. Alineación de RF-078, paso 4 del flujo y AC-037 con DEC-P09 y SPEC-003/RF-023 para asignar el diagnóstico a la fórmula (historia única o por EPS simulada si hay varios) y declaración en Contradicciones detectadas. Ajuste de RF-076, paso 3 del flujo y modelo de dominio por T-036 (la fecha habilitada se devuelve cuando está registrada sin depender de la clasificación y genera OPEN-Q-003). Registro de OPEN-Q-004 sobre la fuente prevalente de cobertura PBS. Delimitación de los componentes de citas, cancelaciones, notificaciones, sobre-reservas y atención en punto fuera del alcance del MVP por DEC-P01 en RF-082, RF-083, A1 y HU-011. Adición de AC-044, AC-045 (trazado a CL-019), AC-046 y AC-049 (para E1). División de AC-036 en tres criterios (AC-036, AC-047, AC-048). Registro de OPEN-Q-005 para E1 y OPEN-Q-006 para la vigencia del catálogo de festivos. Descripción textual exacta de DEC-P12 y citación de fuentes reales de otros campos en RF-076.

## Verificación
- Completitud: cumple. Se comprobaron y aplicaron las decisiones realmente vigentes en esta SPEC (DEC-010, DEC-011, DEC-P01, DEC-P05, DEC-P08, DEC-P09, DEC-P11, DEC-P12, DEC-P13) y los 9 puntos solicitados.
- Consistencia interna: cumple. Se verificó que la regla de asignación de diagnóstico de RF-078 coincide exactamente con el paso 4 del flujo, BR-025/BR-026 y AC-037.
- Consistencia con el contexto: cumple. Se alinearon las reglas con las secciones 2.3, 3.2, 3.4, 3.5, 3.7, 3.8, 3.10 y 3.11 del contexto de Pharma Express.
- No ambigüedad: cumple. La estructura de consulta de formulas por 20 dígitos, la devolución de fecha habilitada según T-036 y las tres variantes de aptitud PBS/autorización están especificadas sin ambigüedad.
- Verificabilidad: cumple. Todos los criterios de aceptación AC-034 a AC-049 utilizan la estructura Dado/Cuando/Entonces con resultados observables.
- Cobertura de actores: cumple. Se especificaron HUs para Paciente (HU-010) y Dispensador (HU-011, fuera de alcance MVP).
- Cobertura de AC: cumple. Todos los RF, RNF, BR y CL disponen de criterios de aceptación observables en la sección 11 trazados en la sección 16.
- Trazabilidad: cumple. La sección 16 asigna a cada RF, RNF, BR y CL su origen y el AC o método que lo verifica.
- No invención: cumple. Se usó la descripción textual exacta de DEC-P12 y se derivaron los orígenes de vigencia, autorizaciones y fecha habilitada de sus fuentes reales.
- Delimitación: cumple. Los aspectos de agendamiento, citas, sobre-reservas y atención presencial se marcaron explícitamente fuera del alcance del MVP por DEC-P01 sin eliminarlos.

## Siguiente paso
La SPEC-008 versión 1.2 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
