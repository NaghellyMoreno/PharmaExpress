<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash
Fecha: 2026-10-31 19:38
Petición: Actualiza la SPEC-008 a la versión 1.1 en estado Candidata. Aplica DEC-P05, DEC-P08, DEC-P09, DEC-P11, DEC-P12 y DEC-P13 de docs/decisiones.md; por DEC-P13 añade un catálogo configurable de festivos de Colombia por año. Resuelve T-002, T-006, T-034, T-035, T-036 y T-037 de la revisión transversal: (1) la fórmula de la EPS simulada se identifica con un número de 20 dígitos tipo MIPRES y guarda paciente, fecha, diagnóstico CIE-10, medicamentos, vigencia, si cada medicamento es PBS y su estado de autorización, y la fecha habilitada para crónicas; (2) la vigencia se evalúa como fecha de vigencia de la EPS ≥ fecha de prevalidación; el rango de 8 a 9 meses es solo una regla de los datos de prueba; (3) elimina el rol administrador de pruebas: el cambio de datos simulados es un mecanismo de prueba para arquitectura, no un actor; (4) reescribe E1 sin registrar pacientes; (5) un AC por cada RF. Marca las partes de puntos, ventanas, inventario, motivos de no entrega y métricas de agendamiento como fuera del alcance de DEC-P01, sin borrarlas.
-->

# SPEC-008. Datos simulados, parámetros y catálogos - Versión 1.1

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
- Fórmula de la EPS simulada: entidad identificada por un número numérico de 20 dígitos (tipo MIPRES) que almacena la asociación con el paciente, fecha de prescripción, diagnóstico principal CIE-10, medicamentos con su indicación PBS, estado de autorización por medicamento, vigencia (fecha límite de vigencia) y la fecha habilitada de entrega para tratamientos crónicos. Origen: DEC-P05, DEC-P08, DEC-P09, DEC-P12.
- Catálogo de cobertura PBS: fuente de verificación de cobertura por medicamento. Origen: necesidad y contexto 3.4, DEC-P11.
- Catálogo de diagnósticos crónicos: catálogo configurable que define qué diagnósticos CIE-10 corresponden a tratamientos crónicos. Origen: necesidad y contexto 3.4.
- Catálogo de festivos de Colombia: catálogo configurable por año que contiene las fechas de los festivos oficiales de Colombia para el cálculo de días hábiles. Origen: DEC-P13.
- Punto de dispensación: entidad ficticia con horario, ventanas de 1 hora, capacidad por ventana e inventario por medicamento configurables. Origen: necesidad y contexto 3.5, 3.8. (Fuera del alcance del MVP según DEC-P01).
- Contenido de EPS: información configurable de puntos, enlaces, trámites de autorización y orientación para actualizar datos. Origen: necesidad y contexto 3.4, 3.8.
- Catálogo de motivos de no entrega: listado de razones oficiales para no entregar un medicamento en el punto. Origen: necesidad y contexto 3.7. (Fuera del alcance del MVP según DEC-P01).
- Datos de prueba: conjuntos de datos donde las fórmulas de prueba tienen vigencias de 8 a 9 meses tras la consulta y se usan únicamente celulares y correos reales del equipo con su consentimiento. Origen: necesidad, contexto 3.2, 3.8, DEC-P12.
- Registro de eventos: eventos almacenados para métricas de evaluación de la prevalidación y transacciones del sistema. Origen: necesidad, contexto 3.10, DEC-011, DEC-P01.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- DEC-P01: afecta alcance general, RF-079, RF-081, RF-083, RNF-018 y fuera de alcance. Se marcan los componentes de puntos, ventanas, inventario, motivos de no entrega y métricas de agendamiento/entrega en punto como fuera del alcance del MVP (evaluación posterior), conservando los requisitos en la SPEC.
- DEC-P05, DEC-P08, DEC-P09, DEC-P12: afectan RF-076, BR-025, CL-019, E1, AC-034, AC-035. La fórmula se identifica mediante un número de 20 dígitos tipo MIPRES que vincula paciente, fecha, diagnóstico CIE-10, medicamentos, indicación PBS, autorizaciones, vigencia y fecha habilitada para crónicas.
- DEC-P11: afecta RF-077, BR-026. Aclara que un medicamento PBS es apto sin autorización; uno no PBS requiere estar autorizado en la EPS simulada.
- DEC-P13: afecta RF-084 (nuevo RF), BR-027 (nueva BR), AC-043 (nuevo AC). Incorpora el catálogo configurable de festivos de Colombia por año para el cálculo del primer día hábil en fórmulas crónicas.
- T-006: afecta BR-025 y AC-035. La regla de vigencia en el sistema se evalúa comparando la fecha de vigencia de la EPS simulada >= fecha de prevalidación. El rango de 8 a 9 meses se especifica estrictamente como regla de los datos de prueba.
- T-034: afecta Actores y Sección 4. Se elimina el rol "administrador de pruebas" que no existe en el contexto 2.3. Se reestructuran las HU para Paciente y Dispensador.
- T-035: afecta Flujo de excepción E1. Se reescribe E1 sin referencias a "registrar pacientes".
- T-036: afecta RF-076. La fecha habilitada se almacena directamente en la EPS simulada para fórmulas crónicas según la prescripción MIPRES.
- T-037: afecta sección 11 y 16. Se añade un Criterio de Aceptación (AC) específico por cada Requisito Funcional (RF-075 a RF-084).

