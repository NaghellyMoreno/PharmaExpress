# AGENTS.md — Architecture Agent

## 1. Propósito

Este repositorio implementa de forma incremental un **Architecture Agent** dentro de un flujo de **Spec-Driven Development**.

La pregunta central del agente es:

> **¿Cómo debemos estructurar técnicamente el sistema para satisfacer la especificación, sus restricciones y sus atributos de calidad?**

El Architecture Agent debe convertir contexto aprobado, requisitos, restricciones y atributos de calidad en una **propuesta arquitectónica justificable, trazable y revisable por humanos**.

Principio obligatorio:

> **IA propone → humano decide → equipo valida.**

Codex actúa como asistente de ingeniería para construir y refinar este agente. Codex **no reemplaza la decisión humana** y no debe convertir recomendaciones del LLM en decisiones aprobadas.

---

## 2. Fuente de verdad

La referencia principal para el comportamiento esperado del agente es:

- `Guia - Architecture Agent.pdf`

Cuando una tarea de implementación contradiga esta guía, Codex debe:

1. señalar la contradicción;
2. explicar su impacto;
3. no resolverla inventando reglas;
4. aplicar la guía salvo que exista una decisión humana explícita que la reemplace.

No usar conocimiento general para reemplazar silenciosamente lo definido por la guía.

---

## 3. Posición del Architecture Agent

Flujo conceptual:

```text
HUMANO
  ↓
Specification Agent
  ↓
SPEC / CONTEXTO APROBADO
  ↓
Architecture Agent
  ↓
ARQUITECTURA + ADR
  ↓
Planning Agent
  ↓
IMPLEMENTATION PLAN
  ↓
Coding Agent
  ↓
CÓDIGO
  ↓
QA Agent
  ↓
VERIFICACIÓN
```

El Architecture Agent se ocupa de **cómo estructurar técnicamente el sistema**.

No debe asumir responsabilidades del Specification Agent, Planning Agent, Coding Agent o QA Agent.

---

## 4. Objetivo actual del repositorio

La implementación debe evolucionar de manera incremental.

### Estado objetivo actual: V0.1 / V0.x

La versión actual debe mantenerse deliberadamente simple.

Debe poder:

1. recibir uno o más archivos Markdown;
2. conservar la fuente de cada fragmento;
3. analizar si existe contexto suficiente;
4. identificar Architecture Drivers;
5. identificar restricciones y atributos de calidad relevantes;
6. proponer un máximo inicial de tres alternativas pertinentes;
7. comparar alternativas usando criterios explícitos;
8. recomendar una alternativa de forma justificada;
9. identificar riesgos, supuestos y preguntas abiertas;
10. generar un ADR en estado `PROPOSED`;
11. producir salida JSON y Markdown;
12. exigir validación humana.

La V0.x **no tiene que implementar todavía todo el Architecture Package de la guía**.

Los elementos restantes se incorporarán únicamente cuando exista una necesidad concreta y validada.

---

## 5. Entrada esperada

La guía recomienda una **SPEC aprobada y congelada** como entrada.

Mientras el proyecto no disponga de una SPEC única congelada, la V0.x puede aceptar documentos equivalentes aprobados, por ejemplo:

- problema y contexto;
- objetivo;
- alcance y fuera de alcance;
- actores;
- requisitos funcionales;
- requisitos no funcionales;
- reglas de negocio;
- flujos principales y alternativos;
- casos límite;
- criterios de aceptación;
- dependencias;
- restricciones;
- integraciones conocidas;
- decisiones aprobadas.

La ausencia de una sección no autoriza al agente a inventarla.

Si falta información cuya respuesta podría cambiar materialmente una decisión arquitectónica, el agente debe responder:

```text
NEEDS_INFORMATION
```

y formular únicamente las preguntas necesarias.

### Regla de preguntas

No crear cuestionarios extensos.

Una pregunta solo es válida si su respuesta puede cambiar de forma material:

- la estructura;
- los límites;
- las integraciones;
- los atributos de calidad;
- una restricción;
- una alternativa;
- la decisión arquitectónica.

---

## 6. Responsabilidades del Architecture Agent

El agente debe poder, según el nivel de madurez implementado:

- analizar la especificación o contexto aprobado;
- identificar Architecture Drivers;
- distinguir drivers de restricciones;
- identificar atributos de calidad relevantes;
- proponer alternativas arquitectónicas pertinentes;
- comparar alternativas con criterios explícitos;
- recomendar la alternativa más adecuada al contexto;
- documentar decisiones mediante ADR;
- definir, cuando corresponda, componentes, módulos, límites y responsabilidades;
- definir integraciones y flujos técnicos principales;
- identificar riesgos técnicos;
- identificar supuestos;
- identificar dependencias externas;
- registrar decisiones pendientes;
- mantener trazabilidad.

