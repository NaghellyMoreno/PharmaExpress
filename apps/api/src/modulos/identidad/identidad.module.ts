import { Module } from '@nestjs/common';
import { IdentidadApi } from './api/identidad.api';
import {
  AutorizacionDatosSaludService,
} from './servicios/autorizacion-datos-salud.service';
import { ConsentimientoService } from './servicios/consentimiento.service';
import { RevocacionService } from './servicios/revocacion.service';
import { SolicitudCodigoService } from './servicios/solicitud-codigo.service';
import { VerificacionIdentidadService } from './servicios/verificacion.service';

// Nota: `VerificacionIdentidadService` necesita una `DependenciaEps` y dos `CanalNotificacion`
// (SMS/correo) que este módulo todavía no provee — ver PREG-082 y el comentario de
// `ConsentimientoService` sobre la fachada única pendiente de decisión del equipo. Por eso el
// bootstrap real de la app usa `IdentidadHttpModule` (solo lo que no depende de eso) y no este.
@Module({
  providers: [
    ConsentimientoService,
    AutorizacionDatosSaludService,
    RevocacionService,
    SolicitudCodigoService,
    IdentidadApi,
  ],
  exports: [IdentidadApi],
})
export class IdentidadModule {}
