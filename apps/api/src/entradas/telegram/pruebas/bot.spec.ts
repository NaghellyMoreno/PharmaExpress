/**
 * Pruebas unitarias — handlers de grammY del bot de Telegram (skill `grammy-handlers`).
 *
 * `bot.handleUpdate(update)` con updates simulados; nunca se llama a la API real de Telegram:
 * se intercepta `bot.api.config` para capturar los mensajes salientes en memoria.
 */

import type { Update } from 'grammy/types';
import { crearBot } from '../bot';
import { PLANTILLAS } from '../templates';
import type { CanalesApi } from '../../../modulos/canales/api/canales.api';

const BOT_TOKEN_SINTETICO = '123456:ABC-sintetico-no-es-un-token-real';

function crearBotDePrueba(canalesApi: Pick<CanalesApi, 'procesarMensajeChatTelegram'>) {
  const bot = crearBot(
    {
      token: BOT_TOKEN_SINTETICO,
      miniAppUrl: 'https://mini-app.pharmaexpress.test',
      botInfo: {
        id: 1,
        is_bot: true,
        first_name: 'Pharma Express (sintético)',
        username: 'pharma_express_test_bot',
        can_join_groups: true,
        can_read_all_group_messages: false,
        supports_inline_queries: false,
        can_connect_to_business: false,
        has_main_web_app: false,
        has_topics_enabled: false,
        allows_users_to_create_topics: false,
        can_manage_bots: false,
        supports_join_request_queries: false,
      },
    },
    canalesApi as CanalesApi,
  );
  const mensajesEnviados: { chatId: number; texto: string }[] = [];
  bot.api.config.use((_prev, method, payload) => {
    if (method === 'sendMessage') {
      const envio = payload as { chat_id: number; text: string };
      mensajesEnviados.push({ chatId: envio.chat_id, texto: envio.text });
    }
    return Promise.resolve({ ok: true, result: {} as never });
  });
  return { bot, mensajesEnviados };
}

function mensajeBase(overrides: Record<string, unknown>) {
  return {
    message_id: 1,
    date: Math.floor(Date.now() / 1000),
    chat: { id: 111222333, type: 'private' },
    from: { id: 111222333, is_bot: false, first_name: 'Sintético' },
    ...overrides,
  };
}

describe('Bot de Telegram — handlers (SPEC-002/DEC-P10)', () => {
  it('/start responde con la plantilla fija y el botón a la Mini App, sin pedir cédula', async () => {
    const { bot, mensajesEnviados } = crearBotDePrueba({ procesarMensajeChatTelegram: jest.fn() });
    const update: Update = {
      update_id: 1,
      message: mensajeBase({ text: '/start', entities: [{ offset: 0, length: 6, type: 'bot_command' }] }) as never,
    };

    await bot.handleUpdate(update);

    expect(mensajesEnviados).toHaveLength(1);
    expect(mensajesEnviados[0].texto).toBe(PLANTILLAS.inicio);
    expect(mensajesEnviados[0].texto).not.toMatch(/cédula|cedula/i);
  });

  it('AC-013 / AC-018 / RF-085: un documento enviado al chat no se procesa; responde con botón a la Mini App', async () => {
    const procesarMensajeChatTelegram = jest.fn().mockResolvedValue({ texto: PLANTILLAS.archivoNoProcesado });
    const { bot, mensajesEnviados } = crearBotDePrueba({ procesarMensajeChatTelegram });
    const update: Update = {
      update_id: 2,
      message: mensajeBase({
        document: { file_id: 'abc', file_unique_id: 'u1', file_name: 'formula.pdf', mime_type: 'application/pdf' },
      }) as never,
    };

    await bot.handleUpdate(update);

    expect(procesarMensajeChatTelegram).toHaveBeenCalledTimes(1);
    expect(mensajesEnviados[0].texto).toBe(PLANTILLAS.archivoNoProcesado);
  });

  it('un mensaje de texto suelto con una presunta cédula o código no se procesa como verificación (regresión H-001)', async () => {
    const { bot, mensajesEnviados } = crearBotDePrueba({ procesarMensajeChatTelegram: jest.fn() });
    const update: Update = {
      update_id: 3,
      message: mensajeBase({ text: '8765432' }) as never,
    };

    await bot.handleUpdate(update);

    expect(mensajesEnviados[0].texto).toBe(PLANTILLAS.noReconocido);
  });

  it('BR-008 / DEC-P52: en un grupo, el bot no responde ni vincula', async () => {
    const { bot, mensajesEnviados } = crearBotDePrueba({ procesarMensajeChatTelegram: jest.fn() });
    const update: Update = {
      update_id: 4,
      message: {
        ...mensajeBase({ text: '/start', entities: [{ offset: 0, length: 6, type: 'bot_command' }] }),
        chat: { id: -100999, type: 'group', title: 'Grupo sintético' },
      } as never,
    };

    await bot.handleUpdate(update);

    expect(mensajesEnviados).toHaveLength(0);
  });
});
