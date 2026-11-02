/**
 * Puerta de entrada del módulo `pre-dispensacion` (única API que consumen los demás módulos).
 * Orquesta OCR (servidor, sin enviar la imagen fuera del sistema) y la prevalidación de reglas.
 */

import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { extraerCamposFormula, extraerCamposHistoriaClinica } from '../dominio/ocr-extractor';
import { OcrServicio } from '../servicios/ocr.servicio';
import {
  PrevalidacionalServicio,
  ResultadoPrevalidacionSolicitud,
} from '../servicios/prevalidacional.servicio';

type TipoDocumento = 'formula' | 'historia';

interface DocumentoCargado {
  documentoId: string;
  tipo: TipoDocumento;
  canalId: string;
  pacienteCC: string;
  numeroPrescripcion?: string;
  medicamentos: string[];
  diagnostico?: string;
}

export interface ResultadoCargaDocumento {
  documentoId: string;
  legible: boolean;
  numeroPrescripcion?: string;
  medicamentos: string[];
  diagnostico?: string;
}

@Injectable()
export class PrevalidacionApi {
  private readonly documentos = new Map<string, DocumentoCargado>();

  constructor(
    private readonly ocr: OcrServicio,
    private readonly prevalidacion: PrevalidacionalServicio,
  ) {}

  /** RF-022 / RF-030 — lee el documento por OCR y devuelve los campos extraídos para la vista previa. */
  async subirDocumento(
    tipo: TipoDocumento,
    archivo: Buffer,
    canalId: string,
    pacienteCC: string,
  ): Promise<ResultadoCargaDocumento> {
    const textoCrudo = await this.ocr.leerImagen(archivo);
    const documentoId = randomUUID();

    if (tipo === 'formula') {
      const campos = extraerCamposFormula(textoCrudo);
      const legible = Boolean(campos.numeroPrescripcion) && campos.medicamentos.length > 0;
      this.documentos.set(documentoId, { documentoId, tipo, canalId, pacienteCC, ...campos });
      return { documentoId, legible, ...campos };
    }

    const campos = extraerCamposHistoriaClinica(textoCrudo);
    const legible = Boolean(campos.diagnostico);
    this.documentos.set(documentoId, { documentoId, tipo, canalId, pacienteCC, medicamentos: [], ...campos });
    return { documentoId, legible, medicamentos: [], ...campos };
  }

  /** RF-029 / RF-030 — el usuario solo confirma o rechaza la lectura; el rechazo cuenta como intento. */
  async confirmarDocumento(documentoId: string, accion: 'ACEPTAR' | 'RECHAZAR') {
    const resultado = await this.prevalidacion.procesarReintentoOCR({ documentoId, accion });
    if (accion === 'RECHAZAR' && resultado.agotado) {
      this.documentos.delete(documentoId);
    }
    return resultado;
  }

  /** RF-024 — reúne los documentos confirmados del canal/paciente y ejecuta la prevalidación. */
  async finalizarSolicitud(solicitudId: string, canalId: string, pacienteCC: string): Promise<ResultadoPrevalidacionSolicitud> {
    const documentosDelPaciente = [...this.documentos.values()].filter(
      (d) => d.canalId === canalId && d.pacienteCC === pacienteCC,
    );
    const formulas = documentosDelPaciente
      .filter((d) => d.tipo === 'formula')
      .map((d) => ({ numeroPrescripcion: d.numeroPrescripcion ?? '', medicamentos: d.medicamentos }));
    const historia = documentosDelPaciente.find((d) => d.tipo === 'historia');

    return this.prevalidacion.prevalidarSolicitud({
      solicitudId,
      cedulaPaciente: pacienteCC,
      formulas,
      historiaClinica: historia?.diagnostico ? { diagnostico: historia.diagnostico } : undefined,
    });
  }

  verificarLimpiezaAlmacenamiento(solicitudId: string) {
    return this.prevalidacion.verificarLimpiezaAlmacenamiento(solicitudId);
  }
}
