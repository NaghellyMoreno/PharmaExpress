import { Module } from '@nestjs/common';
import { AgendaModule } from '../agenda/agenda.module';
import { IdentidadModule } from '../identidad/identidad.module';
import { PrevalidacionModule } from '../prevalidacion/prevalidacion.module';
import { TelegramBotService } from './telegram-bot.service';

@Module({ imports: [IdentidadModule, PrevalidacionModule, AgendaModule], providers: [TelegramBotService] })
export class TelegramModule {}
