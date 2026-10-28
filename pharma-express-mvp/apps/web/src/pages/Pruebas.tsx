import { useEffect, useState } from 'react';
import { api, estadoTexto, fecha, hora } from '../lib/api';

/** Panel del equipo para la demostración (SPEC-08): reloj, EPS simulada, citas, métricas y bitácora. */
export function Pruebas() {
  const [reloj, setReloj] = useState<string>('');
  const [pac, setPac] = useState<any[]>([]);
  const [citas, setCitas] = useState<any[]>([]);
  const [met, setMet] = useState<any>(null);
  const [ev, setEv] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  const cargar = async () => {
    setReloj((await api('/admin/reloj')).ahora);
    setPac(await api('/admin/pacientes'));
    setCitas(await api('/admin/citas'));
    setMet(await api('/admin/metricas'));
    setEv(await api('/admin/eventos'));
  };
  useEffect(() => { cargar(); }, []);

  const mover = async (body: object) => {
    const r = await api('/admin/reloj', { body });
    setMsg(r.eventos.length ? `Ocurrió: ${r.eventos.join(' · ')}` : 'Reloj movido. No había eventos pendientes.');
    cargar();
  };

  return (
    <div className="shell ancho">
      <header className="appbar"><span className="marca">Pharma <em>Express</em> · Panel de pruebas</span></header>
      <main className="pantalla stack">
        <div className="alert warn small">Solo para la demostración. En producción este panel no funciona.</div>

        <section className="box stack">
          <h2>Reloj del sistema</h2>
          <p className="code-num">{reloj && `${fecha(reloj)} ${hora(reloj)}`}</p>
          <div className="row">
            <button className="btn" onClick={() => mover({ sumarMinutos: 60 })}>+1 hora</button>
            <button className="btn" onClick={() => mover({ sumarMinutos: 24 * 60 })}>+1 día</button>
            <button className="btn primary" onClick={() => mover({ ir: 'antes' })}>Ir a 1 hora antes de la próxima cita</button>
            <button className="btn primary" onClick={() => mover({ ir: 'inicio' })}>Ir al inicio de la próxima cita</button>
            <button className="btn" onClick={() => mover({ reiniciar: true })}>Volver a la hora real</button>
          </div>
          {msg && <div className="alert info small">{msg}</div>}
        </section>

        <section className="box stack">
          <h2>EPS simulada</h2>
          {pac.map((p) => (
            <label key={p.cedula} className="row small">
              <input type="checkbox" checked={p.afiliacionActiva} onChange={async () => { await api(`/admin/eps/${p.cedula}`, { method: 'PATCH', body: { afiliacionActiva: !p.afiliacionActiva } }); cargar(); }} />
              <span><b>{p.cedula}</b> {p.nombre} · {p.eps} · afiliación {p.afiliacionActiva ? 'activa' : 'inactiva'}</span>
            </label>
          ))}
        </section>

        <section className="box stack">
          <h2>Citas</h2>
          {!citas.length && <p className="small muted">Aún no hay citas.</p>}
          {citas.map((c) => (
            <p key={c.id} className="small"><b>{c.punto}</b> · {fecha(c.inicio)} {hora(c.inicio)}–{hora(c.fin)} · {estadoTexto(c.estado)}{c.codigo ? ` · código ${c.codigo}` : ''}</p>
          ))}
        </section>

        {met && (
          <section className="box stack">
            <h2>Métricas</h2>
            <p className="small">Fórmulas prevalidadas: {met.formulasPrevalidadas} · Novedades detectadas antes de salir: {Math.round(met.novedadesAntesDeDesplazarse * 100)} %</p>
            <p className="small">Citas confirmadas {met.citasConfirmadas} · canceladas {met.citasCanceladas} · expiradas {met.citasExpiradas} · llegadas {met.llegadas}</p>
            <p className="small">Confirmaciones rechazadas por conflicto {met.confirmacionesRechazadas} · Sobre-reservas <b>{met.sobreReservas}</b></p>
          </section>
        )}

        <section className="box stack">
          <div className="row"><h2>Bitácora</h2><button className="btn link" onClick={cargar}>Actualizar</button></div>
          {ev.map((e) => <p key={e.id} className="small"><span className="muted">{fecha(e.creadoEn)} {hora(e.creadoEn)}</span> · {e.tipo} <span className="muted">{JSON.stringify(e.detalle)}</span></p>)}
        </section>
      </main>
    </div>
  );
}
