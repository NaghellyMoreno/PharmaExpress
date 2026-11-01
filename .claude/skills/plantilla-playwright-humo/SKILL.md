---
name: plantilla-playwright-humo
description: Estructura de un recorrido de humo con Playwright para Pharma Express, con datos sintéticos, selectores data-testid y evidencia. Úsalo en R1 y en las pruebas E2E de S3.
---
# Plantilla Playwright — humo

## Estructura

```text
apps/web/e2e/
├─ humo-sesion.spec.ts
├─ humo-prevalidacion.spec.ts
├─ humo-reserva.spec.ts
├─ humo-dispensador.spec.ts
└─ fixtures/
   └─ datos-sinteticos.ts
```

## Recorrido mínimo

```ts
test('humo: sesión → prevalidar → reservar → ver QR', async ({ page }) => {
  await page.goto(process.env.URL_PRUEBA!);
  await page.getByTestId('cedula').fill(DATOS.cedula);
  await page.getByTestId('codigo').fill(DATOS.codigo);
  await page.getByTestId('btn-ingresar').click();

  await page.getByTestId('input-formula').setInputFiles(DATOS.formulaImpresora);
  await page.getByTestId('btn-prevalidar').click();
  await page.getByTestId('btn-confirmar-medicamentos').click();

  await page.getByTestId('btn-reservar').click();
  await expect(page.getByTestId('qr-reserva')).toBeVisible();

  await page.screenshot({ path: `qa/humo/evidencia/${Date.now()}-reserva.png` });
});
```

## Reglas

1. Solo datos sintéticos del entorno de prueba.
2. Selectores por `data-testid` acordados en el TC; no por texto visible.
3. No accedas a la base de datos de producción.
4. Si un paso falla, captura pantalla + log y continúa con el siguiente camino.
5. Verifica que el segundo escaneo del QR sea rechazado.
6. Verifica que ningún texto visible ni log contenga medicamentos, diagnósticos o cédulas.
7. No modifiques las pruebas para que pasen: si el selector no existe, es un defecto o una PREG.

## Evidencia

- Captura por camino.
- Log o respuesta HTTP cuando falle.
- Enmascara datos personales antes de guardar la evidencia.
