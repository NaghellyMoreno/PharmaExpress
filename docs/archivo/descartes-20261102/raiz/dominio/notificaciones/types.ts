export enum NotificationKind {
  REMINDER_1H = 'REMINDER_1H',
  REMINDER_DAY_BEFORE = 'REMINDER_DAY_BEFORE',
  CANCELLATION = 'CANCELLATION',
  REVOCATION = 'REVOCATION',
  EXPIRATION = 'EXPIRATION',
  CHANGE_STATUS = 'CHANGE_STATUS',
}

export type NotificationParams = {
  [key: string]: string | number;
};

export function buildMessage(
  kind: NotificationKind,
  params: NotificationParams
): string {
  const templates: Record<NotificationKind, (p: NotificationParams) => string> = {
    [NotificationKind.REMINDER_1H]: (p) =>
      `Recuerde su cita para el ${p.date} a las ${p.hour}. Puede cancelar en cualquier momento.`,
    [NotificationKind.REMINDER_DAY_BEFORE]: (p) =>
      `Mañana a las ${p.hour} tiene su cita para recoger los medicamentos. Puede cancelar en cualquier momento.`,
    [NotificationKind.CANCELLATION]: (p) =>
      `Ha cancelado su cita del ${p.date} a las ${p.hour}. Los medicamentos quedan disponibles para otra persona.`,
    [NotificationKind.REVOCATION]: (p) =>
      `Su consentimiento para el tratamiento de datos de salud ha sido revocado. Se eliminarán sus datos y reservas.`,
    [NotificationKind.EXPIRATION]: (p) =>
      `Su reserva expira el ${p.date} a las ${p.hour}.`,
    [NotificationKind.CHANGE_STATUS]: (p) =>
      `Se ha detectado un cambio en su afiliación/vigencia/autorización. Su cita se ha cancelado y los medicamentos quedan disponibles.`,
  };

  const template = templates[kind];
  if (!template) {
    throw new Error(`Plantilla no definida para el tipo ${kind}`);
  }
  return template(params);
}

export function validateMessageForPrivacy(message: string): boolean {
  const prohibited = [
    'medicamento',
    'diagnóstico',
    'cédula',
    'eps',
    'salud',
    'formula',
    'medic',
    'medicamento',
    'diagn',
    'cédula',
    'cedula',
  ];
  const lower = message.toLowerCase();
  return !prohibited.some((kw) => lower.includes(kw));
}
