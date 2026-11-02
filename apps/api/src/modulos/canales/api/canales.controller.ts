/**
 * Controlador HTTP del módulo `canales` para la pantalla de sesión de la web (SPEC-002).
 * No contiene reglas de negocio: delega en `api/CanalesApi`. DTO + Zod en el borde.
 */

import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { z } from 'zod';
import { CanalesApi } from './canales.api';

const CedulaDto = z.object({
  canalId: z.string().min(1),
  cedula: z.string().min(1),
});

const ConfirmarCodigoDto = CedulaDto.extend({
  codigo: z.string().regex(/^\d{6}$/),
});

@Controller('canales')
export class CanalesController {
  constructor(private readonly canalesApi: CanalesApi) {}

  @Post('codigo/solicitar')
  async solicitarCodigo(@Body() body: unknown) {
    const dto = CedulaDto.safeParse(body);
    if (!dto.success) {
      throw new BadRequestException('datos_invalidos');
    }
    return this.canalesApi.solicitarCodigoVinculacion(dto.data.canalId, dto.data.cedula);
  }

  @Post('vinculacion/confirmar')
  async confirmarVinculacion(@Body() body: unknown) {
    const dto = ConfirmarCodigoDto.safeParse(body);
    if (!dto.success) {
      throw new BadRequestException('datos_invalidos');
    }
    return this.canalesApi.confirmarVinculacion(dto.data.canalId, dto.data.cedula, dto.data.codigo);
  }

  @Post('revalidacion/confirmar')
  async confirmarRevalidacion(@Body() body: unknown) {
    const dto = ConfirmarCodigoDto.safeParse(body);
    if (!dto.success) {
      throw new BadRequestException('datos_invalidos');
    }
    return this.canalesApi.confirmarRevalidacion(dto.data.canalId, dto.data.cedula, dto.data.codigo);
  }

  @Get('acceso/:canalId/:cedula')
  async validarAcceso(@Param('canalId') canalId: string, @Param('cedula') cedula: string) {
    return this.canalesApi.validarAccesoMiniApp(canalId, cedula);
  }

  @Get('pacientes/:canalId')
  async obtenerPacientes(@Param('canalId') canalId: string) {
    return this.canalesApi.obtenerPacientesVinculados(canalId);
  }
}
