import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { api, ApiError, fechaLarga, horaCorta, rango } from '../lib/api';
import { Chip, Icon, Logo, Note } from '../lib/ui';

type Sesion = { token: string; punto: string; usuario: string };
type Cierre = { resultado: 'ENTREGADO' | 'NO_ENTREGADO'; motivo?: string; descripcion?: string };

const nombreUsuario = (u: string) => u;
const inicialesUsuario = (u: string) => u.split('.').map((x) => x[0] ?? '').join('').slice(0, 2).toUpperCase();

/** SPEC-06: validar el código (QR o numérico), atender y cerrar por medicamento. Basado en los mockups del paso 6. */
export function Dispensador() {
  const [s, setS] = useState<Sesion | null>(null);
  const [vista, setVista] = useState<'validar' | 'atencion' | 'cerrada'>('validar');
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<{ razon: string; mensaje: string } | null>(null);
  const [res, setRes] = useState<any>(null);
  const [novedades, setNovedades] = useState(false);
  const [cierre, setCierre] = useState<Record<string, Cierre>>({});
  const [fin, setFin] = useState<any>(null);
  const [agenda, setAgenda] = useState<{ ahora: string; citas: any[] } | null>(null);
  const [escaneando, setEscaneando] = useState(false);
  const [err, setErr] = useState('');
  const video = useRef<HTMLVideoElement>(null);
  const control = useRef<IScannerControls | null>(null);

  const cargarAgenda = (t = s?.token) => t && api('/dispensacion/citas-hoy', { token: t }).then(setAgenda).catch(() => {});
  useEffect(() => () => control.current?.stop(), []);

  const validar = async (c = codigo) => {
    setError(null); setErr('');
    const r = await api('/dispensacion/validar', { body: { codigo: c }, token: s!.token });
    if (!r.ok) return setError(r);
    setRes(r);
    setNovedades(false);
    setCierre(Object.fromEntries(r.items.map((i: any) => [i.citaItemId, { resultado: 'ENTREGADO' }])));
    setVista('atencion');
  };
  const escanear = async () => {
    if (escaneando) { control.current?.stop(); setEscaneando(false); return; }
    setEscaneando(true);
    try {
      const lector = new BrowserQRCodeReader();
      control.current = await lector.decodeFromVideoDevice(undefined, video.current!, (r) => {
        if (!r) return;
        const c = r.getText().replace(/^PX:/, '');
        control.current?.stop();
        setEscaneando(false);
        setCodigo(c);
        validar(c);
      });
    } catch {
      setEscaneando(false);
      setError({ razon: 'CAMARA', mensaje: 'No pudimos usar la cámara. Escribe el código numérico.' });
    }
  };
  const cerrar = async () => {
    setErr('');
    try {
      const items = Object.entries(cierre).map(([citaItemId, v]) => ({ citaItemId, ...v }));
      const r = await api(`/dispensacion/citas/${res.cita.id}/cerrar`, { token: s!.token, body: { items } });
      setFin({ ...r, cerradoEn: new Date() });
      setVista('cerrada');
    } catch (x) { setErr((x as ApiError).message); }
  };
  const otro = () => { setVista('validar'); setCodigo(''); setRes(null); setFin(null); setError(null); cargarAgenda(); };

  // ------------------------------------------------------------ ingreso
  if (!s)
    return (
      <div className="shell dispensador w-narrow">
        <div className="disp-head"><div className="row"><span className="brand"><Logo /> Pharma Express</span><span className="badge">DISPENSADOR</span></div></div>
        <form className="body" style={{ paddingTop: 22 }} onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          try { const ses = await api('/dispensacion/login', { body: { usuario: f.get('usuario'), clave: f.get('clave') } }); setS(ses); cargarAgenda(ses.token); }
          catch (x) { setErr((x as Error).message); }
        }}>
          <div className="title-block"><h1>Ingreso al punto</h1><p className="lead">Solo el personal del punto con rol de dispensador puede validar códigos y cerrar entregas.</p></div>
          <label className="field">Usuario<input id="usuario" name="usuario" autoComplete="username" /></label>
          <label className="field">Contraseña<input id="clave" name="clave" type="password" autoComplete="current-password" /></label>
          {err && <Note tipo="bad" icon="alert">{err}</Note>}
          <button className="btn primary block">Ingresar</button>
        </form>
      </div>
    );

  const quien = nombreUsuario(s.usuario);

  // ------------------------------------------------------------ validar
  if (vista === 'validar')
    return (
      <div className="shell dispensador">
        <div className="disp-head">
          <div className="row"><span className="brand"><Logo /> Pharma Express</span><span className="badge">DISPENSADOR</span></div>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="disp-user"><span className="avatar">{inicialesUsuario(quien)}</span><div><b>{quien}</b><span>{s.punto} · {agenda ? fechaLarga(agenda.ahora) : ''}</span></div></div>
            <button className="icon-btn" style={{ background: 'rgba(255,255,255,.1)', borderColor: 'rgba(255,255,255,.2)', color: '#fff' }} onClick={() => setS(null)} aria-label="Salir"><Icon n="logout" s={18} /></button>
          </div>
        </div>
        <div className="body disp-cols" style={{ paddingTop: 18 }}>
          <div className="stack" style={{ gap: 16 }}>
          <h1 style={{ fontSize: 22 }}>Validar código de entrega</h1>
          <div className="card">
            <div className="scanner">
              <video ref={video} hidden={!escaneando} muted playsInline />
              {!escaneando && <><span className="frame"><i /></span><p>Apunta la cámara al QR del paciente</p></>}
            </div>
            <button className="btn primary block" onClick={escanear}><Icon n="scan" s={18} /> {escaneando ? 'Detener cámara' : 'Escanear QR'}</button>
          </div>
          <form className="stack" onSubmit={(e) => { e.preventDefault(); validar(); }}>
            <span className="field">O escribe el código numérico</span>
            <div className="code-input">
              <input id="codigo" className="input big" inputMode="numeric" placeholder="0000 0000" value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/[^\d ]/g, ''))} />
              <button className="btn primary" disabled={codigo.replace(/\D/g, '').length < 8}>Validar</button>
            </div>
          </form>
          {error && <Note tipo={error.razon === 'ANTES_DE_VENTANA' ? 'warn' : 'bad'} icon={error.razon === 'ANTES_DE_VENTANA' ? 'clock' : 'alert'}>{error.mensaje}</Note>}
          </div>
          <div className="card">
            <div className="fhead"><b>Citas de hoy en este punto</b><button className="link" onClick={() => cargarAgenda()}>Actualizar</button></div>
            <div>
              {!agenda?.citas.length && <p className="small muted">No hay citas para hoy.</p>}
              {agenda?.citas.map((c) => (
                <div key={c.id} className="agenda-row">
                  <div><b>{rango(c.inicio, c.fin)}</b><span className="muted">{c.paciente} · {c.medicamentos} medicamento{c.medicamentos === 1 ? '' : 's'}</span></div>
                  <Chip tipo={c.estado === 'RESERVADA' ? 'info' : c.estado === 'CERRADA' ? 'ok' : c.estado === 'CUMPLIDA' ? 'warn' : 'neu'}>
                    {({ RESERVADA: 'Reservada', CUMPLIDA: 'En atención', CERRADA: 'Cerrada', CANCELADA: 'Cancelada', EXPIRADA: 'Expirada' } as Record<string, string>)[c.estado]}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  // ------------------------------------------------------------ atención en curso
  if (vista === 'atencion' && res) {
    const tipos = [...new Set(res.items.map((i: any) => `${i.formula} ${i.tipo === 'CRONICO' ? 'crónica' : 'aguda'}`))].join(' · ');
    const falta = Object.values(cierre).some((c) => c.resultado === 'NO_ENTREGADO' && (!c.motivo || (res.motivos.find((m: any) => m.codigo === c.motivo)?.exigeDescripcion && !c.descripcion?.trim())));
    return (
      <div className="shell dispensador">
        <div className="disp-bar">
          <button className="icon-btn" onClick={otro} aria-label="Volver"><Icon n="back" /></button>
          <span className="t">Atención en curso</span><span className="badge">DISPENSADOR</span>
        </div>
        <div className="body disp-cols" style={{ paddingTop: 16 }}>
          <div className="stack" style={{ gap: 16 }}>
          <div className="valid"><span className="circle-ok"><Icon n="check" s={18} w={3} /></span>
            <div><b>Código válido · llegada {horaCorta(res.cita.llegadaEn)}</b><span className="small">Ventana {rango(res.cita.inicio, res.cita.fin)} · este punto</span></div></div>
          <div className="card" style={{ gap: 4 }}>
            <h2>{res.paciente.nombre}</h2>
            <p className="small muted">CC terminada en {res.paciente.cedula.slice(-4)} · {res.paciente.eps} · Fórmula {tipos}</p>
          </div>
          <div className="card">
            <span className="label">Prevalidación (preliminar)</span>
            <div className="chips">{['Afiliación', 'Vigencia', 'PBS', 'Autorización', ...(res.items.some((i: any) => i.tipo === 'CRONICO') ? ['Entrega habilitada'] : [])].map((t) => <Chip key={t} tipo="ok" icon="check">{t}</Chip>)}</div>
            <p className="tiny muted">Tu validación oficial prevalece sobre este resultado.</p>
          </div>
          <div className="card">
            <span className="label">Validación oficial</span>
            <button role="radio" aria-checked={!novedades} className={`choice ${!novedades ? 'on' : ''}`} onClick={() => { setNovedades(false); setCierre(Object.fromEntries(res.items.map((i: any) => [i.citaItemId, { resultado: 'ENTREGADO' }]))); }}>
              <span className="radio" /><span><b>Sin novedades</b><span className="sub">Se entrega todo lo reservado</span></span></button>
            <button role="radio" aria-checked={novedades} className={`choice ${novedades ? 'on' : ''}`} onClick={() => setNovedades(true)}>
              <span className="radio" /><span><b>Con novedades</b><span className="sub">Algún medicamento no se entrega</span></span></button>
          </div>
          </div>
          <div className="stack" style={{ gap: 16 }}>
          <span className="label">Cierre por medicamento</span>
          {res.items.map((i: any) => {
            const x = cierre[i.citaItemId];
            const motivo = res.motivos.find((m: any) => m.codigo === x.motivo);
            return (
              <div key={i.citaItemId} className="card">
                <div className="fhead"><b>{i.nombre}</b><span className="small muted">{i.cantidad} {i.cantidad === 1 ? 'unidad' : 'unidades'}</span></div>
                <div className="toggle2">
                  <button className={`ent ${x.resultado === 'ENTREGADO' ? 'on' : ''}`} onClick={() => setCierre({ ...cierre, [i.citaItemId]: { resultado: 'ENTREGADO' } })}>Entregado</button>
                  <button className={`no ${x.resultado === 'NO_ENTREGADO' ? 'on' : ''}`} disabled={!novedades} onClick={() => setCierre({ ...cierre, [i.citaItemId]: { resultado: 'NO_ENTREGADO', motivo: '' } })}>No entregado</button>
                </div>
                {x.resultado === 'NO_ENTREGADO' && (
                  <>
                    <label className="field" style={{ fontSize: 13 }}>Motivo
                      <select id={`motivo-${i.citaItemId}`} value={x.motivo} onChange={(e) => setCierre({ ...cierre, [i.citaItemId]: { ...x, motivo: e.target.value } })}>
                        <option value="">Escoge un motivo</option>
                        {res.motivos.map((m: any) => <option key={m.codigo} value={m.codigo}>{m.descripcion}</option>)}
                      </select></label>
                    {motivo?.exigeDescripcion && <input id={`desc-${i.citaItemId}`} className="input" placeholder="Describe el motivo" value={x.descripcion ?? ''} onChange={(e) => setCierre({ ...cierre, [i.citaItemId]: { ...x, descripcion: e.target.value } })} />}
                  </>
                )}
              </div>
            );
          })}
          {err && <Note tipo="bad" icon="alert">{err}</Note>}
          </div>
        </div>
        <div className="foot"><button className="btn primary block" disabled={falta} onClick={cerrar}>Registrar validación y cerrar entrega</button></div>
      </div>
    );
  }

  // ------------------------------------------------------------ entrega cerrada
  if (vista === 'cerrada' && res && fin) {
    const noEnt = res.items.filter((i: any) => cierre[i.citaItemId].resultado === 'NO_ENTREGADO');
    return (
      <div className="shell dispensador w-narrow">
        <div className="disp-bar"><span className="t">{quien} · {s.punto}</span><span className="badge">DISPENSADOR</span></div>
        <div className="body" style={{ paddingTop: 18 }}>
          <div className="big-ok"><span className="circle-ok"><Icon n="check" s={24} w={3} /></span>
            <div><h1>Entrega cerrada</h1><p className="small muted">{res.paciente.nombre.split(' ')[0]} {res.paciente.nombre.split(' ').slice(-1)[0][0]}. · {fechaLarga(res.cita.inicio)} · {horaCorta(res.cita.llegadaEn)}</p></div></div>
          <div className="card" style={{ gap: 0 }}>
            {res.items.map((i: any, k: number) => {
              const x = cierre[i.citaItemId];
              const m = res.motivos.find((mm: any) => mm.codigo === x.motivo);
              return (
                <div key={i.citaItemId} className="fhead" style={{ padding: '10px 0', borderTop: k ? '1px solid var(--line)' : 0, alignItems: 'flex-start' }}>
                  <div><b>{i.nombre}</b><p className="tiny muted">{i.cantidad} {i.cantidad === 1 ? 'unidad' : 'unidades'}{m ? ` · Motivo: ${m.descripcion.toLowerCase()}${x.descripcion ? ` (${x.descripcion})` : ''}` : ''}</p></div>
                  {x.resultado === 'ENTREGADO' ? <Chip tipo="ok">Entregado</Chip> : <Chip tipo="bad">No entregado</Chip>}
                </div>
              );
            })}
          </div>
          <div className="card">
            <ul className="checklist">
              <li><Icon n="check" s={16} w={2.6} /> Código marcado como usado</li>
              <li><Icon n="check" s={16} w={2.6} /> Cita cerrada</li>
              <li><Icon n="check" s={16} w={2.6} /> {noEnt.length ? `Fórmula cerrada con ${noEnt.length === 1 ? 'un no entregado' : `${noEnt.length} no entregados`}` : 'Entrega completa registrada'}</li>
              <li><Icon n="check" s={16} w={2.6} /> Registrado por {quien}, con fecha y hora</li>
            </ul>
          </div>
          {noEnt.length > 0 && <Note tipo="warn" icon="chat"><b>Dile al paciente:</b> el medicamento no entregado se gestiona directamente con Disfarma. Pharma Express no crea pendientes.</Note>}
          {noEnt.length === 0 && res.items.some((i: any) => i.tipo === 'CRONICO') && <p className="small muted">Se programó el aviso de próxima entrega, 2 días antes de la siguiente fecha habilitada.</p>}
        </div>
        <div className="foot"><button className="btn primary block" onClick={otro}>Validar otro código</button></div>
      </div>
    );
  }
  return null;
}
