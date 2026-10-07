<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.6-flash
Fecha: 2026-09-30 22:40
Petición: SPEC-901, empieza en HU-901, RF-901, RNF-901, BR-901, AC-901, CL-901, OPEN-Q-901 y DEC-901. Necesidad: Durante la prevalidación, si la fórmula no está vigente, el sistema debe conectarse a MIPRES o a la base de datos de la EPS para intentar descargar la nueva prescripción actualizada del paciente sin que este tenga que subir la foto de nuevo.
-->

# SPEC-901. Prevalidación de vigencia de fórmulas y manejo de fórmulas no vigentes - Versión 0.1

Estado: Borrador
Modo: Inicial
Necesidad original: "Durante la prevalidación, si la fórmula no está vigente, el sistema debe conectarse a MIPRES o a la base de datos de la EPS para intentar descargar la nueva prescripción actualizada del paciente sin que este tenga que subir la foto de nuevo."

## Análisis
- Objetivo: determinar la conducta del sistema cuando se detecta una fórmula no vigente durante la prevalidación preliminar y orientar al usuario sobre los pasos a seguir.
- Alcance inicial: prevalidación de la vigencia de fórmulas médicas a partir de la EPS simulada y tratamiento de fórmulas no vigentes.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- Contexto aplicable: 2.3, 3.4, 3.8, 3.10.

## Modelo de dominio
- Solicitud: pertenece a un paciente; cardinalidad una por gestión. Origen: contexto 2.4.
- Fórmula: pertenece a una solicitud; cardinalidad una o varias. Origen: contexto 2.4 y 3.4.
- Registro de vigencia en EPS simulada: pertenece a una fórmula; cardinalidad uno. Origen: contexto 2.3 y 3.4.

## Contradicciones detectadas
- La necesidad solicita conectar el sistema a MIPRES o a la base de datos de la EPS para descargar prescripciones actualizadas. Esto contradice explícitamente el contexto del producto en:
  1. Sección 3.10 ("Fuera de alcance"): establece explícitamente "Integración real con EPS, MIPRES, ADRES o inventarios reales" fuera del alcance del proyecto.
  2. Sección 3.4 ("Documentos y prevalidación", numeral 2): define que si la fórmula no está vigente, "se indica que requiere una nueva valoración médica".
  3. Secciones 2.3 y 3.8: la EPS es un sistema simulado dentro del prototipo, no una integración con servicios gubernamentales ni bases de datos de producción externas.
  Pregunta asociada: OPEN-Q-901.

## Análisis de impacto
No aplica.

## Preguntas de aclaración
- OPEN-Q-901. La necesidad solicita conectar el sistema a MIPRES o a la base de datos de la EPS para descargar una prescripción actualizada, lo cual contradice la sección 3.10 (Fuera de alcance: integración real con EPS, MIPRES) y la sección 3.4 (si la fórmula no está vigente, se indica que requiere nueva valoración médica). ¿Se mantiene la regla del contexto de declarar la fórmula como no apta e indicar que requiere nueva valoración médica, o se requiere simular la descarga de una prescripción actualizada en la EPS simulada?
  Por qué importa: define el comportamiento funcional de la prevalidación ante fórmulas vencidas y resuelve la contradicción con el alcance del prototipo.
  Crítica: sí
  Propuesta del agente: Rechazar la integración real con MIPRES/EPS por estar fuera de alcance (sección 3.10) y conservar la regla de la sección 3.4: si no está vigente según la EPS simulada, la fórmula queda no apta y se orienta a una nueva valoración médica en la EPS.
  Estado: Pendiente
  Responsable: equipo

- OPEN-Q-902. Si el equipo decidiera simular la presencia de prescripciones actualizadas en la EPS simulada, ¿en qué condiciones la EPS simulada retornaría una nueva prescripción sin intervención del paciente?
  Por qué importa: definiría la lógica de negocio simulada para la actualización automática de fórmulas.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Evaluar la vigencia de las fórmulas médicas durante la prevalidación preliminar utilizando la EPS simulada y notificar al usuario el resultado o las acciones orientativas requeridas si la fórmula no está vigente.

### 2. Contexto
En Pharma Express, la prevalidación verifica preliminarmente la vigencia de la fórmula consultando la EPS simulada (secciones 2.3 y 3.4). El sistema no cuenta con integraciones reales con MIPRES ni con bases de datos reales de las EPS (sección 3.10).

Decisiones del equipo:
- Ninguna hasta el momento.

### 3. Alcance
- Consulta de vigencia de fórmulas sobre la EPS simulada.
- Marcación de fórmula como no apta cuando la vigencia está expirada.
- Despliegue de mensaje de orientación hacia nueva valoración médica en la EPS cuando la fórmula no está vigente.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-901. Como paciente o persona que actúa por el paciente, quiero saber si mi fórmula médica está vigente durante la prevalidación preliminar, para conocer si puedo reservar mis medicamentos o si debo tramitar una nueva valoración médica.

### 5. Requisitos funcionales
- RF-901. El sistema debe verificar la vigencia de cada fórmula incluida en la solicitud consultando la EPS simulada durante la prevalidación preliminar. Origen: contexto 3.4.
- RF-902. Si la fórmula no se encuentra vigente en la EPS simulada, el sistema debe marcar dicha fórmula como no apta e informar al usuario que requiere una nueva valoración médica en su EPS. Origen: contexto 3.4.
- RF-903. Comportamiento sobre consulta automática de prescripciones actualizadas en MIPRES o base de datos de EPS. Pendiente de OPEN-Q-901.

