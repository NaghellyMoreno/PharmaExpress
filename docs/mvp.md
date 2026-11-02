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
| REQ-001 | SPEC-001/RF-001, SPEC-001/RF-003, SPEC-001/RF-004, SPEC-001/RF-005, SPEC-001/RF-006, SPEC-001/RF-010, SPEC-001/RF-011 | Debe | ambos | SPEC-001/AC-001, SPEC-001/AC-002, SPEC-001/AC-003, SPEC-001/AC-004, SPEC-001/AC-009, SPEC-001/AC-010, SPEC-001/AC-011, SPEC-001/AC-012, SPEC-001/AC-013, SPEC-002/AC-019 | REQ-007, REQ-008a | CONFIRMADO |
| REQ-010 | SPEC-001/RF-002, SPEC-002/RF-086 | Debe | ambos | SPEC-001/AC-006, SPEC-002/AC-037 | REQ-001 | CONFIRMADO |
| REQ-014 | SPEC-001/RF-007, SPEC-003/RF-021 | Debe | ambos | SPEC-001/AC-005, SPEC-002/AC-036 | REQ-001 | CONFIRMADO |
| REQ-015 | SPEC-001/RF-008, SPEC-001/RF-009, SPEC-002/RF-087 | Debe | ambos | SPEC-001/AC-007, SPEC-002/AC-022, SPEC-002/AC-033, SPEC-002/AC-040, SPEC-008/AC-054 | REQ-001, REQ-013 | CONFIRMADO (DEC-P65) |
| REQ-009 | SPEC-002/RNF-009, SPEC-002/RF-013 | Debe | ambos | SPEC-002/AC-022, SPEC-002/AC-032 (AC de REQ-009 por DEC-P29), SPEC-001/AC-004 | REQ-001 | CONFIRMADO |
| REQ-013 | SPEC-002/RF-013, SPEC-002/RF-014, SPEC-002/RF-015, SPEC-002/RF-016, SPEC-002/RF-019, SPEC-002/RF-020 | Debe | ambos | SPEC-002/AC-009, SPEC-002/AC-010, SPEC-002/AC-011, SPEC-002/AC-012, SPEC-002/AC-014, SPEC-002/AC-020, SPEC-002/AC-024, SPEC-002/AC-025, SPEC-002/AC-026, SPEC-002/AC-027, SPEC-002/AC-028, SPEC-002/AC-031, SPEC-002/AC-034, SPEC-002/AC-038 | REQ-001, REQ-009 | CONFIRMADO |
| REQ-026 | SPEC-002/RF-011, SPEC-002/RF-012, SPEC-002/RF-017, SPEC-002/RF-018, SPEC-002/RNF-019, SPEC-003/RNF-010 | Debe | ambos | SPEC-002/AC-015, SPEC-002/AC-016, SPEC-002/AC-017, SPEC-002/AC-029, SPEC-002/AC-030 | REQ-013, REQ-016, REQ-018 | CONFIRMADO |
| REQ-008a | SPEC-001/RF-004, SPEC-001/RF-011, SPEC-001/RNF-001, SPEC-002/RF-012 | Debe | ambos | SPEC-001/AC-004, SPEC-001/AC-013, SPEC-002/AC-019, SPEC-008/AC-049 | — | CONFIRMADO |
| REQ-004a | SPEC-002/RF-085, SPEC-002/BR-008 | Debe | telegram | SPEC-002/AC-039, SPEC-002/AC-018, SPEC-002/AC-021 (solo avisos del chat que no son notificaciones; lo demás, aplazado por DEC-P45) | REQ-016 | CONFIRMADO (DEC-P64) |
| REQ-007 | SPEC-008/RF-075, SPEC-008/RF-076, SPEC-008/RF-077, SPEC-008/RF-082, SPEC-008/RNF-017 | Debe | ambos | SPEC-008/AC-034, SPEC-008/AC-035, SPEC-008/AC-036, SPEC-008/AC-041, SPEC-008/AC-044, SPEC-008/AC-045, SPEC-008/AC-046, SPEC-008/AC-047, SPEC-008/AC-048, SPEC-008/AC-049, SPEC-008/AC-051, SPEC-008/AC-053 | — | CONFIRMADO |
| REQ-023a | SPEC-008/RF-080 | Debe | ambos | SPEC-008/AC-039, SPEC-003/AC-016 | REQ-007 | CONFIRMADO (DEC-P65) |
| REQ-002 | SPEC-003/RF-024, SPEC-003/RF-025, SPEC-008/RF-077, SPEC-008/RF-084 | Debe | ambos | SPEC-003/AC-001, SPEC-003/AC-002, SPEC-003/AC-014, SPEC-003/AC-015, SPEC-003/AC-016, SPEC-003/AC-017, SPEC-003/AC-018, SPEC-003/AC-023, SPEC-003/AC-029, SPEC-003/AC-031, SPEC-003/AC-032, SPEC-003/AC-033, SPEC-003/AC-046, SPEC-003/AC-048, SPEC-003/AC-051, SPEC-008/AC-043, SPEC-008/AC-050, SPEC-008/AC-052 | REQ-007, REQ-016, REQ-017 | CONFIRMADO |
| REQ-016 | SPEC-003/RF-021, SPEC-003/RF-022, SPEC-003/RF-029, SPEC-003/RF-030, SPEC-003/RF-031, SPEC-002/RF-085 | Debe | ambos | SPEC-003/AC-003, SPEC-003/AC-013, SPEC-003/AC-022, SPEC-003/AC-024, SPEC-003/AC-025, SPEC-003/AC-026, SPEC-003/AC-030, SPEC-003/AC-039, SPEC-003/AC-040, SPEC-003/AC-045, SPEC-003/AC-050, SPEC-003/AC-053, SPEC-002/AC-013, SPEC-002/AC-018, SPEC-002/AC-035, SPEC-002/AC-039 | REQ-007, REQ-014 | CONFIRMADO |
| REQ-017 | SPEC-003/RF-023, SPEC-008/RF-078 | Debe | ambos | SPEC-003/AC-019, SPEC-003/AC-027, SPEC-003/AC-028, SPEC-008/AC-037 | REQ-007, REQ-016 | CONFIRMADO |
| REQ-018 | SPEC-003/RF-026, SPEC-003/RF-027, SPEC-003/RF-028 | Debe | ambos | SPEC-003/AC-004, SPEC-003/AC-020, SPEC-003/AC-021, SPEC-003/AC-041 | REQ-002 | CONFIRMADO |
| REQ-027a | SPEC-008/RF-083 (solo eventos de prevalidación), SPEC-008/RNF-018 | Debe | ambos | SPEC-008/AC-042, SPEC-008/AC-054 | REQ-002 | CONFIRMADO (DEC-P66) |

