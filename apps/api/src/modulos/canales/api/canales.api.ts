/**
 * Puerta de entrada del módulo `canales` (única API que consumen los demás módulos,
 * incluido el bot de Telegram en `entradas/telegram`).
 */

import { Injectable } from '@nestjs/common';
import { NotificacionesApi } from '../../notificaciones/api/notificaciones.api';
import { SimulacionApi } from '../../simulacion/api/simulacion.api';
import { CanalesServicio, PacienteVinculado } from '../servicios/canales.servicio';

@Injectable()
export class CanalesApi {
  constructor(
    private readonly canales: CanalesServicio,
    private readonly simulacion: SimulacionApi,
    private readonly notificaciones: NotificacionesApi,
  ) {}

  /**
   * RF-013 — orquesta la emisión de un código nuevo para vincular (o revalidar) un canal
   * con un paciente, enviándolo por SMS y, si existe, correo (RF-004/RF-005 de SPEC-001).
   * No crea ni registra ninguna vinculación: solo emite y envía el código.
   */
  async solicitarCodigoVinculacion(canalId: string, pacienteCC: string): Promise<{ enviado: boolean }> {
    const paciente = await this.simulacion.consultarPaciente(pacienteCC);
    if (!paciente) {
      return { enviado: false };
    }
    const codigo = await this.canales.generarCodigoRevalidacion(canalId, pacienteCC);
    const smsEnviado = await this.notificaciones.enviar('sms', paciente.celular, 'codigo_verificacion', { codigo });
    if (paciente.correo) {
      await this.notificaciones.enviar('correo', paciente.correo, 'codigo_verificacion', { codigo });
    }
    return { enviado: smsEnviado.ok };
  }

  /** RF-013 — vinculación nueva: exige cédula y código (DEC-P22, DEC-P26, DEC-P37, DEC-P39). */
  confirmarVinculacion(canalId: string, pacienteCC: string, codigo: string) {
    return this.canales.vincularNuevaMiniApp(canalId, pacienteCC, codigo);
  }

  /** RF-015 — vinculación vencida: solo exige el código nuevo, sin cédula. */
  confirmarRevalidacion(canalId: string, pacienteCC: string, codigo: string) {
    return this.canales.revalidarVinculacionVencida(canalId, pacienteCC, codigo);
  }

  procesarMensajeChatTelegram(update: { message?: { chat?: { id: number }; document?: unknown; photo?: unknown } }) {
    return this.canales.procesarMensajeChatTelegram(update);
  }

  aceptarAvisoPrivacidad(canalId: string, pacienteCC: string): Promise<void> {
    return this.canales.aceptarAvisoPrivacidad(canalId, pacienteCC);
  }

  validarAccesoMiniApp(canalId: string, pacienteCC: string): Promise<{ accesoDirecto: boolean; requiereCodigoNuevo: boolean; requiereCedula: boolean }> {
    return this.canales.validarAccesoMiniApp(canalId, pacienteCC);
  }

  obtenerPacientesVinculados(canalId: string): Promise<PacienteVinculado[]> {
    return this.canales.obtenerPacientesVinculados(canalId);
  }
}
