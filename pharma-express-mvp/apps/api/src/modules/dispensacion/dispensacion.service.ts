import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma.service';
import { RelojService } from '../../common/reloj.service';
import { EventosService } from '../../common/eventos.service';
import { verificarSecreto } from '../../common/cripto';
import { hora, isoDia } from '../../common/formato';
import { diaCivil, DIAS_AVISO_PROXIMA, EstadoItem, estadoFormulaPorItems, sumarDias, validarCodigoEnPunto } from '../../domain/reglas';
import { nombreCorto, plantillas } from '../../domain/plantillas';
import { ColaService } from '../notificaciones/cola.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

const MENSAJES = {
  NO_EXISTE: 'El código no existe.',
  OTRO_PUNTO: 'Este código corresponde a otro punto.',
  USADO: 'El código ya fue usado.',
  ANULADO: 'El código está anulado: la cita fue cancelada.',
  EXPIRADA: 'La cita expiró. El paciente puede acudir a la atención presencial o iniciar una nueva solicitud.',
  ANTES_DE_VENTANA: 'La ventana aún no empieza. El paciente debe esperar su inicio.',
};

export type Cierre = { citaItemId: string; resultado: 'ENTREGADO' | 'NO_ENTREGADO'; motivo?: string; descripcion?: string };

/** SPEC-06: atención en el punto y cierre por medicamento. */
@Injectable()
export class DispensacionService {
  constructor(
    private prisma: PrismaService,
    private reloj: RelojService,
    private eventos: EventosService,
    private jwt: JwtService,
    private cola: ColaService,
    private notif: NotificacionesService,
  ) {}

  async login(usuario: string, clave: string) {
    const d = await this.prisma.dispensador.findUnique({ where: { usuario }, include: { punto: true } });
    if (!d || !verificarSecreto(clave, d.claveHash)) throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    await this.eventos.registrar('dispensador_ingreso', { usuario });
    return { token: await this.jwt.signAsync({ sub: d.usuario, puntoId: d.puntoId }), punto: d.punto.nombre, usuario };
  }

  /** RF-60 a RF-63, BR-29, BR-30. */
  async validar(codigo: string, puntoId: string) {
    const ahora = this.reloj.ahora();
    const cita = await this.prisma.cita.findUnique({ where: { codigo: codigo.replace(/\D/g, '') }, include: { punto: true } });
    const r = validarCodigoEnPunto(cita, puntoId, ahora);
    if (!r.ok) {
      const extra = r.razon === 'OTRO_PUNTO' && cita ? ` (${cita.punto.nombre})` : r.razon === 'ANTES_DE_VENTANA' && cita ? ` Empieza a las ${hora(cita.inicio)}.` : '';
      return { ok: false, razon: r.razon, mensaje: MENSAJES[r.razon] + extra };
    }
    if (cita!.estado === 'RESERVADA') {
      await this.prisma.cita.update({ where: { id: cita!.id }, data: { estado: 'CUMPLIDA', llegadaEn: ahora } });
      await this.eventos.registrar('llegada', { cita: cita!.id });
    }
    return { ok: true, ...(await this.detalle(cita!.id)) };
  }

  private async detalle(citaId: string) {
    const c = await this.prisma.cita.findUniqueOrThrow({ where: { id: citaId }, include: { punto: true, items: { include: { formulaItem: { include: { formula: true } } } } } });
    const p = await this.prisma.simPacienteEps.findUniqueOrThrow({ where: { cedula: c.pacienteCedula } });
    const meds = Object.fromEntries((await this.prisma.medicamento.findMany()).map((m) => [m.codigo, m.nombre]));
    return {
      cita: { id: c.id, inicio: c.inicio, fin: c.fin, llegadaEn: c.llegadaEn, estado: c.estado },
      paciente: { nombre: p.nombre, cedula: p.cedula, eps: p.eps },
      aviso: 'Prevalidación preliminar: la validación oficial es la que registra el dispensador.',
      items: c.items.map((i) => ({
        citaItemId: i.id, nombre: meds[i.formulaItem.medicamentoCodigo], cantidad: i.formulaItem.cantidad,
        formula: i.formulaItem.formula.numero, tipo: i.formulaItem.formula.tipo, prevalidacion: 'Apta (preliminar)',
      })),
      motivos: await this.prisma.motivoNoEntrega.findMany(),
    };
  }

