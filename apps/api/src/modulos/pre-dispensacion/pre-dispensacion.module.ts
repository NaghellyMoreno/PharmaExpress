import { Module } from '@nestjs/common';
import { SimulacionModule } from '../simulacion/simulacion.module';
import { PrevalidacionApi } from './api/prevalidacion.api';
import { PrevalidacionController } from './api/prevalidacion.controller';
import { OcrServicio } from './servicios/ocr.servicio';
import { PrevalidacionalServicio } from './servicios/prevalidacional.servicio';

@Module({
  imports: [SimulacionModule],
  controllers: [PrevalidacionController],
  providers: [PrevalidacionalServicio, OcrServicio, PrevalidacionApi],
  exports: [PrevalidacionApi],
})
export class PreDispensacionModule {}
