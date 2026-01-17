import React, { useState } from 'react';
import Home from './Home';
import JuegoMemoria from './JuegoMemoria'; // Importamos el juego
import AdminPanel from './AdminPanel';   // Importamos el panel
import PacientePanel from './PacientePanel'; // Importamos panel paciente
import AderAlDia from './AderAlDia'; // Importamos microblogging
import { Mic, Brain, Settings, User, Newspaper } from 'lucide-react';

export default function App() {
  const [tab, setTab] = useState('home');

  return (
    <div className="min-h-screen bg-slate-900 pb-20 font-sans text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Vistas dinámicas */}
      {tab === 'home' && <Home />}
      {tab === 'noticias' && <AderAlDia />}
      {tab === 'juego' && <JuegoMemoria />}
      {tab === 'paciente' && <PacientePanel />}
      {tab === 'admin' && <AdminPanel />}

      <footer className="text-center text-[10px] text-slate-400 py-6 opacity-80">
        Diseñado y creado por Victor M.F. Avilan - Valor Agregado. Derechos reservados
      </footer>

      {/* Menú de Navegación inferior */}
      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200/60 h-16 flex justify-around items-center px-2 shadow-lg z-50">
        <button onClick={() => setTab('home')} className={`flex flex-col items-center ${tab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Mic size={20} />
          <span className="text-[9px] font-black uppercase mt-1">Radio</span>
        </button>
        <button onClick={() => setTab('noticias')} className={`flex flex-col items-center ${tab === 'noticias' ? 'text-green-600' : 'text-slate-400'}`}>
          <Newspaper size={20} />
          <span className="text-[9px] font-black uppercase mt-1">Al Día</span>
        </button>
        <button onClick={() => setTab('juego')} className={`flex flex-col items-center ${tab === 'juego' ? 'text-purple-600' : 'text-slate-400'}`}>
          <Brain size={20} />
          <span className="text-[9px] font-black uppercase mt-1">Juego</span>
        </button>
        <button onClick={() => setTab('paciente')} className={`flex flex-col items-center ${tab === 'paciente' ? 'text-emerald-600' : 'text-slate-400'}`}>
          <User size={20} />
          <span className="text-[9px] font-black uppercase mt-1">Perfil</span>
        </button>
        <button
          onClick={() => setTab('admin')}
          className={`relative group flex flex-col items-center ${tab === 'admin' ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <Settings size={20} />
          <span className="text-[9px] font-black uppercase mt-1">Admin</span>
          <div className="absolute bottom-full mb-2 w-max hidden group-hover:block bg-slate-800 text-white text-xs rounded-md py-1 px-3 pointer-events-none">
            Acceso restringido. Solo Administrador
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-800" />
          </div>
        </button>
      </nav>
    </div>
  );
}