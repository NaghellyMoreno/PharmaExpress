# Historias de Usuario — Pharma Express

Versión: 2
Fuente de verdad: PHARMA_EXPRESS_AGENTES.md (versión 1, aprobado). Cada historia indica la sección del contexto de donde sale.
Canales: todas las historias del paciente aplican por la aplicación web y por el bot de Telegram (contexto 3.1). La atención presencial sigue disponible fuera del sistema.
Actores: paciente, persona que actúa por el paciente (cuidador, tutor o familiar), facilitador comunitario y dispensador (contexto 2.3). El sistema no distingue al paciente de quien actúa por él (contexto 3.3).

---

## Épica 1 — Consentimiento, identidad y vinculación

### HU-01 — Aceptar el tratamiento de datos
**Yo, como** paciente o persona que actúa por él,
**quiero** conocer el aviso de privacidad y aceptar el tratamiento de datos antes de entregar cualquier dato,
**para** saber qué información se usa y con qué fin.

**Está hecho cuando:**
- **Dado** que inicio una gestión, **cuando** el sistema me pide un dato, **entonces** antes me muestra el aviso de privacidad y la declaración "soy el titular o actúo con su autorización".
- **Dado** que acepto, **cuando** se registra la aceptación, **entonces** queda si aceptó el titular o un tercero, la fecha y el canal.
- **Dado** que no acepto, **cuando** cierro el aviso, **entonces** no se registra nada y se me informa que la atención presencial sigue disponible.

Origen: contexto 3.1 y 3.2.

### HU-02 — Verificar mi identidad con un código
**Yo, como** paciente o persona que actúa por él,
**quiero** verificar la identidad con la cédula y un código de un solo uso,
**para** gestionar las fórmulas sin crear una cuenta ni recordar una contraseña.

**Está hecho cuando:**
- **Dado** que ingreso una cédula, **cuando** pido el código, **entonces** llega por SMS al celular registrado en la EPS simulada y, si existe, al correo registrado.
- **Dado** que recibí el código, **cuando** lo ingreso dentro de los 10 minutos y en máximo 3 intentos, **entonces** la identidad queda verificada.
- **Dado** que el código venció o agoté los 3 intentos, **cuando** el sistema lo detecta, **entonces** me ofrece tres caminos: pedir un código nuevo, recibir orientación para actualizar los datos en la EPS o acudir a la atención presencial.

Origen: contexto 3.2.

### HU-03 — Vincular mi canal
**Yo, como** paciente o persona que actúa por él,
**quiero** que mi chat de Telegram o mi navegador quede vinculado después de verificar la identidad,
**para** hacer las gestiones y recibir notificaciones sin verificarme cada vez.

**Está hecho cuando:**
- **Dado** que verifiqué la identidad, **cuando** termina la verificación, **entonces** el chat o el navegador queda vinculado al paciente.
- **Dado** que la vinculación cumplió 3 meses, **cuando** intento usar el canal, **entonces** se me pide un código nuevo, y mientras tanto el canal no muestra información, no permite gestiones ni recibe notificaciones.
- **Dado** que la vinculación de un canal está vencida, **cuando** se envía una notificación, **entonces** los SMS y correos siguen llegando.

Origen: contexto 3.3.

### HU-04 — Gestionar a varios pacientes desde un mismo canal
**Yo, como** cuidador o facilitador comunitario,
**quiero** vincular a varios pacientes en mi chat o navegador,
**para** apoyar a cada persona sin usar una interfaz distinta.

**Está hecho cuando:**
- **Dado** que verifiqué con el código de otro paciente, **cuando** termina la verificación, **entonces** ese paciente se agrega a mi canal, sin límite de pacientes.
- **Dado** que mi canal tiene más de un paciente vinculado, **cuando** inicio una gestión, **entonces** debo escoger el paciente antes de continuar.

Origen: contexto 2.3 y 3.3.

### HU-05 — Revocar el consentimiento
**Yo, como** titular de los datos,
**quiero** revocar el consentimiento y pedir que se eliminen mis datos,
**para** ejercer mi derecho sobre mi información.

**Está hecho cuando:**
- **Dado** que revoco el consentimiento, **cuando** confirmo la solicitud, **entonces** mis datos se eliminan.
- **Dado** que tengo reservas activas, **cuando** se eliminan mis datos, **entonces** las reservas se eliminan y el cupo y los medicamentos quedan disponibles para otras personas.

Origen: contexto 3.2.

---

## Épica 2 — Documentos y prevalidación

