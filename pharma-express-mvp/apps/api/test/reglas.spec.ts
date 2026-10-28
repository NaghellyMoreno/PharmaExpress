import {
  destinoItemAlLiberar, estadoFormulaPorItems, momentoRecordatorioNoche, prevalidarFormula, validarCodigoEnPunto, ventanasPermitidas,
} from '../src/domain/reglas';
import { plantillas, verificarSinDatosDeSalud } from '../src/domain/plantillas';

const AHORA = new Date(2026, 9, 27, 14, 20); // martes 27 oct 2026, 14:20
const CRONICOS = new Set(['I10', 'E11']);
const med = (nombre: string, pbs = true, autorizado = false) => ({ codigo: nombre, nombre, pbs, autorizado });
const formula = (o: Partial<Parameters<typeof prevalidarFormula>[0]> = {}) => ({
  numero: 'F-1', vigencia: new Date(2027, 5, 1), diagnostico: 'J02', habilitada: null, items: [med('A')], ...o,
});

describe('Prevalidación (SPEC-03)', () => {
  it('AC-21: fórmula vencida queda no apta con nueva valoración médica', () => {
    const r = prevalidarFormula(formula({ vigencia: new Date(2026, 8, 20) }), AHORA, CRONICOS, 'EPS');
    expect(r.apta).toBe(false);
    expect(r.motivo).toBe('Fórmula no vigente');
    expect(r.siguiente).toMatch(/valoración médica/);
  });
  it('AC-22 / CL-11: un medicamento sin autorización detiene toda la fórmula y muestra los trámites de la EPS', () => {
    const r = prevalidarFormula(formula({ items: [med('A'), med('B', false, false), med('C')] }), AHORA, CRONICOS, 'Trámites EPS');
    expect(r.apta).toBe(false);
    expect(r.siguiente).toBe('Trámites EPS');
  });
  it('AC-24: un no PBS autorizado no bloquea la fórmula', () => {
    expect(prevalidarFormula(formula({ items: [med('B', false, true)] }), AHORA, CRONICOS, '').apta).toBe(true);
  });
  it('AC-29: el PBS se verifica después de la vigencia y antes de la autorización', () => {
    const r = prevalidarFormula(formula(), AHORA, CRONICOS, '');
    expect(r.chequeos.map((c) => c.regla).slice(0, 3)).toEqual(['Vigencia', 'Cobertura PBS', 'Autorización']);
  });
  it('AC-25: diagnóstico en el catálogo → crónico; fuera del catálogo → agudo', () => {
    expect(prevalidarFormula(formula({ diagnostico: 'I10', habilitada: new Date(2026, 9, 28) }), AHORA, CRONICOS, '').tipo).toBe('CRONICO');
    expect(prevalidarFormula(formula({ diagnostico: 'J02' }), AHORA, CRONICOS, '').tipo).toBe('AGUDO');
  });
  it('CL-12: crónica habilitada exactamente mañana es apta', () => {
    expect(prevalidarFormula(formula({ diagnostico: 'I10', habilitada: new Date(2026, 9, 28) }), AHORA, CRONICOS, '').apta).toBe(true);
  });
  it('AC-26: crónica habilitada dentro de cinco días no es apta', () => {
    const r = prevalidarFormula(formula({ diagnostico: 'E11', habilitada: new Date(2026, 10, 1) }), AHORA, CRONICOS, '');
    expect(r.apta).toBe(false);
    expect(r.motivo).toBe('Entrega aún no habilitada');
  });
});

describe('Ventanas (SPEC-04)', () => {
  const punto = { id: 'P1', dias: [1, 2, 3, 4, 5, 6], abre: 7, cierra: 17, capacidad: 3 };
  it('AC-34: agudo a las 14:20 → la primera ventana de hoy inicia a las 15:20 o después', () => {
    const v = ventanasPermitidas(punto, AHORA, false, () => 0);
    const hoy = v.filter((w) => w.inicio.getDate() === 27);
    expect(hoy[0].inicio.getHours()).toBe(16);
    expect(v.some((w) => w.inicio.getDate() === 28)).toBe(true);
  });
  it('AC-33: con un crónico solo hay ventanas del día siguiente', () => {
    const v = ventanasPermitidas(punto, AHORA, true, () => 0);
    expect(v.length).toBe(10);
    expect(v.every((w) => w.inicio.getDate() === 28)).toBe(true);
  });
  it('AC-32 / CL-30: ventanas sin cupo no se ofrecen', () => {
    const v = ventanasPermitidas(punto, AHORA, true, (d) => (d.getHours() === 7 ? 3 : 0));
    expect(v.some((w) => w.inicio.getHours() === 7)).toBe(false);
  });
  it('CL-15: punto cerrado mañana → sin ventanas', () => {
    expect(ventanasPermitidas({ ...punto, dias: [2] }, AHORA, true, () => 0)).toEqual([]);
  });
});

