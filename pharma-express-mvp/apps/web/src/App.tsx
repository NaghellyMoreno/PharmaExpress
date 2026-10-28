import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { api, ApiError, estadoTexto, fecha, fijarPaciente, hora } from './lib/api';

type Vinculo = { cedula: string; nombre: string; eps: string; activa: boolean; venceEn: string };
type Pantalla =
  | 'privacidad' | 'cedula' | 'codigo' | 'alterna' | 'presencial' | 'pacientes' | 'inicio'
  | 'salud' | 'carga' | 'resultado' | 'agenda' | 'confirmado' | 'estado' | 'revocado';

const Presencial = () => <p className="small muted">La atención presencial en el punto sigue disponible aunque no uses Pharma Express.</p>;
const Preliminar = () => <div className="alert info small">Resultado preliminar con datos simulados de la EPS. La validación oficial la hace el dispensador en el punto.</div>;

export function App() {
  const [p, setP] = useState<Pantalla>('privacidad');
  const [tipo, setTipo] = useState<'TITULAR' | 'TERCERO'>('TITULAR');
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [actual, setActual] = useState<Vinculo | null>(null);
  const [msg, setMsg] = useState('');
  const [cedula, setCedula] = useState('');
  const [envio, setEnvio] = useState<any>(null);
  const [resultado, setResultado] = useState<any>(null);
  const [avisos, setAvisos] = useState<any[]>([]);

  const cargarVinculos = async () => {
    const v = await api<Vinculo[]>('/canales/vinculaciones');
    setVinculos(v);
    return v;
  };
  useEffect(() => {
    cargarVinculos().then((v) => v.length && setP('pacientes'));
  }, []);
  useEffect(() => {
    if (!actual) return;
    const leer = () => api('/canales/notificaciones').then(setAvisos).catch(() => {});
    leer();
    const t = setInterval(leer, 20_000);
    return () => clearInterval(t);
  }, [actual]);

  const ir = (x: Pantalla, m = '') => { setMsg(m); setP(x); };
  const escoger = async (v: Vinculo) => {
    if (!v.activa) {
      // BR-07: vinculación vencida → nuevo código.
      setCedula(v.cedula);
      try { setEnvio(await api('/identidad/codigo', { body: { cedula: v.cedula, acepta: true } })); ir('codigo', 'La vinculación venció. Te enviamos un código nuevo.'); } catch (e) { ir('alterna', (e as Error).message); }
      return;
    }
    fijarPaciente(v.cedula);
    setActual(v);
    ir('inicio');
  };

  return (
    <div className="shell">
      <header className="appbar">
        <span className="marca">Pharma <em>Express</em></span>
        {actual && <span className="quien">Gestionando para: {actual.nombre}</span>}
      </header>
      <main className="pantalla">
        {p === 'privacidad' && (
          <>
            <span className="eyebrow">Aviso de privacidad</span>
            <h1>Antes de empezar</h1>
            <p>Pharma Express usa tu cédula y los datos de contacto registrados en tu EPS para verificar tu identidad, y tus fórmulas e historia clínica solo para prevalidarlas y agendar tu entrega. Las notificaciones nunca incluyen medicamentos ni diagnósticos. Puedes revocar tu consentimiento y pedir que eliminemos tus datos en cualquier momento.</p>
            <fieldset className="stack">
              <legend className="sr">Quién acepta</legend>
              <label className="opt"><input type="radio" name="tipo" checked={tipo === 'TITULAR'} onChange={() => setTipo('TITULAR')} /> <span><b>Soy el titular</b></span></label>
              <label className="opt"><input type="radio" name="tipo" checked={tipo === 'TERCERO'} onChange={() => setTipo('TERCERO')} /> <span><b>Actúo con autorización del titular</b><br /><span className="small muted">Cuidador, tutor, familiar o facilitador comunitario.</span></span></label>
            </fieldset>
            <div className="row">
              <button className="btn primary" onClick={() => ir('cedula')}>Acepto el tratamiento de datos</button>
              <button className="btn" onClick={() => ir('presencial', 'Sin aceptar el tratamiento de datos no registramos nada.')}>No acepto</button>
            </div>
            <Presencial />
          </>
        )}

        {p === 'cedula' && (
          <form className="stack" onSubmit={async (e) => {
            e.preventDefault();
            try { setEnvio(await api('/identidad/codigo', { body: { cedula, acepta: true } })); ir('codigo'); }
            catch (err) {
              const c = (err as ApiError).body?.codigo;
              ir('alterna', c === 'CEDULA_NO_EXISTE' ? 'No encontramos esa cédula en la EPS.' : c === 'SIN_CONTACTO' ? 'No hay celular ni correo registrados en la EPS.' : (err as Error).message);
            }
          }}>
            <span className="eyebrow">Identidad</span>
            <h1>Cédula del paciente</h1>
            <p className="small muted">Enviaremos un código al celular y al correo registrados en la EPS.</p>
            <label className="field">Número de cédula<input inputMode="numeric" value={cedula} onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))} /></label>
            <button className="btn primary">Enviar código</button>
          </form>
        )}

        {p === 'codigo' && (
          <form className="stack" onSubmit={async (e) => {
            e.preventDefault();
            const codigo = (new FormData(e.currentTarget).get('codigo') as string).trim();
            try {
              const r = await api('/identidad/verificar', { body: { cedula, codigo, tipo } });
              const v = await cargarVinculos();
              await escoger(v.find((x) => x.cedula === r.cedula)!);
            } catch (err) {
              const b = (err as ApiError).body;
              if (b?.codigo === 'CODIGO_INCORRECTO') setMsg(`Código incorrecto. Te quedan ${b.restantes} intento${b.restantes === 1 ? '' : 's'}.`);
              else ir('alterna', b?.codigo === 'CODIGO_VENCIDO' ? 'El código venció.' : b?.codigo === 'INTENTOS_AGOTADOS' ? 'Agotaste los 3 intentos.' : 'No pudimos verificar el código.');
            }
          }}>
            <span className="eyebrow">Identidad</span>
            <h1>Escribe el código</h1>
            <p className="small">Lo enviamos al celular {envio?.celular}{envio?.correo ? ` y al correo ${envio.correo}` : ''}. Vence a las {envio && hora(envio.venceEn)}.</p>
            <input name="codigo" className="code" inputMode="numeric" maxLength={6} autoComplete="one-time-code" aria-label="Código de 6 dígitos" />
            {msg && <div className="alert warn">{msg}</div>}
            <button className="btn primary">Verificar</button>
            <div className="row">
              <button type="button" className="btn link" onClick={async () => setEnvio(await api('/identidad/codigo', { body: { cedula, acepta: true } }))}>Enviar un código nuevo</button>
              <button type="button" className="btn link" onClick={() => ir('alterna')}>No recibí el código</button>
            </div>
          </form>
        )}

        {p === 'alterna' && <RutaAlterna msg={msg} onNuevo={() => ir('cedula')} />}
        {p === 'presencial' && (<><h1>Te atendemos en el punto</h1><div className="alert info">{msg} Puedes reclamar tus medicamentos con la atención presencial de siempre.</div><button className="btn" onClick={() => ir('privacidad')}>Volver</button></>)}

        {p === 'pacientes' && (
          <>
            <span className="eyebrow">Pacientes vinculados a este navegador</span>
            <h1>¿Para quién gestionas hoy?</h1>
            <div className="stack">
              {vinculos.map((v) => (
                <button key={v.cedula} className="opt full" onClick={() => escoger(v)}>
                  <span><b>{v.nombre}</b><br /><span className="small muted">{v.eps}</span></span>
                  <span className={`chip ${v.activa ? 'ok' : 'warn'}`}>{v.activa ? 'Activa' : 'Vencida'}</span>
                </button>
              ))}
            </div>
            <button className="btn" onClick={() => { fijarPaciente(null); setActual(null); ir('privacidad'); }}>Agregar otro paciente</button>
            <Presencial />
          </>
        )}

        {p === 'inicio' && actual && (
          <Inicio
            actual={actual}
            avisos={avisos}
            onNueva={async () => ir((await api('/identidad/salud')).autorizada ? 'carga' : 'salud')}
            onEstado={() => ir('estado')}
            onCambiar={() => ir('pacientes')}
            onDesvincular={async () => { await api('/canales/vinculaciones/actual', { method: 'DELETE' }); fijarPaciente(null); setActual(null); const v = await cargarVinculos(); ir(v.length ? 'pacientes' : 'privacidad'); }}
            onRevocar={async () => { await api('/identidad/revocar', { method: 'POST' }); fijarPaciente(null); setActual(null); await cargarVinculos(); ir('revocado'); }}
          />
        )}

        {p === 'salud' && (
          <>
            <span className="eyebrow">Autorización separada</span>
            <h1>Datos de salud</h1>
            <p>Para prevalidar necesitamos leer tus fórmulas y tu historia clínica. Son datos sensibles: solo los usamos para la prevalidación y nunca aparecen en las notificaciones. Esta autorización es voluntaria.</p>
            <div className="row">
              <button className="btn primary" onClick={async () => { await api('/identidad/salud', { method: 'POST' }); ir('carga'); }}>Autorizo</button>
              <button className="btn" onClick={() => ir('presencial', 'Sin la autorización de datos de salud no pedimos documentos.')}>No autorizo</button>
            </div>
          </>
        )}

        {p === 'carga' && <Carga onResultado={(r) => { setResultado(r); ir('resultado'); }} />}
        {p === 'resultado' && resultado && <Resultado r={resultado} onAgenda={() => ir('agenda')} onInicio={() => ir('inicio')} />}
        {p === 'agenda' && resultado && <Agenda solicitudId={resultado.solicitudId} onListo={() => ir('confirmado')} onInicio={() => ir('inicio')} />}
        {(p === 'confirmado' || p === 'estado') && <Estado titulo={p === 'confirmado' ? 'Tus medicamentos están reservados' : 'Fórmulas y citas'} onInicio={() => ir('inicio')} />}
        {p === 'revocado' && (<><h1>Consentimiento revocado</h1><div className="alert ok">Cancelamos las citas activas, liberamos los medicamentos, desvinculamos los canales y eliminamos los datos del paciente.</div><button className="btn" onClick={() => ir(vinculos.length ? 'pacientes' : 'privacidad')}>Continuar</button></>)}
      </main>
    </div>
  );
}