### HU-06 — Cargar fórmulas e historia clínica
**Yo, como** paciente o persona que actúa por él,
**quiero** cargar las fórmulas y la historia clínica en foto o PDF,
**para** que se revisen antes de desplazarme al punto.

**Está hecho cuando:**
- **Dado** que no he autorizado el tratamiento de datos de salud, **cuando** intento cargar un documento, **entonces** el sistema me pide esa autorización por separado antes de recibirlo.
- **Dado** que de un documento no se obtienen los datos (ilegible, incompleto, sin diagnóstico o sin coincidencia con la EPS simulada), **cuando** el sistema lo revisa, **entonces** me pide cargarlo de nuevo.
- **Dado** que el problema persiste después de cargarlo de nuevo, **cuando** el sistema lo revisa, **entonces** la fórmula queda no apta y se me orienta a la atención presencial.

Origen: contexto 3.2 y 3.4.

### HU-07 — Conocer si mi afiliación está activa
**Yo, como** paciente,
**quiero** saber si mi afiliación está activa antes de seguir con la solicitud,
**para** no desplazarme si no me pueden entregar.

**Está hecho cuando:**
- **Dado** que inicio una solicitud, **cuando** empieza la prevalidación, **entonces** la afiliación se verifica una sola vez para toda la solicitud.
- **Dado** que la afiliación está inactiva en la EPS simulada, **cuando** se verifica, **entonces** se detiene toda la solicitud y se me orienta hacia la EPS.

Origen: contexto 3.4.

### HU-08 — Conocer si mi fórmula está vigente
**Yo, como** paciente,
**quiero** saber si cada fórmula está vigente,
**para** pedir una nueva valoración médica a tiempo.

**Está hecho cuando:**
- **Dado** que la EPS simulada indica que la fórmula está vigente, **cuando** se prevalida, **entonces** la fórmula continúa con la siguiente verificación.
- **Dado** que la fórmula no está vigente, **cuando** se prevalida, **entonces** se me indica que requiere una nueva valoración médica.

Origen: contexto 3.4. La vigencia es un dato de la EPS simulada; no se usa la regla de 30 días.

### HU-09 — Conocer la cobertura PBS de mis medicamentos
**Yo, como** paciente,
**quiero** saber si cada medicamento está cubierto por el PBS,
**para** saber de antemano si me lo pueden entregar.

**Está hecho cuando:**
- **Dado** que un medicamento está cubierto por el PBS, **cuando** se prevalida, **entonces** continúa con la verificación de autorización.
- **Dado** que un medicamento no está cubierto, **cuando** se prevalida, **entonces** solo continúa si está autorizado.

Origen: contexto 3.4.

### HU-10 — Conocer si mis medicamentos están autorizados
**Yo, como** paciente,
**quiero** saber si cada medicamento tiene autorización en la EPS,
**para** no enterarme en la ventanilla de que me falta un trámite.

**Está hecho cuando:**
- **Dado** que falta la autorización de un medicamento, **cuando** se prevalida, **entonces** el sistema me muestra los puntos, enlaces o trámites de autorización de mi EPS.
- **Dado** que falta la autorización, **cuando** el sistema me orienta, **entonces** no tramita la autorización ni vigila su estado, y me indica que vuelva a consultar por mi cuenta.

Origen: contexto 3.4 y 3.11 (Decreto Ley 019 de 2012, artículo 120).

### HU-11 — Conocer si mi fórmula crónica está habilitada para entrega
**Yo, como** paciente con tratamiento crónico,
**quiero** saber si mi fórmula ya está habilitada para la siguiente entrega,
**para** no pedir una cita antes de tiempo.

**Está hecho cuando:**
- **Dado** que el diagnóstico de la fórmula está en el catálogo de diagnósticos crónicos, **cuando** se prevalida, **entonces** la fórmula se trata como crónica; si no está, se trata como aguda.
- **Dado** que la fórmula es crónica, **cuando** se prevalida, **entonces** es apta solo si la fecha habilitada de entrega es igual o anterior a la fecha de la cita posible.

Origen: contexto 3.4.

### HU-12 — Ver el resultado preliminar de cada fórmula
**Yo, como** paciente,
**quiero** ver el resultado de la prevalidación de cada fórmula,
**para** saber qué fórmulas puedo agendar y qué debo gestionar con la EPS.

**Está hecho cuando:**
- **Dado** que un medicamento de una fórmula no cumple, **cuando** veo el resultado, **entonces** toda la fórmula aparece no apta.
- **Dado** que tengo varias fórmulas, **cuando** veo el resultado, **entonces** las aptas continúan y para las no aptas se me indica que las gestione con la EPS.
- **Dado** cualquier resultado, **cuando** lo veo, **entonces** se presenta como preliminar, con el aviso de que la validación oficial ocurre en el punto.

