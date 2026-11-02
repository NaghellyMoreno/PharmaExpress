import { extraerCamposFormula, extraerCamposHistoriaClinica, extraerNumeroPrescripcion } from '../dominio/ocr-extractor';

describe('Extracción de campos OCR — módulo pre-dispensacion (SPEC-003/RF-022, RF-030)', () => {
  it('RF-022: extrae el número de prescripción de 20 dígitos del texto reconocido', () => {
    const texto = 'FORMULA MEDICA\n12345678901234567890\nMED-PBS-01';
    expect(extraerNumeroPrescripcion(texto)).toBe('12345678901234567890');
  });

  it('devuelve undefined si no hay una secuencia de exactamente 20 dígitos', () => {
    expect(extraerNumeroPrescripcion('1234567890123456789')).toBeUndefined();
  });

  it('RF-030: separa el número de prescripción de los medicamentos leídos', () => {
    const texto = 'FORMULA MEDICA\n12345678901234567890\nMED-PBS-01\nMED-CRON-01';
    const campos = extraerCamposFormula(texto);
    expect(campos.numeroPrescripcion).toBe('12345678901234567890');
    expect(campos.medicamentos).toEqual(['FORMULA MEDICA', 'MED-PBS-01', 'MED-CRON-01']);
  });

  it('extrae el diagnóstico CIE-10 de la historia clínica', () => {
    expect(extraerCamposHistoriaClinica('I10\nhipertensión sintética')).toEqual({ diagnostico: 'I10' });
  });
});
