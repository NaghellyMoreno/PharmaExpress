import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { RelojService } from '../../common/reloj.service';
import { EventosService } from '../../common/eventos.service';
import { digitos } from '../../common/cripto';
import { fecha, ventana } from '../../common/formato';
import {
  destinoItemAlLiberar, EstadoItem, estadoFormulaPorItems, HORAS_REVALIDACION, momentoRecordatorioNoche, sumarHoras, ventanasPermitidas, inicioDelDia, sumarDias,
} from '../../domain/reglas';
import { nombreCorto, plantillas } from '../../domain/plantillas';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { ColaService } from '../notificaciones/cola.service';

type Asignacion = { formulaItemId: string; puntoId: string };
type Tx = Prisma.TransactionClient;

/** SPEC-04: disponibilidad, ventanas, confirmación atómica, cancelación, expiración y liberación. */
@Injectable()
export class AgendaService {
  constructor(
    private prisma: PrismaService,
    private reloj: RelojService,
    private eventos: EventosService,
    private notif: NotificacionesService,
    private cola: ColaService,
  ) {}

  private async nombre(cedula: string) {
    const p = await this.prisma.simPacienteEps.findUniqueOrThrow({ where: { cedula } });
    return nombreCorto(p.nombre);
  }

  /** RF-44, DEC-25, DEC-47: sin disponibilidad no hay pendiente; se programa un único recordatorio a las 48 h. */
  private async marcarSinDisponibilidad(formulaIds: string[], cedula: string, motivo: string) {
    if (!formulaIds.length) return;
    await this.prisma.formula.updateMany({ where: { id: { in: formulaIds } }, data: { estado: 'SIN_DISPONIBILIDAD', motivo } });
    await this.cola.programar('revalidacion-48h', { cedula }, sumarHoras(this.reloj.ahora(), HORAS_REVALIDACION));
    await this.eventos.registrar('sin_disponibilidad', { formulas: formulaIds.length, motivo });
  }

  private async itemsAptos(cedula: string, filtro: Prisma.FormulaItemWhereInput) {
    return this.prisma.formulaItem.findMany({
      where: { ...filtro, estado: 'PENDIENTE', formula: { estado: 'APTA', solicitud: { pacienteCedula: cedula } } },
      include: { formula: true },
    });
  }

  async disponibilidad(cedula: string, solicitudId: string) {
    const items = await this.itemsAptos(cedula, { formula: { solicitudId } });
    const inv = await this.prisma.inventario.findMany({ include: { punto: true } });
    const meds = Object.fromEntries((await this.prisma.medicamento.findMany()).map((m) => [m.codigo, m.nombre]));
    const puntosDe = (codigo: string, q: number) => inv.filter((i) => i.medicamentoCodigo === codigo && i.existencias >= q);

    const sinDisp = [...new Set(items.filter((i) => !puntosDe(i.medicamentoCodigo, i.cantidad).length).map((i) => i.formulaId))];
    await this.marcarSinDisponibilidad(sinDisp, cedula, 'Algún medicamento no tiene existencias en ningún punto');
    const restantes = items.filter((i) => !sinDisp.includes(i.formulaId));

    // Sugerencia: el punto que tenga toda la fórmula y, luego, la mayor parte de la solicitud.
    const cubre = (puntoId: string, formulaId?: string) =>
      restantes.filter((i) => (!formulaId || i.formulaId === formulaId) && inv.some((x) => x.puntoId === puntoId && x.medicamentoCodigo === i.medicamentoCodigo && x.existencias >= i.cantidad)).length;
    return {
      sinDisponibilidad: items.filter((i) => sinDisp.includes(i.formulaId)).map((i) => ({ formulaId: i.formulaId, numero: i.formula.numero })).filter((v, k, a) => a.findIndex((x) => x.formulaId === v.formulaId) === k),
      items: restantes.map((i) => {
        const puntos = puntosDe(i.medicamentoCodigo, i.cantidad)
          .map((x) => ({ id: x.puntoId, nombre: x.punto.nombre, existencias: x.existencias }))
          .sort((a, b) => 10 * cubre(b.id, i.formulaId) + cubre(b.id) - (10 * cubre(a.id, i.formulaId) + cubre(a.id)));
        return { formulaItemId: i.id, formulaId: i.formulaId, numero: i.formula.numero, tipo: i.formula.tipo, nombre: meds[i.medicamentoCodigo], cantidad: i.cantidad, puntos, sugerido: puntos[0]?.id };
      }),
    };
  }

