import { buildMessage, validateMessageForPrivacy, NotificationKind } from '../../../../../../../dominio/notificaciones/types';

describe('Domain: Notification types', () => {
  it('should build correct reminder 1h message', () => {
    const msg = buildMessage(NotificationKind.REMINDER_1H, {
      date: '2025-12-01',
      hour: '15:00',
    });
    expect(msg).toContain('2025-12-01');
    expect(msg).toContain('15:00');
  });

  it('should reject message containing prohibited words', () => {
    const msg = 'Este es un mensaje con medicamento prohibido';
    const isValid = validateMessageForPrivacy(msg);
    expect(isValid).toBe(false);
  });

  it('should accept message without prohibited words', () => {
    const msg = 'Recuerde su cita para el 2025-12-01 a las 15:00.';
    const isValid = validateMessageForPrivacy(msg);
    expect(isValid).toBe(true);
  });
});
