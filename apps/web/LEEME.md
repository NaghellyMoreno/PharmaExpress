# apps/web — PWA React + Vite

Este directorio lo construye **B3** (Interfaz web). Las pruebas E2E las escribe **S3** con Playwright y las ejecuta **B4**.

## Estructura prevista

```text
src/
├─ api/          cliente tipado de la API (nada de fetch suelto)
├─ componentes/  shadcn/ui
├─ pantallas/    sesión, prevalidación, reservar, mi reserva, dispensador
├─ formularios/  React Hook Form + Zod
└─ pwa/          manifest + service worker
```

## Reglas

- Ningún dato de salud en `localStorage`, `sessionStorage`, consola ni analítica.
- OCR local con Tesseract.js y pantalla de confirmación humana.
- Fórmulas manuscritas: fuera de alcance, con mensaje claro.
- QR con `qrcode`; lectura con `@zxing/browser`.
- `data-testid` acordados en los TC; no se modifican las pruebas de Playwright.
- Cookies httpOnly gestionadas por el backend.

Aún no hay código: lo crea B3 cuando el MVP esté aprobado y el flujo de API exista.
