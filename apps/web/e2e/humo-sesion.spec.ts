/**
 * Humo — pantalla de sesión (SPEC-001/SPEC-002). Skill `plantilla-playwright-humo`.
 * Datos sintéticos únicamente (ver `fixtures/datos-sinteticos.ts`).
 */

import { test, expect } from '@playwright/test';
import { completarSesion } from './fixtures/flujo-sesion';

test('humo: aviso de privacidad → cédula → código → identidad verificada', async ({ page }) => {
  await completarSesion(page);
  await expect(page.getByTestId('btn-ir-prevalidacion')).toBeVisible();
});

test('humo: ningún texto visible de la pantalla de sesión nombra medicamentos, diagnósticos o cédulas en claro', async ({ page }) => {
  await completarSesion(page);
  const texto = await page.locator('body').innerText();
  expect(texto.toLowerCase()).not.toContain('medicamento');
  expect(texto.toLowerCase()).not.toContain('diagnóstico');
});
