/**
 * Reglas de negocio puras del módulo `pre-dispensacion` (SPEC-003 v1.14).
 *
 * Sin I/O, sin NestJS, sin Prisma, sin HTTP. (skill: `nestjs-modulo-estandar`)
 * BR-014: tabla única de motivo/siguiente paso por escenario.
 */

export const BR014 = {
  AFILIACION_INACTIVA: {
    motivo: 'Afiliación inactiva en la EPS simulada.',
    siguientePaso: 'Comunicarse o acudir a su EPS para actualizar o reactivar su afiliación.',
  },
  FORMULA_VENCIDA: {
    motivo: 'La fórmula médica se encuentra vencida o fuera de fecha.',
    siguientePaso: 'Solicitar una nueva valoración médica en su EPS.',
  },
  NO_PBS_SIN_AUTORIZACION: {
    motivo: 'Medicamento no cubierto por el PBS y sin autorización registrada en la EPS.',
    siguientePaso: 'Consultar los puntos de atención, enlaces o trámites de autorización de su EPS.',
  },
  DOCUMENTO_ILEGIBLE: {
    motivo: 'No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial.',
    siguientePaso: 'Acudir a la atención presencial en el punto de dispensación con sus documentos físicos.',
  },
  DOCUMENTO_NO_COINCIDENTE: {
    motivo: 'No fue posible validar los datos del documento con la EPS simulada.',
    siguientePaso: 'Acudir a la atención presencial en el punto de dispensación con sus documentos físicos.',
  },
  FECHA_HABILITADA_POSTERIOR: {
    motivo: 'La fecha habilitada de entrega por la EPS es posterior a la cita más próxima disponible.',
    siguientePaso: 'Indicar que lo gestione directamente con su EPS.',
  },
  CRONICA_SIN_FECHA_HABILITADA: {
    motivo: 'Fórmula crónica sin fecha habilitada de entrega registrada en la EPS simulada.',
    siguientePaso: 'Acudir a la atención presencial en el punto de dispensación.',
  },
  APTA: {
    motivo: 'Todos los medicamentos cumplen las validaciones preliminares.',
    siguientePaso: 'Muestra el resultado preliminar de la fórmula como apta.',
  },
} as const;

export const MAXIMO_INTENTOS_DOCUMENTO = 2; // RF-029 / BR-009

export const FORMATOS_ARCHIVO_PERMITIDOS = new Set(['image/jpeg', 'image/png', 'application/pdf']); // BR-009 / AC-056 / DEC-P74

/** BR-009 / DEC-P42 / AC-050 — un número de prescripción válido tiene exactamente 20 dígitos numéricos. */
export function esNumeroPrescripcionValido(numeroPrescripcion: string): boolean {
  return /^\d{20}$/.test(numeroPrescripcion);
}

/** BR-009 / DEC-P54 — una fórmula es ilegible si falta el número o los medicamentos. */
export function formulaIlegible(dto: { numeroPrescripcion?: string; medicamentos?: string[] }): boolean {
  if (!dto.numeroPrescripcion || !esNumeroPrescripcionValido(dto.numeroPrescripcion)) {
    return true;
  }
  return !dto.medicamentos || dto.medicamentos.length === 0;
}

/** BR-009 / AC-056 / DEC-P74 — formato de archivo fuera de JPG/PNG/PDF se rechaza sin leerlo ni gastar intento. */
export function formatoArchivoValido(mimetype: string): boolean {
  return FORMATOS_ARCHIVO_PERMITIDOS.has(mimetype);
}
