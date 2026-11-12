import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { api, ApiError, fechaLarga, fijarPaciente, horaCorta, MESES_CORTOS, mismoDia, rango } from './lib/api';
import { Chip, Icon, iniciales, Logo, Note, PillArt, Sheet, Top } from './lib/ui';

type Vinculo = { cedula: string; nombre: string; eps: string; activa: boolean; venceEn: string };
type Pantalla =
  | 'privacidad' | 'cedula' | 'codigo' | 'alterna' | 'presencial' | 'pacientes' | 'salud' | 'inicio' | 'avisos'
  | 'carga' | 'resultado' | 'agenda' | 'confirmado' | 'solicitudes' | 'citas' | 'codigoEntrega' | 'revocado';

const ESTADO_FORMULA: Record<string, [string, 'ok' | 'bad' | 'warn' | 'info' | 'neu']> = {
  CARGADA: ['Cargada', 'neu'], APTA: ['Apta', 'ok'], NO_APTA: ['No apta', 'bad'], SIN_DISPONIBILIDAD: ['Sin disponibilidad', 'warn'],
  AGENDADA: ['Agendada', 'info'], ENTREGADA: ['Entregada', 'ok'], CERRADA_NO_ENTREGADOS: ['Cerrada con no entregados', 'warn'], LIBERADA: ['Liberada', 'neu'],
};
const ESTADO_CITA: Record<string, [string, 'ok' | 'bad' | 'warn' | 'info' | 'neu']> = {
  RESERVADA: ['Reservada', 'ok'], CUMPLIDA: ['En atención', 'info'], CERRADA: ['Cerrada', 'neu'], CANCELADA: ['Cancelada', 'neu'], EXPIRADA: ['Expirada', 'neu'],
};
const ESTADO_ITEM: Record<string, string> = { PENDIENTE: '', RESERVADO: 'Reservado', ENTREGADO: 'Entregado', NO_ENTREGADO: 'No entregado', PERDIDO: 'Perdido', LIBERADO: 'Liberado' };

type Ctx = { actual: Vinculo; p: Pantalla; ir: (x: Pantalla) => void; nueva: () => void; sinLeer: number; avisos: () => void; cambiar: () => void };
const AppCtx = createContext<Ctx | null>(null);

