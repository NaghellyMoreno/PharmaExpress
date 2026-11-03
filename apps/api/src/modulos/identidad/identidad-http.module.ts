/**
 * Módulo HTTP mínimo de `identidad` para la pantalla de sesión de la web.
 *
 * Expone solo lo que no requiere las dependencias aún no resueltas de `IdentidadModule`
 * (EPS simulada y SMS/correo de `VerificacionIdentidadService`, ver PREG-082):
 * `ConsentimientoService` y `AutorizacionDatosSaludService` persisten en Postgres vía Prisma
 * (esquema `identidad`, ARQ-005/COMP-004). El resto del módulo (verificación de código,
 * revocación) queda pendiente de ese cableado, que no corresponde decidir aquí.
 */

import { Module } from '@nestjs/common';
import { PrismaService } from '../../comunes/prisma/prisma.service';
import { IdentidadController } from './api/identidad.controller';
import { IdentidadRepositorioAutorizaciones, IdentidadRepositorioConsentimientos } from './datos/identidad.repository';
import { REPO_AUTORIZACIONES, REPO_CONSENTIMIENTOS } from './datos/repositorios';
import { AutorizacionDatosSaludService } from './servicios/autorizacion-datos-salud.service';
import { ConsentimientoService } from './servicios/consentimiento.service';

@Module({
  controllers: [IdentidadController],
  providers: [
    PrismaService,
    ConsentimientoService,
    AutorizacionDatosSaludService,
    { provide: REPO_CONSENTIMIENTOS, useClass: IdentidadRepositorioConsentimientos },
    { provide: REPO_AUTORIZACIONES, useClass: IdentidadRepositorioAutorizaciones },
  ],
})
export class IdentidadHttpModule {}