Identificadores: los `REQ-xxx` son los de `primary-needs-v2.md`, salvo `REQ-027a` y `REQ-027b`: ningún REQ de ese archivo cubre SPEC-008/RF-083 y el id es propio de este documento. Los sufijos `a` y `b` dividen un REQ en dos conductas sin renumerar ese archivo. En la columna Canal, `telegram` y `ambos` se refieren a la Mini App, salvo los avisos de plantilla fija del chat (DEC-P10).

**Justificación de cada prioridad** (una línea por REQ):

- `REQ-001`: sin identidad ni aviso no se puede pedir ningún dato. Contexto 3.2; DEC-P01 lo incluye en lo que sostiene la prevalidación.
- `REQ-010`: es parte del registro de la aceptación exigido por el contexto 3.2; DEC-P01 lo incluye.
- `REQ-014`: los datos de salud requieren autorización explícita antes de cargar documentos. Contexto 3.2 y 3.11.
- `REQ-015`: derecho del titular en el contexto 3.2 (SPEC-001/RF-008). `Debe` por DEC-P65.
- `REQ-009`: los identificadores de Telegram no prueban identidad. Contexto 3.1, DEC-P22 y DEC-P29.
- `REQ-013`: sin vinculación no hay gestión por canal. Contexto 3.3; DEC-P01 lo incluye.
- `REQ-026`: DEC-P01 exige la prevalidación en web y Telegram. Contexto 3.1, DEC-P10.
- `REQ-008a`: sin el envío real del código no hay verificación de identidad. Contexto 3.2 y 3.8. Sigue como `Debe` por DEC-P64.
- `REQ-004a`: las plantillas del chat existen sin agendamiento y no llevan datos de salud. DEC-P64, contexto 3.11, SPEC-002/BR-008. La respuesta del bot a un archivo no es una notificación (DEC-P45).
- `REQ-007`: la prevalidación consulta la EPS y los catálogos simulados. Contexto 3.8; DEC-P01 lo incluye.
- `REQ-023a`: el resultado no apto debe mostrar puntos, enlaces o trámites de la EPS (contexto 3.4, SPEC-003/BR-014). `Debe` por DEC-P65.
- `REQ-002`: es la prevalidación misma. Contexto 3.4, DEC-P01. La fecha de la cita posible no depende del agendamiento (DEC-P13).
- `REQ-016`: sin documentos leídos no hay prevalidación. Contexto 3.4, DEC-P01.
- `REQ-017`: decide si aplica el paso 5 de la prevalidación. Contexto 3.4, DEC-P01.
- `REQ-018`: el resultado preliminar es la salida de la prevalidación. Contexto 3.4, DEC-P01.
- `REQ-027a`: registrar los eventos de prevalidación es `Debe` por DEC-P66. Lo usa `REQ-015` en SPEC-008/AC-054.

**Reservas de los Debe** (tienen AC verificable en el resto del REQ; lo siguiente no):

- `REQ-001`: el tope de envío de códigos de DEC-P61 no tiene AC en SPEC-001 y su valor lo fija el equipo. `PROPUESTA`: Dado un celular que alcanzó el tope configurado en la ventana de tiempo, cuando se pide otro código, entonces no se envía y se muestra la ruta alterna de SPEC-001/RF-006.
- `REQ-010`: SPEC-001/AC-006 solo prueba la aceptación de un tercero. `PROPUESTA`: Dado que el usuario acepta como titular, cuando se registra la aceptación, entonces queda registrado que aceptó el titular, con fecha, hora y canal.
- `REQ-015`: SPEC-001/AC-008 exige citas y reservas activas, así que no se puede ejecutar sin agendamiento. La pérdida de la vinculación tras revocar solo se comprueba de forma indirecta con SPEC-002/AC-022.
- `REQ-016`: el borrado de fotos y PDF de DEC-P59 no tiene AC en SPEC-003 (OPEN-Q-011 sigue escrita como pendiente en la SPEC congelada). `PROPUESTA`: Dada una prevalidación terminada, cuando se revisa el almacenamiento, entonces no quedan las fotos ni los PDF y solo queda el resultado.
- `REQ-016`: SPEC-003/AC-025 no tiene oráculo para los casos intermedios hasta que el equipo apruebe el umbral (DEC-P56, DEC-P60).
- `REQ-008a`: ningún AC prueba que el bot solo escribe después de que la persona lo inicia. `PROPUESTA`: Dado un chat que no ha iniciado el bot, cuando transcurre cualquier gestión del sistema, entonces el bot no le escribe.
- `REQ-026`: el informe S1 marca SPEC-002/AC-017, SPEC-002/AC-029 y SPEC-002/AC-030 sin oráculo suficiente (sección Verificación de SPEC-002). Quedan firmes SPEC-002/AC-015 y SPEC-002/AC-016.
- Preguntas abiertas que no bloquean la prioridad: PREG-011, PREG-017, PREG-018, PREG-025, PREG-026, PREG-034, PREG-041 y PREG-076. PREG-004 y PREG-005 dicen `Bloquea: sí`, pero son sobre pruebas del módulo `identidad`, no sobre la prioridad.

