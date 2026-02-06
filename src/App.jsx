import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import JuegoMemoria from './JuegoMemoria';
import AdminPanel from './AdminPanel';
import PacientePanel from './PacientePanel';
import AderAlDia from './AderAlDia';
import Centros from './Centros';
import Comunidad from './Comunidad';
import { Mic, Brain, Settings, User, Newspaper, Users } from 'lucide-react';

export default function App() {
  const location = useLocation();
  const tab = location.pathname;

  return (
    <div className="min-h-screen bg-slate-900 pb-20 font-sans text-slate-100 selection:bg-blue-500 selection:text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/noticias" element={<AderAlDia />} />
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/juego" element={<JuegoMemoria />} />
        <Route path="/paciente" element={<PacientePanel />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/centros" element={<Centros />} />
      </Routes>

      <footer className="text-center text-[10px] text-slate-400 py-6 opacity-80">
        Diseñado y creado por Victor M.F. Avilan - Valor Agregado. Derechos reservados
      </footer>

      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200/60 h-16 flex justify-around items-center px-2 shadow-lg z-50">
        <Link to="/" className={`flex flex-col items-center ${tab === '/' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Mic size={20} />
          <span className="text-[9px] font-black uppercase mt-1">Radio</span>
        </Link>
        <Link to="/noticias" className={`flex flex-col items-center ${tab === '/noticias' ? 'text-green-600' : 'text-slate-400'}`}>
          <Newspaper size={20} />
          <span className="text-[9px] font-black uppercase mt-1">Al Día</span>
        </Link>
        <Link to="/comunidad" className={`flex flex-col items-center ${tab === '/comunidad' ? 'text-yellow-600' : 'text-slate-400'}`}>
          <Users size={20} />
          <span className="text-[9px] font-black uppercase mt-1">Comunidad</span>
        </Link>
        <Link to="/juego" className={`flex flex-col items-center ${tab === '/juego' ? 'text-purple-600' : 'text-slate-400'}`}>
          <Brain size={20} />
          <span className="text-[9px] font-black uppercase mt-1">Juego</span>
        </Link>
        <Link to="/paciente" className={`flex flex-col items-center ${tab === '/paciente' ? 'text-emerald-600' : 'text-slate-400'}`}>
          <User size={20} />
          <span className="text-[9px] font-black uppercase mt-1">Perfil</span>
        </Link>
        <Link
          to="/admin"
          className={`relative group flex flex-col items-center ${tab === '/admin' ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <Settings size={20} />
          <span className="text-[9px] font-black uppercase mt-1">Admin</span>
          <div className="absolute bottom-full mb-2 w-max hidden group-hover:block bg-slate-800 text-white text-xs rounded-md py-1 px-3 pointer-events-none">
            Acceso restringido. Solo Administrador
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-800" />
          </div>
        </Link>
      </nav>
    </div>
  );
}