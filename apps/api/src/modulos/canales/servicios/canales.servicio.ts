/**
 * Servicio del módulo `canales` — vinculación y Mini App de Telegram (SPEC-002 v1.11).
 *
 * Persistencia: Postgres vía Prisma en producción (esquema `canales`); en memoria por defecto
 * para pruebas unitarias sin Docker (ver `datos/repositorios.ts`).
 * Depende de `simulacion` únicamente por su `api/` (skill `nestjs-modulo-estandar`).
 */

import { Inject, Injectable, Optional } from '@nestjs/common';
import { SimulacionApi } from '../../simulacion/api/simulacion.api';
import {
  REPO_AVISOS_CANAL,
  REPO_INTENTOS_ARCHIVO_CHAT,
  REPO_VINCULACIONES,
  RepositorioAvisosCanal,
  RepositorioAvisosCanalEnMemoria,
  RepositorioIntentosArchivoChat,
  RepositorioIntentosArchivoChatEnMemoria,
  RepositorioVinculaciones,
  RepositorioVinculacionesEnMemoria,
} from '../datos/repositorios';
import { calcularFechaVencimiento, enmascararCedula, estaVigente, fechaColombiaISO } from '../dominio/reglas';

export interface PacienteVinculado {
  pacienteCC: string;
  cedulaEnmascarada: string;
  vigente: boolean;
  vencida: boolean;
}

const PLANTILLA_ARCHIVO_EN_CHAT = {
  texto: 'Para cargar tus documentos, ábrelos en la Mini App de Pharma Express.',
  boton: { texto: 'Abrir Mini App', accion: 'abrir_mini_app' },
};

@Injectable()
export class CanalesServicio {
  // Código de revalidación/vinculación: vigente ~10 min, se mantiene en memoria del proceso
  // a propósito (RF-015: si se pierde, el usuario simplemente pide uno nuevo).
  private readonly codigosRevalidacion = new Map<string, string>();

  constructor(
    private readonly simulacion: SimulacionApi,
    @Optional()
    @Inject(REPO_VINCULACIONES)
    private readonly vinculaciones: RepositorioVinculaciones = new RepositorioVinculacionesEnMemoria(),
    @Optional()
    @Inject(REPO_AVISOS_CANAL)
    private readonly avisos: RepositorioAvisosCanal = new RepositorioAvisosCanalEnMemoria(),
    @Optional()
    @Inject(REPO_INTENTOS_ARCHIVO_CHAT)
    private readonly intentosArchivo: RepositorioIntentosArchivoChat = new RepositorioIntentosArchivoChatEnMemoria(),
  ) {}

  private claveAviso(canalId: string, pacienteCC: string): string {
    return `${canalId}:${pacienteCC}`;
  }

  /** Siembra una vinculación con una fecha determinada, solo para pruebas (sin interfaz de producto). */
  async sembrarVinculacionDePrueba(canalId: string, pacienteCC: string, fechaVinculacionISO: string): Promise<void> {
    await this.vinculaciones.crear({
      canalId,
      pacienteCC,
      fechaVinculacionISO,
      avisoPrivacidadAceptado: true,
      autorizacionDatosSalud: false,
      revocada: false,
    });
  }

  /** RF-014 / BR-005 / AC-009, AC-020, AC-026 / CL-005, CL-008 — estado de vigencia de cada vinculación del canal. */
  async verificarExpiracionVinculaciones(canalId: string, ahora: Date = new Date()): Promise<PacienteVinculado[]> {
    const ahoraISO = fechaColombiaISO(ahora.getTime());
    const activas = await this.vinculaciones.listarActivasPorCanal(canalId);
    return activas.map((v) => {
      const vigente = estaVigente(v.fechaVinculacionISO, ahoraISO);
      return { pacienteCC: v.pacienteCC, cedulaEnmascarada: enmascararCedula(v.pacienteCC), vigente, vencida: !vigente };
    });
  }

  /** Expone el código de revalidación emitido (para pruebas; en producción se envía por SMS/correo, SPEC-001). */
  async generarCodigoRevalidacion(canalId: string, pacienteCC: string): Promise<string> {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    this.codigosRevalidacion.set(this.claveAviso(canalId, pacienteCC), codigo);
    return codigo;
  }

  /**
   * Solo para pruebas automatizadas (Playwright, skill `plantilla-playwright-humo`) contra el
   * adaptador de envío simulado: el código real nunca se expone así en producción (se entrega
   * únicamente por SMS/correo, SPEC-001/RF-004, RF-005). El controlador que la expone la cierra
   * fuera de `NODE_ENV=production`.
   */
  async obtenerCodigoVigentePrueba(canalId: string, pacienteCC: string): Promise<string | undefined> {
    return this.codigosRevalidacion.get(this.claveAviso(canalId, pacienteCC));
  }

  /** RF-015 / BR-007 / AC-010 — una vinculación vencida se revalida solo con un código nuevo, sin cédula. */
  async revalidarVinculacionVencida(canalId: string, pacienteCC: string, codigo: string): Promise<{ revalidada: boolean }> {
    const vinculacion = await this.vinculaciones.buscarActiva(canalId, pacienteCC);
    if (!vinculacion) {
      throw new Error('vinculacion_no_encontrada');
    }
    const codigoEsperado = this.codigosRevalidacion.get(this.claveAviso(canalId, pacienteCC));
    if (!codigoEsperado || codigo !== codigoEsperado) {
      return { revalidada: false };
    }
    await this.vinculaciones.actualizarFecha(canalId, pacienteCC, fechaColombiaISO(Date.now()));
    this.codigosRevalidacion.delete(this.claveAviso(canalId, pacienteCC));
    return { revalidada: true };
  }