**Preguntas a la persona** (prioridades inferidas; no están decididas):

- ¿Qué prioridad tiene `REQ-027b` si entra el agendamiento? No está en la v0 y DEC-P66 no la fija, así que la fila queda sin prioridad.

**Bloqueados** (Debe sin AC verificable):

Ninguno: la lista queda vacía. PREG-074 quedó respondida con DEC-P64, y REQ-004, REQ-008b y REQ-024 se reubicaron según esa decisión.

**En evaluación** (dependen del agendamiento; no son Debe de este MVP, DEC-P01, DEC-P35, DEC-P64, DEC-P66 y DEC-P69):

La lista conserva el texto de la v0. SPEC-004, SPEC-005 y SPEC-006 existen como Candidatas v1.0 en `agentes-ia/salidas/specification-agent/borradores/`, sin revisión de S1 ni aprobación, así que estos REQ no tienen AC ejecutable en una SPEC aprobada; `REQ-023b`, `REQ-012`, `REQ-004b` y `REQ-027b` citan elementos de SPEC aprobadas que están en evaluación o aplazados. La SPEC indicada sale del catálogo de épicas y del título de cada Candidata. La prioridad escrita es la de la v0 y aplica solo si el agendamiento entra.

- `REQ-004b` (Contenido de las notificaciones): SPEC-005 y la parte de notificaciones de SPEC-002/AC-021, aplazada por DEC-P45. Prioridad si entra: `Debe`. Origen de la ubicación: CONFIRMADO (DEC-P64). La regla de contenido no se aplaza: lo que ya existe sin notificaciones está en `REQ-004a`. `PROPUESTA`: Dado el envío de cualquier notificación o recordatorio por cualquier canal, cuando el sistema emite el mensaje, entonces el contenido no incluye nombres de medicamentos ni diagnósticos.
- `REQ-008b` (Mensajería real de notificaciones): SPEC-005. Es la parte de REQ-008 que no es el código de verificación. Prioridad si entra: `Debe`. Origen de la ubicación: CONFIRMADO (DEC-P64). `PROPUESTA`: Dado el envío de una notificación, cuando el sistema procesa la comunicación, entonces utiliza los servicios reales de SMS, correo o Telegram.
- `REQ-024` (Entrega multicanal y reglas de los recordatorios): SPEC-005. Su evento es el agendamiento o la cancelación; SPEC-002/AC-023 también queda aplazado (DEC-P45). Prioridad si entra: `Debe`. Origen de la ubicación: CONFIRMADO (DEC-P64). `PROPUESTA`: Dado un evento de agendamiento o cancelación, cuando el sistema genera la alerta transaccional, entonces la envía por notificación web, bot de Telegram, SMS y correo electrónico registrado.
- `REQ-027b` (Resto de las métricas de evaluación): SPEC-008/RF-083 en la parte de citas, sobre-reservas y atención en el punto, en evaluación por DEC-P35. Prioridad si entra: sin asignar (pregunta arriba). Origen de la ubicación: CONFIRMADO (DEC-P66). Sin AC propuesto.
- `REQ-021` (Indisponibilidad: espera de 48 horas y recordatorio a las 48 horas): prioridad `Debería`, conservada por DEC-P69. Origen: CONFIRMADO (DEC-P69). Solo existe si hay reserva e inventario (contexto 3.5), y el plazo es propio del producto, no una obligación legal (contexto 3.11).
- `REQ-025` (Aviso de la siguiente fecha habilitada 2 días antes): prioridad `Podría`, conservada por DEC-P69. Origen: CONFIRMADO (DEC-P69). Ocurre después de una entrega de fórmula crónica (contexto 3.6) y no bloquea la prevalidación.

