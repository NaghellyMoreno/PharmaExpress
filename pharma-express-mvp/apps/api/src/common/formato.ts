const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const p2 = (n: number) => String(n).padStart(2, '0');
export const fecha = (d: Date) => `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`;
export const hora = (d: Date) => `${p2(d.getHours())}:${p2(d.getMinutes())}`;
export const ventana = (ini: Date, fin: Date) => `${hora(ini)} a ${hora(fin)}`;
export const isoDia = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