export function App() {
  const [p, setP] = useState<Pantalla>('privacidad');
  const [tipo, setTipo] = useState<'TITULAR' | 'TERCERO'>('TITULAR');
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [actual, setActual] = useState<Vinculo | null>(null);
  const [msg, setMsg] = useState('');
  const [cedula, setCedula] = useState('');
  const [envio, setEnvio] = useState<{ celular: string | null; correo: string | null; enviadoEn: number } | null>(null);
  const [recien, setRecien] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [confirmadas, setConfirmadas] = useState<string[]>([]);
  const [avisos, setAvisos] = useState<any[]>([]);
  const [vistos, setVistos] = useState(0);

  const ir = (x: Pantalla, m = '') => { setMsg(m); setP(x); window.scrollTo(0, 0); };
  const cargarVinculos = async () => { const v = await api<Vinculo[]>('/canales/vinculaciones'); setVinculos(v); return v; };

  useEffect(() => { cargarVinculos().then((v) => v.length && setP('pacientes')).catch(() => {}); }, []);
  useEffect(() => {
    if (!actual) return;
    const leer = () => api('/canales/notificaciones').then(setAvisos).catch(() => {});
    leer();
    const t = setInterval(leer, 15_000);
    return () => clearInterval(t);
  }, [actual]);

  const pedirCodigo = async (ced: string) => {
    const r = await api('/identidad/codigo', { body: { cedula: ced, acepta: true } });
    setEnvio({ celular: r.celular, correo: r.correo, enviadoEn: Date.now() });
  };
  const entrar = async (v: Vinculo, nuevo = false) => {
    if (!v.activa) {
      setCedula(v.cedula);
      try { await pedirCodigo(v.cedula); ir('codigo', 'La vinculación de este navegador venció. Te enviamos un código nuevo.'); }
      catch (e) { ir('alterna', (e as Error).message); }
      return;
    }
    fijarPaciente(v.cedula);
    setActual(v);
    setRecien(nuevo);
    if (nuevo && !(await api('/identidad/salud')).autorizada) return ir('salud');
    ir('inicio');
  };
  const salir = () => { fijarPaciente(null); setActual(null); };

  const nueva = async () => { if ((await api('/identidad/salud')).autorizada) ir('carga'); else { setResultado('nueva'); setRecien(false); ir('salud'); } };
  const ctx: Ctx | null = actual ? {
    actual, p, ir, nueva, sinLeer: Math.max(0, avisos.length - vistos),
    avisos: () => { setVistos(avisos.length); ir('avisos'); },
    cambiar: () => { cargarVinculos(); ir('pacientes'); },
  } : null;

  const vista = (() => {
  // ------------------------------------------------------------ pantallas
  if (p === 'privacidad') return <Privacidad tipo={tipo} setTipo={setTipo} onSi={() => ir('cedula')} onNo={() => ir('presencial', 'Sin aceptar el tratamiento de datos no registramos ningún dato.')}
    onBack={vinculos.length ? () => ir('pacientes') : undefined} />;

  if (p === 'cedula') return (
    <Shell w="narrow">
      <Top back={() => ir('privacidad')} step={{ n: 2, total: 3, label: 'Identidad' }} />
      <form className="body" id="f-ced" onSubmit={async (e) => {
        e.preventDefault();
        try { await pedirCodigo(cedula); ir('codigo'); }
        catch (err) {
          const c = (err as ApiError).body?.codigo;
          ir('alterna', c === 'CEDULA_NO_EXISTE' ? 'No encontramos esa cédula en la EPS. Revisa el número.' : c === 'SIN_CONTACTO' ? 'La EPS no tiene un celular ni un correo registrados para este paciente.' : (err as Error).message);
        }
      }}>
        <div className="title-block">
          <h1>Ingresa la cédula del paciente</h1>
          <p className="lead">Le enviaremos un código de verificación a los medios que tiene registrados su EPS.</p>
        </div>
        <label className="field">Número de cédula
          <input id="cedula" className="input big" inputMode="numeric" autoComplete="off" value={cedula} onChange={(e) => setCedula(e.target.value.replace(/\D/g, '').slice(0, 12))} />
          <span className="hint">Solo números, sin puntos.</span>
        </label>
        <div className="card"><div className="feature"><span className="tile-ic teal"><Icon n="lock" s={18} /></span><span>La cédula sola no da acceso. Necesitarás el código que llega al celular y al correo del paciente.</span></div></div>
        <div className="card"><div className="feature"><span className="tile-ic"><Icon n="users" s={18} /></span><div><b>¿Ayudas a otra persona?</b><span>Escribe su cédula. Pídele el código que le llegue, o recíbelo tú si eres su tutor.</span></div></div></div>
      </form>
      <div className="foot">
        <button className="btn primary block" form="f-ced" disabled={cedula.length < 5}>Enviar código</button>
        <button className="link" onClick={() => ir('alterna')}>No tengo acceso al celular registrado</button>
      </div>
    </Shell>
  );

  if (p === 'codigo' && envio) return <Codigo cedula={cedula} envio={envio} aviso={msg} tipo={tipo}
    onBack={() => ir('cedula')} onReenviar={() => pedirCodigo(cedula)} onAlterna={(m) => ir('alterna', m)} onPresencial={() => ir('presencial', 'Elegiste la atención presencial.')}
    onOk={async (ced) => { const v = await cargarVinculos(); await entrar(v.find((x) => x.cedula === ced)!, true); }} />;

  if (p === 'alterna') return <Alterna msg={msg} onBack={() => ir('cedula')} onNuevo={() => ir('cedula')} onPresencial={() => ir('presencial', 'Elegiste la atención presencial.')} />;

  if (p === 'presencial') return (
    <Shell w="narrow">
      <Top back={() => ir('privacidad')} title="Atención presencial" />
      <div className="body">
        <span className="tile-ic big"><Icon n="store" s={24} /></span>
        <div className="title-block"><h1>Te atendemos en el punto</h1><p className="lead">{msg} Puedes reclamar tus medicamentos con la atención presencial de siempre, en cualquier punto de dispensación.</p></div>
        <Note tipo="info">Si más adelante quieres consultar antes de salir, vuelve a abrir Pharma Express.</Note>
      </div>
      <div className="foot"><button className="btn block" onClick={() => ir('privacidad')}>Volver al inicio</button></div>
    </Shell>
  );

  if (p === 'pacientes') return (
    <Shell w="narrow">
      <Top title="Pacientes" />
      <div className="body">
        <div className="title-block"><h1>¿Para quién gestionas hoy?</h1><p className="lead">Estos pacientes están vinculados a este navegador.</p></div>
        <div className="card flush">
          {vinculos.map((v) => (
            <button key={v.cedula} className="list-row" style={{ gridTemplateColumns: '40px 1fr auto' }} onClick={() => entrar(v)}>
              <span className="avatar">{iniciales(v.nombre)}</span>
              <div><b>{v.nombre}</b><span className="sub">{v.eps} · cédula terminada en {v.cedula.slice(-4)}</span></div>
              <span className="row" style={{ gap: 6 }}>{v.activa ? <Chip tipo="ok">Activa</Chip> : <Chip tipo="warn">Pide código</Chip>}<Icon n="next" s={18} /></span>
            </button>
          ))}
        </div>
        <button className="btn block" onClick={() => { salir(); ir('privacidad'); }}><Icon n="plus" s={18} /> Agregar otro paciente</button>
        <p className="small muted" style={{ textAlign: 'center' }}>La atención presencial en el punto sigue disponible.</p>
      </div>
    </Shell>
  );

  if (!actual) return null;

  if (p === 'salud') return (
    <Shell w="narrow">
      <Top back={() => ir('inicio')} title="Datos de salud" />
      <div className="body">
        {recien && (
          <div className="verified"><span className="circle-ok"><Icon n="check" s={20} w={3} /></span>
            <div><b>Identidad verificada</b>{actual.nombre} · {actual.eps}. Este dispositivo quedó vinculado por 3 meses.</div></div>
        )}
        <span className="tile-ic big"><Icon n="shieldPlus" s={24} /></span>
        <div className="title-block"><h1>Autorización para tus datos de salud</h1>
          <p className="lead">Para revisar tus fórmulas e historia clínica necesitamos un permiso aparte. Es voluntario.</p></div>
        <div className="card">
          <div className="feature"><span className="tile-ic teal"><Icon n="file" s={18} /></span><span>Usamos los documentos solo para la prevalidación.</span></div>
          <div className="feature"><span className="tile-ic teal"><Icon n="bellOff" s={18} /></span><span>Ningún aviso por SMS, correo o Telegram menciona medicamentos ni diagnósticos.</span></div>
          <div className="feature"><span className="tile-ic teal"><Icon n="refresh" s={18} /></span><span>Puedes revocar este permiso cuando quieras.</span></div>
        </div>
      </div>
      <div className="foot">
        <button className="btn primary block" onClick={async () => { await api('/identidad/salud', { method: 'POST' }); ir(resultado === 'nueva' ? 'carga' : 'inicio'); setResultado(null); }}>Autorizo y continúo</button>
        <button className="btn block" onClick={() => ir('presencial', 'Sin este permiso no podemos revisar documentos.')}>No autorizo</button>
        <p className="tiny muted" style={{ textAlign: 'center' }}>Sin este permiso no podemos revisar documentos.</p>
      </div>
    </Shell>
  );

  if (p === 'inicio') return <Inicio actual={actual} avisos={avisos} sinLeer={Math.max(0, avisos.length - vistos)}
    onAvisos={ctx!.avisos} onPrevalidar={nueva} onIr={(x) => ir(x)} onCambiar={ctx!.cambiar}
    onDesvincular={async () => { await api('/canales/vinculaciones/actual', { method: 'DELETE' }); salir(); const v = await cargarVinculos(); ir(v.length ? 'pacientes' : 'privacidad'); }}
    onRevocar={async () => { await api('/identidad/revocar', { method: 'POST' }); salir(); await cargarVinculos(); ir('revocado'); }} />;

  if (p === 'avisos') return (
    <Shell w="medium">
      <Top back={() => ir('inicio')} title="Avisos" />
      <div className="body">
        <Note tipo="teal" icon="lock">Los avisos nunca nombran medicamentos ni diagnósticos. El detalle siempre está aquí, dentro de la app.</Note>
        {!avisos.length && <p className="empty">Aún no tienes avisos.</p>}
        <div className="card flush">
          {avisos.map((a) => (
            <div key={a.id} className="list-row" style={{ gridTemplateColumns: '24px 1fr' }}>
              <span className="ic-muted"><Icon n="bell" s={18} /></span>
              <div><span className="sub">{fechaLarga(a.creadaEn)} · {horaCorta(a.creadaEn)}</span><p className="small">{a.texto.replace(/^Pharma Express \([^)]*\): /, '')}</p></div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );

  if (p === 'carga') return <Carga actual={actual} onBack={() => ir('inicio')} onResultado={(r) => { setResultado(r); ir('resultado'); }} />;
  if (p === 'resultado' && resultado) return <Resultado r={resultado} actual={actual} onBack={() => ir('carga')} onAgenda={() => ir('agenda')} onInicio={() => ir('inicio')} />;
  if (p === 'agenda' && resultado) return <Agenda solicitudId={resultado.solicitudId} actual={actual} onBack={() => ir('resultado')} onInicio={() => ir('inicio')} onListo={(ids) => { setConfirmadas(ids); ir('confirmado'); }} />;
  if (p === 'confirmado') return <Confirmado ids={confirmadas} onCerrar={() => ir('inicio')} />;
  if (p === 'solicitudes') return <Solicitudes onBack={() => ir('inicio')} />;
  if (p === 'citas') return <Citas onBack={() => ir('inicio')} onCodigo={() => ir('codigoEntrega')} />;
  if (p === 'codigoEntrega') return <CodigoEntrega onBack={() => ir('inicio')} />;
  if (p === 'revocado') return (
    <Shell w="narrow">
      <Top title="Consentimiento revocado" />
      <div className="body">
        <div className="success"><span className="ring"><span><Icon n="check" s={24} w={3} /></span></span><h1>Listo</h1></div>
        <Note tipo="ok" icon="shield">Cancelamos las citas activas, liberamos los medicamentos y los cupos, desvinculamos los canales y eliminamos los datos del paciente en Pharma Express.</Note>
      </div>
      <div className="foot"><button className="btn primary block" onClick={() => ir(vinculos.length ? 'pacientes' : 'privacidad')}>Continuar</button></div>
    </Shell>
  );
  return null;
  })();
  return <AppCtx.Provider value={ctx}>{vista}</AppCtx.Provider>;
}

// =============================================================== componentes de pantalla

/**
 * Marco de cada pantalla. En computador agrega el menú lateral (con paciente) o el panel de marca (ingreso).
 * `w` limita el ancho del contenido en pantallas grandes: formularios angostos, listas medianas, tableros anchos.
 */
function Shell({ children, w }: { children: ReactNode; w?: 'narrow' | 'medium' }) {
  const c = useContext(AppCtx);
  const cls = `shell ${c ? 'with-side' : 'onboard'} ${w ? `w-${w}` : ''}`;
  return (
    <div className={cls}>
      {c ? <Side c={c} /> : <BrandPanel />}
      <div className="main">{children}</div>
    </div>
  );
}

function Side({ c }: { c: Ctx }) {
  const enSolicitud = ['carga', 'resultado', 'agenda', 'salud', 'confirmado'].includes(c.p);
  const items: [string, string, boolean, () => void, number?][] = [
    ['Inicio', 'store', c.p === 'inicio', () => c.ir('inicio')],
    ['Nueva solicitud', 'camera', enSolicitud, c.nueva],
    ['Mis solicitudes', 'file', c.p === 'solicitudes', () => c.ir('solicitudes')],
    ['Mis citas', 'calendar', c.p === 'citas', () => c.ir('citas')],
    ['Código de entrega', 'qr', c.p === 'codigoEntrega', () => c.ir('codigoEntrega')],
    ['Avisos', 'bell', c.p === 'avisos', c.avisos, c.sinLeer],
  ];
  return (
    <aside className="side">
      <span className="brand"><Logo /> Pharma Express</span>
      <div className="side-patient">
        <span className="avatar">{iniciales(c.actual.nombre)}</span>
        <div><b>{c.actual.nombre}</b><span>{c.actual.eps} · cédula ···{c.actual.cedula.slice(-4)}</span></div>
        <button onClick={c.cambiar}>Cambiar o agregar paciente</button>
      </div>
      <nav aria-label="Menú">
        {items.map(([t, ic, on, fn, n]) => (
          <button key={t} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined} onClick={fn}>
            <Icon n={ic} s={18} /><span>{t}</span>{n ? <span className="count">{n}</span> : <span />}
          </button>
        ))}
      </nav>
      <p className="side-foot">Prototipo académico · EPS e inventario simulados. La atención presencial sigue disponible.</p>
    </aside>
  );
}

function BrandPanel() {
  return (
    <aside className="brand-panel">
      <span className="brand"><Logo /> Pharma Express</span>
      <PillArt />
      <h2>Saber antes de salir de casa si tus fórmulas cumplen y si tus medicamentos te están esperando.</h2>
      <ul>
        <li><span className="ic"><Icon n="shield" s={18} /></span>Revisamos afiliación, vigencia, cobertura y autorización antes de que te desplaces.</li>
        <li><span className="ic"><Icon n="pill" s={18} /></span>Solo te damos cita cuando tu medicamento queda apartado.</li>
        <li><span className="ic"><Icon n="bellOff" s={18} /></span>Los avisos nunca nombran medicamentos ni diagnósticos.</li>
      </ul>
      <small>Prototipo académico · Universidad de Caldas · EPS e inventario simulados.</small>
    </aside>
  );
}

function Privacidad(props: { tipo: 'TITULAR' | 'TERCERO'; setTipo: (t: 'TITULAR' | 'TERCERO') => void; onSi: () => void; onNo: () => void; onBack?: () => void }) {
  const [acepto, setAcepto] = useState(false);
  const [completo, setCompleto] = useState(false);
  return (
    <Shell w="narrow">
      <Top back={props.onBack} step={{ n: 1, total: 3, label: 'Privacidad' }} />
      <div className="body">
        <div className="title-block"><h1>Antes de empezar</h1><p className="lead">Así usamos la información. No te pediremos ningún dato hasta que aceptes.</p></div>
        <div className="card">
          <div className="feature"><span className="tile-ic"><Icon n="file" s={18} /></span><div><b>Qué usamos</b><span>Tu cédula y los datos de contacto que tiene tu EPS.</span></div></div>
          <div className="feature"><span className="tile-ic"><Icon n="shield" s={18} /></span><div><b>Para qué</b><span>Verificar la identidad, revisar tus fórmulas, reservar y avisarte.</span></div></div>
          <div className="feature"><span className="tile-ic"><Icon n="refresh" s={18} /></span><div><b>Tus derechos</b><span>Puedes revocar tu consentimiento y pedir que eliminemos tus datos.</span></div></div>
          <button className="link" style={{ alignSelf: 'flex-start' }} onClick={() => setCompleto(true)}>Leer el aviso completo ›</button>
        </div>
        <h2>¿Quién está usando la app?</h2>
        <div className="stack" role="radiogroup">
          <button role="radio" aria-checked={props.tipo === 'TITULAR'} className={`choice ${props.tipo === 'TITULAR' ? 'on' : ''}`} onClick={() => props.setTipo('TITULAR')}>
            <span className="radio" /><span><b>Soy el titular</b><span className="sub">Gestiono mis propias fórmulas.</span></span></button>
          <button role="radio" aria-checked={props.tipo === 'TERCERO'} className={`choice ${props.tipo === 'TERCERO' ? 'on' : ''}`} onClick={() => props.setTipo('TERCERO')}>
            <span className="radio" /><span><b>Actúo con autorización del titular</b><span className="sub">Cuidador, familiar, tutor o facilitador.</span></span></button>
        </div>
        <label className="check"><input id="acepto" type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} />
          <span>Declaro que soy el titular o actúo con su autorización, y acepto el tratamiento de datos personales.</span></label>
      </div>
      <div className="foot">
        <button className="btn primary block" disabled={!acepto} onClick={props.onSi}>Aceptar y continuar</button>
        <button className="link" onClick={props.onNo}>No acepto</button>
      </div>
      {completo && (
        <Sheet onClose={() => setCompleto(false)}>
          <h2>Aviso de privacidad</h2>
          <p className="small">Pharma Express es un prototipo académico. Trata tus datos según la Ley 1581 de 2012 y el Decreto 1377 de 2013.</p>
          <p className="small">Usamos tu cédula para consultar en la EPS el celular y el correo registrados, y así enviarte un código. Tus fórmulas e historia clínica solo se usan para la prevalidación, y solo después de que des un permiso aparte.</p>
          <p className="small">Las notificaciones nunca incluyen medicamentos ni diagnósticos. Puedes revocar el consentimiento en cualquier momento y eliminaremos tus datos.</p>
          <button className="btn primary" onClick={() => setCompleto(false)}>Entendido</button>
        </Sheet>
      )}
    </Shell>
  );
}