- `REQ-003` (Ventanas y agendamiento): SPEC-004. Prioridad si entra: `Debe`. Origen de la ubicación: CONFIRMADO (DEC-P01). Debe aplicar DEC-P13 para crónicas. `PROPUESTA`: Dado un tratamiento agudo o crónico prevalidado, cuando el usuario selecciona un punto, entonces el sistema presenta únicamente ventanas de 1 hora disponibles que cumplen con la regla de tiempo según el tipo de tratamiento.
- `REQ-005` (Cero sobre-reservas): SPEC-004 (Candidata: SPEC-004/AC-017). Prioridad si entra: `Debe`; la prueba de concurrencia no se simula ni se aplaza. Origen de la ubicación: CONFIRMADO (DEC-P01). `PROPUESTA`: Dado un cupo o existencia restante en una ventana, cuando dos usuarios intentan confirmar la reserva simultáneamente, entonces el sistema confirma a uno solo y notifica la falta de disponibilidad actualizada al otro.
- `REQ-006a` (Recordatorio del día anterior, entre las 19:00 y las 21:00): SPEC-005. Prioridad si entra: `Debería`, INFERENCIA que requiere confirmación. Origen de la ubicación: CONFIRMADO (DEC-P01). Sin AC propuesto en la v0.
- `REQ-006b` (Recordatorio una hora antes y re-verificación en ese momento): SPEC-005. Prioridad si entra: `Debe`. Origen de la ubicación: CONFIRMADO (DEC-P01). `PROPUESTA`: Dado un usuario con cita agendada, cuando falta una hora para la ventana, entonces el sistema ejecuta de forma automática la re-verificación de afiliación, vigencia y autorizaciones sin intervención de usuarios.
- `REQ-011` (Trazabilidad de cancelaciones automáticas): SPEC-005. Prioridad si entra: `Debe`. Origen de la ubicación: CONFIRMADO (DEC-P01). `PROPUESTA`: Dado un cambio desfavorable durante la re-verificación de una hora antes, cuando el sistema cancela la cita, entonces libera el cupo y medicamentos, registra el motivo y la fecha del cambio, e informa el resultado al usuario.
- `REQ-012` (Cierre de la dispensación en el punto): SPEC-006, SPEC-008/RF-081 y SPEC-008/AC-040 (en evaluación por DEC-P35). Prioridad si entra: `Debe`. Origen de la ubicación: CONFIRMADO (DEC-P01). `PROPUESTA`: Dado un dispensador autenticado en el punto, cuando atiende al paciente con su código de entrega, entonces registra la validación oficial presencial y marca cada medicamento como entregado o no entregado con su motivo.
- `REQ-019` (Código de entrega): SPEC-004, SPEC-006 y la parte de SPEC-002/RF-018 sujeta a SPEC-004. Prioridad si entra: `Debe`. Origen de la ubicación: CONFIRMADO (DEC-P01). `PROPUESTA`: Dado un agendamiento exitoso, cuando el usuario consulta su cita, entonces el sistema le presenta un código de entrega único (QR y numérico) válido una sola vez en el punto y ventana reservados.
- `REQ-020` (Ciclo de vida de la reserva): SPEC-004. Prioridad si entra: `Debe`. Origen de la ubicación: CONFIRMADO (DEC-P01). `PROPUESTA`: Dado un usuario con cita agendada que no se presenta antes de finalizar la ventana, cuando la ventana concluye, entonces el sistema expira la reserva y libera los medicamentos y cupo para otros usuarios.
- `REQ-022` (Acceso y validación en el punto): SPEC-006. Prioridad si entra: `Debe`. Origen de la ubicación: CONFIRMADO (DEC-P01). `PROPUESTA`: Dado un dispensador en ventanilla, cuando ingresa con sus credenciales de rol dispensador, entonces puede buscar la cita mediante el código de entrega y registrar la llegada del paciente.
- `REQ-023b` (Configuración de puntos, ventanas, capacidad e inventario): SPEC-008/RF-079 y SPEC-008/AC-038, en evaluación por DEC-P35. Prioridad si entra: `Debe`. Origen de la ubicación: CONFIRMADO (DEC-P35, DEC-P64). `PROPUESTA`: Dado un archivo o interfaz de configuración, cuando se parametrizan los puntos de dispensación, horarios, ventanas y stock simulado, entonces el sistema aplica dichas restricciones en el flujo de reserva.

Partes de los Debe que también quedan fuera por ahora, sin fila propia:

- `REQ-013`: el cese de notificaciones por canal (parte de SPEC-002/AC-012, SPEC-002/AC-021 y SPEC-002/AC-023) se aplaza por DEC-P45. La parte de citas de SPEC-002/RF-020 queda sujeta a SPEC-004.
- `REQ-015`: la cancelación de citas y la liberación de reservas (SPEC-001/AC-008) quedan sujetas a SPEC-004.
- `REQ-026`: agendar, ver el código de entrega, cancelar y recibir notificaciones quedan sujetos a SPEC-004 y SPEC-005 (SPEC-002/RF-011, SPEC-002/RF-018).
- `REQ-007`: el inventario simulado queda con `REQ-023b` (DEC-P35). Las partes de citas de SPEC-008/RF-082 también quedan en evaluación; las de SPEC-008/RF-083 están en `REQ-027b`.

**Fuera del MVP** (Debería/Podría) y por qué:

Ninguno: la lista queda vacía. REQ-021 y REQ-025 pasaron a En evaluación por DEC-P69.

**Reglas de esta sección**

- «Debe» = sin él, el flujo principal (prevalidar → reservar → dispensar) no funciona o se incumple una obligación legal o de datos de salud.
- Cada prioridad lleva origen: `CONFIRMADO`, `INFERENCIA` o `PROPUESTA`.
- Una prioridad inferida se presenta como pregunta a la persona; no se da por decidida.
- Todo «Debe» debe tener al menos un AC en formato Dado/Cuando/Entonces. Si falta, va a **Bloqueados** con el AC propuesto marcado como `PROPUESTA`.

## Corte técnico         (dueño: Arquitectura)

Ronda 1, propuesta para revisión. Base: ARQ-005 v1.0 (DEC-P62), propuesta tecnológica con sus enmiendas y `docs/decisiones.md` (DEC-P01 a DEC-P62). Reemplaza el corte anterior.

**Tarea técnica previa (orden 0; no es un REQ): medición del OCR**

El OCR es el mayor riesgo del corte (ARQ-005, riesgo principal), así que se mide antes de construir. Esfuerzo: S, porque es una medición acotada, sin código de producción.

- Qué se hace: el equipo imprime documentos sintéticos (fórmulas con número de 20 dígitos e historias clínicas), los captura en foto y PDF y los lee con Tesseract.js local (ADR-002).
- Qué se mide: lectura del número, de los medicamentos y del diagnóstico, y la distancia Levenshtein frente a lo registrado para cada documento sintético.
- Qué entrega: la evidencia con la que el equipo aprueba el umbral (DEC-P60). Este corte no fija ningún valor. Mientras no se apruebe, SPEC-003/AC-025 no tiene oráculo para los casos intermedios (DEC-P56).
- Solo datos sintéticos: ningún nombre real de medicamento, diagnóstico ni cédula.

