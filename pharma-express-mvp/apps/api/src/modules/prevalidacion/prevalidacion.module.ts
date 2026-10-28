import { Module } from '@nestjs/common';
import { IdentidadModule } from '../identidad/identidad.module';
import { PrevalidacionController } from './prevalidacion.controller';
import { PrevalidacionService } from './prevalidacion.service';

@Module({ imports: [IdentidadModule], controllers: [PrevalidacionController], providers: [PrevalidacionService], exports: [PrevalidacionService] })
export class PrevalidacionModule {}
