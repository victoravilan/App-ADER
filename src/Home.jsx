import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Download, Mic, Globe, Square, Rewind, FastForward, Shuffle, Loader2, SkipBack, SkipForward, Search, MessageCircle } from 'lucide-react';

// Datos por defecto para cuando no hay nada en LocalStorage
const DEFAULT_PODCASTS = [
  {
    id: 1,
    title: "Nutrición: Las Proteínas",
    description: "Importancia y manejo de las proteínas en la dieta renal.",
    date: "2026-01-01",
    fileName: "podcast-ader-001-26-proteinas.mp3",
    src: "podcast/podcast-ader-001-26-proteinas.mp3"
  },
  {
    id: 2,
    title: "Hidratación: El Agua",
    description: "Consejos fundamentales sobre el control de líquidos.",
    date: "2026-01-05",
    fileName: "podcast-ader-002-26-agua.mp3",
    src: "podcast/podcast-ader-002-26-agua.mp3"
  },
  {
    id: 3,
    title: "Comunidad: ADER Bizcaya",
    description: "Novedades, eventos y noticias de la asociación en Bizcaya.",
    date: "2026-01-10",
    fileName: "podcast-ader-003-bizcaya.mp3",
    src: "podcast/podcast-ader-003-bizcaya.mp3"
  },
  {
    id: 4,
    title: "Salud: El Consumo de Sal",
    description: "Impacto del sodio y estrategias para reducirlo en tus comidas.",
    date: "2026-01-15",
    fileName: "podcast-ader-004-25-sal.mp3",
    src: "podcast/podcast-ader-004-25-sal.mp3"
  },
  {
    id: 5,
    title: "Especial: Demo Invierno",
    description: "Contenido especial de temporada y cuidados en invierno.",
    date: "2026-01-20",
    fileName: "Ader-demo-invierno.mp3",
    src: "podcast/Ader-demo-invierno.mp3"
  }
];