**Corte por requisito** (los 14 `Debe` de Requisitos, con los mismos id)

| REQ | Módulo | Esfuerzo (S/M/L) | Riesgo | Tratamiento | Orden |
|-----|--------|------------------|--------|-------------|-------|
| REQ-007 | eps_simulada | M | 12 AC; lo de prueba debe quedar ausente del build de producción (ADR-005); falta definir el mecanismo de SPEC-008/AC-049 | real (la fuente es simulada por el contexto 3.8) | 1 |
| REQ-023a | eps_simulada | S | Contenido por EPS que cambia sin tocar el comportamiento (DEC-P36); SPEC-003/AC-016 solo cierra en el orden 3 | real | 1 |
| REQ-008a | tareas_notificaciones | M | Integración con dos proveedores; el envío por cola debe devolver la falla al usuario (SPEC-001/AC-013); límites de los planes de prueba | contenido: real · proveedor: simulado (plan de prueba, destinos del equipo) | 2 |
| REQ-001 | identidad | M | El código v0 no sirve de base; fronteras de 10 minutos y 3 intentos; tope de DEC-P61 sin valor; cifrado de datos personales (ADR-007) | real | 2 |
| REQ-010 | identidad | S | Ligar una aceptación previa a conocer al paciente; si la verificación falla no queda ligada (SPEC-002/AC-037) | real | 2 (RF-086 cierra en 4) |
| REQ-014 | identidad | S | Compuerta antes de cargar, por paciente y desde cualquier canal (DEC-P46) | real | 2 |
| REQ-016 | prevalidacion | L | **OCR**: lectura útil, conversión local de PDF, CPU en workers, intentos, confirmación por documento y purga física (DEC-P59); umbral sin aprobar | real (Tesseract.js local con confirmación humana) | 3 |
| REQ-017 | prevalidacion | S | Elegir el diagnóstico correcto con uno o varios en la historia clínica (DEC-P09) | real | 3 |
| REQ-002 | prevalidacion | L | Volumen de AC; orden estricto y detención (DEC-P33); días hábiles con festivos y año faltante (DEC-P19, DEC-P50) | real | 3 |
| REQ-018 | prevalidacion | S | Textos exactos de SPEC-003/BR-014; resultado cifrado (ADR-007) | real | 3 |
| REQ-009 | canales | M | Validación de `initData`, asociación `user.id` y destino sin tratarla como identidad (ADR-004) | real | 4 |
| REQ-013 | canales | L | 14 AC; vencimiento por mes calendario en hora de Colombia; varios pacientes por canal; estados nueva, vigente y vencida | real | 4 |
| REQ-015 | identidad | L | Borrado que cruza `identidad`, `canales`, `prevalidacion`, MinIO y eventos, sin quedar a medias; disociación (DEC-P51) | real | 5 |
| REQ-026 | web | L | Recorrido completo con paridad en navegador y Mini App; cámara y carga dentro de Telegram; SPEC-002/AC-017, AC-029 y AC-030 sin oráculo suficiente | real | 6 |

**Por qué cada tamaño.** S: una regla o un dato de configuración, sin integración. M: un módulo con varias reglas o una integración conocida. L: cruza módulos, trae incertidumbre técnica o tiene un volumen alto de AC. Es una escala relativa: no representa horas ni semanas.

**Tratamiento**: `real` | `simulado` (SMS/correo en plan de prueba) | `aplazado`. Ninguna fila queda `aplazado`; las partes que Requisitos ya dejó fuera siguen fuera.

**Reglas del corte**

- SMS y correo: `simulado` significa proveedor real (Twilio, Resend) en **plan de prueba**, solo con destinos del equipo. Lo que se simula es el proveedor, nunca la regla de contenido (REV-005).
- La regla de contenido es **real** aunque `REQ-004` siga bloqueado: en este corte se cumple en el mensaje del código, en la respuesta del bot a un archivo (SPEC-002/AC-039, SPEC-002/BR-008) y en los registros.
- OCR: **Tesseract.js local**, con confirmación humana por documento y sin edición (DEC-P04, DEC-P55).
- Fórmulas manuscritas: **no se distinguen**. Se tratan como documento ilegible, con el mensaje común y los 2 intentos (DEC-P28, SPEC-003/RF-031). Esto corrige la línea anterior «fuera de alcance».
- Datos de salud: **nunca** se simulan ni se aplazan. Usar datos sintéticos en las pruebas no es simular su tratamiento.
- Transacción de reserva: **sale de este corte** porque el agendamiento está en evaluación (DEC-P01); no es una fila `aplazado`. Si entra, sigue siendo real y su prueba de concurrencia no se simula ni se aplaza.
- El id «AC-36» se retira por obsoleto (T-015); la concurrencia candidata es SPEC-004/AC-017. No confundir con SPEC-002/AC-036, SPEC-003/AC-036 ni SPEC-008/AC-036, que son vigentes y tratan otros temas.

**Módulos** (fronteras de ARQ-005 v1.0)

