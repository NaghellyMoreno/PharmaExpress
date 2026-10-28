/**
 * Plantillas fijas de notificación (SPEC-05, RNF-04, BR-25).
 * Las variables solo admiten punto, fecha, ventana, motivo administrativo e iniciales del paciente:
 * por construcción ninguna plantilla puede llevar nombres de medicamentos ni diagnósticos.
 */
export type VarsCita = { paciente: string; punto: string; fecha: string; ventana: string };

export const plantillas = {
  codigoVerificacion: (codigo: string) =>
    `Pharma Express: tu código de verificación es ${codigo}. Vence en 10 minutos. No lo compartas con nadie.`,
  confirmacion: (v: VarsCita) =>
    `Pharma Express (${v.paciente}): tu cita quedó confirmada en ${v.punto} el ${v.fecha}, de ${v.ventana}. Tus medicamentos están reservados. Consulta tu código de entrega en la web o en Telegram.`,
  recordatorioNoche: (v: VarsCita) =>
    `Pharma Express (${v.paciente}): mañana tienes cita en ${v.punto} de ${v.ventana}. Si no puedes ir, cancélala en la web o en Telegram.`,
  recordatorioHora: (v: VarsCita) =>
    `Pharma Express (${v.paciente}): tu cita en ${v.punto} empieza en una hora (${v.ventana}). Si no puedes ir, cancélala en la web o en Telegram.`,
  cambioEstado: (paciente: string, motivo: 'afiliación inactiva' | 'fórmula no vigente' | 'autorización no vigente') =>
    `Pharma Express (${paciente}): antes de tu cita detectamos un cambio (${motivo}). La cita quedó cancelada y no debes desplazarte. Consulta el siguiente paso en la web o en Telegram.`,
  cancelada: (v: VarsCita) => `Pharma Express (${v.paciente}): tu cita en ${v.punto} del ${v.fecha} fue cancelada. Si necesitas otra cita, inicia una nueva solicitud.`,
  expirada: (v: VarsCita) => `Pharma Express (${v.paciente}): tu cita en ${v.punto} terminó sin que se reclamara y fue liberada. Si necesitas otra cita, inicia una nueva solicitud.`,
  perdida: (paciente: string) =>
    `Pharma Express (${paciente}): como ya recibiste parte de una fórmula, lo que no se recogió de esa fórmula se pierde y el caso se cierra. Consulta el detalle en la web o en Telegram.`,
  revalidacion: (paciente: string) =>
    `Pharma Express (${paciente}): ya pasaron 48 horas. Puedes volver a validar tus fórmulas iniciando una nueva solicitud. Este es el único recordatorio.`,
  proximaEntrega: (paciente: string, fecha: string) =>
    `Pharma Express (${paciente}): el ${fecha} se habilita tu siguiente entrega. Inicia una nueva solicitud para prevalidar y agendar.`,
  entregaCerrada: (paciente: string, hayNoEntregados: boolean) =>
    hayNoEntregados
      ? `Pharma Express (${paciente}): tu entrega quedó registrada. Algún medicamento no se entregó en el punto; esa gestión corresponde a Disfarma.`
      : `Pharma Express (${paciente}): tu entrega quedó registrada.`,
  revocacion: (paciente: string) =>
    `Pharma Express (${paciente}): revocaste tu consentimiento. Cancelamos tus citas activas y eliminamos tus datos de Pharma Express.`,
};

/** Defensa adicional en tiempo de ejecución: bloquea un texto que contenga términos sensibles conocidos. */
export function verificarSinDatosDeSalud(texto: string, terminosSensibles: string[]): void {
  const t = texto.toLowerCase();
  const hallado = terminosSensibles.find((s) => s.length > 3 && t.includes(s.toLowerCase()));
  if (hallado) throw new Error('Notificación bloqueada: contiene datos de salud (RNF-04).');
}

/** Iniciales para que un facilitador sepa de quién es el mensaje sin exponer datos de salud (CL-22). */
export function nombreCorto(nombre: string): string {
  const p = nombre.trim().split(/\s+/);
  return `${p[0]} ${p.length > 1 ? p[p.length - 1][0] + '.' : ''}`.trim();
}
