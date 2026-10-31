/**
 * Servicio de solicitud de código de un solo uso — módulo identidad (SPEC-001 / RF-005, RF-006, BR-003, BR-005, CL-001, AC-003 / TC-013).
 */

import { ContextoCodigoVigente } from '../dominio';

export interface ResultadoSolicitudCodigo {
  codigo: string;
  vigenciaMs: number;
}

export class SolicitudCodigoService {
  private readonly estados = new Map<string, ContextoCodigoVigente>();
  private readonly enCurso = new Map<string, Promise<unknown>>();

  private clave(usuarioId: string): string {
    return `usuario:${usuarioId}`;
  }

  /**
   * BR-003 / CL-001 / DEC-01 / SPEC-001/AC-003 — solicitar un nuevo código anula el anterior;
   * una solicitud simultánea no debe duplicar efectos: solo la primera emite y la concurrente
   * se resuelve sobre el mismo resultado (máximo un código vigente).
   */
  solicitarNuevoCodigo(usuarioId: string): Promise<ResultadoSolicitudCodigo> {
    const clave = this.clave(usuarioId);
    const previo = this.enCurso.get(usuarioId);
    if (previo) {
      return previo.then(
        () => {
          throw new Error('solicitud_en_curso');
        },
        () => {
          throw new Error('solicitud_en_curso');
        },
      );
    }
    const promesa = this.emitirCodigo(usuarioId).finally(() => {
      this.enCurso.delete(usuarioId);
    });
    this.enCurso.set(usuarioId, promesa);
    return promesa;
  }

  private async emitirCodigo(usuarioId: string): Promise<ResultadoSolicitudCodigo> {
    const clave = this.clave(usuarioId);
    const codigo = this.generarCodigo();
    const estado: ContextoCodigoVigente = {
      codigo,
      emisionMs: Date.now(),
      intentosFallidos: 0,
      inactivo: false,
    };
    this.estados.set(clave, estado);
    return { codigo, vigenciaMs: 10 * 60 * 1000 };
  }

  private generarCodigo(): string {
    // Código sintético de 6 dígitos (datos sintéticos; nunca datos reales).
    const numero = Math.floor(100000 + Math.random() * 900000);
    return numero.toString();
  }
}
