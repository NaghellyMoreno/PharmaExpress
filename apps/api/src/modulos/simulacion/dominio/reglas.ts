/**
 * Reglas de negocio puras del módulo `simulacion` (EPS simulada, catálogos).
 *
 * Sin I/O, sin NestJS, sin Prisma, sin HTTP. (skill: `nestjs-modulo-estandar`)
 * Base: SPEC-008 v1.10 — RF-076…RF-078, RF-084, BR-025…BR-027, AC-034…AC-056.
 */

const OFFSET_COLOMBIA_MS = 5 * 60 * 60 * 1000; // DEC-P71: hora de Colombia fija (UTC-5, sin horario de verano).

/** Fecha calendario (yyyy-mm-dd) en hora de Colombia para un instante UTC dado (DEC-P70, DEC-P71). */
export function fechaColombiaISO(instanteMs: number): string {
  const colombiaMs = instanteMs - OFFSET_COLOMBIA_MS;
  return new Date(colombiaMs).toISOString().slice(0, 10);
}

function sumarDiasISO(fechaISO: string, dias: number): string {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  return fecha.toISOString().slice(0, 10);
}

function esDomingo(fechaISO: string): boolean {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia)).getUTCDay() === 0;
}

export class FestivosAnioFaltanteError extends Error {
  constructor(public readonly anio: number) {
    super('festivos_anio_faltante');
  }
}

/**
 * BR-027 / RF-084 / AC-043 / CL-020 — primer día hábil siguiente a `fechaISO`,
 * saltando domingos y los festivos del catálogo. Lanza `FestivosAnioFaltanteError`
 * si algún año recorrido no está cargado en el catálogo (AC-052, DEC-P19).
 */
export function calcularDiaHabilSiguiente(
  fechaISO: string,
  catalogoFestivos: Record<number, string[]>,
): string {
  let candidata = sumarDiasISO(fechaISO, 1);
  // Límite defensivo: ningún calendario real tiene más de ~10 días no hábiles consecutivos.
  for (let intentos = 0; intentos < 30; intentos += 1) {
    const anio = Number(candidata.slice(0, 4));
    const festivosAnio = catalogoFestivos[anio];
    if (!festivosAnio) {
      throw new FestivosAnioFaltanteError(anio);
    }
    const esFestivo = festivosAnio.includes(candidata);
    if (!esDomingo(candidata) && !esFestivo) {
      return candidata;
    }
    candidata = sumarDiasISO(candidata, 1);
  }
  throw new Error('no_se_encontro_dia_habil');
}

/** BR-025 / AC-045, AC-046, AC-055 — vigente si la fecha de vigencia es ≥ la fecha de prevalidación. */
export function esFormulaVigente(vigenciaHastaISO: string, fechaPrevalidacionISO: string): boolean {
  return vigenciaHastaISO >= fechaPrevalidacionISO;
}

/** RF-078 / AC-037 — clasifica el tratamiento según el catálogo de diagnósticos crónicos. */
export function clasificarDiagnostico(
  codigoCie10: string,
  catalogoCronicos: ReadonlySet<string>,
): 'cronico' | 'agudo' {
  return catalogoCronicos.has(codigoCie10) ? 'cronico' : 'agudo';
}

export interface ResultadoCobertura {
  pbs: boolean;
  apto: boolean;
}

/**
 * RF-077 / BR-026 / AC-036, AC-047, AC-048, AC-051, AC-053 — el catálogo simulado de
 * cobertura prevalece sobre el indicador de la fórmula (DEC-P17); un medicamento ausente
 * del catálogo se trata como no PBS y exige autorización (DEC-P32).
 */
export function verificarCoberturaPBS(
  medicamentoCodigo: string,
  autorizadoEnEps: boolean,
  catalogoCobertura: Readonly<Record<string, boolean>>,
): ResultadoCobertura {
  const pbs = catalogoCobertura[medicamentoCodigo] ?? false;
  const apto = pbs || autorizadoEnEps;
  return { pbs, apto };
}

/** BR-025 / AC-056 — datos de prueba: vigencia de 8 a 9 meses tras la prescripción, extremos incluidos. */
export function vigenciaDentroDeRangoDePrueba(fechaPrescripcionISO: string, vigenciaHastaISO: string): boolean {
  const minimo = sumarMesesISO(fechaPrescripcionISO, 8);
  const maximo = sumarMesesISO(fechaPrescripcionISO, 9);
  return vigenciaHastaISO >= minimo && vigenciaHastaISO <= maximo;
}

function sumarMesesISO(fechaISO: string, meses: number): string {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1 + meses, dia));
  return fecha.toISOString().slice(0, 10);
}
