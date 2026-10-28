import { Global, Module } from '@nestjs/common';
import { ColaService } from './cola.service';
import { CorreoCanal, SmsCanal, TelegramCanal } from './canales-salida';
import { NotificacionesService } from './notificaciones.service';

@Global()
@Module({
  providers: [ColaService, SmsCanal, CorreoCanal, TelegramCanal, NotificacionesService],
  exports: [ColaService, NotificacionesService, TelegramCanal],
})
export class NotificacionesModule {}
