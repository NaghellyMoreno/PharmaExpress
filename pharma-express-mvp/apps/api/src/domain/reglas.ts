/**
 * Reglas de negocio puras de Pharma Express (sin base de datos ni red).
 * Cada función cita las decisiones (DEC) y reglas (BR) del SPEC que implementa.
 * Las fechas se interpretan en la zona horaria del proceso (TZ=America/Bogota).
 */

export const VIGENCIA_CODIGO_MIN = 10; // DEC-07
export const MAX_INTENTOS_CODIGO = 3; // DEC-07
export const DIAS_VINCULACION = 90; // DEC-10 (3 meses)
export const HORAS_REVALIDACION = 48; // DEC-25
export const DIAS_AVISO_PROXIMA = 2; // DEC-17

export const inicioDelDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const sumarDias = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const sumarHoras = (d: Date, h: number) => new Date(d.getTime() + h * 3_600_000);
/** Las columnas DATE llegan como medianoche UTC; esto las convierte al mismo día civil en hora local. */
export const diaCivil = (d: Date) => new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
export const mismoDia = (a: Date, b: Date) => inicioDelDia(a).getTime() === inicioDelDia(b).getTime();

// ---------------- Prevalidación (SPEC-03) ----------------

export type Chequeo = { regla: string; ok: boolean | null; detalle: string };

export interface EntradaFormula {
  numero: string;
  vigencia: Date;
  diagnostico: string;
  habilitada?: Date | null;
  items: { codigo: string; nombre: string; pbs: boolean; autorizado: boolean }[];
}

export interface ResultadoFormula {
  numero: string;
  apta: boolean;
  tipo: 'AGUDO' | 'CRONICO' | null;
  motivo?: string;
  siguiente?: string;
  chequeos: Chequeo[];
}

/**
 * BR-10: vigencia (por fórmula) → PBS (por medicamento) → autorización (por medicamento)
 * → habilitación de entrega (solo crónicas). BR-11: la fórmula es todo o nada.
 * La afiliación se verifica antes, una vez por solicitud (RF-26), con `prevalidarSolicitud`.
 */
export function prevalidarFormula(
  f: EntradaFormula,
  ahora: Date,
  cronicos: Set<string>,
  textoAutorizacionEps: string,
): ResultadoFormula {
  const chequeos: Chequeo[] = [];
  const hoy = inicioDelDia(ahora);

  const vigente = inicioDelDia(f.vigencia) >= hoy;
  chequeos.push({ regla: 'Vigencia', ok: vigente, detalle: vigente ? 'Fórmula vigente' : 'Fórmula vencida' });
  if (!vigente) {
    return { numero: f.numero, apta: false, tipo: null, motivo: 'Fórmula no vigente', siguiente: 'Requiere una nueva valoración médica.', chequeos };
  }

  const noPbs = f.items.filter((i) => !i.pbs);
  chequeos.push({
    regla: 'Cobertura PBS',
    ok: true,
    detalle: noPbs.length ? `Fuera del PBS (requiere autorización): ${noPbs.map((i) => i.nombre).join(', ')}` : 'Todos en el PBS',
  });

  // BR-12 / DEC-40: un medicamento no PBS continúa solo si está autorizado.
  const sinAutorizacion = noPbs.filter((i) => !i.autorizado);
  chequeos.push({
    regla: 'Autorización',
    ok: sinAutorizacion.length === 0,
    detalle: sinAutorizacion.length ? `Sin autorización: ${sinAutorizacion.map((i) => i.nombre).join(', ')}` : 'Cumple',
  });
  if (sinAutorizacion.length) {
    return { numero: f.numero, apta: false, tipo: null, motivo: 'Falta autorización de la EPS', siguiente: textoAutorizacionEps, chequeos };
  }

  // BR-15 / DEC-41: catálogo de crónicos; lo que no está en el catálogo es agudo.
  const tipo = cronicos.has(f.diagnostico) ? 'CRONICO' : 'AGUDO';
  chequeos.push({ regla: 'Tipo de tratamiento', ok: null, detalle: tipo === 'CRONICO' ? 'Crónico' : 'Agudo' });

  if (tipo === 'CRONICO') {
    // RF-31: la cita crónica solo puede ser al día siguiente; la fecha habilitada debe ser ≤ mañana (CL-12).
    const manana = sumarDias(hoy, 1);
    const habilitada = f.habilitada ? inicioDelDia(f.habilitada) : null;
    const ok = !!habilitada && habilitada <= manana;
    chequeos.push({ regla: 'Entrega habilitada', ok, detalle: habilitada ? `Habilitada desde ${habilitada.toISOString().slice(0, 10)}` : 'Sin fecha habilitada' });
    if (!ok) {
      return {
        numero: f.numero,
        apta: false,
        tipo,
        motivo: 'Entrega aún no habilitada',
        siguiente: habilitada ? `Podrás recogerla a partir del ${habilitada.toISOString().slice(0, 10)}.` : 'Consulta con tu EPS la fecha de tu próxima entrega.',
        chequeos,
      };
    }
  }
  return { numero: f.numero, apta: true, tipo, chequeos };
}

