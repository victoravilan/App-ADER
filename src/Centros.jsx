import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin } from 'lucide-react';

const centros = [
  { provincia: 'Barcelona', nombre: 'Centro de Diálisis del Baix Llobregat (Diaverum)', localidad: 'Hospitalet de Llobregat' },
  { provincia: 'Barcelona', nombre: 'Centro de Diálisis Emilio Rotellar (Clínica Tefnut)', localidad: 'Barcelona' },
  { provincia: 'Barcelona', nombre: 'Centro de Diálisis Nephros', localidad: 'Barcelona' },
  { provincia: 'Barcelona', nombre: 'Centro de Diálisis Palau (Diaverum)', localidad: 'Barcelona' },
  { provincia: 'Barcelona', nombre: 'Centro de Diálisis Virgen de Montserrat', localidad: 'Barcelona' },
  { provincia: 'Barcelona', nombre: 'Nephrocare / Centro de Diálisis Barcelona - Rosselló (Fresenius)', localidad: 'Barcelona' },
  { provincia: 'Barcelona', nombre: 'Instituto de Hemodiálisis Barcelona', localidad: 'Barcelona' },
  { provincia: 'Barcelona', nombre: 'Instituto Médico Badalona', localidad: 'Badalona' },
  { provincia: 'Barcelona', nombre: 'Hospital Clínic de Barcelona', localidad: 'Barcelona' },
  { provincia: 'Barcelona', nombre: 'Hospital Universitari Vall d\'Hebron', localidad: 'Barcelona' },
  { provincia: 'Barcelona', nombre: 'Fundació Puigvert I.U.N.A.', localidad: 'Barcelona' },
  { provincia: 'Barcelona', nombre: 'Centro de Diálisis de Mataró', localidad: 'Mataró' },
  { provincia: 'Barcelona', nombre: 'Corporació Sanitari Parc Taulí', localidad: 'Sabadell' },
  { provincia: 'Girona', nombre: 'Clínica Girona S.A.', localidad: 'Girona' },
  { provincia: 'Girona', nombre: 'Hospital Universitari de Girona Dr. Josep Trueta', localidad: 'Girona' },
  { provincia: 'Tarragona', nombre: 'Fresenius Medical Care Services Catalunya, S.L. Centro de Diálisis Reus', localidad: 'Reus' },
  { provincia: 'Lleida', nombre: 'Hospital Universitari Arnau de Vilanova', localidad: 'Lleida' },
];

const centrosAgrupados = centros.reduce((acc, centro) => {
  if (!acc[centro.provincia]) {
    acc[centro.provincia] = [];
  }
  acc[centro.provincia].push(centro);
  return acc;
}, {});

export default function Centros() {
  return (
    <div className="p-5 max-w-md mx-auto min-h-screen pb-24">
      <header className="py-4 flex items-center px-1 mb-4 relative">
        <Link to="/" className="absolute left-0 p-2 text-slate-400 hover:text-blue-400">
          <ChevronLeft size={24} />
        </Link>
        <div className="flex-grow text-center">
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Centros de Diálisis</h2>
          <p className="text-ader-blue font-semibold text-xs tracking-wide uppercase">Colaboradores en Cataluña</p>
        </div>
      </header>

      <div className="space-y-6">
        {Object.entries(centrosAgrupados).map(([provincia, listaCentros]) => (
          <div key={provincia}>
            <h3 className="text-lg font-bold text-slate-300 mb-3 border-b-2 border-slate-700 pb-2">{provincia}</h3>
            <ul className="space-y-3">
              {listaCentros.map((centro) => (
                <li key={centro.nombre} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <p className="font-semibold text-slate-100">{centro.nombre}</p>
                  <div className="flex items-center text-slate-400 text-sm mt-1">
                    <MapPin size={14} className="mr-2" />
                    <span>{centro.localidad}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-xs text-slate-500">
        <p>Esta es una lista de centros colaboradores. Para más información, por favor contacte directamente con el centro de su interés.</p>
      </div>
    </div>
  );
}
