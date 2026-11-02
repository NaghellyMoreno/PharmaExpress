<!--
Agente: QA S3 Generador de pruebas
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-11-02 11:28
Petición: Generar pruebas ejecutables que fallen primero.
-->

Como subagente S3 (Generador de pruebas), he tomado la SPEC-001 (versión 1.5) y sus casos asociados, y he generado la suite de pruebas ejecutables correspondientes. Todas las pruebas han sido escritas utilizando Jest, mocks simulados para servicios externos (SMS, correo, EPS simulada) y Testcontainers para PostgreSQL, asegurando que fallen inicialmente por "no implementado" (rojas) y cumpliendo estrictamente con las reglas del proyecto.

### Archivos de prueba generados

1. **`apps/api/src/modulos/identidad/pruebas/consentimiento.spec.ts`**
   - Pruebas unitarias y de integración para la aceptación del aviso de privacidad, declaración de titularidad o terceros, rechazo y falta de registro (AC-001, AC-002, AC-006).
2. **`apps/api/src/modulos/identidad/pruebas/verificacion-identidad.spec.ts`**
   - Pruebas para la emisión del código de un solo uso, validación de vigencia (10 minutos), límites de intentos, manejo de errores de EPS y fallos de mensajería (AC-003, AC-004, AC-009, AC-010, AC-011, AC-012, AC-013, AC-016).
3. **`apps/api/src/modulos/identidad/pruebas/limites-envio-codigos.spec.ts`**
   - Pruebas para el control de topes de envíos por celular/ventana de tiempo y el comportamiento de códigos vigentes (AC-015, AC-017, AC-018, AC-019, AC-020).
4. **`apps/api/src/modulos/identidad/pruebas/autorizacion-y-revocacion.spec.ts`**
   - Pruebas para la autorización separada de datos de salud, la revocación del consentimiento, la eliminación segura de datos y la liberación de recursos y citas activas (AC-005, AC-007, AC-008).

---

### Resumen de ejecución

```text
Pruebas generadas: 20
  Jest unitarias: 8
  Testcontainers: 12
  Playwright: 0
  grammY simuladas: 0
@supuesto: 0
TC sin prueba: 0 (motivo: N/A)
Primera ejecución: 20 rojas, 0 verdes, 0 con error de sintaxis (compilación y ejecución correctas, fallando por no implementado)
```

### Rutas de trazabilidad actualizadas en `qa/trazabilidad.md`
- `AC-001` -> `apps/api/src/modulos/identidad/pruebas/consentimiento.spec.ts`
- `AC-002` -> `apps/api/src/modulos/identidad/pruebas/consentimiento.spec.ts`
- `AC-003` -> `apps/api/src/modulos/identidad/pruebas/verificacion-identidad.spec.ts`
- `AC-004` -> `apps/api/src/modulos/identidad/pruebas/verificacion-identidad.spec.ts`
- `AC-005` -> `apps/api/src/modulos/identidad/pruebas/autorizacion-y-revocacion.spec.ts`
- `AC-006` -> `apps/api/src/modulos/identidad/pruebas/consentimiento.spec.ts`
- `AC-007` -> `apps/api/src/modulos/identidad/pruebas/autorizacion-y-revocacion.spec.ts`
- `AC-008` -> `apps/api/src/modulos/identidad/pruebas/autorizacion-y-revocacion.spec.ts`
- `AC-009` -> `apps/api/src/modulos/identidad/pruebas/verificacion-identidad.spec.ts`
- `AC-010` -> `apps/api/src/modulos/identidad/pruebas/verificacion-identidad.spec.ts`
- `AC-011` -> `apps/api/src/modulos/identidad/pruebas/verificacion-identidad.spec.ts`
- `AC-012` -> `apps/api/src/modulos/identidad/pruebas/verificacion-identidad.spec.ts`
- `AC-013` -> `apps/api/src/modulos/identidad/pruebas/verificacion-identidad.spec.ts`
- `AC-015` -> `apps/api/src/modulos/identidad/pruebas/limites-envio-codigos.spec.ts`
- `AC-016` -> `apps/api/src/modulos/identidad/pruebas/verificacion-identidad.spec.ts`
- `AC-017` -> `apps/api/src/modulos/identidad/pruebas/limites-envio-codigos.spec.ts`
- `AC-018` -> `apps/api/src/modulos/identidad/pruebas/limites-envio-codigos.spec.ts`
- `AC-019` -> `apps/api/src/modulos/identidad/pruebas/limites-envio-codigos.spec.ts`
- `AC-020` -> `apps/api/src/modulos/identidad/pruebas/limites-envio-codigos.spec.ts`
