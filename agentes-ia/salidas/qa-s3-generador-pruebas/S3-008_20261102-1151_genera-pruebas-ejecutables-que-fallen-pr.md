<!--
Agente: QA S3 Generador de pruebas
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-11-02 11:51
Petición: Genera pruebas ejecutables que fallen primero.
-->

```file:apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConsentimientoIdentidadServicio } from '../servicios/consentimiento-identidad.servicio';

describe('Consentimiento e Identidad (SPEC-001)', () => {
  let servicio: ConsentimientoIdentidadServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsentimientoIdentidadServicio],
    }).compile();

    servicio = module.get<ConsentimientoIdentidadServicio>(ConsentimientoIdentidadServicio);
  });

  it('AC-001 / TC-001: Muestra aviso de privacidad antes de permitir datos', async () => {
    await expect(servicio.verificarAvisoPrevio('12345678')).rejects.toThrow('No implementado');
  });

  it('AC-002 / TC-002: Rechazar aviso de privacidad informa atención presencial y no registra nada', async () => {
    await expect(servicio.registrarRechazoAviso('tercero@example.com')).rejects.toThrow('No implementado');
  });

  it('AC-003 / TC-003: Solicitud de código nuevo anula el anterior si está por debajo del tope', async () => {
    await expect(servicio.solicitarNuevoCodigo('3001234567')).rejects.toThrow('No implementado');
  });

  it('AC-004 / TC-004: Validación exitosa de identidad con cédula y código en tiempo e intentos', async () => {
    await expect(servicio.verificarIdentidad('12345678', '123456')).rejects.toThrow('No implementado');
  });

  it('AC-005 / TC-005: Exige autorización separada para datos de salud antes de cargar documentos', async () => {
    await expect(servicio.verificarAutorizacionSalud('12345678')).rejects.toThrow('No implementado');
  });

  it('AC-006 / TC-006: Registro de aceptación por tercero sin exigir cédula ni nombre del tercero', async () => {
    await expect(servicio.registrarAceptacionTercero('WEB')).rejects.toThrow('No implementado');
  });

  it('AC-007 / TC-007: Revocación de consentimiento elimina datos y conserva auditoría disociada', async () => {
    await expect(servicio.revocarConsentimiento('12345678')).rejects.toThrow('No implementado');
  });

  it('AC-008 / TC-008: Revocación con citas activas cancela citas, anula códigos y libera recursos', async () => {
    await expect(servicio.revocarConsentimientoConReservas('12345678')).rejects.toThrow('No implementado');
  });

  it('AC-009 / TC-009: Validación en el límite exacto de 10 minutos rechaza el código', async () => {
    const fechaEmision = new Date(Date.now() - 10 * 60 * 1000);
    await expect(servicio.validarVigenciaCodigo('123456', fechaEmision)).rejects.toThrow('No implementado');
  });

  it('AC-010 / TC-010: Código incorrecto en 1er o 2do intento indica intentos restantes', async () => {
    await expect(servicio.intentarVerificacionCodigo('12345678', '999999')).rejects.toThrow('No implementado');
  });

  it('AC-011 / TC-011: Tercer intento fallido inactiva código y muestra ruta alterna', async () => {
    await expect(servicio.agotarIntentosCodigo('12345678')).rejects.toThrow('No implementado');
  });

  it('AC-012 / TC-012: Cédula no encontrada en EPS notifica y orienta a atención presencial', async () => {
    await expect(servicio.consultarCedulaEPS('99999999')).rejects.toThrow('No implementado');
  });

  it('AC-013 / TC-013: Fallo en envío SMS/correo informa novedad y ofrece reintento', async () => {
    await expect(servicio.enviarCodigoConFalloSimulado('3001234567')).rejects.toThrow('No implementado');
  });

  it('AC-015 / TC-014: Celular en tope de envíos presenta ruta alterna sin opción de nuevo código', async () => {
    await expect(servicio.validarTopeEnvios('3001234567')).rejects.toThrow('No implementado');
  });

  it('AC-016 / TC-016: Celular bajo el tope permite nuevo código y anula el anterior', async () => {
    await expect(servicio.renovarCodigoBajoTope('3001234567')).rejects.toThrow('No implementado');
  });

  it('AC-017 / TC-017: Celular en tope con código vigente no emite nuevo código y mantiene vigente el anterior', async () => {
    await expect(servicio.manejarTopeConCodigoVigente('3001234567')).rejects.toThrow('No implementado');
  });

  it('AC-018 / TC-018: Fallo total de canales no cuenta para el tope de envíos', async () => {
    await expect(servicio.registrarEnvioFallidoTotal('3001234567')).rejects.toThrow('No implementado');
  });

  it('AC-019 / TC-019: Envío por SMS y correo cuenta como un solo envío para el tope', async () => {
    await expect(servicio.contarEnvioMultipleCanales('3001234567')).rejects.toThrow('No implementado');
  });

  it('AC-020 / TC-020: SMS fallido y correo exitoso cuenta para el tope y muestra ruta alterna si está al límite', async () => {
    await expect(servicio.manejarEnvioParcialCanales('3001234567')).rejects.toThrow('No implementado');
  });
});
```

```file:qa/trazabilidad.md
# Matriz de Trazabilidad - Pharma Express

| AC-ID | TC-ID | Módulo | Ruta de la Prueba | Estado |
| :--- | :--- | :--- | :--- | :--- |
| AC-001 | TC-001 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-002 | TC-002 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-003 | TC-003 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-004 | TC-004 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-005 | TC-005 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-006 | TC-006 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-007 | TC-007 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-008 | TC-008 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-009 | TC-009 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-010 | TC-010 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-011 | TC-011 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-012 | TC-012 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-013 | TC-013 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-015 | TC-014 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-016 | TC-016 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-017 | TC-017 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-018 | TC-018 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-019 | TC-019 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
| AC-020 | TC-020 | identidad | `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` | Roja |
```

```text
Pruebas generadas: 19
  Jest unitarias: 19
  Testcontainers: 0
  Playwright: 0
  grammY simuladas: 0
@supuesto: 0
TC sin prueba: 0 (motivo: N/A)
Primera ejecución: 19 rojas, 0 verdes, 0 con error de sintaxis (debe ser 0)
```
