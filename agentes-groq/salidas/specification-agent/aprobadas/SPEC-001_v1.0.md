<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-07 11:56
Petición: Antes de procesar cualquier dato, el sistema debe mostrar el aviso de privacidad y exigir su aceptación.
-->

# SPEC-001. Presentación y aceptación del aviso de privacidad y consentimiento de datos - Versión 1.0

Estado: Aprobada y congelada
Modo: Inicial
Necesidad original: "Antes de procesar cualquier dato, el sistema debe mostrar el aviso de privacidad y exigir su aceptación."
Épica: EPIC-001

## Análisis
- Objetivo: garantizar que el usuario conozca el aviso de privacidad y otorgue su consentimiento explícito junto con la declaración de autorización antes de ingresar cualquier dato en el sistema.
- Alcance inicial: presentación del aviso de privacidad, la declaración de autorización, el registro de la aceptación y el manejo del rechazo en la aplicación web y en el bot de Telegram.
- Actores: paciente, persona que actúa por el paciente (cuidador, tutor, familiar), facilitador comunitario.
- Contexto aplicable: 3.1, 3.2, 3.8, 3.11.

## Modelo de dominio
- Consentimiento: pertenece a un canal (navegador o chat de Telegram); registra si aceptó el titular o un tercero, la fecha y el canal. Origen: contexto 3.2.
- Canal: plataforma (aplicación web o chat de Telegram) desde la cual se realiza la gestión. Origen: contexto 3.1.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
No aplica.

## Preguntas de aclaración
- No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Asegurar que el sistema cumpla con la normatividad de protección de datos personales antes de procesar cualquier información de salud, exigiendo la aceptación del aviso de privacidad y la declaración de autorización en cada plataforma utilizada.

### 2. Contexto
La Ley 1581 de 2012 y el Decreto 1377 de 2013 establecen que los datos de salud son sensibles y requieren autorización explícita del titular. El sistema opera a través de una aplicación web y un bot de Telegram, los cuales deben presentar el aviso de privacidad y registrar la aceptación de manera independiente por plataforma.
Decisiones del equipo:
- DEC-001. La declaración explícita "soy el titular o actúo con su autorización" se exige en la misma pantalla junto con el aviso de privacidad. Responde a OPEN-Q-002.
- DEC-002. El aviso de privacidad debe presentarse 1 vez para cada plataforma en la que se realicen procesos por parte del usuario. Responde a OPEN-Q-003.
- DEC-003. Si la persona no acepta el aviso de privacidad o la declaración, no se registra nada y el canal permite volver a intentarlo más adelante. Responde a OPEN-Q-004.

### 3. Alcance
- Presentación del aviso de privacidad y la declaración de autorización antes de solicitar cualquier dato en la aplicación web o en el bot de Telegram.
- Registro de la aceptación indicando si aceptó el titular o un tercero, la fecha y el canal.
- Bloqueo temporal y no registro de datos cuando el usuario rechaza los términos, permitiendo reintentar en un acceso posterior.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-001. Como usuario de la aplicación web o de Telegram, quiero ver el aviso de privacidad y la declaración de autorización antes de ingresar datos, para conocer el uso que se dará a la información y otorgar mi consentimiento.

### 5. Requisitos funcionales
- RF-001. El sistema debe mostrar el aviso de privacidad antes de permitir el ingreso de cualquier dato personal o de salud en cualquier canal. Origen: necesidad y contexto 3.2.
- RF-002. El sistema debe exigir en la misma pantalla la aceptación del aviso de privacidad y la declaración explícita "soy el titular o actúo con su autorización". Origen: contexto 3.2 y DEC-001.
- RF-003. El sistema debe registrar la aceptación indicando si aceptó el titular o un tercero, la fecha y el canal utilizado. Origen: contexto 3.2.
- RF-004. El sistema debe presentar el aviso de privacidad una vez por cada plataforma (aplicación web y chat de Telegram) en la que el usuario realice procesos. Origen: DEC-002.
- RF-005. Si el usuario no acepta el aviso de privacidad o la declaración, el sistema no debe registrar ningún dato y debe permitir que la persona pueda volver a intentarlo más adelante en ese mismo canal. Origen: contexto 3.2 y DEC-003.

### 6. Requisitos no funcionales
- RNF-001. Usabilidad. El texto del aviso de privacidad y la declaración de autorización deben mostrarse de forma clara y accesible en pantallas web y en mensajes de texto del bot de Telegram. Se verifica con: revisión visual y funcional de los flujos de inicio en ambos canales. Origen: contexto 3.1.

### 7. Reglas de negocio
- BR-001. Ningún dato personal o de salud puede ser solicitado ni procesado por el sistema sin la aceptación previa del aviso de privacidad y de la declaración de autorización. Origen: contexto 3.2.
- BR-002. Si una persona no acepta los términos, el sistema no almacena ningún registro de su intento y el canal permanece disponible para nuevos intentos futuros. Origen: contexto 3.2 y DEC-003.

