/**
 * AC-36 / RNF-09: 50 confirmaciones simultáneas sobre 10 unidades → máximo 10 reservas y cero sobre-reservas.
 * Requiere PostgreSQL con el esquema aplicado y el seed cargado:
 *   docker compose up -d db && npm run db:push && npm run db:seed && npm run test:e2e
 */
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma.service';
import { AgendaService } from '../src/modules/agenda/agenda.service';

process.env.WORKERS = 'off';
process.env.TELEGRAM_POLLING = 'off';

describe('Reserva concurrente', () => {
  it('no hay sobre-reserva', async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    const app = mod.createNestApplication();
    await app.init();
    const prisma = app.get(PrismaService);
    const agenda = app.get(AgendaService);

    await prisma.punto.update({ where: { id: 'P2' }, data: { capacidad: 100, dias: [0, 1, 2, 3, 4, 5, 6], abre: 0, cierra: 24 } });
    await prisma.inventario.update({ where: { puntoId_medicamentoCodigo: { puntoId: 'P2', medicamentoCodigo: 'SAL100' } }, data: { existencias: 10 } });

    const intentos = await Promise.all(
      Array.from({ length: 50 }, async (_, i) => {
        const cedula = `99000${String(i).padStart(3, '0')}`;
        await prisma.simPacienteEps.upsert({ where: { cedula }, create: { cedula, nombre: `Prueba ${i}`, eps: 'Sanitas', afiliacionActiva: true, celular: null, correo: null }, update: {} });
        const s = await prisma.solicitud.create({
          data: { pacienteCedula: cedula, canal: 'WEB', creadaEn: new Date(), formulas: { create: { numero: `T-${i}`, tipo: 'AGUDO', estado: 'APTA', items: { create: { medicamentoCodigo: 'SAL100', cantidad: 1 } } } } },
          include: { formulas: { include: { items: true } } },
        });
        return { cedula, item: s.formulas[0].items[0].id };
      }),
    );
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setHours(10, 0, 0, 0);

    const resultados = await Promise.allSettled(
      intentos.map((x) => agenda.confirmar(x.cedula, [{ formulaItemId: x.item, puntoId: 'P2' }], { P2: manana.toISOString() })),
    );
    const ok = resultados.filter((r) => r.status === 'fulfilled').length;
    const inv = await prisma.inventario.findUniqueOrThrow({ where: { puntoId_medicamentoCodigo: { puntoId: 'P2', medicamentoCodigo: 'SAL100' } } });
    expect(ok).toBeLessThanOrEqual(10);
    expect(inv.existencias).toBeGreaterThanOrEqual(0);
    expect(ok + inv.existencias).toBe(10);
    await app.close();
  });
});
