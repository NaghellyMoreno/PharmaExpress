import { Test, TestingModule } from '@nestjs/testing';
import { PrevalidacionalServicio } from '../servicios/prevalidacional.servicio';
import { SimulacionApi } from '../../simulacion/api/simulacion.api';
import { SimulacionService } from '../../simulacion/servicios/simulacion.service';

describe('Reglas de Negocio Específicas - SPEC-003', () => {
  let servicio: PrevalidacionalServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrevalidacionalServicio, SimulacionApi, SimulacionService],
    }).compile();

    servicio = module.get<PrevalidacionalServicio>(PrevalidacionalServicio);
  });

  it('AC-031: una fórmula crónica sin fecha habilitada de entrega registrada queda no apta', async () => {
    const dto = {
      numeroPrescripcion: '12345678901234567890',
      esCronica: true,
      fechaHabilitada: null,
    };

    const resultado = await servicio.evaluarFechaHabilitadaCronica(dto);
    expect(resultado).toMatchObject({
      apta: false,
      motivo: 'Fórmula crónica sin fecha habilitada de entrega registrada en la EPS simulada.',
      siguientePaso: 'Acudir a la atención presencial en el punto de dispensación.',
    });
  });

  it('AC-050: un número de fórmula con 19 dígitos, 21 dígitos o caracteres no numéricos cuenta como documento ilegible', async () => {
    await expect(servicio.validarEstructuraPrescripcion({ numeroPrescripcion: '1234567890123456789' })).resolves.toMatchObject({ ilegible: true }); // 19 dígitos
    await expect(servicio.validarEstructuraPrescripcion({ numeroPrescripcion: '123456789012345678901' })).resolves.toMatchObject({ ilegible: true }); // 21 dígitos
    await expect(servicio.validarEstructuraPrescripcion({ numeroPrescripcion: '123456789012345678X' })).resolves.toMatchObject({ ilegible: true }); // no numérico
    await expect(servicio.validarEstructuraPrescripcion({ numeroPrescripcion: '12345678901234567890' })).resolves.toMatchObject({ valido: true, ilegible: false });
  });

  it('AC-056: un archivo en un formato distinto de JPG, PNG o PDF se rechaza sin leerlo y no contabiliza ningún intento', async () => {
    const archivoDto = {
      nombre: 'formula.exe',
      mimetype: 'application/x-msdownload',
    };

    const resultado = await servicio.validarFormatoArchivo(archivoDto);
    expect(resultado).toMatchObject({ aceptado: false, gastaIntento: false });
  });

  it('AC-056 (positivo): un archivo JPG, PNG o PDF se acepta', async () => {
    await expect(servicio.validarFormatoArchivo({ nombre: 'formula.jpg', mimetype: 'image/jpeg' })).resolves.toMatchObject({ aceptado: true });
    await expect(servicio.validarFormatoArchivo({ nombre: 'formula.pdf', mimetype: 'application/pdf' })).resolves.toMatchObject({ aceptado: true });
  });
});
