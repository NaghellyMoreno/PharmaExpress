import { Module } from '@nestjs/common';
import { SimulacionApi } from './api/simulacion.api';
import { SimulacionService } from './servicios/simulacion.service';

@Module({
  providers: [SimulacionService, SimulacionApi],
  exports: [SimulacionApi],
})
export class SimulacionModule {}
