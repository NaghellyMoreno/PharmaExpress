<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:56
Petición: FASE=RESPUESTAS

Necesidad original: Notificaciones y recordatorios. Cada notificación se envía por todos los medios del paciente: notificación de la web a los navegadores vinculados, Telegram a los chats vinculados, SMS al celular registrado y correo si existe. Ninguna notificación, en ningún canal, incluye nombres de medicamentos ni diagnósticos; puede incluir punto, fecha, ventana e instrucción de consultar el detalle en el flujo autenticado. Se notifican confirmación de cita, recordatorio de la noche anterior, recordatorio de una hora antes, cancelación, expiración, pérdida de medicamento, recordatorio de revalidación y aviso de próxima entrega. Los recordatorios solo informan y ofrecen cancelar; no piden confirmación. El de la noche anterior se envía entre las 19:00 y las 21:00 del día anterior, no se envía si la cita se agendó después de las 21:00 ni para citas del mismo día. El de una hora antes se envía siempre y en ese momento se vuelve a verificar afiliación, vigencia y autorizaciones; si algo cambió, se cancelan las citas de la fórmula, se anulan los códigos, se liberan existencias y cupos, la fórmula queda no apta, se registra qué dato cambió y cuándo, y se notifica el motivo y el siguiente paso. Se envía un único recordatorio de revalidación 48 horas después de informar que no había disponibilidad, y un aviso de próxima entrega 2 días antes de la siguiente fecha habilitada de cada fórmula crónica entregada. EPIC-005.

Preguntas y respuestas del equipo:
- OPEN-Q-001. Cuando el recordatorio de una hora antes detecta un cambio (afiliación, vigencia o autorizaciones) y cancela las citas, ¿qué texto exacto debe llevar la notificación del motivo y el siguiente paso para el usuario?
  Respuesta: No se fija un texto literal. La notificación debe informar que la cita fue cancelada, el motivo del cambio (afiliación inactiva, fórmula vencida o autorización no vigente) y el siguiente paso: acudir a la EPS o iniciar una nueva solicitud cuando el requisito esté resuelto. No debe incluir nombres de medicamentos ni diagnósticos (RF-57, DEC-39, RNF-04). El texto exacto es contenido configurable y debe conservar esos elementos.
- OPEN-Q-002. ¿Cuál es el formato o la plantilla general exacta para las notificaciones de confirmación de cita, expiración, pérdida de medicamento, recordatorio de revalidación y aviso de próxima entrega, asegurando que ninguna incluya nombres de medicamentos ni diagnósticos?
  Respuesta: No se fija una plantilla literal única. Toda notificación debe indicar el evento, el punto, la fecha y la ventana cuando aplique, y una instrucción para consultar el detalle dentro del flujo autenticado. Nunca incluye nombres de medicamentos ni diagnósticos, y los parámetros de los enlaces profundos no llevan cédula ni datos sensibles. El texto exacto es contenido configurable (RF-51, DEC-28, DEC-29, RNF-04).
- OPEN-Q-003. Si un paciente tiene múltiples navegadores vinculados y chats de Telegram configurados, ¿el envío simultáneo por todos los medios se ejecuta en un orden específico o en paralelo, y cómo se maneja si falla el envío en uno de los canales externos reales (correo o SMS)?
  Respuesta: El orden, el paralelismo y el manejo de fallas de los servicios externos son tema para arquitectura. La SPEC solo exige intentar la entrega por todos los medios disponibles del paciente y no depender de un único canal (RNF-12). El manejo de fallas de las fuentes simuladas está fuera de alcance (DEC-32).
-->

# SPEC-005. Notificaciones y recordatorios - Versión 1.0

