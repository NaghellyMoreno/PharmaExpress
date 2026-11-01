---
name: plantillas-sin-datos-de-salud
description: Reglas y plantillas fijas para mensajes, notificaciones, errores y logs que no nombran medicamentos, diagnósticos ni cédulas. Úsalo en B1, B2, B3 y en cualquier agente que produzca texto visible.
---
# Plantillas sin datos de salud

## Regla

**Ningún** mensaje, notificación, respuesta de error, log, fixture o ejemplo incluye nombres de medicamentos, diagnósticos, cédulas, correos o teléfonos reales. Los datos de prueba son sintéticos.

## Plantillas permitidas

| Situación | Plantilla |
|---|---|
| Reserva confirmada | «Tu reserva #{{id}} fue confirmada. Consulta los detalles en la web.» |
| Recordatorio día anterior | «Tienes una cita mañana. Puedes cancelar desde la web.» |
| Recordatorio 1 hora antes | «Tu cita empieza en una hora. Puedes cancelar desde la web.» |
| Cambio en la prevalidación | «Hubo un cambio en tu solicitud. Revisa el detalle y el siguiente paso en la web.» |
| Reserva expirada | «Tu reserva expiró. Puedes iniciar una nueva solicitud.» |
| Error genérico | «No pudimos completar la operación. Intenta de nuevo o acude a la atención presencial.» |
| Código inválido | «El código no es válido o venció. Solicita uno nuevo.» |
| Sin disponibilidad | «No hay disponibilidad en este momento. Vuelve a validar en 48 horas.» |
| Comando desconocido (Telegram) | «No reconozco ese comando. Usa el menú o consulta la web.» |

## Lista blanca de campos para logs (pino)

```ts
logger.info({
  evento: 'reserva_confirmada',
  reserva_id: 'res-123',
  punto_id: 'pto-01',
  ventana_id: 'ven-45',
  duracion_ms: 123,
  resultado: 'ok'
}, 'reserva confirmada');
```

Permitidos: ids internos, códigos de evento, estados, duraciones, conteos, versión, canal.
Prohibidos: `medicamento`, `diagnostico`, `cedula`, `nombre_paciente`, `correo`, `telefono`, `formula_texto`, cualquier campo libre con contenido clínico.

## Prohibiciones

- No interpoles nombres de medicamentos en plantillas.
- No registres el cuerpo completo de una petición o respuesta.
- No uses `console.log` con datos de la solicitud.
- No guardes datos de salud en `localStorage`, analítica ni mensajes de error.
- No incluyas la cédula en el estado de una conversación de Telegram.

## Verificación

- Busca en el código y en los logs de prueba los términos de la lista de datos sintéticos.
- Una prueba debe verificar que ningún mensaje ni log nombra un medicamento.
- Si encuentras una fuga, es un hallazgo **bloqueante** de datos de salud.
