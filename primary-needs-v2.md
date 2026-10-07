# Necesidades principales — Pharma Express

- **Versión:** v2.2 (añade el catálogo de épicas; v2.1 corrigió la fuente de verdad y añadió REQ-013 a REQ-026)
- **Fuente de verdad:** `PHARMA_EXPRESS_AGENTES.md` (Versión: 1, Estado: Aprobado)

> **Convención.** Cada necesidad lleva un identificador `REQ-XXX` para la trazabilidad de la SPEC y su origen en el contexto del proyecto.
> - `[CONFIRMADO]`: está en `PHARMA_EXPRESS_AGENTES.md`; se indica la sección.
> - `[PENDIENTE]`: no está resuelto en el contexto; requiere decisión del equipo (ver «Notas para validación»).
>
> Las necesidades se redactan como comportamiento esperado. Las decisiones de tecnología y arquitectura no van aquí.
>
> **Copia y pega.** Entrega **solo la necesidad**, en texto plano (puedes copiarla tal cual de una sección de este archivo): `Carga y reintento de documentos. El usuario carga las fórmulas...`. No hace falta indicar REQ ni épica: el agente pregunta por la épica en su ronda de preguntas (`OPEN-Q-`) y **la decides tú** respondiendo con el ID del catálogo de la sección 6. Si el mensaje sí trae `EPIC-00x`, el agente la usa y no pregunta. Necesidades relacionadas pueden pegarse juntas para que queden en la misma SPEC (p. ej. las dos de recordatorios).

---

## 1. Necesidades funcionales

- **REQ-001 — Identidad y consentimiento** `[CONFIRMADO, contexto 3.2]`
  Antes de procesar cualquier dato, el sistema debe mostrar el aviso de privacidad y exigir su aceptación. La identidad se valida únicamente con la cédula y un código de un solo uso, con vigencia de 10 minutos y máximo 3 intentos.

- **REQ-002 — Prevalidación escalonada por fórmula** `[CONFIRMADO, contexto 3.4]`
  Cada fórmula se valida bajo la regla «todo o nada». Los requisitos se verifican en este orden: afiliación activa, vigencia de la fórmula (dato que entrega la EPS simulada), cobertura PBS, autorización y, solo si el tratamiento es crónico, habilitación de entrega según la fecha habilitada.

- **REQ-003 — Ventanas y agendamiento** `[CONFIRMADO, contexto 3.5]`
  Las citas se reservan en ventanas de 1 hora con capacidad limitada.
  - Tratamiento agudo: el mismo día, en ventanas que inicien al menos una hora después de agendar, o el día siguiente.
  - Tratamiento crónico: exclusivamente el día calendario siguiente.
  - Si una cita incluye algún medicamento crónico, aplica la regla del crónico.

## 2. Necesidades no funcionales

- **REQ-004 — Privacidad de datos sensibles en notificaciones** `[CONFIRMADO, contexto 3.6]`
  Ninguna notificación ni recordatorio, por ningún medio (web, Telegram, SMS o correo), incluye nombres de medicamentos ni diagnósticos.

- **REQ-005 — Cero sobre-reservas** `[CONFIRMADO, contexto 3.5]`
  Nunca existe una cita sin medicamentos reservados ni se supera la capacidad de una ventana. Si dos personas intentan confirmar el mismo cupo o las mismas existencias a la vez, solo una lo consigue y a la otra se le informa y se le muestran las opciones actualizadas.

- **REQ-006 — Ejecución programada sin intervención de usuarios** `[CONFIRMADO, contexto 3.6]`
  El sistema debe, sin que ninguna persona lo active:
  - enviar el recordatorio del día anterior entre las 19:00 y las 21:00;
  - enviar el recordatorio una hora antes de la cita y, en ese momento, volver a verificar afiliación, vigencia y autorizaciones.

## 3. Necesidades de integración

- **REQ-007 — Fuentes de verdad simuladas** `[CONFIRMADO, contexto 3.8 y 3.10]`
  La afiliación, los datos de contacto, las fórmulas, las autorizaciones y el inventario provienen de una EPS simulada y de un inventario simulado. Quedan fuera las conexiones reales con MIPRES, ADRES y los sistemas de Disfarma.

- **REQ-008 — Mensajería real** `[CONFIRMADO, contexto 3.1 y 3.8]`
  El envío de SMS, de correo y el bot de Telegram son servicios reales. El bot solo escribe después de que la persona lo inicia.

- **REQ-009 — Aislamiento de identidad de los canales** `[CONFIRMADO, contexto 2.3 y 3.1]`
  Los identificadores de transporte (usuario, número de chat y nombre visible de Telegram) se usan solo para vincular y enrutar mensajes. Nunca prueban la identidad del paciente.

