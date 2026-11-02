/**
 * Webhook de Telegram (mismo servidor NestJS, skill `grammy-handlers`).
 */

import { Body, Controller, Post } from '@nestjs/common';
import type { Update } from 'grammy/types';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  async webhook(@Body() update: Update): Promise<{ ok: true }> {
    await this.telegramService.manejarWebhook(update);
    return { ok: true };
  }
}