function RutaAlterna({ msg, onNuevo }: { msg: string; onNuevo: () => void }) {
  const [eps, setEps] = useState<any[]>([]);
  useEffect(() => { api('/identidad/orientacion-eps').then(setEps); }, []);
  return (
    <>
      <span className="eyebrow">Ruta alterna</span>
      <h1>No pudimos verificar la identidad</h1>
      {msg && <div className="alert warn">{msg}</div>}
      <button className="btn" onClick={onNuevo}>Solicitar un código nuevo</button>
      <div className="box small"><b>¿Cambió el celular o el correo?</b> Pharma Express no modifica tus datos. Actualízalos en tu EPS:
        <ul>{eps.map((e) => <li key={e.eps}><b>{e.eps}:</b> {e.actualizarDatos}</li>)}</ul></div>
      <div className="box small"><b>Atención presencial.</b> Puedes reclamar tus medicamentos directamente en el punto.</div>
    </>
  );
}

function Inicio(props: { actual: Vinculo; avisos: any[]; onNueva: () => void; onEstado: () => void; onCambiar: () => void; onDesvincular: () => void; onRevocar: () => void }) {
  const [confirmar, setConfirmar] = useState(false);
  const [tg, setTg] = useState<string | null>(null);
  useEffect(() => { api('/canales/enlace-telegram').then((r) => setTg(r.url)); }, []);
  return (
    <>
      <span className="eyebrow">Inicio</span>
      <h1>¿Qué necesitas?</h1>
      <div className="stack">
        <button className="btn primary" onClick={props.onNueva}>Nueva solicitud: cargar fórmulas</button>
        <button className="btn" onClick={props.onEstado}>Mis fórmulas, citas y código de entrega</button>
        <button className="btn" onClick={props.onCambiar}>Cambiar de paciente o agregar otro</button>
      </div>
      {tg && <p className="small">También puedes continuar en <a href={tg} target="_blank" rel="noreferrer">Telegram</a>.</p>}
      {!!props.avisos.length && (
        <section className="stack"><h2>Avisos</h2>{props.avisos.slice(0, 5).map((a) => <div key={a.id} className="aviso small"><span className="muted">{fecha(a.creadaEn)} {hora(a.creadaEn)}</span><br />{a.texto}</div>)}</section>
      )}
      <div className="row">
        <button className="btn link" onClick={props.onDesvincular}>Desvincular este navegador</button>
        <button className="btn link danger" onClick={() => setConfirmar(true)}>Revocar consentimiento y eliminar datos</button>
      </div>
      {confirmar && (
        <div className="alert bad stack">
          <b>¿Revocar el consentimiento de {props.actual.nombre}?</b>
          <span className="small">Se cancelan las citas activas, se liberan los medicamentos y se eliminan sus datos de Pharma Express.</span>
          <div className="row"><button className="btn danger" onClick={props.onRevocar}>Sí, revocar</button><button className="btn" onClick={() => setConfirmar(false)}>No</button></div>
        </div>
      )}
    </>
  );
}

