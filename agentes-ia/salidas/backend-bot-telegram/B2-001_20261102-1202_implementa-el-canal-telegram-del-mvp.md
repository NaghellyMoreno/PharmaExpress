<!--
Agente: B2 Bot de Telegram
Proveedor: openrouter
Modelo: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
Fecha: 2026-11-02 12:02
Petición: Implementa el canal Telegram del MVP
-->

```file:apps/api/src/entradas/telegram/templates.ts
export const TEMPLATES = {
  WELCOME: 'Bienvenido al asistente de Pharma Express. Para iniciar, envíe su número de cédula.',
  REQUEST_CODE: 'Hemos enviado un código de verificación por SMS al número registrado. Por favor, envíe el código de 6 dígitos.',
  INVALID_CODE: 'Código incorrecto. Por favor, intente nuevamente.',
  SUCCESS_LINK: 'Su cuenta de Telegram ha sido vinculada correctamente. Puede usar el botón a continuación para abrir la Mini App.',
  UNKNOWN_COMMAND: 'Comando no reconocido. Para usar el bot, envíe /vincular.',
  ERROR_GENERIC: 'Ha ocurrido un error. Por favor, intente nuevamente o contacte a soporte.',
};
```

```file:apps/api/src/entradas/telegram/telegram.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Bot } from 'grammy';
import * as Templates from './templates';
import { IdentidadService } from '../../identidad/identidad.service';
import { CanalesService } from '../../canales/canales.service';

@Injectable()
export class TelegramBotService {
  private bot: Bot;
  private readonly logger = new Logger(TelegramBotService.name);
  private conversationStates = new Map<number, { step: 'awaitingCedula' | 'awaitingCode'; cedula?: string }>();

  constructor(
    private readonly identiteService: IdentidadService,
    private readonly canalesService: CanalesService,
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.bot = new Bot(token);

    // Process only private chats
    this.bot.addUpdateHandler((ctx) => {
      if (ctx.chat?.type !== 'private') {
        return;
      }
      const chatId = ctx.chat.id;
      const text = ctx.message?.text?.trim();

      if (!text) return;

      // /start command
      if (text.startsWith('/')) {
        this.conversationStates.delete(chatId);
        this.bot.sendMessage(chatId, Templates.TEMPLATES.WELCOME);
        return;
      }

      // No state -> assume cédula
      if (!this.conversationStates.has(chatId)) {
        this.conversationStates.set(chatId, { step: 'awaitingCedula' });
        this.bot.sendMessage(chatId, Templates.TEMPLATES.WELCOME);
        return;
      }

      const state = this.conversationStates.get(chatId);

      if (state.step === 'awaitingCedula') {
        if (/^\d+$/.test(text)) {
          await this.identiteService.requestOtp(text);
          this.conversationStates.set(chatId, { step: 'awaitingCode', cedula: text });
          this.bot.sendMessage(chatId, Templates.TEMPLATES.REQUEST_CODE);
        } else {
          this.bot.sendMessage(chatId, 'Por favor, envíe solo su número de cédula (digitos).');
        }
      } else if (state.step === 'awaitingCode') {
        if (/^\d{6}$/.test(text)) {
          const success = await this.identiteService.verifyOtp(text, state.cedula!);
          if (success) {
            await this.canalesService.linkChat(chatId, /* patientId */);
            this.bot.sendMessage(chatId, Templates.TEMPLATES.SUCCESS_LINK, {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Abrir Mini App',
                      web_app: { url: 'https://pharma-express.minimal.app' },
                    },
                  ],
                ],
              },
            });
            this.conversationStates.delete(chatId);
          } else {
            this.bot.sendMessage(chatId, Templates.TEMPLATES.INVALID_CODE);
          }
        } else {
          this.bot.sendMessage(chatId, Templates.TEMPLATES.INVALID_CODE);
        }
      }
    });

    this.bot.on('error', (err) => {
      this.logger.error(`Telegram bot error: ${err.message}`);
    });
  }

  async processUpdate(update: any) {
    await this.bot.handleUpdate(update);
  }
}
```

```file:apps/api/src/entradas/telegram/telegram.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { TelegramBotService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramBotService) {}

  @Post('webhook')
  async handleUpdate(@Body() body: any) {
    await this.telegramService.processUpdate(body);
    return { status: 'ok' };
  }
}
```

```file:apps/api/src/entradas/telegram/telegram.module.ts
import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramBotService } from './telegram.service';
import { IdentidadModule } from '../../identidad/identidad.module';
import { CanalesModule } from '../../canales/canales.module';

@Module({
  imports: [IdentidadModule, CanalesModule],
  controllers: [TelegramController],
  providers: [TelegramBotService],
})
export class TelegramModule {}
```
