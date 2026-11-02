import { Module } from '@nestjs/common';
import { CanalesModule } from './modulos/canales/canales.module';
import { IdentidadHttpModule } from './modulos/identidad/identidad-http.module';
import { NotificacionesModule } from './modulos/notificaciones/notificaciones.module';
import { PreDispensacionModule } from './modulos/pre-dispensacion/pre-dispensacion.module';
import { SimulacionModule } from './modulos/simulacion/simulacion.module';
import { TelegramModule } from './entradas/telegram/telegram.module';

@Module({
  imports: [
    SimulacionModule,
    NotificacionesModule,
    IdentidadHttpModule,
    CanalesModule,
    PreDispensacionModule,
    TelegramModule,
  ],
})
export class AppModule {}
