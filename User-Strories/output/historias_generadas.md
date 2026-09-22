# Backlog de historias de usuario

Prototipo funcional multicanal de pre-dispensación farmacéutica para permitir a los pacientes conocer la validez preliminar de su solicitud, la disponibilidad de sus medicamentos y agendar turnos o entregas para reducir tiempos de espera.

## HU-01 — Registro inicial de usuario

Como usuario afiliado quiero registrarme ingresando cédula, nombre, EPS y datos de contacto para tener acceso a la plataforma.

### Por qué se generó

La fuente indica que el MVP incluye el registro con cédula, nombre, EPS seleccionable y datos de contacto.

### Evidencia de contexto

- **PharmaExpress.md:** Cédula, nombre, EPS (seleccionable de una lista simulada) y Datos de contacto (teléfono, email, dirección)

### Criterios de aceptación

**CA-01**
- Dado que el usuario abre la pantalla de registro
- cuando ingresa su cédula, nombre, selecciona la EPS e ingresa sus datos de contacto
- entonces el sistema guarda la información del usuario correctamente


### Reglas de negocio

- La EPS debe ser seleccionable de una lista simulada. (Fuente: PharmaExpress.md: EPS (seleccionable de una lista simulada))

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-02 — Ingreso de cédula y EPS para pre-validación

Como usuario quiero ingresar mi número de cédula y EPS para iniciar la validación preliminar de mi solicitud de dispensación.

### Por qué se generó

El diagrama y los flujos de usuario indican que el proceso inicia ingresando la cédula y la EPS.

### Evidencia de contexto

- **Diagrama.excalidraw:** Ingresar cedula

### Criterios de aceptación

**CA-01**
- Dado que el usuario se encuentra en la interfaz de consulta
- cuando ingresa su número de cédula y selecciona su EPS
- entonces el sistema procede a realizar la pre-validación preliminar


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-03 — Validación preliminar de vigencia de fórmula

Como usuario quiero que el sistema valide si mi fórmula tiene una vigencia menor o igual a 30 días para conocer su validez preliminar.

### Por qué se generó

El alcance del MVP y el flujo de usuario especifican que se debe validar la fórmula vigente (menor o igual a 30 días).

### Evidencia de contexto

- **PharmaExpress.md:** Fórmula vigente (≤ 30 días)

### Criterios de aceptación

**CA-01**
- Dado que el usuario ingresa su cédula y EPS
- cuando el sistema verifica la fecha de la fórmula médica asociada
- entonces si la fórmula tiene más de 30 días, el sistema informa que debe consultar a su médico


### Reglas de negocio

- Las fórmulas tienen una vigencia no inferior a un mes / menor o igual a 30 días. (Fuente: PharmaExpress.md: Fórmula vigente (≤ 30 días))

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-04 — Validación preliminar de afiliación activa

Como usuario quiero que el sistema valide mi estado de afiliación para confirmar que se encuentra activo.

### Por qué se generó

El flujo de usuario del MVP exige validar la afiliación activa.

### Evidencia de contexto

- **PharmaExpress.md:** Afiliación activa

### Criterios de aceptación

**CA-01**
- Dado que el usuario solicita la pre-validación de su solicitud
- cuando el sistema consulta el estado de afiliación con la EPS
- entonces muestra si el estado de la afiliación está activo


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-05 — Visualización de medicamentos entregables y disponibilidad

Como usuario quiero visualizar la lista de medicamentos que puedo reclamar hoy para conocer la disponibilidad antes de desplazarme.

### Por qué se generó

El objetivo del prototipo y el alcance detallan mostrar la lista de medicamentos disponibles para reclamar hoy.

### Evidencia de contexto

- **PharmaExpress.md:** Lista de medicamentos que puede reclamar hoy. Información clara: nombre, concentración, cantidad, punto de recogida

### Criterios de aceptación

**CA-01**
- Dado que la pre-validación de afiliación y fórmula ha sido exitosa
- cuando el sistema consulta el inventario simulado
- entonces muestra el nombre, concentración, cantidad y punto de recogida de los medicamentos entregables


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-06 — Visualización de puntos de entrega con disponibilidad

