/**
 * Plantillas fijas del bot de Telegram (BR-008/DEC-P10). Ningún texto nombra medicamentos,
 * diagnósticos, cédulas ni otros datos de identificación (skill `plantillas-sin-datos-de-salud`).
 */

export const PLANTILLAS = {
  inicio: 'Bienvenido a Pharma Express. Usa el botón para continuar en la Mini App.',
  archivoNoProcesado: 'Para cargar tus documentos, ábrelos en la Mini App de Pharma Express.',
  noReconocido: 'No reconozco ese comando. Usa el menú o consulta la web.',
  soloChatsPrivados: 'Pharma Express solo se usa en una conversación privada con el bot.',
} as const;

export const TEXTO_BOTON_MINI_APP = 'Abrir Mini App';
