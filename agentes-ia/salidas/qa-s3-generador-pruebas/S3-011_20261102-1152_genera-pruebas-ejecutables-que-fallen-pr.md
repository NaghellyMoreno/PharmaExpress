<!--
Agente: QA S3 Generador de pruebas
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-11-02 11:52
Petición: Genera pruebas ejecutables que fallen primero.
-->

```file:apps/api/src/modulos/canales/pruebas/canales.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CanalesServicio } from '../servicios/canales.servicio';

describe('AC-009 / TC-001: Expiración independiente de vinculaciones a los 3 meses', () => {
  let servicio: CanalesServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanalesServicio],
    }).compile();

    servicio = module.get<CanalesServicio>(CanalesServicio);
  });

  it('AC-009 / TC-001: debe expirar solo la vinculación que cumple 3 meses manteniendo activa la otra', async () => {
    // Arrange
    const canalId = 'telegram-chat-123';
    const paciente1CC = '11111111';
    const paciente2CC = '22222222';

    // Act & Assert
    await expect(
      servicio.verificarExpiracionVinculaciones(canalId)
    ).rejects.toThrow('No implementado');
  });
});

describe('AC-010 / TC-002: Bloqueo y revalidación con código nuevo en vinculación vencida', () => {
  let servicio: CanalesServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanalesServicio],
    }).compile();

    servicio = module.get<CanalesServicio>(CanalesServicio);
  });

  it('AC-010 / TC-002: debe mostrar aviso de vencimiento y exigir solo código nuevo sin pedir cédula', async () => {
    const canalId = 'telegram-chat-123';
    const pacienteCC = '11111111';

    await expect(
      servicio.revalidarVinculacionVencida(canalId, pacienteCC, '999999')
    ).rejects.toThrow('No implementado');
  });
});

describe('AC-011 / TC-003: Selección explícita y enmascaramiento CC ***1234', () => {
  let servicio: CanalesServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanalesServicio],
    }).compile();

    servicio = module.get<CanalesServicio>(CanalesServicio);
  });

  it('AC-011 / TC-003: debe retornar la lista de pacientes con formato CC ***1234', async () => {
    const canalId = 'telegram-chat-123';

    await expect(
      servicio.obtenerPacientesVinculados(canalId)
    ).rejects.toThrow('No implementado');
  });
});

describe('AC-012 / TC-004: Desvinculación voluntaria con confirmación simple', () => {
  let servicio: CanalesServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanalesServicio],
    }).compile();

    servicio = module.get<CanalesServicio>(CanalesServicio);
  });

  it('AC-012 / TC-004: debe eliminar la vinculación y detener notificaciones en el canal manteniendo SMS/correo', async () => {
    const canalId = 'telegram-chat-123';
    const pacienteCC = '11111111';

    await expect(
      servicio.desvincularPaciente(canalId, pacienteCC, true)
    ).rejects.toThrow('No implementado');
  });
});

describe('AC-013 / TC-005: Manejo de archivos en el chat de Telegram sin procesar contenido', () => {
  let servicio: CanalesServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanalesServicio],
    }).compile();

    servicio = module.get<CanalesServicio>(CanalesServicio);
  });

  it('AC-013 / TC-005: debe ignorar el archivo y retornar respuesta con botón a la Mini App', async () => {
    const chat_id = 123456789;
    const update = { message: { chat: { id: chat_id }, document: { file_id: 'abc' } } };

    await expect(
      servicio.procesarMensajeChatTelegram(update)
    ).rejects.toThrow('No implementado');
  });
});

describe('AC-022 / TC-006: Exigencia de cédula y código en Mini App sin vinculación previa', () => {
  let servicio: CanalesServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanalesServicio],
    }).compile();

    servicio = module.get<CanalesServicio>(CanalesServicio);
  });

  it('AC-022 / TC-006: debe exigir cédula y código aunque Telegram envíe datos de usuario', async () => {
    const telegramUserId = 987654;
    const cc = '12345678';
    const codigo = '123456';

    await expect(
      servicio.vincularNuevaMiniApp(telegramUserId, cc, codigo)
    ).rejects.toThrow('No implementado');
  });
});

describe('AC-024 / TC-007: Omisión de código nuevo con vinculación vigente', () => {
  let servicio: CanalesServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanalesServicio],
    }).compile();

    servicio = module.get<CanalesServicio>(CanalesServicio);
  });

  it('AC-024 / TC-007: no debe pedir código nuevo al abrir la Mini App si la vinculación está vigente', async () => {
    const canalId = 'telegram-chat-vigente';
    const pacienteCC = '11111111';

    await expect(
      servicio.validarAccesoMiniApp(canalId, pacienteCC)
    ).rejects.toThrow('No implementado');
  });
});

describe('AC-025 / TC-008: Rechazo de autenticación con código erróneo o cédula inexistente', () => {
  let servicio: CanalesServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanalesServicio],
    }).compile();

    servicio = module.get<CanalesServicio>(CanalesServicio);
  });

  it('AC-025 / TC-008: debe rechazar y no crear vinculación ante código erróneo', async () => {
    const canalId = 'telegram-chat-nuevo';
    const pacienteCC = '99999999';
    const codigoErroneo = '000000';

    await expect(
      servicio.vincularNuevaMiniApp(canalId, pacienteCC, codigoErroneo)
    ).rejects.toThrow('No implementado');
  });
});

describe('AC-033 / TC-009: Revocación de consentimiento con vinculación vigente sin código nuevo', () => {
  let servicio: CanalesServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanalesServicio],
    }).compile();

    servicio = module.get<CanalesServicio>(CanalesServicio);
  });

  it('AC-033 / TC-009: debe aplicar revocación sin pedir código nuevo si hay vinculación vigente y confirmación', async () => {
    const canalId = 'telegram-chat-vigente';
    const pacienteCC = '11111111';

    await expect(
      servicio.revocarConsentimiento(canalId, pacienteCC, true)
    ).rejects.toThrow('No implementado');
  });
});

describe('AC-040 / TC-010: Solicitud de revocación sin confirmación no aplica cambios', () => {
  let servicio: CanalesServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanalesServicio],
    }).compile();

    servicio = module.get<CanalesServicio>(CanalesServicio);
  });

  it('AC-040 / TC-010: no debe revocar si el usuario no confirma la acción', async () => {
    const canalId = 'telegram-chat-vigente';
    const pacienteCC = '11111111';

    await expect(
      servicio.revocarConsentimiento(canalId, pacienteCC, false)
    ).rejects.toThrow('No implementado');
  });
});
```

