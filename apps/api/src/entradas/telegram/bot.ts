/**
 * Handlers de grammY del bot de Telegram (skill `grammy-handlers`).
 *
 * BR-008/DEC-P10: el chat solo lleva avisos con plantilla fija y un botón a la Mini App.
 * Ningún dato (cédula, código, documentos) se intercambia como texto suelto del chat.
 * El handler solo llama a la `api/` de `canales`; no contiene reglas de negocio.
 */

import { Bot, InlineKeyboard } from 'grammy';
import type { UserFromGetMe } from 'grammy/types';
import type { CanalesApi } from '../../modulos/canales/api/canales.api';
import { PLANTILLAS, TEXTO_BOTON_MINI_APP } from './templates';

export interface ConfiguracionBot {
  token: string;
  miniAppUrl: string;
  /** Solo para pruebas: evita que `handleUpdate` necesite `bot.init()` (llamada real a `getMe`). */
  botInfo?: UserFromGetMe;
}

export function crearBot(config: ConfiguracionBot, canalesApi: CanalesApi): Bot {
  const bot = new Bot(config.token, config.botInfo ? { botInfo: config.botInfo } : undefined);
  const botonMiniApp = new InlineKeyboard().webApp(TEXTO_BOTON_MINI_APP, config.miniAppUrl);

  bot.use(async (ctx, next) => {
    // BR-008/DEC-P52: el bot solo opera en chats privados; en un grupo no vincula ni muestra información.
    if (ctx.chat && ctx.chat.type !== 'private') {
      return;
    }
    await next();
  });

  bot.command('start', async (ctx) => {
    await ctx.reply(PLANTILLAS.inicio, { reply_markup: botonMiniApp });
  });

  bot.on(['message:document', 'message:photo'], async (ctx) => {
    // RF-085/DEC-P44: no se procesa ni se guarda el archivo, su nombre ni su identificador.
    await canalesApi.procesarMensajeChatTelegram({
      message: { chat: { id: ctx.chat.id }, document: ctx.message.document, photo: ctx.message.photo },
    });
    await ctx.reply(PLANTILLAS.archivoNoProcesado, { reply_markup: botonMiniApp });
  });

  bot.on('message:text', async (ctx) => {
    await ctx.reply(PLANTILLAS.noReconocido, { reply_markup: botonMiniApp });
  });

  bot.catch((error) => {
    // No se filtran detalles internos al chat; el error ya quedó en el log del proceso.
    console.error('[telegram] error no controlado', error.message);
  });

  return bot;
}
