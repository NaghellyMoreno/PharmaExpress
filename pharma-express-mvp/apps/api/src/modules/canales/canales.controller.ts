import { Controller, Delete, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RelojService } from '../../common/reloj.service';
import { EventosService } from '../../common/eventos.service';
import { COOKIE_NAVEGADOR, PacienteGuard } from '../../common/paciente.guard';
import { nombreCorto } from '../../domain/plantillas';

/** SPEC-02: pacientes vinculados a este navegador, desvinculación, notificaciones web y enlace a Telegram. */
@Controller('canales')
export class CanalesController {
  constructor(private prisma: PrismaService, private reloj: RelojService, private eventos: EventosService) {}

  @Get('vinculaciones')
  async vinculaciones(@Req() req: any) {
    const nav = req.cookies[COOKIE_NAVEGADOR];
    const vs = await this.prisma.vinculacion.findMany({ where: { canal: 'WEB', destino: nav, estado: 'ACTIVA' }, orderBy: { verificadaEn: 'asc' } });
    const ahora = this.reloj.ahora();
    const out = [];
    for (const v of vs) {
      const p = await this.prisma.simPacienteEps.findUnique({ where: { cedula: v.pacienteCedula } });
      if (p) out.push({ cedula: v.pacienteCedula, nombre: nombreCorto(p.nombre), eps: p.eps, activa: v.venceEn > ahora, venceEn: v.venceEn });
    }
    return out;
  }

  @UseGuards(PacienteGuard)
  @Delete('vinculaciones/actual')
  @HttpCode(204)
  async desvincular(@Req() req: any) {
    await this.prisma.vinculacion.update({
      where: { canal_destino_pacienteCedula: { canal: 'WEB', destino: req.paciente.destino, pacienteCedula: req.paciente.cedula } },
      data: { estado: 'REVOCADA' },
    });
    await this.eventos.registrar('canal_desvinculado', { canal: 'WEB' });
  }

  @UseGuards(PacienteGuard)
  @Get('notificaciones')
  notificaciones(@Req() req: any) {
    return this.prisma.notificacionWeb.findMany({
      where: { navegadorId: req.paciente.destino, pacienteCedula: req.paciente.cedula },
      orderBy: { creadaEn: 'desc' },
      take: 30,
    });
  }

  /** RF-21: enlace profundo sin datos sensibles en sus parámetros. */
  @Get('enlace-telegram')
  enlace() {
    const bot = process.env.TELEGRAM_BOT_USERNAME;
    return { url: bot ? `https://t.me/${bot}?start=web` : null };
  }
}