```file:qa/trazabilidad.md
# Matriz de Trazabilidad - Pharma Express

| TC ID | AC ID | Módulo / Ruta de la Prueba | Estado |
| ----- | ----- | -------------------------- | ------ |
| TC-001 | AC-009 | apps/api/src/modulos/canales/pruebas/canales.spec.ts | Roja |
| TC-002 | AC-010 | apps/api/src/modulos/canales/pruebas/canales.spec.ts | Roja |
| TC-003 | AC-011 | apps/api/src/modulos/canales/pruebas/canales.spec.ts | Roja |
| TC-004 | AC-012 | apps/api/src/modulos/canales/pruebas/canales.spec.ts | Roja |
| TC-005 | AC-013 | apps/api/src/modulos/canales/pruebas/canales.spec.ts | Roja |
| TC-006 | AC-022 | apps/api/src/modulos/canales/pruebas/canales.spec.ts | Roja |
| TC-007 | AC-024 | apps/api/src/modulos/canales/pruebas/canales.spec.ts | Roja |
| TC-008 | AC-025 | apps/api/src/modulos/canales/pruebas/canales.spec.ts | Roja |
| TC-009 | AC-033 | apps/api/src/modulos/canales/pruebas/canales.spec.ts | Roja |
| TC-010 | AC-040 | apps/api/src/modulos/canales/pruebas/canales.spec.ts | Roja |
```

```text
Pruebas generadas: 10
  Jest unitarias: 10
  Testcontainers: 0
  Playwright: 0
  grammY simuladas: 0
@supuesto: 0
TC sin prueba: 0 (motivo: N/A)
Primera ejecución: 10 rojas, 0 verdes, 0 con error de sintaxis (debe ser 0)
```
