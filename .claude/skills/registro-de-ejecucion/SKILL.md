---
name: registro-de-ejecucion
description: Formato del registro RUN-*.json para guardar resultados de pruebas con id, estado, duración y mensaje. Úsalo en B4 y R1 para dejar evidencia reproducible.
---
# Registro de ejecución

Cada ejecución deja un archivo en `qa/ejecuciones/RUN-<fecha>.json`. No se sobrescribe: si el nombre existe, agrega `_2`, `_3`.

## Formato

```json
{
  "run": "RUN-2026-11-05T14-30-00",
  "fecha": "2026-11-05T14:30:00-05:00",
  "modulo": "reservas",
  "entorno": "local | docker-compose | prueba",
  "commit": "abc1234",
  "comando": "npm test -- modulos/reservas",
  "duracion_ms": 48210,
  "resumen": {
    "total": 24,
    "verdes": 22,
    "rojas": 2,
    "omitidas": 0
  },
  "pruebas": [
    {
      "id": "AC-36 / TC-036",
      "estado": "verde",
      "duracion_ms": 3200,
      "mensaje": ""
    },
    {
      "id": "AC-31 / TC-001",
      "estado": "rojo",
      "duracion_ms": 180,
      "mensaje": "Expected true, received false"
    }
  ],
  "clasificacion": {
    "DEFECTO_CODIGO": 1,
    "PRUEBA_SOSPECHOSA": 1,
    "ENTORNO": 0
  },
  "escalados": ["AC-31 / TC-001 → PREG-004"]
}
```

## Reglas

1. `id` de prueba = `<AC> / <TC>: <descripción>` (el mismo nombre de la prueba).
2. `estado`: `verde`, `rojo`, `omitida`, `error`.
3. No inventes duraciones ni mensajes: cópialos de la salida real.
4. Un `RUN` por ejecución de suite; no mezcles módulos.
5. Enmascara cualquier dato personal o de salud que aparezca en el mensaje.
6. El registro es evidencia: no lo edites después para «mejorar» el resultado. Agrega uno nuevo.
7. En `qa/trazabilidad.md` usa el nombre del RUN, no el JSON completo.