Como usuario quiero que se muestren los puntos de entrega donde haya disponibilidad para poder seleccionar el lugar de recogida.

### Por qué se generó

El diagrama indica explícitamente mostrar los puntos de entrega donde haya disponibilidad para luego seleccionar el lugar.

### Evidencia de contexto

- **Diagrama.excalidraw:** Muestra los puntos de entrega donde haya disponibilidad

### Criterios de aceptación

**CA-01**
- Dado que el sistema verifica la disponibilidad de los medicamentos
- cuando se despliegan los puntos de atención
- entonces solo se muestran aquellos puntos de entrega que cuentan con disponibilidad


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-07 — Selección de lugar y agendamiento de turno

Como usuario quiero seleccionar el lugar de recogida y agendar una cita o turno para asegurar la entrega de mi medicamento.

### Por qué se generó

El diagrama y los objetivos específicos mencionan seleccionar el lugar y agendar turno/cita con el medicamento reservado.

### Evidencia de contexto

- **Diagrama.excalidraw:** Seleccionar el lugar y agendar turno

### Criterios de aceptación

**CA-01**
- Dado que se muestran los puntos de entrega disponibles
- cuando el usuario selecciona un punto y solicita agendar un turno
- entonces el sistema crea una orden y asigna el turno o cita correspondiente


### Reglas de negocio

- Asignar cita solo cuando el medicamento esté reservado, sin comprometer más existencias y respetando la capacidad del punto. (Fuente: Formulacion-inicial.pdf: Lograr que el paciente sólo reciba una cita cuando su medicamento esté disponible y reservado, sin comprometer más existencias de las disponibles. Tener en cuenta la capacidad del punto de atención.)

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-08 — Visualización del estado de la orden en tiempo real

Como usuario quiero ver el estado de mi orden en tiempo real para conocer el avance de mi solicitud.

### Por qué se generó

El flujo de usuario principal detalla que el usuario ve el estado de su orden en tiempo real tras crear la solicitud.

### Evidencia de contexto

- **PharmaExpress.md:** Usuario ve estado de su orden en tiempo real

### Criterios de aceptación

**CA-01**
- Dado que el usuario ha confirmado su solicitud de turno
- cuando accede a la sección de órdenes en la aplicación
- entonces visualiza el estado actual de su orden


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-09 — Recepción de notificación de pedido listo

Como usuario quiero recibir una notificación cuando mi pedido esté preparado para saber cuándo acudir al punto de recogida.

### Por qué se generó

El alcance incluye la notificación de pedido listo indicando la ventanilla o punto de recogida.

### Evidencia de contexto

- **PharmaExpress.md:** Notificación cuando el pedido está preparado. Se indica ventanilla o punto de recogida

### Criterios de aceptación

**CA-01**
- Dado que el dispensador marca la orden como lista
- cuando el sistema procesa el cambio de estado
- entonces el usuario recibe una notificación con la indicación de la ventanilla o punto de recogida


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-10 — Recogida express con código QR o número de orden

Como usuario quiero mostrar mi código QR o número de orden junto con mi cédula al llegar al punto para realizar una recogida express.

### Por qué se generó

El flujo de usuario de recogida detalla que el usuario muestra código QR o número de orden + cédula.

### Evidencia de contexto

- **PharmaExpress.md:** El usuario muestra código QR o número de orden + cédula

### Criterios de aceptación

**CA-01**
- Dado que el usuario llega al punto con una orden lista
- cuando presenta su código QR o número de orden y su cédula
- entonces el dispensador puede validar e identificar la orden


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-11 — Historial de dispensaciones

Como usuario quiero consultar mi historial de dispensaciones para ver pedidos anteriores, fechas y estados.

### Por qué se generó

El alcance del MVP contempla el módulo de historial de dispensaciones.

### Evidencia de contexto

- **PharmaExpress.md:** Pedidos anteriores, fechas y estados

### Criterios de aceptación

