import { Module } from '@nestjs/common';
import { NotificacionesApi } from './api/notificaciones.api';
import { NotificacionesService } from './servicios/notificaciones.service';

@Module({
  providers: [NotificacionesService, NotificacionesApi],
  exports: [NotificacionesApi],
})
export class NotificacionesModule {}
