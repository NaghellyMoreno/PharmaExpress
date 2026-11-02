/**
 * Reglas de negocio puras del módulo `canales` (vinculación y Mini App de Telegram, SPEC-002 v1.11).
 *
 * Sin I/O, sin NestJS, sin Prisma, sin HTTP. (skill: `nestjs-modulo-estandar`)
 * BR-005 / RF-014 / AC-009, AC-020, AC-026 / CL-005, CL-008.
 */

const OFFSET_COLOMBIA_MS = 5 * 60 * 60 * 1000; // DEC-P25: hora de Colombia fija (UTC-5).

/** Fecha calendario (yyyy-mm-dd) en hora de Colombia para un instante UTC dado. */
export function fechaColombiaISO(instanteMs: number): string {
  return new Date(instanteMs - OFFSET_COLOMBIA_MS).toISOString().slice(0, 10);
}

/**
 * BR-005 / RF-014 / CL-008 — fecha de vencimiento a los N meses calendario. Si el día no existe
 * en el mes de vencimiento, vence el último día de ese mes.
 */
export function calcularFechaVencimiento(fechaVinculacionISO: string, meses = 3): string {
  const [anio, mes, dia] = fechaVinculacionISO.split('-').map(Number);
  const mesesTotales = mes - 1 + meses;
  const anioObjetivo = anio + Math.floor(mesesTotales / 12);
  const mesObjetivo = ((mesesTotales % 12) + 12) % 12;
  const ultimoDiaMesObjetivo = new Date(Date.UTC(anioObjetivo, mesObjetivo + 1, 0)).getUTCDate();
  const diaObjetivo = Math.min(dia, ultimoDiaMesObjetivo);
  return new Date(Date.UTC(anioObjetivo, mesObjetivo, diaObjetivo)).toISOString().slice(0, 10);
}

/** BR-005 — vigente durante todo el día de vencimiento; vence a las 00:00 del día siguiente. */
export function estaVigente(fechaVinculacionISO: string, ahoraISO: string, meses = 3): boolean {
  return ahoraISO <= calcularFechaVencimiento(fechaVinculacionISO, meses);
}

/** BR-009 — máscara obligatoria: tipo de documento y últimos 4 dígitos de la cédula. */
export function enmascararCedula(cedula: string): string {
  const digitos = cedula.replace(/\D/g, '');
  const ultimos4 = digitos.slice(-4);
  return `CC ***${ultimos4}`;
}