function Carga({ onResultado }: { onResultado: (r: any) => void }) {
  const [filas, setFilas] = useState<{ numero: string; archivo: File | null }[]>([{ numero: '', archivo: null }]);
  const [historia, setHistoria] = useState<File | null>(null);
  const [reintento, setReintento] = useState(false);
  const [msg, setMsg] = useState('');
  const enviar = async () => {
    if (!historia || filas.some((f) => !f.archivo || !f.numero.trim())) return setMsg('Carga cada fórmula con su número y la historia clínica.');
    const form = new FormData();
    filas.forEach((f) => form.append('formulas', f.archivo!));
    form.append('historia', historia);
    form.append('numeros', JSON.stringify(filas.map((f) => f.numero.trim().toUpperCase())));
    form.append('reintento', String(reintento));
    try { onResultado(await api('/solicitudes', { form })); }
    catch (e) {
      const b = (e as ApiError).body;
      if (b?.codigo === 'CARGAR_DE_NUEVO') { setReintento(true); setMsg(`No pudimos leer ${b.numeros.join(', ')}. Cárgala de nuevo con buena luz y sin recortes, y revisa el número.`); }
      else setMsg((e as Error).message);
    }
  };
  return (
    <div className="stack">
      <span className="eyebrow">Documentos</span>
      <h1>Carga las fórmulas y la historia clínica</h1>
      <p className="small muted">Foto o PDF. En este MVP escribe también el número impreso en cada fórmula.</p>
      {filas.map((f, i) => (
        <div key={i} className="box stack">
          <label className="field">Número de la fórmula<input value={f.numero} onChange={(e) => setFilas(filas.map((x, k) => (k === i ? { ...x, numero: e.target.value } : x)))} placeholder="F-1001" /></label>
          <label className="field">Foto o PDF<input type="file" accept="image/*,application/pdf" onChange={(e) => setFilas(filas.map((x, k) => (k === i ? { ...x, archivo: e.target.files?.[0] ?? null } : x)))} /></label>
        </div>
      ))}
      <button className="btn link" onClick={() => setFilas([...filas, { numero: '', archivo: null }])}>Agregar otra fórmula</button>
      <label className="field">Historia clínica<input type="file" accept="image/*,application/pdf" onChange={(e) => setHistoria(e.target.files?.[0] ?? null)} /></label>
      {msg && <div className="alert warn">{msg}</div>}
      <button className="btn primary" onClick={enviar}>Cargar y prevalidar</button>
    </div>
  );
}

