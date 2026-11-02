/**
 * Pruebas unitarias — validación de `initData` de la Mini App (ARQ-005/COMP-002, ADR-004).
 *
 * El dato esperado (el hash correcto) se construye con el algoritmo oficial y público de
 * Telegram para `Telegram.WebApp.initData` (no se deriva del código bajo prueba: es la
 * misma fórmula que cualquier cliente de Telegram usa para firmar `initData`).
 */

import { createHmac } from 'crypto';
import { validarInitData } from '../dominio/init-data.validator';

const BOT_TOKEN_SINTETICO = '123456:ABC-sintetico-no-es-un-token-real';

function firmarInitData(parametros: Record<string, string>, botToken: string): string {
  const dataCheckString = Object.entries(parametros)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([clave, valor]) => `${clave}=${valor}`)
    .join('\n');
  const claveSecreta = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const hash = createHmac('sha256', claveSecreta).update(dataCheckString).digest('hex');
  return new URLSearchParams({ ...parametros, hash }).toString();
}

describe('Validación de initData de la Mini App de Telegram', () => {
  it('acepta initData firmado correctamente en un chat privado y extrae el userId', () => {
    const initData = firmarInitData(
      { auth_date: String(Math.floor(Date.now() / 1000)), chat_type: 'private', user: JSON.stringify({ id: 987654 }) },
      BOT_TOKEN_SINTETICO,
    );

    const resultado = validarInitData(initData, BOT_TOKEN_SINTETICO, 86400);
    expect(resultado).toMatchObject({ valido: true, userId: 987654 });
  });

  it('rechaza initData vacío', () => {
    expect(validarInitData('', BOT_TOKEN_SINTETICO, 86400)).toMatchObject({ valido: false, motivo: 'vacio' });
  });

  it('rechaza initData con la propiedad `chat` (Mini App abierta desde un grupo)', () => {
    const initData = firmarInitData(
      {
        auth_date: String(Math.floor(Date.now() / 1000)),
        chat: JSON.stringify({ id: -100123 }),
        user: JSON.stringify({ id: 987654 }),
      },
      BOT_TOKEN_SINTETICO,
    );
    expect(validarInitData(initData, BOT_TOKEN_SINTETICO, 86400)).toMatchObject({ valido: false, motivo: 'incluye_chat' });
  });

  it('rechaza un chat_type distinto de private o sender', () => {
    const initData = firmarInitData(
      { auth_date: String(Math.floor(Date.now() / 1000)), chat_type: 'group', user: JSON.stringify({ id: 987654 }) },
      BOT_TOKEN_SINTETICO,
    );
    expect(validarInitData(initData, BOT_TOKEN_SINTETICO, 86400)).toMatchObject({
      valido: false,
      motivo: 'chat_type_no_permitido',
    });
  });

  it('rechaza un hash que no corresponde al token del bot', () => {
    const initData = firmarInitData(
      { auth_date: String(Math.floor(Date.now() / 1000)), user: JSON.stringify({ id: 987654 }) },
      'otro-token-distinto',
    );
    expect(validarInitData(initData, BOT_TOKEN_SINTETICO, 86400)).toMatchObject({ valido: false, motivo: 'hash_invalido' });
  });

  it('rechaza un auth_date más antiguo que auth_date_max_age', () => {
    const authDateVencido = Math.floor(Date.now() / 1000) - 7200; // hace 2 horas
    const initData = firmarInitData(
      { auth_date: String(authDateVencido), user: JSON.stringify({ id: 987654 }) },
      BOT_TOKEN_SINTETICO,
    );
    expect(validarInitData(initData, BOT_TOKEN_SINTETICO, 3600)).toMatchObject({
      valido: false,
      motivo: 'auth_date_vencido',
    });
  });
});