function Codigo(props: {
  cedula: string; envio: { celular: string | null; correo: string | null; enviadoEn: number }; aviso: string; tipo: 'TITULAR' | 'TERCERO';
  onBack: () => void; onReenviar: () => Promise<void>; onAlterna: (m: string) => void; onPresencial: () => void; onOk: (cedula: string) => Promise<void>;
}) {
  const [d, setD] = useState<string[]>(['', '', '', '', '', '']);
  const [restantes, setRestantes] = useState(3);
  const [err, setErr] = useState('');
  const [ahora, setAhora] = useState(Date.now());
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => { const t = setInterval(() => setAhora(Date.now()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { refs.current[0]?.focus(); }, []);
  const quedan = Math.max(0, 600 - Math.floor((ahora - props.envio.enviadoEn) / 1000));
  const mmss = `${String(Math.floor(quedan / 60)).padStart(2, '0')}:${String(quedan % 60).padStart(2, '0')}`;
  const W = 'narrow' as const;

  const poner = (i: number, v: string) => {
    const dig = v.replace(/\D/g, '');
    if (dig.length > 1) { const arr = dig.slice(0, 6).split(''); setD([...arr, ...Array(6 - arr.length).fill('')]); refs.current[Math.min(arr.length, 5)]?.focus(); return; }
    const n = [...d]; n[i] = dig; setD(n);
    if (dig && i < 5) refs.current[i + 1]?.focus();
  };
  const verificar = async () => {
    setErr('');
    try {
      const r = await api('/identidad/verificar', { body: { cedula: props.cedula, codigo: d.join(''), tipo: props.tipo } });
      await props.onOk(r.cedula);
    } catch (e) {
      const b = (e as ApiError).body;
      if (b?.codigo === 'CODIGO_INCORRECTO') { setRestantes(b.restantes); setErr('El código no coincide. Revísalo e inténtalo de nuevo.'); setD(['', '', '', '', '', '']); refs.current[0]?.focus(); }
      else props.onAlterna(b?.codigo === 'CODIGO_VENCIDO' ? 'El código venció. Pide uno nuevo.' : b?.codigo === 'INTENTOS_AGOTADOS' ? 'Usaste los 3 intentos y el código quedó anulado.' : 'No pudimos verificar el código.');
    }
  };
  return (
    <Shell w={W}>
      <Top back={props.onBack} step={{ n: 3, total: 3, label: 'Código' }} />
      <div className="body">
        <div className="title-block"><h1>Escribe el código</h1><p className="lead">Lo enviamos a los medios registrados en la EPS:</p></div>
        {props.aviso && <Note tipo="info">{props.aviso}</Note>}
        <div className="card" style={{ gap: 8 }}>
          {props.envio.celular && <div className="row small"><Icon n="sms" s={18} /> SMS al celular terminado en <b>{props.envio.celular.replace(/\D/g, '').slice(-2)}</b></div>}
          {props.envio.correo && <div className="row small"><Icon n="mail" s={18} /> Correo a <b>{props.envio.correo}</b></div>}
        </div>
        <div className="stack">
          <span className="field">Código de 6 dígitos</span>
          <div className="otp">
            {d.map((v, i) => (
              <input key={i} ref={(el) => (refs.current[i] = el)} className={`input ${v ? 'filled' : ''}`} inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'}
                aria-label={`Dígito ${i + 1}`} value={v} onChange={(e) => poner(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Backspace' && !v && i > 0) refs.current[i - 1]?.focus(); if (e.key === 'Enter' && d.every(Boolean)) verificar(); }} />
            ))}
          </div>
          <div className="row" style={{ gap: 8 }}>
            {quedan > 0 ? <Chip tipo="warn" icon="clock">Vence en {mmss}</Chip> : <Chip tipo="bad" icon="clock">Código vencido</Chip>}
            <Chip tipo="neu">{restantes} {restantes === 1 ? 'intento disponible' : 'intentos disponibles'}</Chip>
          </div>
          {err && <Note tipo="bad" icon="alert">{err}</Note>}
        </div>
        <button className="btn primary block" disabled={!d.every(Boolean)} onClick={verificar}>Verificar</button>
        <div className="card flush">
          <div className="list-row" style={{ gridTemplateColumns: '1fr' }}><b>¿No te llegó el código?</b></div>
          <button className="list-row" onClick={async () => { await props.onReenviar(); setD(['', '', '', '', '', '']); setRestantes(3); setErr(''); }}>
            <Icon n="refresh" s={18} /><div><b>Pedir un código nuevo</b><span className="sub">El anterior deja de servir</span></div><Icon n="next" s={18} /></button>
          <button className="list-row" onClick={() => props.onAlterna('')}>
            <Icon n="phone" s={18} /><div><b>Cambié de número o correo</b><span className="sub">Te decimos cómo actualizarlo en tu EPS</span></div><Icon n="next" s={18} /></button>
          <button className="list-row" onClick={props.onPresencial}>
            <Icon n="store" s={18} /><div><b>Prefiero atención presencial</b></div><Icon n="next" s={18} /></button>
        </div>
      </div>
    </Shell>
  );
}

function Alterna({ msg, onBack, onNuevo, onPresencial }: { msg: string; onBack: () => void; onNuevo: () => void; onPresencial: () => void }) {
  const [eps, setEps] = useState<any[]>([]);
  useEffect(() => { api('/identidad/orientacion-eps').then(setEps).catch(() => {}); }, []);
  return (
    <Shell w="narrow">
      <Top back={onBack} title="Otras opciones" />
      <div className="body">
        <div className="title-block"><h1>No pudimos verificar la identidad</h1><p className="lead">Escoge cómo quieres continuar.</p></div>
        {msg && <Note tipo="warn" icon="alert">{msg}</Note>}
        <div className="card flush">
          <button className="list-row" onClick={onNuevo}><Icon n="refresh" s={18} /><div><b>Pedir un código nuevo</b><span className="sub">Vuelve a escribir la cédula</span></div><Icon n="next" s={18} /></button>
          <button className="list-row" onClick={onPresencial}><Icon n="store" s={18} /><div><b>Prefiero atención presencial</b><span className="sub">Reclama directamente en el punto</span></div><Icon n="next" s={18} /></button>
        </div>
        <div className="card">
          <div className="feature"><span className="tile-ic"><Icon n="phone" s={18} /></span><div><b>¿Cambió el celular o el correo?</b><span>Pharma Express no modifica tus datos. Actualízalos en tu EPS y vuelve a intentarlo.</span></div></div>
          {eps.map((e) => <p key={e.eps} className="small" style={{ paddingLeft: 48 }}><b>{e.eps}:</b> {e.actualizarDatos}</p>)}
        </div>
      </div>
    </Shell>
  );
}

function Inicio(props: {
  actual: Vinculo; avisos: any[]; sinLeer: number; onAvisos: () => void; onPrevalidar: () => void; onIr: (p: Pantalla) => void;
  onCambiar: () => void; onDesvincular: () => void; onRevocar: () => void;
}) {
  const [proxima, setProxima] = useState<any>(undefined);
  const [tg, setTg] = useState<string | null>(null);
  const [confirmar, setConfirmar] = useState(false);
  useEffect(() => {
    api('/solicitudes/estado').then((e) => setProxima(e.citas.find((c: any) => c.estado === 'RESERVADA') ?? null)).catch(() => setProxima(null));
    api('/canales/enlace-telegram').then((r) => setTg(r.url)).catch(() => {});
  }, []);
  const nombre = props.actual.nombre.split(' ')[0];
  return (
    <Shell>
      <div className="body" style={{ paddingTop: 18 }}>
        <div className="greet">
          <h1>Hola, {nombre}</h1>
          <button className="icon-btn" onClick={props.onAvisos} aria-label="Avisos"><Icon n="bell" />{props.sinLeer > 0 && <span className="dot" />}</button>
          <span className="avatar">{iniciales(props.actual.nombre)}</span>
        </div>
        <span className="who"><Icon n="users" s={14} /> Paciente: {props.actual.nombre} · <button onClick={props.onCambiar}>Cambiar</button></span>

        <div className="dash">
        <div className="hero">
          <span className="pill-tag">Antes de desplazarte</span>
          <PillArt />
          <h2>Consulta antes de salir</h2>
          <p>Revisa tus fórmulas y reserva tus medicamentos sin hacer fila.</p>
          <button className="btn white block" onClick={props.onPrevalidar}>Iniciar prevalidación <Icon n="arrow" s={18} /></button>
        </div>

        {proxima === undefined ? null : proxima ? (
          <div className="card">
            <div className="fhead"><span className="label">Tu próxima cita</span><Chip tipo="info" icon="check">Reservada</Chip></div>
            <div className="next">
              <div className="datebox"><small>{MESES_CORTOS[new Date(proxima.inicio).getMonth()]}</small><b>{new Date(proxima.inicio).getDate()}</b></div>
              <div><b className="mono">{rango(proxima.inicio, proxima.fin)}</b><div className="row small muted" style={{ gap: 4 }}><Icon n="pin" s={14} /> {proxima.punto}</div></div>
              <button className="qr-btn" onClick={() => props.onIr('codigoEntrega')} aria-label="Ver código de entrega"><Icon n="qr" s={22} /></button>
            </div>
          </div>
        ) : (
          <div className="card"><div className="feature"><span className="tile-ic"><Icon n="calendar" s={18} /></span><div><b>Aún no tienes citas</b><span>Inicia una prevalidación. Solo te damos cita cuando tus medicamentos quedan apartados.</span></div></div></div>
        )}
        </div>

        <div className="tiles">
          <button className="tile" onClick={props.onPrevalidar}><span className="tile-ic teal"><Icon n="camera" s={18} /></span><b>Cargar fórmulas</b><span className="sub">Nueva solicitud</span></button>
          <button className="tile" onClick={() => props.onIr('solicitudes')}><span className="tile-ic teal"><Icon n="file" s={18} /></span><b>Mis solicitudes</b><span className="sub">Estado por fórmula</span></button>
          <button className="tile" onClick={() => props.onIr('citas')}><span className="tile-ic teal"><Icon n="calendar" s={18} /></span><b>Mis citas</b><span className="sub">Ver o cancelar</span></button>
          <button className="tile" onClick={() => props.onIr('codigoEntrega')}><span className="tile-ic teal"><Icon n="qr" s={18} /></span><b>Código de entrega</b><span className="sub">QR y números</span></button>
        </div>

        <div className="home-bottom">
        <div className="stack">
        <span className="label">Privacidad y dispositivo</span>
        <div className="card flush">
          {tg && <a className="list-row" href={tg} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}><Icon n="send" s={18} /><div><b>Continuar en Telegram</b><span className="sub">El mismo recorrido, en una conversación</span></div><Icon n="next" s={18} /></a>}
          <button className="list-row" onClick={props.onDesvincular}><Icon n="unlink" s={18} /><div><b>Desvincular este navegador</b><span className="sub">Para ver este paciente aquí pediremos un código nuevo</span></div><Icon n="next" s={18} /></button>
          <button className="list-row danger" onClick={() => setConfirmar(true)}><Icon n="trash" s={18} /><div><b>Revocar consentimiento</b><span className="sub">Cancela las citas y elimina los datos del paciente</span></div><Icon n="next" s={18} /></button>
        </div>
        </div>
        <div className="stack">
          <span className="label">Cómo funciona</span>
          <div className="card">
            <ul className="numlist">
              <li data-n="1">Cargas tus fórmulas y la historia clínica.</li>
              <li data-n="2">Revisamos afiliación, vigencia, cobertura y autorización.</li>
              <li data-n="3">Escoges punto y ventana; el medicamento queda apartado.</li>
              <li data-n="4">Muestras tu código en el punto y recoges.</li>
            </ul>
          </div>
        </div>
        </div>
        <p className="tiny muted" style={{ textAlign: 'center' }}>Prototipo académico · EPS e inventario simulados · La atención presencial sigue disponible.</p>
      </div>
      {confirmar && (
        <Sheet onClose={() => setConfirmar(false)}>
          <span className="tile-ic" style={{ background: 'var(--bad-soft)', color: 'var(--bad)' }}><Icon n="trash" s={18} /></span>
          <h2>¿Revocar el consentimiento de {props.actual.nombre}?</h2>
          <p className="small">Cancelaremos sus citas activas, liberaremos los medicamentos para otras personas y eliminaremos sus datos de Pharma Express. No se puede deshacer.</p>
          <button className="btn danger" onClick={props.onRevocar}>Sí, revocar</button>
          <button className="btn" onClick={() => setConfirmar(false)}>Cancelar</button>
        </Sheet>
      )}
    </Shell>
  );
}

type Archivo = { id: number; file: File; numero: string };
const tamano = (b: number) => (b > 1_000_000 ? `${(b / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1000))} KB`);
const tipoArchivo = (f: File) => (f.type === 'application/pdf' ? 'PDF' : 'Foto');
let sec = 0;

function Carga({ actual, onBack, onResultado }: { actual: Vinculo; onBack: () => void; onResultado: (r: any) => void }) {
  const [formulas, setFormulas] = useState<Archivo[]>([]);
  const [historia, setHistoria] = useState<File | null>(null);
  const [reintento, setReintento] = useState(false);
  const [msg, setMsg] = useState('');
  const [enviando, setEnviando] = useState(false);
  const agregar = (files: FileList | null) => {
    if (!files) return;
    // Sugerimos el número si el nombre del archivo lo trae (por ejemplo rosa_formula_F-1001.pdf).
    setFormulas((prev) => [...prev, ...Array.from(files).map((file) => ({ id: ++sec, file, numero: (file.name.match(/F-?\d{3,6}/i)?.[0] ?? '').toUpperCase().replace(/^F(\d)/, 'F-$1') }))]);
  };
  const listo = formulas.length > 0 && formulas.every((f) => f.numero.trim()) && !!historia;
  const enviar = async () => {
    setMsg(''); setEnviando(true);
    const form = new FormData();
    formulas.forEach((f) => form.append('formulas', f.file));
    form.append('historia', historia!);
    form.append('numeros', JSON.stringify(formulas.map((f) => f.numero.trim().toUpperCase())));
    form.append('reintento', String(reintento));
    try { onResultado(await api('/solicitudes', { form })); }
    catch (e) {
      const b = (e as ApiError).body;
      if (b?.codigo === 'CARGAR_DE_NUEVO') { setReintento(true); setMsg(`No pudimos leer ${b.numeros.join(', ')}. Cárgala de nuevo con buena luz, sin recortes, y revisa el número.`); }
      else setMsg((e as Error).message);
    } finally { setEnviando(false); }
  };
  return (
    <Shell w="medium">
      <Top back={onBack} title="Nueva solicitud" stepper={1} />
      <div className="body">
        <div className="card" style={{ flexDirection: 'row', alignItems: 'center', padding: '10px 14px' }}>
          <Icon n="shield" s={18} /><span className="small" style={{ flex: 1 }}><b>{actual.nombre}</b> · {actual.eps}</span><Chip tipo="ok">Verificada</Chip>
        </div>
        <div className="title-block"><h1>Carga tus documentos</h1><p className="lead">Una foto o PDF de cada fórmula y de la historia clínica.</p></div>

        <span className="section-title">Fórmulas médicas</span>
        {formulas.map((f, i) => (
          <div key={f.id} className="file-card">
            <span className="tile-ic"><Icon n={tipoArchivo(f.file) === 'PDF' ? 'file' : 'image'} s={18} /></span>
            <div className="name"><b>Fórmula {i + 1}</b><span>{tipoArchivo(f.file)} · {tamano(f.file.size)} · {f.file.name}</span></div>
            <Chip tipo="ok" icon="check">Cargada</Chip>
            <button className="x-btn" aria-label="Quitar" onClick={() => setFormulas(formulas.filter((x) => x.id !== f.id))}><Icon n="x" s={18} /></button>
            <label className="field num" style={{ fontSize: 13 }}>Número impreso en la fórmula
              <input id={`num-${f.id}`} className="input" placeholder="Ej. F-1001" value={f.numero} onChange={(e) => setFormulas(formulas.map((x) => (x.id === f.id ? { ...x, numero: e.target.value } : x)))} />
            </label>
          </div>
        ))}
        <div className="upload-row">
          <label className="upload"><Icon n="camera" s={18} /> Tomar foto<input type="file" accept="image/*" capture="environment" onChange={(e) => { agregar(e.target.files); e.target.value = ''; }} /></label>
          <label className="upload"><Icon n="upload" s={18} /> Subir archivo<input type="file" accept="image/*,application/pdf" multiple onChange={(e) => { agregar(e.target.files); e.target.value = ''; }} /></label>
        </div>

        <span className="section-title">Historia clínica</span>
        {historia ? (
          <div className="file-card">
            <span className="tile-ic"><Icon n="file" s={18} /></span>
            <div className="name"><b>Historia clínica</b><span>{tipoArchivo(historia)} · {tamano(historia.size)} · {historia.name}</span></div>
            <Chip tipo="ok" icon="check">Cargada</Chip>
            <button className="x-btn" aria-label="Quitar" onClick={() => setHistoria(null)}><Icon n="x" s={18} /></button>
          </div>
        ) : (
          <label className="upload"><Icon n="upload" s={18} /> Subir historia clínica<input type="file" accept="image/*,application/pdf" onChange={(e) => setHistoria(e.target.files?.[0] ?? null)} /></label>
        )}

        <Note tipo="teal">Que se vea completo y nítido, sin reflejos. Usamos los documentos solo para esta revisión.</Note>
        {msg && <Note tipo="warn" icon="alert">{msg}</Note>}
      </div>
      <div className="foot"><button className="btn primary block" disabled={!listo || enviando} onClick={enviar}>{enviando ? 'Revisando…' : 'Revisar mis fórmulas'}</button></div>
    </Shell>
  );
}

function valorChequeo(c: any, pbsCompleto: boolean): [string, 'ok' | 'bad'] {
  const fecha = c.detalle.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  const f = fecha ? fechaLarga(new Date(fecha + 'T12:00:00')) : '';
  switch (c.regla) {
    case 'Vigencia': return [c.ok ? 'Vigente' : 'Vencida', c.ok ? 'ok' : 'bad'];
    case 'Cobertura PBS': return [pbsCompleto ? 'Cubiertos' : 'Fuera del PBS', 'ok'];
    case 'Autorización': return [c.ok ? (pbsCompleto ? 'No requiere' : 'Autorizada') : 'Falta', c.ok ? 'ok' : 'bad'];
    case 'Entrega habilitada': return [f ? `Desde ${f}` : c.ok ? 'Sí' : 'No', c.ok ? 'ok' : 'bad'];
    default: return [c.ok ? 'Cumple' : 'Sin datos', c.ok ? 'ok' : 'bad'];
  }
}

function Resultado({ r, actual, onBack, onAgenda, onInicio }: { r: any; actual: Vinculo; onBack: () => void; onAgenda: () => void; onInicio: () => void }) {
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({});
  const aptas = r.afiliacionActiva ? r.formulas.filter((f: any) => f.apta).length : 0;
  return (
    <Shell>
      <Top back={onBack} title="Nueva solicitud" stepper={2} />
      <div className="body">
        <div className="title-block"><h1>Resultado preliminar</h1>
          <p className="lead">{r.afiliacionActiva ? `${aptas} de tus ${r.formulas.length} fórmula${r.formulas.length === 1 ? '' : 's'} puede${aptas === 1 ? '' : 'n'} continuar.` : 'La solicitud se detuvo.'}</p></div>
        <Note tipo="info">Es una revisión preliminar con datos simulados de la EPS. La validación oficial se hace en el punto.</Note>
        <div className="card" style={{ padding: '10px 14px' }}>
          <div className="check-row" style={{ borderTop: 0, padding: 0 }}>
            <span className={`dot-ic ${r.afiliacionActiva ? 'ok' : 'bad'}`}><Icon n={r.afiliacionActiva ? 'check' : 'x'} s={12} w={3} /></span>
            <span>Afiliación a {actual.eps}</span><span className={`v ${r.afiliacionActiva ? 'ok' : 'bad'}`}>{r.afiliacionActiva ? 'Activa' : 'Inactiva'}</span>
          </div>
        </div>
        {!r.afiliacionActiva && <Note tipo="bad" icon="alert"><b>Revisa tu afiliación.</b> {r.orientacion} También puedes acudir a la atención presencial.</Note>}

        <div className="cards-grid">
        {r.formulas.map((f: any) => {
          const pbsCompleto = !!f.chequeos.find((c: any) => c.regla === 'Cobertura PBS')?.detalle.startsWith('Todos');
          const filas = f.chequeos.filter((c: any) => c.ok !== null && c.regla !== 'Lectura del documento');
          return (
            <div key={f.formulaId} className="card">
              <div className="fhead"><h2>Fórmula {f.numero}</h2>{f.apta ? <Chip tipo="ok" icon="check">Apta</Chip> : <Chip tipo="bad" icon="x">No apta</Chip>}</div>
              <p className="small muted" style={{ marginTop: -8 }}>{f.tipo ? `Tratamiento ${f.tipo === 'CRONICO' ? 'crónico' : 'agudo'} · ` : ''}{f.items.length} medicamento{f.items.length === 1 ? '' : 's'}</p>
              <div>
                {filas.map((c: any, k: number) => {
                  const [v, t] = valorChequeo(c, pbsCompleto);
                  return (
                    <div key={k} className="check-row">
                      <span className={`dot-ic ${t}`}><Icon n={t === 'ok' ? 'check' : 'x'} s={12} w={3} /></span><span>{c.regla}</span><span className={`v ${t}`}>{v}</span>
                    </div>
                  );
                })}
              </div>
              {!f.apta && <Note tipo="bad" icon="alert"><b>{f.motivo}.</b> {f.siguiente}</Note>}
              {abiertos[f.formulaId] && <ul className="meds">{f.items.map((i: any, k: number) => <li key={k}><Icon n="pill" s={16} /><span>{i.nombre} · {i.cantidad}</span></li>)}</ul>}
              {!!f.items.length && <button className="btn sm" onClick={() => setAbiertos({ ...abiertos, [f.formulaId]: !abiertos[f.formulaId] })}>{abiertos[f.formulaId] ? 'Ocultar medicamentos' : 'Ver medicamentos'}</button>}
            </div>
          );
        })}
        </div>
        {aptas > 0 && aptas < r.formulas.length && <p className="small muted">Las fórmulas no aptas puedes gestionarlas con tu EPS. Las aptas continúan.</p>}
      </div>
      <div className="foot">
        {aptas ? <button className="btn primary block" onClick={onAgenda}>Elegir punto y ventana</button> : <button className="btn primary block" onClick={onInicio}>Volver al inicio</button>}
      </div>
    </Shell>
  );
}

type Item = { formulaItemId: string; formulaId: string; numero: string; tipo: string; nombre: string; cantidad: number; puntos: { id: string; nombre: string; existencias: number }[]; sugerido: string };
type Grupo = { puntoId: string; punto: string; incluyeCronico: boolean; ventanas: { inicio: string; cuposLibres: number }[] };
type Punto = { id: string; nombre: string; dias: number[]; abre: number; cierra: number };
const DIAS_TXT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const horario = (p?: Punto) => {
  if (!p) return '';
  const d = [...p.dias].sort();
  const dias = d.length === 6 && !d.includes(0) ? 'Lun a sáb' : d.length === 5 && !d.includes(0) && !d.includes(6) ? 'Lun a vie' : d.map((x) => DIAS_TXT[x]).join(', ');
  return `${dias} · ${p.abre}:00 – ${p.cierra}:00`;
};

function Agenda({ solicitudId, actual, onBack, onInicio, onListo }: { solicitudId: string; actual: Vinculo; onBack: () => void; onInicio: () => void; onListo: (ids: string[]) => void }) {
  const [disp, setDisp] = useState<{ sinDisponibilidad: { numero: string }[]; items: Item[] } | null>(null);
  const [cat, setCat] = useState<Punto[]>([]);
  const [principal, setPrincipal] = useState('');
  const [paso, setPaso] = useState<'punto' | 'ventana' | 'revisar' | 'sin'>('punto');
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [hoy, setHoy] = useState(new Date());
  const [k, setK] = useState(0);
  const [dia, setDia] = useState<Record<string, 'hoy' | 'manana'>>({});
  const [elegidas, setElegidas] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api('/catalogos/puntos').then(setCat).catch(() => {});
    api(`/agenda/disponibilidad?solicitudId=${solicitudId}`).then((d) => {
      setDisp(d);
      if (!d.items.length) return setPaso('sin');
      const cuenta: Record<string, number> = {};
      d.items.forEach((i: Item) => i.puntos.forEach((p) => (cuenta[p.id] = (cuenta[p.id] ?? 0) + 1)));
      setPrincipal(Object.entries(cuenta).sort((a, b) => b[1] - a[1])[0][0]);
    });
  }, [solicitudId]);

  if (!disp) return <Shell><Top back={onBack} title="Nueva solicitud" stepper={3} /><div className="body"><p className="empty">Buscando dónde están tus medicamentos…</p></div></Shell>;

  const items = disp.items;
  const asignacion = () => items.map((i) => ({ formulaItemId: i.formulaItemId, puntoId: i.puntos.some((p) => p.id === principal) ? principal : i.puntos[0].id }));
  const candidatos = [...new Map(items.flatMap((i) => i.puntos.map((p) => [p.id, p.nombre] as const))).entries()]
    .map(([id, nombre]) => ({ id, nombre, tiene: items.filter((i) => i.puntos.some((p) => p.id === id)) }))
    .sort((a, b) => b.tiene.length - a.tiene.length);
  const cargarVentanas = async () => {
    const r = await api('/agenda/ventanas', { body: { asignacion: asignacion() } });
    const gs: Grupo[] = [...r.grupos].sort((a: Grupo, b: Grupo) => (a.puntoId === principal ? -1 : b.puntoId === principal ? 1 : 0));
    setHoy(new Date(r.hoy));
    setGrupos(gs);
    const d: Record<string, 'hoy' | 'manana'> = {};
    gs.forEach((g) => (d[g.puntoId] = g.ventanas.some((v) => mismoDia(new Date(v.inicio), new Date(r.hoy))) ? 'hoy' : 'manana'));
    setDia(d);
    return gs;
  };
  const itemsDe = (puntoId: string) => { const a = asignacion(); return items.filter((i) => a.find((x) => x.formulaItemId === i.formulaItemId)?.puntoId === puntoId); };

  if (paso === 'sin') return (
    <Shell>
      <Top back={onBack} title="Nueva solicitud" stepper={3} />
      <div className="body">
        <span className="tile-ic big" style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}><Icon n="clock" s={24} /></span>
        <div className="title-block"><h1>Por ahora no hay existencias</h1><p className="lead">Tus fórmulas son aptas, pero {disp.sinDisponibilidad.length > 1 ? 'algunos medicamentos no están' : 'algún medicamento no está'} disponible en ningún punto.</p></div>
        <Note tipo="warn" icon="bell">Espera 48 horas para volver a validar. Te enviaremos un único recordatorio. No te damos cita sin medicamento apartado.</Note>
        <p className="small muted">Fórmulas afectadas: {disp.sinDisponibilidad.map((s) => s.numero).join(', ')}</p>
      </div>
      <div className="foot"><button className="btn primary block" onClick={onInicio}>Volver al inicio</button></div>
    </Shell>
  );

  if (paso === 'punto') {
    const sel = candidatos.find((c) => c.id === principal);
    const faltan = sel ? items.length - sel.tiene.length : 0;
    return (
      <Shell>
        <Top back={onBack} title="Nueva solicitud" stepper={3} />
        <div className="body">
          <div className="title-block"><h1>¿Dónde quieres recoger?</h1><p className="lead">{items.length} medicamento{items.length === 1 ? '' : 's'} de tus fórmulas aptas.</p></div>
          <Note tipo="info">Inventario simulado. Nada queda reservado hasta que confirmes la cita.</Note>
          {!!disp.sinDisponibilidad.length && <Note tipo="warn" icon="alert"><b>Sin existencias:</b> {disp.sinDisponibilidad.map((s) => s.numero).join(', ')}. Esa fórmula no se agenda; espera 48 horas para volver a validar.</Note>}
          <span className="label">Puntos con existencias</span>
          <div className="cards-grid">
          {candidatos.map((c) => {
            const todos = c.tiene.length === items.length;
            return (
              <button key={c.id} role="radio" aria-checked={principal === c.id} className={`choice ${principal === c.id ? 'on' : ''}`} onClick={() => setPrincipal(c.id)}>
                <span className="radio" />
                <span className="stack" style={{ gap: 8 }}>
                  <span><b>{c.nombre}</b><span className="sub row" style={{ gap: 4 }}><Icon n="clock" s={13} /> {horario(cat.find((p) => p.id === c.id))}</span></span>
                  {todos ? <Chip tipo="ok" icon="check">{items.length === 1 ? 'Tiene tu medicamento' : `Tiene los ${items.length} medicamentos`}</Chip> : <Chip tipo="warn">Tiene {c.tiene.length} de {items.length}</Chip>}
                  <ul className="meds">
                    {items.map((i) => {
                      const si = c.tiene.includes(i);
                      return <li key={i.formulaItemId}><span className={si ? 'si' : 'no'}><Icon n={si ? 'check' : 'x'} s={16} w={2.6} /></span><span>{i.nombre}{si ? '' : ' · aquí no'}</span></li>;
                    })}
                  </ul>
                  <span className="row small muted" style={{ gap: 6, borderTop: '1px solid var(--line)', paddingTop: 8 }}><Icon n="calendar" s={15} />{todos ? 'Todo en una sola cita' : 'Necesitarías otra cita en otro punto'}</span>
                </span>
              </button>
            );
          })}
          </div>
          {faltan > 0 && <Note tipo="info">Los medicamentos que no hay en este punto se reservan en otro punto con existencias, con su propia cita. Todas las citas se confirman juntas o ninguna.</Note>}
          {msg && <Note tipo="bad" icon="alert">{msg}</Note>}
        </div>
        <div className="foot"><button className="btn primary block" disabled={!principal} onClick={async () => { setMsg(''); await cargarVentanas(); setElegidas({}); setK(0); setPaso('ventana'); }}>Elegir ventana</button></div>
      </Shell>
    );
  }

  if (paso === 'ventana') {
    const g = grupos[k];
    if (!g) return null;
    const p = cat.find((x) => x.id === g.puntoId);
    const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
    const conCupoHoy = g.ventanas.some((v) => mismoDia(new Date(v.inicio), hoy));
    const conCupoManana = g.ventanas.some((v) => mismoDia(new Date(v.inicio), manana));
    const d = dia[g.puntoId] ?? 'manana';
    const fechaDia = d === 'hoy' ? hoy : manana;
    const horas = p ? Array.from({ length: p.cierra - p.abre }, (_, i) => p.abre + i) : [];
    const abierto = !!p?.dias.includes(fechaDia.getDay());
    const elegida = elegidas[g.puntoId];
    const subHoy = g.incluyeCronico ? 'No aplica a crónicos' : !p?.dias.includes(hoy.getDay()) ? 'Cerrado' : conCupoHoy ? 'Con cupo' : 'Sin ventanas';
    const subManana = !p?.dias.includes(manana.getDay()) ? 'Cerrado' : conCupoManana ? fechaLarga(manana) : 'Sin cupo';
    return (
      <Shell w="medium">
        <Top back={() => (k > 0 ? setK(k - 1) : setPaso('punto'))} title={grupos.length > 1 ? `Elegir ventana · ${k + 1} de ${grupos.length}` : 'Elegir ventana'} />
        <div className="body">
          <span className="chip info" style={{ alignSelf: 'flex-start' }}><Icon n="pin" s={13} /> {g.punto}</span>
          <div className="title-block"><h1>¿Cuándo vas a recoger?</h1><p className="lead">Cada ventana dura una hora.</p></div>
          {grupos.length > 1 && <p className="small muted">En este punto: {itemsDe(g.puntoId).map((i) => i.nombre).join(' · ')}</p>}
          <div className="seg">
            <button className={d === 'hoy' ? 'on' : ''} disabled={g.incluyeCronico || !conCupoHoy} onClick={() => setDia({ ...dia, [g.puntoId]: 'hoy' })}><b>Hoy</b><span>{subHoy}</span></button>
            <button className={d === 'manana' ? 'on' : ''} disabled={!conCupoManana} onClick={() => setDia({ ...dia, [g.puntoId]: 'manana' })}><b>Mañana</b><span>{subManana}</span></button>
          </div>
          {g.incluyeCronico && <Note tipo="teal">Tu fórmula es de tratamiento crónico, así que la cita solo puede ser mañana.</Note>}
          {!g.incluyeCronico && <Note tipo="teal">Tratamiento agudo: puedes recoger hoy, desde una hora después de agendar, o mañana.</Note>}
          {!g.ventanas.length ? (
            <Note tipo="warn" icon="alert">No hay ventanas con cupo en los días permitidos. Si confirmas, esta fórmula queda sin disponibilidad y te recordaremos volver a validar en 48 horas.</Note>
          ) : (
            <>
              <div className="fhead"><span className="section-title">Ventanas para {d === 'hoy' ? 'hoy' : 'mañana'}</span><span className="tiny muted">{fechaLarga(fechaDia)}</span></div>
              {abierto && (
                <div className="slots">
                  {horas.map((h) => {
                    const ini = new Date(fechaDia.getFullYear(), fechaDia.getMonth(), fechaDia.getDate(), h);
                    const v = g.ventanas.find((x) => new Date(x.inicio).getTime() === ini.getTime());
                    const on = !!v && elegida === v.inicio;
                    const pasada = d === 'hoy' && ini.getTime() < hoy.getTime() + 3_600_000;
                    return (
                      <button key={h} className={`slot ${on ? 'on' : ''}`} disabled={!v} onClick={() => v && setElegidas({ ...elegidas, [g.puntoId]: v.inicio })}>
                        <b>{h}:00 – {h + 1}:00</b><span>{on ? 'Elegida' : v ? (v.cuposLibres === 1 ? '1 cupo' : 'Con cupo') : pasada ? 'No disponible' : 'Sin cupo'}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <p className="small muted">Llega dentro de la ventana. Si llegas antes, espera su inicio. Al terminar la ventana, la reserva se libera.</p>
            </>
          )}
        </div>
        <div className="foot">
          {elegida && <p className="small" style={{ textAlign: 'center' }}>Elegiste <b>{fechaLarga(elegida)} · {rango(elegida, new Date(new Date(elegida).getTime() + 3_600_000))}</b></p>}
          <button className="btn primary block" disabled={!!g.ventanas.length && !elegida} onClick={() => (k < grupos.length - 1 ? setK(k + 1) : setPaso('revisar'))}>{k < grupos.length - 1 ? 'Siguiente punto' : 'Revisar y confirmar'}</button>
        </div>
      </Shell>
    );
  }

  // revisar
  const confirmar = async () => {
    setEnviando(true); setMsg('');
    try {
      const r = await api('/agenda/confirmar', { body: { asignacion: asignacion(), ventanas: elegidas } });
      if (r.citas.length) onListo(r.citas);
      else setPaso('sin');
    } catch (e) {
      const b = (e as ApiError).body;
      setMsg(b?.codigo === 'CONFLICTO' ? 'Otra persona confirmó antes el último cupo. Estas son las opciones actualizadas.' : (e as Error).message);
      await cargarVentanas(); setElegidas({}); setK(0); setPaso('ventana');
    } finally { setEnviando(false); }
  };
  return (
    <Shell>
      <Top back={() => setPaso('ventana')} title="Revisar y confirmar" />
      <div className="body">
        <Chip tipo="neu" icon="clock">Aún sin reservar</Chip>
        <h1>{grupos.length > 1 ? 'Revisa tus citas' : 'Revisa tu cita'}</h1>
        <div className="cards-grid">
        {grupos.map((g, idx) => {
          const ini = elegidas[g.puntoId];
          return (
            <div key={g.puntoId} className="card" style={{ gap: 0 }}>
              {grupos.length > 1 && <span className="label" style={{ paddingBottom: 10 }}>Cita {idx + 1} de {grupos.length}</span>}
              {idx === 0 && <div className="kv"><span className="ic-muted"><Icon n="user" s={18} /></span><div><small>Paciente</small><b>{actual.nombre}</b></div></div>}
              <div className="kv"><span className="ic-muted"><Icon n="pin" s={18} /></span><div><small>Punto</small><b>{g.punto}</b><small>{horario(cat.find((p) => p.id === g.puntoId))}</small></div></div>
              <div className="kv"><span className="ic-muted"><Icon n="calendar" s={18} /></span><div><small>Fecha y ventana</small><b>{ini ? `${fechaLarga(ini)} · ${rango(ini, new Date(new Date(ini).getTime() + 3_600_000))}` : 'Sin ventana'}</b></div></div>
              <div className="kv"><span className="ic-muted"><Icon n="pill" s={18} /></span><div><small>Medicamentos</small>{itemsDe(g.puntoId).map((i) => <b key={i.formulaItemId} style={{ display: 'block' }}>{i.nombre} · {i.cantidad}</b>)}</div></div>
            </div>
          );
        })}
        </div>
        <span className="section-title">Al confirmar</span>
        <ul className="numlist">
          <li data-n="1">Reservamos los medicamentos y tu cupo al mismo tiempo.</li>
          <li data-n="2">Recibes un código de entrega en QR y en números.</li>
          <li data-n="3">Te avisamos por SMS, correo y Telegram, sin nombrar medicamentos.</li>
        </ul>
        <Note tipo="warn" icon="alert">Si otra persona confirma antes el último cupo, te mostraremos opciones actualizadas.</Note>
        {msg && <Note tipo="bad" icon="alert">{msg}</Note>}
      </div>
      <div className="foot"><button className="btn primary block" disabled={enviando} onClick={confirmar}>{enviando ? 'Reservando…' : 'Confirmar y reservar'}</button></div>
    </Shell>
  );
}

function Qr({ texto }: { texto: string }) {
  const [src, setSrc] = useState('');
  useEffect(() => { QRCode.toDataURL(texto, { width: 320, margin: 1, color: { dark: '#12283a' } }).then(setSrc); }, [texto]);
  return src ? <img src={src} alt="Código QR de entrega" className="qr" /> : <div className="qr" />;
}

function TarjetaCodigo({ c, total, idx }: { c: any; total: number; idx: number }) {
  return (
    <>
      <div className="card qr-card">
        <div className="fhead"><b>{total > 1 ? `Código de entrega · cita ${idx + 1} de ${total}` : 'Código de entrega'}</b><Chip tipo="teal">Un solo uso</Chip></div>
        <Qr texto={`PX:${c.codigo}`} />
        <div className="code-num">{c.codigo.slice(0, 4)} {c.codigo.slice(4)}</div>
        <p className="tiny muted">Muestra el QR o los números en el punto. Lo encuentras aquí cuando lo necesites.</p>
      </div>
      <div className="card" style={{ gap: 10 }}>
        <div className="row small" style={{ gap: 10 }}><Icon n="calendar" s={18} /><b>{fechaLarga(c.inicio)} · {rango(c.inicio, c.fin)}</b></div>
        <div className="row small" style={{ gap: 10 }}><Icon n="pin" s={18} />{c.punto}</div>
        <div className="row small" style={{ gap: 10 }}><Icon n="pill" s={18} />{c.items.length} medicamento{c.items.length === 1 ? '' : 's'} reservado{c.items.length === 1 ? '' : 's'}</div>
        <div className="row small" style={{ gap: 10 }}><Icon n="bell" s={18} />Recordatorios: la noche anterior y una hora antes</div>
      </div>
    </>
  );
}

function Confirmado({ ids, onCerrar }: { ids: string[]; onCerrar: () => void }) {
  const [citas, setCitas] = useState<any[] | null>(null);
  useEffect(() => { api('/solicitudes/estado').then((e) => setCitas(e.citas.filter((c: any) => ids.includes(c.id)))); }, [ids]);
  return (
    <Shell>
      <Top right={<span />} back={onCerrar} title="" />
      <div className="body">
        <div className="success">
          <span className="ring"><span><Icon n="check" s={24} w={3} /></span></span>
          <h1>{ids.length > 1 ? '¡Citas confirmadas!' : '¡Cita confirmada!'}</h1>
          <p className="lead">Tus medicamentos quedaron reservados para ti.</p>
        </div>
        <div className="cards-grid">{citas?.map((c, i) => <div key={c.id} className="stack"><TarjetaCodigo c={c} idx={i} total={citas.length} /></div>)}</div>
      </div>
      <div className="foot"><button className="btn primary block" onClick={onCerrar}>Ir al inicio</button></div>
    </Shell>
  );
}

function CodigoEntrega({ onBack }: { onBack: () => void }) {
  const [citas, setCitas] = useState<any[] | null>(null);
  useEffect(() => { api('/solicitudes/estado').then((e) => setCitas(e.citas.filter((c: any) => c.estado === 'RESERVADA'))); }, []);
  return (
    <Shell>
      <Top back={onBack} title="Código de entrega" />
      <div className="body">
        {citas && !citas.length && <p className="empty">No tienes citas reservadas. Cuando confirmes una, tu código aparecerá aquí.</p>}
        <div className="cards-grid">{citas?.map((c, i) => <div key={c.id} className="stack"><TarjetaCodigo c={c} idx={i} total={citas.length} /></div>)}</div>
      </div>
    </Shell>
  );
}

function Citas({ onBack, onCodigo }: { onBack: () => void; onCodigo: () => void }) {
  const [citas, setCitas] = useState<any[] | null>(null);
  const [cancelar, setCancelar] = useState<any>(null);
  const cargar = () => api('/solicitudes/estado').then((e) => setCitas([...e.citas].sort((a, b) => +new Date(b.inicio) - +new Date(a.inicio))));
  useEffect(() => { cargar(); }, []);
  return (
    <Shell>
      <Top back={onBack} title="Mis citas" />
      <div className="body">
        {citas && !citas.length && <p className="empty">Aún no tienes citas.</p>}
        <div className="cards-grid">
        {citas?.map((c) => {
          const [t, tipo] = ESTADO_CITA[c.estado] ?? [c.estado, 'neu'];
          return (
            <div key={c.id} className="card">
              <div className="next" style={{ gridTemplateColumns: '50px 1fr auto' }}>
                <div className="datebox"><small>{MESES_CORTOS[new Date(c.inicio).getMonth()]}</small><b>{new Date(c.inicio).getDate()}</b></div>
                <div><b className="mono">{rango(c.inicio, c.fin)}</b><div className="row small muted" style={{ gap: 4 }}><Icon n="pin" s={14} /> {c.punto}</div></div>
                <Chip tipo={tipo}>{t}</Chip>
              </div>
              <ul className="meds">{c.items.map((i: any, k: number) => <li key={k}><Icon n="pill" s={16} /><span>{i.nombre} · {i.cantidad}{i.resultado ? ` · ${ESTADO_ITEM[i.resultado] ?? i.resultado}` : ''}</span></li>)}</ul>
              {c.estado === 'RESERVADA' && (
                <div className="grid2">
                  <button className="btn sm" onClick={onCodigo}><Icon n="qr" s={16} /> Ver código</button>
                  <button className="btn sm ghost-danger" onClick={() => setCancelar(c)}>Cancelar cita</button>
                </div>
              )}
            </div>
          );
        })}
        </div>
        <p className="small muted">No hay reprogramación: para otra fecha, cancela e inicia una nueva solicitud.</p>
      </div>
      {cancelar && (
        <Sheet onClose={() => setCancelar(null)}>
          <h2>¿Cancelar la cita del {fechaLarga(cancelar.inicio)}?</h2>
          <p className="small">Los medicamentos y el cupo quedan disponibles para otras personas. Si necesitas otra cita, inicia una nueva solicitud.</p>
          <button className="btn danger" onClick={async () => { await api(`/agenda/citas/${cancelar.id}/cancelar`, { method: 'POST' }); setCancelar(null); cargar(); }}>Sí, cancelar</button>
          <button className="btn" onClick={() => setCancelar(null)}>No, mantenerla</button>
        </Sheet>
      )}
    </Shell>
  );
}

function Solicitudes({ onBack }: { onBack: () => void }) {
  const [formulas, setFormulas] = useState<any[] | null>(null);
  useEffect(() => { api('/solicitudes/estado').then((e) => setFormulas(e.formulas)); }, []);
  return (
    <Shell>
      <Top back={onBack} title="Mis solicitudes" />
      <div className="body">
        {formulas && !formulas.length && <p className="empty">Aún no has cargado fórmulas.</p>}
        <div className="cards-grid">
        {formulas?.map((f) => {
          const [t, tipo] = ESTADO_FORMULA[f.estado] ?? [f.estado, 'neu'];
          return (
            <div key={f.id} className="card">
              <div className="fhead"><h2>Fórmula {f.numero}</h2><Chip tipo={tipo}>{t}</Chip></div>
              {f.tipo && <p className="small muted" style={{ marginTop: -8 }}>Tratamiento {f.tipo === 'CRONICO' ? 'crónico' : 'agudo'}</p>}
              {!!f.items.length && <ul className="meds">{f.items.map((i: any, k: number) => <li key={k}><Icon n="pill" s={16} /><span>{i.nombre} · {i.cantidad}{ESTADO_ITEM[i.estado] ? ` · ${ESTADO_ITEM[i.estado]}` : ''}</span></li>)}</ul>}
              {f.motivo && (f.estado === 'NO_APTA' || f.estado === 'SIN_DISPONIBILIDAD') && <Note tipo={f.estado === 'NO_APTA' ? 'bad' : 'warn'} icon="alert"><b>{f.motivo}.</b> {f.siguiente ?? ''}{f.estado === 'SIN_DISPONIBILIDAD' ? ' Espera 48 horas para volver a validar.' : ''}</Note>}
              {f.estado === 'CERRADA_NO_ENTREGADOS' && <Note tipo="warn">Lo no entregado se gestiona directamente con Disfarma.</Note>}
            </div>
          );
        })}
        </div>
      </div>
    </Shell>
  );
}
