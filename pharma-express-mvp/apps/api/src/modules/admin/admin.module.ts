import { Module } from '@nestjs/common';
import { AgendaModule } from '../agenda/agenda.module';
import { AdminController } from './admin.controller';

@Module({ imports: [AgendaModule], controllers: [AdminController] })
export class AdminModule {}
