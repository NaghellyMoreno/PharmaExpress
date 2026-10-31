/**
 * Servicio de consentimiento — módulo identidad (SPEC-001 / RF-001…RF-003, BR-001, AC-001…AC-006, TC-001…TC-003).
 */

import { puedeSolicitarDato } from '../dominio';

/** Plantilla fija: no incluye datos de salud, medicamentos ni diagnósticos. (skill: plantillas-sin-datos-de-salud) */
const PLANTILLA_ATENCION_PRESENCIAL =
  'No pudimos completar la operación. Intenta de nuevo o acude a la atención presencial.';

export interface RegistroConsentimiento {
  condicion: string;
  fecha: string;
  canal: string;
  cedula?: string;
  nombre?: string;
}

export class ConsentimientoService {
  /** BR-001 / RF-003 / AC-002 / TC-002 — sin aceptación no se registra nada; se informa la atención presencial. */
  async rechazar(solicitudId: string): Promise<{ registrado: boolean; atencionPresencial: string }> {
    return { registrado: false, atencionPresencial: PLANTILLA_ATENCION_PRESENCIAL };
  }

  /** DEC-03 / RF-002 / AC-006 / TC-003 — se registra titular o tercero con fecha, hora y canal. */
  async aceptar(
    solicitudId: string,
    condicion: string,
    fecha: string,
    canal: string,
  ): Promise<RegistroConsentimiento> {
    // El tercero no aporta cédula ni nombre (RF-002 / DEC-03).
    return { condicion, fecha, canal, cedula: undefined, nombre: undefined };
  }

  async aceptarTercero(
    solicitudId: string,
    condicion: string,
    fecha: string,
    canal: string,
  ): Promise<RegistroConsentimiento> {
    return this.aceptar(solicitudId, condicion, fecha, canal);
  }

  puedeSolicitarDato(consentimientoAceptado: boolean): boolean {
    return puedeSolicitarDato(consentimientoAceptado);
  }
}
