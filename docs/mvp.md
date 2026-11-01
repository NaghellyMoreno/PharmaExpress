# MVP Pharma Express — v0

estado: borrador
aprobado_por: 
hash_specs: pendiente
fecha_creacion: 2026-10-31
rondas_de_negociacion: 0

> Documento compartido. Cada sección tiene **un solo dueño**.
> - **Requisitos**: los escribe el Agente de Especificaciones (modo «Priorizar MVP»).
> - **Corte técnico**: lo escribe el Agente de Arquitectura (modo «Cortar MVP»).
> - **Observaciones**: ambos, solo comentarios. Ninguno edita la sección del otro.
> - **Registro de decisiones**: ambos, con ronda, cambio, quién lo pidió y quién aprobó.
>
> Puerta humana: hasta que una persona escriba `aprobado_por`, QA y Backend/Frontend **no arrancan**.
> El MVP no lo decide ningún agente por su cuenta.

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
- `REQ-020` (Ciclo de vida de la reserva): `Debe`. Controla la expiración de la reserva y liberación de inventario not reclamado. Pendiente de SPEC (EPIC-004). `PROPUESTA`: Dado un usuario con cita agendada que no se presenta antes de finalizar la ventana, cuando la ventana concluye, entonces el sistema expira la reserva y libera los medicamentos y cupo para otros usuarios.
- `REQ-022` (Acceso y validación en el punto): `Debe`. Permite al dispensador autenticarse and procesar la cita. Pendiente de SPEC (EPIC-006). `PROPUESTA`: Dado un dispensador in ventanilla, when ingresa con sus credenciales de rol dispensador, entonces puede buscar la cita mediante el código de entrega y registrar la llegada del paciente.
- `REQ-023` (Configuración de puntos, ventanas e inventario): `Debe`. Parametriza los límites operativos para agendar y reservar. Pendiente de SPEC (EPIC-007). `PROPUESTA`: Dado un archivo o interfaz de configuración, cuando se parametrizan los puntos de dispensación, horarios, ventanas y stock simulado, entonces el sistema aplica dichas restricciones en el flujo de reserva.
- `REQ-024` (Entrega multicanal transaccional): `Debe`. Garantiza la notificación inmediata de confirmaciones o cancelaciones por todos los medios activos. Pendiente de SPEC (EPIC-005). `PROPUESTA`: Dado un evento de agendamiento o cancelación, cuando el sistema genera la alerta transaccional, entonces la envía por notificación web, bot de Telegram, SMS y correo electrónico registrado.
- `REQ-026` (Reglas compartidas de los canales): `Debe`. Asegura paridad de experiencia en web y Telegram sin comprometer la atención presencial. Pendiente de SPEC (EPIC-002). `PROPUESTA`: Dado un usuario en la web o bot de Telegram, cuando realiza la pre-dispensación, entonces puede completar todo el recorrido funcional por cualquiera de los dos canales.

**Fuera del MVP** (Debería/Podría) y por qué:

- `REQ-021` (Indisponibilidad: espera de 48 horas y recordatorio a las 48h): Prioridad `Debería`. Justificación: Corresponde a un flujo de manejo de excepción por desabastecimiento/sin cupo. El flujo principal del MVP demuestra la prevalidación, reserva y entrega cuando sí existe disponibilidad en la red simulada. Origen: INFERENCIA (requiere confirmación).
- `REQ-025` (Aviso de la siguiente fecha habilitada 2 días antes): Prioridad `Podría`. Justificación: Ocurre semanas o meses después de una entrega exitosa para invitar a ciclos crónicos posteriores. No bloquea la primera dispensación ni el flujo principal del MVP. Origen: CONFIRMADO (contexto 3.6 / REQ-025).
- `REQ-006 (Recordatorio del día anterior entre 19:00 y 21:00)`: Prioridad `Debería`. Justificación: Es una notificación preventiva de asistencia. El mecanismo crítico para la validez de la entrega es la notificación y re-verificación de 1 hora antes de la cita. Origen: INFERENCIA (requiere confirmación).

**Reglas de esta sección**

