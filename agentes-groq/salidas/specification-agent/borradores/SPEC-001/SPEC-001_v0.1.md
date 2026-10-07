<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-07 10:09
Petición: Necesitamos que el usuario pueda cargar las fórmulas y la historia clínica en foto o PDF, tanto por la web como por Telegram
-->

# SPEC-001. Carga de documentos de fórmulas y de historia clínica - Versión 0.1

Estado: Borrador
Modo: Inicial
Necesidad original: "Necesitamos que el usuario pueda cargar las fórmulas y la historia clínica en foto o PDF, tanto por la web como por Telegram"
Épica: pendiente (OPEN-Q-001)

## Análisis
- Objetivo: permitir que el usuario adjunte los documentos requeridos (fórmulas e historia clínica) para su prevalidación a través de los canales habilitados.
- Alcance inicial: recepción y almacenamiento preliminar de fotos o archivos PDF de fórmulas e historia clínica desde la aplicación web y el bot de Telegram.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- Contexto aplicable: 3.1, 3.2, 3.3, 3.4.

## Modelo de dominio
- Solicitud: pertenece a un paciente; agrupa fórmulas y documentos de una misma gestión. Origen: contexto 2.4 y 3.4.
- Documento: archivo adjunto (foto o PDF) que corresponde a una fórmula o a la historia clínica. Pertenece a una solicitud. Origen: contexto 3.4.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
No aplica.

## Preguntas de aclaración
- OPEN-Q-001. ¿A qué épica (EPIC-00x) pertenece esta necesidad?
  Por qué importa: el Architecture Agent analiza juntas las SPECs de una misma épica.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-002. ¿Existe un límite en el tamaño o en el número de archivos que el usuario puede adjuntar por solicitud?
  Por qué importa: define los límites técnicos y de usabilidad para la recepción de fotos y PDFs.
  Crítica: sí
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-003. Si el usuario carga un formato no soportado (diferente a foto o PDF), ¿qué mensaje o comportamiento exacto debe mostrar el sistema?
  Por qué importa: define el flujo de excepción y los criterios de aceptación para archivos inválidos.
  Crítica: sí
  Propuesta del agente: indicar que el formato no es válido y solicitar que se cargue una foto o un PDF.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-004. Antes de permitir la carga de documentos, ¿el sistema debe exigir la aceptación del tratamiento de datos de salud?
  Por qué importa: el contexto 3.2 indica que la autorización para tratar datos de salud es separada y se pide antes de cargar cualquier documento.
  Crítica: sí
  Propuesta del agente: sí, se exige la aceptación explícita antes de habilitar la carga de documentos (contexto 3.2).
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Permitir la carga de fórmulas y de historia clínica en formato de foto o PDF a través de la aplicación web y del bot de Telegram.

### 2. Contexto
El usuario gestiona sus fórmulas por la web o por Telegram. Antes de cargar cualquier documento, el sistema debe haber verificado la identidad y obtenido la autorización para tratar datos de salud. Los documentos recibidos son el insumo para la prevalidación.
Decisiones del equipo:
- Ninguna aún.

### 3. Alcance
- Carga de imágenes (fotos) y archivos PDF de fórmulas médicas e historia clínica desde la aplicación web.
- Carga de imágenes (fotos) y archivos PDF de fórmulas médicas e historia clínica desde el bot de Telegram.
- Asociación de los documentos cargados a la solicitud del paciente activo en la sesión o chat.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-001. Como usuario, quiero cargar mis fórmulas y mi historia clínica en foto o PDF por la web o por Telegram, para iniciar el proceso de pre-dispensación.

### 5. Requisitos funcionales
- RF-001. El sistema debe permitir al usuario adjuntar archivos en formato de imagen (foto) o PDF en la aplicación web. Origen: necesidad.
- RF-002. El sistema debe permitir al usuario adjuntar archivos en formato de imagen (foto) o PDF a través del bot de Telegram. Origen: necesidad.
- RF-003. El sistema debe exigir la autorización separada para el tratamiento de datos de salud antes de permitir la carga de cualquier documento. Origen: contexto 3.2.
- RF-004. El sistema debe asociar los documentos cargados a la solicitud del paciente correspondiente en la sesión o chat. Origen: contexto 3.3 y 3.4.

### 6. Requisitos no funcionales
- RNF-001. Usabilidad. Los canales web y Telegram deben indicar claramente si el archivo fue recibido con éxito o si se rechazó por formato. Se verifica con: prueba de usuario en ambos canales. Origen: necesidad.