  private async agrupar(cedula: string, asignacion: Asignacion[]) {
    const items = await this.itemsAptos(cedula, { id: { in: asignacion.map((a) => a.formulaItemId) } });
    if (items.length !== asignacion.length) throw new BadRequestException('Hay medicamentos que no se pueden agendar.');
    const grupos = new Map<string, { puntoId: string; incluyeCronico: boolean; items: typeof items }>();
    for (const a of asignacion) {
      const it = items.find((i) => i.id === a.formulaItemId)!;
      const g = grupos.get(a.puntoId) ?? { puntoId: a.puntoId, incluyeCronico: false, items: [] as typeof items };
      g.items.push(it);
      if (it.formula.tipo === 'CRONICO') g.incluyeCronico = true; // BR-18
      grupos.set(a.puntoId, g);
    }
    return [...grupos.values()];
  }

  private async ventanasDe(puntoId: string, incluyeCronico: boolean) {
    const punto = await this.prisma.punto.findUniqueOrThrow({ where: { id: puntoId } });
    const ahora = this.reloj.ahora();
    const cupos = await this.prisma.cupoVentana.findMany({ where: { puntoId, inicio: { gte: inicioDelDia(ahora), lt: sumarDias(inicioDelDia(ahora), 2) } } });
    const usados = (d: Date) => cupos.find((c) => c.inicio.getTime() === d.getTime())?.usados ?? 0;
    return { punto, ventanas: ventanasPermitidas(punto, ahora, incluyeCronico, usados) };
  }

  async ventanas(cedula: string, asignacion: Asignacion[]) {
    const grupos = await this.agrupar(cedula, asignacion);
    const out = [];
    for (const g of grupos) {
      const { punto, ventanas } = await this.ventanasDe(g.puntoId, g.incluyeCronico);
      out.push({ puntoId: g.puntoId, punto: punto.nombre, incluyeCronico: g.incluyeCronico, ventanas });
    }
    return out;
  }

