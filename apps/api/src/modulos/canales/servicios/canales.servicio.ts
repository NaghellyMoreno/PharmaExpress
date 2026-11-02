/**
 * Servicio del módulo `canales` — vinculación y Mini App de Telegram (SPEC-002 v1.11).
 *
 * Persistencia: almacén en memoria para el MVP (el mecanismo técnico de persistencia de
 * sesiones de vinculación por canal queda para arquitectura, SPEC-002 sección 14).
 * Depende de `simulacion` únicamente por su `api/` (skill `nestjs-modulo-estandar`).
 */

import { Injectable } from '@nestjs/common';
import { SimulacionApi } from '../../simulacion/api/simulacion.api';
import { calcularFechaVencimiento, enmascararCedula, estaVigente, fechaColombiaISO } from '../dominio/reglas';

interface Vinculacion {
  canalId: string;
  pacienteCC: string;
  fechaVinculacionISO: string;
  avisoPrivacidadAceptado: boolean;
  autorizacionDatosSalud: boolean;
  revocada: boolean;
}

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
  private readonly vinculaciones: Vinculacion[] = [];
  private readonly avisoAceptadoPorCanal = new Set<string>(); // RF-012/DEC-P27: una aceptación por paciente y canal.
  private readonly codigosRevalidacion = new Map<string, string>(); // clave: canalId:pacienteCC
  private readonly intentosArchivoChat: { canalId: string; fecha: string }[] = []; // RF-085/DEC-P44: sin contenido.

  private claveAviso(canalId: string, pacienteCC: string): string {
    return `${canalId}:${pacienteCC}`;
  }

  private buscarVinculacion(canalId: string, pacienteCC: string): Vinculacion | undefined {
    return this.vinculaciones.find((v) => v.canalId === canalId && v.pacienteCC === pacienteCC && !v.revocada);
  }

  constructor(private readonly simulacion: SimulacionApi) {}

  /** Siembra una vinculación con una fecha determinada, solo para pruebas (sin interfaz de producto). */
  async sembrarVinculacionDePrueba(canalId: string, pacienteCC: string, fechaVinculacionISO: string): Promise<void> {
    this.vinculaciones.push({
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
    return this.vinculaciones
      .filter((v) => v.canalId === canalId && !v.revocada)
      .map((v) => {
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

  /** RF-015 / BR-007 / AC-010 — una vinculación vencida se revalida solo con un código nuevo, sin cédula. */
  async revalidarVinculacionVencida(canalId: string, pacienteCC: string, codigo: string): Promise<{ revalidada: boolean }> {
    const vinculacion = this.buscarVinculacion(canalId, pacienteCC);
    if (!vinculacion) {
      throw new Error('vinculacion_no_encontrada');
    }
    const codigoEsperado = this.codigosRevalidacion.get(this.claveAviso(canalId, pacienteCC));
    if (!codigoEsperado || codigo !== codigoEsperado) {
      return { revalidada: false };
    }
    vinculacion.fechaVinculacionISO = fechaColombiaISO(Date.now());
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
    const indice = this.vinculaciones.findIndex((v) => v.canalId === canalId && v.pacienteCC === pacienteCC);
    if (indice === -1) {
      throw new Error('vinculacion_no_encontrada');
    }
    this.vinculaciones.splice(indice, 1);
    return { desvinculado: true };
  }

  /** RF-085 / BR-008 / AC-013, AC-018, AC-035, AC-039 — ignora el archivo; solo registra que hubo un intento, sin contenido. */
  async procesarMensajeChatTelegram(update: { message?: { chat?: { id: number }; document?: unknown; photo?: unknown } }): Promise<typeof PLANTILLA_ARCHIVO_EN_CHAT> {
    const chatId = update.message?.chat?.id;
    if (chatId !== undefined && (update.message?.document || update.message?.photo)) {
      this.intentosArchivoChat.push({ canalId: String(chatId), fecha: fechaColombiaISO(Date.now()) });
    }
    return PLANTILLA_ARCHIVO_EN_CHAT;
  }

  async contarIntentosArchivoChat(canalId: string): Promise<number> {
    return this.intentosArchivoChat.filter((i) => i.canalId === canalId).length;
  }

  /** RF-012 / DEC-P27 — una aceptación del aviso por paciente y canal; se vuelve a exigir tras desvincular (DEC-P40). */
  async aceptarAvisoPrivacidad(canalId: string, pacienteCC: string): Promise<void> {
    this.avisoAceptadoPorCanal.add(this.claveAviso(canalId, pacienteCC));
  }

  async avisoPrivacidadAceptado(canalId: string, pacienteCC: string): Promise<boolean> {
    return this.avisoAceptadoPorCanal.has(this.claveAviso(canalId, pacienteCC));
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
    this.vinculaciones.push({
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
    const vinculacion = this.buscarVinculacion(canalId, pacienteCC);
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
    const vinculacion = this.buscarVinculacion(canalId, pacienteCC);
    if (!vinculacion) {
      throw new Error('vinculacion_no_encontrada');
    }
    vinculacion.revocada = true;
    return { revocado: true };
  }
}
