/**
 * Datos de prueba (SPEC-08). Todo es ficticio: puntos con nombres inventados y pacientes de prueba.
 * Contactos: reemplaza los valores por los celulares y correos de los integrantes del equipo,
 * con su consentimiento (SUP-07, RF-81), mediante las variables CONTACTO_<n>_CEL y CONTACTO_<n>_CORREO.
 * Las fechas se calculan desde hoy para que los escenarios funcionen el día que se ejecute el seed.
 */
import { PrismaClient } from '@prisma/client';
import { randomBytes, scryptSync } from 'node:crypto';

const prisma = new PrismaClient();
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);
const dia = (n: number) => {
  const d = new Date(hoy);
  d.setDate(d.getDate() + n);
  return d;
};
const hash = (s: string) => {
  const sal = randomBytes(16);
  return `${sal.toString('hex')}:${scryptSync(s, sal, 32).toString('hex')}`;
};
const contacto = (n: number, cel: string | null, correo: string | null) => ({
  celular: process.env[`CONTACTO_${n}_CEL`] ?? cel,
  correo: process.env[`CONTACTO_${n}_CORREO`] ?? correo,
});

async function main() {
  await prisma.$transaction([
    prisma.evento.deleteMany(), prisma.notificacionWeb.deleteMany(), prisma.citaItem.deleteMany(), prisma.cita.deleteMany(),
    prisma.cupoVentana.deleteMany(), prisma.documento.deleteMany(), prisma.formulaItem.deleteMany(), prisma.formula.deleteMany(),
    prisma.solicitud.deleteMany(), prisma.vinculacion.deleteMany(), prisma.consentimiento.deleteMany(), prisma.codigoVerificacion.deleteMany(),
    prisma.dispensador.deleteMany(), prisma.inventario.deleteMany(), prisma.simFormulaEpsItem.deleteMany(), prisma.simFormulaEps.deleteMany(),
    prisma.simPacienteEps.deleteMany(), prisma.medicamento.deleteMany(), prisma.punto.deleteMany(), prisma.diagnosticoCronico.deleteMany(),
    prisma.contenidoEps.deleteMany(), prisma.motivoNoEntrega.deleteMany(),
  ]);

  await prisma.medicamento.createMany({
    data: [
      { codigo: 'LOS50', nombre: 'Losartán 50 mg tableta', pbs: true },
      { codigo: 'HCT25', nombre: 'Hidroclorotiazida 25 mg tableta', pbs: true },
      { codigo: 'AMX500', nombre: 'Amoxicilina 500 mg cápsula', pbs: true },
      { codigo: 'MET850', nombre: 'Metformina 850 mg tableta', pbs: true },
      { codigo: 'EMP25', nombre: 'Empagliflozina 25 mg tableta', pbs: false },
      { codigo: 'GLA100', nombre: 'Insulina glargina 100 UI/mL', pbs: true },
      { codigo: 'AMXS', nombre: 'Amoxicilina 250 mg/5 mL suspensión', pbs: true },
      { codigo: 'ACE500', nombre: 'Acetaminofén 500 mg tableta', pbs: true },
      { codigo: 'SAL100', nombre: 'Salbutamol 100 mcg inhalador', pbs: true },
    ],
  });
  await prisma.diagnosticoCronico.createMany({
    data: [
      { codigo: 'I10', descripcion: 'Hipertensión esencial' },
      { codigo: 'E11', descripcion: 'Diabetes mellitus tipo 2' },
      { codigo: 'J45', descripcion: 'Asma' },
      { codigo: 'E03', descripcion: 'Hipotiroidismo' },
    ],
  });
  await prisma.contenidoEps.createMany({
    data: [
      { eps: 'Salud Total', autorizaciones: 'Solicita la autorización en la oficina virtual de Salud Total o en una de sus sedes de atención en Manizales. Cuando la tengas, inicia una nueva solicitud.', actualizarDatos: 'Actualiza tu celular o correo en la oficina virtual o en una sede de atención de Salud Total.' },
      { eps: 'Sanitas', autorizaciones: 'Solicita la autorización por los canales de autorizaciones de EPS Sanitas o en su sede de atención en Manizales. Cuando la tengas, inicia una nueva solicitud.', actualizarDatos: 'Actualiza tu celular o correo en los canales de atención de EPS Sanitas.' },
    ],
  });
  await prisma.motivoNoEntrega.createMany({
    data: [
      { codigo: 'AFILIACION_INACTIVA', descripcion: 'Afiliación inactiva' },
      { codigo: 'FORMULA_VENCIDA', descripcion: 'Fórmula vencida o inválida' },
      { codigo: 'AUTORIZACION_NO_VIGENTE', descripcion: 'Autorización no vigente' },
      { codigo: 'NO_CUBIERTO', descripcion: 'Medicamento no cubierto' },
      { codigo: 'DATOS_NO_COINCIDEN', descripcion: 'Datos del paciente no coinciden' },
      { codigo: 'SIN_EXISTENCIAS', descripcion: 'Sin existencias pese a reserva' },
      { codigo: 'OTRO', descripcion: 'Otro', exigeDescripcion: true },
    ],
  });
  await prisma.punto.createMany({
    data: [
      { id: 'P1', nombre: 'Punto Los Nogales', dias: [1, 2, 3, 4, 5, 6], abre: 7, cierra: 17, capacidad: 3 },
      { id: 'P2', nombre: 'Punto Alto del Guamo', dias: [1, 2, 3, 4, 5], abre: 7, cierra: 16, capacidad: 3 },
      { id: 'P3', nombre: 'Punto La Ladera', dias: [1, 2, 3, 4, 5, 6], abre: 8, cierra: 12, capacidad: 2 },
    ],
  });
  const inv: Record<string, Record<string, number>> = {
    P1: { LOS50: 10, HCT25: 0, AMX500: 6, MET850: 8, EMP25: 0, GLA100: 3, AMXS: 0, ACE500: 20, SAL100: 2 },
    P2: { LOS50: 4, HCT25: 5, AMX500: 0, MET850: 0, EMP25: 0, GLA100: 0, AMXS: 0, ACE500: 10, SAL100: 4 },
    P3: { LOS50: 0, HCT25: 0, AMX500: 2, MET850: 4, EMP25: 3, GLA100: 0, AMXS: 0, ACE500: 5, SAL100: 0 },
  };
  for (const [puntoId, m] of Object.entries(inv))
    await prisma.inventario.createMany({ data: Object.entries(m).map(([medicamentoCodigo, existencias]) => ({ puntoId, medicamentoCodigo, existencias })) });

  // Vigencias entre 8 y 9 meses después de la consulta (RF-82).
  const pacientes = [
    { cedula: '1053800111', nombre: 'Rosa Elena Marín', eps: 'Salud Total', afiliacionActiva: true, ...contacto(1, '+573000000111', 'rosa.prueba@pharmaexpress.test'),
      formulas: [
        { numero: 'F-1001', diagnostico: 'I10', vigencia: dia(240), habilitada: dia(1), items: [['LOS50', 1], ['HCT25', 1]] },
        { numero: 'F-1002', diagnostico: 'J02', vigencia: dia(255), items: [['AMX500', 1]] },
      ] },
    { cedula: '1053800222', nombre: 'Jorge Iván Ocampo', eps: 'Sanitas', afiliacionActiva: true, ...contacto(2, '+573000000222', null),
      formulas: [
        { numero: 'F-2001', diagnostico: 'E11', vigencia: dia(230), habilitada: dia(0), items: [['MET850', 2], ['EMP25', 1, false]] },
        { numero: 'F-2002', diagnostico: 'E11', vigencia: dia(230), habilitada: dia(5), items: [['GLA100', 1]] },
        { numero: 'F-2003', diagnostico: 'M54', vigencia: dia(250), items: [['ACE500', 1]] },
      ] },
    { cedula: '1053800333', nombre: 'Luz Dary Giraldo', eps: 'Salud Total', afiliacionActiva: false, ...contacto(3, '+573000000333', 'luz.prueba@pharmaexpress.test'),
      formulas: [{ numero: 'F-3001', diagnostico: 'J45', vigencia: dia(220), habilitada: dia(-7), items: [['SAL100', 1]] }] },
    { cedula: '1053800444', nombre: 'Samuel Restrepo', eps: 'Sanitas', afiliacionActiva: true, ...contacto(4, '+573000000444', null),
      formulas: [
        { numero: 'F-4001', diagnostico: 'H66', vigencia: dia(260), items: [['AMXS', 1]] },
        { numero: 'F-4002', diagnostico: 'J02', vigencia: dia(-37), items: [['ACE500', 1]] },
      ] },
    { cedula: '1053800555', nombre: 'Carmen Ospina', eps: 'Salud Total', afiliacionActiva: true, celular: null, correo: null, formulas: [] },
  ];
  for (const p of pacientes) {
    const { formulas, ...datos } = p;
    await prisma.simPacienteEps.create({ data: datos });
    for (const f of formulas as any[]) {
      await prisma.simFormulaEps.create({
        data: {
          numero: f.numero, pacienteCedula: p.cedula, diagnostico: f.diagnostico, vigencia: f.vigencia, habilitada: f.habilitada ?? null,
          items: { create: f.items.map(([m, q, aut]: [string, number, boolean?]) => ({ medicamentoCodigo: m, cantidad: q, autorizado: aut ?? false })) },
        },
      });
    }
  }
  await prisma.dispensador.createMany({
    data: [
      { usuario: 'disp.nogales', claveHash: hash('demo1234'), puntoId: 'P1' },
      { usuario: 'disp.guamo', claveHash: hash('demo1234'), puntoId: 'P2' },
      { usuario: 'disp.ladera', claveHash: hash('demo1234'), puntoId: 'P3' },
    ],
  });
  console.log('Datos de prueba cargados.');
}

main().finally(() => prisma.$disconnect());
