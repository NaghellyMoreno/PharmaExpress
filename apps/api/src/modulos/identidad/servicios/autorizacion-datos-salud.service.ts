/**
 * Servicio de autorización de datos de salud — módulo identidad (SPEC-001 / RF-007, AC-005, TC-005).
 */

export class AutorizacionDatosSaludService {
  // Autorización separada aceptada por solicitud (en memoria para el caso de uso; Prisma en la implementación persistida).
  private readonly autorizacionesAceptadas = new Map<string, boolean>();

  registrarAutorizacion(solicitudId: string, autorizada: boolean): Promise<void> {
    this.autorizacionesAceptadas.set(solicitudId, autorizada);
    return Promise.resolve();
  }

  /** BR-007 / RF-007 / AC-005 / TC-005 — sin autorización separada no se solicitan ni cargan datos de salud. */
  async puedeCargar(solicitudId: string): Promise<boolean> {
    const autorizada = this.autorizacionesAceptadas.get(solicitudId);
    return autorizada === true;
  }
}
