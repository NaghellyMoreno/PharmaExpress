/**
 * Pruebas unitarias — módulo `canales` (vinculación y Mini App de Telegram, SPEC-002 v1.11).
 *
 * No hay casos TC- diseñados formalmente por S2 para este módulo (sin LLM disponible
 * para ese paso); los oráculos citan directamente el texto de cada AC de la SPEC aprobada
 * (origen del dato: CONFIRMADO). Datos sintéticos: ver `simulacion/datos/eps-simulada.fixture.ts`.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CanalesServicio } from '../servicios/canales.servicio';
import { SimulacionApi } from '../../simulacion/api/simulacion.api';
import { SimulacionService } from '../../simulacion/servicios/simulacion.service';

describe('Módulo canales — vinculación y Mini App de Telegram (SPEC-002)', () => {
  let servicio: CanalesServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanalesServicio, SimulacionApi, SimulacionService],
    }).compile();

    servicio = module.get<CanalesServicio>(CanalesServicio);
  });

  it('AC-009 / CL-005: solo expira la vinculación que cumple 3 meses calendario, la otra sigue vigente', async () => {
    await servicio.sembrarVinculacionDePrueba('telegram-chat-123', '8.765.432-1', '2026-08-01'); // vence 2026-11-01
    await servicio.sembrarVinculacionDePrueba('telegram-chat-123', '7.654.321-0', '2026-10-15'); // vence 2027-01-15

    const estado = await servicio.verificarExpiracionVinculaciones('telegram-chat-123', new Date('2026-11-02T15:00:00Z'));

    expect(estado.find((v) => v.pacienteCC === '8.765.432-1')).toMatchObject({ vigente: false, vencida: true });
    expect(estado.find((v) => v.pacienteCC === '7.654.321-0')).toMatchObject({ vigente: true, vencida: false });
  });

  it('AC-020 / CL-008: una vinculación del 30 de noviembre vence el último día de febrero', async () => {
    await servicio.sembrarVinculacionDePrueba('telegram-chat-999', '8.765.432-1', '2026-11-30');

    const vigenteEn28Feb = await servicio.verificarExpiracionVinculaciones('telegram-chat-999', new Date('2027-02-28T23:00:00Z'));
    expect(vigenteEn28Feb[0]).toMatchObject({ vigente: true });

    const vencidaEn1Marzo = await servicio.verificarExpiracionVinculaciones('telegram-chat-999', new Date('2027-03-01T05:00:00Z'));
    expect(vencidaEn1Marzo[0]).toMatchObject({ vigente: false });
  });

  it('AC-010 / RF-015: la vinculación vencida se revalida solo con un código nuevo, sin pedir cédula', async () => {
    await servicio.sembrarVinculacionDePrueba('telegram-chat-123', '11111111', '2026-01-01');
    const codigo = await servicio.generarCodigoRevalidacion('telegram-chat-123', '11111111');

    const conCodigoErrado = await servicio.revalidarVinculacionVencida('telegram-chat-123', '11111111', '000000');
    expect(conCodigoErrado.revalidada).toBe(false);

    const conCodigoCorrecto = await servicio.revalidarVinculacionVencida('telegram-chat-123', '11111111', codigo);
    expect(conCodigoCorrecto.revalidada).toBe(true);
  });

  it('AC-011 / AC-038 / BR-009: la lista de pacientes vinculados muestra solo CC ***1234, marcando la vinculación vencida', async () => {
    await servicio.sembrarVinculacionDePrueba('telegram-chat-123', '8.765.432-1', '2026-10-20'); // vigente
    await servicio.sembrarVinculacionDePrueba('telegram-chat-123', '7.654.321-0', '2026-01-01'); // vencida

    const pacientes = await servicio.obtenerPacientesVinculados('telegram-chat-123', new Date('2026-11-02T15:00:00Z'));

    expect(pacientes).toHaveLength(2);
    for (const p of pacientes) {
      expect(p.cedulaEnmascarada).toMatch(/^CC \*\*\*\d{4}$/);
    }
    expect(pacientes.find((p) => p.pacienteCC === '7.654.321-0')).toMatchObject({ vencida: true });
    expect(pacientes.find((p) => p.pacienteCC === '8.765.432-1')).toMatchObject({ vencida: false });
  });

  it('AC-012 / RF-020 / CL-006: la desvinculación con confirmación elimina la asociación del canal', async () => {
    await servicio.sembrarVinculacionDePrueba('telegram-chat-123', '8.765.432-1', '2026-10-20');

    const resultado = await servicio.desvincularPaciente('telegram-chat-123', '8.765.432-1', true);
    expect(resultado.desvinculado).toBe(true);

    const pacientes = await servicio.obtenerPacientesVinculados('telegram-chat-123');
    expect(pacientes).toHaveLength(0);
  });

  it('AC-040 (por analogía con RF-019): la desvinculación sin confirmar no elimina la asociación', async () => {
    await servicio.sembrarVinculacionDePrueba('telegram-chat-123', '8.765.432-1', '2026-10-20');

    const resultado = await servicio.desvincularPaciente('telegram-chat-123', '8.765.432-1', false);
    expect(resultado.desvinculado).toBe(false);

    const pacientes = await servicio.obtenerPacientesVinculados('telegram-chat-123');
    expect(pacientes).toHaveLength(1);
  });

  it('AC-013 / AC-018 / AC-035 / AC-039: un archivo enviado al chat se ignora y se responde con el botón a la Mini App, sin guardar contenido', async () => {
    const chatId = 123456789;
    const update = { message: { chat: { id: chatId }, document: { file_id: 'abc' } } };

    const respuesta = await servicio.procesarMensajeChatTelegram(update);

    expect(respuesta.boton).toBeDefined();
    expect(JSON.stringify(respuesta)).not.toContain('abc');
    await expect(servicio.contarIntentosArchivoChat(String(chatId))).resolves.toBe(1);
  });

  it('AC-022 / AC-025: la Mini App exige cédula y código en una vinculación nueva y rechaza un código incorrecto sin crear vinculación', async () => {
    const canalId = 'telegram-chat-nuevo';
    const pacienteCC = '123456789'; // cédula sintética registrada en la EPS simulada

    const codigoErroneo = await servicio.vincularNuevaMiniApp(canalId, pacienteCC, '000000');
    expect(codigoErroneo.vinculado).toBe(false);
    await expect(servicio.obtenerPacientesVinculados(canalId)).resolves.toHaveLength(0);

    const codigo = await servicio.generarCodigoRevalidacion(canalId, pacienteCC);
    const correcto = await servicio.vincularNuevaMiniApp(canalId, pacienteCC, codigo);
    expect(correcto.vinculado).toBe(true);
  });

  it('AC-025: una cédula inexistente en la EPS simulada no crea ninguna vinculación', async () => {
    const resultado = await servicio.vincularNuevaMiniApp('telegram-chat-nuevo', '999999999', '123456');
    expect(resultado.vinculado).toBe(false);
  });

  it('AC-024 / AC-032: con vinculación vigente la Mini App no exige código nuevo; sin vinculación, exige cédula y código', async () => {
    await servicio.sembrarVinculacionDePrueba('telegram-chat-vigente', '11111111', '2026-10-20');

    const conVinculacion = await servicio.validarAccesoMiniApp('telegram-chat-vigente', '11111111', new Date('2026-11-02T15:00:00Z'));
    expect(conVinculacion).toMatchObject({ accesoDirecto: true, requiereCodigoNuevo: false, requiereCedula: false });

    const sinVinculacion = await servicio.validarAccesoMiniApp('telegram-chat-nuevo', '22222222', new Date('2026-11-02T15:00:00Z'));
    expect(sinVinculacion).toMatchObject({ accesoDirecto: false, requiereCodigoNuevo: true, requiereCedula: true });
  });

  it('AC-033 / AC-040: la revocación con confirmación se aplica sin código nuevo; sin confirmar, no se aplica', async () => {
    await servicio.sembrarVinculacionDePrueba('telegram-chat-vigente', '11111111', '2026-10-20');

    const sinConfirmar = await servicio.revocarConsentimiento('telegram-chat-vigente', '11111111', false);
    expect(sinConfirmar.revocado).toBe(false);

    const confirmada = await servicio.revocarConsentimiento('telegram-chat-vigente', '11111111', true);
    expect(confirmada.revocado).toBe(true);
  });
});
