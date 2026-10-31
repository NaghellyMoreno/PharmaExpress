import { Module } from '@nestjs/common';
import { IdentidadApi } from './api/identidad.api';
import { IdentidadRepository } from './datos/identidad.repository';
import {
  AutorizacionDatosSaludService,
} from './servicios/autorizacion-datos-salud.service';
import { ConsentimientoService } from './servicios/consentimiento.service';
import { RevocacionService } from './servicios/revocacion.service';
import { SolicitudCodigoService } from './servicios/solicitud-codigo.service';
import { VerificacionIdentidadService } from './servicios/verificacion.service';

@Module({
  providers: [
    ConsentimientoService,
    VerificacionIdentidadService,
    AutorizacionDatosSaludService,
    RevocacionService,
    SolicitudCodigoService,
    IdentidadRepository,
    IdentidadApi,
  ],
  exports: [IdentidadApi],
})
export class IdentidadModule {}
