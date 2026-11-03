import { Module } from '@nestjs/common';
import { PrismaService } from '../../comunes/prisma/prisma.service';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { SimulacionModule } from '../simulacion/simulacion.module';
import { CanalesApi } from './api/canales.api';
import { CanalesController } from './api/canales.controller';
import {
  CanalesRepositorioAvisos,
  CanalesRepositorioIntentosArchivoChat,
  CanalesRepositorioVinculaciones,
} from './datos/canales.repository';
import { REPO_AVISOS_CANAL, REPO_INTENTOS_ARCHIVO_CHAT, REPO_VINCULACIONES } from './datos/repositorios';
import { CanalesServicio } from './servicios/canales.servicio';

@Module({
  imports: [SimulacionModule, NotificacionesModule],
  controllers: [CanalesController],
  providers: [
    PrismaService,
    CanalesServicio,
    CanalesApi,
    { provide: REPO_VINCULACIONES, useClass: CanalesRepositorioVinculaciones },
    { provide: REPO_AVISOS_CANAL, useClass: CanalesRepositorioAvisos },
    { provide: REPO_INTENTOS_ARCHIVO_CHAT, useClass: CanalesRepositorioIntentosArchivoChat },
  ],
  exports: [CanalesApi],
})
export class CanalesModule {}
