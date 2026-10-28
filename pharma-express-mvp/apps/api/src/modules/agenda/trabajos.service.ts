import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RelojService } from '../../common/reloj.service';
import { EventosService } from '../../common/eventos.service';
import { fecha, ventana } from '../../common/formato';
import { diaCivil, inicioDelDia, momentoRecordatorioNoche, sumarHoras } from '../../domain/reglas';
import { nombreCorto, plantillas } from '../../domain/plantillas';
import { ColaService } from '../notificaciones/cola.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { AgendaService } from './agenda.service';

/** Trabajos programados de SPEC-05: recordatorios, nueva prevalidación, expiración y avisos. */
@Injectable()
export class TrabajosService implements OnApplicationBootstrap {
  /** Trabajos ya ejecutados (evita duplicados entre la cola y el reloj de pruebas). */
  private hechos = new Set<string>();
  private primeraVez(clave: string) {
    if (this.hechos.has(clave)) return false;
    this.hechos.add(clave);
    return true;
  }

  constructor(
    private prisma: PrismaService,
    private reloj: RelojService,
    private eventos: EventosService,
    private cola: ColaService,
    private notif: NotificacionesService,
    private agenda: AgendaService,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.WORKERS === 'off') return;
    await this.cola.atender<{ citaId: string }>('recordatorio-noche', (d) => (this.primeraVez(`noche:${d.citaId}`) ? this.recordatorio(d.citaId, 'noche') : Promise.resolve()));
    await this.cola.atender<{ citaId: string }>('recordatorio-hora', (d) => this.unaHoraAntes(d.citaId));
    await this.cola.atender<{ citaId: string }>('expirar-cita', (d) => this.agenda.terminarCita(d.citaId, 'EXPIRADA').then(() => undefined));
    await this.cola.atender<{ cedula: string }>('revalidacion-48h', (d) => this.revalidacion(d.cedula));
    await this.cola.atender<{ cedula: string; fecha: string }>('aviso-proxima-entrega', (d) => this.proxima(d.cedula, d.fecha));
  }

  private async cita(citaId: string) {
    return this.prisma.cita.findUnique({ where: { id: citaId }, include: { punto: true, items: { include: { formulaItem: { include: { formula: true } } } } } });
  }

  async recordatorio(citaId: string, cual: 'noche' | 'hora') {
    const c = await this.cita(citaId);
    if (!c || c.estado !== 'RESERVADA') return;
    const p = await this.prisma.simPacienteEps.findUniqueOrThrow({ where: { cedula: c.pacienteCedula } });
    const v = { paciente: nombreCorto(p.nombre), punto: c.punto.nombre, fecha: fecha(c.inicio), ventana: ventana(c.inicio, c.fin) };
    await this.notif.notificar(c.pacienteCedula, cual === 'noche' ? plantillas.recordatorioNoche(v) : plantillas.recordatorioHora(v), `recordatorio_${cual}`);
  }

  /** RF-56, RF-57: vuelve a verificar afiliación, vigencia y autorizaciones antes de enviar el recordatorio. */
  async unaHoraAntes(citaId: string) {
    if (!this.primeraVez(`hora:${citaId}`)) return;
    const c = await this.cita(citaId);
    if (!c || c.estado !== 'RESERVADA') return;
    const p = await this.prisma.simPacienteEps.findUniqueOrThrow({ where: { cedula: c.pacienteCedula } });
    const contenido = await this.prisma.contenidoEps.findUnique({ where: { eps: p.eps } });
    const hoy = inicioDelDia(this.reloj.ahora());
    const formulas = [...new Map(c.items.map((i) => [i.formulaItem.formulaId, i.formulaItem.formula])).values()];
    for (const f of formulas) {
      const eps = await this.prisma.simFormulaEps.findUnique({ where: { numero: f.numero }, include: { items: { include: { medicamento: true } } } });
      let cambio: { dato: string; motivo: 'afiliación inactiva' | 'fórmula no vigente' | 'autorización no vigente'; siguiente: string } | null = null;
      if (!p.afiliacionActiva) cambio = { dato: 'afiliacion', motivo: 'afiliación inactiva', siguiente: 'Comunícate con tu EPS para revisar tu afiliación.' };
      else if (!eps || diaCivil(eps.vigencia) < hoy) cambio = { dato: 'vigencia', motivo: 'fórmula no vigente', siguiente: 'Requiere una nueva valoración médica.' };
      else if (eps.items.some((i) => !i.medicamento.pbs && !i.autorizado)) cambio = { dato: 'autorizacion', motivo: 'autorización no vigente', siguiente: contenido?.autorizaciones ?? '' };
      if (cambio) {
        await this.agenda.cancelarFormulaPorCambio(f.id, cambio.motivo, cambio.siguiente);
        await this.eventos.registrar('cambio_estado', { formula: f.id, dato: cambio.dato, detectadoEn: this.reloj.ahora().toISOString() });
        await this.notif.notificar(c.pacienteCedula, plantillas.cambioEstado(nombreCorto(p.nombre), cambio.motivo), 'cambio_estado');
      }
    }
    await this.recordatorio(citaId, 'hora');
  }

  /**
   * Solo para pruebas: al mover el reloj del sistema ejecuta lo que ya debió ocurrir
   * (recordatorio nocturno, recordatorio y nueva prevalidación de una hora antes, expiración).
   */
  async procesarVencidos() {
    const ahora = this.reloj.ahora();
    const citas = await this.prisma.cita.findMany({ where: { estado: 'RESERVADA' }, orderBy: { inicio: 'asc' } });
    const hechos: string[] = [];
    for (const c of citas) {
      const noche = momentoRecordatorioNoche(c.inicio, c.creadaEn);
      if (noche && noche <= ahora && ahora < sumarHoras(c.inicio, -1) && this.primeraVez(`noche:${c.id}`)) {
        await this.recordatorio(c.id, 'noche');
        hechos.push('Recordatorio de la noche anterior');
      }
      if (sumarHoras(c.inicio, -1) <= ahora && !this.hechos.has(`hora:${c.id}`)) {
        await this.unaHoraAntes(c.id);
        hechos.push('Recordatorio de una hora antes con nueva prevalidación');
      }
      if (c.fin <= ahora && (await this.agenda.terminarCita(c.id, 'EXPIRADA'))) hechos.push('Cita expirada y liberada');
    }
    return hechos;
  }

  async revalidacion(cedula: string) {
    const p = await this.prisma.simPacienteEps.findUnique({ where: { cedula } });
    if (p) await this.notif.notificar(cedula, plantillas.revalidacion(nombreCorto(p.nombre)), 'revalidacion');
  }

  async proxima(cedula: string, fechaIso: string) {
    const p = await this.prisma.simPacienteEps.findUnique({ where: { cedula } });
    if (p) await this.notif.notificar(cedula, plantillas.proximaEntrega(nombreCorto(p.nombre), fecha(new Date(fechaIso))), 'proxima_entrega');
  }
}