  /** RF-64 a RF-68, DEC-45, AC-60. */
  async cerrar(citaId: string, puntoId: string, usuario: string, cierres: Cierre[]) {
    const motivos = await this.prisma.motivoNoEntrega.findMany();
    const ahora = this.reloj.ahora();
    const resultado = await this.prisma.$transaction(async (tx) => {
      const c = await tx.cita.findUniqueOrThrow({ where: { id: citaId }, include: { items: { include: { formulaItem: { include: { formula: true } } } } } });
      if (c.puntoId !== puntoId || c.estado !== 'CUMPLIDA') throw new BadRequestException('Primero valida el código de esta cita en tu punto.');
      if (cierres.length !== c.items.length) throw new BadRequestException('Registra el resultado de cada medicamento.');
      let hayNoEntregados = false;
      for (const ci of c.items) {
        const x = cierres.find((z) => z.citaItemId === ci.id);
        if (!x) throw new BadRequestException('Falta el resultado de un medicamento.');
        if (x.resultado === 'NO_ENTREGADO') {
          const m = motivos.find((mm) => mm.codigo === x.motivo);
          if (!m) throw new BadRequestException('Escoge un motivo del catálogo.');
          if (m.exigeDescripcion && !x.descripcion?.trim()) throw new BadRequestException('El motivo "Otro" exige una descripción.');
          hayNoEntregados = true;
        }
        await tx.citaItem.update({ where: { id: ci.id }, data: { resultado: x.resultado, motivo: x.motivo ?? null, descripcion: x.descripcion ?? null, dispensador: usuario, cerradoEn: ahora } });
        await tx.formulaItem.update({ where: { id: ci.formulaItemId }, data: { estado: x.resultado } });
      }
      await tx.cita.update({ where: { id: c.id }, data: { estado: 'CERRADA', estadoCodigo: 'USADO' } });
      const cronicasEntregadas: string[] = [];
      for (const f of new Map(c.items.map((i) => [i.formulaItem.formulaId, i.formulaItem.formula])).values()) {
        const items = await tx.formulaItem.findMany({ where: { formulaId: f.id } });
        const estado = estadoFormulaPorItems(items.map((i) => i.estado as EstadoItem));
        await tx.formula.update({ where: { id: f.id }, data: { estado } });
        if (estado === 'ENTREGADA' && f.tipo === 'CRONICO') cronicasEntregadas.push(f.numero);
      }
      return { pacienteCedula: c.pacienteCedula, hayNoEntregados, cronicasEntregadas };
    });

    for (const ci of cierres) await this.eventos.registrar('cierre_medicamento', { cita: citaId, resultado: ci.resultado, motivo: ci.motivo ?? null, dispensador: usuario });
    // RF-67: la EPS simulada informa la siguiente fecha habilitada (aquí, +30 días) y se avisa 2 días antes.
    for (const numero of resultado.cronicasEntregadas) {
      const f = await this.prisma.simFormulaEps.findUniqueOrThrow({ where: { numero } });
      const siguiente = sumarDias(f.habilitada ? diaCivil(f.habilitada) : ahora, 30);
      await this.prisma.simFormulaEps.update({ where: { numero }, data: { habilitada: new Date(isoDia(siguiente)) } });
      const aviso = sumarDias(siguiente, -DIAS_AVISO_PROXIMA);
      aviso.setHours(8, 0, 0, 0);
      await this.cola.programar('aviso-proxima-entrega', { cedula: resultado.pacienteCedula, fecha: siguiente.toISOString() }, aviso);
    }
    const p = await this.prisma.simPacienteEps.findUniqueOrThrow({ where: { cedula: resultado.pacienteCedula } });
    await this.notif.notificar(resultado.pacienteCedula, plantillas.entregaCerrada(nombreCorto(p.nombre), resultado.hayNoEntregados), 'entrega_cerrada');
    return { cerrada: true, hayNoEntregados: resultado.hayNoEntregados, mensaje: resultado.hayNoEntregados ? 'Lo no entregado lo gestiona el paciente con Disfarma.' : 'Entrega completa.' };
  }
}