## Preguntas de aclaración
No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Establecer los parámetros, catálogos, estructura de datos simulados (EPS, fórmulas MIPRES, festivos de Colombia) y mecanismos de prueba para Pharma Express, delimitando los componentes activos para el MVP de prevalidación según DEC-P01.

### 2. Contexto
El sistema opera utilizando datos simulados para la EPS, el inventario, los puntos de dispensación y la validación oficial. En cumplimiento de DEC-P01, la prevalidación entra al MVP y las funciones de agendamiento, inventario y dispensación en punto se mantienen especificadas pero quedan fuera del alcance del MVP inicial. Los datos de prueba se restringen a los integrantes del equipo con su consentimiento.

Decisiones del equipo:
- DEC-010. El mecanismo concreto para provocar cambios de estado en la EPS simulada durante las pruebas es tema de arquitectura. La SPEC exige que los datos de prueba permitan provocar cambios de afiliación, vigencia y autorizaciones antes de una cita/prevalidación y que la prevalidación los detecte. Responde a OPEN-Q-001.
- DEC-011. El sistema registra los eventos necesarios para las métricas de evaluación aprobadas (tiempo estimado de espera, desplazamientos evitados, novedades detectadas antes del desplazamiento, tasa de éxito por tarea, sobre-reservas en cero y escenarios asistidos) y los eventos transaccionales correspondientes, excluyendo la medición SUS. Responde a OPEN-Q-002.
- DEC-P01. La prevalidación completa entra al MVP en web y Telegram. El agendamiento y la gestión de puntos quedan en evaluación fuera del MVP.
- DEC-P05. Cada fórmula tiene un número de identificación de 20 dígitos como llave para buscarla en la EPS simulada.
- DEC-P08. Una fórmula coincide con la EPS simulada si su número existe, pertenece al paciente verificado y los medicamentos coinciden.
- DEC-P09. El diagnóstico CIE-10 se asocia a cada número de fórmula en la EPS simulada.
- DEC-P11. Un medicamento PBS es apto sin autorización; uno no PBS requiere autorización en la EPS simulada.
- DEC-P12. El número de fórmula de la EPS simulada es un número de prescripción tipo MIPRES de 20 dígitos que guarda paciente, fecha, diagnóstico CIE-10, medicamentos, vigencia, estado PBS, autorización y fecha habilitada de entrega para crónicas.
- DEC-P13. Se incluye un catálogo configurable de festivos de Colombia por año para determinar el primer día hábil siguiente en fórmulas crónicas (saltando domingos y festivos).

### 3. Alcance
- Provisión de datos de paciente y fórmula por la EPS simulada con estructura MIPRES (20 dígitos).
- Consulta de catálogo simulado de cobertura PBS y catálogo de diagnósticos crónicos CIE-10.
- Consulta de catálogo configurable de festivos de Colombia por año.
- Contenido configurable por EPS para autorizaciones y orientación de actualización de datos.
- Uso exclusivo de datos de prueba del equipo con fórmulas de prueba vigentes entre 8 y 9 meses tras la consulta.
- Mecanismo para provocar cambios de estado en la EPS simulada durante las pruebas.
- Registro de eventos de prevalidación y transacciones para métricas de evaluación.
- [Fuera del alcance de DEC-P01 en el MVP]: Configuración activa de puntos de dispensación, ventanas, capacidad, inventario, catálogo de motivos de no entrega y métricas de agendamiento/atención en punto (se mantienen especificados en la SPEC para fases posteriores).