Estado: Candidata
Modo: Iteración
Necesidad original: "Notificaciones y recordatorios. Cada notificación se envía por todos los medios del paciente: notificación de la web a los navegadores vinculados, Telegram a los chats vinculados, SMS al celular registrado y correo si existe. Ninguna notificación, en ningún canal, incluye nombres de medicamentos ni diagnósticos; puede incluir punto, fecha, ventana e instrucción de consultar el detalle en el flujo autenticado. Se notifican confirmación de cita, recordatorio de la noche anterior, recordatorio de una hora antes, cancelación, expiración, pérdida de medicamento, recordatorio de revalidación y aviso de próxima entrega. Los recordatorios solo informan y ofrecen cancelar; no piden confirmación. El de la noche anterior se envía entre las 19:00 y las 21:00 del día anterior, no se envía si la cita se agendó después de las 21:00 ni para citas del mismo día. El de una hora antes se envía siempre y en ese momento se vuelve a verificar afiliación, vigencia y autorizaciones; si algo cambió, se cancelan las citas de la fórmula, se anulan los códigos, se liberan existencias y cupos, la fórmula queda no apta, se registra qué dato cambió y cuándo, y se notifica el motivo y el siguiente paso. Se envía un único recordatorio de revalidación 48 horas después de informar que no había disponibilidad, y un aviso de próxima entrega 2 días antes de la siguiente fecha habilitada de cada fórmula crónica entregada."
Épica: EPIC-005

## Análisis
- Objetivo: enviar notificaciones y recordatorios multicanal sobre los eventos del proceso de pre-dispensación, protegiendo los datos sensibles y aplicando las validaciones previas a la cita.
- Alcance inicial: envío de notificaciones por navegadores web vinculados, chats de Telegram vinculados, SMS y correo electrónico para confirmaciones, recordatorios, cancelaciones, expiraciones, pérdida de medicamentos, revalidaciones y avisos de próxima entrega.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario, EPS simulada, inventario simulado.
- Contexto aplicable: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8.

## Modelo de dominio
- Notificación: pertenece al paciente y a un evento del sistema; se envía por múltiples canales. Origen: contexto 3.6.
- Canal: navegador web, chat de Telegram, SMS o correo electrónico. Origen: contexto 3.1, 3.6.
- Cita: pertenece al paciente y a un punto; almacena fecha, ventana y código de entrega. Origen: contexto 3.5.
- Fórmula: pertenece al paciente; se evalúa como apta o no apta. Origen: contexto 3.4.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- DEC-040 (responde a OPEN-Q-001): afecta [RF-049, RF-050, BR-021, CL-015, AC-025]. Todos actualizados.
- DEC-041 (responde a OPEN-Q-002): afecta [RF-044, RF-045, RF-046, RNF-013, BR-020, CL-013, AC-023, AC-024]. Todos actualizados.
- DEC-042 (responde a OPEN-Q-003): afecta [RNF-013]. Actualizado.

## Preguntas de aclaración
No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Garantizar la comunicación oportuna de los eventos del proceso de pre-dispensación a través de todos los canales del paciente, asegurando la verificación de requisitos antes de la cita y la confidencialidad de la información en salud.

### 2. Contexto
El sistema notifica a los pacientes sobre sus citas, recordatorios y estados de las fórmulas empleando todos los canales disponibles (web, Telegram, SMS y correo). Al cumplirse el plazo para el recordatorio de una hora antes, el sistema revalida la afiliación, vigencia y autorizaciones para cancelar automáticamente la cita si se detecta alguna novedad.
Decisiones del equipo:
- DEC-040. La notificación de cancelación por cambios en la revalidación de una hora antes informa que la cita fue cancelada, el motivo del cambio y el siguiente paso, sin incluir nombres de medicamentos ni diagnósticos. Responde a OPEN-Q-001.
- DEC-041. Las plantillas de notificación informan el evento, punto, fecha y ventana cuando aplique, e incluyen una instrucción para consultar el detalle en el flujo autenticado, sin incluir nombres de medicamentos ni diagnósticos. Responde a OPEN-Q-002.
- DEC-042. El orden, paralelismo y manejo de fallas de los servicios externos son responsabilidad de la arquitectura, exigiendo intentar la entrega por todos los medios disponibles sin depender de un único canal. Responde a OPEN-Q-003.

