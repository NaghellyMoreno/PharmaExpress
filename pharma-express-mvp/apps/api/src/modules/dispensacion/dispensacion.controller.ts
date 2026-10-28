import { Body, CanActivate, Controller, ExecutionContext, Injectable, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Cierre, DispensacionService } from './dispensacion.service';

/** RNF-07, BR-33: solo un dispensador autenticado con su rol. */
@Injectable()
export class DispensadorGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const [tipo, token] = String(req.headers.authorization ?? '').split(' ');
    if (tipo !== 'Bearer' || !token) throw new UnauthorizedException('Ingresa como dispensador.');
    try {
      req.dispensador = await this.jwt.verifyAsync(token);
      return true;
    } catch {
      throw new UnauthorizedException('Sesión de dispensador no válida.');
    }
  }
}

class LoginDto {
  @IsString() usuario!: string;
  @IsString() clave!: string;
}
class ValidarDto {
  @IsString() codigo!: string;
}
class CierreDto implements Cierre {
  @IsString() citaItemId!: string;
  @IsIn(['ENTREGADO', 'NO_ENTREGADO']) resultado!: 'ENTREGADO' | 'NO_ENTREGADO';
  @IsOptional() @IsString() motivo?: string;
  @IsOptional() @IsString() descripcion?: string;
}
class CerrarDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => CierreDto) items!: CierreDto[];
}

@Controller('dispensacion')
export class DispensacionController {
  constructor(private s: DispensacionService) {}

  @Post('login')
  login(@Body() b: LoginDto) {
    return this.s.login(b.usuario, b.clave);
  }

  @UseGuards(DispensadorGuard)
  @Post('validar')
  validar(@Req() req: any, @Body() b: ValidarDto) {
    return this.s.validar(b.codigo, req.dispensador.puntoId);
  }

  @UseGuards(DispensadorGuard)
  @Post('citas/:id/cerrar')
  cerrar(@Req() req: any, @Param('id') id: string, @Body() b: CerrarDto) {
    return this.s.cerrar(id, req.dispensador.puntoId, req.dispensador.sub, b.items);
  }
}