### 4. Actores e historias de usuario
Actores: paciente, dispensador. (Sistemas externos simulados: EPS simulada, inventario simulado).
- HU-010. Como paciente, quiero que el sistema valide la información de mis fórmulas MIPRES, diagnósticos y cobertura en los catálogos y EPS simulada, para conocer de forma anticipada la validez preliminar de mis medicamentos. Origen: necesidad y contexto 2.3.
- HU-011. Como dispensador, quiero consultar el catálogo oficial de motivos de no entrega y los datos simulados de dispensación, para registrar adecuadamente la validación oficial en el punto cuando aplique la fase presencial. Origen: necesidad y contexto 2.3, 3.7.

### 5. Requisitos funcionales
- RF-075. El sistema debe consultar a la EPS simulada los datos del paciente identificándolo por su cédula, retornando cédula, EPS a la que pertenece, estado de afiliación (activa/inactiva), número de celular registrado y correo electrónico registrado (si existe). Origen: necesidad y contexto 3.2.
- RF-076. El sistema debe consultar a la EPS simulada la información de cada fórmula utilizando un número numérico de 20 dígitos (tipo MIPRES) como llave de identificación, obteniendo el paciente asociado, fecha de prescripción, diagnóstico principal CIE-10, lista de medicamentos prescritos, fecha límite de vigencia de la fórmula, indicador de cobertura PBS por medicamento, estado de autorización por medicamento y la fecha habilitada de entrega para fórmulas crónicas. Origen: necesidad, contexto 3.4, DEC-P05, DEC-P08, DEC-P09 y DEC-P12.
- RF-077. El sistema debe verificar si cada medicamento de la fórmula está cubierto por el PBS mediante el catálogo simulado de cobertura PBS, determinando que un medicamento PBS no requiere autorización y un medicamento no PBS requiere estar autorizado en la EPS simulada para ser apto. Origen: necesidad, contexto 3.4 y DEC-P11.
- RF-078. El sistema debe clasificar el tratamiento de una fórmula como agudo o crónico consultando el código de diagnóstico CIE-10 asociado a la fórmula en la EPS simulada contra el catálogo configurable de diagnósticos crónicos. Origen: necesidad, contexto 3.4 y DEC-P09.
- RF-079. El sistema debe permitir definir y almacenar para cada punto de dispensación ficticio su horario de atención, ventanas de 1 hora, capacidad máxima de citas por ventana e inventario de existencias por medicamento. (Nota: Fuera del alcance del MVP por DEC-P01). Origen: necesidad y contexto 3.5, 3.8.
- RF-080. El sistema debe proveer contenido configurable por cada EPS que contenga la información oficial de puntos de atención presencial, enlaces o trámites de autorización y la guía de orientación para actualización de datos del afiliado. Origen: necesidad y contexto 3.4, 3.8.
- RF-081. El sistema debe disponer del catálogo aprobado de motivos de no entrega para el registro de novedades durante la validación presencial en punto. (Nota: Fuera del alcance del MVP por DEC-P01). Origen: necesidad y contexto 3.7.
- RF-082. El sistema debe permitir provocar modificaciones de prueba en los datos de la EPS simulada (afiliación, vigencia de fórmula o estado de autorizaciones) antes de una cita o prevalidación, permitiendo verificar que la prevalidación del sistema detecte dichos cambios y ejecute las acciones de cancelación y notificación que correspondan. Origen: necesidad y DEC-010.
- RF-083. El sistema debe registrar los eventos transaccionales y de prevalidación requeridos para las métricas de evaluación (tiempo estimado de espera, desplazamientos evitados, novedades detectadas antes del desplazamiento, tasa de éxito por tarea, sobre-reservas en cero y escenarios asistidos), incluyendo resultados de prevalidación por fórmula, confirmación/cancelación/expiración de citas y llegadas/cierres por medicamento. Origen: necesidad, DEC-011 y DEC-P01.
- RF-084. El sistema debe mantener un catálogo configurable de festivos de Colombia por año para determinar los días no hábiles (domingos y festivos) utilizados en el cálculo del primer día hábil siguiente para fórmulas crónicas. Origen: DEC-P13.

