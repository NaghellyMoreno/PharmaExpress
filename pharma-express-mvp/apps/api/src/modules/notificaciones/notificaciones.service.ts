import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RelojService } from '../../common/reloj.service';
import { EventosService } from '../../common/eventos.service';
import { verificarSinDatosDeSalud } from '../../domain/plantillas';
import { CorreoCanal, SmsCanal, TelegramCanal } from './canales-salida';

/**
 * Envía cada notificación por todos los medios del paciente (RF-49):
 * SMS y correo registrados en la EPS simulada, y navegadores y chats con vinculación activa.
 */
@Injectable()
export class NotificacionesService {
  private terminos: string[] | null = null;
  constructor(
    private prisma: PrismaService,
    private reloj: RelojService,
    private eventos: EventosService,
    private sms: SmsCanal,
    private correo: CorreoCanal,
    private telegram: TelegramCanal,
  ) {}

  private async terminosSensibles() {
    if (!this.terminos) {
      const meds = await this.prisma.medicamento.findMany({ select: { nombre: true } });
      const dx = await this.prisma.diagnosticoCronico.findMany({ select: { descripcion: true } });
      this.terminos = [...meds.map((m) => m.nombre.split(' ')[0]), ...dx.map((d) => d.descripcion)];
    }
    return this.terminos;
  }

  /** Solo para el código de verificación: SMS y correo registrados (RF-06). */
  async enviarCodigo(cedula: string, texto: string) {
    const p = await this.prisma.simPacienteEps.findUniqueOrThrow({ where: { cedula } });
    if (p.celular) await this.sms.enviar(p.celular, texto);
    if (p.correo) await this.correo.enviar(p.correo, texto);
  }

  async notificar(cedula: string, texto: string, tipo: string) {
    verificarSinDatosDeSalud(texto, await this.terminosSensibles());
    const consentido = await this.prisma.consentimiento.findFirst({ where: { pacienteCedula: cedula, revocadoEn: null } });
    if (!consentido) return; // CL-21
    const ahora = this.reloj.ahora();
    const p = await this.prisma.simPacienteEps.findUniqueOrThrow({ where: { cedula } });
    const canales: string[] = [];
    if (p.celular) { await this.sms.enviar(p.celular, texto); canales.push('SMS'); }
    if (p.correo) { await this.correo.enviar(p.correo, texto); canales.push('CORREO'); }
    const vinculos = await this.prisma.vinculacion.findMany({ where: { pacienteCedula: cedula, estado: 'ACTIVA', venceEn: { gt: ahora } } });
    for (const v of vinculos) {
      if (v.canal === 'WEB') {
        await this.prisma.notificacionWeb.create({ data: { navegadorId: v.destino, pacienteCedula: cedula, texto, creadaEn: ahora } });
        canales.push('WEB');
      } else {
        await this.telegram.enviar(v.destino, texto);
        canales.push('TELEGRAM');
      }
    }
    await this.eventos.registrar('notificacion', { tipo, canales });
  }
}
