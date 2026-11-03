/**
 * Servicio de verificación de identidad — módulo identidad (SPEC-001 / RF-004…RF-006, RF-010, RF-011, BR-002…BR-005, AC-004…AC-013, TC-004…TC-013).
 */

import { Optional } from '@nestjs/common';
import {
  calcularIntentosRestantes,
  esCodigoValido,
  ContextoCodigoVigente,
} from '../dominio';
import { RepositorioCodigos, RepositorioCodigosEnMemoria } from '../datos/repositorios';

export interface ResultadoVerificacion {
  valido: boolean;
  verificado?: boolean;
  error?: string;
  intentosRestantes?: number;
  reintentoPermitido?: boolean;
  inactivo?: boolean;
  rutaAlternativa?: unknown;
  notificado?: boolean;
  orientacion?: unknown;
  errorEnvio?: string;
  ofreceRutaAlternativa?: boolean;
}

export interface DependenciaEps {
  consultar(cedula: string): Promise<{ encontrada: boolean }>;
}

export interface CanalNotificacion {
  enviar(payload: unknown): Promise<{ ok: boolean }>;
}

/** Ruta alternativa fija ante fallo de verificación o de envío (RF-006, RF-011). */
const RUTA_ALTERNATIVA = {
  solicitarNuevoCodigo: true,
  orientacionEps: true,
  atencionPresencial: true,
};

interface EstadoCodigo extends ContextoCodigoVigente {}

export class VerificacionIdentidadService {
  constructor(
    private readonly eps: DependenciaEps,
    private readonly sms: CanalNotificacion,
    private readonly correo: CanalNotificacion,
    @Optional() private readonly repositorio: RepositorioCodigos = new RepositorioCodigosEnMemoria(),
  ) {}

  private clave(cedula: string, codigo: string): string {
    return `${cedula}:${codigo}`;
  }

  /**
   * RF-004 / BR-002 / AC-004, AC-009…AC-013 / TC-004…TC-013.
   * `emisionMs` es la emisión del código; cuando no se informa (caso de borde del caso de uso),
   * se toma como referencia la hora de ingreso para no retener datos de salud.
   */
  async validar(
    cedula: string,
    codigo: string,
    fechaMs: number,
    emisionMs?: number,
  ): Promise<ResultadoVerificacion> {
    const respuesta = await this.eps.consultar(cedula);

    if (!respuesta || respuesta.encontrada !== true) {
      // E4 / RF-010 / AC-012 / TC-011 — cédula no registrada o EPS no disponible.
      return {
        valido: false,
        notificado: true,
        orientacion: RUTA_ALTERNATIVA,
        error: 'eps_indisponible',
      };
    }

    const emision = emisionMs ?? fechaMs;
    const clave = this.clave(cedula, codigo);
    const contexto: EstadoCodigo = (await this.repositorio.obtener(clave)) ?? {
      codigo,
      emisionMs: emision,
      intentosFallidos: 0,
      inactivo: false,
    };

    const esValido = !contexto.inactivo && esCodigoValido(codigo, contexto.emisionMs, fechaMs);

    if (esValido) {
      const estadoExito: EstadoCodigo = { codigo, emisionMs: fechaMs, intentosFallidos: 0, inactivo: false };
      await this.repositorio.guardar(clave, estadoExito);
      return { valido: true, verificado: true };
    }

    const intentoFallido = contexto.intentosFallidos + 1;
    const inactivo = intentoFallido >= 3; // BR-005 / CL-004 / AC-011 / TC-008

    const nuevoEstado: EstadoCodigo = { ...contexto, intentosFallidos: intentoFallido, inactivo };
    await this.repositorio.guardar(clave, nuevoEstado);

    if (inactivo) {
      // Tercer intento fallido (BR-005 / CL-004 / AC-011 / TC-008) → inactivar y derivar a la ruta alternativa.
      return { valido: false, error: 'codigo_inactivo', inactivo: true, rutaAlternativa: RUTA_ALTERNATIVA };
    }

    if (!esCodigoValido(codigo, contexto.emisionMs, fechaMs)) {
      // Vigencia vencida (BR-005 / CL-003 / AC-009 / TC-006) → inactivar y derivar a la ruta alternativa.
      const estadoInactivo: EstadoCodigo = { ...contexto, inactivo: true };
      await this.repositorio.guardar(clave, estadoInactivo);
      return { valido: false, error: 'codigo_expirado', inactivo: true, rutaAlternativa: RUTA_ALTERNATIVA };
    }

    // Intento fallido dentro de la vigencia con intentos restantes (BR-005 / CL-004 / AC-010 / AC-011 / TC-007, TC-008).
    const intentosRestantes = calcularIntentosRestantes(intentoFallido);
    return {
      valido: false,
      error: 'codigo_invalido',
      intentosRestantes,
      reintentoPermitido: intentosRestantes > 0,
    };
  }
}