**CA-01**
- Dado que el usuario ha completado o realizado solicitudes previas
- cuando ingresa a la sección de historial de dispensación
- entonces visualiza el listado de pedidos anteriores, con sus fechas y estados


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-12 — Gestión de pendientes por falta de disponibilidad

Como usuario quiero ver la información de la causa y la fecha estimada de solución cuando un medicamento no esté disponible para conocer la ruta de entrega.

### Por qué se generó

El alcance del MVP y los objetivos específicos contemplan registrar el pendiente, informar la causa y la fecha estimada de solución (plazo de 48 horas).

### Evidencia de contexto

- **PharmaExpress.md:** Información de causa del pendiente (desabastecimiento simulado). Fecha estimada de solución (≤ 48 horas)

### Criterios de aceptación

**CA-01**
- Dado que el sistema detecta que un medicamento no está disponible en inventario
- cuando el usuario consulta su solicitud
- entonces el sistema muestra el motivo del pendiente, la fecha estimada de solución y la ruta de entrega prevista


### Reglas de negocio

- Cumplir con el plazo de entrega de pendientes en 48 horas de la Resolución 1604 de 2013. (Fuente: PharmaExpress.md: Fecha estimada de solución (≤ 48 horas))

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-13 — Panel del dispensador para marcar órdenes como listas

Como personal dispensador quiero ver la lista de órdenes pendientes y marcar una orden como lista para notificar al usuario.

### Por qué se generó

El panel mínimo del dispensador debe permitir ver órdenes pendientes y marcar una orden como lista.

### Evidencia de contexto

- **PharmaExpress.md:** Ver lista de órdenes pendientes. Marcar orden como 'lista'

### Criterios de aceptación

**CA-01**
- Dado que el dispensador accede al panel mínimo
- cuando visualiza las órdenes pendientes y selecciona una para marcarla como lista
- entonces el estado de la orden cambia a listo y se dispara la notificación al usuario


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-14 — Cierre de entrega por el personal dispensador

Como personal dispensador quiero cerrar cada entrega como total, parcial o pendiente, validando el código de entrega para mantener la trazabilidad.

### Por qué se generó

Los objetivos específicos y el panel del dispensador indican permitir cerrar la entrega (total, parcial o pendiente) con trazabilidad del estado y validación de código.

### Evidencia de contexto

- **Formulacion-inicial.pdf:** Permitir al personal dispensador cerrar la entrega (total, parcial o pendiente) con trazabilidad del estado.

### Criterios de aceptación

**CA-01**
- Dado que el usuario presenta su código de entrega y cédula en ventanilla
- cuando el dispensador ingresa o escanea el código y confirma la entrega
- entonces el sistema actualiza el estado de la orden a entregado o cerrado según corresponda y descuenta del inventario simulado


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-15 — Flujo de WhatsApp con aviso de privacidad y cédula

Como usuario quiero interactuar a través de WhatsApp ingresando mi cédula previa aceptación del aviso de privacidad para realizar consultas por este canal.

### Por qué se generó

Los objetivos específicos detallan el flujo de WhatsApp usando la API oficial de Meta, incluyendo aviso de privacidad, aceptación y número de cédula.

### Evidencia de contexto

- **PharmaExpress.md:** Aviso de privacidad y aceptación del tratamiento de datos. Ingreso del número de cédula.

### Criterios de aceptación

**CA-01**
- Dado que el usuario inicia conversación en el canal de WhatsApp
- cuando visualiza el aviso de privacidad y acepta el tratamiento de datos, luego ingresa su número de cédula
- entonces el sistema verifica la coincidencia con el teléfono registrado y despliega el menú de opciones


### Reglas de negocio

- Las plantillas de WhatsApp no incluirán nombres de medicamentos ni diagnósticos. (Fuente: PharmaExpress.md: Las plantillas que envíe el sistema (confirmación, recordatorio, cancelación) no incluirán nombres de medicamentos ni diagnósticos.)

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-16 — Cita de continuidad en ventanilla para canal asistido

Como usuario con barreras tecnológicas quiero que el dispensador agende mi siguiente entrega en ventanilla y me entregue un tiquete impreso.

