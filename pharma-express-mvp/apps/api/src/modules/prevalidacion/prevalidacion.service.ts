import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Canal } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { RelojService } from '../../common/reloj.service';
import { EventosService } from '../../common/eventos.service';
import { idAleatorio } from '../../common/cripto';
import { diaCivil, prevalidarFormula, ResultadoFormula } from '../../domain/reglas';
import { IdentidadService } from '../identidad/identidad.service';

export type ArchivoCargado = { originalname: string; mimetype: string; buffer: Buffer; fieldname: string };

/**
 * SPEC-03. Lectura de documentos en el MVP: el usuario carga la foto o el PDF y escribe el número
 * impreso en cada fórmula; con ese número se obtienen los medicamentos y el diagnóstico desde la EPS
 * simulada. La extracción automática (OCR) queda como decisión pendiente de arquitectura.
 */
@Injectable()
export class PrevalidacionService {
  constructor(
    private prisma: PrismaService,
    private reloj: RelojService,
    private eventos: EventosService,
    private identidad: IdentidadService,
  ) {}

  async crearSolicitud(cedula: string, canal: Canal, numeros: string[], archivos: ArchivoCargado[], reintento: boolean, ilegibles: string[] = []) {
    if (!(await this.identidad.saludAutorizada(cedula))) throw new ForbiddenException('Primero autoriza el tratamiento de datos de salud.'); // AC-19
    if (!archivos.some((a) => a.fieldname === 'historia')) throw new HttpException('Carga la historia clínica.', HttpStatus.BAD_REQUEST);
    if (!numeros.length) throw new HttpException('Carga al menos una fórmula.', HttpStatus.BAD_REQUEST);

    const paciente = await this.prisma.simPacienteEps.findUniqueOrThrow({ where: { cedula } });
    const eps = await this.prisma.simFormulaEps.findMany({
      where: { pacienteCedula: cedula, numero: { in: numeros } },
      include: { items: { include: { medicamento: true } } },
    });
    // CL-08, CL-09, DEC-42: primero se pide cargar de nuevo; si persiste, la fórmula queda no apta.
    const problemas = numeros.filter((n) => ilegibles.includes(n) || !eps.some((f) => f.numero === n));
    if (problemas.length && !reintento) {
      await this.eventos.registrar('documento_recargar', { numeros: problemas });
      throw new HttpException({ codigo: 'CARGAR_DE_NUEVO', numeros: problemas }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const ahora = this.reloj.ahora();
    const solicitud = await this.prisma.solicitud.create({ data: { pacienteCedula: cedula, canal, creadaEn: ahora } });
    const dir = join(process.env.UPLOAD_DIR ?? './uploads', solicitud.id);
    await mkdir(dir, { recursive: true });
    for (const a of archivos) {
      const ruta = join(dir, idAleatorio());
      await writeFile(ruta, a.buffer);
      await this.prisma.documento.create({ data: { solicitudId: solicitud.id, tipo: a.fieldname === 'historia' ? 'HISTORIA_CLINICA' : 'FORMULA', ruta, mime: a.mimetype } });
    }

    const resultados: (ResultadoFormula & { formulaId: string; items: { nombre: string; cantidad: number }[] })[] = [];
    const contenido = await this.prisma.contenidoEps.findUnique({ where: { eps: paciente.eps } });

    // RF-26: afiliación primero; si está inactiva se detiene toda la solicitud.
    if (!paciente.afiliacionActiva) {
      for (const n of numeros) {
        await this.prisma.formula.create({ data: { solicitudId: solicitud.id, numero: n, estado: 'NO_APTA', motivo: 'Afiliación inactiva', siguiente: 'Comunícate con tu EPS para revisar tu afiliación.' } });
      }
      await this.eventos.registrar('prevalidacion', { solicitud: solicitud.id, afiliacion: false, formulas: numeros.length, noAptas: numeros.length });
      return { solicitudId: solicitud.id, afiliacionActiva: false, orientacion: 'Comunícate con tu EPS para revisar tu afiliación.', formulas: [] };
    }

    const cronicos = new Set((await this.prisma.diagnosticoCronico.findMany()).map((d) => d.codigo));
    for (const n of numeros) {
      const f = eps.find((x) => x.numero === n);
      let r: ResultadoFormula;
      if (!f || ilegibles.includes(n)) {
        r = { numero: n, apta: false, tipo: null, motivo: 'No se pudieron obtener los datos del documento', siguiente: 'Acude a la atención presencial con tus documentos.', chequeos: [{ regla: 'Lectura del documento', ok: false, detalle: 'Sin datos' }] };
      } else {
        r = prevalidarFormula(
          {
            numero: f.numero,
            vigencia: diaCivil(f.vigencia),
            diagnostico: f.diagnostico,
            habilitada: f.habilitada ? diaCivil(f.habilitada) : null,
            items: f.items.map((i) => ({ codigo: i.medicamentoCodigo, nombre: i.medicamento.nombre, pbs: i.medicamento.pbs, autorizado: i.autorizado })),
          },
          ahora,
          cronicos,
          contenido?.autorizaciones ?? 'Consulta con tu EPS cómo obtener la autorización.',
        );
      }
      const formula = await this.prisma.formula.create({
        data: {
          solicitudId: solicitud.id,
          numero: n,
          tipo: r.tipo,
          estado: r.apta ? 'APTA' : 'NO_APTA',
          motivo: r.motivo,
          siguiente: r.siguiente,
          items: { create: (f?.items ?? []).map((i) => ({ medicamentoCodigo: i.medicamentoCodigo, cantidad: i.cantidad })) },
        },
      });
      resultados.push({ ...r, formulaId: formula.id, items: (f?.items ?? []).map((i) => ({ nombre: i.medicamento.nombre, cantidad: i.cantidad })) });
    }
    await this.eventos.registrar('prevalidacion', {
      solicitud: solicitud.id,
      afiliacion: true,
      formulas: resultados.length,
      noAptas: resultados.filter((r) => !r.apta).length,
    });
    return {
      solicitudId: solicitud.id,
      afiliacionActiva: true,
      aviso: 'Resultado preliminar con datos simulados. La validación oficial ocurre en el punto de dispensación.',
      formulas: resultados,
    };
  }

  /** RF-22: estado de fórmulas y citas, con medicamentos solo dentro del flujo autenticado (BR-08). */
  async estado(cedula: string) {
    const formulas = await this.prisma.formula.findMany({
      where: { solicitud: { pacienteCedula: cedula } },
      include: { items: true, solicitud: { select: { creadaEn: true } } },
      orderBy: { solicitud: { creadaEn: 'desc' } },
    });
    const meds = Object.fromEntries((await this.prisma.medicamento.findMany()).map((m) => [m.codigo, m.nombre]));
    const citas = await this.prisma.cita.findMany({
      where: { pacienteCedula: cedula },
      include: { punto: true, items: { include: { formulaItem: true } } },
      orderBy: { inicio: 'asc' },
    });
    return {
      formulas: formulas.map((f) => ({
        id: f.id, numero: f.numero, tipo: f.tipo, estado: f.estado, motivo: f.motivo, siguiente: f.siguiente,
        items: f.items.map((i) => ({ nombre: meds[i.medicamentoCodigo], cantidad: i.cantidad, estado: i.estado })),
      })),
      citas: citas.map((c) => ({
        id: c.id, punto: c.punto.nombre, inicio: c.inicio, fin: c.fin, estado: c.estado, estadoCodigo: c.estadoCodigo,
        codigo: c.estado === 'RESERVADA' ? c.codigo : null,
        items: c.items.map((i) => ({ nombre: meds[i.formulaItem.medicamentoCodigo], cantidad: i.formulaItem.cantidad, resultado: i.resultado, motivo: i.motivo })),
      })),
    };
  }
}