export default function Home() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false); // Estado para modo aleatorio
  const [initialTime, setInitialTime] = useState(0); // Tiempo inicial para reanudar
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    // Detectar si la app ya está instalada (modo standalone)
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      setIsStandalone(!!isStandaloneMode);
    };
    checkStandalone();
  }, []);

  // Control de eventos de audio (Tiempo y Finalización)
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    // Eliminamos handleEnded de aquí para manejarlo en un efecto separado con acceso al estado

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Nuevo efecto para manejar el fin de la canción (Auto-play y Aleatorio)
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      if (podcasts.length === 0) return;

      if (isShuffle) {
        // Modo Aleatorio: Elegir uno al azar (evitando repetir el actual si es posible)
        let nextIdx = Math.floor(Math.random() * podcasts.length);
        if (podcasts.length > 1 && nextIdx === currentIdx) {
          nextIdx = (nextIdx + 1) % podcasts.length;
        }
        setCurrentIdx(nextIdx);
      } else {
        // Modo Normal: Siguiente en la lista (circular)
        setCurrentIdx((prev) => (prev + 1) % podcasts.length);
      }
      setIsPlaying(true); // Asegurar que continúe reproduciendo
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentIdx, isShuffle, podcasts]); // Se actualiza cuando cambian estas dependencias

  // Cargar podcasts desde LocalStorage (Recuperando trabajo anterior)
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const localData = localStorage.getItem('ader_podcasts');
        let data = [];
        
        if (localData) {
          data = JSON.parse(localData);
        } else {
          // Si no hay datos locales, usar los por defecto
          data = DEFAULT_PODCASTS;
        }
        
        // Ordenar por nombre de archivo
        data.sort((a, b) => a.fileName.localeCompare(b.fileName));
        
        setPodcasts(data);

        // RECUPERAR ESTADO DE REPRODUCCIÓN (Donde se quedó la última vez)
        const savedState = localStorage.getItem('ader_player_state');
        if (savedState) {
          const { idx, time } = JSON.parse(savedState);
          if (idx >= 0 && idx < data.length) {
            setCurrentIdx(idx);
          }
          if (time > 0) {
            setInitialTime(time);
            setCurrentTime(time); // Actualizar visualmente la barra antes de cargar
          }
        }
      } catch (error) {
        console.error("Error cargando podcasts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  // Guardar estado de reproducción en LocalStorage cada vez que cambie
  useEffect(() => {
    if (podcasts.length > 0) {
      localStorage.setItem('ader_player_state', JSON.stringify({
        idx: currentIdx,
        time: currentTime
      }));
    }
  }, [currentIdx, currentTime, podcasts]);

  // Efecto para cambiar la fuente de audio cuando cambia el índice
  useEffect(() => {
    if (podcasts.length > 0) {
      const audio = audioRef.current;
      
      // Solo cambiar la fuente si es diferente para evitar recargas innecesarias
      // Nota: audio.src devuelve la URL absoluta, podcasts[].src es relativa
      if (!audio.src.endsWith(podcasts[currentIdx].src)) {
        audio.src = podcasts[currentIdx].src;
        
        // Si hay un tiempo inicial guardado, saltar a él cuando cargue los metadatos
        if (initialTime > 0) {
          const seekToTime = () => {
            audio.currentTime = initialTime;
            setInitialTime(0); // Resetear para que no afecte a futuros cambios de canción
          };
          audio.addEventListener('loadedmetadata', seekToTime, { once: true });
        }
      }

      if (isPlaying) {
        audio.play().catch(e => console.log("Error reproducción:", e));
      }
    }
  }, [currentIdx, podcasts]); // initialTime se usa dentro pero no debe disparar el efecto

  const handleInstallClick = async () => {
    if (!installPrompt) {
      // Fallback para navegadores que no soportan el evento o ya está instalada
      alert("Para instalar la app:\n\n1. Presiona el menú de tu navegador (tres puntos o botón compartir).\n2. Busca la opción 'Instalar aplicación' o 'Agregar a inicio'.");
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Error reproducción:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const skipTime = (seconds) => {
    audioRef.current.currentTime += seconds;
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  // Filtrar podcasts para el buscador
  const filteredPodcasts = podcasts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchSelect = (podcast) => {
    const index = podcasts.findIndex(p => p.id === podcast.id);
    if (index !== -1) {
      setCurrentIdx(index);
      setIsPlaying(true);
      setSearchTerm('');
    }
  };

  // Obtener etiqueta (última palabra del título)
  const getLabel = (title) => {
    const words = (title || "").trim().split(' ');
    return words[words.length - 1];
  };

  // Índices para la lista visual (circular)
  const prevIdx = podcasts.length > 0 ? (currentIdx - 1 + podcasts.length) % podcasts.length : 0;
  const nextIdx = podcasts.length > 0 ? (currentIdx + 1) % podcasts.length : 0;

  return (
    <div className="p-5 max-w-md mx-auto min-h-screen pb-24">
      <header className="py-4 flex justify-between items-center px-1 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">¡Hola!</h2>
          <p className="text-blue-400 font-semibold text-xs tracking-wide uppercase">Fundación ADER</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://www.ader.org" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-full shadow-sm text-slate-400 hover:text-blue-400 transition-colors border border-slate-700">
            <Globe size={20} />
          </a>
          <img src="img/logo ader.png" alt="Logo" className="h-8 w-auto object-contain" />
        </div>
      </header>

      {/* Buscador */}
      <div className="mb-6 relative z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar podcast..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm placeholder-slate-500"
          />
        </div>
        {searchTerm && (
          <div className="absolute top-full left-0 right-0 bg-slate-800 mt-2 rounded-xl shadow-xl border border-slate-700 overflow-hidden max-h-60 overflow-y-auto z-30">
            {filteredPodcasts.length > 0 ? (
              filteredPodcasts.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => handleSearchSelect(p)}
                  className="w-full text-left p-3 hover:bg-slate-700 text-sm border-b border-slate-700 last:border-0 flex items-center gap-2 text-slate-300"
                >
                  <Play size={14} className="text-blue-400 shrink-0" />
                  <span className="truncate">{p.title}</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-slate-500 text-xs">No se encontraron resultados</div>
            )}
          </div>
        )}
      </div>

      {/* Botón WhatsApp */}
      <a 
        href="https://whatsapp.com/channel/0029VbBszfGFi8xjHl3Tul23" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full bg-[#25D366] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-green-100 text-sm hover:bg-[#20bd5a] transition-colors mb-4"
      >
        <MessageCircle size={18} />
        UNIRME AL CANAL DE WHATSAPP
      </a>

      {/* BOTÓN DE INSTALACIÓN */}
      {!isStandalone && (
        <button
          onClick={handleInstallClick}
          className="w-full bg-slate-800 text-slate-300 border border-slate-700 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6 shadow-sm text-sm hover:bg-slate-700 hover:text-white transition-colors"
        >
          <Download size={18} />
          Instalar App en mi Inicio
        </button>
      )}

      {/* REPRODUCTOR DE RADIO */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-5 text-white shadow-xl shadow-blue-900/20 mb-6 relative overflow-hidden border border-white/10">
        <div className="flex justify-between items-start mb-6 relative z-10">
          <Mic size={24} className="opacity-80" />
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">En Vivo</span>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 text-blue-100">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="text-xs font-bold">Cargando emisora...</p>
          </div>
        ) : podcasts.length === 0 ? (
          <div className="text-center py-10 text-blue-100">
            <p>No hay contenido disponible.</p>
          </div>
        ) : (
          <>
            {/* Ventana de Navegación de Podcasts (3 líneas) */}
            <div className="bg-black/20 rounded-xl p-2 mb-6 flex flex-col items-center justify-center gap-1 relative z-10 backdrop-blur-sm border border-white/10">
              <button onClick={() => setCurrentIdx(prevIdx)} className="text-blue-200/60 text-[10px] truncate w-full text-center hover:text-white transition-colors py-1">
                {podcasts[prevIdx]?.title}
              </button>
              
              <div className="text-white font-bold text-sm truncate w-full text-center py-2 border-y border-white/20 bg-white/10 rounded px-2 shadow-inner">
                {podcasts[currentIdx]?.title}
              </div>

              <button onClick={() => setCurrentIdx(nextIdx)} className="text-blue-200/60 text-[10px] truncate w-full text-center hover:text-white transition-colors py-1">
                {podcasts[nextIdx]?.title}
              </button>
            </div>

            <div className="text-center mb-6 relative z-10">
              <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Tema Actual</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">"{getLabel(podcasts[currentIdx]?.title)}"</h3>
            </div>
            
            {/* Barra de Progreso */}
            <div className="mb-4 px-2 relative z-10">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-blue-900/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
              <div className="flex justify-between text-[10px] text-blue-200 font-medium mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controles del Reproductor */}
            <div className="flex items-center justify-between gap-1 relative z-10 px-1">
              <button 
                onClick={toggleShuffle} 
                className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-white bg-white/20 shadow-inner' : 'text-blue-200 hover:text-white hover:bg-white/10'}`} 
                title={isShuffle ? "Desactivar Aleatorio" : "Activar Aleatorio"}
              >
                <Shuffle size={16} />
              </button>
              
              <button onClick={() => setCurrentIdx(prevIdx)} className="text-white hover:scale-110 transition-transform p-2" title="Anterior">
                <SkipBack size={22} />
              </button>

              <button onClick={() => skipTime(-10)} className="text-blue-200 hover:text-white hover:scale-110 transition-transform p-1" title="-10 seg">
                <Rewind size={18} />
              </button>

              <button onClick={toggleAudio} className="bg-white text-blue-600 rounded-full p-3 shadow-lg hover:scale-105 transition-transform active:scale-95">
                {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />}
              </button>

              <button onClick={() => skipTime(10)} className="text-blue-200 hover:text-white hover:scale-110 transition-transform p-1" title="+10 seg">
                <FastForward size={18} />
              </button>

              <button onClick={() => setCurrentIdx(nextIdx)} className="text-white hover:scale-110 transition-transform p-2" title="Siguiente">
                <SkipForward size={22} />
              </button>

              <button onClick={stopAudio} className="text-white hover:scale-110 transition-transform p-2" title="Stop">
                <Square fill="currentColor" size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-700 flex flex-col items-center justify-center">
           <span className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Próxima Cita</span>
           <span className="text-slate-200 font-bold text-lg">15 ENE</span>
        </div>
        <div className="bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-700 flex flex-col items-center justify-center">
           <span className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Tu Estado</span>
           <span className="text-emerald-400 font-bold text-lg">Estable</span>
        </div>
      </div>
    </div>
  );
}