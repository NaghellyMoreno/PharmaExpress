import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Bot, Context, InlineKeyboard, InputFile } from 'grammy';
import QRCode from 'qrcode';
import { PrismaService } from '../../common/prisma.service';
import { RelojService } from '../../common/reloj.service';
import { fecha, ventana } from '../../common/formato';
import { nombreCorto } from '../../domain/plantillas';
import { IdentidadService } from '../identidad/identidad.service';
import { PrevalidacionService } from '../prevalidacion/prevalidacion.service';
import { AgendaService } from '../agenda/agenda.service';

type Sesion = { paso?: 'cedula' | 'codigo'; tipo?: 'TITULAR' | 'TERCERO'; cedula?: string; actual?: string };

const PRIVACIDAD =
  'Pharma Express usa tu cédula y los datos de contacto registrados en tu EPS para verificar tu identidad, y tus fórmulas solo para prevalidarlas y agendar tu entrega. ' +
  'Las notificaciones nunca incluyen medicamentos ni diagnósticos. Puedes revocar tu consentimiento y pedir que eliminemos tus datos con /revocar. ' +
  'La atención presencial en el punto sigue disponible.';

/**
 * Bot de Telegram (DEC-01, SPEC-02). Solo responde a quien lo inicia (RF-14) y nunca usa
 * user_id, chat_id, username ni nombre visible como prueba de identidad (BR-04): exige el código.
 * Sesiones en memoria: suficiente para el MVP con una sola instancia.
 */
@Injectable()
export class TelegramBotService implements OnModuleInit, OnModuleDestroy {
  private log = new Logger('Bot');
  private bot?: Bot;
  private sesiones = new Map<number, Sesion>();

  constructor(
    private prisma: PrismaService,
    private reloj: RelojService,
    private identidad: IdentidadService,
    private prevalidacion: PrevalidacionService,
    private agenda: AgendaService,
  ) {}

  private s(ctx: Context): Sesion {
    const id = ctx.chat!.id;
    if (!this.sesiones.has(id)) this.sesiones.set(id, {});
    return this.sesiones.get(id)!;
  }

  /** Paciente escogido con vinculación activa; si no hay, orienta (RF-18, BR-07). */
  private async pacienteActual(ctx: Context): Promise<string | null> {
    const ses = this.s(ctx);
    if (!ses.actual) {
      await ctx.reply('Primero escoge para quién gestionas con /pacientes o agrega uno con /start.');
      return null;
    }
    const v = await this.prisma.vinculacion.findUnique({
      where: { canal_destino_pacienteCedula: { canal: 'TELEGRAM', destino: String(ctx.chat!.id), pacienteCedula: ses.actual } },
    });
    if (!v || v.estado !== 'ACTIVA') {
      ses.actual = undefined;
      await ctx.reply('Este chat ya no está vinculado a ese paciente. Usa /start para verificar de nuevo.');
      return null;
    }
    if (v.venceEn <= this.reloj.ahora()) {
      await ctx.reply('La vinculación venció (3 meses). Te enviamos un código nuevo al celular y correo registrados.');
      await this.identidad.solicitarCodigo(ses.actual, true);
      Object.assign(ses, { paso: 'codigo', cedula: ses.actual, tipo: ses.tipo ?? 'TITULAR' });
      return null;
    }
    return ses.actual;
  }

