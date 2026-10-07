<!--
Agente: Specification Agent
Modelo: openai/gpt-oss-120b
Fecha: 2026-09-30 18:37
Petición: Necesitamos que el paciente pueda cancelar su cita
-->

# SPEC-001. Cancelar cita del paciente - Versión 0.1  

Estado: Borrador  
Modo: Inicial  
Necesidad original: "Necesitamos que el paciente pueda cancelar su cita"

## Análisis
- **Objetivo:** permitir que el paciente (o su cuidador/facilitador) cancele una cita previamente agendada, liberando la reserva y el cupo correspondiente y notificando al paciente.
- **Alcance inicial:** cancelación de citas agendadas tanto para tratamientos agudos como crónicos, a través de los canales web y Telegram. No incluye reprogramación ni generación de una nueva cita (se debe iniciar una nueva solicitud).  
- **Actores:** paciente, cuidador/tutor/facilitador (actúan indistintamente), dispensador (solo recibe la notificación de cancelación en el sistema), sistema de notificaciones (Telegram, SMS, correo, web).  
- **Contexto aplicable:** 3.1 (canales), 3.3 (vinculación de canales), 3.5 (agenda y reserva), 3.6 (notificaciones), 3.5 “El usuario puede cancelar en cualquier momento. Para obtener otra cita debe iniciar una nueva solicitud.”  

## Contradicciones detectadas
- Ninguna.

## Preguntas de aclaración
- **OPEN-Q-001.** ¿La cancelación de una cita debe generar una notificación de confirmación al paciente por todos los medios (web, Telegram, SMS, correo)?  
  Por qué importa: define la regla de negocio y los criterios de aceptación de la notificación.  
  Crítica: sí  
  Estado: Pendiente  
  Responsable: equipo  

- **OPEN-Q-002.** ¿Existe alguna restricción de tiempo para cancelar la cita (por ejemplo, no permitir cancelación dentro de una hora antes de la cita)?  
  Por qué importa: afecta la lógica de validación y los casos límite.  
  Crítica: sí  
  Estado: Pendiente  
  Responsable: equipo  

- **OPEN-Q-003.** Cuando se cancela una cita, ¿la reserva de medicamentos y el cupo de la ventana quedan liberados inmediatamente y quedan disponibles para otros pacientes?  
  Por qué importa: determina la acción sobre el inventario simulado y la capacidad de la ventana.  
  Crítica: sí  
  Estado: Pendiente  
  Responsable: equipo  

- **OPEN-Q-004.** Si la cita corresponde a una fórmula que incluye medicamentos crónicos y agudos (cita múltiple por punto), ¿la cancelación afecta a todas las citas asociadas a esa fórmula o solo a la cita seleccionada?  
  Por qué importa: define el alcance de la cancelación y la consistencia de la reserva.  
  Crítica: sí  
  Estado: Pendiente  
  Responsable: equipo  

- **OPEN-Q-005.** ¿Se debe registrar el motivo de la cancelación (p. ej., “cambio de planes”, “no disponible”) y, de ser así, dónde se almacena esa información?  
  Por qué importa: afecta trazabilidad y posibles auditorías.  
  Crítica: no  
  Estado: Pendiente  
  Responsable: equipo  

- **OPEN-Q-006.** ¿La cancelación puede realizarse tanto desde la web como desde el bot de Telegram, y el flujo es idéntico en ambos canales?  
  Por qué importa: asegura consistencia multicanal.  
  Crítica: sí  
  Estado: Pendiente  
  Responsable: equipo  

- **OPEN-Q-007.** ¿Qué ocurre si el paciente intenta cancelar una cita que ya ha sido validada oficialmente por el dispensador (es decir, ya llegó al punto y se registró la entrega)?  
  Por qué importa: define comportamiento de excepción.  
  Crítica: sí  
  Estado: Pendiente  
  Responsable: equipo  

- **OPEN-Q-008.** ¿Se debe impedir la cancelación si la fórmula ya tiene alguna entrega parcial registrada (p. ej., se entregó un medicamento pero no todos)?  
  Por qué importa: afecta la regla de negocio sobre entregas parciales.  
  Crítica: no  
  Estado: Pendiente  
  Responsable: equipo  

