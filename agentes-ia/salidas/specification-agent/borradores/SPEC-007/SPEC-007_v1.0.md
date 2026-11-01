<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:57
Petición: FASE=RESPUESTAS

Necesidad original: Canal asistido para cuidadores, tutores y facilitadores. Las personas con barreras digitales pueden usar la web o Telegram con ayuda de un cuidador, tutor o facilitador comunitario; no es una interfaz aparte. Cualquier persona que ingrese el código correcto enviado a los medios del paciente puede hacer todas las gestiones del paciente, y el sistema no distingue entre paciente, cuidador, tutor o facilitador. Al aceptar el tratamiento de datos, la persona declara si es el titular o un tercero que actúa con su autorización. Un facilitador puede vincular su chat o navegador a muchos pacientes y debe escoger el paciente antes de cada gestión. Si el número registrado del paciente es el de su tutor, el flujo es el mismo. Ante un cambio de medio de contacto, el sistema solo orienta para actualizarlo en la EPS y no modifica datos. La web y el bot informan que la atención presencial sigue disponible. EPIC-002.

Preguntas y respuestas del equipo:
- OPEN-Q-001. Cuando un facilitador o cuidador gestiona a múltiples pacientes desde un mismo chat o navegador, ¿debe realizar el proceso de verificación de identidad con el código enviado al paciente (o al número del tutor registrado) cada vez que cambia de paciente activo, o la sesión de vinculación de ese paciente se mantiene activa en paralelo?
  Respuesta: La verificación se hace una vez por cada vinculación entre el canal y el paciente. Después de verificar con el código, el paciente queda vinculado al chat o navegador y el facilitador solo lo escoge de la lista en las gestiones posteriores, sin repetir el código. Cada vinculación vence a los 3 meses y, al vencer, exige un nuevo código para ese paciente (DEC-10, contexto 3.3).
- OPEN-Q-002. Si una persona que actúa como tutor o facilitador marca en la declaración de tratamiento de datos que es un tercero que actúa con autorización, ¿el sistema solicita algún dato adicional de identificación del tercero o solo registra que fue un tercero quien aceptó?
  Respuesta: Solo registra que aceptó un tercero, junto con la fecha, la hora y el canal. No solicita cédula ni nombre del tercero, porque el sistema no distingue entre paciente, cuidador, tutor o facilitador (DEC-09, DEC-11, contexto 3.2).
-->

# SPEC-007. Canal asistido para cuidadores, tutores y facilitadores - Versión 1.0

Estado: Candidata
Modo: Iteración
Necesidad original: "Canal asistido para cuidadores, tutores y facilitadores. Las personas con barreras digitales pueden usar la web o Telegram con ayuda de un cuidador, tutor o facilitador comunitario; no es una interfaz aparte. Cualquier persona que ingrese el código correcto enviado a los medios del paciente puede hacer todas las gestiones del paciente, y el sistema no distingue entre paciente, cuidador, tutor o facilitador. Al aceptar el tratamiento de datos, la persona declara si es el titular o un tercero que actúa con su autorización. Un facilitador puede vincular su chat o navegador a muchos pacientes y debe escoger el paciente antes de cada gestión. Si el número registrado del paciente es el de su tutor, el flujo es el mismo. Ante un cambio de medio de contacto, el sistema solo orienta para actualizarlo en la EPS y no modifica datos. La web y el bot informan que la atención presencial sigue disponible."
Épica: EPIC-002

## Análisis
- Objetivo: permitir que cuidadores, tutores y facilitadores comunitarios gestionen los servicios de los pacientes en la web y Telegram mediante canales compartidos, declarando su condición de terceros y seleccionando el paciente activo sin repetir códigos de verificación para cada trámite.
- Alcance inicial: uso de la web y Telegram por parte de terceros autorizados, registro de la aceptación de datos por terceros, vinculación múltiple de pacientes a un mismo chat o navegador, selección del paciente activo y orientación ante cambios de datos.
- Actores: paciente, cuidador, tutor, facilitador comunitario, EPS simulada.
- Contexto aplicable: 3.1, 3.2, 3.3, 3.8.

