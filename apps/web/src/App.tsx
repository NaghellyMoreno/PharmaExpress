import { Navigate, Route, Routes } from 'react-router-dom';
import Prevalidacion from './pantallas/Prevalidacion';
import Sesion from './pantallas/Sesion';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sesion" replace />} />
      <Route path="/sesion" element={<Sesion />} />
      <Route path="/prevalidacion" element={<Prevalidacion />} />
    </Routes>
  );
}
