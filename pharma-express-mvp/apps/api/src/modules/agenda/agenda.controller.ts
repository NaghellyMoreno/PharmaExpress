import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';
import { PacienteGuard } from '../../common/paciente.guard';
import { AgendaService } from './agenda.service';

class AsignacionDto {
  @IsString() formulaItemId!: string;
  @IsString() puntoId!: string;
}
class VentanasDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => AsignacionDto) asignacion!: AsignacionDto[];
}
class ConfirmarDto extends VentanasDto {
  @IsObject() ventanas!: Record<string, string>;
}

@UseGuards(PacienteGuard)
@Controller('agenda')
export class AgendaController {
  constructor(private s: AgendaService) {}

  @Get('disponibilidad')
  disponibilidad(@Req() req: any, @Query('solicitudId') solicitudId: string) {
    return this.s.disponibilidad(req.paciente.cedula, solicitudId);
  }

  @Post('ventanas')
  @HttpCode(200)
  ventanas(@Req() req: any, @Body() b: VentanasDto) {
    return this.s.ventanas(req.paciente.cedula, b.asignacion);
  }

  @Post('confirmar')
  confirmar(@Req() req: any, @Body() b: ConfirmarDto) {
    return this.s.confirmar(req.paciente.cedula, b.asignacion, b.ventanas);
  }

  @Post('citas/:id/cancelar')
  @HttpCode(204)
  async cancelar(@Req() req: any, @Param('id') id: string) {
    await this.s.terminarCita(id, 'CANCELADA', req.paciente.cedula);
  }
}
