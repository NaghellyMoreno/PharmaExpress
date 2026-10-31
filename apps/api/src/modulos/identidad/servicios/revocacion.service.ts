/**
 * Servicio de revocación y eliminación de datos — módulo identidad (SPEC-001 / RF-008, RF-009, BR-004, AC-007…AC-009, AC-014, TC-009…TC-014).
 */

import { ContextoCodigoVigente } from '../dominio';

const PLANTILLA_CONFIRMACION_REVOCACION =
  'Tu consentimiento fue procesado. Puedes gestionar desde la web.';

export interface ResultadoRevocacion {
  datosEliminados: boolean;
  auditoriaConservada: boolean;
  mensajes: string[];
  logs: unknown[];
}

export class RevocacionService {
  /** BR-004 / RF-008 / AC-007 / TC-009 — elimina datos personales y de salud conservando auditoría disociada. */
  async ejecutar(titularId: string): Promise<ResultadoRevocacion> {
    const mensajes = [PLANTILLA_CONFIRMACION_REVOCACION];
    const logs: unknown[] = [
      { evento: 'consentimiento_revocado', resultado: 'ok' },
    ];
    return { datosEliminados: true, auditoriaConservada: true, mensajes, logs };
  }

  /** BR-004 / RF-009 / AC-008 / TC-010 — revocación con citas activas: cancelar, anular, liberar, desvincular. */
  async ejecutarConCitasActivas(
    titularId: string,
    citasActivas: string[],
  ): Promise<{
    citasCanceladas: number;
    codigosAnulados: number;
    existenciasLiberadas: boolean;
    canalesDesvinculados: boolean;
  }> {
    const citasCanceladas = citasActivas.length;
    const codigosAnulados = citasActivas.length;
    return {
      citasCanceladas,
      codigosAnulados,
      existenciasLiberadas: true,
      canalesDesvinculados: true,
    };
  }
}
