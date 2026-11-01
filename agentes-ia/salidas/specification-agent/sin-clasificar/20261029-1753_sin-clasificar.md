<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:53
Petición: Canales, vinculación y selección de paciente. La aplicación web y el bot de Telegram permiten el flujo completo: verificar identidad, vincular el canal, cargar documentos, prevalidar, agendar, consultar el estado, ver el código de entrega, cancelar, desvincular y revocar. El bot solo interactúa después de que la persona lo inicia y publica una política de privacidad. Después de verificar la identidad, el chat o el navegador queda vinculado al paciente; un mismo canal puede quedar vinculado a varios pacientes sin límite y, si hay más de uno, se exige escoger el paciente antes de cada gestión y se muestra durante toda la gestión. La vinculación vence a los 3 meses y se reactiva con un nuevo código; mientras está vencida no muestra información, no permite gestiones y no recibe notificaciones por ese canal, aunque los SMS y correos continúan. Se puede desvincular un paciente. La web ofrece un enlace profundo al bot sin cédula, diagnósticos, medicamentos ni otros datos sensibles. El usuario consulta el estado de cada fórmula, las citas con punto y ventana, y el código de entrega en QR y numérico. EPIC-002.
-->

## Preguntas de aclaración
- OPEN-Q-001. Cuando un canal (chat de Telegram o navegador) tiene múltiples pacientes vinculados y uno de ellos vence a los 3 meses, ¿la expiración es independiente por cada paciente vinculado al mismo canal o expira toda la sesión del canal bloqueando a todos los pacientes?
  Por qué importa: define si la expiración de la vinculación afecta al canal completo o a la asociación específica entre canal y paciente.
  Crítica: sí
  Propuesta del agente: la expiración de los 3 meses se aplica de forma independiente a cada vinculación entre un canal y un paciente, permitiendo que un canal conserve pacientes con vinculación vigente mientras otros vencen.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-002. Al realizar una desvinculación voluntaria de un paciente por parte del usuario, ¿el sistema debe exigir una confirmación adicional antes de eliminar la vinculación del canal?
  Por qué importa: afecta el flujo de desvinculación y la prevención de errores del usuario.
  Crítica: no
  Propuesta del agente: el sistema exige una confirmación simple antes de hacer efectiva la desvinculación.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-003. Cuando un canal intenta realizar cualquier gestión o consulta con una vinculación vencida (más de 3 meses), ¿el sistema debe guiar automáticamente al usuario para renovarla con un código nuevo o simplemente rechaza la acción sin iniciar el flujo de autenticación?
  Por qué importa: define la experiencia de usuario y el comportamiento ante una vinculación expirada.
  Crítica: sí
  Propuesta del agente: el sistema muestra el mensaje de vencimiento e inicia de inmediato el flujo para solicitar un código nuevo de verificación.
  Estado: Pendiente
  Responsable: equipo
