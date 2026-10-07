"""Motor común de los agentes de Pharma Express.

Cada módulo tiene una sola responsabilidad:

- rutas.py        carpetas del proyecto
- errores.py      errores que el programa muestra al usuario en una línea
- agentes.py      lista y carga los agentes (config.json + prompt.md + contexto)
- proveedores.py  proveedores compatibles con la API de OpenAI y sus clientes
- intentos.py     orden de modelos a probar (principal + respaldos)
- mensajes.py     mensajes que se envían al modelo (petición + adjuntos)
- ejecutor.py     llama al modelo y pasa al siguiente si falla
- salidas/        formas de guardar la respuesta (simple o por SPEC)
- cli.py          línea de comandos: une todas las piezas
"""
