## 1. Necesidades Funcionales
* **Gestión de Identidad y Consentimiento:** El flujo exige validar la identidad exclusivamente con la cédula y un código OTP de 10 minutos (con límite de 3 intentos), requiriendo de forma estricta la aceptación del aviso de privacidad antes de procesar cualquier dato.
* **Lógica de Prevalidación Escalonada:** El sistema debe ejecutar una validación de "todo o nada" por fórmula médica, verificando en orden secuencial: afiliación activa, vigencia de 8 a 9 meses, cobertura PBS, existencia de autorización y fecha habilitada si el tratamiento es crónico.
* **Reglas de Ventanas y Agendamiento:** Las reservas deben estructurarse en bloques de 1 hora con capacidad limitada; los tratamientos agudos pueden agendarse para el mismo día o el siguiente, mientras que los crónicos se agendan exclusivamente para el día calendario siguiente.

## 2. Necesidades No Funcionales
* **Privacidad de Datos Sensibles:** La arquitectura debe garantizar que ninguna notificación o recordatorio emitido por SMS, correo electrónico o Telegram incluya nombres de medicamentos o diagnósticos clínicos.
* **Concurrencia y Cero Sobre-reservas:** El diseño transaccional debe impedir que se agenden citas si no hay capacidad en la ventana o si el inventario no está asegurado, exigiendo un bloqueo preciso para no comprometer existencias inexistentes.
* **Trabajos Asíncronos Programados:** Se requiere un motor de tareas en segundo plano que dispare notificaciones el día anterior entre las 19:00 y 21:00, y que ejecute una re-validación automática de los requisitos exactamente una hora antes de la cita.

## 3. Necesidades de Integración
* **Fuentes de Verdad Simuladas:** La arquitectura debe acoplarse a una EPS simulada y a un inventario ficticio, descartando conexiones reales con MIPRES, ADRES o los sistemas en vivo de Disfarma.
* **Pasarelas Reales de Mensajería:** El sistema debe integrarse con servicios en vivo para el transporte de SMS, correos electrónicos y un bot interactivo de Telegram que responde solo tras ser iniciado por el usuario.
* **Aislamiento de Identidad de Canales:** El diseño debe garantizar que los identificadores de transporte (como el número de chat o el usuario de Telegram) se utilicen únicamente para la vinculación y el enrutamiento de mensajes, nunca como prueba de la identidad del paciente.

## 4. Necesidades Operativas y de Trazabilidad
* **Auditoría de Tratamiento de Datos:** La base de datos debe almacenar un registro inmutable que indique si la aceptación legal de privacidad fue realizada por el titular o por un tercero (cuidador o facilitador), documentando la fecha y el canal utilizado.
* **Trazabilidad de Cancelaciones Automáticas:** Si el sistema detecta un cambio en las condiciones durante la re-validación de una hora antes, debe registrar exactamente qué dato cambió y en qué momento, liberando el cupo automáticamente.
* **Cierre de Dispensación:** El panel del dispensador requiere registrar la validación oficial presencial y capturar catálogos de motivos específicos si un medicamento no se entrega (por ejemplo, afiliación inactiva o falta de existencias pese a la reserva).