### 3. Alcance
- Envío simultáneo de notificaciones por web, Telegram, SMS y correo electrónico.
- Envío de confirmación de cita, recordatorio de la noche anterior, recordatorio de una hora antes, cancelación, expiración, pérdida de medicamento, recordatorio de revalidación y aviso de próxima entrega.
- Revalidación automática y cancelación en el recordatorio de una hora antes.
- Restricción estricta de contenido para excluir nombres de medicamentos y diagnósticos.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario, EPS simulada.
- HU-007. Como paciente o cuidador, quiero recibir notificaciones en todos mis canales sobre el estado de mis citas y recordatorios, para estar informado sin exponerme a demoras en el punto.

### 5. Requisitos funcionales
- RF-043. El sistema debe enviar cada notificación por todos los medios disponibles del paciente: notificación web a navegadores vinculados, Telegram a chats vinculados, SMS al celular registrado y correo si existe. Origen: contexto 3.6, necesidad.
- RF-044. El sistema debe enviar la confirmación de cita indicando el evento, punto, fecha, ventana y la instrucción de consultar el detalle en el flujo autenticado, sin nombres de medicamentos ni diagnósticos. Origen: contexto 3.6, DEC-041.
- RF-045. El sistema debe enviar el recordatorio de la noche anterior entre las 19:00 y las 21:00 del día anterior, informando y ofreciendo la opción de cancelar sin pedir confirmación, excluyendo citas agendadas después de las 21:00 y citas del mismo día. Origen: contexto 3.6, necesidad.
- RF-046. El sistema debe enviar el recordatorio de una hora antes de la cita a todos los pacientes, informando y ofreciendo la opción de cancelar sin pedir confirmación. Origen: contexto 3.6, necesidad.
- RF-047. Al momento de enviar el recordatorio de una hora antes, el sistema debe volver a verificar afiliación, vigencia y autorizaciones en la EPS simulada. Origen: contexto 3.6, necesidad.
- RF-048. Si al revalidar una hora antes se detecta un cambio desfavorable en afiliación, vigencia o autorizaciones, el sistema debe cancelar las citas de la fórmula, anular los códigos de entrega, liberar existencias y cupos, y marcar la fórmula como no apta. Origen: contexto 3.6, necesidad.
- RF-049. Si el sistema cancela una cita por novedad en la revalidación de una hora antes, debe registrar qué dato cambió y cuándo. Origen: contexto 3.6, necesidad.
- RF-050. Si se cancela una cita por la revalidación de una hora antes, el sistema debe notificar el motivo de la cancelación y el siguiente paso (acudir a la EPS o iniciar una nueva solicitud), sin incluir nombres de medicamentos ni diagnósticos. Origen: contexto 3.6, necesidad, DEC-040.
- RF-051. El sistema debe enviar un único recordatorio de revalidación exactamente 48 horas después de informar que no había disponibilidad, indicando la opción de volver a validar. Origen: contexto 3.6, necesidad.
- RF-052. El sistema debe enviar un aviso de próxima entrega 2 días antes de la siguiente fecha habilitada de cada fórmula crónica entregada. Origen: contexto 3.6, necesidad.
- RF-053. El sistema debe notificar la expiración, la cancelación voluntaria y la pérdida de medicamentos de acuerdo con los eventos correspondientes. Origen: contexto 3.6, necesidad.

### 6. Requisitos no funcionales
- RNF-013. Privacidad y canalización: Ninguna notificación, por ningún medio, debe incluir nombres de medicamentos ni diagnósticos. Se verifica mediante auditoría de las plantillas y registros de envío. Origen: contexto 3.6, RNF-04, DEC-41.
- RNF-014. Multicanalidad: El sistema no debe depender de un único canal y debe intentar la entrega por todos los medios disponibles del paciente. Se verifica mediante pruebas de integración de canales. Origen: contexto 3.6, RNF-12, DEC-42.