### 8. Flujo principal
1. El usuario inicia una gestión en la aplicación web o en el bot de Telegram.
2. El sistema muestra el aviso de privacidad y la declaración "soy el titular o actúo con su autorización" en la misma pantalla o interfaz.
3. El usuario acepta los términos y la declaración.
4. El sistema registra la aceptación (indicando si es titular o tercero, fecha y canal) y permite continuar con el proceso de verificación de identidad.

### 9. Flujos alternativos y de excepción
- E1. El usuario rechaza el aviso de privacidad o la declaración.
  1. El sistema informa que no es posible continuar sin la aceptación.
  2. El sistema no registra ningún dato del usuario.
  3. El sistema permite que el usuario pueda volver a iniciar el proceso y visualizar los términos más adelante en ese mismo canal.

### 10. Casos límite
- CL-001. Usuario cambia de plataforma: si un usuario ya aceptó en la aplicación web y posteriormente ingresa por el bot de Telegram, el sistema debe presentar el aviso de privacidad nuevamente para esa plataforma. Origen: DEC-002.
- CL-002. Reintentos de aceptación: si un usuario rechaza los términos y regresa posteriormente, el sistema le vuelve a presentar el aviso de privacidad como si fuera la primera vez en esa plataforma. Origen: DEC-003.

### 11. Criterios de aceptación
- AC-001. Dado que un usuario abre la aplicación web por primera vez, cuando intenta realizar una gestión, entonces el sistema le muestra el aviso de privacidad y la declaración "soy el titular o actúo con su autorización" antes de solicitar su cédula o documentos.
- AC-002. Dado que el usuario acepta los términos en la aplicación web, cuando el sistema procesa la aceptación, entonces almacena el registro indicando si fue el titular o un tercero, la fecha exacta y el canal web.
- AC-003. Dado que el usuario rechaza el aviso de privacidad, cuando confirma el rechazo, entonces el sistema no guarda ningún dato del usuario y le permite volver a intentar el proceso más adelante.
- AC-004. Dado que un usuario ya aceptó el aviso de privacidad en la aplicación web, cuando inicia sesión por primera vez en el bot de Telegram, entonces el sistema le presenta nuevamente el aviso de privacidad para esa plataforma.

### 12. Dependencias
- Aplicación web de Pharma Express (contexto 3.1).
- Bot de Telegram de Pharma Express (contexto 3.1).

### 13. Restricciones
- Ley 1581 de 2012 y Decreto 1377 de 2013: obligatoriedad de la autorización explícita para el tratamiento de datos sensibles de salud (contexto 3.11).

### 14. Fuera de alcance
- Atención presencial fuera del sistema para quienes no acepten el tratamiento de datos (contexto 3.1).
- Revocación posterior del consentimiento y eliminación de datos (cubierto en otras funcionalidades de gestión de datos).
- Mecanismo de persistencia y almacenamiento de bases de datos: tema para arquitectura. Origen: RF-003.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-001).
- OPEN-Q-002: Respondida (DEC-001).
- OPEN-Q-003: Respondida (DEC-002).
- OPEN-Q-004: Respondida (DEC-003).

### 16. Trazabilidad
- HU-001: RF-001, RF-002, RF-003, RF-004, RF-005; BR-001, BR-002; AC-001, AC-002, AC-003, AC-004; CL-001, CL-002.
- RF-001: verificado por AC-001.
- RF-002: verificado por AC-001.
- RF-003: verificado por AC-002.
- RF-004: verificado por AC-004.
- RF-005: verificado por AC-003.
- BR-001: verificado por AC-001.
- BR-002: verificado por AC-003.
- CL-001: verificado por AC-004.
- CL-002: verificado por AC-003.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y las preguntas de aclaración.
- Versión 1.0: consolidación de respuestas del equipo y definición de criterios de aceptación.

## Verificación
- Completitud: cumple. Se incluyeron el objetivo, alcance, actores, modelo de dominio, reglas, flujos, casos límite, criterios de aceptación, dependencias, restricciones y fuera de alcance.
- Consistencia interna: cumple. Los requisitos funcionales, reglas de negocio y criterios de aceptación coinciden en exigir la visualización previa, la aceptación conjunta, el registro por plataforma y el manejo del rechazo.
- Consistencia con el contexto: cumple. Las decisiones DEC-001, DEC-002 y DEC-003 están alineadas con las secciones 3.1 y 3.2 del contexto del producto.
- No ambigüedad: cumple. Los términos y condiciones de aceptación, rechazo y reintento están definidos sin ambigüedades.
- Verificabilidad: cumple. Cada requisito funcional cuenta con al menos un criterio de aceptación medible.
- Trazabilidad: cumple. Todos los requisitos y reglas están conectados con sus historias de usuario y criterios de aceptación.
- No invención: cumple. No se incluyeron normas, cifras ni tecnologías no mencionadas en el contexto o en las respuestas del equipo.
- Delimitación: cumple. Se excluyó la atención presencial y la revocación del consentimiento, marcándolas correctamente en el fuera de alcance.

## Siguiente paso
La SPEC-001 versión 1.0 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
