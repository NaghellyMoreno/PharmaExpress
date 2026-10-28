import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RelojService } from './reloj.service';

export const COOKIE_NAVEGADOR = 'px_nav';

/**
 * Exige que el navegador (cookie httpOnly) esté vinculado al paciente escogido (cabecera x-paciente)
 * con una vinculación activa y no vencida (RF-18, RF-19, BR-07).
 */
@Injectable()
export class PacienteGuard implements CanActivate {
  constructor(private prisma: PrismaService, private reloj: RelojService) {}
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const nav = req.cookies?.[COOKIE_NAVEGADOR];
    const cedula = req.headers['x-paciente'];
    if (!nav || typeof cedula !== 'string') throw new UnauthorizedException('Escoge un paciente vinculado.');
    const v = await this.prisma.vinculacion.findUnique({
      where: { canal_destino_pacienteCedula: { canal: 'WEB', destino: nav, pacienteCedula: cedula } },
    });
    if (!v || v.estado !== 'ACTIVA') throw new UnauthorizedException('Este navegador no está vinculado a ese paciente.');
    if (v.venceEn <= this.reloj.ahora()) throw new UnauthorizedException('VINCULACION_VENCIDA');
    req.paciente = { cedula, canal: 'WEB', destino: nav };
    return true;
  }
}

export type ContextoPaciente = { cedula: string; canal: 'WEB' | 'TELEGRAM'; destino: string };
