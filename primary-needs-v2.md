# Necesidades principales — Pharma Express

- **Versión:** v2 (corrige v1)
- **Fuente de verdad:** `contexto_proyecto.md` (v1, aprobado)

> **Convención.** Cada necesidad lleva un identificador `REQ-XXX` para la trazabilidad de la SPEC y su origen en el contexto del proyecto.
> - `[CONFIRMADO]`: está en `contexto_proyecto.md`; se indica la sección.
> - `[PENDIENTE]`: aparece en la v1 de estas necesidades pero no está en el contexto; requiere decisión del equipo (ver «Notas para validación»).
>
> Las necesidades se redactan como comportamiento esperado. Las decisiones de tecnología y arquitectura no van aquí.

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