## 4. Necesidades operativas y de trazabilidad

- **REQ-010 — Registro del consentimiento** `[CONFIRMADO, contexto 3.2]`
  El sistema debe conservar un registro que indique si la aceptación del tratamiento de datos la hizo el titular o un tercero (cuidador o facilitador), con la fecha y el canal utilizado.
  Ver nota N-1 sobre la inmutabilidad.

- **REQ-011 — Trazabilidad de cancelaciones automáticas** `[CONFIRMADO, contexto 3.6]`
  Si en la verificación de una hora antes cambia la afiliación, la vigencia o una autorización, el sistema debe:
  - cancelar las citas de la fórmula y liberar los medicamentos y cupos;
  - dejar la fórmula como no apta;
  - registrar qué dato cambió y cuándo;
  - notificar el motivo y el siguiente paso.

- **REQ-012 — Cierre de la dispensación** `[CONFIRMADO, contexto 3.7]`
  El dispensador registra la validación oficial presencial y cierra cada medicamento como entregado o no entregado. Los motivos de no entrega son:
  1. afiliación inactiva;
  2. fórmula vencida o inválida;
  3. autorización no vigente;
  4. medicamento no cubierto;
  5. datos del paciente no coinciden;
  6. sin existencias pese a reserva;
  7. otro, con descripción.

---

## 5. Necesidades añadidas en la v2.1 (REQ-013 a REQ-026)

> Estas conductas ya están aprobadas en el contexto del proyecto, pero no tenían ninguna necesidad asignada. Como el Specification Agent solo analiza la necesidad que se le entrega, sin un REQ nadie se las habría pedido y nunca habrían llegado a una SPEC. Todas son funcionales salvo REQ-022 y REQ-023 (operativas / configuración).

- **REQ-013 — Vinculación de canales y apoyo de terceros** `[CONFIRMADO, contexto 3.3]`
  Después de verificar la identidad, el chat de Telegram o el navegador queda vinculado al paciente. Un mismo chat o navegador puede quedar vinculado a varios pacientes, sin límite, y se escoge el paciente antes de cada gestión. Toda vinculación vence a los 3 meses y exige un código nuevo; mientras esté vencida, ese canal no muestra información, no permite gestiones y no recibe notificaciones (los SMS y correos siguen llegando). Quien ingresa el código correcto puede hacer todas las gestiones del paciente: el sistema no distingue entre paciente, cuidador, tutor o facilitador, y esto aplica también a menores y a personas con tutor.

- **REQ-014 — Autorización de datos de salud separada** `[CONFIRMADO, contexto 3.2]`
  La autorización para tratar datos de salud es separada del aviso de privacidad y se pide antes de cargar cualquier documento.

- **REQ-015 — Revocación de consentimiento y eliminación de datos** `[CONFIRMADO, contexto 3.2]`
  El titular puede revocar su consentimiento y pedir que se eliminen sus datos. Si tiene reservas activas, estas se eliminan, y el cupo y los medicamentos quedan disponibles para otras personas. Si la persona no acepta el tratamiento de datos desde el inicio, no se registra nada.

- **REQ-016 — Carga y reintento de documentos** `[CONFIRMADO, contexto 3.4]`
  El usuario carga las fórmulas y la historia clínica, en foto o PDF, por la web o por Telegram. Si de un documento no se obtienen los datos (ilegible, incompleto, sin diagnóstico o sin coincidencia con la EPS simulada), se pide cargarlo de nuevo. Si el problema persiste, la fórmula queda no apta y se orienta a la atención presencial.

- **REQ-017 — Clasificación del tratamiento por catálogo configurable** `[CONFIRMADO, contexto 3.4]`
  El tipo de tratamiento sale del diagnóstico. Un catálogo configurable define qué diagnósticos son crónicos; cualquier otro se trata como agudo.

- **REQ-018 — Independencia de fórmulas y resultado preliminar** `[CONFIRMADO, contexto 3.4]`
  Las fórmulas separadas son independientes: las aptas continúan y para las no aptas se indica que se gestionen con la EPS. Todo resultado se presenta como preliminar, con el aviso de que la validación oficial ocurre en el punto.

- **REQ-019 — Código de entrega** `[CONFIRMADO, contexto 3.5 y 3.7]`
  Cada cita tiene un código de entrega de un solo uso, en QR y numérico. El usuario lo consulta en la web o en Telegram cuando lo necesita; no tiene que guardarlo al agendar. El código solo es válido en su punto, dentro de su ventana y una sola vez.

