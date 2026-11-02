/**
 * Servicio de OCR — módulo `pre-dispensacion` (SPEC-003 / RF-022, ARQ-005/COMP-003).
 *
 * Procesamiento en el servidor con Tesseract.js (sin enviar la imagen fuera del sistema).
 * La conversión de PDF a imagen (ADR-002) queda fuera de este MVP: solo admite JPG/PNG.
 */

import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';

@Injectable()
export class OcrServicio {
  async leerImagen(buffer: Buffer): Promise<string> {
    const worker = await createWorker('spa');
    try {
      const { data } = await worker.recognize(buffer);
      return data.text;
    } finally {
      await worker.terminate();
    }
  }
}
