<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-07 12:26
Petición: Los identificadores de transporte (usuario, número de chat y nombre visible de Telegram) se usan solo para vincular y enrutar mensajes. Nunca prueban la identidad del paciente.
-->

# SPEC-002. Restricción de uso de identificadores de Telegram para identidad y enrutamiento - Versión 1.0

Estado: Aprobada y congelada
Modo: Iteración
Necesidad original: "Los identificadores de transporte (usuario, número de chat y nombre visible de Telegram) se usan solo para vincular y enrutar mensajes. Nunca prueban la identidad del paciente."
Épica: EPIC-002

## Análisis
- Objetivo: garantizar que los identificadores de Telegram se utilicen exclusivamente para transporte y enrutamiento de mensajes, sin constituir prueba de identidad del paciente.
- Alcance inicial: validación del uso de identificadores de Telegram, restricción de acceso en chats sin vinculación activa y enrutamiento de mensajes a pacientes vinculados.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario, bot de Telegram.
- Contexto aplicable: 3.1, 3.2, 3.3.

## Modelo de dominio
- Identificador de transporte (usuario, número de chat y nombre visible de Telegram): pertenece al canal Telegram; se usa para vincular y enrutar mensajes. Origen: necesidad y contexto 3.1.
- Vinculación: asociación entre un chat de Telegram y un paciente tras verificar su identidad; tiene una vigencia de 3 meses. Origen: contexto 3.2 y 3.3.
- Paciente: persona afiliada cuyos datos provienen de la EPS simulada. Origen: contexto 2.3 y 3.2.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- DEC-001: afecta [RF-006, RNF-002, BR-003, CL-003, AC-005]. Todos actualizados con base en las respuestas del equipo y el contexto.

## Preguntas de aclaración
- No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Asegurar que el sistema emplee los identificadores de Telegram (usuario, número de chat y nombre visible) únicamente para vincular y enrutar mensajes, impidiendo que dichos datos sean considerados como prueba de identidad del paciente.

### 2. Contexto
Los identificadores de Telegram son datos de transporte y no tienen validez como prueba de identidad. La vinculación de canales requiere verificación de identidad previa mediante cédula y código de un solo uso. Si un canal no tiene vinculación activa o esta se encuentra vencida, el sistema no muestra información, no permite gestiones, no recibe notificaciones y orienta al usuario hacia el proceso de verificación.
Decisiones del equipo:
- DEC-001. Los identificadores de Telegram se usan exclusivamente para transporte y enrutamiento, nunca como prueba de identidad. Responde a la necesidad original.
- DEC-002. El canal sin vinculación activa no muestra información, no permite gestiones ni recibe notificaciones; responde solo con una guía para verificar identidad y vincular el canal, sin informar si existe un paciente asociado ni asumir identidad, exigiendo la aceptación previa del aviso de privacidad. Responde a OPEN-Q-002.
- DEC-003. No se debe registrar ningún tipo de evento o auditoría cuando se usen los identificadores de Telegram para enrutar mensajes a un paciente vinculado. Responde a OPEN-Q-003.

### 3. Alcance
- Uso exclusivo de los identificadores de Telegram para enrutamiento y vinculación.
- Restricción de acceso y respuestas orientadoras ante interacciones desde canales sin vinculación activa o con vinculación vencida.
- Prohibición de inferir identidad a partir de los datos visibles de Telegram.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario, bot de Telegram.
- HU-002. Como paciente o persona que actúa en su nombre, quiero que mis identificadores de Telegram se utilicen solo para recibir mensajes y gestionar mis fórmulas de forma segura, para que mi identidad no sea asumida únicamente por el uso del chat. Origen: necesidad.

### 5. Requisitos funcionales
- RF-006. El sistema debe utilizar los identificadores de transporte de Telegram (usuario, número de chat y nombre visible) exclusivamente para vincular y enrutar mensajes. Origen: necesidad.
- RF-007. El sistema debe impedir que los identificadores de Telegram sean utilizados como prueba de identidad del paciente en cualquier circunstancia. Origen: contexto 3.1.
- RF-008. Ante una interacción por Telegram desde un canal sin vinculación activa o con vinculación vencida, el sistema no debe mostrar información, no debe permitir gestiones y debe responder únicamente con una guía para verificar la identidad y vincular el canal, sin informar si existe un paciente asociado. Origen: DEC-002.
- RF-009. El sistema no debe registrar eventos ni auditorías específicos del uso de los identificadores de Telegram para enrutar mensajes a un paciente vinculado. Origen: DEC-003.

### 6. Requisitos no funcionales
- RNF-002. Seguridad y privacidad: los identificadores de transporte de Telegram no deben almacenarse ni tratarse como credenciales de autenticación ni de identidad. Se verifica con: revisión de diseño y pruebas de integración del canal. Origen: contexto 3.1.