function Resultado({ r, onAgenda, onInicio }: { r: any; onAgenda: () => void; onInicio: () => void }) {
  if (!r.afiliacionActiva)
    return (<><h1>La afiliación aparece inactiva</h1><div className="alert bad">Detuvimos toda la solicitud. {r.orientacion}</div><Preliminar /><Presencial /><button className="btn" onClick={onInicio}>Volver al inicio</button></>);
  const aptas = r.formulas.filter((f: any) => f.apta).length;
  return (
    <div className="stack">
      <span className="eyebrow">Resultado preliminar</span>
      <h1>{aptas ? `${aptas} de ${r.formulas.length} fórmulas cumplen los requisitos` : 'Ninguna fórmula cumple los requisitos'}</h1>
      <Preliminar />
      {r.formulas.map((f: any) => (
        <div key={f.formulaId} className={`fcard ${f.apta ? 'ok' : 'bad'}`}>
          <div className="fhead"><h2>Fórmula {f.numero}{f.tipo ? ` · ${f.tipo === 'CRONICO' ? 'Crónico' : 'Agudo'}` : ''}</h2><span className={`chip ${f.apta ? 'ok' : 'bad'}`}>{f.apta ? 'Apta' : 'No apta'}</span></div>
          <ul>{f.items.map((i: any, k: number) => <li key={k}>{i.nombre} × {i.cantidad}</li>)}</ul>
          <ul className="checks">{f.chequeos.map((c: any, k: number) => <li key={k}><span className={c.ok === true ? 'y' : c.ok === false ? 'n' : 'i'}>{c.ok === true ? '✓' : c.ok === false ? '✕' : '•'}</span> <b>{c.regla}:</b> {c.detalle}</li>)}</ul>
          {!f.apta && <div className="alert bad small"><b>{f.motivo}.</b> {f.siguiente}</div>}
        </div>
      ))}
      {aptas ? <button className="btn primary" onClick={onAgenda}>Ver disponibilidad de las fórmulas aptas</button> : <button className="btn" onClick={onInicio}>Volver al inicio</button>}
    </div>
  );
}