  /** RF-016 / BR-009 / AC-011, AC-038 — lista con CC ***1234, incluidas las vencidas marcadas. */
  async obtenerPacientesVinculados(canalId: string, ahora: Date = new Date()): Promise<PacienteVinculado[]> {
    return this.verificarExpiracionVinculaciones(canalId, ahora);
  }

  /** RF-019 / RF-020 / BR-006 / AC-012 / CL-006 — confirmación simple; sin ella no se desvincula. */
  async desvincularPaciente(canalId: string, pacienteCC: string, confirmado: boolean): Promise<{ desvinculado: boolean }> {
    if (!confirmado) {
      return { desvinculado: false };
    }
    const vinculacion = await this.vinculaciones.buscarActiva(canalId, pacienteCC);
    if (!vinculacion) {
      throw new Error('vinculacion_no_encontrada');
    }
    await this.vinculaciones.eliminar(canalId, pacienteCC);
    return { desvinculado: true };
  }

  /** RF-085 / BR-008 / AC-013, AC-018, AC-035, AC-039 — ignora el archivo; solo registra que hubo un intento, sin contenido. */
  async procesarMensajeChatTelegram(update: { message?: { chat?: { id: number }; document?: unknown; photo?: unknown } }): Promise<typeof PLANTILLA_ARCHIVO_EN_CHAT> {
    const chatId = update.message?.chat?.id;
    if (chatId !== undefined && (update.message?.document || update.message?.photo)) {
      await this.intentosArchivo.registrar(String(chatId), fechaColombiaISO(Date.now()));
    }
    return PLANTILLA_ARCHIVO_EN_CHAT;
  }

  async contarIntentosArchivoChat(canalId: string): Promise<number> {
    return this.intentosArchivo.contarPorCanal(canalId);
  }

  /** RF-012 / DEC-P27 — una aceptación del aviso por paciente y canal; se vuelve a exigir tras desvincular (DEC-P40). */
  async aceptarAvisoPrivacidad(canalId: string, pacienteCC: string): Promise<void> {
    await this.avisos.marcarAceptado(canalId, pacienteCC);
  }

  async avisoPrivacidadAceptado(canalId: string, pacienteCC: string): Promise<boolean> {
    return this.avisos.fueAceptado(canalId, pacienteCC);
  }

  /**
   * RF-013 / DEC-P22, DEC-P26, DEC-P37, DEC-P39 / AC-022, AC-025 — exige cédula y código solo si no
   * existe vinculación activa ni vencida con ese paciente (incluida desvinculación/revocación); un
   * código o cédula inválidos no crean ni registran ninguna vinculación.
   */
  async vincularNuevaMiniApp(canalId: string, pacienteCC: string, codigo: string): Promise<{ vinculado: boolean }> {
    const paciente = await this.simulacion.consultarPaciente(pacienteCC);
    if (!paciente) {
      return { vinculado: false };
    }
    const codigoEsperado = this.codigosRevalidacion.get(this.claveAviso(canalId, pacienteCC));
    if (!codigoEsperado || codigo !== codigoEsperado) {
      return { vinculado: false };
    }
    this.codigosRevalidacion.delete(this.claveAviso(canalId, pacienteCC));
    await this.vinculaciones.crear({
      canalId,
      pacienteCC,
      fechaVinculacionISO: fechaColombiaISO(Date.now()),
      avisoPrivacidadAceptado: await this.avisoPrivacidadAceptado(canalId, pacienteCC),
      autorizacionDatosSalud: false,
      revocada: false,
    });
    return { vinculado: true };
  }

  /** RF-013 / AC-024 / AC-032 — vinculación vigente: no se pide código nuevo; sin vinculación: exige cédula y código. */
  async validarAccesoMiniApp(canalId: string, pacienteCC: string, ahora: Date = new Date()): Promise<{ accesoDirecto: boolean; requiereCodigoNuevo: boolean; requiereCedula: boolean }> {
    const vinculacion = await this.vinculaciones.buscarActiva(canalId, pacienteCC);
    if (!vinculacion) {
      return { accesoDirecto: false, requiereCodigoNuevo: true, requiereCedula: true };
    }
    const vigente = estaVigente(vinculacion.fechaVinculacionISO, fechaColombiaISO(ahora.getTime()));
    if (vigente) {
      return { accesoDirecto: true, requiereCodigoNuevo: false, requiereCedula: false };
    }
    return { accesoDirecto: false, requiereCodigoNuevo: true, requiereCedula: false };
  }

  /** SPEC-001/RF-008 / DEC-P38, DEC-P57 / AC-033, AC-040 — confirmación simple previa; sin código nuevo. */
  async revocarConsentimiento(canalId: string, pacienteCC: string, confirmado: boolean): Promise<{ revocado: boolean }> {
    if (!confirmado) {
      return { revocado: false };
    }
    const vinculacion = await this.vinculaciones.buscarActiva(canalId, pacienteCC);
    if (!vinculacion) {
      throw new Error('vinculacion_no_encontrada');
    }
    await this.vinculaciones.marcarRevocada(canalId, pacienteCC);
    return { revocado: true };
  }
}