  /** RF-41, BR-19, BR-20, DEC-21, DEC-43: reserva de existencias y cupo todo o nada. */
  async confirmar(cedula: string, asignacion: Asignacion[], elegidas: Record<string, string>) {
    let grupos = await this.agrupar(cedula, asignacion);
    // DEC-47: grupos sin ventanas con cupo → sus fórmulas quedan sin disponibilidad.
    const sinVentanas: string[] = [];
    for (const g of grupos) if (!(await this.ventanasDe(g.puntoId, g.incluyeCronico)).ventanas.length) g.items.forEach((i) => sinVentanas.push(i.formulaId));
    const excluidas = [...new Set(sinVentanas)];
    await this.marcarSinDisponibilidad(excluidas, cedula, 'No hay ventanas con cupo en los días permitidos');
    grupos = grupos.map((g) => ({ ...g, items: g.items.filter((i) => !excluidas.includes(i.formulaId)) })).filter((g) => g.items.length);
    if (!grupos.length) return { citas: [], sinDisponibilidad: excluidas };

    for (const g of grupos) {
      const elegida = elegidas[g.puntoId];
      if (!elegida) throw new BadRequestException('Escoge una ventana en cada punto.');
      const { ventanas } = await this.ventanasDe(g.puntoId, g.incluyeCronico);
      if (!ventanas.some((v) => v.inicio.getTime() === new Date(elegida).getTime())) {
        await this.eventos.registrar('confirmacion_rechazada', { razon: 'ventana' });
        throw new ConflictException({ codigo: 'CONFLICTO', mensaje: 'Otra persona confirmó antes. Revisa las opciones actualizadas.' });
      }
    }

    const ahora = this.reloj.ahora();
    let creadas: { id: string; puntoId: string; inicio: Date; fin: Date; punto: string }[];
    try {
      creadas = await this.prisma.$transaction(async (tx) => {
        const res = [];
        for (const g of grupos) {
          const inicio = new Date(elegidas[g.puntoId]);
          const punto = await tx.punto.findUniqueOrThrow({ where: { id: g.puntoId } });
          await tx.$executeRaw`INSERT INTO "CupoVentana" ("puntoId","inicio","usados") VALUES (${g.puntoId}, ${inicio}, 0) ON CONFLICT DO NOTHING`;
          const cupo = await tx.$executeRaw`UPDATE "CupoVentana" SET "usados" = "usados" + 1 WHERE "puntoId" = ${g.puntoId} AND "inicio" = ${inicio} AND "usados" < ${punto.capacidad}`;
          if (cupo !== 1) throw new ConflictException('cupo');
          for (const it of g.items) {
            const n = await tx.$executeRaw`UPDATE "Inventario" SET "existencias" = "existencias" - ${it.cantidad} WHERE "puntoId" = ${g.puntoId} AND "medicamentoCodigo" = ${it.medicamentoCodigo} AND "existencias" >= ${it.cantidad}`;
            if (n !== 1) throw new ConflictException('existencias');
            const marcado = await tx.formulaItem.updateMany({ where: { id: it.id, estado: 'PENDIENTE' }, data: { estado: 'RESERVADO' } });
            if (marcado.count !== 1) throw new ConflictException('item');
          }
          const cita = await tx.cita.create({
            data: {
              pacienteCedula: cedula, puntoId: g.puntoId, inicio, fin: sumarHoras(inicio, 1), codigo: await this.codigoUnico(tx), creadaEn: ahora,
              items: { create: g.items.map((i) => ({ formulaItemId: i.id })) },
            },
          });
          res.push({ id: cita.id, puntoId: g.puntoId, inicio, fin: cita.fin, punto: punto.nombre });
        }
        const formulaIds = [...new Set(grupos.flatMap((g) => g.items.map((i) => i.formulaId)))];
        await tx.formula.updateMany({ where: { id: { in: formulaIds } }, data: { estado: 'AGENDADA' } });
        return res;
      });
    } catch (e) {
      if (e instanceof ConflictException) {
        await this.eventos.registrar('confirmacion_rechazada', { razon: String((e.getResponse() as any)?.message ?? 'conflicto') });
        throw new ConflictException({ codigo: 'CONFLICTO', mensaje: 'Otra persona confirmó antes. Revisa las opciones actualizadas.' });
      }
      throw e;
    }

    const quien = await this.nombre(cedula);
    for (const c of creadas) {
      const noche = momentoRecordatorioNoche(c.inicio, ahora);
      if (noche) await this.cola.programar('recordatorio-noche', { citaId: c.id }, noche);
      await this.cola.programar('recordatorio-hora', { citaId: c.id }, sumarHoras(c.inicio, -1));
      await this.cola.programar('expirar-cita', { citaId: c.id }, c.fin);
      await this.eventos.registrar('cita_confirmada', { cita: c.id, punto: c.puntoId });
      await this.notif.notificar(cedula, plantillas.confirmacion({ paciente: quien, punto: c.punto, fecha: fecha(c.inicio), ventana: ventana(c.inicio, c.fin) }), 'confirmacion');
    }
    return { citas: creadas.map((c) => c.id), sinDisponibilidad: excluidas };
  }

  private async codigoUnico(tx: Tx) {
    for (;;) {
      const c = digitos(8);
      if (!(await tx.cita.findUnique({ where: { codigo: c } }))) return c;
    }
  }

  private async recalcularFormula(tx: Tx, formulaId: string) {
    const f = await tx.formula.findUniqueOrThrow({ where: { id: formulaId }, include: { items: true } });
    if (f.estado === 'NO_APTA' || f.estado === 'SIN_DISPONIBILIDAD') return f.estado;
    const estado = estadoFormulaPorItems(f.items.map((i) => i.estado as EstadoItem));
    await tx.formula.update({ where: { id: formulaId }, data: { estado } });
    return estado;
  }