### Por qué se generó

El canal asistido para personas con barreras tecnológicas incluye la cita de continuidad en ventanilla con tiquete impreso.

### Evidencia de contexto

- **PharmaExpress.md:** Cita de continuidad en ventanilla. El dispensador agenda la siguiente entrega y entrega un tiquete impreso.

### Criterios de aceptación

**CA-01**
- Dado que el usuario se encuentra en la ventanilla de atención presencial
- cuando solicita o requiere programar su siguiente entrega
- entonces el personal dispensador agenda la próxima cita y genera un tiquete impreso


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-17 — Vinculación de números autorizados de cuidadores

Como usuario quiero vincular los números de teléfono de mis cuidadores, con mi consentimiento registrado, para que puedan realizar gestiones en mi nombre.

### Por qué se generó

El canal asistido incluye la opción de vincular números autorizados de cuidadores con consentimiento registrado.

### Evidencia de contexto

- **PharmaExpress.md:** Números autorizados. El paciente puede vincular los números de cuidadores, con su consentimiento registrado.

### Criterios de aceptación

**CA-01**
- Dado que el paciente otorga su consentimiento
- cuando registra el número de teléfono del cuidador en el sistema
- entonces el número del cuidador queda autorizado para realizar gestiones asociadas al paciente


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-18 — Gestión de teléfonos compartidos en canal asistido

Como usuario que comparte un número telefónico con otras personas quiero que el sistema me pregunte para quién es la gestión al iniciar la interacción.

### Por qué se generó

El canal asistido contempla el manejo de teléfonos compartidos preguntando para quién es la gestión.

### Evidencia de contexto

- **PharmaExpress.md:** Teléfonos compartidos. Si un número atiende a varios pacientes, el sistema pregunta para quién es la gestión.

### Criterios de aceptación

**CA-01**
- Dado que se utiliza un número de teléfono vinculado a múltiples pacientes
- cuando se inicia la interacción en el canal
- entonces el sistema solicita identificar para cuál de los pacientes es la gestión


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-19 — Modo asesor para facilitadores comunitarios

Como facilitador comunitario quiero utilizar el modo asesor para agendar en nombre de varias personas.

### Por qué se generó

El canal asistido incluye el modo asesor para facilitadores comunitarios.

### Evidencia de contexto

- **PharmaExpress.md:** Modo asesor. Permite que un facilitador comunitario agende en nombre de varias personas.

### Criterios de aceptación

**CA-01**
- Dado que el facilitador accede al sistema con rol de asesor
- cuando realiza el proceso de agendamiento
- entonces el sistema permite completar el agendamiento a nombre de múltiples personas


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## HU-20 — Ruta alterna para números no coincidentes

Como usuario cuyo número telefónico no coincide con el registrado quiero acceder a una ruta alterna para completar mi gestión.

### Por qué se generó

El canal asistido contempla una ruta alterna para usuarios cuyo número no coincide con el registrado.

### Evidencia de contexto

- **PharmaExpress.md:** Ruta alterna. Para usuarios cuyo número no coincide con el registrado.

### Criterios de aceptación

**CA-01**
- Dado que el número de teléfono del usuario no coincide con el registrado en el sistema
- cuando el usuario intenta realizar una validación o trámite
- entonces el sistema direcciona al usuario a la ruta alterna de atención


### Reglas de negocio

- No se identificaron reglas explícitas.

### Dependencias

- No se identificaron dependencias explícitas.

### Decisiones pendientes

- Ninguna identificada.

## Contexto sin convertir en historia

- Evaluación del prototipo con métricas y grupos de adultos mayores descrita en el objetivo 8, la cual corresponde a una fase de pruebas y evaluación posterior al desarrollo de las funcionalidades principales.

## Decisiones pendientes globales

- Definir los mecanismos técnicos exactos de integración simulada con las EPS y pasarelas externas.
- Establecer la implementación específica de la interfaz de accesibilidad WCAG 2.1 nivel AA y manejo de consentimientos de datos sensibles.
