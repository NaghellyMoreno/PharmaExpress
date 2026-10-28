import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { NotificacionesModule } from './modules/notificaciones/notificaciones.module';
import { IdentidadModule } from './modules/identidad/identidad.module';
import { CanalesModule } from './modules/canales/canales.module';
import { PrevalidacionModule } from './modules/prevalidacion/prevalidacion.module';
import { AgendaModule } from './modules/agenda/agenda.module';
import { DispensacionModule } from './modules/dispensacion/dispensacion.module';
import { DatosSimuladosModule } from './modules/datos-simulados/datos-simulados.module';
import { AdminModule } from './modules/admin/admin.module';
import { TelegramModule } from './modules/telegram/telegram.module';

/** Monolito modular: un módulo por SPEC (propuesta tecnológica). */
@Module({
  imports: [
    CommonModule,
    NotificacionesModule, // SPEC-05
    IdentidadModule, // SPEC-01
    CanalesModule, // SPEC-02 y SPEC-07
    PrevalidacionModule, // SPEC-03
    AgendaModule, // SPEC-04
    DispensacionModule, // SPEC-06
    DatosSimuladosModule, // SPEC-08
    AdminModule,
    TelegramModule,
  ],
})
export class AppModule {}