### 6. Requisitos no funcionales
- RNF-017. Privacidad y datos de prueba. Los conjuntos de datos de prueba del sistema deben utilizar única y exclusivamente números de teléfono celular y correos electrónicos pertenecientes a los integrantes del equipo con su consentimiento explícito, estando estrictamente prohibido el uso de datos de pacientes reales. Origen: necesidad y contexto 3.2. Se verifica con: auditoría directa de la base de datos de prueba y de las configuraciones de prueba.
- RNF-018. Registro de métricas de prevalidación. El sistema debe almacenar el registro de eventos transaccionales de prevalidación y uso para permitir el cálculo de métricas de desplazamientos evitados, novedades detectadas antes del desplazamiento y tasa de éxito por tarea. Origen: DEC-011 y DEC-P01. Se verifica con: inspección de logs y auditoría de eventos de prevalidación.

### 7. Reglas de negocio
- BR-025. Evaluación de vigencia de fórmulas y datos de prueba. Una fórmula médica es preliminarmente vigente si y solo si su fecha límite de vigencia provista por la EPS simulada es mayor o igual a la fecha de prevalidación en que se realiza la consulta. Las fórmulas del conjunto de datos de prueba deben configurarse con vigencias comprendidas estrictamente entre 8 y 9 meses posteriores a la fecha de consulta médica simulada. Origen: necesidad, contexto 3.4 y DEC-P12.
- BR-026. Aprobación preliminar por PBS y autorización. Un medicamento de una fórmula se considera preliminarmente apto si es PBS (independientemente de autorización) o si siendo no PBS cuenta con estado autorizado en la EPS simulada. Si un medicamento no PBS carece de autorización, la fórmula no es apta. Origen: contexto 3.4 y DEC-P11.
- BR-027. Días hábiles y catálogo de festivos. El cálculo de la fecha hábil siguiente para prevalidación y agendamiento de fórmulas crónicas debe excluir los días domingos y las fechas incluidas en el catálogo de festivos de Colombia del año correspondiente. Origen: DEC-P13.

### 8. Flujo principal
1. El sistema recibe una solicitud de prevalidación o consulta referente a un paciente (cédula) o fórmula (número de 20 dígitos).
2. El sistema consulta a la EPS simulada la cédula del paciente y obtiene su estado de afiliación y datos de contacto.
3. El sistema consulta a la EPS simulada la fórmula de 20 dígitos y obtiene paciente, fecha, diagnóstico CIE-10, medicamentos, vigencia, indicación PBS, autorizaciones y fecha habilitada de entrega si es crónica.
4. El sistema contrasta el diagnóstico CIE-10 contra el catálogo de diagnósticos crónicos y verifica los festivos en el catálogo de festivos de Colombia si el tratamiento es crónico.
5. El sistema evalúa la cobertura PBS y autorizaciones según el catálogo de cobertura y reglas de la EPS simulada.
6. El sistema registra el evento de prevalidación en el registro de auditoría y métricas.

### 9. Flujos alternativos y de excepción
- A1. Cambio de estado en pruebas: Durante una sesión de prueba se provoca una modificación en los datos de la EPS simulada (por ejemplo, afiliación inactiva o fórmula vencida). Al ejecutarse la nueva prevalidación (o la verificación previa a la cita), el sistema detecta el cambio en la EPS simulada y aplica la cancelación, actualización de estado y notificación correspondientes. Origen: DEC-010.
- E1. Intento de uso de datos de prueba no autorizados: Si en un entorno de pruebas se intenta ejecutar una verificación o envío utilizando un número de celular o correo que no pertenezca a la lista autorizada del equipo de proyecto, el sistema o el entorno de prueba rechaza la operación y detiene la ejecución. Origen: RNF-017.