  async onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token || process.env.TELEGRAM_POLLING === 'off') {
      this.log.warn('Bot de Telegram desactivado (sin TELEGRAM_BOT_TOKEN).');
      return;
    }
    const bot = new Bot(token);
    this.bot = bot;

    bot.command('start', async (ctx) => {
      this.sesiones.set(ctx.chat.id, { actual: this.s(ctx).actual });
      await ctx.reply(PRIVACIDAD, {
        reply_markup: new InlineKeyboard()
          .text('Acepto: soy el titular', 'acepta:TITULAR').row()
          .text('Acepto: actúo con su autorización', 'acepta:TERCERO').row()
          .text('No acepto', 'no-acepta'),
      });
    });
    bot.command('privacidad', (ctx) => ctx.reply(PRIVACIDAD));

    bot.callbackQuery(/^acepta:(TITULAR|TERCERO)$/, async (ctx) => {
      Object.assign(this.s(ctx), { paso: 'cedula', tipo: ctx.match[1] as 'TITULAR' | 'TERCERO' });
      await ctx.answerCallbackQuery();
      await ctx.reply('Escribe el número de cédula del paciente.');
    });
    bot.callbackQuery('no-acepta', async (ctx) => {
      await ctx.answerCallbackQuery();
      await ctx.reply('Sin aceptar el tratamiento de datos no registramos nada. Puedes reclamar tus medicamentos con la atención presencial.');
    });

    bot.command('pacientes', async (ctx) => {
      const vs = await this.prisma.vinculacion.findMany({ where: { canal: 'TELEGRAM', destino: String(ctx.chat.id), estado: 'ACTIVA' } });
      if (!vs.length) return ctx.reply('No hay pacientes vinculados a este chat. Usa /start para agregar uno.');
      const kb = new InlineKeyboard();
      for (const v of vs) {
        const p = await this.prisma.simPacienteEps.findUnique({ where: { cedula: v.pacienteCedula } });
        kb.text(`${p ? nombreCorto(p.nombre) : v.pacienteCedula}${v.venceEn <= this.reloj.ahora() ? ' (vencida)' : ''}`, `sel:${v.pacienteCedula}`).row();
      }
      await ctx.reply('¿Para quién gestionas?', { reply_markup: kb });
    });
    bot.callbackQuery(/^sel:(\d+)$/, async (ctx) => {
      this.s(ctx).actual = ctx.match[1];
      await ctx.answerCallbackQuery();
      const ced = await this.pacienteActual(ctx);
      if (ced) await ctx.reply(`Gestionando para ${await this.nombre(ced)}. Comandos: /estado, /codigo, /cancelar, /web, /revocar.`);
    });

    bot.command('estado', async (ctx) => {
      const ced = await this.pacienteActual(ctx);
      if (!ced) return;
      const e = await this.prevalidacion.estado(ced);
      const lineas = [`Paciente: ${await this.nombre(ced)}`, '', 'Fórmulas:'];
      e.formulas.slice(0, 10).forEach((f) => lineas.push(`• ${f.numero}: ${f.estado.replace(/_/g, ' ').toLowerCase()}${f.motivo ? ` (${f.motivo})` : ''}`));
      lineas.push('', 'Citas:');
      e.citas.forEach((c) => lineas.push(`• ${c.punto}, ${fecha(c.inicio)} ${ventana(c.inicio, c.fin)}: ${c.estado.toLowerCase()}`));
      if (!e.citas.length) lineas.push('• Sin citas');
      await ctx.reply(lineas.join('\n'));
    });

    bot.command('codigo', async (ctx) => {
      const ced = await this.pacienteActual(ctx);
      if (!ced) return;
      const citas = await this.prisma.cita.findMany({ where: { pacienteCedula: ced, estado: 'RESERVADA' }, include: { punto: true } });
      if (!citas.length) return ctx.reply('No hay citas reservadas.');
      for (const c of citas) {
        const png = await QRCode.toBuffer(`PX:${c.codigo}`, { width: 320, margin: 2 });
        await ctx.replyWithPhoto(new InputFile(png, 'codigo.png'), {
          caption: `${c.punto.nombre}, ${fecha(c.inicio)} de ${ventana(c.inicio, c.fin)}.\nCódigo de entrega: ${c.codigo.slice(0, 4)} ${c.codigo.slice(4)} (un solo uso).`,
        });
      }
    });

    bot.command('cancelar', async (ctx) => {
      const ced = await this.pacienteActual(ctx);
      if (!ced) return;
      const citas = await this.prisma.cita.findMany({ where: { pacienteCedula: ced, estado: 'RESERVADA' }, include: { punto: true } });
      if (!citas.length) return ctx.reply('No hay citas para cancelar.');
      const kb = new InlineKeyboard();
      citas.forEach((c) => kb.text(`${c.punto.nombre} · ${fecha(c.inicio)} ${ventana(c.inicio, c.fin)}`, `cancelar:${c.id}`).row());
      await ctx.reply('¿Qué cita quieres cancelar? Los medicamentos quedan disponibles para otras personas.', { reply_markup: kb });
    });
    bot.callbackQuery(/^cancelar:(.+)$/, async (ctx) => {
      await ctx.answerCallbackQuery();
      const ced = await this.pacienteActual(ctx);
      if (!ced) return;
      const ok = await this.agenda.terminarCita(ctx.match[1], 'CANCELADA', ced);
      await ctx.reply(ok ? 'Cita cancelada. Si necesitas otra, inicia una nueva solicitud.' : 'Esa cita ya no está activa.');
    });

    bot.command('web', async (ctx) => {
      const url = process.env.WEB_URL ?? 'la aplicación web';
      await ctx.reply(`Para cargar fórmulas, prevalidar y agendar en esta versión del MVP usa ${url}. Desde aquí puedes consultar el estado, ver tu código y cancelar.`);
    });

    bot.command('revocar', (ctx) =>
      ctx.reply('¿Revocar el consentimiento? Se cancelan las citas activas y se eliminan los datos del paciente.', {
        reply_markup: new InlineKeyboard().text('Sí, revocar', 'revocar:si').text('No', 'revocar:no'),
      }),
    );
    bot.callbackQuery(/^revocar:(si|no)$/, async (ctx) => {
      await ctx.answerCallbackQuery();
      if (ctx.match[1] === 'no') return ctx.reply('No se hizo ningún cambio.');
      const ced = await this.pacienteActual(ctx);
      if (!ced) return;
      await this.identidad.revocar(ced);
      this.s(ctx).actual = undefined;
      await ctx.reply('Consentimiento revocado. Eliminamos los datos del paciente en Pharma Express.');
    });

    bot.on('message:text', async (ctx) => {
      const ses = this.s(ctx);
      const texto = ctx.message.text.trim();
      if (ses.paso === 'cedula') {
        const cedula = texto.replace(/\D/g, '');
        try {
          const r = await this.identidad.solicitarCodigo(cedula, true);
          Object.assign(ses, { paso: 'codigo', cedula });
          await ctx.reply(`Enviamos un código al celular ${r.celular ?? ''}${r.correo ? ` y al correo ${r.correo}` : ''}. Escríbelo aquí; vence en 10 minutos.`);
        } catch (e: any) {
          const c = e?.response?.codigo;
          await ctx.reply(
            c === 'CEDULA_NO_EXISTE'
              ? 'No encontramos esa cédula. Verifícala o consulta con tu EPS. La atención presencial sigue disponible.'
              : c === 'SIN_CONTACTO'
                ? 'No hay celular ni correo registrados en la EPS. Actualízalos en tu EPS o acude a la atención presencial.'
                : 'No pudimos enviar el código. Intenta de nuevo.',
          );
        }
        return;
      }
      if (ses.paso === 'codigo' && ses.cedula) {
        try {
          const r = await this.identidad.verificar(ses.cedula, texto.replace(/\D/g, ''), ses.tipo ?? 'TITULAR', 'TELEGRAM', String(ctx.chat.id));
          Object.assign(ses, { paso: undefined, actual: r.cedula, cedula: undefined });
          await ctx.reply(`Identidad verificada. Este chat quedó vinculado a ${r.nombre} por 3 meses.\nComandos: /estado, /codigo, /cancelar, /web, /pacientes, /revocar.`);
        } catch (e: any) {
          const c = e?.response?.codigo;
          if (c === 'CODIGO_INCORRECTO') return ctx.reply(`Código incorrecto. Te quedan ${e.response.restantes} intentos.`);
          ses.paso = 'cedula';
          await ctx.reply(
            'No pudimos verificar la identidad. Escribe de nuevo la cédula para recibir un código nuevo. Si cambiaste de celular o correo, actualízalo en tu EPS. La atención presencial sigue disponible.',
          );
        }
        return;
      }
      await ctx.reply('Usa /start para empezar o /pacientes para escoger a quién gestionas.');
    });

    bot.catch((e) => this.log.error(e.error));
    bot.start({ drop_pending_updates: true }).catch((e) => this.log.error(e));
    this.log.log('Bot de Telegram en marcha (long polling).');
  }

  async onModuleDestroy() {
    await this.bot?.stop();
  }

  private async nombre(cedula: string) {
    const p = await this.prisma.simPacienteEps.findUnique({ where: { cedula } });
    return p ? nombreCorto(p.nombre) : cedula;
  }
}