function Agenda({ solicitudId, onListo, onInicio }: { solicitudId: string; onListo: () => void; onInicio: () => void }) {
  const [disp, setDisp] = useState<any>(null);
  const [asig, setAsig] = useState<Record<string, string>>({});
  const [grupos, setGrupos] = useState<any[]>([]);
  const [elegidas, setElegidas] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');
  const asignacion = () => Object.entries(asig).map(([formulaItemId, puntoId]) => ({ formulaItemId, puntoId }));

  useEffect(() => {
    api(`/agenda/disponibilidad?solicitudId=${solicitudId}`).then((d) => {
      setDisp(d);
      setAsig(Object.fromEntries(d.items.map((i: any) => [i.formulaItemId, i.sugerido])));
    });
  }, [solicitudId]);
  useEffect(() => {
    if (!disp?.items.length) return;
    api('/agenda/ventanas', { body: { asignacion: asignacion() } }).then(setGrupos);
    setElegidas({});
  }, [asig]);

  if (!disp) return <p>Consultando disponibilidad…</p>;
  const confirmar = async () => {
    setMsg('');
    try {
      const r = await api('/agenda/confirmar', { body: { asignacion: asignacion(), ventanas: elegidas } });
      if (r.citas.length) onListo();
      else setMsg('No hay ventanas con cupo en los días permitidos. Se trata como sin disponibilidad: espera 48 horas para volver a validar.');
    } catch (e) {
      const b = (e as ApiError).body;
      setMsg(b?.codigo === 'CONFLICTO' ? b.mensaje : (e as Error).message);
      api('/agenda/ventanas', { body: { asignacion: asignacion() } }).then(setGrupos);
    }
  };
  return (
    <div className="stack">
      <span className="eyebrow">Disponibilidad y cita</span>
      <h1>Escoge dónde y cuándo recoger</h1>
      {!!disp.sinDisponibilidad.length && (
        <div className="alert warn small"><b>Sin disponibilidad:</b> {disp.sinDisponibilidad.map((s: any) => s.numero).join(', ')}. Espera 48 horas para volver a validar; te enviaremos un único recordatorio.</div>
      )}
      {!disp.items.length ? <button className="btn" onClick={onInicio}>Volver al inicio</button> : (
        <>
          <div className="box stack">
            {disp.items.map((i: any) => (
              <label key={i.formulaItemId} className="field">{i.nombre} × {i.cantidad} <span className="small muted">({i.numero})</span>
                <select value={asig[i.formulaItemId]} onChange={(e) => setAsig({ ...asig, [i.formulaItemId]: e.target.value })}>
                  {i.puntos.map((pt: any) => <option key={pt.id} value={pt.id}>{pt.nombre} ({pt.existencias} disp.)</option>)}
                </select>
              </label>
            ))}
          </div>
          {grupos.length > 1 && <div className="alert info small">Tus medicamentos están en {grupos.length} puntos. Escoge una ventana en cada uno; todas las citas se confirman juntas o ninguna.</div>}
          {grupos.map((g) => (
            <div key={g.puntoId} className="fcard">
              <div className="fhead"><h2>{g.punto}</h2><span className="chip neu">{g.incluyeCronico ? 'Incluye crónico: solo mañana' : 'Agudo: hoy o mañana'}</span></div>
              {g.ventanas.length ? (
                <div className="slots">
                  {g.ventanas.map((v: any) => (
                    <button key={v.inicio} className="slot" aria-pressed={elegidas[g.puntoId] === v.inicio} onClick={() => setElegidas({ ...elegidas, [g.puntoId]: v.inicio })}>
                      {fecha(v.inicio)} {hora(v.inicio)}<small>{v.cuposLibres} cupos</small>
                    </button>
                  ))}
                </div>
              ) : <div className="alert warn small">No hay ventanas con cupo en los días permitidos.</div>}
            </div>
          ))}
          {msg && <div className="alert bad">{msg}</div>}
          <button className="btn primary" onClick={confirmar}>Confirmar y reservar</button>
        </>
      )}
    </div>
  );
}

