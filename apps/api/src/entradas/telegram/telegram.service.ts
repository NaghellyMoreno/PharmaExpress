/**
 * Servicio del canal Telegram — crea el bot y expone el manejo del webhook (skill `grammy-handlers`).
 * Token y URL de la Mini App solo por variable de entorno (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_MINI_APP_URL`).
 */

import { Injectable } from '@nestjs/common';
import type { Bot } from 'grammy';
import type { Update } from 'grammy/types';
import { CanalesApi } from '../../modulos/canales/api/canales.api';
import { crearBot } from './bot';

@Injectable()
export class TelegramService {
  private bot: Bot | null = null;

  constructor(private readonly canalesApi: CanalesApi) {}

  private obtenerBot(): Bot {
    if (!this.bot) {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const miniAppUrl = process.env.TELEGRAM_MINI_APP_URL;
      if (!token || !miniAppUrl) {
        throw new Error('telegram_no_configurado');
      }
      this.bot = crearBot({ token, miniAppUrl }, this.canalesApi);
    }
    return this.bot;
  }

  async manejarWebhook(update: Update): Promise<void> {
    await this.obtenerBot().handleUpdate(update);
  }
}