  /** RF-45, RF-46, RF-47, RF-48: cancelación o expiración con liberación inmediata. */
  async terminarCita(citaId: string, estado: 'CANCELADA' | 'EXPIRADA', cedula?: string) {
    const r = await this.prisma.$transaction(async (tx) => {
      const tomada = await tx.cita.updateMany({ where: { id: citaId, estado: 'RESERVADA', ...(cedula ? { pacienteCedula: cedula } : {}) }, data: { estado, estadoCodigo: 'ANULADO' } });
      if (tomada.count !== 1) return null;
      const cita = await tx.cita.findUniqueOrThrow({ where: { id: citaId }, include: { punto: true, items: { include: { formulaItem: true } } } });
      await tx.cupoVentana.updateMany({ where: { puntoId: cita.puntoId, inicio: cita.inicio, usados: { gt: 0 } }, data: { usados: { decrement: 1 } } });
      let perdida = false;
      for (const ci of cita.items) {
        await tx.inventario.update({ where: { puntoId_medicamentoCodigo: { puntoId: cita.puntoId, medicamentoCodigo: ci.formulaItem.medicamentoCodigo } }, data: { existencias: { increment: ci.formulaItem.cantidad } } });
        const hermanos = await tx.formulaItem.findMany({ where: { formulaId: ci.formulaItem.formulaId } });
        const destino = destinoItemAlLiberar(hermanos.map((h) => h.estado as EstadoItem));
        if (destino === 'PERDIDO') perdida = true;
        await tx.formulaItem.update({ where: { id: ci.formulaItemId }, data: { estado: destino } });
      }
      for (const fid of new Set(cita.items.map((i) => i.formulaItem.formulaId))) await this.recalcularFormula(tx, fid);
      return { cita, perdida };
    });
    if (!r) return false;
    const { cita, perdida } = r;
    await this.eventos.registrar(estado === 'CANCELADA' ? 'cita_cancelada' : 'cita_expirada', { cita: cita.id });
    const quien = await this.nombre(cita.pacienteCedula);
    const v = { paciente: quien, punto: cita.punto.nombre, fecha: fecha(cita.inicio), ventana: ventana(cita.inicio, cita.fin) };
    await this.notif.notificar(cita.pacienteCedula, estado === 'CANCELADA' ? plantillas.cancelada(v) : plantillas.expirada(v), estado.toLowerCase());
    if (perdida) await this.notif.notificar(cita.pacienteCedula, plantillas.perdida(quien), 'perdida');
    return true;
  }

  /** RF-57, DEC-39: cambio de estado detectado una hora antes. */
  async cancelarFormulaPorCambio(formulaId: string, motivo: string, siguiente: string) {
    await this.prisma.$transaction(async (tx) => {
      const items = await tx.formulaItem.findMany({ where: { formulaId, estado: 'RESERVADO' }, include: { citaItems: { include: { cita: true } } } });
      for (const it of items) {
        for (const ci of it.citaItems.filter((c) => c.cita.estado === 'RESERVADA')) {
          await tx.inventario.update({ where: { puntoId_medicamentoCodigo: { puntoId: ci.cita.puntoId, medicamentoCodigo: it.medicamentoCodigo } }, data: { existencias: { increment: it.cantidad } } });
          await tx.citaItem.delete({ where: { id: ci.id } });
          const quedan = await tx.citaItem.count({ where: { citaId: ci.citaId } });
          if (!quedan) {
            await tx.cita.update({ where: { id: ci.citaId }, data: { estado: 'CANCELADA', estadoCodigo: 'ANULADO' } });
            await tx.cupoVentana.updateMany({ where: { puntoId: ci.cita.puntoId, inicio: ci.cita.inicio, usados: { gt: 0 } }, data: { usados: { decrement: 1 } } });
          }
        }
        await tx.formulaItem.update({ where: { id: it.id }, data: { estado: 'LIBERADO' } });
      }
      await tx.formula.update({ where: { id: formulaId }, data: { estado: 'NO_APTA', motivo, siguiente } });
    });
  }

  /** RF-12: al revocar, se cancelan las citas activas y se liberan existencias y cupos. */
  async liberarTodoPorRevocacion(cedula: string) {
    const citas = await this.prisma.cita.findMany({ where: { pacienteCedula: cedula, estado: 'RESERVADA' }, include: { items: { include: { formulaItem: true } } } });
    for (const c of citas) {
      await this.prisma.$transaction(async (tx) => {
        await tx.cita.update({ where: { id: c.id }, data: { estado: 'CANCELADA', estadoCodigo: 'ANULADO' } });
        await tx.cupoVentana.updateMany({ where: { puntoId: c.puntoId, inicio: c.inicio, usados: { gt: 0 } }, data: { usados: { decrement: 1 } } });
        for (const ci of c.items)
          await tx.inventario.update({ where: { puntoId_medicamentoCodigo: { puntoId: c.puntoId, medicamentoCodigo: ci.formulaItem.medicamentoCodigo } }, data: { existencias: { increment: ci.formulaItem.cantidad } } });
      });
    }
  }
}
