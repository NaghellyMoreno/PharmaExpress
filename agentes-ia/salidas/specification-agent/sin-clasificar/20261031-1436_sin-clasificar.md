<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash
Fecha: 2026-10-31 14:36
Petición: priorizar MVP
-->

## Requisitos            (dueño: Especificaciones)

| REQ | SPEC | Prioridad | Canal(es) | AC verificables | Depende de | Origen |
|-----|------|-----------|-----------|-----------------|------------|--------|
| SPEC-001/RF-001 | SPEC-001 | Debe | ambos | SPEC-001/AC-001 | — | CONFIRMADO |
| SPEC-001/RF-002 | SPEC-001 | Debe | ambos | SPEC-001/AC-006 | SPEC-001/RF-001 | CONFIRMADO |
| SPEC-001/RF-003 | SPEC-001 | Debe | ambos | SPEC-001/AC-002 | SPEC-001/RF-001 | CONFIRMADO |
| SPEC-001/RF-004 | SPEC-001 | Debe | ambos | SPEC-001/AC-004 | SPEC-001/RF-001 | CONFIRMADO |
| SPEC-001/RF-005 | SPEC-001 | Debe | ambos | SPEC-001/AC-004 | SPEC-001/RF-004 | CONFIRMADO |
| SPEC-001/RF-006 | SPEC-001 | Debe | ambos | SPEC-001/AC-004 | SPEC-001/RF-005 | CONFIRMADO |
| SPEC-001/RF-007 | SPEC-001 | Debe | ambos | SPEC-001/AC-005 | SPEC-001/RF-004 | CONFIRMADO |
| SPEC-001/RF-008 | SPEC-001 | Debe | ambos | SPEC-001/AC-007 | SPEC-001/RF-004 | CONFIRMADO |
| SPEC-001/RF-009 | SPEC-001 | Debe | ambos | SPEC-001/AC-007, SPEC-001/AC-008 | SPEC-001/RF-008 | CONFIRMADO |

**Bloqueados** (Debe sin AC verificable):

