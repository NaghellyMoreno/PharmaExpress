import { createRoot } from 'react-dom/client';
import './styles.css';
import { App } from './App';
import { Dispensador } from './pages/Dispensador';
import { Pruebas } from './pages/Pruebas';

const ruta = location.pathname;
createRoot(document.getElementById('root')!).render(ruta.startsWith('/dispensador') ? <Dispensador /> : ruta.startsWith('/pruebas') ? <Pruebas /> : <App />);
