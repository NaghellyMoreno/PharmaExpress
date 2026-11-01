---
name: componentes-shadcn
description: Reglas de composición de pantallas con Tailwind + shadcn/ui, estados vacíos/carga/error, accesibilidad y data-testid. Úsalo en B3.
---
# Componentes shadcn/ui

## Composición

- Una pantalla = un componente de página en `src/pantallas/`.
- Los bloques reutilizables van en `src/componentes/`.
- Usa los componentes de shadcn/ui sin reescribir su comportamiento.
- No mezcles lógica de API en componentes de presentación: pásale datos y callbacks.

## Estados obligatorios

Cada pantalla que consume la API debe tener:

- **Carga**: skeleton o spinner accesible.
- **Vacío**: mensaje claro y acción siguiente.
- **Error**: mensaje con plantilla fija y opción de reintentar.
- **Éxito**: confirmación visible.

## Accesibilidad

- Navegación por teclado.
- `label` asociado a cada campo.
- Foco visible.
- `aria-live` para mensajes de estado.
- Contraste suficiente.

## data-testid

- Usa los acuerdos del TC/Playwright: `data-testid="btn-reservar"`, `data-testid="qr-reserva"`.
- No cambies un `data-testid` existente sin actualizar el TC (y eso lo decide QA).
- No uses el texto visible como selector si hay un `data-testid`.

## Datos de salud

- No muestres medicamentos fuera de la pantalla de confirmación de OCR.
- No guardes ni registres datos de salud en el navegador.
- Los mensajes de error no nombran medicamentos ni diagnósticos.