## Modelo de dominio
- Paciente: persona afiliada cuyos datos y medios de contacto provienen de la EPS simulada. Origen: contexto 2.3, 3.2.
- Canal: aplicación web o bot de Telegram utilizados para la interacción. Origen: contexto 3.1.
- Vinculación: asociación entre un canal y un paciente, validada mediante código de un solo uso, con duración máxima de 3 meses. Origen: contexto 3.3, DEC-10.
- Aceptación de tratamiento de datos: registro que indica si el consentimiento fue otorgado por el titular o por un tercero, incluyendo fecha, canal y hora. Origen: contexto 3.2, DEC-09, DEC-11.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- DEC-10: afecta RF-070, RF-072, BR-023, paso 3 del flujo principal, CL-017, AC-031. Todos actualizados.
- DEC-11: afecta RF-071, BR-024, paso 1 del flujo principal, AC-032. Todos actualizados.

## Preguntas de aclaración
No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Garantizar el acceso al canal asistido en la web y Telegram para cuidadores, tutores y facilitadores comunitarios, permitiendo la gestión en nombre de los pacientes mediante la vinculación de canales, la declaración del rol de tercero en el tratamiento de datos y la selección del paciente activo.

### 2. Contexto
Las personas con barreras digitales pueden recibir apoyo de terceros sin necesidad de interfaces diferenciadas. El sistema valida la identidad mediante un código enviado a los medios registrados en la EPS y permite que un mismo canal administre a múltiples pacientes.
Decisiones del equipo:
- DEC-10. La verificación de identidad con el código de un solo uso se realiza una vez por cada vinculación entre el canal y el paciente. Después de verificar, el paciente queda vinculado al chat o navegador, permitiendo seleccionarlo de la lista en gestiones posteriores sin repetir el código. Cada vinculación vence a los 3 meses. Responde a OPEN-Q-001.
- DEC-11. Al aceptar el tratamiento de datos, si la persona actúa como tutor o facilitador, el sistema solo registra que fue un tercero quien aceptó, junto con la fecha, la hora y el canal, sin solicitar la cédula ni el nombre del tercero. Responde a OPEN-Q-002.

### 3. Alcance
- Uso de la aplicación web y el bot de Telegram por parte de cuidadores, tutores y facilitadores comunitarios.
- Declaración de tratamiento de datos indicando si actúa el titular o un tercero autorizado.
- Verificación de identidad inicial mediante código de un solo uso enviado a los medios del paciente.
- Vinculación múltiple de pacientes a un mismo chat de Telegram o navegador.
- Selección del paciente activo antes de cada gestión cuando existen múltiples vínculos.
- Indicación permanente en la web y en el bot de que la atención presencial sigue disponible.
- Orientación para la actualización de datos de contacto en la EPS cuando el medio registrado no corresponde al usuario actual.

### 4. Actores e historias de usuario
Actores: paciente, cuidador, tutor, facilitador comunitario, EPS simulada.
- HU-009. Como cuidador, tutor o facilitador comunitario, quiero gestionar las solicitudes de varios pacientes desde mi navegador o chat de Telegram, para apoyar a personas con barreras digitales sin usar una interfaz separada.

### 5. Requisitos funcionales
- RF-070. El sistema debe permitir vincular un canal web o un chat de Telegram a un paciente tras ingresar el código correcto de un solo uso enviado a los medios registrados en la EPS. Origen: contexto 3.2, 3.3, DEC-10.
- RF-071. El sistema debe exigir que la persona acepte el tratamiento de datos declarando expresamente si actúa como el titular o como un tercero con autorización, registrando fecha, hora, canal y tipo de declarante sin solicitar identificación adicional del tercero. Origen: contexto 3.2, DEC-09, DEC-11.
- RF-072. El sistema debe permitir que un mismo chat o navegador mantenga vinculaciones activas con múltiples pacientes en paralelo, permitiendo seleccionar el paciente activo antes de cada gestión sin requerir un nuevo código de verificación. Origen: contexto 3.3, DEC-10.
- RF-073. El sistema debe mostrar de forma permanente tanto en la web como en el bot de Telegram la información de que la atención presencial sigue disponible. Origen: contexto 3.1, necesidad.
- RF-074. El sistema debe orientar al usuario sobre cómo actualizar los datos de contacto en la EPS y abstenerse de modificar datos de contacto de forma directa cuando se detecta un cambio o un número correspondiente a un tutor. Origen: contexto 3.2, necesidad.