- **OPEN-Q-009.** ¿Se debe actualizar alguna métrica interna (p. ej., número de citas canceladas) para reportes posteriores?  
  Por qué importa: posible requerimiento de métricas, aunque fuera de alcance actual.  
  Crítica: no  
  Estado: Pendiente  
  Responsable: equipo  

- **OPEN-Q-010.** ¿La cancelación debe eliminar cualquier recordatorio previamente programado (por ejemplo, el recordatorio de una hora antes) para evitar envíos posteriores?  
  Por qué importa: evita notificaciones innecesarias.  
  Crítica: sí  
  Estado: Pendiente  
  Responsable: equipo  

## Especificación

### 1. Objetivo
Permitir al paciente (o a quien actúe en su nombre) cancelar una cita agendada, liberando la reserva y notificando la cancelación.

### 2. Contexto
El proceso se ejecuta dentro del sistema multicanal (web y Telegram) y utiliza los datos simulados de EPS e inventario. La cancelación se realiza antes de la validación oficial en el punto.  
Decisiones del equipo:  
- *Pendiente* (se registrarán cuando se respondan las preguntas abiertas).

### 3. Alcance
- Cancelación de citas agendadas para tratamientos agudos y crónicos.  
- Liberación de la reserva y del cupo de la ventana correspondiente.  
- Envío de notificación de confirmación de cancelación por todos los medios del paciente.  
- Registro de la acción de cancelación en el historial del paciente.  

### 4. Actores e historias de usuario
Actores: paciente, cuidador/tutor/facilitador, dispensador (solo como observador), sistema de notificaciones.  

- **HU-001.** Como paciente (o cuidador/facilitador), quiero cancelar una cita que ya he agendado, para no desplazarme innecesariamente.  

### 5. Requisitos funcionales
- **RF-001.** El sistema debe permitir al paciente cancelar una cita desde la web o el bot de Telegram mientras la cita está pendiente de validación oficial. Origen: necesidad.  
- **RF-002.** Al cancelar, el sistema debe liberar inmediatamente la reserva de medicamentos y el cupo de la ventana asociada. Origen: contexto 3.5, inferido, requiere confirmación (OPEN-Q-003).  
- **RF-003.** El sistema debe registrar la cancelación con fecha, hora, canal y usuario que la realizó. Origen: inferido, requiere confirmación (OPEN-Q-005).  
- **RF-004.** El sistema debe enviar una notificación de confirmación de cancelación por todos los medios del paciente (web, Telegram, SMS, correo). Origen: inferido, requiere confirmación (OPEN-Q-001).  
- **RF-005.** Si la cita incluye varios puntos (por fórmula con medicamentos en distintos puntos), la cancelación debe afectar a todas las citas vinculadas a esa fórmula. Origen: inferido, requiere confirmación (OPEN-Q-004).  
- **RF-006.** El sistema debe impedir la cancelación de una cita que ya haya sido validada oficialmente por el dispensador. Origen: inferido, requiere confirmación (OPEN-Q-007).  
- **RF-007.** Al cancelar, el sistema debe eliminar cualquier recordatorio programado para esa cita. Origen: inferido, requiere confirmación (OPEN-Q-010).  

### 6. Requisitos no funcionales
- **RNF-001.** Disponibilidad: la funcionalidad de cancelación debe estar disponible 99.5 % del tiempo de operación del sistema. Origen: contexto 3.1 (canales operativos).  
- **RNF-002.** Seguridad: la cancelación solo puede ser ejecutada por un canal vinculado y con código de verificación vigente (según 3.2). Origen: contexto 3.2.  

### 7. Reglas de negocio
- **BR-001.** Sólo se pueden cancelar citas que no hayan sido validadas oficialmente (dispensador). Origen: inferido, requiere confirmación (OPEN-Q-007).  
- **BR-002.** La cancelación libera la reserva y el cupo de la ventana de forma atómica. Origen: inferido, requiere confirmación (OPEN-Q-003).  
- **BR-003.** Si la fórmula tiene citas en varios puntos, la cancelación de una de ellas implica la cancelación de todas (regla de atomicidad de la fórmula). Origen: inferido, requiere confirmación (OPEN-Q-004).  

