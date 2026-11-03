/**
 * Servicio de autorización de datos de salud — módulo identidad (SPEC-001 / RF-007, AC-005, TC-005).
 */

import { Inject, Injectable, Optional } from '@nestjs/common';
import {
  REPO_AUTORIZACIONES,
  RepositorioAutorizaciones,
  RepositorioAutorizacionesEnMemoria,
} from '../datos/repositorios';

@Injectable()
export class AutorizacionDatosSaludService {
  constructor(
    @Optional()
    @Inject(REPO_AUTORIZACIONES)
    private readonly repositorio: RepositorioAutorizaciones = new RepositorioAutorizacionesEnMemoria(),
  ) {}

  registrarAutorizacion(solicitudId: string, autorizada: boolean): Promise<void> {
    return this.repositorio.guardar(solicitudId, autorizada);
  }

  /** BR-007 / RF-007 / AC-005 / TC-005 — sin autorización separada no se solicitan ni cargan datos de salud. */
  async puedeCargar(solicitudId: string): Promise<boolean> {
    const autorizada = await this.repositorio.obtener(solicitudId);
    return autorizada === true;
  }
}
