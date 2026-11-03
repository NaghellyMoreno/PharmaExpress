/**
 * Datos sintéticos para los recorridos de humo (skill `plantilla-playwright-humo`).
 * Coinciden con la semilla de `apps/api/src/modulos/simulacion/datos/eps-simulada.fixture.ts`.
 */

import { fileURLToPath } from 'url';

const directorio = fileURLToPath(new URL('.', import.meta.url));

export const DATOS = {
  cedula: '123456789',
  numeroFormula: '11111111111111111111',
  formulaSintetica: `${directorio}formula-sintetica.png`,
};
