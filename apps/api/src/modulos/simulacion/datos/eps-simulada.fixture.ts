/**
 * Datos simulados de la EPS — módulo `simulacion` (SPEC-008).
 *
 * Almacén en memoria para el MVP (DEC-010/DEC-P36: el mecanismo de persistencia real
 * en el esquema `eps_simulada` de PostgreSQL queda para la integración de ARQ-005/COMP-004;
 * aquí se cubre la parte que usa la prevalidación en pruebas de unidad, sin Docker).
 * El equipo provoca cambios de prueba llamando los métodos de mutación de
 * `SimulacionService`, sin interfaz de producto ni rol nuevo (DEC-P36).
 *
 * Datos sintéticos únicamente: ninguna cédula, medicamento ni diagnóstico es real.
 */

export interface MedicamentoFormula {
  codigo: string;
  autorizado: boolean;
  /** Indicador PBS que trae la EPS simulada para la fórmula (DEC-P34); el catálogo prevalece (DEC-P17). */
  pbsIndicadoFormula: boolean;
}

export interface PacienteSimulado {
  cedula: string;
  eps: string;
  afiliacionActiva: boolean;
  celular: string;
  correo?: string;
}

export interface FormulaSimulada {
  numero: string; // 20 dígitos, tipo MIPRES (DEC-P12)
  cedulaPaciente: string;
  fechaPrescripcion: string; // ISO yyyy-mm-dd
  diagnosticoCie10: string;
  medicamentos: MedicamentoFormula[];
  vigenciaHasta: string; // ISO yyyy-mm-dd
  fechaHabilitada?: string; // ISO yyyy-mm-dd — solo si la EPS simulada la registra (crónicas)
}

export interface EventoPrevalidacion {
  id: string;
  tipo: string;
  fecha: string; // ISO
  pacienteCedula?: string;
  resultado?: unknown;
  novedades?: unknown;
}

export const CATALOGO_COBERTURA_PBS: Record<string, boolean> = {
  'MED-001': true, // cubierto por el PBS
  'MED-002': false, // no cubierto; requiere autorización
  'MED-PBS-01': true,
  'MED-CRON-01': true,
  'MED-NOPBS-01': false,
  // MED-099 deliberadamente ausente: DEC-P32 lo trata como no PBS.
};

export const CATALOGO_DIAGNOSTICOS_CRONICOS = new Set<string>(['I10', 'E11']); // sintéticos: hipertensión, diabetes tipo 2

/** Festivos de Colombia (Ley Emiliani) — catálogo configurable; incluye año en curso y siguiente (RF-084). */
export const CATALOGO_FESTIVOS_COLOMBIA: Record<number, string[]> = {
  2026: [
    '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03',
    '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-16', '2026-06-29',
    '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
    '2026-11-16', '2026-12-08', '2026-12-25',
  ],
  2027: [
    '2027-01-01', '2027-01-11', '2027-03-22', '2027-03-25', '2027-03-26',
    '2027-05-01', '2027-05-10', '2027-05-31', '2027-06-08', '2027-07-05',
    '2027-07-20', '2027-08-07', '2027-08-16', '2027-10-18', '2027-11-01',
    '2027-11-15', '2027-12-08', '2027-12-25',
  ],
};

export const CONTENIDO_EPS: Record<string, { puntos: string[]; enlaces: string[]; orientacionActualizarDatos: string }> = {
  'EPS-SINTETICA-1': {
    puntos: ['Punto sintético Centro', 'Punto sintético Norte'],
    enlaces: ['https://eps-sintetica-1.ejemplo/autorizaciones'],
    orientacionActualizarDatos: 'Actualiza tus datos de contacto en el punto de atención de tu EPS o en su línea de atención.',
  },
};

/** RNF-017/DEC-P18: en pruebas, solo se aceptan contactos del equipo (sintéticos aquí; el equipo real los configura). */
export const CONTACTOS_AUTORIZADOS_PRUEBA = {
  celulares: new Set<string>(['3000000001', '3000000002']),
  correos: new Set<string>(['equipo1@pharmaexpress.test', 'equipo2@pharmaexpress.test']),
};

export function pacientesSemilla(): PacienteSimulado[] {
  return [
    { cedula: '8.765.432-1', eps: 'EPS-SINTETICA-1', afiliacionActiva: true, celular: '3000000001', correo: 'equipo1@pharmaexpress.test' },
    { cedula: '7.654.321-0', eps: 'EPS-SINTETICA-1', afiliacionActiva: false, celular: '3000000002' },
    { cedula: '123456789', eps: 'EPS-SINTETICA-1', afiliacionActiva: true, celular: '3000000001' }, // paciente sintético de pruebas de pre-dispensación (SPEC-003)
    { cedula: '000000000', eps: 'EPS-SINTETICA-1', afiliacionActiva: false, celular: '3000000002' }, // afiliación inactiva sintética (SPEC-003/AC-014)
  ];
}

export function formulasSemilla(): FormulaSimulada[] {
  return [
    {
      numero: '12345678901234567890',
      cedulaPaciente: '8.765.432-1',
      fechaPrescripcion: '2026-02-01',
      diagnosticoCie10: 'I10', // crónico (catálogo sintético)
      medicamentos: [{ codigo: 'MED-001', autorizado: true, pbsIndicadoFormula: true }],
      vigenciaHasta: '2026-10-15', // 8 meses y 14 días tras la prescripción (dentro de 8-9 meses, AC-056)
      fechaHabilitada: '2026-11-03',
    },
    {
      numero: '98765432109876543210',
      cedulaPaciente: '8.765.432-1',
      fechaPrescripcion: '2026-02-01',
      diagnosticoCie10: 'J00', // agudo (no está en el catálogo de crónicos)
      medicamentos: [{ codigo: 'MED-002', autorizado: false, pbsIndicadoFormula: false }],
      vigenciaHasta: '2026-11-01',
    },
    {
      // SPEC-003/AC-001: fórmula vigente con medicamento PBS, diagnóstico agudo (sin fecha habilitada: no la necesita).
      // Vigencia dentro del rango de prueba de 8-9 meses tras la prescripción (AC-056/BR-025).
      numero: '11111111111111111111',
      cedulaPaciente: '123456789',
      fechaPrescripcion: '2026-03-01',
      diagnosticoCie10: 'J00',
      medicamentos: [{ codigo: 'MED-PBS-01', autorizado: false, pbsIndicadoFormula: true }],
      vigenciaHasta: '2026-11-20',
    },
    {
      // SPEC-003/AC-002: fórmula crónica con fecha habilitada posterior a la cita posible (viernes → sábado).
      // Vigencia dentro del rango de prueba de 8-9 meses tras la prescripción (AC-056/BR-025).
      numero: '22222222222222222222',
      cedulaPaciente: '123456789',
      fechaPrescripcion: '2026-01-01',
      diagnosticoCie10: 'I10',
      medicamentos: [{ codigo: 'MED-CRON-01', autorizado: true, pbsIndicadoFormula: true }],
      vigenciaHasta: '2026-09-15',
      fechaHabilitada: '2026-06-07',
    },
  ];
}

export function eventosSemilla(): EventoPrevalidacion[] {
  return [
    {
      id: 'EV-001',
      tipo: 'prevalidacion_completada',
      fecha: '2026-10-31T10:00:00-05:00',
      pacienteCedula: '8.765.432-1',
      resultado: { apta: true },
      novedades: [],
    },
  ];
}