### 7. Reglas de negocio
- BR-019. Exclusión de datos sensibles: Las notificaciones solo pueden incluir punto, fecha, ventana e instrucciones de consulta en el flujo autenticado; nunca revelan diagnósticos ni nombres de medicamentos. Origen: contexto 3.6.
- BR-020. Alcance de los recordatorios: Los recordatorios solo informan y ofrecen cancelar; no solicitan confirmación de asistencia. Origen: contexto 3.6.
- BR-021. Cancelación preventiva por revalidación: Si la revalidación de una hora antes falla, la cancelación es automática, la fórmula pasa a no apta, los cupos se liberan y se instruye al usuario sobre el siguiente paso. Origen: contexto 3.6.

### 8. Flujo principal
1. El sistema identifica un evento que requiere notificación (confirmación, recordatorio, cancelación, expiración, pérdida, revalidación o próxima entrega).
2. El sistema recupera los canales vinculados y datos de contacto del paciente (web, Telegram, SMS, correo).
3. El sistema genera el mensaje cumpliendo estrictamente con la restricción de no incluir nombres de medicamentos ni diagnósticos.
4. El sistema ejecuta el envío por todos los canales disponibles en paralelo o según la arquitectura dispuesta, sin depender de un único canal.
5. El sistema registra el evento de notificación enviado.

### 9. Flujos alternativos y de excepción
- A1. El paciente tiene una cita programada para el día siguiente y la hora actual se encuentra entre las 19:00 y las 21:00:
  1. El sistema envía el recordatorio de la noche anterior.
  2. El sistema ofrece la opción de cancelar sin solicitar confirmación.
- E1. La cita fue agendada después de las 21:00 o corresponde al mismo día:
  1. El sistema omite el envío del recordatorio de la noche anterior.
- E2. Al enviar el recordatorio de una hora antes, la revalidación de afiliación, vigencia o autorizaciones arroja un cambio negativo:
  1. El sistema cancela las citas de la fórmula.
  2. El sistema anula los códigos de entrega.
  3. El sistema libera existencias y cupos.
  4. El sistema marca la fórmula como no apta y registra el dato que cambió y la fecha/hora.
  5. El sistema notifica el motivo de la cancelación y el siguiente paso, sin nombres de medicamentos ni diagnósticos.

### 10. Casos límite
- CL-013. Notificación a paciente con múltiples canales activos: El sistema envía la notificación de forma simultánea a todos los navegadores web, chats de Telegram, número de SMS y correo electrónico registrados. Origen: contexto 3.6.
- CL-014. Cita agendada a las 21:01 para el día siguiente: El sistema no envía el recordatorio de la noche anterior por haberse agendado fuera del horario establecido. Origen: contexto 3.6.
- CL-015. Falla en la revalidación de una hora antes por afiliación inactiva: El sistema cancela la cita de inmediato, libera los recursos y notifica al usuario que debe acudir a la EPS. Origen: contexto 3.6.

### 11. Criterios de aceptación
- AC-023. Dado un paciente con web, Telegram, SMS y correo configurados, cuando se genera una notificación de confirmación de cita, entonces el mensaje se despacha por todos los medios sin incluir nombres de medicamentos ni diagnósticos. Origen: contexto 3.6.
- AC-024. Dado un paciente con cita para el día siguiente agendada a las 20:00, cuando el reloj marca las 19:30, entonces el sistema envía el recordatorio de la noche anterior informando la cita y ofreciendo cancelar sin exigir confirmación. Origen: contexto 3.6.
- AC-025. Dado un paciente a una hora de su cita, cuando la revalidación detecta que la fórmula venció, entonces el sistema cancela la cita, libera los cupos, marca la fórmula como no apta y notifica el motivo y el siguiente paso sin revelar datos clínicos. Origen: contexto 3.6.
- AC-026. Dado que pasaron 48 horas desde que se informó la falta de disponibilidad, cuando se cumple el plazo, entonces el sistema envía un único recordatorio de revalidación por todos los canales del paciente. Origen: contexto 3.6.