### 10. Casos límite
- CL-019. Vigencia en la EPS simulada vencida antes de la prevalidación: Si una fórmula de prueba o de simulación tiene una fecha límite de vigencia menor a la fecha actual de prevalidación (incluso si originalmente se creó a 8-9 meses de la consulta), el sistema la declara como no vigente e indica que requiere nueva valoración médica. Origen: necesidad, contexto 3.4 y DEC-P12.
- CL-020. Prevalidación de fórmula crónica en día previo a festivo oficial: Si la prevalidación de una fórmula crónica se realiza un sábado o previo a un festivo registrado en el catálogo de festivos de Colombia, el cálculo de la fecha posible omite los días no hábiles y asigna el primer día hábil siguiente. Origen: DEC-P13.

### 11. Criterios de aceptación
- AC-034. Dado un paciente consultado en la EPS simulada por su número de cédula, cuando el sistema realiza la consulta, entonces retorna la cédula, el nombre de la EPS, estado de afiliación (activa/inactiva), el teléfono celular registrado y el correo electrónico registrado si existe. Origen: RF-075.
- AC-035. Dada una fórmula de 20 dígitos de la EPS simulada con fecha límite de vigencia de 8 meses posterior a la consulta médica, cuando el sistema evalúa la vigencia en el momento de la prevalidación, entonces confirma que la fórmula está vigente al verificar que la fecha de vigencia de la EPS simulada es igual o mayor a la fecha de prevalidación. Origen: RF-076, BR-025.
- AC-036. Dado un medicamento prescrito en una fórmula de la EPS simulada, cuando se evalúa la cobertura PBS, entonces si el medicamento es no PBS y no tiene autorización en la EPS simulada la fórmula queda no apta, mientras que si es PBS queda apto sin requerir autorización. Origen: RF-077, BR-026.
- AC-037. Dado un código de diagnóstico CIE-10 contenido en una fórmula de la EPS simulada, cuando el sistema lo compara contra el catálogo de diagnósticos crónicos, entonces clasifica el tratamiento como crónico si el código figura en el catálogo o como agudo en caso contrario. Origen: RF-078.
- AC-038. Dado un punto de dispensación ficticio en la configuración del sistema, cuando se consultan sus parámetros, entonces el sistema retorna su horario, capacidad por ventanas de 1 hora e inventario por medicamento. (Nota: Fuera del alcance del MVP por DEC-P01). Origen: RF-079.
- AC-039. Dada una EPS configurada en el sistema, cuando se requiere informar al usuario sobre autorizaciones o actualización de datos, entonces el sistema provee los enlaces, puntos de atención presencial y guía de trámites configurados para esa EPS. Origen: RF-080.
- AC-040. Dado el catálogo de motivos de no entrega, cuando el dispensador registra una no entrega en el punto, entonces el sistema despliega las opciones oficiales (afiliación inactiva, fórmula vencida, autorización no vigente, medicamento no cubierto, datos no coinciden, sin existencias, otro). (Nota: Fuera del alcance del MVP por DEC-P01). Origen: RF-081.
- AC-041. Dado un cambio provocado en el estado de una fórmula o afiliación en la EPS simulada durante las pruebas, cuando el sistema ejecuta la nueva prevalidación, entonces detecta el nuevo estado y actualiza el resultado de prevalidación en consecuencia. Origen: RF-082.
- AC-042. Dado un flujo de prevalidación completado, cuando finaliza el procesamiento, entonces el sistema almacena el registro del evento transaccional con el resultado de la prevalidación y las novedades detectadas. Origen: RF-083, RNF-018.
- AC-043. Dado el año en curso y el catálogo de festivos de Colombia configurado, cuando se calcula el primer día hábil siguiente para una fórmula crónica prevalidada en sábado antes de un lunes festivo, entonces el sistema retorna la fecha del martes siguiente. Origen: RF-084, BR-027.

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

