import { cliente } from './cliente';
import { RegistroConsentimiento } from './tipos';

export function aceptarAvisoPrivacidad(
  solicitudId: string,
  condicion: 'titular' | 'tercero',
  canal: 'web' | 'telegram',
): Promise<RegistroConsentimiento> {
  return cliente.post('/identidad/aviso-privacidad/aceptar', { solicitudId, condicion, canal });
}

export function rechazarAvisoPrivacidad(solicitudId: string): Promise<{ registrado: boolean; atencionPresencial: string }> {
  return cliente.post('/identidad/aviso-privacidad/rechazar', { solicitudId });
}

export function autorizarDatosSalud(solicitudId: string, autorizada: boolean): Promise<{ ok: boolean }> {
  return cliente.post('/identidad/autorizacion-datos-salud', { solicitudId, autorizada });
}
