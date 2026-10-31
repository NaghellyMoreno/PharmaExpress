/**
 * Reglas de negocio puras del módulo `identidad`.
 *
 * Sin I/O, sin NestJS, sin Prisma, sin HTTP. (skill: `nestjs-modulo-estandar`)
 *
 * Base en la SPEC-001 v1.1 (Aprobada y congelada) y `docs/mvp.md`:
 * - BR-001: sin aceptación no se registran datos.
 * - BR-002: identidad verificada con cédula + código de un solo uso.
 * - BR-003: nuevo código anula el anterior; solo el último es vigente.
 * - BR-005: vigencia de 10 minutos y máximo 3 intentos.
 * - CL-001…CL-004, RF-001…RF-011, AC-001…AC-013.
 *
 * Datos de salud: ningún dato clínico se maneja aquí; solo reglas y contadores.
 */

export const CODIGO_LONGITUD_DIGITOS = 6;
export const CODIGO_VIGENCIA_MS = 10 * 60 * 1000; // BR-005 / CL-003 / SPEC-001/AC-009
export const CODIGO_MAXIMO_INTENTOS = 3; // BR-005 / CL-004 / SPEC-001/AC-011

export interface ContextoCodigoVigente {
  codigo: string;
  emisionMs: number;
  intentosFallidos: number;
  inactivo: boolean;
}

/** BR-001 / RF-001, RF-003 / AC-001, AC-002, TC-001, TC-002. */
export function puedeSolicitarDato(consentimientoAceptado: boolean): boolean {
  // Sin aceptación vigente no se solicita ni registra ningún dato.
  return consentimientoAceptado === true;
}

/** BR-005 / CL-003 / SPEC-001/AC-009 — vigencia de 10 minutos (valida hasta 9:59:59; en el límite se rechaza). */
export function esCodigoValido(codigo: string, emisionMs: number, ingresoMs: number): boolean {
  const esLongitudCorrecta = new RegExp(`^\\d{${CODIGO_LONGITUD_DIGITOS}}$`).test(codigo);
  if (!esLongitudCorrecta) {
    return false;
  }
  const transcurridoMs = ingresoMs - emisionMs;
  if (transcurridoMs < 0) {
    return false;
  }
  return transcurridoMs < CODIGO_VIGENCIA_MS;
}

/** BR-005 / CL-004 / SPEC-001/AC-010, AC-011 — intentos restantes tras fallos. */
export function calcularIntentosRestantes(intentosFallidos: number): number {
  return Math.max(0, CODIGO_MAXIMO_INTENTOS - intentosFallidos);
}

/** BR-005 / CL-004 / SPEC-001/AC-011 — el tercer intento fallido inactiva el código. */
export function debeInactivarCodigo(intentosFallidos: number): boolean {
  return intentosFallidos >= CODIGO_MAXIMO_INTENTOS;
}

/** BR-003 / CL-001 / SPEC-001/AC-003 — solo el último código emitido es vigente. */
export function esCodigoVigente(
  codigo: string,
  contextoVigente?: ContextoCodigoVigente,
): boolean {
  if (!contextoVigente) {
    return false;
  }
  return contextoVigente.codigo === codigo && !contextoVigente.inactivo;
}
