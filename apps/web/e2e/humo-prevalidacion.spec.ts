/**
 * Humo — pantalla de prevalidación (SPEC-003). Skill `plantilla-playwright-humo`.
 * Datos sintéticos únicamente (ver `fixtures/datos-sinteticos.ts`).
 */

import { test, expect } from '@playwright/test';
import { completarSesion } from './fixtures/flujo-sesion';
import { DATOS } from './fixtures/datos-sinteticos';

test('humo: sesión → cargar fórmula → OCR → confirmar → resultado preliminar apta', async ({ page }) => {
  await completarSesion(page);
  await page.getByTestId('btn-ir-prevalidacion').click();

  await page.getByTestId('btn-autorizar-datos-salud').click();

  await page.getByTestId('archivo-formula').setInputFiles(DATOS.formulaSintetica);
  await expect(page.getByTestId('vista-previa-ocr')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('ocr-numero-prescripcion')).toHaveText(DATOS.numeroFormula);

  await page.getByTestId('btn-confirmar-ocr').click();
  await page.getByTestId('btn-finalizar-solicitud').click();

  await expect(page.getByTestId('tarjeta-resultado')).toBeVisible();
  await expect(page.getByTestId(`resultado-${DATOS.numeroFormula}`)).toContainText('Apta');
});

test('humo: rechazar la lectura OCR contabiliza el intento y permite volver a cargar', async ({ page }) => {
  await completarSesion(page);
  await page.getByTestId('btn-ir-prevalidacion').click();
  await page.getByTestId('btn-autorizar-datos-salud').click();

  await page.getByTestId('archivo-formula').setInputFiles(DATOS.formulaSintetica);
  await expect(page.getByTestId('vista-previa-ocr')).toBeVisible({ timeout: 30_000 });

  await page.getByTestId('btn-rechazar-ocr').click();
  // RF-029: tras rechazar, la carga vuelve a estar disponible para un segundo intento.
  await expect(page.getByTestId('archivo-formula')).toBeVisible();
});
