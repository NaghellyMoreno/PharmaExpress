# Humo (R1)

Reportes `RUN-humo-<fecha>.md` contra el entorno desplegado.

Caminos mínimos:

1. Web: sesión → prevalidar → confirmar → reservar → QR.
2. Dispensador: escanear QR → entregar; segundo escaneo rechazado.
3. Telegram: vincular → aviso con plantilla fija.
4. Tareas: recordatorio y expiración (reloj adelantado en prueba).
5. Concurrencia ligera: 20 sobre 5 ⇒ máximo 5.

Chequeos transversales: sin medicamentos, diagnósticos ni cédulas en pantalla, mensajes o logs.

Skill: `plantilla-playwright-humo`, `formato-de-hallazgos`, `registro-de-ejecucion`.