- «Debe» = sin él, el flujo principal (prevalidar → reservar → dispensar) no funciona o se incumple una obligación legal o de datos de salud.
- Cada prioridad lleva origen: `CONFIRMADO`, `INFERENCIA` o `PROPUESTA`.
- Una prioridad inferida se presenta como pregunta a la persona; no se da por decidida.
- Todo «Debe» debe tener al menos un AC en formato Dado/Cuando/Entonces. Si falta, va a **Bloqueados** con el AC propuesto marcado como `PROPUESTA`.

## Corte técnico         (dueño: Arquitectura)

| REQ | Módulo | Esfuerzo (S/M/L) | Riesgo | Tratamiento | Orden |
|-----|--------|------------------|--------|-------------|-------|
| REQ-001 | identidad | M | Validez de OTP de 10 min y límite de 3 intentos bajo concurrencia | real | 1 |
| REQ-002 | prevalidacion | L | Mapeo OCR local con Tesseract.js y reglas de cruce con EPS simulada | real | 2 |
| REQ-003 | reservas | L | Concurrencia en la transacción atómica de inventario y cupos (AC-36) | real | 3 |
| REQ-004 | notificaciones | M | Sincronización de colas de tareas con pg-boss y envío de alertas | simulado | 4 |
| REQ-005 | telegram | S | Integración del bot con grammY en el mismo backend de NestJS | real | 1 |

**Tratamiento**: `real` | `simulado` (SMS/correo en plan de prueba) | `aplazado`.

**Reglas fijas del corte**

- La transacción de reserva es **real**; nunca se simula ni se aplaza.
- SMS y correo van con **planes de prueba**.
- OCR: **Tesseract.js local** con pantalla de confirmación humana.
- Fórmulas manuscritas: **fuera de alcance**.
- Datos de salud y la prueba de concurrencia (AC-36) **nunca** se simulan ni se aplazan.

**Orden de construcción por dependencias**: 
1. `identidad` y `telegram` (base de autenticación, vinculación y canales).
2. `prevalidacion` (carga de documentos, OCR local y verificación contra EPS simulada).
3. `reservas` (motor de agendamiento y transacción atómica de inventario y ventanas).
4. `notificaciones` (orquestación de recordatorios y alertas de 48 horas mediante pg-boss).

**Qué no cabe en 5 días y propuesta de recorte**: 
- *Qué no cabe*: El motor OCR completo con alta precisión en múltiples formatos y la integración simultánea de todos los flujos de validación de crónicos y agudos en un ciclo de 5 días de desarrollo intensivo para un equipo de 4 personas supera la capacidad estimada si se aborda sin componentes base.
- *Propuesta*: Mantener el alcance funcional del MVP pero acotar el OCR a plantillas pregeneradas y preimpresas de prueba para Tesseract.js, aplazando cualquier ajuste fino de reconocimiento de imágenes no estructuradas complejas, delegando la validación en la pantalla de confirmación humana exigida en el stack.

**Riesgos que requieren prueba específica**:
- Concurrencia estricta sobre la tabla de inventarios para cumplir con la prueba AC-36 (50 confirmaciones paralelas sobre 10 unidades).
- Expiración exacta de las reservas y ejecución de tareas programadas mediante pg-boss sin persistencia en Redis.

## Observaciones         (ambos, solo comentarios)

Comentarios de la revisión externa del 2026-10-31 (no son decisiones; entrada para la ronda 1):