- Equivalencias con `orquestador.py`: `eps_simulada` es `datos_simulados` y `canales` es `telegram`. `web` no es un COMP de ARQ-005: es el cliente que consume la API.
- `tareas_notificaciones` en este MVP solo envía códigos y ejecuta la purga. No hay notificaciones (DEC-P45).
- `documentos` (COMP-005) no tiene fila propia: entra con REQ-016 y REQ-015.
- Cada fila lleva el módulo dueño. Aportes de otros módulos: REQ-010 y REQ-015 en `canales` (SPEC-002/RF-086, SPEC-002/RF-087); REQ-014 en `prevalidacion` (SPEC-003/RF-021); REQ-016 en `canales` (SPEC-002/RF-085); REQ-017 y REQ-002 usan catálogos de `eps_simulada` (SPEC-008/RF-078, SPEC-008/RF-084), que se construyen en el orden 1.

**Orden de construcción por dependencias** (un módulo completo, con dominio, datos, API y prueba verde, antes del siguiente)

0. Medición del OCR con documentos sintéticos impresos.
1. `eps_simulada`: REQ-007 y REQ-023a, con los catálogos de cobertura, crónicos y festivos.
2. `tareas_notificaciones` e `identidad`: REQ-008a, REQ-001, REQ-010 y REQ-014.
3. `prevalidacion` con `documentos`: REQ-016, REQ-017, REQ-002 y REQ-018.
4. `canales`: REQ-009 y REQ-013, con el bot y la validación de la Mini App.
5. `identidad` (segundo incremento): REQ-015.
6. `web`: REQ-026, primero en el navegador y luego la misma interfaz como Mini App.

Diferencias con el orden de DEC-P01 (detalle en OBS-005): `eps_simulada` pasa antes de `identidad`, y la revocación se construye después de `canales`. El resto se conserva.

**Qué no cabe y propuesta de recorte**: el análisis por REQ, con sus opciones, está en Observaciones (OBS-001 a OBS-004), como pide REV-007.

**Riesgos que requieren prueba específica**

- OCR: la medición del orden 0, antes de cualquier oráculo de tolerancia.
- Código de verificación en paralelo: intentos simultáneos no superan 3 y un código anulado no valida (SPEC-001/BR-003, SPEC-001/BR-005).
- Intentos de carga en paralelo: no hay tercer intento (SPEC-003/AC-040).
- Fronteras de tiempo con reloj controlable: SPEC-001/AC-009, SPEC-002/AC-020, SPEC-002/AC-026, SPEC-003/AC-038, SPEC-003/AC-044.
- Purga física (DEC-P59): al terminar la prevalidación no quedan archivos en MinIO. Hoy solo tiene AC en `PROPUESTA` (Reservas de REQ-016).
- Revocación: SPEC-001/AC-007 y SPEC-008/AC-054, incluida una falla a mitad del borrado.
- Datos de salud: búsqueda sin resultados en mensajes y registros (SPEC-002/AC-035, SPEC-002/AC-039); volcado de PostgreSQL sin texto legible en columnas cifradas (ADR-007).
- Build de producción sin lo de prueba (ADR-005).
- `initData` alterado, vacío o de un grupo (ADR-004, SPEC-002/AC-031, SPEC-002/AC-032).

**Costo de sumar el agendamiento después** (no se corta como construcción)

- Puertas previas: SPEC-004, SPEC-005 y SPEC-006 siguen Candidatas y deben pasar por S1 y aprobación; PREG-074 debe responderse; hace falta una ARQ nueva, porque ARQ-005 no incluye reservas ni dispensación.
- Bloque reservas (REQ-003, REQ-005, REQ-020, REQ-023b): L. Trae la transacción real, la prueba de concurrencia, la expiración y DEC-P13.
- Bloque notificaciones (REQ-006a, REQ-006b, REQ-011 y los bloqueados REQ-004, REQ-008b, REQ-024): L. Trae tareas programadas, re-verificación y cancelación automática.
- Bloque punto de dispensación (REQ-012, REQ-019, REQ-022): L. Trae un rol nuevo, el código QR de un solo uso y su validación presencial.
- Retoques sobre lo construido: SPEC-001/AC-008 en REQ-015, las notificaciones aplazadas de REQ-013 y las pantallas de REQ-026.
- La prevalidación no se rehace: va antes del agendamiento y la cita posible ya usa DEC-P13.
- Estimación (inferida, requiere confirmación): los tres bloques suman otros tres L, con módulos nuevos. Los 13 REQ no caben junto con los 14 `Debe` en el mismo plazo. El candidato menor es el bloque reservas.

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

Respuestas de la ronda 1 (Especificaciones, 2026-11-01; comentarios, no decisiones):

