/**
 * Pruebas unitarias — módulo `simulacion` (EPS simulada y catálogos, SPEC-008 v1.10).
 *
 * No hay casos TC- diseñados formalmente por S2 para este módulo (sin LLM disponible
 * para ese paso); los oráculos aquí citan directamente el texto de cada AC de la SPEC
 * aprobada (origen del dato: CONFIRMADO). Datos sintéticos: ver `datos/eps-simulada.fixture.ts`.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { FestivosAnioFaltanteError, SimulacionService } from '../servicios/simulacion.service';

describe('SPEC-008: Datos simulados, parámetros y catálogos', () => {
  let service: SimulacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulacionService],
    }).compile();

    service = module.get<SimulacionService>(SimulacionService);
  });

  it('AC-034: consulta de paciente por cédula retorna cédula, EPS, afiliación, celular y correo', async () => {
    const paciente = await service.consultarPaciente('8.765.432-1');
    expect(paciente).toMatchObject({
      cedula: '8.765.432-1',
      eps: 'EPS-SINTETICA-1',
      afiliacionActiva: true,
      celular: '3000000001',
    });
    expect(paciente?.correo).toBeDefined();
  });

  it('AC-035: consulta de fórmula por su número de 20 dígitos retorna paciente, fecha, diagnóstico, medicamentos y vigencia', async () => {
    const formula = await service.consultarFormula('12345678901234567890');
    expect(formula).toMatchObject({
      numero: '12345678901234567890',
      cedulaPaciente: '8.765.432-1',
      fechaPrescripcion: '2026-02-01',
      diagnosticoCie10: 'I10',
      vigenciaHasta: '2026-10-15',
      fechaHabilitada: '2026-11-03',
    });
    expect(formula?.medicamentos.length).toBeGreaterThan(0);
  });

  it('AC-044: un número de fórmula que no existe en la EPS simulada se reporta como no encontrado', async () => {
    const formula = await service.consultarFormula('00000000000000000000');
    expect(formula).toBeNull();
  });

  it('AC-036 / AC-051: un medicamento cubierto en el catálogo PBS es apto sin necesitar autorización', async () => {
    const resultado = await service.verificarCoberturaPBS('MED-001', false);
    expect(resultado.pbs).toBe(true);
    expect(resultado.apto).toBe(true);
  });

  it('AC-047: un medicamento no cubierto por el catálogo pero autorizado en la EPS simulada es apto', async () => {
    const resultado = await service.verificarCoberturaPBS('MED-002', true);
    expect(resultado.pbs).toBe(false);
    expect(resultado.apto).toBe(true);
  });

  it('AC-048: un medicamento no cubierto y sin autorización en la EPS simulada no es apto', async () => {
    const resultado = await service.verificarCoberturaPBS('MED-002', false);
    expect(resultado.pbs).toBe(false);
    expect(resultado.apto).toBe(false);
  });

  it('AC-053 / DEC-P32: un medicamento ausente del catálogo de cobertura se trata como no PBS y exige autorización', async () => {
    const sinAutorizacion = await service.verificarCoberturaPBS('MED-099', false);
    expect(sinAutorizacion.pbs).toBe(false);
    expect(sinAutorizacion.apto).toBe(false);

    const autorizado = await service.verificarCoberturaPBS('MED-099', true);
    expect(autorizado.apto).toBe(true);
  });

  it('AC-037: clasifica como crónico un diagnóstico del catálogo y como agudo uno ausente', async () => {
    await expect(service.clasificarDiagnostico('I10')).resolves.toBe('cronico');
    await expect(service.clasificarDiagnostico('J00')).resolves.toBe('agudo');
  });

  it('AC-045 / CL-019: una fórmula con vigencia menor a la fecha de prevalidación está vencida', async () => {
    const vigente = await service.evaluarVigenciaFormula('98765432109876543210', new Date('2026-11-02T15:00:00Z'));
    expect(vigente).toBe(false);
  });

  it('AC-046 / AC-055: una fórmula se evalúa vigente hasta el final del día de su vigencia en hora de Colombia', async () => {
    // Vigencia 2026-11-01; a las 23:59:59 hora Colombia (2026-11-02T04:59:59Z) sigue vigente.
    const vigente = await service.evaluarVigenciaFormula('98765432109876543210', new Date('2026-11-02T04:59:59Z'));
    expect(vigente).toBe(true);
    // A las 00:00:00 del día siguiente hora Colombia (2026-11-02T05:00:00Z) ya venció.
    const vencida = await service.evaluarVigenciaFormula('98765432109876543210', new Date('2026-11-02T05:00:00Z'));
    expect(vencida).toBe(false);
  });

  it('AC-043 / CL-020: prevalidación de fórmula crónica en sábado antes de un lunes festivo retorna el martes siguiente', async () => {
    // 2026-08-15 es sábado; 2026-08-17 (lunes) es festivo del catálogo sintético (Asunción trasladada).
    const siguiente = await service.calcularDiaHabilSiguiente(new Date('2026-08-15T15:00:00Z'));
    expect(siguiente.toISOString().slice(0, 10)).toBe('2026-08-18');
  });

  it('AC-052 / DEC-P19: si falta el año en el catálogo de festivos, no se emite resultado y se señala el error', async () => {
    await service.quitarAnioFestivos(2028);
    await expect(service.calcularDiaHabilSiguiente(new Date('2028-12-30T15:00:00Z'))).rejects.toThrow(
      FestivosAnioFaltanteError,
    );
  });

  it('AC-049 / E1 / DEC-P18: el entorno de pruebas rechaza un celular o correo fuera de la lista del equipo', async () => {
    await expect(service.validarDatosContactoPrueba('3000000001', 'equipo1@pharmaexpress.test')).resolves.toBe(true);
    await expect(service.validarDatosContactoPrueba('3219999999', 'desconocido@ejemplo.com')).resolves.toBe(false);
  });

  it('AC-054 / DEC-P51: al revocar el consentimiento, del evento solo quedan el tipo y la fecha', async () => {
    const evento = await service.revocarConsentimientoEvento('EV-001');
    expect(evento.tipo).toBe('prevalidacion_completada');
    expect(evento.fecha).toBeDefined();
    expect(evento.pacienteCedula).toBeUndefined();
    expect(evento.resultado).toBeUndefined();
    expect(evento.novedades).toBeUndefined();
  });

  it('AC-056: cada fórmula de los datos de prueba tiene vigencia de 8 a 9 meses tras su prescripción', async () => {
    await expect(service.validarRangoVigenciaDatosPrueba()).resolves.toBe(true);
  });

  it('AC-056 (negativo): una vigencia fuera del rango de 8 a 9 meses se detecta', async () => {
    await service.establecerVigenciaFormula('12345678901234567890', '2026-09-01'); // 7 meses: fuera de rango
    await expect(service.validarRangoVigenciaDatosPrueba()).resolves.toBe(false);
  });

  it('AC-041 / A1: un cambio provocado en la afiliación durante las pruebas se refleja en la siguiente consulta', async () => {
    await service.establecerAfiliacion('8.765.432-1', false);
    const paciente = await service.consultarPaciente('8.765.432-1');
    expect(paciente?.afiliacionActiva).toBe(false);
  });
});
