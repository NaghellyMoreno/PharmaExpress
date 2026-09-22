# Historias de Usuario — Pharma Express
---

## Épica 1 — Acceso y registro

### HU-01
**Yo, como** paciente afiliado a una EPS,
**quiero** registrarme con mi tipo y número de documento,
**para** poder consultar y gestionar mis fórmulas sin ir al punto de dispensación.

**Está hecho cuando:**
- El paciente se registra con tipo de documento, número, nombre y celular.
- El sistema rechaza documentos ya registrados y muestra un mensaje claro.
- Se crea la cuenta y el paciente queda listo para iniciar sesión.

### HU-02
**Yo, como** paciente,
**quiero** aceptar de forma explícita el tratamiento de mis datos personales y de salud,
**para** saber qué información se usa y con qué fin antes de entregarla.

**Está hecho cuando:**
- Se muestra la autorización antes de completar el registro.
- Sin aceptación no se puede continuar.
- Queda registrada la fecha y hora de la aceptación.

### HU-03
**Yo, como** paciente registrado,
**quiero** ingresar con mi documento y un código enviado a mi celular,
**para** acceder a mi información sin tener que recordar una contraseña.

**Está hecho cuando:**
- El código llega al celular registrado y vence a los pocos minutos.
- Un código incorrecto o vencido no permite el ingreso.

### HU-04
**Yo, como** paciente,
**quiero** ver los puntos de dispensación de Manizales con dirección y horario,
**para** elegir el que me quede más cerca o me convenga.

**Está hecho cuando:**
- Se listan los puntos con dirección, horario y EPS que atienden.
- El paciente puede marcar un punto como preferido.

---

## Épica 2 — Pre-validación de la fórmula

### HU-05
**Yo, como** paciente,
**quiero** registrar mi fórmula médica (número y foto),
**para** que se pueda revisar antes de que yo vaya al punto.

**Está hecho cuando:**
- Se puede ingresar el número de fórmula y adjuntar una foto legible.
- La fórmula queda asociada al paciente con estado "Pendiente de validación".

### HU-06
**Yo, como** paciente,
**quiero** saber si mi afiliación a la EPS está activa,
**para** no desplazarme si no me van a poder atender.

**Está hecho cuando:**
- **Dado** que mi afiliación está activa en la EPS simulada, **cuando** consulto, **entonces** veo "Afiliación activa".
- **Dado** que estoy suspendido o retirado, **cuando** consulto, **entonces** veo el motivo y a quién debo acudir.

### HU-07
**Yo, como** paciente,
**quiero** saber si mi fórmula sigue vigente,
**para** pedir una nueva al médico antes de hacer el trámite.

**Está hecho cuando:**
- Se muestra la fecha de expedición y la fecha límite de vigencia.
- Si está vencida, se indica claramente y no se permite continuar al agendamiento.

### HU-08
**Yo, como** paciente,
**quiero** conocer si mi medicamento tiene autorización aprobada y vigente,
**para** no enterarme en ventanilla de que me falta un trámite.

**Está hecho cuando:**
- Se muestra el estado: aprobada, pendiente, negada o vencida.
- En los estados distintos a "aprobada" se indica el siguiente paso ante la EPS.

### HU-09
**Yo, como** paciente,
**quiero** saber si mi medicamento está cubierto por el Plan de Beneficios en Salud (PBS),
**para** saber de antemano si me lo entregan o qué trámite adicional requiere.

**Está hecho cuando:**
- Se indica si el medicamento está o no cubierto por el PBS.
- Si no está cubierto, se explica el trámite que corresponde.

### HU-10
**Yo, como** paciente,
**quiero** ver en una sola pantalla el resultado de todas las validaciones,
**para** entender rápidamente si puedo reclamar mi medicamento o qué me falta.

**Está hecho cuando:**
- Se muestran afiliación, vigencia, autorización y cobertura con su estado.
- Solo si todas son favorables aparece "Lista para agendar".
- Si alguna falla, se muestra cuál y qué hacer.

### HU-11
**Yo, como** paciente con fórmula pre-validada,
**quiero** saber si mi medicamento está disponible en el punto que elegí,
**para** no ir a un punto donde está agotado.

**Está hecho cuando:**
- Se muestra disponible, disponibilidad parcial o agotado según el inventario simulado.
- Si está agotado, se sugieren otros puntos con existencia.

---

## Épica 3 — Agendamiento de turno

### HU-12
**Yo, como** paciente con fórmula lista para agendar,
**quiero** ver los turnos disponibles para el día siguiente en mi punto,
**para** escoger la hora que mejor se ajusta a mi rutina.

**Está hecho cuando:**
- Se muestran franjas horarias con cupos disponibles.
- Las franjas llenas aparecen como no disponibles.

### HU-13
**Yo, como** paciente,
**quiero** reservar un turno en una franja horaria,
**para** llegar a una hora definida y ser atendido sin hacer la fila general.

**Está hecho cuando:**
- Al confirmar, el cupo se descuenta de la franja.
- No se puede agendar más de un turno para la misma fórmula.
- No se permite agendar si la pre-validación no está completa.

### HU-14
**Yo, como** paciente con turno agendado,
**quiero** recibir un código de turno con la fecha, hora y punto,
**para** presentarlo en ventanilla y ser identificado rápidamente.

**Está hecho cuando:**
- Se genera un código único (alfanumérico y QR).
- La confirmación queda visible en la app y se envía al celular.

### HU-15
**Yo, como** paciente,
**quiero** cancelar o cambiar mi turno,
**para** liberar el cupo si no puedo asistir y elegir otro horario.

**Está hecho cuando:**
- Al cancelar, el cupo vuelve a estar disponible.
- Al reprogramar, se libera el turno anterior y se genera un nuevo código.