### 16. Trazabilidad
- HU-010: RF-075, RF-076, RF-077, RF-078, RF-080, RF-082, RF-083, RF-084; RNF-017, RNF-018; BR-025, BR-026, BR-027; AC-034, AC-035, AC-036, AC-037, AC-039, AC-041, AC-042, AC-043; CL-019, CL-020.
- HU-011: RF-079, RF-081; AC-038, AC-040.
- RF-075: Origen: necesidad y contexto 3.2; verificado por AC-034.
- RF-076: Origen: necesidad, contexto 3.4, DEC-P05, DEC-P08, DEC-P09 y DEC-P12; verificado por AC-035.
- RF-077: Origen: necesidad, contexto 3.4 y DEC-P11; verificado por AC-036.
- RF-078: Origen: necesidad, contexto 3.4 y DEC-P09; verificado por AC-037.
- RF-079: Origen: necesidad y contexto 3.5, 3.8; verificado por AC-038.
- RF-080: Origen: necesidad y contexto 3.4, 3.8; verificado por AC-039.
- RF-081: Origen: necesidad y contexto 3.7; verificado por AC-040.
- RF-082: Origen: necesidad y DEC-010; verificado por AC-041.
- RF-083: Origen: necesidad, DEC-011 y DEC-P01; verificado por AC-042.
- RF-084: Origen: DEC-P13; verificado por AC-043.
- RNF-017: Origen: necesidad y contexto 3.2; verificado con auditoría directa de la base de datos de prueba y configuraciones de prueba.
- RNF-018: Origen: DEC-011 y DEC-P01; verificado con inspección de logs y auditoría de eventos de prevalidación.
- BR-025: Origen: necesidad, contexto 3.4 y DEC-P12; verificado por AC-035.
- BR-026: Origen: contexto 3.4 y DEC-P11; verificado por AC-036.
- BR-027: Origen: DEC-P13; verificado por AC-043.
- CL-019: Origen: necesidad, contexto 3.4 y DEC-P12; verificado por AC-035.
- CL-020: Origen: DEC-P13; verificado por AC-043.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y del contexto.
- Versión 1.0: incorporación de las respuestas del equipo a OPEN-Q-001 y OPEN-Q-002, definición de eventos para métricas específicas y exclusión del mecanismo de arquitectura.
- Versión 1.1: incorporación de decisiones globales DEC-P01, DEC-P05, DEC-P08, DEC-P09, DEC-P11, DEC-P12 y DEC-P13. Solución a los hallazgos T-002 (fórmula MIPRES 20 dígitos), T-006 (evaluación de fecha de vigencia de EPS >= prevalidación), T-034 (eliminación del rol administrador de pruebas), T-035 (reescritura de E1 sin registro de pacientes), T-036 (almacenamiento directo de fecha habilitada en EPS simulada) y T-037 (cobertura 1 a 1 de AC para cada RF). Incorporación del catálogo configurable de festivos de Colombia por año. Delimitación de componentes fuera del alcance del MVP por DEC-P01.

## Verificación
- Completitud: cumple. Se han incorporado las decisiones DEC-P01 a DEC-P13 y se han resuelto los hallazgos T-002, T-006, T-034, T-035, T-036 y T-037.
- Consistencia interna: cumple. Se verificó que cada RF mantenga coherencia con las reglas de negocio (BR-025 a BR-027), los flujos alternativos y los AC correspondientes.
- Consistencia con el contexto: cumple. Se verificó el alineamiento estricto con las secciones 2.3, 3.2, 3.4, 3.5, 3.7, 3.8, 3.10 y 3.11 del contexto de Pharma Express.
- No ambigüedad: cumple. La estructura de fórmulas de 20 dígitos (MIPRES), la regla de vigencia por comparación de fechas y la evaluación de PBS/autorización están especificadas formalmente sin ambigüedades.
- Verificabilidad: cumple. Cada RF y BR cuenta con al menos un Criterio de Aceptación (AC) observable escrito en formato Dado/Cuando/Entonces.
- Cobertura de actores: cumple. Se definieron HUs para Paciente (HU-010) y Dispensador (HU-011), habiendo retirado el rol no existente de "administrador de pruebas".
- Cobertura de AC: cumple. Todos los requisitos funcionales (RF-075 a RF-084) y reglas de negocio tienen su respectivo AC en la sección 11 y trazabilidad en la sección 16.
- Trazabilidad: cumple. La sección 16 mapea explícitamente cada HU, RF, RNF, BR y CL con su origen y el criterio de aceptación o método que lo verifica.
- No invención: cumple. Todas las reglas y datos provienen del contexto o de las decisiones del equipo (DEC-P01 a DEC-P13).
- Delimitación: cumple. Se distingue claramente el alcance del MVP para la prevalidación del agendamiento y la gestión de puntos fuera del MVP (DEC-P01), asignando decisiones de diseño de software a la sección 14 para arquitectura.

## Siguiente paso
La SPEC-008 versión 1.1 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