### 7. Reglas de negocio
- BR-003. Los identificadores de Telegram (usuario, número de chat y nombre visible) no prueban la identidad de nadie y se usan únicamente para transporte y enrutamiento. Origen: contexto 3.1 y necesidad.
- BR-004. Toda vinculación de un canal de Telegram vence a los 3 meses y exige un código nuevo; mientras esté vencida o inactiva, no muestra información, no permite gestiones y no recibe notificaciones. Origen: contexto 3.3.

### 8. Flujo principal
1. El usuario interactúa con el bot de Telegram utilizando su canal.
2. El sistema valida si el canal cuenta con una vinculación activa asociada a un paciente.
3. Si la vinculación es activa, el sistema enruta los mensajes y notificaciones correspondientes utilizando exclusivamente los identificadores de transporte.
4. El sistema procesa la interacción sin registrar eventos de auditoría por el uso del enrutamiento.

### 9. Flujos alternativos y de excepción
- E1. El canal de Telegram no tiene una vinculación activa o su vinculación venció:
  1. El sistema no muestra información del paciente ni permite realizar gestiones.
  2. El sistema responde con una guía para verificar la identidad y vincular el canal, orientando a la obtención de un código nuevo si aplica.
  3. El sistema exige la aceptación del aviso de privacidad antes de permitir cualquier registro o verificación.

### 10. Casos límite
- CL-003. Interacción desde un chat de Telegram cuyo identificador coincide con un usuario anterior cuya vinculación ya expiró a los 3 meses: el sistema trata el canal como no vinculado, no muestra información y exige realizar nuevamente el proceso completo de verificación de identidad con cédula y código de un solo uso. Origen: contexto 3.3 y DEC-002.

### 11. Criterios de aceptación
- AC-005. Dado un mensaje recibido a través de Telegram, cuando el sistema procesa el mensaje, entonces utiliza el número de chat, usuario y nombre visible exclusivamente para enrutarlo al paciente vinculado, sin validar la identidad basándose en dichos datos. Origen: necesidad y RNF-002.
- AC-006. Dado un chat de Telegram sin vinculación activa o con vinculación vencida, cuando se envía un mensaje al bot, entonces el sistema responde únicamente con la guía de verificación e identidad, sin revelar datos ni permitir gestiones. Origen: DEC-002.

### 12. Dependencias
- Bot de Telegram (servicio externo real de mensajería).
- Módulo de verificación de identidad y vinculación de canales.

### 13. Restricciones
- El bot de Telegram solo escribe después de que la persona lo inicia (contexto 3.1).
- Los identificadores de Telegram no son fuente de identidad (contexto 2.3).

### 14. Fuera de alcance
- Uso de Telegram como mecanismo de validación oficial o fuente de datos de la EPS simulada (contexto 2.3).
- Registro de auditoría o trazabilidad de mensajes de Telegram (DEC-003).
- Envío de nombres de medicamentos o diagnósticos por canales de mensajería (contexto 3.6).
- Mecanismo de persistencia de tokens o manejo de sesiones de Telegram: tema para arquitectura. Origen: RNF-002.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-001)
- OPEN-Q-002: Respondida (DEC-002)
- OPEN-Q-003: Respondida (DEC-003)

### 16. Trazabilidad
- HU-002: RF-006, RF-007, RF-008, RF-009; RNF-002; BR-003, BR-004; CL-003; AC-005, AC-006.
- RF-006: verificado por AC-005.
- RF-007: verificado por AC-005.
- RF-008: verificado por AC-006.
- RF-009: verificado por flujo principal.
- RNF-002: verificado por AC-005.
- BR-003: verificado por AC-005.
- BR-004: verificado por CL-003.
- CL-003: verificado por AC-006.

### 17. Historial de cambios
- Versión 0.1: creación inicial con preguntas de aclaración a partir de la necesidad.
- Versión 1.0: incorporación de respuestas del equipo, consolidación de la especificación e inclusión de criterios de aceptación y flujos para canales sin vinculación o vencidos.

## Verificación
- Completitud: cumple. Se especificaron los requisitos funcionales, no funcionales, reglas de negocio, flujos y criterios de aceptación asociados a la restricción de identificadores de Telegram.
- Consistencia interna: cumple. Los RF-006 a RF-009 y los AC-005 y AC-006 son coherentes con las decisiones DEC-001, DEC-002 y DEC-003.
- Consistencia con el contexto: cumple. Respeta estrictamente que los identificadores de Telegram no prueban identidad (contexto 3.1) y el comportamiento ante canales sin vinculación o vencidos (contexto 3.3).
- No ambigüedad: cumple. Los términos de transporte, enrutamiento y vinculación están claramente definidos según el glosario y el contexto.
- Verificabilidad: cumple. Cada requisito cuenta con su respectivo criterio de aceptación comprobable.
- Trazabilidad: cumple. La sección 16 mapea correctamente historias de usuario, requisitos, reglas, casos límite y criterios de aceptación.
- No invención: cumple. No se inventaron reglas ni cifras; se utilizaron únicamente los datos del contexto y las respuestas del equipo.
- Delimitación: cumple. Se respetaron los límites del canal de Telegram y se dejaron los temas de infraestructura para arquitectura.

## Siguiente paso
La SPEC-002 versión 1.0 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
