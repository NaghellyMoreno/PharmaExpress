<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:55
Petición: Notificaciones y recordatorios. Cada notificación se envía por todos los medios del paciente: notificación de la web a los navegadores vinculados, Telegram a los chats vinculados, SMS al celular registrado y correo si existe. Ninguna notificación, en ningún canal, incluye nombres de medicamentos ni diagnósticos; puede incluir punto, fecha, ventana e instrucción de consultar el detalle en el flujo autenticado. Se notifican confirmación de cita, recordatorio de la noche anterior, recordatorio de una hora antes, cancelación, expiración, pérdida de medicamento, recordatorio de revalidación y aviso de próxima entrega. Los recordatorios solo informan y ofrecen cancelar; no piden confirmación. El de la noche anterior se envía entre las 19:00 y las 21:00 del día anterior, no se envía si la cita se agendó después de las 21:00 ni para citas del mismo día. El de una hora antes se envía siempre y en ese momento se vuelve a verificar afiliación, vigencia y autorizaciones; si algo cambió, se cancelan las citas de la fórmula, se anulan los códigos, se liberan existencias y cupos, la fórmula queda no apta, se registra qué dato cambió y cuándo, y se notifica el motivo y el siguiente paso. Se envía un único recordatorio de revalidación 48 horas después de informar que no había disponibilidad, y un aviso de próxima entrega 2 días antes de la siguiente fecha habilitada de cada fórmula crónica entregada. EPIC-005.
-->

## Preguntas de aclaración
- OPEN-Q-001. Cuando el recordatorio de una hora antes detecta un cambio (afiliación, vigencia o autorizaciones) y cancela las citas, ¿qué texto exacto debe llevar la notificación del motivo y el siguiente paso para el usuario?
  Por qué importa: define el contenido de una notificación crítica de fallo en el último momento.
  Crítica: sí
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-002. ¿Cuál es el formato o la plantilla general exacta para las notificaciones de confirmación de cita, expiración, pérdida de medicamento, recordatorio de revalidación y aviso de próxima entrega, asegurando que ninguna incluya nombres de medicamentos ni diagnósticos?
  Por qué importa: garantiza el cumplimiento estricto de la regla de privacidad de datos de salud en todos los canales.
  Crítica: sí
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-003. Si un paciente tiene múltiples navegadores vinculados y chats de Telegram configurados, ¿el envío simultáneo por todos los medios se ejecuta en un orden específico o en paralelo, y cómo se maneja si falla el envío en uno de los canales externos reales (correo o SMS)?
  Por qué importa: define el comportamiento técnico y operativo de la multicanalidad síncrona o asíncrona.
  Crítica: no
  Estado: Pendiente
  Responsable: equipo
