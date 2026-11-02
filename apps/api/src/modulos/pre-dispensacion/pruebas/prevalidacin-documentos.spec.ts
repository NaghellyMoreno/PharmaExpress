/**
 * Pruebas unitarias — módulo `pre-dispensacion` (prevalidación de documentos y fórmulas, SPEC-003 v1.14).
 *
 * No hay casos TC- diseñados formalmente por S2 para este módulo (sin LLM disponible
 * para ese paso); los oráculos citan directamente el texto de cada AC de la SPEC aprobada
 * (origen del dato: CONFIRMADO). Datos sintéticos: ver `simulacion/datos/eps-simulada.fixture.ts`.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PrevalidacionalServicio } from '../servicios/prevalidacional.servicio';
import { SimulacionApi } from '../../simulacion/api/simulacion.api';
import { SimulacionService } from '../../simulacion/servicios/simulacion.service';

describe('Prevalidación de Documentos y Fórmulas - SPEC-003', () => {
  let servicio: PrevalidacionalServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrevalidacionalServicio, SimulacionApi, SimulacionService],
    }).compile();

    servicio = module.get<PrevalidacionalServicio>(PrevalidacionalServicio);
  });

  it('AC-001: fórmula vigente con medicamento PBS y afiliación activa queda apta', async () => {
    const resultado = await servicio.prevalidarSolicitud({
      cedulaPaciente: '123456789',
      formulas: [{ numeroPrescripcion: '11111111111111111111', medicamentos: ['MED-PBS-01'] }],
      historiaClinica: { diagnostico: 'J00' },
    });

    expect(resultado.resultados[0]).toMatchObject({ apta: true });
  });

  it('AC-002: fórmula crónica prevalidada un viernes con fecha habilitada el domingo (posterior a la cita posible del sábado) queda no apta', async () => {
    const resultado = await servicio.prevalidarSolicitud({
      cedulaPaciente: '123456789',
      formulas: [{ numeroPrescripcion: '22222222222222222222', medicamentos: ['MED-CRON-01'] }],
      historiaClinica: { diagnostico: 'I10' },
      fechaSimuladaPrevalidacion: '2026-06-05', // viernes
    });

    expect(resultado.resultados[0]).toMatchObject({
      apta: false,
      motivo: 'La fecha habilitada de entrega por la EPS es posterior a la cita más próxima disponible.',
      siguientePaso: 'Indicar que lo gestione directamente con su EPS.',
    });
  });

  it('AC-003: rechazar la lectura OCR de un documento contabiliza el intento 1 y permite reintentar', async () => {
    const resultado = await servicio.procesarReintentoOCR({ documentoId: 'doc-001', accion: 'RECHAZAR' });
    expect(resultado).toMatchObject({ intento: 1, maximoIntentos: 2, agotado: false });
  });

  it('AC-003 / E1: el segundo rechazo consecutivo del mismo documento agota los intentos', async () => {
    await servicio.procesarReintentoOCR({ documentoId: 'doc-002', accion: 'RECHAZAR' });
    const segundo = await servicio.procesarReintentoOCR({ documentoId: 'doc-002', accion: 'RECHAZAR' });
    expect(segundo).toMatchObject({ intento: 2, agotado: true });
  });

  it('AC-014 / BR-008: afiliación inactiva detiene toda la solicitud y declara no aptas todas sus fórmulas', async () => {
    const resultado = await servicio.prevalidarSolicitud({
      cedulaPaciente: '000000000', // afiliación inactiva sintética
      formulas: [
        { numeroPrescripcion: '11111111111111111111', medicamentos: ['MED-PBS-01'] },
        { numeroPrescripcion: '22222222222222222222', medicamentos: ['MED-CRON-01'] },
      ],
      historiaClinica: { diagnostico: 'J00' },
    });

    expect(resultado.aptaAlgunaFormula).toBe(false);
    for (const r of resultado.resultados) {
      expect(r.apta).toBe(false);
      expect(r.motivo).toBe('Afiliación inactiva en la EPS simulada.');
    }
  });

  it('AC-054 / RF-032: al terminar la prevalidación de una solicitud no quedan fotos ni PDF; de cada fórmula solo quedan número, resultado, motivo y siguiente paso', async () => {
    await servicio.prevalidarSolicitud({
      solicitudId: 'sol-test-01',
      cedulaPaciente: '123456789',
      formulas: [{ numeroPrescripcion: '11111111111111111111', medicamentos: ['MED-PBS-01'] }],
      historiaClinica: { diagnostico: 'J00' },
    });

    const almacenamiento = await servicio.verificarLimpiezaAlmacenamiento('sol-test-01');
    expect(almacenamiento.fotosRestantes).toBe(0);
    expect(almacenamiento.resultados).toHaveLength(1);
    expect(Object.keys(almacenamiento.resultados[0]).sort()).toEqual(
      ['apta', 'motivo', 'numeroPrescripcion', 'siguientePaso'].sort(),
    );
  });
});
