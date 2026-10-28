import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Canal, TipoAceptante } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { RelojService } from '../../common/reloj.service';
import { EventosService } from '../../common/eventos.service';
import { digitos, hashSecreto, verificarSecreto } from '../../common/cripto';
import { DIAS_VINCULACION, MAX_INTENTOS_CODIGO, VIGENCIA_CODIGO_MIN, sumarDias } from '../../domain/reglas';
import { nombreCorto, plantillas } from '../../domain/plantillas';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { AgendaService } from '../agenda/agenda.service';

const enmascarar = {
  cel: (c: string | null) => (c ? '•••• ' + c.replace(/\D/g, '').slice(-4) : null),
  correo: (m: string | null) => (m ? m[0] + '***@' + m.split('@')[1] : null),
};

/** SPEC-01: consentimiento, verificación por código, autorización de salud y revocación. */
@Injectable()
export class IdentidadService {
  constructor(
    private prisma: PrismaService,
    private reloj: RelojService,
    private eventos: EventosService,
    private notif: NotificacionesService,
    private agenda: AgendaService,
  ) {}

  async orientacionEps() {
    return this.prisma.contenidoEps.findMany();
  }

  /** RF-05, RF-06, CL-01, CL-02, CL-04. Requiere la aceptación previa (BR-01). */
  async solicitarCodigo(cedula: string, acepta: boolean) {
    if (!acepta) throw new BadRequestException('Sin aceptar el tratamiento de datos no registramos ningún dato.');
    const p = await this.prisma.simPacienteEps.findUnique({ where: { cedula } });
    if (!p) throw new NotFoundException({ codigo: 'CEDULA_NO_EXISTE', mensaje: 'La cédula no está en la EPS simulada.' });
    if (!p.celular && !p.correo)
      throw new HttpException({ codigo: 'SIN_CONTACTO', mensaje: 'No hay celular ni correo registrados en la EPS.' }, HttpStatus.UNPROCESSABLE_ENTITY);
    const ahora = this.reloj.ahora();
    await this.prisma.codigoVerificacion.updateMany({ where: { pacienteCedula: cedula, anuladoEn: null, usadoEn: null }, data: { anuladoEn: ahora } });
    const codigo = digitos(6);
    const venceEn = new Date(ahora.getTime() + VIGENCIA_CODIGO_MIN * 60_000);
    await this.prisma.codigoVerificacion.create({ data: { pacienteCedula: cedula, hash: hashSecreto(codigo), venceEn, creadoEn: ahora } });
    await this.notif.enviarCodigo(cedula, plantillas.codigoVerificacion(codigo));
    await this.eventos.registrar('codigo_enviado', { cedula });
    return { celular: enmascarar.cel(p.celular), correo: enmascarar.correo(p.correo), venceEn };
  }

  /** RF-07, RF-08, BR-03, BR-06: con el código correcto se verifica la identidad, se registra el consentimiento y se vincula el canal. */
  async verificar(cedula: string, codigo: string, tipo: TipoAceptante, canal: Canal, destino: string) {
    const ahora = this.reloj.ahora();
    const c = await this.prisma.codigoVerificacion.findFirst({
      where: { pacienteCedula: cedula, anuladoEn: null, usadoEn: null },
      orderBy: { creadoEn: 'desc' },
    });
    if (!c) throw new HttpException({ codigo: 'SIN_CODIGO', mensaje: 'Solicita un código nuevo.' }, HttpStatus.GONE);
    if (c.venceEn <= ahora) {
      await this.prisma.codigoVerificacion.update({ where: { id: c.id }, data: { anuladoEn: ahora } });
      await this.eventos.registrar('codigo_vencido', { cedula });
      throw new HttpException({ codigo: 'CODIGO_VENCIDO', mensaje: 'El código venció.' }, HttpStatus.GONE);
    }
    if (!verificarSecreto(codigo, c.hash)) {
      const intentos = c.intentos + 1;
      const agotado = intentos >= MAX_INTENTOS_CODIGO;
      await this.prisma.codigoVerificacion.update({ where: { id: c.id }, data: { intentos, anuladoEn: agotado ? ahora : null } });
      await this.eventos.registrar('codigo_fallido', { cedula, intentos });
      if (agotado) throw new HttpException({ codigo: 'INTENTOS_AGOTADOS', mensaje: 'Agotaste los 3 intentos.' }, HttpStatus.GONE);
      throw new HttpException({ codigo: 'CODIGO_INCORRECTO', restantes: MAX_INTENTOS_CODIGO - intentos }, HttpStatus.UNAUTHORIZED);
    }
    await this.prisma.codigoVerificacion.update({ where: { id: c.id }, data: { usadoEn: ahora } });
    await this.prisma.consentimiento.create({ data: { pacienteCedula: cedula, tipo, canal, aceptadoEn: ahora } });
    await this.prisma.vinculacion.upsert({
      where: { canal_destino_pacienteCedula: { canal, destino, pacienteCedula: cedula } },
      create: { canal, destino, pacienteCedula: cedula, verificadaEn: ahora, venceEn: sumarDias(ahora, DIAS_VINCULACION) },
      update: { estado: 'ACTIVA', verificadaEn: ahora, venceEn: sumarDias(ahora, DIAS_VINCULACION) },
    });
    await this.eventos.registrar('identidad_verificada', { cedula, tipo, canal });
    const p = await this.prisma.simPacienteEps.findUniqueOrThrow({ where: { cedula } });
    return { cedula, nombre: nombreCorto(p.nombre), eps: p.eps };
  }

  async saludAutorizada(cedula: string) {
    const c = await this.prisma.consentimiento.findFirst({ where: { pacienteCedula: cedula, revocadoEn: null, saludAutorizada: true } });
    return !!c;
  }

  /** RF-10, BR-02. */
  async autorizarSalud(cedula: string) {
    const c = await this.prisma.consentimiento.findFirst({ where: { pacienteCedula: cedula, revocadoEn: null }, orderBy: { aceptadoEn: 'desc' } });
    if (!c) throw new BadRequestException('No hay consentimiento vigente.');
    await this.prisma.consentimiento.update({ where: { id: c.id }, data: { saludAutorizada: true, saludAutorizadaEn: this.reloj.ahora() } });
    await this.eventos.registrar('salud_autorizada', { cedula });
  }

  /** RF-12, AC-09: cancela citas, libera, desvincula todos los canales y elimina los datos tratados. */
  async revocar(cedula: string) {
    const p = await this.prisma.simPacienteEps.findUniqueOrThrow({ where: { cedula } });
    await this.notif.notificar(cedula, plantillas.revocacion(nombreCorto(p.nombre)), 'revocacion');
    await this.agenda.liberarTodoPorRevocacion(cedula);
    const ahora = this.reloj.ahora();
    await this.prisma.$transaction([
      this.prisma.vinculacion.updateMany({ where: { pacienteCedula: cedula }, data: { estado: 'REVOCADA' } }),
      this.prisma.consentimiento.updateMany({ where: { pacienteCedula: cedula, revocadoEn: null }, data: { revocadoEn: ahora } }),
      this.prisma.notificacionWeb.deleteMany({ where: { pacienteCedula: cedula } }),
      this.prisma.solicitud.deleteMany({ where: { pacienteCedula: cedula } }),
      this.prisma.cita.deleteMany({ where: { pacienteCedula: cedula } }),
      this.prisma.codigoVerificacion.deleteMany({ where: { pacienteCedula: cedula } }),
    ]);
    await this.eventos.registrar('consentimiento_revocado', {});
  }
}