- `REQ-002` (Prevalidación escalonada por fórmula): `Debe`. Sin validar afiliación, vigencia, PBS, autorización y habilitación, el flujo de pre-dispensación no puede continuar. Pendiente de SPEC (EPIC-003). `PROPUESTA`: Dado un usuario autenticado que carga una fórmula, cuando el sistema ejecuta la prevalidación, entonces verifica en orden estricto afiliación, vigencia, PBS, autorización y fecha habilitada bajo la regla todo o nada.
- `REQ-003` (Ventanas y agendamiento): `Debe`. Es indispensable para reservar la cita previa al desplazamiento. Pendiente de SPEC (EPIC-004). `PROPUESTA`: Dado un tratamiento agudo o crónico prevalidado, cuando el usuario selecciona un punto, entonces el sistema presenta únicamente ventanas de 1 hora disponibles que cumplen con la regla de tiempo según el tipo de tratamiento.
- `REQ-004` (Privacidad de datos sensibles en notificaciones): `Debe`. Obligación legal y de protección de datos de salud (Ley 1581 de 2012). Pendiente de SPEC (EPIC-005). `PROPUESTA`: Dado el envío de cualquier notificación o recordatorio por cualquier canal, cuando el sistema emite el mensaje, entonces el contenido no incluye nombres de medicamentos ni diagnósticos.
- `REQ-005` (Cero sobre-reservas): `Debe`. Garantiza la promesa de valor del producto (reserva garantizada sin desplazamientos inútiles). Pendiente de SPEC (EPIC-004). `PROPUESTA`: Dado un cupo o existencia restante en una ventana, cuando dos usuarios intentan confirmar la reserva simultáneamente, entonces el sistema confirma a uno solo y notifica la falta de disponibilidad actualizada al otro.
- `REQ-006` (Re-verificación 1 hora antes de la cita): `Debe`. Evita desplazamientos e inconsistencias si cambian la afiliación o autorizaciones antes de la entrega. Pendiente de SPEC (EPIC-005). `PROPUESTA`: Dado un usuario con cita agendada, cuando falta una hora para la ventana, entonces el sistema ejecuta de forma automática la re-verificación de afiliación, vigencia y autorizaciones sin intervención de usuarios.
- `REQ-007` (Fuentes de verdad simuladas): `Debe`. Soporta la operación del prototipo funcional. Pendiente de SPEC (EPIC-007). `PROPUESTA`: Dado el proceso de validación o reserva, cuando el sistema requiere consultar datos, entonces consume los servicios simulados de la EPS e inventario.
- `REQ-008` (Mensajería real): `Debe`. Permite la entrega del código de verificación y notificaciones transaccionales multicanal. Pendiente de SPEC (EPIC-007). `PROPUESTA`: Dado el envío de un código OTP o notificación, cuando el sistema procesa la comunicación, entonces utiliza los conectores reales de SMS, correo electrónico o el bot de Telegram.
- `REQ-009` (Aislamiento de identidad de los canales): `Debe`. Evita suposiciones de identidad inseguras mediante identificadores de Telegram. Pendiente de SPEC (EPIC-002). `PROPUESTA`: Dado un usuario en la web o Telegram, cuando interactúa con el sistema, entonces se exige la verificación explicita mediante cédula y OTP sin derivar la identidad del canal de transporte.
- `REQ-011` (Trazabilidad de cancelaciones automáticas): `Debe`. Asegura la liberación inmediata de existencias y la orientación clara al paciente ante fallos en la re-verificación. Pendiente de SPEC (EPIC-005). `PROPUESTA`: Dado un cambio desfavorable durante la re-verificación de una hora antes, cuando el sistema cancela la cita, entonces libera el cupo y medicamentos, registra el motivo y la fecha del cambio, e informa el resultado al usuario.
- `REQ-012` (Cierre de la dispensación en el punto): `Debe`. Cierra el ciclo del flujo principal (dispensar). Pendiente de SPEC (EPIC-006). `PROPUESTA`: Dado un dispensador autenticado en el punto, cuando atiende al paciente con su código de entrega, entonces registra la validación oficial presencial y marca cada medicamento como entregado o no entregado con su motivo.
- `REQ-013` (Vinculación de canales y apoyo de terceros): `Debe`. Permite la atención recurrente y el soporte a cuidadores o facilitadores comunitarios. Pendiente de SPEC (EPIC-002). `PROPUESTA`: Dado un usuario autenticado con OTP, cuando vincula su canal, entonces el sistema mantiene la vinculación durante 3 meses para la gestión del titular o terceros representados.
- `REQ-016` (Carga y reintento de documentos): `Debe`. Canaliza el ingreso de fórmulas e historias clínicas para la prevalidación. Pendiente de SPEC (EPIC-003). `PROPUESTA`: Dado un usuario en la web o Telegram, cuando adjunta una foto o PDF del documento, entonces el sistema procesa la lectura o solicita un nuevo cargue si no se obtienen los datos.
- `REQ-017` (Clasificación del tratamiento por catálogo): `Debe`. Determina las reglas de agendamiento (mismo día vs día siguiente). Pendiente de SPEC (EPIC-003). `PROPUESTA`: Dado un diagnóstico extraído del documento, cuando el sistema evalúa la fórmula, entonces la clasifica como crónica si coincide con el catálogo configurable o agudo en caso contrario.
- `REQ-018` (Independencia de fórmulas y resultado preliminar): `Debe`. Preserva el avance de fórmulas válidas y advierte la validez oficial en el punto. Pendiente de SPEC (EPIC-003). `PROPUESTA`: Dado un paquete con múltiples fórmulas, cuando se realiza la prevalidación, entonces el sistema habilita de forma independiente las fórmulas aptas y marca el resultado como preliminar.
- `REQ-019` (Código de entrega): `Debe`. Permite la verificación presencial rápida por el dispensador. Pendiente de SPEC (EPIC-004 / EPIC-006). `PROPUESTA`: Dado un agendamiento exitoso, cuando el usuario consulta su cita, entonces el sistema le presenta un código de entrega único (QR y numérico) válido una sola vez en el punto y ventana reservados.
- `REQ-020` (Ciclo de vida de la reserva): `Debe`. Controla la expiración de la reserva y liberación de inventario no reclamado. Pendiente de SPEC (EPIC-004). `PROPUESTA`: Dado un usuario con cita agendada que no se presenta antes de finalizar la ventana, cuando la ventana concluye, entonces el sistema expira la reserva y libera los medicamentos y cupo para otros usuarios.
- `REQ-022` (Acceso y validación en el punto): `Debe`. Permite al dispensador autenticarse y procesar la cita. Pendiente de SPEC (EPIC-006). `PROPUESTA`: Dado un dispensador en ventanilla, cuando ingresa con sus credenciales de rol dispensador, entonces puede buscar la cita mediante el código de entrega y registrar la llegada del paciente.
- `REQ-023` (Configuración de puntos, ventanas e inventario): `Debe`. Parametriza los límites operativos para agendar y reservar. Pendiente de SPEC (EPIC-007). `PROPUESTA`: Dado un archivo o interfaz de configuración, cuando se parametrizan los puntos de dispensación, horarios, ventanas y stock simulado, entonces el sistema aplica dichas restricciones en el flujo de reserva.
- `REQ-024` (Entrega multicanal transaccional): `Debe`. Garantiza la notificación inmediata de confirmaciones o cancelaciones por todos los medios activos. Pendiente de SPEC (EPIC-005). `PROPUESTA`: Dado un evento de agendamiento o cancelación, cuando el sistema genera la alerta transaccional, entonces la envía por notificación web, bot de Telegram, SMS y correo electrónico registrado.
- `REQ-026` (Reglas compartidas de los canales): `Debe`. Asegura paridad de experiencia en web y Telegram sin comprometer la atención presencial. Pendiente de SPEC (EPIC-002). `PROPUESTA`: Dado un usuario en la web o bot de Telegram, cuando realiza la pre-dispensación, entonces puede completar todo el recorrido funcional por cualquiera de los dos canales.