- **REQ-020 — Ciclo de vida de la reserva** `[CONFIRMADO, contexto 3.5 y 3.7]`
  La reserva se hace por solicitud; si los medicamentos están en puntos distintos, se agenda una cita por punto. La confirmación es atómica: las citas de una misma fórmula se reservan todas o ninguna. La reserva expira al terminar la ventana y, si el paciente llega antes, espera a que inicie. No hay reprogramación: el usuario puede cancelar en cualquier momento y para obtener otra cita debe iniciar una nueva solicitud. Si el paciente ya recibió parte de una fórmula y no recoge el resto, lo no recogido se pierde y la fórmula se cierra; si no recibió nada, todo se libera. Si en el punto hay una novedad con algún medicamento, el usuario la gestiona con Disfarma: el sistema no crea pendientes ni gestiona entregas parciales.

- **REQ-021 — Indisponibilidad: espera de 48 horas** `[CONFIRMADO, contexto 3.5]`
  Si un medicamento no tiene existencias en ningún punto, o no hay ventanas con cupo en los días permitidos, no se crea un pendiente. Se informa que debe esperar 48 horas para volver a validar y se envía un único recordatorio a las 48 horas. El sistema no vigila el inventario.

- **REQ-022 — Acceso y validación en el punto** `[CONFIRMADO, contexto 3.7]`
  El dispensador entra al sistema con su usuario de rol dispensador; es el único actor con cuenta. La hora de llegada del paciente es el momento en que el dispensador valida el código. El dispensador ve la prevalidación del paciente y registra la validación oficial. Complementa REQ-012.

- **REQ-023 — Configuración de puntos, ventanas e inventario** `[CONFIRMADO, contexto 3.8]`
  Los puntos de dispensación, su horario, ventanas, capacidad e inventario son configurables, al igual que los puntos, enlaces y trámites de autorización de cada EPS. Los puntos de dispensación y la validación oficial también son simulados. Salud Total y Sanitas siguen las mismas reglas; la EPS es un dato del paciente. Complementa REQ-007.

- **REQ-024 — Entrega multicanal y reglas de los recordatorios** `[CONFIRMADO, contexto 3.6]`
  Cada notificación se envía por todos los medios del paciente: notificación de la web a los navegadores vinculados, Telegram a los chats vinculados, SMS al celular registrado y correo si existe. Reglas de los recordatorios: no se envía el del día anterior si la cita se agendó después de las 21:00 ni en citas del mismo día; el de una hora antes lo reciben todos; solo informan y ofrecen cancelar, no piden confirmación. El sistema no avisa cuando llega un medicamento ni cuando la EPS aprueba una autorización. Suele pegarse junto con REQ-006.

- **REQ-025 — Aviso de la siguiente fecha habilitada** `[CONFIRMADO, contexto 3.6]`
  No existe cita de continuidad. Después de entregar una fórmula crónica, el sistema avisa 2 días antes de la siguiente fecha habilitada para que el usuario inicie una nueva prevalidación.

- **REQ-026 — Reglas compartidas de los canales** `[CONFIRMADO, contexto 3.1]`
  La web y el bot de Telegram permiten el recorrido completo: verificar la identidad, vincular el canal, cargar documentos, prevalidar, agendar, consultar, cancelar y recibir notificaciones. Los enlaces directos al bot son apoyo opcional y nunca llevan cédula, diagnósticos, medicamentos ni otros datos sensibles. La atención presencial sigue disponible fuera del sistema, incluso si la persona no acepta el tratamiento de datos.

---

## 6. Catálogo de épicas (guía humana para agrupar las SPEC)

> La épica es una decisión de planificación del equipo, no del agente. Este catálogo es tu referencia para responder cuando el Specification Agent la pregunte: el agente solo **registra** el ID que tú respondes en la línea `Épica:` de la SPEC; después, el Architecture Agent recibe varias SPECs de una misma épica con `--epica EPIC-00x` y las analiza como un conjunto. Si en el mensaje no traes la épica, el agente la pide como `OPEN-Q-` y trabaja con `Épica: pendiente` hasta que respondas — nunca la supone ni la propone.

| Épica | Nombre | Agrupa | Necesidades |
|---|---|---|---|
| `EPIC-001` | Identidad y consentimiento | Verificación de identidad, aviso y consentimientos, registro y revocación | REQ-001, REQ-010, REQ-014, REQ-015 |
| `EPIC-002` | Vinculación y canales | Vinculación de canales, vigencia, apoyo de terceros y reglas compartidas web/Telegram | REQ-009, REQ-013, REQ-026 |
| `EPIC-003` | Documentos y prevalidación | Carga de documentos, clasificación del tratamiento y prevalidación «todo o nada» | REQ-002, REQ-016, REQ-017, REQ-018 |
| `EPIC-004` | Reserva y agenda | Ventanas, reservas, código de entrega, cancelaciones e indisponibilidad | REQ-003, REQ-005, REQ-019, REQ-020, REQ-021 |
| `EPIC-005` | Notificaciones | Entrega multicanal, privacidad, recordatorios, re-verificación y avisos | REQ-004, REQ-006, REQ-011, REQ-024, REQ-025 |
| `EPIC-006` | Dispensación en el punto | Acceso y validación del dispensador, cierre de medicamentos | REQ-012, REQ-022 |
| `EPIC-007` | Integraciones y configuración | Fuentes simuladas, servicios reales de mensajería y configuración de puntos/EPS | REQ-007, REQ-008, REQ-023 |

