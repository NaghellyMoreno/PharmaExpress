/**
 * Controlador HTTP del módulo `identidad` para la pantalla de sesión de la web (SPEC-001).
 * No contiene reglas de negocio: delega en `servicios/`. DTO + Zod en el borde.
 */

import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { AutorizacionDatosSaludService } from '../servicios/autorizacion-datos-salud.service';
import { ConsentimientoService } from '../servicios/consentimiento.service';

const AceptarAvisoDto = z.object({
  solicitudId: z.string().min(1),
  condicion: z.enum(['titular', 'tercero']),
  canal: z.enum(['web', 'telegram']),
});

const AutorizacionDatosSaludDto = z.object({
  solicitudId: z.string().min(1),
  autorizada: z.boolean(),
});

@Controller('identidad')
export class IdentidadController {
  constructor(
    private readonly consentimiento: ConsentimientoService,
    private readonly autorizacion: AutorizacionDatosSaludService,
  ) {}

  @Post('aviso-privacidad/aceptar')
  async aceptarAviso(@Body() body: unknown) {
    const dto = AceptarAvisoDto.safeParse(body);
    if (!dto.success) {
      throw new BadRequestException('datos_invalidos');
    }
    const fecha = new Date().toISOString();
    return this.consentimiento.aceptar(dto.data.solicitudId, dto.data.condicion, fecha, dto.data.canal);
  }

  @Post('aviso-privacidad/rechazar')
  async rechazarAviso(@Body() body: unknown) {
    const dto = z.object({ solicitudId: z.string().min(1) }).safeParse(body);
    if (!dto.success) {
      throw new BadRequestException('datos_invalidos');
    }
    return this.consentimiento.rechazar(dto.data.solicitudId);
  }

  @Post('autorizacion-datos-salud')
  async autorizarDatosSalud(@Body() body: unknown) {
    const dto = AutorizacionDatosSaludDto.safeParse(body);
    if (!dto.success) {
      throw new BadRequestException('datos_invalidos');
    }
    await this.autorizacion.registrarAutorizacion(dto.data.solicitudId, dto.data.autorizada);
    return { ok: true };
  }
}
