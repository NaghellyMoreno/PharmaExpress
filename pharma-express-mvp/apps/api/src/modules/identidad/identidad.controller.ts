import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { IsBoolean, IsIn, IsString, Length, Matches } from 'class-validator';
import { COOKIE_NAVEGADOR, PacienteGuard } from '../../common/paciente.guard';
import { IdentidadService } from './identidad.service';

class SolicitarCodigoDto {
  @Matches(/^\d{5,12}$/) cedula!: string;
  @IsBoolean() acepta!: boolean;
}
class VerificarDto {
  @Matches(/^\d{5,12}$/) cedula!: string;
  @IsString() @Length(6, 6) codigo!: string;
  @IsIn(['TITULAR', 'TERCERO']) tipo!: 'TITULAR' | 'TERCERO';
}

@Controller('identidad')
export class IdentidadController {
  constructor(private s: IdentidadService) {}

  @Get('orientacion-eps')
  orientacion() {
    return this.s.orientacionEps();
  }

  @Post('codigo')
  codigo(@Body() b: SolicitarCodigoDto) {
    return this.s.solicitarCodigo(b.cedula, b.acepta);
  }

  @Post('verificar')
  verificar(@Body() b: VerificarDto, @Req() req: any) {
    return this.s.verificar(b.cedula, b.codigo, b.tipo, 'WEB', req.cookies[COOKIE_NAVEGADOR]);
  }

  @UseGuards(PacienteGuard)
  @Get('salud')
  async salud(@Req() req: any) {
    return { autorizada: await this.s.saludAutorizada(req.paciente.cedula) };
  }

  @UseGuards(PacienteGuard)
  @Post('salud')
  @HttpCode(204)
  autorizarSalud(@Req() req: any) {
    return this.s.autorizarSalud(req.paciente.cedula);
  }

  @UseGuards(PacienteGuard)
  @Post('revocar')
  @HttpCode(204)
  revocar(@Req() req: any) {
    return this.s.revocar(req.paciente.cedula);
  }
}