---

## Épica 4 — Reserva de medicamentos

### HU-16
**Yo, como** paciente con turno agendado,
**quiero** que mi medicamento quede apartado para mi turno,
**para** tener la certeza de que estará disponible cuando llegue.

**Está hecho cuando:**
- Al agendar, se descuenta la cantidad formulada del inventario disponible.
- La reserva queda vinculada al código del turno.

### HU-17
**Yo, como** coordinador del punto de dispensación,
**quiero** que las reservas se liberen si el paciente no llega en el tiempo de tolerancia,
**para** que el medicamento quede disponible para otros pacientes.

**Está hecho cuando:**
- Pasado el tiempo de tolerancia, la reserva vuelve al inventario.
- El turno queda marcado como "No asistió" y se notifica al paciente.

### HU-18
**Yo, como** paciente,
**quiero** ser avisado antes de mi turno si solo hay entrega parcial,
**para** decidir si voy o espero la entrega completa.

**Está hecho cuando:**
- Se informa qué cantidad se entregará y cuál queda pendiente.
- El paciente puede mantener o reprogramar el turno.

---

## Épica 5 — Canal WhatsApp

### HU-19
**Yo, como** paciente que usa WhatsApp pero no quiere instalar otra app,
**quiero** consultar el estado de mi fórmula por WhatsApp,
**para** saber si puedo reclamar sin descargar nada.

**Está hecho cuando:**
- Con el documento y un código de verificación, el paciente recibe el resultado de la pre-validación.
- Las respuestas usan lenguaje sencillo y opciones numeradas.

### HU-20
**Yo, como** paciente,
**quiero** agendar mi turno desde WhatsApp,
**para** hacer todo el proceso desde la aplicación que ya uso.

**Está hecho cuando:**
- El paciente elige punto y franja con opciones numeradas.
- Recibe el código de turno en el mismo chat.
- Las reglas son las mismas que en la app (HU-13).

### HU-21
**Yo, como** paciente con turno agendado,
**quiero** recibir un recordatorio antes de mi turno,
**para** no olvidarlo y llevar el documento y el código.

**Está hecho cuando:**
- El recordatorio llega con fecha, hora, punto y código.
- Incluye la opción de cancelar desde el mismo mensaje.

---

## Épica 6 — Atención asistida (personas sin celular o sin WhatsApp)

### HU-22
**Yo, como** familiar o cuidador de un adulto mayor,
**quiero** gestionar la fórmula y el turno a nombre de él,
**para** que reciba el beneficio aunque no use el celular.

**Está hecho cuando:**
- El cuidador puede agregar a otra persona indicando su documento y parentesco.
- El turno y el código quedan a nombre del paciente, con el cuidador como contacto.

### HU-23
**Yo, como** adulto mayor o persona que no sabe usar el celular,
**quiero** que un funcionario del punto o de una línea telefónica me agende el turno,
**para** no tener que esperar horas aunque no use la tecnología.

**Está hecho cuando:**
- El funcionario puede buscar al paciente por documento y hacer la pre-validación y el agendamiento.
- El paciente recibe el código impreso o dictado.

### HU-24
**Yo, como** adulto mayor, persona con discapacidad o gestante,
**quiero** que mi turno sea marcado como preferencial,
**para** ser atendido con prioridad según mi condición.

**Está hecho cuando:**
- Al agendar se puede marcar la condición preferencial.
- El turno aparece identificado como preferencial en la lista del punto.

---

## Épica 7 — Operación en el punto de dispensación

### HU-25
**Yo, como** auxiliar de dispensación,
**quiero** ver la lista de turnos del día con sus validaciones ya hechas,
**para** preparar los pedidos antes de que lleguen los pacientes.

**Está hecho cuando:**
- Se listan los turnos por hora, con paciente, medicamentos y estado.
- Los turnos preferenciales se destacan.

### HU-26
**Yo, como** auxiliar de dispensación,
**quiero** ingresar o escanear el código del turno,
**para** identificar al paciente y su pedido sin repetir las validaciones.

**Está hecho cuando:**
- Al ingresar el código se muestran el paciente, la fórmula y la reserva.
- Un código inválido, vencido o de otro punto muestra un mensaje claro.

### HU-27
**Yo, como** auxiliar de dispensación,
**quiero** registrar la entrega total o parcial del medicamento,
**para** cerrar el turno y dejar trazabilidad de lo entregado.

**Está hecho cuando:**
- Se registra la cantidad entregada y la pendiente.
- El turno pasa a "Entregado" o "Entrega parcial" y el inventario se actualiza.

---

## Épica 8 — Gestión y seguimiento

### HU-28
**Yo, como** coordinador del punto de dispensación,
**quiero** definir cuántos turnos se atienden por franja horaria,
**para** ajustar la oferta a la capacidad real del personal.

**Está hecho cuando:**
- Se pueden configurar franjas y cupos por día.
- Los cambios no afectan turnos ya agendados.

### HU-29
**Yo, como** coordinador del punto de dispensación,
**quiero** ver turnos agendados, atendidos, cancelados, inasistencias y tiempo promedio de atención,
**para** medir si el sistema está reduciendo la espera y tomar decisiones.

**Está hecho cuando:**
- Los indicadores se muestran por día y por punto.
- Se puede comparar el tiempo de atención con turno frente a sin turno.

### HU-30
**Yo, como** coordinador del punto de dispensación,
**quiero** ver las causas más frecuentes por las que las fórmulas no pasan la pre-validación,
**para** identificar los problemas recurrentes (autorizaciones, vigencia, afiliación) y orientar mejor a los pacientes.

**Está hecho cuando:**
- Se agrupan los rechazos por causa y por EPS.
- Se puede filtrar por rango de fechas.