### 12. Dependencias
- Verificación de identidad y canales vinculados.
- EPS simulada para consultas de afiliación, vigencia y autorizaciones.
- Inventario simulado para liberación de cupos y existencias.
- Servicios externos reales de Telegram, SMS y correo electrónico.

### 13. Restricciones
- Equipo de cuatro personas y aproximadamente 8 semanas (contexto 3.9).
- Sin acceso a los sistemas de Disfarma y trabajando desde afuera (contexto 3.9).
- Ley 1581 de 2012 y Decreto 1377 de 2013 sobre protección de datos sensibles de salud (contexto 3.11).
- Decreto Ley 019 de 2012, artículo 131, y Resolución 1604 de 2013 sobre la entrega de pendientes por parte de la EPS (contexto 3.11).
- Decreto Ley 019 de 2012, artículo 120, sobre la prohibición de trasladar trámites de autorización al usuario (contexto 3.11).

### 14. Fuera de alcance
- Domicilio (contexto 3.10).
- Aplicación móvil instalable y WhatsApp (contexto 3.10).
- Trámite de autorizaciones por el sistema (contexto 3.10).
- Reporte de concordancia entre prevalidación y validación oficial (contexto 3.10).
- Manejo interno del enrutamiento de red de los servicios de SMS y correo: tema para arquitectura. Origen: RNF-014.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-040)
- OPEN-Q-002: Respondida (DEC-041)
- OPEN-Q-003: Respondida (DEC-042)

### 16. Trazabilidad
- HU-007: RF-043, RF-044, RF-045, RF-046, RF-047, RF-048, RF-049, RF-050, RF-051, RF-052, RF-053; RNF-013, RNF-014; BR-019, BR-020, BR-021; AC-023, AC-024, AC-025, AC-026; CL-013, CL-014, CL-015.
- RF-043: verificado por AC-023.
- RF-045: verificado por AC-024.
- RF-048, RF-050: verificado por AC-025.
- RF-051: verificado por AC-026.
- BR-019: verificado por AC-023.
- CL-015: verificado por AC-025.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad y contexto de notificaciones.
- Versión 1.0: incorporación de respuestas a preguntas de aclaración sobre plantillas, cancelaciones y manejo de canales externos. Estado Candidata.

## Verificación
- Completitud: cumple. Se cubren todas las notificaciones descritas en el contexto y los flujos de validación previa.
- Consistencia interna: cumple. Los requisitos funcionales, reglas de negocio y criterios de aceptación alinean la restricción de datos y el comportamiento de la revalidación de una hora antes.
- Consistencia con el contexto: cumple. Se respetan estrictamente las reglas de canales, restricciones de contenido (sin nombres de medicamentos ni diagnósticos) y plazos del contexto 3.6.
- No ambigüedad: cumple. Los canales, los tiempos de envío y las condiciones de cancelación están detallados sin ambigüedades.
- Verificabilidad: cumple. Cada requisito cuenta con criterios de aceptación en formato Dado-Cuando-Entonces comprobables.
- Trazabilidad: cumple. Todos los requisitos derivan de la necesidad y del contexto 3.6, con su correspondiente trazabilidad en la sección 16.
- No invención: cumple. No se incluyeron reglas de negocio ni cifras que no provengan del contexto o de las decisiones del equipo.
- Delimitación: cumple. Los aspectos técnicos de pasarela y redes se derivan a arquitectura y los alcances fuera de norma se listan en exclusiones.

## Siguiente paso
La SPEC-005 versión 1.0 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
