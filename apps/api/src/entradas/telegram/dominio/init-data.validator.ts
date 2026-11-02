/**
 * Validación criptográfica de `initData` de la Telegram Mini App (ARQ-005/COMP-002, ADR-004).
 *
 * Sin I/O, sin NestJS. Calcula HMAC-SHA256("WebAppData", bot_token) como clave secreta y la
 * usa sobre el data-check-string (algoritmo oficial de Telegram para `Telegram.WebApp.initData`).
 */

import { createHmac } from 'crypto';

export interface ResultadoValidacionInitData {
  valido: boolean;
  motivo?: 'vacio' | 'incluye_chat' | 'chat_type_no_permitido' | 'hash_invalido' | 'faltan_campos' | 'auth_date_vencido';
  userId?: number;
}

const CHAT_TYPES_PERMITIDOS = new Set(['private', 'sender']);

export function validarInitData(
  initData: string,
  botToken: string,
  authDateMaxAgeSegundos: number,
  ahoraSegundos: number = Math.floor(Date.now() / 1000),
): ResultadoValidacionInitData {
  if (!initData) {
    return { valido: false, motivo: 'vacio' };
  }

  const parametros = new URLSearchParams(initData);
  if (parametros.has('chat')) {
    // ARQ-005/COMP-002: una Mini App abierta desde un grupo trae `chat`; el bot solo opera en chats privados.
    return { valido: false, motivo: 'incluye_chat' };
  }
  const chatType = parametros.get('chat_type');
  if (chatType && !CHAT_TYPES_PERMITIDOS.has(chatType)) {
    return { valido: false, motivo: 'chat_type_no_permitido' };
  }

  const hashRecibido = parametros.get('hash');
  const authDate = parametros.get('auth_date');
  const userJson = parametros.get('user');
  if (!hashRecibido || !authDate || !userJson) {
    return { valido: false, motivo: 'faltan_campos' };
  }

  const dataCheckString = [...parametros.entries()]
    .filter(([clave]) => clave !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([clave, valor]) => `${clave}=${valor}`)
    .join('\n');

  const claveSecreta = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const hashCalculado = createHmac('sha256', claveSecreta).update(dataCheckString).digest('hex');

  if (hashCalculado !== hashRecibido) {
    return { valido: false, motivo: 'hash_invalido' };
  }

  if (ahoraSegundos - Number(authDate) > authDateMaxAgeSegundos) {
    return { valido: false, motivo: 'auth_date_vencido' };
  }

  const usuario = JSON.parse(userJson) as { id: number };
  return { valido: true, userId: usuario.id };
}
