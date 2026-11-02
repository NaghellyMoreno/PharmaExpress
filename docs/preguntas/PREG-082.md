# PREG-082. ¿Contra qué código real compara `VerificacionIdentidadService.validar` el código ingresado, y quién envía el SMS/correo que exige AC-013?

Origen: B1 (backend-servicios-api) — detectado al correr `apps/api/src/modulos/identidad/pruebas/servicios.spec.ts` contra `verificacion.service.ts`
SPEC: SPEC-001 v1.5 — RF-004…RF-006, RF-010, RF-011, AC-010, AC-011, AC-013
Estado: abierta
Bloquea: sí (impide poner en verde TC-007, TC-008 y TC-012 del módulo `identidad`)
Fecha: 2026-11-02

## Contexto

`VerificacionIdentidadService.validar(cedula, codigo, fechaMs, emisionMs?)` no recibe ni consulta el código que realmente se emitió para la cédula: construye su contexto a partir del propio `codigo` recibido (`clave = cedula:codigo`) y, si no hay estado previo para esa clave exacta, trata el código recibido como si fuera el emitido en ese mismo instante (`emision = emisionMs ?? fechaMs`). Esto repite H-004 del incidente `qa/incidentes/INC-20261031-001-identidad-v0.md` («cualquier código de 6 dígitos dentro del tiempo verifica la identidad»): un código nunca antes visto, de 6 dígitos, siempre se acepta en el primer intento, sin compararlo contra el código real.

Por separado, el constructor recibe `sms` y `correo` (`CanalNotificacion`) pero `validar` nunca los usa; no hay ningún método del módulo que envíe el código y pueda fallar en el envío.

Las pruebas TC-007 (AC-010), TC-008 (AC-011) y TC-012 (AC-013) de `servicios.spec.ts` llaman `verificacion.validar(cedula, '339966'|'548920', fecha)` sin ninguna llamada previa que establezca cuál es el código "real" de esa cédula, esperando que el sistema detecte que el código es incorrecto (TC-007/TC-008) o que el envío del código falló (TC-012). Con el diseño actual del servicio eso es imposible de verificar sin inventar una fuente de verdad.

## Por qué importa

Bloquea 3 de los 4 casos de servicios de identidad que siguen en rojo (TC-007, TC-008, TC-012); el cuarto (TC-006 con `emisionMs` correcto) ya quedó en verde. Sin decisión, S2 debe rediseñar estos TC y S3 reescribir las pruebas, y persiste un defecto de seguridad (suplantación de identidad, H-004) en el código que sí llega a producción.

## Opciones (si existen)

1. `VerificacionIdentidadService` depende de `SolicitudCodigoService` (o de una interfaz `ProveedorCodigoVigente`) para obtener el código y la hora de emisión real de la cédula, y compara por igualdad antes de aplicar las reglas de vigencia/intentos. El envío de SMS/correo (y su posible fallo, AC-013) ocurre en `SolicitudCodigoService.emitirCodigo`/`solicitarNuevoCodigo`, no en `validar`. Consecuencia: hay que rediseñar TC-004, TC-006, TC-007, TC-008, TC-011 y TC-012 para que `emitirCodigo` deje el contexto real y las pruebas de "código incorrecto" entren un código distinto del real.
2. Se mantiene `VerificacionIdentidadService` autónomo (sin depender de `SolicitudCodigoService`) pero se le añade un método explícito para sembrar/emitir el código vigente de una cédula (p. ej. `emitir(cedula, codigo, emisionMs)`), que las pruebas deben llamar antes de `validar`. El envío SMS/correo y su fallo (AC-013) se prueban en ese método, no en `validar`. Consecuencia: mismo rediseño de pruebas que la opción 1, pero sin tocar `SolicitudCodigoService`.
3. Otra regla que fije el equipo.

## Propuesta del agente (PROPUESTA)

Opción 1: evita tener dos mecanismos paralelos de "código vigente" (uno en `SolicitudCodigoService`, otro implícito en `VerificacionIdentidadService`), que es justo la duplicación que hoy produce el defecto.

## Respuesta del equipo