---

## 7. Architecture Drivers

Un Architecture Driver es un requisito, restricción o atributo de calidad con influencia significativa sobre la estructura de la solución.

El agente debe evaluar solo los drivers que estén respaldados por el contexto.

Posibles categorías:

- seguridad;
- rendimiento;
- disponibilidad;
- escalabilidad;
- mantenibilidad;
- modificabilidad;
- testabilidad;
- interoperabilidad;
- observabilidad;
- fiabilidad.

La lista no es un checklist obligatorio.

No inventar un driver solo porque exista en esta lista.

Cada driver debe tener evidencia trazable a una fuente de entrada.

Ejemplo conceptual:

```json
{
  "name": "consistencia de reservas",
  "evidence": [
    {
      "source": "requirements.md",
      "detail": "No se permiten sobre-reservas."
    }
  ],
  "impact": "La confirmación de reservas requiere consistencia transaccional."
}
```

---

## 8. Restricciones arquitectónicas

El agente debe distinguir entre:

### Driver

Ejemplo:

```text
Alta mantenibilidad.
```

### Restricción

Ejemplo:

```text
Tiempo de desarrollo de ocho semanas.
```

Posibles restricciones:

- infraestructura existente;
- tecnología exigida;
- presupuesto;
- plazo;
- API institucional obligatoria;
- decisiones previamente aprobadas;
- límites del equipo;
- restricciones de despliegue.

Una restricción aprobada no puede ser ignorada.

### Contexto técnico y despliegue

El Architecture Agent debe considerar infraestructura y despliegue cuando estén definidos o puedan cambiar materialmente una decisión arquitectónica. Debe distinguir:

- `DEPLOYMENT_DECIDED`: existe una plataforma aprobada u obligatoria. Tratarla como restricción arquitectónica; no ignorarla ni sustituirla sin decisión humana.
- `DEPLOYMENT_CANDIDATES`: hay plataformas en evaluación, sin aprobación. Tratarlas como contexto y alternativas pendientes; no convertirlas en restricciones ni asumir una selección.
- `DEPLOYMENT_UNDEFINED`: no existe decisión de despliegue. No inventar una plataforma; preguntar por el entorno solo si puede cambiar materialmente la arquitectura.

Una plataforma, por ejemplo Supabase, Vercel, Render, Railway, AWS, Azure o GCP, no constituye por sí misma un Architecture Driver. Sus capacidades y límites pueden influir en persistencia, procesos programados, concurrencia, escalado, observabilidad, integraciones, secretos, disponibilidad, operación o costo únicamente si el contexto aporta evidencia. No seleccionar proveedor automáticamente: esa decisión posterior requiere analizar drivers, restricciones, necesidades de ejecución, persistencia, integraciones, procesos programados, seguridad, costo, complejidad operacional y experiencia del equipo.

La entrada sigue siendo Markdown genérico. Opcionalmente puede incluir una sección «Contexto técnico y despliegue» con infraestructura existente, plataforma aprobada, plataformas candidatas, restricciones económicas, restricciones institucionales y decisiones técnicas aprobadas. No exigir esas secciones a todos los proyectos.

En Fase 1, una necesidad respaldada, como «se requieren procesos programados», puede constituir un driver si influye materialmente en la estructura. En Fase 2 se identifica una restricción aprobada, como «el sistema debe ejecutarse en la plataforma X». No confundir la necesidad con la plataforma.

---

## 9. Alternativas arquitectónicas

El agente **no debe saltar directamente a una solución**.

Debe considerar únicamente alternativas pertinentes.

Entre las alternativas que podrían evaluarse cuando exista justificación:

- arquitectura por capas;
- monolito modular;
- Service-Oriented Architecture;
- Clean Architecture;
- arquitectura hexagonal / Ports and Adapters;
- microservicios;
- Event-Driven Architecture;
- API-First.

Estas alternativas no son necesariamente excluyentes.

Sin embargo, en la V0.x:

- comparar como máximo tres alternativas;
- no incluir alternativas solo para llenar una lista;
- no combinar estilos sin justificar el problema que resuelve la combinación.

---

## 10. Regla contra la sobreingeniería

Regla de oro:

> El agente no debe buscar la arquitectura más moderna ni la más compleja. Debe buscar la arquitectura más adecuada para satisfacer el contexto, los atributos de calidad y las restricciones.

Codex debe conservar este principio también al modificar el propio código del agente.

No agregar complejidad preventiva.

Antes de agregar:

- una abstracción;
- un patrón;
- una dependencia;
- una capa;
- un servicio;
- un framework;
- una base de datos;
- un segundo proveedor;
- un segundo LLM;

Codex debe poder responder:

1. ¿Qué problema real resuelve?
2. ¿Qué evidencia demuestra que el problema existe?
3. ¿Cuál es la alternativa más simple?
4. ¿Qué complejidad nueva introduce?

Si no existe una respuesta clara, no agregarlo.

---

## 11. Comparación de alternativas

Las alternativas deben compararse usando criterios derivados del contexto.

Posibles criterios:

- mantenibilidad;
- escalabilidad;
- complejidad;
- seguridad;
- integración;
- tiempo;
- riesgo técnico;
- testabilidad;
- observabilidad.

No todos deben utilizarse siempre.

Los criterios deben surgir de Architecture Drivers y restricciones reales.

### Pesos y puntuaciones

No inventar pesos numéricos.

No inventar puntuaciones para favorecer una arquitectura.

Si el contexto no permite justificar pesos, usar comparación cualitativa.

Ejemplo:

```text
ALTO / MEDIO / BAJO
```

solo cuando el significado de la escala esté definido y pueda justificarse.

---

## 12. Selección de arquitectura

La pregunta nunca es:

> ¿Cuál es la mejor arquitectura?

La pregunta es:

> ¿Cuál es la arquitectura más adecuada para este contexto?

La recomendación debe explicar:

- por qué satisface mejor los drivers;
- qué restricciones respeta;
- qué complejidad introduce;
- qué complejidad evita;
- qué alternativas fueron descartadas;
- por qué fueron descartadas;
- qué trade-offs se aceptan;
- qué riesgos permanecen;
- qué cambiaría la decisión.

La salida debe marcarse siempre como propuesta pendiente de validación humana.

---

## 13. ADR

Toda decisión arquitectónica relevante debe poder documentarse mediante ADR.

Estructura base:

```text
ADR-XXX

Estado
Título
Contexto
Problema
Drivers
Restricciones
Alternativas
Decisión propuesta
Justificación
Consecuencias positivas
Consecuencias negativas
Supuestos
Riesgos
Evidencia
Condiciones para revisar la decisión
```

En V0.x se permite usar:

```text
ADR-001
Estado: PROPOSED
```

No implementar todavía un sistema complejo de versionamiento o numeración.

---

## 14. Arquitectura vs. diseño vs. patrones

Codex y el Architecture Agent deben mantener esta frontera.

### Arquitectura

Pregunta:

> ¿Cómo estructuramos el sistema?

Ejemplos de salida:

- módulos;
- capas;
- límites;
- componentes;
- integraciones.

### Diseño

Pregunta:

> ¿Cómo organizamos internamente una parte?

Ejemplos:

- interfaces;
- servicios;
- dependencias internas.

### Patrones

Pregunta:

> ¿Qué solución conocida resuelve un problema concreto de diseño?

Ejemplos:

- Strategy;
- Adapter;
- Facade;
- Factory Method;
- Observer;
- Chain of Responsibility;
- Repository;
- DTO;
- Dependency Injection.

No recomendar patrones solo porque existen.

Secuencia obligatoria:

```text
SPEC
  ↓
Arquitectura
  ↓
Problema de diseño
  ↓
Alternativas
  ↓
Patrón, si aplica
  ↓
Implementación
  ↓
Validación
```

---

## 15. Lo que el Architecture Agent NO debe hacer

No debe:

- redefinir silenciosamente el problema de negocio;
- inventar requisitos;
- modificar reglas de negocio;
- seleccionar tecnologías por moda o preferencia;
- imponer microservicios;
- imponer arquitectura hexagonal;
- imponer Clean Architecture;
- imponer Event-Driven Architecture;
- generar código de producción como sustituto de arquitectura;
- ocultar incertidumbres;
- presentar una recomendación de IA como decisión humana;
- inventar métricas, cargas, presupuestos o restricciones;
- crear decisiones no respaldadas por evidencia.

---

## 16. Lo que Codex NO debe hacer en este repositorio

Codex no debe introducir sin evidencia:

- LangChain;
- LangGraph;
- LlamaIndex;
- RAG;
- embeddings;
- bases vectoriales;
- bases de datos;
- memoria conversacional;
- múltiples agentes;
- múltiples LLM;
- fallback automático;
- circuit breakers;
- colas;
- microservicios;
- API REST del agente;
- interfaz gráfica;
- Docker;
- Kubernetes;
- CI/CD complejo;
- abstracciones para proveedores inexistentes.

No crear `LLMProvider`, `Factory`, `Strategy`, `Repository`, `Adapter`, etc. solo por anticipar cambios futuros.

Aplicar YAGNI.

---

## 17. Integración LLM actual

Proveedor actual:

```text
Cloudflare Workers AI
```

Gateway:

```text
Cloudflare AI Gateway
```

Modelo inicial:

```text
@cf/nvidia/nemotron-3-120b-a12b
```

Variables:

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
CLOUDFLARE_GATEWAY_ID
CLOUDFLARE_MODEL
```

Reglas:

- nunca hardcodear secretos;
- nunca imprimir el API token;
- `.env` debe estar ignorado por Git;
- usar timeout HTTP explícito;
- manejar errores de red y HTTP de forma clara;
- no agregar fallback mientras no exista evidencia de necesidad.

---

## 18. Flujo mínimo actual

La V0.x debe conservar, salvo decisión explícita, este flujo:

```text
CLI
 ↓
leer Markdown
 ↓
preservar fuentes
 ↓
construir contexto
 ↓
una llamada al LLM
 ↓
parsear JSON
 ↓
validar contrato
 ↓
guardar JSON
 ↓
generar Markdown
 ↓
validación humana
```

No convertir esta versión en un loop autónomo.

Si el resultado es:

```text
NEEDS_INFORMATION
```

la ejecución termina.

El humano completa el contexto y ejecuta nuevamente.

---

## 19. Contrato mínimo de salida

Estados válidos:

```text
NEEDS_INFORMATION
READY
```

### NEEDS_INFORMATION

Debe incluir:

- preguntas faltantes;
- razón de cada pregunta;
- impacto sobre la decisión.

Debe cumplir:

```text
recommendation = null
```

Máximo inicial:

```text
5 preguntas
```

### READY

Debe incluir al menos:

- Architecture Drivers;
- alternativas;
- recomendación;
- trade-offs;
- riesgos;
- condiciones para revisar;
- ADR propuesto.

---

## 20. Trazabilidad

La arquitectura debe poder relacionarse con la evidencia que la origina.

Cadena conceptual:

```text
REQ
 ↓
SPEC
 ↓
Architecture Driver
 ↓
Decisión Arquitectónica
 ↓
Componente
 ↓
Implementación
 ↓
TEST
```

En V0.x no es obligatorio implementar toda la cadena hasta código y pruebas.

Sí es obligatorio conservar al menos:

```text
FUENTE
 ↓
DRIVER
 ↓
