import { Page, expect } from '@playwright/test';
import { DATOS } from './datos-sinteticos';

/** Completa el recorrido de sesión (aviso → cédula → código) y deja la página en /prevalidacion. */
export async function completarSesion(page: Page): Promise<void> {
  await page.goto('/sesion');
  await page.getByTestId('btn-aceptar-aviso').click();

  await page.getByTestId('campo-cedula').fill(DATOS.cedula);
  await page.getByTestId('btn-enviar-cedula').click();

  const canalId = await page.evaluate(() => localStorage.getItem('pharma-express:canalId'));
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:3001';
  const respuesta = await page.request.get(`${apiUrl}/canales/codigo/prueba/${canalId}/${DATOS.cedula}`);
  const { codigo } = await respuesta.json();
  expect(codigo).toBeTruthy();

  await page.getByTestId('campo-codigo').fill(codigo);
  await page.getByTestId('btn-confirmar-codigo').click();
  await expect(page.getByTestId('tarjeta-vinculado')).toBeVisible();
}
