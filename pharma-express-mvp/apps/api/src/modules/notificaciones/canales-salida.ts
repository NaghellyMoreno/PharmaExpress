import { Injectable, Logger } from '@nestjs/common';
import { Api } from 'grammy';

/** SMS real con Twilio. Sin credenciales, registra el envío en consola (modo desarrollo). */
@Injectable()
export class SmsCanal {
  private log = new Logger('SMS');
  async enviar(numero: string, texto: string) {
    const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_FROM: from } = process.env;
    if (!sid || !token || !from) return this.log.warn(`[simulado] ${numero}: ${texto}`);
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: numero, From: from, Body: texto }),
    });
    if (!r.ok) this.log.error(`Twilio respondió ${r.status}`);
  }
}

/** Correo real con Resend. Sin credenciales, registra el envío en consola. */
@Injectable()
export class CorreoCanal {
  private log = new Logger('Correo');
  async enviar(correo: string, texto: string) {
    const { RESEND_API_KEY: key, CORREO_REMITENTE: from } = process.env;
    if (!key || !from) return this.log.warn(`[simulado] ${correo}: ${texto}`);
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [correo], subject: 'Pharma Express', text: texto }),
    });
    if (!r.ok) this.log.error(`Resend respondió ${r.status}`);
  }
}

/** Envío por Telegram (Bot API oficial). Solo a chats que iniciaron el bot y están vinculados (BR-09). */
@Injectable()
export class TelegramCanal {
  private log = new Logger('Telegram');
  readonly api = process.env.TELEGRAM_BOT_TOKEN ? new Api(process.env.TELEGRAM_BOT_TOKEN) : null;
  async enviar(chatId: string, texto: string) {
    if (!this.api) return this.log.warn(`[simulado] chat ${chatId}: ${texto}`);
    try {
      await this.api.sendMessage(chatId, texto);
    } catch (e) {
      this.log.warn(`No se pudo enviar al chat ${chatId} (¿bot bloqueado? CL-06): ${(e as Error).message}`);
    }
  }
}