ALTERNATIVA / DECISIÓN
```

Toda afirmación importante debe poder defenderse indicando su fuente.

---

## 21. Riesgos, supuestos y preguntas abiertas

El agente debe hacer explícito:

- riesgos técnicos;
- supuestos;
- dependencias externas;
- decisiones pendientes;
- limitaciones conocidas;
- preguntas que requieren validación.

Nunca convertir silenciosamente un supuesto en un hecho.

Cuando aplique, diferenciar:

```text
HECHO
SUPUESTO
PROPUESTA
DECISIÓN APROBADA
RIESGO
PREGUNTA ABIERTA
```

---

## 22. Architecture Package

El resultado completo definido por la guía puede incluir:

- Architecture Drivers;
- restricciones;
- atributos de calidad;
- alternativas;
- matriz de decisión;
- arquitectura seleccionada;
- diagramas;
- componentes y responsabilidades;
- integraciones;
- ADR;
- decisiones de diseño;
- patrones justificados;
- riesgos;
- supuestos;
- preguntas abiertas;
- trazabilidad.

IMPORTANTE:

La V0.x no necesita implementar todos estos elementos de una vez.

Codex debe incorporarlos incrementalmente según el backlog y la evidencia obtenida durante las pruebas.

---

## 23. Política de modificación para Codex

Antes de modificar código:

1. inspeccionar el repositorio;
2. identificar el comportamiento actual;
3. ejecutar tests relevantes;
4. reproducir el problema;
5. obtener evidencia;
6. formular una hipótesis;
7. aplicar el cambio mínimo;
8. ejecutar nuevamente las pruebas;
9. verificar regresiones.

No refactorizar preventivamente.

No reescribir archivos completos cuando un cambio pequeño sea suficiente.

No cambiar contratos públicos sin explicar el impacto.

---

## 24. Política para nuevas funcionalidades

Cuando se solicite una nueva capacidad:

1. definir el problema;
2. comprobar que pertenece al Architecture Agent;
3. identificar el requisito o evidencia;
4. proponer la implementación más simple;
5. indicar archivos afectados;
6. implementar;
7. probar;
8. documentar la limitación restante.

Si la capacidad pertenece a Specification, Planning, Coding o QA, Codex debe señalarlo antes de implementarla aquí.

---

## 25. Testing

Toda funcionalidad importante debe probar:

- caso feliz;
- entrada inválida;
- información incompleta;
- contradicción cuando aplique;
- caso límite cuando aplique.

Las pruebas unitarias no deben consumir la API real.

La conectividad con Cloudflare se valida manualmente o mediante una prueba de integración explícita separada.

No consumir cuota del modelo desde `pytest` por defecto.

---

## 26. Evaluación del Architecture Agent

La calidad no se mide porque el JSON sea válido.

Debe evaluarse si:

- responde a la especificación;
- identifica drivers relevantes;
- considera restricciones;
- compara alternativas reales;
- justifica la recomendación;
- usa los atributos de calidad en la decisión;
- mantiene responsabilidades y fronteras coherentes;
- evita patrones sin problema real;
- explicita riesgos;
- explicita supuestos;
- mantiene trazabilidad;
- evita inventar;
- evita sobreingeniería;
- puede ser defendido por el equipo sin depender de la IA.

Una salida técnicamente válida puede ser semánticamente incorrecta.

No confundir:

```text
JSON válido
```

con:

```text
decisión arquitectónica válida
```

---

## 27. Casos mínimos de evaluación

Mantener o crear casos controlados para comprobar al menos:

### Caso A — Información insuficiente

Entrada mínima y ambigua.

Esperado:

```text
NEEDS_INFORMATION
```

No debe inventar una arquitectura.

### Caso B — Proyecto pequeño

Equipo reducido, plazo corto, sin necesidad demostrada de despliegue independiente.

Esperado:

- penalizar complejidad operacional;
- no imponer microservicios.

### Caso C — Proyecto distribuido justificado

Múltiples equipos o dominios, despliegue independiente y drivers explícitos.

Esperado:

- considerar servicios cuando corresponda;
- justificar su costo.

### Caso D — Restricciones contradictorias

Esperado:

- detectar la contradicción;
- no ocultarla;
- pedir validación cuando cambie la decisión.

### Caso E — Arquitectura de moda

Contexto que no justifica microservicios, eventos o hexagonal.

Esperado:

- descartar la opción si no aporta valor;
- explicar por qué.

---

## 28. Reglas de documentación

Cuando Codex complete una tarea debe reportar:

1. qué problema se resolvió;
2. archivos modificados;
3. cambios realizados;
4. dependencias agregadas;
5. configuración necesaria;
6. cómo ejecutar;
7. cómo probar;
8. resultado de pruebas;
9. limitaciones conocidas;
10. siguiente paso recomendado, sin implementarlo salvo solicitud explícita.

---

## 29. Definition of Done para cambios

Un cambio no está terminado solo porque compile.

Debe:

- cumplir el requisito;
- respetar esta guía;
- mantener el alcance del Architecture Agent;
- evitar invenciones;
- mantener simplicidad;
- preservar seguridad;
- tener pruebas apropiadas;
- no romper pruebas existentes;
- estar documentado cuando corresponda;
- poder explicarse y defenderse.

---

## 30. Preguntas obligatorias para decisiones importantes

Antes de cerrar una decisión técnica, Codex debe poder responder:

1. ¿Por qué se hizo así?
2. ¿Qué alternativas existían?
3. ¿Qué Architecture Driver la justifica?
4. ¿Qué restricción influye?
5. ¿Qué trade-off aceptamos?
6. ¿Qué complejidad introduce?
7. ¿Cómo sabemos que funciona?
8. ¿Qué evidencia lo respalda?
9. ¿Qué haría cambiar la decisión?

Si alguna respuesta depende de información inexistente, indicarlo explícitamente.

---

## 31. Regla final

La meta del repositorio no es producir la mayor cantidad de arquitectura, patrones, clases o documentación.

La meta es producir:

> **la arquitectura más simple que satisfaga la especificación, sus atributos de calidad y sus restricciones, con evidencia suficiente para que el equipo pueda entenderla, cuestionarla, validarla y defenderla.**
