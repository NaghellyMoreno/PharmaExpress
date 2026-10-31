/**
 * Pruebas de concurrencia — módulo identidad (QA shift-left, S3).
 *
 * Caso fuente: TC-013 de `qa/casos/` (S2: «Solicitar un nuevo código anula el
 * anterior; la solicitud simultánea deja solo el último vigente», veredicto S1:
 * APTA). Oráculo: definitivo (DEC-07, DEC-11 / contexto de la SPEC-001 v1.1).
 * Estado: ROJA por «no implementado». La gestión de códigos concurrente del
 * módulo `identidad` no existe aún (implementación B1/B4).
 *
 * Base de datos y concurrencia: Jest + Testcontainers con PostgreSQL real,
 * como pide el skill `plantilla-jest-nestjs` y la regla dura del corte técnico
 * (`docs/mvp.md`: SMS/correo en plan de prueba, datos de salud nunca simulados).
 */

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { SolicitudCodigoService } from '../../servicios';

describe('Concurrencia — módulo identidad', () => {
  let container: StartedPostgreSqlContainer;

  beforeAll(async () => {
    // PostgreSQL real vía Testcontainers para la concurrencia del módulo identidad.
    container = await new PostgreSqlContainer().start();
  }, 60_000);

  afterAll(async () => {
    await container.stop();
  });

  it('AC-003 / TC-013: dos solicitudes simultáneas de nuevo código dejan solo el último vigente', async () => {
    const servicio = new SolicitudCodigoService();
    const resultados = await Promise.allSettled([
      servicio.solicitarNuevoCodigo('usuario-1'),
      servicio.solicitarNuevoCodigo('usuario-1'),
    ]);
    const confirmadas = resultados.filter((resultado) => resultado.status === 'fulfilled');
    // Máximo 1 código vigente: solo la última solicitud simultánea puede confirmarse.
    expect(confirmadas).toHaveLength(1);
  });
});
