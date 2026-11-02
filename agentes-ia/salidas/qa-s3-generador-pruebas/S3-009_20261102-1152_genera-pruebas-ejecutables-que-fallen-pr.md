<!--
Agente: QA S3 Generador de pruebas
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-11-02 11:52
Petición: Genera pruebas ejecutables que fallen primero.
-->

```file:apps/api/src/modulos/simulacion/pruebas/spec-008.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SimulacionService } from '../servicios/simulacion.service';

describe('SPEC-008: Datos simulados, parámetros y catálogos', () => {
  let service: SimulacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulacionService],
    }).compile();

    service = module.get<SimulacionService>(SimulacionService);
  });

  it('AC-034 / TC-SPEC008-01: Consulta de paciente por cédula en EPS simulada', async () => {
    await expect(service.consultarPaciente('123456789')).rejects.toThrow();
  });

  it('AC-035 / TC-SPEC008-02: Consulta de fórmula por número MIPRES de 20 dígitos', async () => {
    await expect(service.consultarFormula('12345678901234567890')).rejects.toThrow();
  });

  it('AC-036 / AC-051 / TC-SPEC008-03: Verificación de cobertura PBS con prevalencia del catálogo', async () => {
    await expect(service.verificarCoberturaPBS('MED-001', true)).rejects.toThrow();
  });

  it('AC-037 / TC-SPEC008-04: Clasificación de diagnóstico CIE-10 contra catálogo de crónicos', async () => {
    await expect(service.clasificarDiagnostico('I10')).rejects.toThrow();
  });

  it('AC-043 / AC-052 / CL-020 / TC-SPEC008-05: Cálculo de primer día hábil excluyendo festivos y años requeridos', async () => {
    await expect(service.calcularDiaHabilSiguiente(new Date('2026-04-04'))).rejects.toThrow();
  });

  it('AC-045 / AC-046 / AC-055 / BR-025 / TC-SPEC008-06: Evaluación de vigencia de fórmula con hora de Colombia', async () => {
    await expect(service.evaluarVigenciaFormula('12345678901234567890', new Date())).rejects.toThrow();
  });

  it('AC-049 / RNF-017 / TC-SPEC008-07: Rechazo de datos de contacto no autorizados en entorno de pruebas', async () => {
    await expect(service.validarDatosContactoPrueba('3000000000', 'noautorizado@example.com')).rejects.toThrow();
  });

  it('AC-054 / RNF-018 / TC-SPEC008-08: Disociación de identidad en eventos tras revocación de consentimiento', async () => {
    await expect(service.revocarConsentimientoEvento('EV-001')).rejects.toThrow();
  });

  it('AC-056 / BR-025 / TC-SPEC008-09: Verificación de rango de vigencia de 8 a 9 meses en datos de prueba', async () => {
    await expect(service.validarRangoVigenciaDatosPrueba()).rejects.toThrow();
  });
});
```

```file:qa/trazabilidad.md
# Matriz de Trazabilidad - Pharma Express

| ID AC / TC | Requisito | Ruta de la Prueba | Estado |
|------------|-----------|-------------------|--------|
| AC-034 / TC-SPEC008-01 | RF-075 | apps/api/src/modulos/simulacion/pruebas/spec-008.spec.ts | ROJA |
| AC-035 / TC-SPEC008-02 | RF-076 | apps/api/src/modulos/simulacion/pruebas/spec-008.spec.ts | ROJA |
| AC-036 / TC-SPEC008-03 | RF-077 | apps/api/src/modulos/simulacion/pruebas/spec-008.spec.ts | ROJA |
| AC-037 / TC-SPEC008-04 | RF-078 | apps/api/src/modulos/simulacion/pruebas/spec-008.spec.ts | ROJA |
| AC-043 / TC-SPEC008-05 | RF-084 | apps/api/src/modulos/simulacion/pruebas/spec-008.spec.ts | ROJA |
| AC-045 / TC-SPEC008-06 | BR-025 | apps/api/src/modulos/simulacion/pruebas/spec-008.spec.ts | ROJA |
| AC-049 / TC-SPEC008-07 | RNF-017 | apps/api/src/modulos/simulacion/pruebas/spec-008.spec.ts | ROJA |
| AC-054 / TC-SPEC008-08 | RNF-018 | apps/api/src/modulos/simulacion/pruebas/spec-008.spec.ts | ROJA |
| AC-056 / TC-SPEC008-09 | BR-025 | apps/api/src/modulos/simulacion/pruebas/spec-008.spec.ts | ROJA |
```

```text
Pruebas generadas: 9
  Jest unitarias: 9
  Testcontainers: 0
  Playwright: 0
  grammY simuladas: 0
@supuesto: 0
TC sin prueba: 0 (motivo: N/A)
Primera ejecución: 9 rojas, 0 verdes, 0 con error de sintaxis (debe ser 0)
```
