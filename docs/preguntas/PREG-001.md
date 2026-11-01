# PREG-001. ¿Un código ingresado exactamente a los 10 minutos de su emisión es válido?

Origen: S1
SPEC: SPEC-001
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

La SPEC-001 versión 1.0 (candidata), módulo `identidad`, define en el RF-005 («El código de verificación debe tener una vigencia de 10 minutos y admitir máximo 3 intentos de ingreso») y en el AC-004 («Dado que el usuario agota los 3 intentos o vence el plazo de 10 minutos del código, cuando el sistema detecta el fallo, entonces ofrece la ruta alterna...») la vigencia del código y los intentos, pero no define si el código ingresado en el instante de los 10 minutos se considera válido o ya está vencido, ni cuándo exactamente se consumen los intentos (fallo por vencimiento vs fallo por agotamiento).

## Por qué importa

Sin esa respuesta, S2 no puede diseñar el caso límite del código y S3 no puede fijar el resultado esperado de la prueba en el límite de los 10 minutos; el hallazgo H-002 del informe de revisión queda pendiente de resolución.

## Opciones (si existen)

1. El código es válido durante los 10 minutos y hasta el límite inclusive (se acepta un código ingresado a los 10:00).
2. El código es válido solo antes de los 10 minutos (se rechaza a partir del minuto 10).
3. Otro criterio.

## Propuesta del agente (PROPUESTA)

Esperar la respuesta del equipo antes de proponer una decisión; no se debe inventar el criterio de validez en el límite.

## Respuesta del equipo

Respondida por el equipo en DEC-01 (OPEN-Q-001) e incorporada en la SPEC-001 v1.1, CL-003 / SPEC-001/AC-009: válido hasta 9 min 59 s; a los 10 min exactos se rechaza. Registro de cierre: revisión del 2026-10-31 (informe-SPEC-001.md).