describe('Recordatorios (SPEC-05)', () => {
  it('cita de mañana agendada a las 15:00 → recordatorio a las 19:30', () => {
    const r = momentoRecordatorioNoche(new Date(2026, 9, 28, 9), new Date(2026, 9, 27, 15));
    expect(r?.getHours()).toBe(19);
  });
  it('CL-19: agendada a las 22:00 → sin recordatorio nocturno', () => {
    expect(momentoRecordatorioNoche(new Date(2026, 9, 28, 9), new Date(2026, 9, 27, 22))).toBeNull();
  });
  it('cita del mismo día → sin recordatorio nocturno', () => {
    expect(momentoRecordatorioNoche(new Date(2026, 9, 27, 17), AHORA)).toBeNull();
  });
  it('AC-44: las plantillas no contienen medicamentos y el control bloquea un texto sensible', () => {
    const t = plantillas.confirmacion({ paciente: 'Rosa M.', punto: 'Punto Los Nogales', fecha: 'mié 28 oct', ventana: '07:00 a 08:00' });
    expect(() => verificarSinDatosDeSalud(t, ['Losartán', 'Hipertensión esencial'])).not.toThrow();
    expect(() => verificarSinDatosDeSalud(t + ' Losartán', ['Losartán'])).toThrow();
  });
});

describe('Estados y punto (A10, SPEC-06)', () => {
  it('BR-22: se pierde lo no recogido solo si ya se entregó parte de la fórmula', () => {
    expect(destinoItemAlLiberar(['ENTREGADO', 'RESERVADO'])).toBe('PERDIDO');
    expect(destinoItemAlLiberar(['RESERVADO', 'RESERVADO'])).toBe('LIBERADO');
  });
  it('estado de la fórmula por sus medicamentos', () => {
    expect(estadoFormulaPorItems(['ENTREGADO', 'ENTREGADO'])).toBe('ENTREGADA');
    expect(estadoFormulaPorItems(['ENTREGADO', 'RESERVADO'])).toBe('AGENDADA');
    expect(estadoFormulaPorItems(['ENTREGADO', 'PERDIDO'])).toBe('CERRADA_NO_ENTREGADOS');
    expect(estadoFormulaPorItems(['LIBERADO'])).toBe('LIBERADA');
  });
  const cita = { puntoId: 'P1', inicio: new Date(2026, 9, 28, 10), fin: new Date(2026, 9, 28, 11), estadoCodigo: 'EMITIDO' as const };
  it('AC-53/54/55/56 y CL-23: validación del código', () => {
    expect(validarCodigoEnPunto(cita, 'P1', new Date(2026, 9, 28, 10, 30))).toEqual({ ok: true });
    expect(validarCodigoEnPunto(cita, 'P1', new Date(2026, 9, 28, 9, 40))).toEqual({ ok: false, razon: 'ANTES_DE_VENTANA' });
    expect(validarCodigoEnPunto(cita, 'P1', new Date(2026, 9, 28, 11, 5))).toEqual({ ok: false, razon: 'EXPIRADA' });
    expect(validarCodigoEnPunto({ ...cita, estadoCodigo: 'USADO' }, 'P1', new Date(2026, 9, 28, 10, 30))).toEqual({ ok: false, razon: 'USADO' });
    expect(validarCodigoEnPunto(cita, 'P2', new Date(2026, 9, 28, 10, 30))).toEqual({ ok: false, razon: 'OTRO_PUNTO' });
    expect(validarCodigoEnPunto(cita, 'P1', new Date(2026, 9, 28, 10, 59))).toEqual({ ok: true }); // CL-26
  });
});
