import { Module } from '@nestjs/common';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { SimulacionModule } from '../simulacion/simulacion.module';
import { CanalesApi } from './api/canales.api';
import { CanalesController } from './api/canales.controller';
import { CanalesServicio } from './servicios/canales.servicio';

@Module({
  imports: [SimulacionModule, NotificacionesModule],
  controllers: [CanalesController],
  providers: [CanalesServicio, CanalesApi],
  exports: [CanalesApi],
})
export class CanalesModule {}
