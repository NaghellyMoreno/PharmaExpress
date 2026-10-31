/**
 * Puerta de entrada del módulo `identidad` (única API que consumen los demás módulos).
 * Delega en `servicios/`; el controlador y los DTO viven en `api/dto/`.
 */

import { AutorizacionDatosSaludService } from '../servicios/autorizacion-datos-salud.service';
import { ConsentimientoService } from '../servicios/consentimiento.service';
import { RevocacionService } from '../servicios/revocacion.service';
import { SolicitudCodigoService } from '../servicios/solicitud-codigo.service';
import { VerificacionIdentidadService } from '../servicios/verificacion.service';
import { IdentidadRepository } from '../datos/identidad.repository';

export class IdentidadApi {
  constructor(
    private readonly consentimiento: ConsentimientoService,
    private readonly verificacion: VerificacionIdentidadService,
    private readonly autorizacion: AutorizacionDatosSaludService,
    private readonly revocacion: RevocacionService,
    private readonly solicitudes: SolicitudCodigoService,
    private readonly repositorio: IdentidadRepository,
  ) {}

  get consentimientoService(): ConsentimientoService { return this.consentimiento; }
  get verificacionService(): VerificacionIdentidadService { return this.verificacion; }
  get autorizacionService(): AutorizacionDatosSaludService { return this.autorizacion; }
  get revocacionService(): RevocacionService { return this.revocacion; }
  get solicitudCodigoService(): SolicitudCodigoService { return this.solicitudes; }
  get repositorio(): IdentidadRepository { return this.repositorio; }
}
