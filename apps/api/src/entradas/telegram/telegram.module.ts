/**
 * Módulo NestJS del canal Telegram. El bootstrap de la aplicación completa (main.ts,
 * AppModule) es tarea de B3/integración; aquí solo se cablean las dependencias propias
 * de este canal para que pueda montarse en ese bootstrap.
 */

import { Module } from '@nestjs/common';
import { CanalesModule } from '../../modulos/canales/canales.module';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
  imports: [CanalesModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