// ---------------- Agenda (SPEC-04) ----------------

export interface PuntoAgenda {
  id: string;
  dias: number[];
  abre: number;
  cierra: number;
  capacidad: number;
}

/**
 * Ventanas de 1 hora con cupo (RF-37, RF-38, BR-17, BR-18, DEC-37):
 * - Si la cita incluye un crónico: solo el día calendario siguiente.
 * - Si solo hay agudos: hoy (desde una hora después de agendar) o mañana.
 */
export function ventanasPermitidas(
  punto: PuntoAgenda,
  ahora: Date,
  incluyeCronico: boolean,
  usados: (inicio: Date) => number,
): { inicio: Date; cuposLibres: number }[] {
  const hoy = inicioDelDia(ahora);
  const dias = incluyeCronico ? [sumarDias(hoy, 1)] : [hoy, sumarDias(hoy, 1)];
  const minimoHoy = sumarHoras(ahora, 1);
  const out: { inicio: Date; cuposLibres: number }[] = [];
  for (const dia of dias) {
    if (!punto.dias.includes(dia.getDay())) continue;
    for (let h = punto.abre; h < punto.cierra; h++) {
      const inicio = new Date(dia);
      inicio.setHours(h, 0, 0, 0);
      if (mismoDia(dia, hoy) && inicio < minimoHoy) continue;
      const libres = punto.capacidad - usados(inicio);
      if (libres > 0) out.push({ inicio, cuposLibres: libres });
    }
  }
  return out;
}

/** RF-55 / DEC-38: recordatorio nocturno solo para citas del día siguiente agendadas antes de las 21:00. */
export function momentoRecordatorioNoche(inicioCita: Date, agendadaEn: Date): Date | null {
  const manana = sumarDias(inicioDelDia(agendadaEn), 1);
  if (!mismoDia(inicioCita, manana)) return null;
  if (agendadaEn.getHours() >= 21) return null;
  const objetivo = new Date(inicioDelDia(agendadaEn));
  objetivo.setHours(19, 30, 0, 0);
  return agendadaEn > objetivo ? agendadaEn : objetivo;
}

// ---------------- Estados (A10) ----------------

export type EstadoItem = 'PENDIENTE' | 'RESERVADO' | 'ENTREGADO' | 'NO_ENTREGADO' | 'PERDIDO' | 'LIBERADO';
export type EstadoFormulaCalculado = 'APTA' | 'AGENDADA' | 'ENTREGADA' | 'CERRADA_NO_ENTREGADOS' | 'LIBERADA';

export function estadoFormulaPorItems(items: EstadoItem[]): EstadoFormulaCalculado {
  if (!items.length || items.every((s) => s === 'PENDIENTE')) return 'APTA';
  if (items.every((s) => s === 'ENTREGADO')) return 'ENTREGADA';
  if (items.some((s) => s === 'RESERVADO')) return 'AGENDADA';
  if (items.some((s) => s === 'ENTREGADO' || s === 'NO_ENTREGADO')) return 'CERRADA_NO_ENTREGADOS';
  return 'LIBERADA';
}

/** BR-22 / DEC-44: al cancelar o expirar, se pierde lo no recogido solo si ya se entregó parte de la fórmula. */
export function destinoItemAlLiberar(itemsDeLaFormula: EstadoItem[]): 'PERDIDO' | 'LIBERADO' {
  return itemsDeLaFormula.includes('ENTREGADO') ? 'PERDIDO' : 'LIBERADO';
}

/** RF-60/61/62, BR-29: validación del código en el punto. */
export type ResultadoCodigo =
  | { ok: true }
  | { ok: false; razon: 'NO_EXISTE' | 'OTRO_PUNTO' | 'USADO' | 'ANULADO' | 'ANTES_DE_VENTANA' | 'EXPIRADA' };

export function validarCodigoEnPunto(
  cita: { puntoId: string; inicio: Date; fin: Date; estadoCodigo: 'EMITIDO' | 'USADO' | 'ANULADO' } | null,
  puntoDispensador: string,
  ahora: Date,
): ResultadoCodigo {
  if (!cita) return { ok: false, razon: 'NO_EXISTE' };
  if (cita.puntoId !== puntoDispensador) return { ok: false, razon: 'OTRO_PUNTO' };
  if (cita.estadoCodigo === 'USADO') return { ok: false, razon: 'USADO' };
  if (ahora >= cita.fin) return { ok: false, razon: 'EXPIRADA' };
  if (cita.estadoCodigo === 'ANULADO') return { ok: false, razon: 'ANULADO' };
  if (ahora < cita.inicio) return { ok: false, razon: 'ANTES_DE_VENTANA' };
  return { ok: true };
}