Origen: contexto 3.4.

---

## Épica 3 — Disponibilidad, reserva y cita

### HU-13 — Ver las ventanas disponibles
**Yo, como** paciente con fórmulas aptas,
**quiero** ver las ventanas con cupo en los puntos que tienen mis medicamentos,
**para** escoger cuándo recogerlos.

**Está hecho cuando:**
- **Dado** que todas mis fórmulas son agudas, **cuando** veo las ventanas, **entonces** se me ofrecen ventanas del mismo día que inicien al menos una hora después de agendar, o del día siguiente.
- **Dado** que la cita incluye algún medicamento crónico, **cuando** veo las ventanas, **entonces** solo se me ofrecen ventanas del día calendario siguiente.
- **Dado** que mis medicamentos están en puntos distintos, **cuando** veo las opciones, **entonces** se me propone una cita por punto.
- **Dado** que una ventana no tiene cupo, **cuando** veo las opciones, **entonces** esa ventana no se ofrece.

Origen: contexto 3.5.

### HU-14 — Confirmar la cita con los medicamentos reservados
**Yo, como** paciente,
**quiero** que al confirmar la cita mis medicamentos y mi cupo queden reservados,
**para** tener la certeza de que estarán disponibles cuando llegue.

**Está hecho cuando:**
- **Dado** que confirmo, **cuando** se crea la cita, **entonces** quedan reservados los medicamentos y el cupo; nunca existe una cita sin medicamentos reservados ni se supera la capacidad de la ventana.
- **Dado** que una fórmula necesita citas en varios puntos, **cuando** confirmo, **entonces** se reservan todas o ninguna.
- **Dado** que otra persona confirmó antes el último cupo o las últimas existencias, **cuando** confirmo, **entonces** se me informa y se me muestran las opciones actualizadas.
- **Dado** que termina la ventana de la cita, **cuando** no se ha entregado, **entonces** la reserva expira.

Origen: contexto 3.5.

### HU-15 — Saber qué hacer si no hay disponibilidad
**Yo, como** paciente,
**quiero** que se me informe cuando no hay existencias ni ventanas con cupo,
**para** saber cuándo volver a intentarlo.

**Está hecho cuando:**
- **Dado** que un medicamento no tiene existencias en ningún punto, o no hay ventanas con cupo en los días permitidos, **cuando** busco una cita, **entonces** se me informa que debo esperar 48 horas para volver a validar y no se crea un pendiente.
- **Dado** que se me informó la espera, **cuando** pasan 48 horas, **entonces** recibo un único recordatorio.
- **Dado** el mensaje de espera, **cuando** lo leo, **entonces** no se presenta como cumplimiento de la obligación de entrega de 48 horas de la EPS.

Origen: contexto 3.5 y 3.11.

### HU-16 — Consultar el código de entrega
**Yo, como** paciente o persona que actúa por él,
**quiero** consultar el código de entrega de mi cita cuando lo necesite,
**para** presentarlo en el punto sin tener que guardarlo al agendar.

**Está hecho cuando:**
- **Dado** que tengo una cita, **cuando** consulto por la web o por Telegram, **entonces** veo el código de entrega en QR y en formato numérico.
- **Dado** que una cita tiene un código, **cuando** se usa en el punto, **entonces** no se puede volver a usar.

Origen: contexto 3.5 y 3.7.

### HU-17 — Cancelar mi cita
**Yo, como** paciente o persona que actúa por él,
**quiero** cancelar una cita en cualquier momento,
**para** liberar los medicamentos y el cupo si no puedo ir.

**Está hecho cuando:**
- **Dado** que no he recibido nada de la fórmula, **cuando** cancelo, **entonces** se liberan todos los medicamentos y cupos.
- **Dado** que ya recibí parte de la fórmula, **cuando** cancelo el resto, **entonces** lo no recogido se pierde y la fórmula se cierra.
- **Dado** que cancelé, **cuando** quiero otra cita, **entonces** debo iniciar una nueva solicitud, porque no hay reprogramación.

Origen: contexto 3.5 y 3.10.

---

## Épica 4 — Notificaciones y recordatorios

Todas las historias de esta épica cumplen dos reglas del contexto 3.6: cada notificación se envía por todos los medios del paciente (web y Telegram vinculados, SMS y correo si existe) y ninguna incluye nombres de medicamentos ni diagnósticos.

