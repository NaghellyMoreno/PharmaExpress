<!--
Agente: Architecture Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-31 14:36
Petición: cortar MVP
-->

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
