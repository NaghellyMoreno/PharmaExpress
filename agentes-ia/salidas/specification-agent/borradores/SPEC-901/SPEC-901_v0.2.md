<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.6-flash
Fecha: 2026-09-30 22:49
Petición: Respuestas del equipo a todas las preguntas abiertas de la SPEC-901: sí queremos la integración. El sistema debe conectarse a MIPRES y a la base de datos real de la EPS para descargar la prescripción actualizada cuando la fórmula no esté vigente. Registra esto como decisión del equipo y entrega la versión candidata.
-->

# SPEC-901. Prevalidación de vigencia de fórmulas y manejo de fórmulas no vigentes - Versión 0.2

Estado: Borrador
Modo: Iteración
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
- La respuesta recibida del equipo indica: "sí queremos la integración. El sistema debe conectarse a MIPRES y a la base de datos real de la EPS para descargar la prescripción actualizada cuando la fórmula no esté vigente."
  Esta respuesta no se registra como decisión (en cumplimiento estricto de la Regla Crítica 8 y la regla de trabajo 1.5) porque contradice explícitamente el contexto del producto en:
  1. Sección 3.10 (Fuera de alcance): establece explícitamente "Integración real con EPS, MIPRES, ADRES o inventarios reales" como fuera del alcance del proyecto.
  2. Sección 3.8 (Datos simulados y configuración): establece expresamente "Son simulados la EPS, el inventario, los puntos de dispensación y la validación oficial. Son reales Telegram, el envío de SMS y el envío de correo."
  3. Sección 3.4 (Documentos y prevalidación, numeral 2): establece que "Vigencia de la fórmula. Es un dato de la EPS simulada... Si no está vigente, se indica que requiere una nueva valoración médica."
  Pregunta asociada: OPEN-Q-901.

## Análisis de impacto
- La respuesta entregada por el equipo no fue registrada como decisión debido a que contradice las secciones 3.8 y 3.10 del contexto del producto. Por tanto, no se modifican los requisitos funcionales ni las reglas de negocio hacia integraciones reales. Los elementos RF-903 y BR-904 se mantienen en estado pendiente hasta que se resuelva formalmente la contradicción.

## Preguntas de aclaración
- OPEN-Q-901. La respuesta dada plantea realizar integraciones reales con MIPRES y la base de datos de la EPS, pero la sección 3.10 establece expresamente que la "Integración real con EPS, MIPRES, ADRES o inventarios reales" está Fuera de Alcance y la sección 3.8 indica que la EPS es simulada. ¿El equipo confirma mantener el alcance del proyecto según la sección 3.10 (operar con la EPS simulada e indicar nueva valoración médica si no está vigente), o se requiere solicitar un cambio formal al Contexto del Producto (sección 3) para incluir integraciones reales fuera del prototipo simulado?
  Por qué importa: La Regla Crítica 8 prohíbe registrar decisiones que contradigan la sección 3 del contexto sin resolver explícitamente la contradicción. Impide definir la especificación funcional definitiva y pasar a versión Candidata.
  Crítica: sí
  Propuesta del agente: Mantener la regla del contexto (secciones 3.4, 3.8 y 3.10): operar sobre la EPS simulada, declarar la fórmula no vigente como no apta e indicar la necesidad de una nueva valoración médica.
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Evaluar la vigencia de las fórmulas médicas durante la prevalidación preliminar utilizando la EPS simulada y notificar al usuario el resultado o las acciones orientativas requeridas si la fórmula no está vigente.

### 2. Contexto
En Pharma Express, la prevalidación verifica preliminarmente la vigencia de la fórmula consultando la EPS simulada (secciones 2.3 y 3.4). El sistema no cuenta con integraciones reales con MIPRES ni con bases de datos reales de las EPS (sección 3.10).

Decisiones del equipo:
- Ninguna registrada hasta el momento. La propuesta de integración real recibida contradice las secciones 3.8 y 3.10 del contexto, por lo que no fue registrada como decisión (Regla Crítica 8).

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
- OPEN-Q-902: Descartada (la descarga automática en EPS real/MIPRES contradice las secciones 3.8 y 3.10 del contexto del producto).

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
- Versión 0.2: procesamiento de la respuesta del equipo. En aplicación de la Regla Crítica 8, no se registró como decisión la integración a MIPRES/EPS real por contradecir explícitamente las secciones 3.8 y 3.10 del contexto. Se mantiene en estado Borrador y se reabre la aclaración en OPEN-Q-901.

## Verificación
- Completitud: no cumple. Queda pendiente resolver la contradicción entre la solicitud del equipo y las secciones 3.8 y 3.10 del contexto expresadas en OPEN-Q-901.
- Consistencia interna: cumple. Todos los RF, BR, flujos y criterios de aceptación mantienen total coherencia sin incorporar reglas contradictorias.
- Consistencia con el contexto: cumple. Se aplicó rigurosamente la Regla Crítica 8 al no registrar la respuesta del equipo como decisión por violar las secciones 3.8 y 3.10.
- No ambigüedad: cumple. Se explica claramente por qué el documento continúa en estado Borrador y no puede pasar a versión Candidata (Regla Crítica 11).
- Verificabilidad: cumple. Los criterios AC-901 y AC-902 son observables y verificables.
- Trazabilidad: cumple. Mantiene la trazabilidad bidireccional completa.
- No invención: cumple. Se rechazó incorporar integraciones reales que distorsionen el alcance definido en la sección 3.
- Delimitación: cumple. Mantiene la funcionalidad circunscrita al ámbito de prevalidación con la EPS simulada.

## Siguiente paso
Respondan las preguntas abiertas en OPEN-Q-901 aclarando si se mantiene la regla del contexto (sección 3.10) o si se requiere ajustar oficialmente la sección 3 del contexto del producto, y ejecuten de nuevo el agente con --continuar SPEC-901.
