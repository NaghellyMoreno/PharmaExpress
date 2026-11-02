/**
 * Módulo HTTP mínimo de `identidad` para la pantalla de sesión de la web.
 *
 * Expone solo lo que no requiere las dependencias aún no resueltas de `IdentidadModule`
 * (EPS simulada, SMS/correo y Prisma de `VerificacionIdentidadService`/`IdentidadRepository`,
 * ver `IdentidadApi`): `ConsentimientoService` y `AutorizacionDatosSaludService` no dependen
 * de nada externo. El resto del módulo (verificación de código, revocación) queda pendiente
 * de ese cableado, que no corresponde decidir aquí.
 */

import { Module } from '@nestjs/common';
import { IdentidadController } from './api/identidad.controller';
import { AutorizacionDatosSaludService } from './servicios/autorizacion-datos-salud.service';
import { ConsentimientoService } from './servicios/consentimiento.service';

@Module({
  controllers: [IdentidadController],
  providers: [ConsentimientoService, AutorizacionDatosSaludService],
})
export class IdentidadHttpModule {}
