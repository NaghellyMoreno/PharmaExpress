/**
 * Controlador HTTP del módulo `pre-dispensacion` para la pantalla de prevalidación (SPEC-003).
 * No contiene reglas de negocio: delega en `PrevalidacionApi`. DTO + Zod en el borde.
 * Límites técnicos (ARQ-005/ADR-002, DEC-P74): 10 MB por archivo, solo JPG/PNG en este MVP.
 */

import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { z } from 'zod';
import { PrevalidacionApi } from './prevalidacion.api';

const TAMANO_MAXIMO_BYTES = 10 * 1024 * 1024; // DEC-P74
const FORMATOS_PERMITIDOS = new Set(['image/jpeg', 'image/png']);

const SubirDocumentoDto = z.object({
  tipo: z.enum(['formula', 'historia']),
  canalId: z.string().min(1),
  cedula: z.string().min(1),
});

const ConfirmarDocumentoDto = z.object({
  accion: z.enum(['ACEPTAR', 'RECHAZAR']),
});

const FinalizarSolicitudDto = z.object({
  canalId: z.string().min(1),
  cedula: z.string().min(1),
});

@Controller('prevalidacion')
export class PrevalidacionController {
  constructor(private readonly prevalidacionApi: PrevalidacionApi) {}

  @Post('documentos')
  @UseInterceptors(FileInterceptor('archivo'))
  async subirDocumento(@UploadedFile() archivo: { buffer: Buffer; mimetype: string; size: number } | undefined, @Body() body: unknown) {
    const dto = SubirDocumentoDto.safeParse(body);
    if (!dto.success) {
      throw new BadRequestException('datos_invalidos');
    }
    if (!archivo) {
      throw new BadRequestException('archivo_requerido');
    }
    // BR-009/AC-056/DEC-P74: un archivo fuera de formato o de tamaño se rechaza antes de leerlo.
    if (!FORMATOS_PERMITIDOS.has(archivo.mimetype) || archivo.size > TAMANO_MAXIMO_BYTES) {
      throw new BadRequestException('formato_o_tamano_no_permitido');
    }
    return this.prevalidacionApi.subirDocumento(dto.data.tipo, archivo.buffer, dto.data.canalId, dto.data.cedula);
  }

  @Post('documentos/:documentoId/confirmar')
  async confirmarDocumento(@Param('documentoId') documentoId: string, @Body() body: unknown) {
    const dto = ConfirmarDocumentoDto.safeParse(body);
    if (!dto.success) {
      throw new BadRequestException('datos_invalidos');
    }
    return this.prevalidacionApi.confirmarDocumento(documentoId, dto.data.accion);
  }

  @Post('solicitudes/finalizar')
  async finalizarSolicitud(@Body() body: unknown) {
    const dto = FinalizarSolicitudDto.safeParse(body);
    if (!dto.success) {
      throw new BadRequestException('datos_invalidos');
    }
    const solicitudId = `${dto.data.canalId}:${dto.data.cedula}:${Date.now()}`;
    return this.prevalidacionApi.finalizarSolicitud(solicitudId, dto.data.canalId, dto.data.cedula);
  }
}
