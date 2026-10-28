import { randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto';

export const digitos = (n: number) => Array.from({ length: n }, () => randomInt(0, 10)).join('');
export const idAleatorio = () => randomBytes(24).toString('base64url');

export function hashSecreto(secreto: string): string {
  const sal = randomBytes(16);
  const h = scryptSync(secreto, sal, 32);
  return `${sal.toString('hex')}:${h.toString('hex')}`;
}
export function verificarSecreto(secreto: string, guardado: string): boolean {
  const [salHex, hHex] = guardado.split(':');
  const h = scryptSync(secreto, Buffer.from(salHex, 'hex'), 32);
  return timingSafeEqual(h, Buffer.from(hHex, 'hex'));
}
