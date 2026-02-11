import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ChevronDown } from 'lucide-react';

const links = [
  { name: 'Fundación de Enfermos Renales', url: 'https://www.ader.org' },
  { name: 'Diaverum', url: 'https://www.diaverum.es' },
  { name: 'Fresenius Kabi', url: 'https://www.fresenius-kabi.com' },
  { name: 'Centros de Diálisis', url: '/centros', internal: true },
];

export default function LinksDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-800 p-2 rounded-full shadow-sm text-slate-400 hover:text-blue-400 transition-colors border border-slate-700 flex items-center"
      >
        <Globe size={20} />
        <ChevronDown size={16} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden z-30"
          onMouseLeave={() => setIsOpen(false)}
        >
          <ul>
            {links.map(link => (
              <li key={link.name}>
                {link.internal ? (
                  <Link
                    to={link.url}
                    className="block w-full text-left p-3 hover:bg-slate-700 text-sm text-slate-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-left p-3 hover:bg-slate-700 text-sm text-slate-300"
                  >
                    {link.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
