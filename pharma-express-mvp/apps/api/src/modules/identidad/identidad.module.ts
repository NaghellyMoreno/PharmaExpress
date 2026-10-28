import { Module } from '@nestjs/common';
import { AgendaModule } from '../agenda/agenda.module';
import { IdentidadController } from './identidad.controller';
import { IdentidadService } from './identidad.service';

@Module({ imports: [AgendaModule], controllers: [IdentidadController], providers: [IdentidadService], exports: [IdentidadService] })
export class IdentidadModule {}
