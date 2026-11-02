/**
 * Extracción de campos a partir del texto bruto que devuelve el OCR (SPEC-003 / RF-022, RF-030).
 *
 * Sin I/O: recibe el texto ya reconocido (de Tesseract.js) y solo aplica reglas de formato.
 * No decide aptitud ni compara con la EPS simulada; eso es tarea de `PrevalidacionalServicio`.
 */

export interface CamposExtraidosFormula {
  numeroPrescripcion?: string;
  medicamentos: string[];
}

export interface CamposExtraidosHistoriaClinica {
  diagnostico?: string;
}

/** RF-022 / DEC-P12 — el número de prescripción es la primera secuencia de 20 dígitos del texto. */
export function extraerNumeroPrescripcion(textoCrudo: string): string | undefined {
  const coincidencia = textoCrudo.replace(/[^\d\n]/g, (c) => (c === '\n' ? '\n' : c)).match(/\d{20}/);
  return coincidencia?.[0];
}

/** RF-030 — líneas no vacías del texto, descontando la que trae el número de prescripción. */
function lineasUtiles(textoCrudo: string, numeroPrescripcion?: string): string[] {
  return textoCrudo
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter((linea) => linea.length > 0 && linea !== numeroPrescripcion);
}

export function extraerCamposFormula(textoCrudo: string): CamposExtraidosFormula {
  const numeroPrescripcion = extraerNumeroPrescripcion(textoCrudo);
  const medicamentos = lineasUtiles(textoCrudo, numeroPrescripcion);
  return { numeroPrescripcion, medicamentos };
}

/** La historia clínica trae un único diagnóstico CIE-10 por línea (BR-012: una sola historia clínica). */
export function extraerCamposHistoriaClinica(textoCrudo: string): CamposExtraidosHistoriaClinica {
  const [primeraLinea] = lineasUtiles(textoCrudo);
  const coincidencia = primeraLinea?.match(/[A-Z]\d{2}[A-Z0-9]?/);
  return { diagnostico: coincidencia?.[0] };
}