- RES-001 (ronda 1, Especificaciones, responde REV-001): Requisitos usa los `REQ-xxx` de `primary-needs-v2.md`, con la SPEC en su columna. Los 26 REQ aparecen, incluidos REQ-001, REQ-010, REQ-014 y REQ-015.
- RES-002 (ronda 1, Especificaciones, responde REV-002): ya no se usa «pendiente de SPEC». Se citan SPEC-001 v1.1, SPEC-002 v1.11, SPEC-003 v1.12 y SPEC-008 v1.9. SPEC-004, SPEC-005 y SPEC-006 siguen Candidatas, y sus REQ van en En evaluación. SPEC-007 sigue Candidata y no se usó: REQ-013 se apoya solo en SPEC-002.
- RES-003 (ronda 1, Especificaciones, responde REV-003): REQ-006 sí son dos conductas y se divide en REQ-006a (día anterior) y REQ-006b (una hora antes y re-verificación, que van juntas por el contexto 3.6). Las dos quedan en En evaluación.
- RES-004 (ronda 1, Especificaciones, responde REV-009): SPEC-008 entra salvo lo marcado en evaluación por DEC-P35. La dispensación (SPEC-006) queda en En evaluación.
- RES-005 (ronda 1, Especificaciones): además de REQ-006 se dividieron REQ-008 (a: código de verificación y bot; b: notificaciones, por PREG-074 y DEC-P45) y REQ-023 (a: contenido por EPS; b: puntos, ventanas e inventario, por DEC-P35). Ninguna división responde PREG-074.
- RES-006 (ronda 1, para Arquitectura): el nuevo Corte técnico debe usar estos REQ, con fila para cada uno de los 14 `Debe`. «AC-36» viene de una SPEC obsoleta (T-015): la concurrencia candidata es SPEC-004/AC-017, en un REQ en evaluación. La línea «Fórmulas manuscritas: fuera de alcance» debe ajustarse a DEC-P28: no se distinguen y se tratan como documento ilegible.
- RES-007 (ronda 1, para la persona): contradicciones encontradas. (1) DEC-P61 fija un tope de envío de códigos y SPEC-001/DEC-01 dice «No se impone un límite global adicional»; manda DEC-P61, que es más reciente. (2) REQ-003 dice «exclusivamente el día calendario siguiente»; manda DEC-P13. (3) REQ-016 trata «incompleto» y «sin diagnóstico» como casos propios; DEC-P54 los unifica como ilegible. (4) `.claude/skills/negociacion-de-mvp/SKILL.md` lista «48 horas» como obligación legal; el contexto 3.11 dice que el plazo que informa Pharma Express es propio. (5) La observación de DEC-P01 dice «web (PWA móvil)»; DEC-P10 fija web sin instalación.
- RES-008 (ronda 1, Especificaciones): por instrucción de esta ronda no se cambió la cabecera, así que `estado`, `hash_specs` y `rondas_de_negociacion` siguen igual. No se crearon archivos PREG: las preguntas nuevas están en Requisitos.

Observaciones de la ronda 1 (Arquitectura, 2026-11-01; comentarios, no decisiones):

- OBS-001 (ronda 1, Arquitectura, responde REV-007 y REV-010): el corte se evalúa contra 4 personas y unas 8 semanas (contexto 3.9), no contra «5 días». El plazo de 5 días viene del plan de agentes (§8), del modo «Cortar MVP» y del skill `negociacion-de-mvp`; las 8 semanas son la restricción del proyecto que citan las SPEC y ARQ-005. Dato de referencia: en 5 días este conjunto no cabe, solo con rehacer `identidad` y medir el OCR ya se consume buena parte.
  Impacto: el plan §8 y el skill siguen diciendo 5 días.
  No decido: una persona confirma el plazo y **cuántas de las 8 semanas quedan**; ese dato no está en los documentos.
- OBS-002 (ronda 1, Arquitectura): con las 8 semanas completas, los 14 `Debe` caben y ninguno se declara «no cabe». Es un juicio cualitativo: 5 L, 4 M y 5 S, con 4 personas y un paralelo limitado por las dependencias. No hay una conversión aprobada de S/M/L a semanas. REQ-016 y REQ-026 quedan condicionados (OBS-003 y OBS-004). REQ-015 es L, pero no admite recorte: es un derecho del titular y trata datos de salud.
  Impacto: la ronda 2 no se abre por capacidad. Se abriría si quedan menos semanas de las previstas o si la medición del OCR sale mal.
  No decido: requiere confirmación de una persona.
- OBS-003 (ronda 1, Arquitectura): SPEC-003/RF-021 y SPEC-003/RF-022 (REQ-016) quedan condicionados a la medición del orden 0. Si la lectura no es útil, el flujo cae casi siempre en documento ilegible.
  Impacto: sin lectura útil no hay prevalidación de punta a punta, en ningún canal.
  Opciones: (a) dividir la entrega: primero fotos de documentos impresos con una plantilla sintética fija y después PDF, sin bajar prioridad; (b) aplazar a una segunda entrega los formatos distintos de esa plantilla. Simular la lectura no es opción: rompe la regla fija del OCR.
  No decido: requiere respuesta de Especificaciones o de una persona. Ninguna opción cambia SPEC-003.
- OBS-004 (ronda 1, Arquitectura): SPEC-002/RF-011 y SPEC-003/RNF-010 (REQ-026) quedan condicionados a la carga y la cámara dentro de la Mini App en iOS y Android, sin comprobar aún (PREG-007 pedía probarlo pronto).
  Impacto: si falla, Telegram no tiene paridad y se incumple DEC-P01.
  Opciones: (a) dividir REQ-026 en recorrido web y recorrido Mini App, ambos `Debe`, con un ensayo temprano de la cámara en el orden 4; (b) aplazar lo secundario del canal, como el enlace profundo (SPEC-002/RF-017, SPEC-002/AC-015), para proteger el recorrido.
  No decido: requiere respuesta de Especificaciones o de una persona.
- OBS-005 (ronda 1, Arquitectura, responde REV-008): propongo dos cambios al orden de DEC-P01.
  (1) `eps_simulada` antes de `identidad`: REQ-001 depende de REQ-007 en Requisitos y SPEC-001/RF-004 toma el celular de la EPS simulada, así que `identidad` no puede quedar en verde sin ella. La alternativa sería un doble de una fuente ya simulada, para reemplazarlo después.
  (2) REQ-015 después de `canales`: depende de REQ-013 y debe borrar lo que crean `prevalidacion` y `canales`.
  Impacto: `ORDEN_MODULOS` de `orquestador.py` conserva `identidad` primero, y `web` como último paso hace que el punto de decisión del agendamiento («prevalidación web en verde») llegue tarde. Por eso el orden 6 empieza por el navegador.
  No decido: una persona acepta o no el cambio; si lo acepta, ajusta el orquestador.
