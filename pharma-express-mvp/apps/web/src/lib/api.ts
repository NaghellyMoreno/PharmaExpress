let pacienteActual: string | null = null;
export const fijarPaciente = (c: string | null) => (pacienteActual = c);

export class ApiError extends Error {
  constructor(public status: number, public body: any) {
    super(typeof body?.message === 'string' ? body.message : body?.mensaje ?? `Error ${status}`);
  }
}

export async function api<T = any>(ruta: string, opts: { method?: string; body?: unknown; form?: FormData; token?: string } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (pacienteActual) headers['x-paciente'] = pacienteActual;
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  const r = await fetch(`/api${ruta}`, {
    method: opts.method ?? (opts.body !== undefined || opts.form ? 'POST' : 'GET'),
    credentials: 'include',
    headers,
    body: opts.form ?? (opts.body !== undefined ? JSON.stringify(opts.body) : undefined),
  });
  if (r.status === 204) return undefined as T;
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(r.status, data?.message && typeof data.message === 'object' ? data.message : data);
  return data as T;
}

const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const fecha = (s: string | Date) => { const d = new Date(s); return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`; };
export const hora = (s: string | Date) => { const d = new Date(s); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
export const estadoTexto = (e: string) => e.replace(/_/g, ' ').toLowerCase().replace(/^./, (c) => c.toUpperCase()).replace('No entregados', 'medicamentos no entregados');