- REV-001 (para Especificaciones): la sección Requisitos usa `SPEC-001/RF-xxx` como REQ. Use los `REQ-xxx` de `primary-needs-v2.md` y la SPEC en su columna; así no se pierden REQ-001, REQ-010, REQ-014 y REQ-015 (EPIC-001).
- REV-002 (para Especificaciones): los bloqueados dicen «Pendiente de SPEC», pero SPEC-002 a SPEC-008 existen como **Candidatas** en `agentes-ia/salidas/specification-agent/borradores/`. Lo que falta es su aprobación humana y la revisión de S1, no la SPEC.
- REV-003 (para Especificaciones): REQ-006 aparece a la vez como «Debe» (re-verificación 1 h antes) y en «Fuera del MVP» (recordatorio del día anterior). Si son dos conductas, divídalas con id propio.
- REV-004 (para Arquitectura): el Corte técnico numera REQ-001 a REQ-005 con significados distintos a los de Requisitos (p. ej. REQ-003 = «Ventanas» en Requisitos y «reservas» en el corte; REQ-004 = «Privacidad» y «notificaciones»). Use los mismos REQ.
- REV-005 (para Arquitectura): REQ-004 (privacidad en notificaciones) es dato de salud y aparece como `simulado`; la regla fija dice que los datos de salud nunca se simulan. Lo simulable es el **proveedor** de SMS/correo, no la regla de contenido.
- REV-006 (para Arquitectura): el corte cubre 5 requisitos de unos 20 «Debe»; cada «Debe» necesita fila (aunque sea `aplazado` como propuesta).
- REV-007 (para Arquitectura): «Qué no cabe» está dentro del Corte técnico; según el plan va aquí, en Observaciones, con dos opciones por REQ (dividir / aplazar / simular).
- REV-008 (para Arquitectura): el orden pone `telegram` en 1; el plan fija identidad → reservas → prevalidación mínima → bot → web. Si propone otro, justifíquelo aquí.
- REV-009 (para ambos): falta el módulo de dispensación (SPEC-006: código de entrega y cierre en el punto) y los datos simulados (SPEC-008), que sostienen «dispensar» y la EPS simulada. Decidir si entran.
- REV-010 (para la persona): el alcance actual (≈20 «Debe») no cabe en el tiempo que queda. Ver `docs/DECISIONES-PENDIENTES.md`.
- DEC-P01 (persona, 2026-10-31): **la prevalidación completa entra al MVP, en la web (PWA móvil) y en Telegram.** El agendamiento (SPEC-004) **queda en evaluación**, sin decidir. Insumo para la ronda 1:
  - Especificaciones: priorizar como «Debe» lo que sostiene la prevalidación (REQ-002, REQ-016, REQ-017, REQ-018, REQ-007 y lo necesario de REQ-001/010/014 y de canales REQ-009/013/026); marcar el agendamiento y lo que depende de él (REQ-003, REQ-005, REQ-019, REQ-020, REQ-012, REQ-022, REQ-006, REQ-011) como «en evaluación», no como «Debe».
  - Arquitectura: cortar identidad → datos simulados (SPEC-008, parte de la EPS y los catálogos) → prevalidación (SPEC-003) → canal Telegram (SPEC-002, parte de vinculación) → web; señalar el costo de sumar el agendamiento después.
  - Bloqueos abiertos: PREG-006 (fecha de la cita posible sin agendamiento) y PREG-007 (cómo viaja el dato de salud en Telegram).
- DEC-P02 a DEC-P05 (persona, 2026-10-31) y DEC-P06 a DEC-P10 (propuestas): ver `docs/decisiones.md`. Especificaciones debe reflejarlas en las nuevas versiones de SPEC-003 y SPEC-008.

## Registro de decisiones (ronda, qué se cambió, quién lo pidió, quién aprobó)

| Ronda | Fecha | Sección | Cambio | Lo pidió | Lo aprobó |
|-------|-------|---------|--------|----------|-----------|
| 0 | 2026-10-31 | — | Creación de la plantilla | Plan de agentes | Pendiente |
| 0 | 2026-10-31 | Observaciones | REV-001 a REV-010 de la revisión externa; `pipeline.json` vuelve a MVP no aprobado (estaba marcado «aprobado» sin `aprobado_por` aquí) | Revisión externa | Pendiente (persona) |
| 0 | 2026-10-31 | Alcance | Prevalidación completa (web + Telegram) entra; agendamiento en evaluación; PREG-006 y PREG-007 abiertas | Persona | Persona (alcance parcial; MVP sigue sin aprobar) |
| 0 | 2026-10-31 | Decisiones | DEC-P02 a DEC-P05 decididas; DEC-P06 a DEC-P10 propuestas (registro único en docs/decisiones.md) | Persona | Persona |
