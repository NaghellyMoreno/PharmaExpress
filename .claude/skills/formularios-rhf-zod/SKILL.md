---
name: formularios-rhf-zod
description: Patrón de formularios con React Hook Form + Zod, con los mismos límites del backend y mensajes sin datos de salud. Úsalo en B3.
---
# Formularios RHF + Zod

## Reglas

1. El esquema Zod vive junto al formulario y replica **los mismos límites del backend**: código de 6 dígitos, cédula, cantidades, fechas.
2. No inventes validaciones que el backend no tenga; si el backend no las tiene, es una PREG.
3. Los mensajes de error son plantillas fijas y no nombran medicamentos, diagnósticos ni cédulas.
4. No registres el valor de los campos en consola ni analítica.
5. No guardes datos de salud en `localStorage`.
6. El botón de envío se deshabilita mientras se envía y muestra el error del servidor.

## Ejemplo

```ts
const esquemaCodigo = z.object({
  cedula: z.string().regex(/^\d{6,10}$/, 'Revisa el número de cédula.'),
  codigo: z.string().regex(/^\d{6}$/, 'El código debe tener 6 dígitos.'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(esquemaCodigo),
});
```

## Verificación

- Los límites coinciden con la SPEC y con el DTO del backend.
- Los mensajes no contienen datos de salud.
- El formulario es usable con teclado y lector de pantalla.
- El error del servidor se muestra sin volcar el cuerpo completo.
