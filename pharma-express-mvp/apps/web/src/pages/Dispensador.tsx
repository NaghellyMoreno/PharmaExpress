import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { api, ApiError, hora } from '../lib/api';

type Sesion = { token: string; punto: string; usuario: string };

/** SPEC-06: validación del código (QR o numérico) y cierre por medicamento. */
export function Dispensador() {
  const [s, setS] = useState<Sesion | null>(null);
  const [err, setErr] = useState('');
  const [codigo, setCodigo] = useState('');
  const [res, setRes] = useState<any>(null);
  const [cierre, setCierre] = useState<Record<string, { resultado: 'ENTREGADO' | 'NO_ENTREGADO'; motivo?: string; descripcion?: string }>>({});
  const [fin, setFin] = useState<any>(null);
  const [escaneando, setEscaneando] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const control = useRef<IScannerControls | null>(null);

  useEffect(() => () => control.current?.stop(), []);

  const validar = async (c = codigo) => {
    setFin(null);
    const r = await api('/dispensacion/validar', { body: { codigo: c }, token: s!.token });
    setRes(r);
    if (r.ok) setCierre(Object.fromEntries(r.items.map((i: any) => [i.citaItemId, { resultado: 'ENTREGADO' }])));
  };
  const escanear = async () => {
    setEscaneando(true);
    const lector = new BrowserQRCodeReader();
    control.current = await lector.decodeFromVideoDevice(undefined, video.current!, (r) => {
      if (!r) return;
      const c = r.getText().replace(/^PX:/, '');
      control.current?.stop();
      setEscaneando(false);
      setCodigo(c);
      validar(c);
    });
  };

  if (!s)
    return (
      <div className="shell"><header className="appbar"><span className="marca">Pharma <em>Express</em> · Dispensador</span></header>
        <form className="pantalla stack" onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          try { setS(await api('/dispensacion/login', { body: { usuario: f.get('usuario'), clave: f.get('clave') } })); } catch (x) { setErr((x as Error).message); }
        }}>
          <h1>Ingreso al punto</h1>
          <label className="field">Usuario<input name="usuario" autoComplete="username" /></label>
          <label className="field">Contraseña<input name="clave" type="password" autoComplete="current-password" /></label>
          {err && <div className="alert bad">{err}</div>}
          <button className="btn primary">Ingresar</button>
        </form>
      </div>
    );

  return (
    <div className="shell"><header className="appbar"><span className="marca">{s.punto}</span><span className="quien">{s.usuario}</span></header>
      <main className="pantalla stack">
        <form className="stack" onSubmit={(e) => { e.preventDefault(); validar(); }}>
          <label className="field">Código de entrega<input className="code" inputMode="numeric" value={codigo} onChange={(e) => setCodigo(e.target.value)} /></label>
          <div className="row"><button className="btn primary">Validar código</button><button type="button" className="btn" onClick={escanear}>Escanear QR</button></div>
        </form>
        <video ref={video} hidden={!escaneando} className="video" muted playsInline />
        {res && !res.ok && <div className={`alert ${res.razon === 'ANTES_DE_VENTANA' ? 'warn' : 'bad'}`}>{res.mensaje}</div>}
        {fin && <div className="alert ok"><b>Entrega cerrada.</b> {fin.mensaje}</div>}
        {res?.ok && !fin && (
          <div className="stack">
            <span className="eyebrow">Llegada {hora(res.cita.llegadaEn)} · ventana {hora(res.cita.inicio)}–{hora(res.cita.fin)}</span>
            <h1>{res.paciente.nombre}</h1>
            <p className="small">CC {res.paciente.cedula} · {res.paciente.eps}</p>
            <div className="alert info small">{res.aviso}</div>
            {res.items.map((i: any) => {
              const x = cierre[i.citaItemId];
              return (
                <div key={i.citaItemId} className="fcard">
                  <div className="fhead"><b>{i.nombre} × {i.cantidad}</b><span className="small muted">{i.formula} · {i.tipo === 'CRONICO' ? 'Crónico' : 'Agudo'} · {i.prevalidacion}</span></div>
                  <div className="row">
                    <label><input type="radio" checked={x.resultado === 'ENTREGADO'} onChange={() => setCierre({ ...cierre, [i.citaItemId]: { resultado: 'ENTREGADO' } })} /> Entregado</label>
                    <label><input type="radio" checked={x.resultado === 'NO_ENTREGADO'} onChange={() => setCierre({ ...cierre, [i.citaItemId]: { resultado: 'NO_ENTREGADO', motivo: res.motivos[0].codigo } })} /> No entregado</label>
                  </div>
                  {x.resultado === 'NO_ENTREGADO' && (
                    <>
                      <select value={x.motivo} onChange={(e) => setCierre({ ...cierre, [i.citaItemId]: { ...x, motivo: e.target.value } })}>
                        {res.motivos.map((m: any) => <option key={m.codigo} value={m.codigo}>{m.descripcion}</option>)}
                      </select>
                      {res.motivos.find((m: any) => m.codigo === x.motivo)?.exigeDescripcion && (
                        <input placeholder="Describe el motivo" value={x.descripcion ?? ''} onChange={(e) => setCierre({ ...cierre, [i.citaItemId]: { ...x, descripcion: e.target.value } })} />
                      )}
                    </>
                  )}
                </div>
              );
            })}
            {err && <div className="alert bad">{err}</div>}
            <button className="btn primary" onClick={async () => {
              setErr('');
              try { setFin(await api(`/dispensacion/citas/${res.cita.id}/cerrar`, { token: s.token, body: { items: Object.entries(cierre).map(([citaItemId, v]) => ({ citaItemId, ...v })) } })); }
              catch (x) { setErr((x as ApiError).message); }
            }}>Registrar validación oficial y cerrar</button>
          </div>
        )}
      </main>
    </div>
  );
}
