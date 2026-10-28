import { Module } from '@nestjs/common';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';
import { TrabajosService } from './trabajos.service';

@Module({ controllers: [AgendaController], providers: [AgendaService, TrabajosService], exports: [AgendaService, TrabajosService] })
export class AgendaModule {}