### 7. Reglas de negocio
- BR-001. Los formatos permitidos para la carga de fórmulas e historia clínica son únicamente imagen (foto) y PDF. Origen: necesidad.
- BR-002. La autorización para tratar datos de salud es obligatoria y se solicita antes de habilitar la carga de documentos. Origen: contexto 3.2.

### 8. Flujo principal
1. El usuario inicia sesión o vincula su chat y verifica su identidad.
2. El sistema solicita la aceptación de la autorización para el tratamiento de datos de salud.
3. El usuario acepta la autorización de datos de salud.
4. El sistema habilita la opción de carga de documentos en la interfaz web o en el bot de Telegram.
5. El usuario selecciona y adjunta las fotos o archivos PDF de sus fórmulas y de su historia clínica.
6. El sistema recibe, valida el formato y almacena los documentos asociados a la solicitud del paciente.
7. El sistema confirma la recepción exitosa de los documentos.

### 9. Flujos alternativos y de excepción
- A1. Carga por etapas: El usuario carga algunos documentos primero y otros después en la misma solicitud antes de confirmar el envío para prevalidación.
- E1. Formato no válido: Si el usuario intenta cargar un archivo con un formato diferente a foto o PDF, el sistema rechaza el archivo e indica que el formato no es válido. Pendiente de confirmación (OPEN-Q-003).
- E2. Sin autorización de datos: Si el usuario no acepta el tratamiento de datos de salud, el sistema no permite cargar documentos ni continuar con la solicitud. Origen: contexto 3.2.

### 10. Casos límite
- CL-001. Archivo dañado o ilegible: El sistema recibe el archivo en el formato correcto pero no se obtienen los datos posteriormente, lo cual se maneja en la funcionalidad de prevalidación (contexto 3.4). Origen: contexto 3.4.

### 11. Criterios de aceptación
- AC-001. Dado un usuario con identidad verificada y autorización de datos de salud aceptada en la web, cuando adjunta un archivo PDF con su fórmula, entonces el sistema lo recibe y confirma su almacenamiento.
- AC-002. Dado un usuario con identidad verificada y autorización de datos de salud aceptada en Telegram, cuando envía una foto de su historia clínica al bot, entonces el sistema la recibe y confirma su almacenamiento.
- AC-003. Dado un usuario en la web o Telegram que aún no ha aceptado la autorización de tratamiento de datos de salud, cuando intenta cargar un documento, entonces el sistema bloquea la acción y solicita la aceptación previa.

### 12. Dependencias
- Verificación de identidad y vinculación de canales.
- Aviso y aceptación de tratamiento de datos de salud.

### 13. Restricciones
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular (contexto 3.11).

### 14. Fuera de alcance
- Análisis automático, lectura o extracción de datos de las fórmulas o de la historia clínica (se cubre en la prevalidación).
- Carga de documentos sin verificación de identidad previa.
- Dónde se almacenan físicamente los archivos adjuntos y qué protocolos de seguridad de almacenamiento se utilizan: tema para arquitectura. Origen: RF-001 y RF-002.

### 15. Preguntas abiertas
- OPEN-Q-001: Pendiente
- OPEN-Q-002: Pendiente
- OPEN-Q-003: Pendiente
- OPEN-Q-004: Pendiente

### 16. Trazabilidad
- HU-001: RF-001, RF-002, RF-003, RF-004; BR-001, BR-002; AC-001, AC-002, AC-003.
- RF-001: verificado por AC-001.
- RF-002: verificado por AC-002.
- RF-003: verificado por AC-003.
- BR-002: verificado por AC-003.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad.

## Verificación
- Completitud: cumple. Revisé objetivo, alcance, actores, modelo de dominio, requisitos, flujos, casos límite y criterios de aceptación.
- Consistencia interna: cumple. Los RF, BR y AC coinciden en exigir la autorización de datos y permitir foto o PDF en ambos canales.
- Consistencia con el contexto: cumple. Coincide con las secciones 3.1, 3.2, 3.3 y 3.4 del contexto.
- No ambigüedad: cumple. Los términos están alineados con el glosario.
- Verificabilidad: cumple. Los AC tienen condiciones y resultados observables claros.
- Trazabilidad: cumple. Las relaciones están mapeadas en la sección 16.
- No invención: cumple. No se inventaron reglas ni cifras no mencionadas en el contexto.
- Delimitación: cumple. Se excluyó la extracción de datos y aspectos técnicos de almacenamiento.

## Siguiente paso
Respondan las preguntas abiertas y ejecuten de nuevo el agente con --continuar SPEC-001.