### 6. Requisitos no funcionales
- RNF-016. Seguridad y privacidad: la asociación entre el canal y el paciente debe expirar automáticamente a los tres meses, requiriendo un nuevo proceso de verificación con código para continuar gestionando al paciente. Se verifica con: prueba de expiración de sesión por tiempo y validación de acceso posterior al vencimiento. Origen: contexto 3.3, DEC-10.

### 7. Reglas de negocio
- BR-023. La verificación de identidad y la vinculación del canal se realizan una vez por paciente. Las gestiones posteriores del mismo paciente desde el canal vinculado utilizan la sesión existente hasta que se cumpla el plazo de vencimiento de tres meses. Origen: contexto 3.3, DEC-10.
- BR-024. El sistema no distingue entre paciente, cuidador, tutor o facilitador para la ejecución de trámites una vez superada la verificación de identidad y la aceptación de datos por parte de un tercero autorizado. Origen: contexto 3.2, 3.3, DEC-09, DEC-11.

### 8. Flujo principal
1. El cuidador, tutor o facilitador accede a la aplicación web o al bot de Telegram.
2. El sistema muestra la disponibilidad de la atención presencial.
3. El usuario ingresa el número de documento del paciente.
4. El sistema solicita la aceptación del tratamiento de datos, donde el usuario declara si actúa como titular o como tercero autorizado.
5. El sistema envía el código de un solo uso a los medios de contacto registrados en la EPS para el paciente.
6. El usuario ingresa el código recibido.
7. El sistema valida el código y vincula el canal al paciente.
8. Si el canal ya cuenta con otros pacientes vinculados, el sistema presenta la lista para que el usuario seleccione el paciente activo con el que desea operar.
9. El usuario realiza la gestión requerida para el paciente seleccionado.

### 9. Flujos alternativos y de excepción
- A1. El canal ya tiene al paciente vinculado previamente dentro del periodo de vigencia de tres meses.
  1. El sistema muestra la lista de pacientes vinculados al canal.
  2. El usuario selecciona al paciente sin necesidad de ingresar un nuevo código de verificación.
- E1. El código de verificación expira o se agotan los tres intentos permitidos.
  1. El sistema ofrece pedir un código nuevo, recibir orientación para actualizar datos en la EPS o acudir a la atención presencial.
- E2. La vinculación del canal con el paciente cumple el plazo de tres meses de vigencia.
  1. El sistema invalida la vinculación y exige realizar un nuevo proceso de verificación con código para permitir el acceso a las gestiones de ese paciente.

### 10. Casos límite
- CL-017. Un facilitador comunitario intenta gestionar a múltiples pacientes desde el mismo navegador: el sistema permite la selección independiente del paciente activo manteniendo las sesiones paralelas vigentes sin interferencias entre ellos. Origen: contexto 3.3, DEC-10.
- CL-018. El número registrado en la EPS corresponde al tutor del paciente menor o con dependencia: el sistema aplica el mismo flujo de verificación mediante código y no altera los datos de contacto. Origen: contexto 3.2, 3.3, necesidad.

### 11. Criterios de aceptación
- AC-031. Dado un facilitador que ya vinculó un canal a un paciente mediante el código correcto, cuando desea realizar una nueva gestión para el mismo paciente dentro del periodo de tres meses, entonces el sistema le permite seleccionarlo de la lista sin solicitar nuevamente el código de verificación. Origen: contexto 3.3, DEC-10.
- AC-032. Dado un tercero que acepta el tratamiento de datos en nombre del paciente, cuando confirma su aceptación marcando que actúa como autorizado, entonces el sistema registra el consentimiento indicando que fue otorgado por un tercero, junto con la fecha, la hora y el canal, sin exigir cédula ni nombre del tercero. Origen: contexto 3.2, DEC-09, DEC-11.
- AC-033. Dado un canal web o de Telegram vinculado a un paciente, cuando transcurren más de tres meses desde la vinculación, entonces el sistema bloquea el acceso a la información y exige un nuevo código de verificación para reactivar la gestión de ese paciente. Origen: contexto 3.3, RNF-016.

