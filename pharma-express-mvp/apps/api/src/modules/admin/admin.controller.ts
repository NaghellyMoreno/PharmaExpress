import { Body, CanActivate, Controller, ForbiddenException, Get, Injectable, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RelojService } from '../../common/reloj.service';
import { EventosService } from '../../common/eventos.service';
import { TrabajosService } from '../agenda/trabajos.service';
import { sumarHoras } from '../../domain/reglas';

/** Herramientas del equipo para pruebas (SPEC-08, RF-83, RF-84). Deshabilitadas en producción. */
@Injectable()
class SoloDesarrollo implements CanActivate {
  canActivate() {
    if (process.env.NODE_ENV === 'production') throw new ForbiddenException();
    return true;
  }
}

@UseGuards(SoloDesarrollo)
@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService, private reloj: RelojService, private eventos: EventosService, private trabajos: TrabajosService) {}

  @Get('reloj')
  reloj_() {
    return { ahora: this.reloj.ahora() };
  }

  /** Desplaza el reloj del sistema para demostrar recordatorios y expiraciones. */
  @Post('reloj')
  async fijar(@Body() b: { fecha?: string; reiniciar?: boolean; sumarMinutos?: number; ir?: 'antes' | 'inicio' }) {
    if (b.reiniciar) this.reloj.reiniciar();
    else if (b.fecha) this.reloj.fijar(new Date(b.fecha));
    else if (b.sumarMinutos) this.reloj.fijar(new Date(this.reloj.ahora().getTime() + b.sumarMinutos * 60_000));
    else if (b.ir) {
      // Atajo para la demostración: lleva el reloj a la próxima cita reservada.
      const ahora = this.reloj.ahora();
      const desde = b.ir === 'antes' ? sumarHoras(ahora, 1) : ahora; // la siguiente que aún no llegó a ese momento
      const c = await this.prisma.cita.findFirst({ where: { estado: 'RESERVADA', inicio: { gt: desde } }, orderBy: { inicio: 'asc' } });
      if (c) this.reloj.fijar(b.ir === 'antes' ? sumarHoras(c.inicio, -1) : new Date(c.inicio.getTime() + 5 * 60_000));
    }
    const eventos = await this.trabajos.procesarVencidos();
    return { ahora: this.reloj.ahora(), eventos };
  }

  @Get('pacientes')
  pacientes() {
    return this.prisma.simPacienteEps.findMany({ select: { cedula: true, nombre: true, eps: true, afiliacionActiva: true }, orderBy: { cedula: 'asc' } });
  }

  @Get('citas')
  async citas() {
    const cs = await this.prisma.cita.findMany({ include: { punto: true }, orderBy: { inicio: 'asc' } });
    return cs.map((c) => ({ id: c.id, punto: c.punto.nombre, inicio: c.inicio, fin: c.fin, estado: c.estado, codigo: c.estado === 'RESERVADA' || c.estado === 'CUMPLIDA' ? c.codigo : null }));
  }

  @Get('eventos')
  eventosRecientes() {
    return this.prisma.evento.findMany({ orderBy: { creadoEn: 'desc' }, take: 40 });
  }

  /** RF-83: provocar cambios de estado en la EPS simulada. */
  @Patch('eps/:cedula')
  async eps(@Param('cedula') cedula: string, @Body() b: { afiliacionActiva: boolean }) {
    await this.prisma.simPacienteEps.update({ where: { cedula }, data: { afiliacionActiva: b.afiliacionActiva } });
    await this.eventos.registrar('eps_simulada_cambio', { dato: 'afiliacion', valor: b.afiliacionActiva });
    return { ok: true };
  }

  @Patch('inventario/:puntoId/:medicamento')
  async inventario(@Param('puntoId') puntoId: string, @Param('medicamento') medicamentoCodigo: string, @Body() b: { existencias: number }) {
    await this.prisma.inventario.update({ where: { puntoId_medicamentoCodigo: { puntoId, medicamentoCodigo } }, data: { existencias: Math.max(0, b.existencias) } });
    return { ok: true };
  }

  /** Métricas de A14 calculadas a partir de la bitácora de eventos. */
  @Get('metricas')
  async metricas() {
    const ev = await this.prisma.evento.findMany({ select: { tipo: true, detalle: true } });
    const contar = (t: string) => ev.filter((e) => e.tipo === t).length;
    const prev = ev.filter((e) => e.tipo === 'prevalidacion').map((e) => e.detalle as { formulas: number; noAptas: number });
    const total = prev.reduce((a, b) => a + b.formulas, 0);
    const noAptas = prev.reduce((a, b) => a + b.noAptas, 0);
    const reservas = await this.prisma.inventario.findMany({ where: { existencias: { lt: 0 } } });
    const sobreCupo = await this.prisma.$queryRaw<{ n: bigint }[]>`SELECT COUNT(*)::bigint AS n FROM "CupoVentana" c JOIN "Punto" p ON p.id = c."puntoId" WHERE c.usados > p.capacidad`;
    return {
      formulasPrevalidadas: total,
      novedadesAntesDeDesplazarse: total ? noAptas / total : 0,
      citasConfirmadas: contar('cita_confirmada'),
      citasCanceladas: contar('cita_cancelada'),
      citasExpiradas: contar('cita_expirada'),
      confirmacionesRechazadas: contar('confirmacion_rechazada'),
      llegadas: contar('llegada'),
      sinDisponibilidad: contar('sin_disponibilidad'),
      sobreReservas: reservas.length + Number(sobreCupo[0]?.n ?? 0),
    };
  }
}
