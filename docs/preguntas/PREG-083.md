# PREG-083. ¿Cuál es el texto exacto de la plantilla fija para enviar el código de verificación por SMS y por correo?

Origen: B1 (backend-servicios-api) — detectado al construir el módulo `notificaciones` (catálogo de plantillas)
SPEC: SPEC-001 v1.5 — RF-004, RF-005; skill `plantillas-sin-datos-de-salud`
Estado: abierta
Bloquea: no (se usa una propuesta mientras se decide)
Fecha: 2026-11-02

## Contexto

La skill `plantillas-sin-datos-de-salud` fija el texto exacto de nueve plantillas (reserva confirmada, recordatorios, cambio en la prevalidación, reserva expirada, error genérico, código inválido, sin disponibilidad, comando desconocido), pero ninguna es «se envía el código de verificación». DEC-P64 confirma que «el código de verificación» sigue siendo `Debe` del MVP, pero no fija su texto. SPEC-001/RF-004 y RF-005 exigen enviar el código por SMS y, si existe, correo, sin decir la redacción exacta.

## Por qué importa

El módulo `notificaciones` necesita un texto fijo para poder enviarlo (y para que ninguna prueba calcule el texto a partir del código bajo prueba). Mientras no se decida, el catálogo de plantillas usa la propuesta de abajo marcada explícitamente como no confirmada.

## Opciones (si existen)

1. «Tu código de verificación de Pharma Express es {{codigo}}. Vence en 10 minutos. Si no lo solicitaste, ignora este mensaje.» — consecuencia: expone el código en claro en el canal SMS/correo (igual que cualquier OTP estándar).
2. Un texto más corto sin el nombre del producto. Consecuencia: menos reconocible como mensaje legítimo.
3. Otro texto que fije el equipo.

## Propuesta del agente (PROPUESTA)

Opción 1, por ser el patrón estándar de mensajes OTP y no incluir ningún dato de salud ni de identificación más allá del código mismo.

## Respuesta del equipo

