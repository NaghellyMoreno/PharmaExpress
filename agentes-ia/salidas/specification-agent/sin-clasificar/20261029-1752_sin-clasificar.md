<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:52
Petición: Consentimiento, identidad y derechos del titular. Antes de pedir cualquier dato, el sistema muestra el aviso de privacidad y exige aceptar el tratamiento de datos con la declaración "soy el titular o actúo con su autorización", registrando si aceptó el titular o un tercero, la fecha, la hora y el canal. Si no acepta, se informa la atención presencial y no se registra nada. La identidad se verifica con la cédula y un código de un solo uso enviado por SMS al celular registrado en la EPS simulada y, si existe, por correo; el código vence a los 10 minutos y admite 3 intentos. Si falla, se ofrece ruta alterna: nuevo código, orientación para actualizar datos en la EPS o atención presencial. Antes de cargar documentos se pide una autorización separada para datos de salud. Con identidad verificada, el titular puede revocar el consentimiento y pedir la eliminación de sus datos; se cancelan citas, se anulan códigos, se liberan existencias y cupos, se desvinculan los canales y se eliminan los datos personales y de salud. EPIC-001.
-->

## Preguntas de aclaración
- OPEN-Q-001. Cuando se ofrece la ruta alterna tras fallar la verificación de identidad, ¿el sistema permite reintentar inmediatamente con un nuevo código tantas veces como se quiera, o existe un límite global de generación de códigos por tiempo o por número de cédula?
  Por qué importa: define si hay protección contra abuso o saturación del servicio de SMS.
  Crítica: sí
  Propuesta del agente: permitir pedir un nuevo código sin un límite estricto en el prototipo, pero mostrando la orientación y la opción presencial.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-002. Respecto a la revocación del consentimiento y eliminación de datos, cuando se eliminan los datos personales y de salud del titular, ¿qué registro queda en el sistema (por ejemplo, para auditoría o estadísticas) o se borra absolutamente todo sin dejar rastro?
  Por qué importa: define el alcance de la operación de eliminación y el cumplimiento normativo.
  Crítica: sí
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-003. Cuando la persona indica que es un tercero actuando en nombre del titular, ¿el sistema le solicita algún dato adicional de identificación del tercero (como su cédula o nombre), o solo registra que aceptó un tercero con la declaración exigida?
  Por qué importa: define el nivel de trazabilidad sobre quién realizó la aceptación en nombre del paciente.
  Crítica: no
  Propuesta del agente: registrar únicamente que aceptó un tercero con la declaración, sin exigir la cédula del tercero, tal como indica el contexto 3.2 y la necesidad.
  Estado: Pendiente
  Responsable: equipo