function Qr({ texto }: { texto: string }) {
  const [src, setSrc] = useState('');
  useEffect(() => { QRCode.toDataURL(texto, { width: 160, margin: 1, color: { dark: '#0F3D6E' } }).then(setSrc); }, [texto]);
  return src ? <img src={src} alt="Código QR de entrega" width={160} height={160} className="qr" /> : null;
}

function Estado({ titulo, onInicio }: { titulo: string; onInicio: () => void }) {
  const [e, setE] = useState<any>(null);
  const [cancelando, setCancelando] = useState<string | null>(null);
  const cargar = () => api('/solicitudes/estado').then(setE);
  useEffect(() => { cargar(); }, []);
  if (!e) return <p>Cargando…</p>;
  return (
    <div className="stack">
      <h1>{titulo}</h1>
      <h2>Citas</h2>
      {!e.citas.length && <p className="muted small">No hay citas.</p>}
      {e.citas.map((c: any) => (
        <div key={c.id} className={`fcard ${c.estado === 'RESERVADA' ? 'ok' : ''}`}>
          <div className="fhead"><h2>{c.punto}</h2><span className="chip neu">{estadoTexto(c.estado)}</span></div>
          <p><b>{fecha(c.inicio)}</b>, ventana de {hora(c.inicio)} a {hora(c.fin)}. Si llegas antes, espera el inicio de la ventana.</p>
          <ul>{c.items.map((i: any, k: number) => <li key={k}>{i.nombre} × {i.cantidad}{i.resultado ? ` · ${estadoTexto(i.resultado)}` : ''}</li>)}</ul>
          {c.codigo && (
            <div className="row">
              <Qr texto={`PX:${c.codigo}`} />
              <div><span className="eyebrow">Código de entrega · un solo uso</span><div className="code-num">{c.codigo.slice(0, 4)} {c.codigo.slice(4)}</div></div>
            </div>
          )}
          {c.estado === 'RESERVADA' && (cancelando === c.id ? (
            <div className="alert warn row"><span>¿Cancelar esta cita? Los medicamentos quedan disponibles para otras personas.</span>
              <button className="btn danger" onClick={async () => { await api(`/agenda/citas/${c.id}/cancelar`, { method: 'POST' }); setCancelando(null); cargar(); }}>Sí, cancelar</button>
              <button className="btn" onClick={() => setCancelando(null)}>No</button></div>
          ) : <button className="btn link danger" onClick={() => setCancelando(c.id)}>Cancelar cita</button>)}
        </div>
      ))}
      <h2>Fórmulas</h2>
      {e.formulas.map((f: any) => (
        <div key={f.id} className="fcard">
          <div className="fhead"><b>{f.numero}</b><span className="chip neu">{estadoTexto(f.estado)}</span></div>
          {f.motivo && <p className="small muted">{f.motivo}{f.siguiente ? `. ${f.siguiente}` : ''}</p>}
          {f.estado === 'CERRADA_NO_ENTREGADOS' && <p className="small">La gestión de lo no entregado corresponde a Disfarma.</p>}
        </div>
      ))}
      <button className="btn" onClick={onInicio}>Volver al inicio</button>
    </div>
  );
}
