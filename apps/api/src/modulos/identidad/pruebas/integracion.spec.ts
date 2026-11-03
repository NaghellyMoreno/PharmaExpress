/**
 * Pruebas de integración — módulo `identidad` contra PostgreSQL real (Testcontainers).
 *
 * Verifica que `ConsentimientoService` y `AutorizacionDatosSaludService` persisten de verdad:
 * una segunda instancia del servicio, contra el mismo Prisma Client, ve lo que escribió la
 * primera (lo que una instancia en memoria nunca podría demostrar). Esto es lo que exige el
 * DoD de `CLAUDE.md` (`docker compose up` + una prueba real) y lo que faltaba desde H-007 del
 * incidente `qa/incidentes/INC-20261031-001-identidad-v0.md` («no hay persistencia»).
 */

import { execSync } from 'child_process';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PrismaClient } from '@prisma/client';
import { AutorizacionDatosSaludService } from '../servicios/autorizacion-datos-salud.service';
import { ConsentimientoService } from '../servicios/consentimiento.service';
import { IdentidadRepositorioAutorizaciones, IdentidadRepositorioConsentimientos } from '../datos/identidad.repository';

describe('Integración — módulo identidad contra Postgres real', () => {
  let container: StartedPostgreSqlContainer;
  let prisma: PrismaClient;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine').start();
    const databaseUrl = container.getConnectionUri();
    const apiDir = `${__dirname}/../../../..`;
    execSync(`node "${apiDir}/node_modules/prisma/build/index.js" db push --skip-generate`, {
      cwd: apiDir,
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: 'pipe',
    });
    prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
    await prisma.$connect();
  }, 120_000);

  afterAll(async () => {
    await prisma?.$disconnect();
    await container?.stop();
  });

  it('AC-005/TC-005: la autorización de datos de salud sobrevive a una nueva instancia del servicio (persistencia real)', async () => {
    const repositorio = new IdentidadRepositorioAutorizaciones(prisma as never);
    const primeraInstancia = new AutorizacionDatosSaludService(repositorio);
    await primeraInstancia.registrarAutorizacion('solicitud-integracion-1', true);

    // Nueva instancia del servicio (simula un reinicio del proceso): debe leer de Postgres, no de memoria.
    const segundaInstancia = new AutorizacionDatosSaludService(repositorio);
    await expect(segundaInstancia.puedeCargar('solicitud-integracion-1')).resolves.toBe(true);
  });

  it('AC-006/TC-003: el consentimiento aceptado queda registrado en la tabla `identidad.Consentimiento`', async () => {
    const repositorio = new IdentidadRepositorioConsentimientos(prisma as never);
    const servicio = new ConsentimientoService(repositorio);
    await servicio.aceptar('solicitud-integracion-2', 'titular', '2026-11-02T10:00:00-05:00', 'web');

    const registros = await prisma.consentimiento.findMany({ where: { solicitudId: 'solicitud-integracion-2' } });
    expect(registros).toHaveLength(1);
    expect(registros[0]).toMatchObject({ condicion: 'titular', canal: 'web' });
  });
});