- OBS-006 (ronda 1, Arquitectura, tensión registrada, sin decidir): DEC-P61 fija un tope configurable de envío de códigos; SPEC-001/DEC-01 dice «No se impone un límite global adicional de generación de códigos de verificación». DEC-P61 afirma que SPEC-001 no cambia, y RES-007 señala que manda la más reciente. Además, al alcanzar el tope se muestra la ruta alterna, y SPEC-001/RF-006 incluye en ella «pedir un código nuevo», que en ese momento no se enviaría. El corte construye el tope como parámetro, sin valor, según ADR-006. No se propone cambiar la SPEC.
  No decido: lo resuelve una persona o el equipo.
- OBS-007 (ronda 1, para Especificaciones): SPEC-003/AC-034, AC-035, AC-036, AC-037, AC-038, AC-042, AC-043, AC-044, AC-047, AC-049 y AC-052 no aparecen en la columna de AC de ningún REQ. Conté su esfuerzo en REQ-002 y REQ-016 porque SPEC-003 está congelada; falta asignarlos en Requisitos.
- OBS-008 (ronda 1, para la persona y Especificaciones): REQ-015 usa SPEC-008/AC-054, que exige eventos almacenados, pero SPEC-008/RF-083 no tiene prioridad (pregunta abierta en Requisitos). El corte supone el registro mínimo de eventos que esa AC necesita, sin las métricas.
- OBS-009 (ronda 1, Arquitectura): quedan por fijar, y este corte no les da valor: el umbral de tolerancia (DEC-P60), el tope de códigos y su ventana (DEC-P61), la purga de solicitudes abandonadas (ADR-003) y `auth_date_max_age` (ADR-004). ARQ-005 tampoco define el mecanismo que rechaza destinos fuera de la lista del equipo (DEC-P18, SPEC-008/AC-049) ni los límites de tamaño y páginas (SPEC-003 sección 14; relacionado con PREG-017). Ambos deben estar resueltos antes de los órdenes 1 y 3.
- OBS-010 (ronda 1, Arquitectura): la propuesta tecnológica §5 dice «token de 90 días»; SPEC-002/RF-014 exige 3 meses calendario, en hora de Colombia (DEC-P21, DEC-P25). El corte sigue la SPEC: el vencimiento no se implementa como 90 días fijos.
- OBS-011 (ronda 1, Arquitectura, responde REV-004 a REV-006 y RES-006): el corte usa los mismos REQ, con 14 filas para los 14 `Debe`; separa regla de contenido y proveedor; retira «AC-36» y ajusta las fórmulas manuscritas a DEC-P28. Siguen citando «AC-36» o «48 horas» como obligación la propuesta tecnológica §4 y §6, el plan §8 y §9, y el skill (T-015, RES-007). No se tocaron.
- OBS-012 (ronda 1, Arquitectura): no cambié la cabecera, porque el modo «Cortar MVP» no lo pide. `estado` y `rondas_de_negociacion` siguen en `borrador` y 0 aunque esta sea la ronda 1. El `aprobado_por` lo escribe una persona.

## Registro de decisiones (ronda, qué se cambió, quién lo pidió, quién aprobó)

| Ronda | Fecha | Sección | Cambio | Lo pidió | Lo aprobó |
|-------|-------|---------|--------|----------|-----------|
| 0 | 2026-10-31 | — | Creación de la plantilla | Plan de agentes | Pendiente |
| 0 | 2026-10-31 | Observaciones | REV-001 a REV-010 de la revisión externa; `pipeline.json` vuelve a MVP no aprobado (estaba marcado «aprobado» sin `aprobado_por` aquí) | Revisión externa | Pendiente (persona) |
| 0 | 2026-10-31 | Alcance | Prevalidación completa (web + Telegram) entra; agendamiento en evaluación; PREG-006 y PREG-007 abiertas | Persona | Persona (alcance parcial; MVP sigue sin aprobar) |
| 0 | 2026-10-31 | Decisiones | DEC-P02 a DEC-P05 decididas; DEC-P06 a DEC-P10 propuestas (registro único en docs/decisiones.md) | Persona | Persona |
| 1 | 2026-11-01 | Requisitos | Sección reescrita con REQ-xxx y SPEC aprobadas: 14 Debe, 3 Bloqueados por PREG-074, 10 En evaluación, 2 Fuera del MVP. REQ-006, REQ-008 y REQ-023 divididos. Responde REV-001 a REV-003 | Persona (REV-001 a REV-003, DEC-P01, DEC-P35) | Pendiente (persona) |
| 1 | 2026-11-01 | Corte técnico, Observaciones | Corte reescrito con los 14 Debe y módulos de ARQ-005 v1.0; medición del OCR como orden 0; orden propuesto `eps_simulada` antes de `identidad`; plazo evaluado contra 8 semanas; costo del agendamiento; OBS-001 a OBS-012. Responde REV-004 a REV-008 y RES-006 | Persona (orden «cortar MVP», ronda 1) | Pendiente (persona) |
| 1 (ajuste) | 2026-11-01 | Requisitos | Aplicadas DEC-P64, DEC-P65, DEC-P66 y DEC-P69. REQ-004 se divide en REQ-004a (Debe) y REQ-004b (En evaluación); REQ-024 y REQ-008b pasan a En evaluación; REQ-015 y REQ-023a quedan confirmados; se crean REQ-027a (Debe) y REQ-027b (En evaluación) desde SPEC-008/RF-083; REQ-021 y REQ-025 pasan a En evaluación. Resultado: 16 Debe, 0 Bloqueados, 16 En evaluación, 0 Fuera del MVP. Corte técnico sin cambios | Persona (DEC-P64, DEC-P65, DEC-P66, DEC-P69) | Decisiones: persona. Aplicación en Requisitos: pendiente (persona) |
