/**
 * Jest de Pharma Express (skill `plantilla-jest-nestjs`).
 *
 * - unidad:      dominio.spec.ts y servicios.spec.ts — sin Docker.
 * - integracion: integracion.spec.ts y concurrencia.spec.ts — Testcontainers (requiere Docker).
 *
 * Ejecutar un módulo:   npm test -- src/modulos/identidad
 * Solo unidad:          npm run test:unidad
 */
const base = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/../tsconfig.json' }] },
};

module.exports = {
  projects: [
    {
      ...base,
      displayName: 'unidad',
      testMatch: ['**/pruebas/**/*.spec.ts'],
      testPathIgnorePatterns: ['integracion\\.spec\\.ts$', 'concurrencia\\.spec\\.ts$'],
    },
    {
      ...base,
      displayName: 'integracion',
      testMatch: ['**/pruebas/integracion.spec.ts', '**/pruebas/concurrencia.spec.ts'],
      testTimeout: 120000,
    },
  ],
};