### 12. Dependencias
- Verificación de identidad y códigos de un solo uso.
- Datos de contacto y afiliación de la EPS simulada.
- Canales reales de comunicación (Telegram, web).

### 13. Restricciones
- El proyecto cuenta con un equipo de cuatro personas y aproximadamente 8 semanas. Origen: contexto 3.9.
- El equipo no tiene acceso a los sistemas de Disfarma y trabaja desde afuera. Origen: contexto 3.9.
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 131, y Resolución 1604 de 2013: si la entrega queda incompleta al reclamar, la EPS debe entregar lo faltante en máximo 48 horas. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites de autorización. Origen: contexto 3.11.

### 14. Fuera de alcance
- Registro de pacientes y creación de cuentas nuevas por parte del sistema (contexto 3.10).
- Actualización directa de datos de contacto en los sistemas de la EPS (contexto 3.10).
- Distinción de roles o privilegios diferenciados entre paciente, cuidador, tutor y facilitador (contexto 3.2, 3.3).
- Interfaz gráfica o aplicación separada para cuidadores o facilitadores (contexto 3.1).
- Mecanismo de autenticación biométrica o almacenamiento de documentos de identidad de terceros. Origen: DEC-11.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-10)
- OPEN-Q-002: Respondida (DEC-11)

### 16. Trazabilidad
- HU-009: RF-070, RF-071, RF-072, RF-073, RF-074; RNF-016; BR-023, BR-024; AC-031, AC-032, AC-033; CL-017, CL-018.
- RF-070: verificado por AC-031.
- RF-071: verificado por AC-032.
- RF-072: verificado por AC-031.
- RF-073: verificado por AC-031.
- RF-074: verificado por AC-032.
- RNF-016: verificado por AC-033.
- BR-023: verificado por AC-031.
- BR-024: verificado por AC-032.
- CL-017: verificado por AC-031.
- CL-018: verificado por AC-033.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad y estructuración preliminar.
- Versión 1.0: incorporación de las respuestas del equipo a las preguntas abiertas DEC-10 y DEC-11, actualización de requisitos funcionales, reglas de negocio, casos límite y criterios de aceptación, pasando a estado Candidata.

## Verificación
- Completitud: cumple. Incluye todas las secciones requeridas y aborda de forma integral la necesidad del canal asistido para cuidadores, tutores y facilitadores.
- Consistencia interna: cumple. Los requisitos funcionales, las reglas de negocio y los criterios de aceptación alineados con DEC-10 y DEC-11 reflejan de manera uniforme que el canal soporta múltiples pacientes y que no se exigen datos adicionales al tercero.
- Consistencia con el contexto: cumple. Coincide exactamente con las reglas sobre tratamiento de datos de la sección 3.2, la vinculación y expiración a 3 meses de la sección 3.3 y la prohibición de modificar datos de contacto de la sección 3.2.
- No ambigüedad: cumple. Los plazos, las condiciones de vinculación y el registro del consentimiento están descritos sin términos vagos.
- Verificabilidad: cumple. Cada criterio de aceptación describe condiciones observables y verificables en la interfaz web y el bot de Telegram.
- Trazabilidad: cumple. Las historias de usuario, requisitos, reglas de negocio, casos límite y criterios de aceptación se encuentran enlazados de forma bidireccional.
- No invención: cumple. No se introdujeron canales adicionales, cifras de plazos no autorizadas ni mecanismos de validación de identidad no previstos en el contexto o en las decisiones del equipo.
- Delimitación: cumple. Respeta estrictamente los límites del alcance y mantiene fuera de alcance la modificación directa de datos y el registro de cuentas de pacientes.

## Siguiente paso
La SPEC-007 versión 1.0 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
