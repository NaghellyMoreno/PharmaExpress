import { Global, Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { PacienteGuard } from './paciente.guard';
import { PrismaService } from './prisma.service';
import { RelojService } from './reloj.service';

@Global()
@Module({ providers: [PrismaService, RelojService, EventosService, PacienteGuard], exports: [PrismaService, RelojService, EventosService, PacienteGuard] })
export class CommonModule {}
