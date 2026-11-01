<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:56
Petición: Canal asistido para cuidadores, tutores y facilitadores. Las personas con barreras digitales pueden usar la web o Telegram con ayuda de un cuidador, tutor o facilitador comunitario; no es una interfaz aparte. Cualquier persona que ingrese el código correcto enviado a los medios del paciente puede hacer todas las gestiones del paciente, y el sistema no distingue entre paciente, cuidador, tutor o facilitador. Al aceptar el tratamiento de datos, la persona declara si es el titular o un tercero que actúa con su autorización. Un facilitador puede vincular su chat o navegador a muchos pacientes y debe escoger el paciente antes de cada gestión. Si el número registrado del paciente es el de su tutor, el flujo es el mismo. Ante un cambio de medio de contacto, el sistema solo orienta para actualizarlo en la EPS y no modifica datos. La web y el bot informan que la atención presencial sigue disponible. EPIC-002.
-->

## Preguntas de aclaración
- OPEN-Q-001. Cuando un facilitador o cuidador gestiona a múltiples pacientes desde un mismo chat o navegador, ¿debe realizar el proceso de verificación de identidad con el código enviado al paciente (o al número del tutor registrado) cada vez que cambia de paciente activo, o la sesión de vinculación de ese paciente se mantiene activa en paralelo?
  Por qué importa: define el flujo de selección y validación cuando se gestionan varios pacientes simultáneamente.
  Crítica: sí
  Propuesta del agente: el sistema exige ingresar el código de verificación la primera vez que se vincula cada paciente al chat o navegador; una vez vinculado, para las gestiones posteriores el facilitador solo escoge el paciente de la lista sin repetir el código, respetando el vencimiento de 3 meses de la vinculación (contexto 3.3).
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-002. Si una persona que actúa como tutor o facilitador marca en la declaración de tratamiento de datos que es un tercero que actúa con autorización, ¿el sistema solicita algún dato adicional de identificación del tercero o solo registra que fue un tercero quien aceptó?
  Por qué importa: impacta la recolección de datos y el cumplimiento de la Ley 1581 de 2012 frente a la autorización de terceros.
  Crítica: sí
  Propuesta del agente: el sistema registra únicamente que aceptó un tercero, la fecha y el canal, sin almacenar datos personales adicionales del cuidador, tutor o facilitador (contexto 3.2).
  Estado: Pendiente
  Responsable: equipo