### HU-18 — Recibir el recordatorio del día anterior
**Yo, como** paciente con una cita,
**quiero** recibir un recordatorio la noche anterior,
**para** organizar mi desplazamiento.

**Está hecho cuando:**
- **Dado** que tengo una cita para el día siguiente, **cuando** son entre las 19:00 y las 21:00, **entonces** recibo el recordatorio con la opción de cancelar, sin pedir confirmación.
- **Dado** que agendé la cita después de las 21:00 o la cita es del mismo día, **cuando** llega esa franja, **entonces** no recibo este recordatorio.

Origen: contexto 3.6.

### HU-19 — Recibir el recordatorio una hora antes
**Yo, como** paciente con una cita,
**quiero** recibir un recordatorio una hora antes,
**para** no olvidar la cita.

**Está hecho cuando:**
- **Dado** que tengo una cita, **cuando** falta una hora, **entonces** recibo el recordatorio con la opción de cancelar, sin pedir confirmación.

Origen: contexto 3.6.

### HU-20 — Saber si algo cambió antes de mi cita
**Yo, como** paciente con una cita,
**quiero** que se verifique de nuevo mi información antes de la cita,
**para** no desplazarme si ya no me pueden entregar.

**Está hecho cuando:**
- **Dado** que se envía el recordatorio de una hora antes, **cuando** el sistema verifica de nuevo afiliación, vigencia y autorizaciones, **entonces**, si nada cambió, la cita se mantiene.
- **Dado** que alguno de esos datos cambió, **cuando** el sistema lo detecta, **entonces** cancela las citas de la fórmula, libera los medicamentos y cupos, deja la fórmula no apta y registra qué dato cambió y cuándo.
- **Dado** que se canceló por un cambio, **cuando** se me notifica, **entonces** recibo el motivo y el siguiente paso.

Origen: contexto 3.6.

### HU-21 — Saber cuándo iniciar mi siguiente entrega crónica
**Yo, como** paciente con tratamiento crónico,
**quiero** recibir un aviso antes de mi siguiente fecha habilitada,
**para** iniciar a tiempo una nueva prevalidación.

**Está hecho cuando:**
- **Dado** que se me entregó una fórmula crónica, **cuando** faltan 2 días para la siguiente fecha habilitada, **entonces** recibo un aviso para iniciar una nueva prevalidación.
- **Dado** el aviso, **cuando** lo recibo, **entonces** no se crea una cita automáticamente.

Origen: contexto 3.6 y 3.10.

---

## Épica 5 — Atención en el punto

### HU-22 — Validar el código de entrega
**Yo, como** dispensador,
**quiero** ingresar con mi usuario y validar el código de entrega del paciente,
**para** identificar su cita y sus medicamentos reservados.

**Está hecho cuando:**
- **Dado** que ingreso con mi usuario de rol dispensador, **cuando** valido un código de mi punto dentro de su ventana, **entonces** veo la cita y se registra esa hora como la hora de llegada del paciente.
- **Dado** que el código es de otro punto, está fuera de su ventana o ya se usó, **cuando** lo valido, **entonces** el sistema lo rechaza.

Origen: contexto 3.7.

### HU-23 — Registrar la validación oficial
**Yo, como** dispensador,
**quiero** ver la prevalidación y registrar la validación oficial,
**para** dejar constancia de lo que verifiqué en el punto.

**Está hecho cuando:**
- **Dado** que validé el código, **cuando** abro la cita, **entonces** veo el resultado de la prevalidación.
- **Dado** que hice la validación oficial, **cuando** la registro, **entonces** queda asociada a la cita.

Origen: contexto 2.4 y 3.7.

### HU-24 — Cerrar cada medicamento
**Yo, como** dispensador,
**quiero** cerrar cada medicamento como entregado o no entregado,
**para** dejar trazabilidad de la atención.

**Está hecho cuando:**
- **Dado** que atiendo una cita, **cuando** cierro un medicamento, **entonces** lo marco como entregado o no entregado.
- **Dado** que un medicamento no se entrega, **cuando** lo cierro, **entonces** escojo un motivo: afiliación inactiva; fórmula vencida o inválida; autorización no vigente; medicamento no cubierto; datos del paciente no coinciden; sin existencias pese a reserva; u otro, con descripción.
- **Dado** que hubo una novedad con un medicamento, **cuando** cierro la atención, **entonces** el sistema no crea pendientes y el paciente la gestiona con Disfarma.

Origen: contexto 3.7 y 3.10.

---