**Fuera del MVP** (Debería/Podría) y por qué:

- `REQ-021` (Indisponibilidad: espera de 48 horas y recordatorio a las 48h): Prioridad `Debería`. Justificación: Corresponde a un flujo de manejo de excepción por desabastecimiento/sin cupo. El flujo principal del MVP demuestra la prevalidación, reserva y entrega cuando sí existe disponibilidad en la red simulada. Origen: INFERENCIA (requiere confirmación).
- `REQ-025` (Aviso de la siguiente fecha habilitada 2 días antes): Prioridad `Podría`. Justificación: Ocurre semanas o meses después de una entrega exitosa para invitar a ciclos crónicos posteriores. No bloquea la primera dispensación ni el flujo principal del MVP. Origen: CONFIRMADO (contexto 3.6 / REQ-025).
- `REQ-006 (Recordatorio del día anterior entre 19:00 y 21:00)`: Prioridad `Debería`. Justificación: Es una notificación preventiva de asistencia. El mecanismo crítico para la validez de la entrega es la notificación y re-verificación de 1 hora antes de la cita. Origen: INFERENCIA (requiere confirmación).

---

### Preguntas de aclaración para el equipo (priorización del MVP)

1. **OPEN-Q-MVP-001**: ¿Se confirma que el recordatorio de 48 horas ante indisponibilidad (`REQ-021`) y el aviso de la siguiente fecha habilitada a los 2 días previos (`REQ-025`) quedan fuera del alcance del MVP inicial para priorizar el flujo directo de prevalidación, reserva y entrega presencial?
   - *Por qué importa*: Permite enfocar el esfuerzo de construcción en el motor de reservas y prevalidación sin construir tareas programadas diferidas a varios días o meses en la primera entrega.
