import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Controller('catalogos')
export class CatalogosController {
  constructor(private prisma: PrismaService) {}
  @Get('puntos')
  puntos() {
    return this.prisma.punto.findMany({ select: { id: true, nombre: true, dias: true, abre: true, cierra: true } });
  }
  /** Solo para la demostración: cédulas y números de fórmula de prueba (datos ficticios). */
  @Get('casos-prueba')
  async casos() {
    if (process.env.NODE_ENV === 'production') return [];
    return this.prisma.simPacienteEps.findMany({ select: { cedula: true, nombre: true, formulas: { select: { numero: true } } } });
  }
}