### 8. Flujo principal
1. El paciente accede a la sección “Mis citas” en web o Telegram.  
2. Selecciona la cita que desea cancelar.  
3. El sistema muestra un mensaje de confirmación y solicita confirmación (Sí/No).  
4. El paciente confirma la cancelación.  
5. El sistema verifica que la cita no haya sido validada oficialmente.  
6. El sistema libera la reserva y el cupo de la ventana.  
7. El sistema registra la cancelación en el historial del paciente.  
8. El sistema envía notificación de confirmación por todos los medios del paciente.  
9. El sistema elimina los recordatorios programados para esa cita.  

### 9. Flujos alternativos y de excepción
- **A1.** El paciente intenta cancelar una cita ya validada oficialmente.  
  - El sistema muestra mensaje de error indicando que la cancelación no es posible y sugiere acudir al punto.  
- **E1.** La cancelación se realiza fuera del tiempo permitido (si se define restricción de tiempo).  
  - El sistema muestra mensaje de restricción y no permite la cancelación. (Pendiente de definición – OPEN-Q-002).  

### 10. Casos límite
- **CL-001.** Cancelación a menos de 1 hora de la cita (si se impone restricción). Origen: pendiente (OPEN-Q-002).  
- **CL-002.** Cancelación de una fórmula con citas en varios puntos simultáneamente. Origen: inferido, requiere confirmación (OPEN-Q-004).  

### 11. Criterios de aceptación
- **AC-001.** Dado un paciente con una cita agendada y sin validación oficial, cuando solicita cancelar la cita y confirma, entonces la cita desaparece de “Mis citas”, la reserva y el cupo quedan libres, y el paciente recibe una notificación de confirmación por todos sus canales.  
- **AC-002.** Dado un paciente con una cita ya validada oficialmente, cuando intenta cancelarla, entonces el sistema muestra un mensaje de error y no realiza ninguna acción sobre la reserva.  
- **AC-003.** Dado un paciente con una fórmula que tiene citas en dos puntos diferentes, cuando cancela la cita, entonces ambas citas se cancelan, se liberan ambas reservas y se envía una única notificación de cancelación.  

### 12. Dependencias
- Simulador de EPS (para validar estado de la cita).  
- Simulador de inventario (para liberar reservas).  
- Servicios de notificación (Telegram, SMS, correo).  

### 13. Restricciones
- No se permite reprogramación; el paciente debe iniciar una nueva solicitud para una nueva cita. Origen: contexto 3.5.  
- La cancelación no afecta a entregas parciales ya registradas (si existieran). Origen: inferido, requiere confirmación (OPEN-Q-008).  

### 14. Fuera de alcance
- Reprogramación de citas.  
- Gestión de entregas parciales o generación de pendientes.  
- Registro de motivos de cancelación (a menos que se decida lo contrario).  
- Cita de continuidad.  

### 15. Preguntas abiertas
- OPEN-Q-001: Pendiente  
- OPEN-Q-002: Pendiente  
- OPEN-Q-003: Pendiente  
- OPEN-Q-004: Pendiente  
- OPEN-Q-005: Pendiente  
- OPEN-Q-006: Pendiente  
- OPEN-Q-007: Pendiente  
- OPEN-Q-008: Pendiente  
- OPEN-Q-009: Pendiente  
- OPEN-Q-010: Pendiente  

### 16. Trazabilidad
- HU-001: RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007; BR-001, BR-002, BR-003; AC-001, AC-002, AC-003; CL-001, CL-002.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad “Necesitamos que el paciente pueda cancelar su cita”.

## Verificación
- **Completitud:** no cumple (quedan preguntas críticas sin respuesta).  
- **Consistencia:** cumple.  
- **No ambigüedad:** no cumple (existen preguntas abiertas).  
- **Verificabilidad:** no cumple (faltan criterios claros por preguntas).  
- **Trazabilidad:** cumple.  
- **No invención:** cumple (no se inventaron reglas sin marcar como inferido).  
- **Delimitación:** cumple.  
- **Utilidad:** cumple.

## Siguiente paso
[En borrador:] Respondan las preguntas abiertas y ejecuten de nuevo el agente adjuntando este archivo.