### 6. Requisitos no funcionales
- RNF-901. Privacidad en mensajes e información en pantalla. Los mensajes explicativos sobre fórmulas no vigentes no deben contener nombres de medicamentos ni diagnósticos. Se verifica con: inspección de los textos presentados en pantalla y notificaciones generadas. Origen: contexto 3.6.

### 7. Reglas de negocio
- BR-901. La prevalidación de vigencia es una verificación preliminar y no sustituye la validación oficial realizada por el dispensador en el punto de atención. Origen: contexto 3.4.
- BR-902. Cada fórmula es la unidad de validación y funciona bajo el principio de todo o nada: si no está vigente, la fórmula completa queda no apta. Origen: contexto 2.4 y 3.4.
- BR-903. Las fórmulas separadas dentro de una misma solicitud son independientes; la invalidez por vigencia de una fórmula no impide la gestión de otras fórmulas aptas del mismo paciente. Origen: contexto 3.4.
- BR-904. Regla sobre conexión con MIPRES o EPS para descarga de nueva prescripción. Pendiente de OPEN-Q-901.

### 8. Flujo principal
1. El usuario inicia la prevalidación de una solicitud que contiene una o más fórmulas.
2. El sistema consulta los datos de la EPS simulada para cada fórmula.
3. Si la EPS simulada confirma que la fórmula está vigente, el sistema continúa con la prevalidación de cobertura PBS, autorizaciones y habilitación de entrega.

### 9. Flujos alternativos y de excepción
- A1. Fórmula no vigente según la EPS simulada.
  1. En el paso 2 del flujo principal, la EPS simulada reporta que la fórmula no está vigente.
  2. El sistema marca la fórmula como no apta.
  3. El sistema muestra un mensaje indicando que la fórmula preliminarmente requiere una nueva valoración médica en la EPS.
  4. El sistema detiene el proceso de agendamiento y reserva para esa fórmula específica.

### 10. Casos límite
- CL-901. Solicitud con dos fórmulas donde una está vigente y otra no vigente: la fórmula no vigente queda declarada no apta con indicación de nueva valoración médica, mientras que la fórmula vigente continúa de forma independiente el proceso de prevalidación, reserva y agenda. Origen: contexto 3.4.

### 11. Criterios de aceptación
- AC-901. Dado que una fórmula no está vigente según la EPS simulada, cuando el sistema ejecuta la prevalidación, entonces marca la fórmula como no apta y despliega un mensaje que orienta al usuario a solicitar una nueva valoración médica en su EPS.
- AC-902. Dado una solicitud con dos fórmulas independientes, cuando una de ellas no está vigente y la otra cumple todas las prevalidaciones, entonces el sistema permite agendar la cita y reservar los medicamentos únicamente de la fórmula vigente.

### 12. Dependencias
- EPS simulada (fuente de datos de vigencia de fórmula).
- Verificación de identidad y vinculación de canal.

### 13. Restricciones
- No se realizan integraciones reales con MIPRES, ADRES ni bases de datos de EPS en producción (contexto 3.10).
- La EPS, inventario y validación oficial se ejecutan como componentes simulados en el prototipo (contexto 3.8).

### 14. Fuera de alcance
- Integración real con MIPRES o bases de datos de producción de la EPS (contexto 3.10).
- Descarga o importación automatizada de prescripciones desde plataformas externas (contexto 3.10).
- Renovación, modificación o prescripción de fórmulas médicas (contexto 3.10).

### 15. Preguntas abiertas
- OPEN-Q-901: Pendiente.
- OPEN-Q-902: Pendiente.

### 16. Trazabilidad
- HU-901: RF-901, RF-902; BR-901, BR-902, BR-903; AC-901, AC-902; CL-901.
- RF-901: verificado por AC-901.
- RF-902: verificado por AC-901.
- BR-901: verificado por AC-901.
- BR-902: verificado por AC-901.
- BR-903: verificado por AC-902.
- CL-901: verificado por AC-902.

### 17. Historial de cambios
- Versión 0.1: creación inicial basada en la necesidad solicitada, identificando la contradicción directa con el alcance de integraciones reales (secciones 3.4 y 3.10 del contexto).

## Verificación
- Completitud: cumple. Se cubrieron el objetivo, alcance, modelo de dominio, flujos, casos límite y trazabilidad para el escenario de vigencia de fórmula.
- Consistencia interna: cumple. Comparé RF-901, RF-902, BR-902, BR-903 con el flujo alternativo A1 y los criterios AC-901 y AC-902; todos tratan de forma coherente la prevalidación todo-o-nada por fórmula e independencia entre fórmulas.
- Consistencia con el contexto: cumple. Se identificaron y citaron textualmente las contradicciones entre la necesidad planteada y las secciones 3.4 y 3.10 del contexto del producto.
- No ambigüedad: cumple. Se diferencian claramente la prevalidación preliminar de la validación oficial y no se asumen comportamientos no confirmados.
- Verificabilidad: cumple. Los criterios de aceptación están redactados en formato Dado/Cuando/Entonces y son observables sin ambigüedad.
- Trazabilidad: cumple. Se utilizó la secuencia de identificadores solicitada iniciando en 901 (HU-901, RF-901, RNF-901, BR-901, AC-901, CL-901, OPEN-Q-901, DEC-901) con matriz de trazabilidad bidireccional.
- No invención: cumple. Se conservaron las reglas definidas en el contexto y las discrepancias se formularon como preguntas abiertas.
- Delimitación: cumple. Se mantuvo la especificación enfocada en qué hace el sistema, enviando la decisión de arquitectura sobre integraciones reales al apartado fuera de alcance.

## Siguiente paso
Respondan las preguntas abiertas (especialmente la pregunta crítica OPEN-Q-901) y ejecuten de nuevo el agente con --continuar SPEC-901.