**Reglas de uso:**

1. **No hace falta anteponer nada.** Pegas solo la necesidad; el agente pregunta la épica y tú respondes con el ID de esta tabla. Si prefieres saltarte la pregunta, antepon `EPIC-00x` en el mensaje y el agente la usa sin preguntar.
2. **Una épica = un mensaje por necesidad.** Puedes pegar varias necesidades de la **misma** épica en un solo mensaje si quieres que queden en una misma SPEC (p. ej. las dos de recordatorios, EPIC-005); nunca mezcles necesidades de épicas distintas en un mensaje.
3. **Catálogo vivo.** Si al redactar notas que una necesidad encaja mejor en otra épica, muevela y actualiza esta tabla; el cambio queda registrado en la propia SPEC al confirmar la épica.
4. **Numeración fija:** 7 épicas, `EPIC-001` a `EPIC-007`. Para una épica futura, continuar en `EPIC-008` sin reutilizar ni reasignar.

---

## Notas para validación del equipo

- **N-1 — «Registro inmutable» (v1, REQ-010).** La v1 pedía que el registro del consentimiento fuera inmutable. El contexto solo pide registrar quién aceptó, cuándo y por qué canal. Se retiró el término; si el equipo lo necesita, debe aprobarlo y quedaría como requisito nuevo. `[PENDIENTE]`
- **N-2 — Alcance de la autorización (REQ-002).** El contexto dice que un medicamento no cubierto por PBS continúa solo si está autorizado, y también que se consulta la autorización de cada medicamento. No queda claro si un medicamento cubierto por PBS sin autorización deja la fórmula no apta. `[PENDIENTE]`

## Cambios respecto a la v1

- Se numeraron las necesidades (REQ-001 a REQ-012) y se indicó su origen en el contexto.
- «Vigencia de 8 a 9 meses» pasó a «dato que entrega la EPS simulada», porque el rango es de los datos de prueba y no una regla.
- «Re-validación de los requisitos» se acotó a afiliación, vigencia y autorizaciones, como dice el contexto.
- «Motor de tareas», «diseño transaccional» y «la base de datos debe almacenar» se reescribieron como comportamiento esperado.
- Las notificaciones se amplían a los cuatro medios del contexto (web, Telegram, SMS y correo).
- Los motivos de no entrega pasaron de dos ejemplos a la lista completa.

## Cambios de la v2.1

- **Fuente de verdad corregida:** el archivo aprobado es `PHARMA_EXPRESS_AGENTES.md`; `contexto_proyecto.md` no existía en el proyecto.
- **Nuevos REQ-013 a REQ-026:** conductas aprobadas en el contexto que no tenían necesidad asignada (vinculación, documentos, código de entrega, reserva, dispensador, configuración, notificaciones, canales). Se numeraron al final para no renumerar REQ-001 a REQ-012.
- **No se añadieron como necesidades** las restricciones del proyecto (3.9) ni el contexto normativo (3.11): no son conductas que se le pidan al Specification Agent. Él las toma del contexto y las escribe en la sección 13 «Restricciones» de cada SPEC, y el Architecture Agent también las recibe inyectadas.
- **No se añadieron secciones nuevas para N-1 ni N-2:** esos sí son casos donde el agente debe preguntar (salen como `OPEN-Q-`), que es justamente su mecanismo.

## Cambios de la v2.2

- **Nuevo catálogo de épicas (sección 6):** 7 épicas (`EPIC-001` a `EPIC-007`) con sus nombres y las necesidades que agrupa, cubriendo los 26 REQ. Sirve de guía al humano para agrupar las SPEC que genera el Specification Agent y para alimentar `--epica` del Architecture Agent.
- Se precisó el bloque «Copia y pega» para que el prefijo de épica apunte al catálogo.
- **Flujo de épica por pregunta (v2.2):** se pega solo la necesidad; el agente pide la épica como `OPEN-Q-` sin proponerla y el equipo responde con el ID del catálogo (el prefijo `EPIC-00x` en el mensaje sigue siendo opcional para saltarse la pregunta).