## Pendiente de decisión del equipo

- Configuración: el contexto 3.8 dice que son configurables los puntos (horario, ventanas, capacidad e inventario), los enlaces y trámites de autorización de cada EPS, y el catálogo de diagnósticos crónicos (contexto 3.4). El contexto no define qué actor hace esa configuración; el dispensador es el único actor con usuario. Hasta que el equipo lo decida, no se escribe la historia.

---

## Trazabilidad con la versión 1

| Versión 1 | Versión 2 | Motivo |
|---|---|---|
| HU-01 Registrarse | Eliminada | El sistema no registra pacientes ni crea cuentas (contexto 3.2 y 3.10). |
| HU-02 Aceptar tratamiento de datos | HU-01 | Se agrega la declaración y el registro de titular o tercero, fecha y canal. |
| HU-03 Ingresar con código | HU-02 | El código dura 10 minutos, admite 3 intentos y llega por SMS y correo. |
| HU-04 Ver puntos y marcar preferido | Eliminada | El punto preferido no está en el contexto. La elección de punto queda en HU-13. |
| HU-05 Registrar fórmula | HU-06 | Se cargan fórmula e historia clínica en foto o PDF, con autorización de datos de salud. |
| HU-06 Afiliación | HU-07 | Se verifica una vez por solicitud y detiene toda la solicitud. |
| HU-07 Vigencia | HU-08 | La vigencia es un dato de la EPS simulada. |
| HU-08 Autorización | HU-10 | El sistema solo orienta; no tramita ni vigila. |
| HU-09 Cobertura PBS | HU-09 | Sin cambio de fondo. |
| HU-10 Resultado de validaciones | HU-12 | Resultado por fórmula, todo o nada, siempre preliminar. |
| HU-11 Disponibilidad en el punto | HU-13 | Se ofrecen puntos con existencias y ventanas con cupo. |
| HU-12 Turnos del día siguiente | HU-13 | "Turno" pasa a "cita" en una ventana de 1 hora; reglas de agudo y crónico. |
| HU-13 Reservar turno | HU-14 | Confirmación atómica y cero sobre-reservas. |
| HU-14 Código de turno | HU-16 | Código de entrega de un solo uso, en QR y numérico, consultable cuando se necesite. |
| HU-15 Cancelar o cambiar turno | HU-17 | No hay reprogramación (contexto 3.5 y 3.10). |
| HU-16 Medicamento apartado | HU-14 | La reserva hace parte de la confirmación. |
| HU-17 Liberar por tolerancia (coordinador) | HU-14 | No existe el rol coordinador ni tiempo de tolerancia: la reserva expira al terminar la ventana. |
| HU-18 Aviso de entrega parcial | Eliminada | Pendientes y entrega parcial están fuera de alcance (contexto 3.10). |
| HU-19 Consultar por WhatsApp | Eliminada | WhatsApp está fuera de alcance (contexto 3.10). El canal conversacional es Telegram. |
| HU-20 Agendar por WhatsApp | Eliminada | Igual que HU-19. |
| HU-21 Recordatorio | HU-18 y HU-19 | Dos recordatorios, sin nombres de medicamentos y sin pedir confirmación. |
| HU-22 Cuidador gestiona por el paciente | HU-04 | El cuidador usa el código del paciente; el sistema no lo distingue ni registra parentesco. |
| HU-23 Agendamiento por funcionario o línea telefónica | Eliminada | La atención presencial ocurre fuera del sistema (contexto 3.1); el apoyo de terceros no es una interfaz aparte (contexto 3.3). |
| HU-24 Turno preferencial | Eliminada | No está en el contexto. Si el equipo la quiere, debe aprobarse primero en el contexto. |
| HU-25 Lista de turnos del día | Eliminada | No está en el contexto. El dispensador ve la prevalidación al validar el código (HU-23). |
| HU-26 Escanear código | HU-22 | El código solo vale en su punto, en su ventana y una vez. |
| HU-27 Entrega total o parcial | HU-24 | Cada medicamento se cierra como entregado o no entregado, con motivo. |
| HU-28 Configurar cupos (coordinador) | Pendiente | El contexto no define qué actor configura. |
| HU-29 Indicadores | Eliminada | La medición y las metas de desempeño están fuera de alcance (contexto 3.10). |
| HU-30 Causas de rechazo | Eliminada | No está en el contexto. |
| — | HU-03, HU-05, HU-11, HU-15, HU-20, HU-21 | Nuevas: salen de los contextos 3.2, 3.3, 3.4, 3.5 y 3.6. |
