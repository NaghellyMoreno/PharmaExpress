/**
 * Pruebas de integración — módulo `canales` contra PostgreSQL real (Testcontainers).
 *
 * Verifica que la vinculación (el estado de membresía de 3 meses, SPEC-002/BR-005) sobrevive
 * a una nueva instancia del servicio, lo que una implementación en memoria no puede demostrar.
 */

import { execSync } from 'child_process';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PrismaClient } from '@prisma/client';
import { CanalesServicio } from '../servicios/canales.servicio';
import { CanalesRepositorioVinculaciones } from '../datos/canales.repository';
import { SimulacionApi } from '../../simulacion/api/simulacion.api';
import { SimulacionService } from '../../simulacion/servicios/simulacion.service';

describe('Integración — módulo canales contra Postgres real', () => {
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

  it('AC-009/BR-005: la vinculación creada por una instancia la ve una instancia nueva del servicio', async () => {
    const simulacionApi = new SimulacionApi(new SimulacionService());
    const repositorio = new CanalesRepositorioVinculaciones(prisma as never);

    const primeraInstancia = new CanalesServicio(simulacionApi, repositorio);
    await primeraInstancia.sembrarVinculacionDePrueba('canal-integracion', '8.765.432-1', '2026-10-01');

    // Nueva instancia del servicio (simula un reinicio del proceso): debe leer de Postgres.
    const segundaInstancia = new CanalesServicio(simulacionApi, repositorio);
    const pacientes = await segundaInstancia.obtenerPacientesVinculados('canal-integracion', new Date('2026-11-02T15:00:00Z'));

    expect(pacientes).toHaveLength(1);
    expect(pacientes[0]).toMatchObject({ pacienteCC: '8.765.432-1', vigente: true });

    const registroDb = await prisma.vinculacion.findMany({ where: { canalId: 'canal-integracion' } });
    expect(registroDb).toHaveLength(1);
  });
});
