import React, { useState, useEffect, useRef } from 'react';
import { firestore } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import LinksDropdown from './LinksDropdown';
import { Play, Pause, Download, Mic, Square, Rewind, FastForward, Shuffle, Loader2, SkipBack, SkipForward, Search, MessageCircle, Share2 } from 'lucide-react';

export default function Home() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      setIsStandalone(!!isStandaloneMode);
    };
    checkStandalone();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      if (podcasts.length === 0) return;
      if (isShuffle) {
        let nextIdx = Math.floor(Math.random() * podcasts.length);
        if (podcasts.length > 1 && nextIdx === currentIdx) {
          nextIdx = (nextIdx + 1) % podcasts.length;
        }
        setCurrentIdx(nextIdx);
      } else {
        setCurrentIdx((prev) => (prev + 1) % podcasts.length);
      }
      setIsPlaying(true);
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentIdx, isShuffle, podcasts]);

  useEffect(() => {
    const loadPodcasts = async () => {
      setLoading(true);
      try {
        const podcastsCollection = collection(firestore, 'podcasts');
        const q = query(podcastsCollection, orderBy('createdAt', 'desc'));
        const podcastSnapshot = await getDocs(q);
        const podcastsList = podcastSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPodcasts(podcastsList);
      } catch (error) {
        console.error("Error fetching podcasts from Firestore:", error);
        // Optionally, set an error state to show in the UI
      }
      setLoading(false);
    };
    loadPodcasts();
  }, []);

  useEffect(() => {
    if (podcasts.length > 0 && podcasts[currentIdx]) {
        const audio = audioRef.current;
        const currentSource = podcasts[currentIdx].src;
        
        // Check if the source is different before setting it
        if (audio.src !== currentSource) {
            audio.src = currentSource;
        }
        
        if (isPlaying) {
            // The play() method returns a promise. It's good practice to handle potential errors.
            audio.play().catch(e => console.error("Audio play error:", e));
        } else {
            audio.pause();
        }
    }
  }, [currentIdx, podcasts, isPlaying]); // Re-run this effect when isPlaying changes as well


  const handleInstallClick = async () => {
    if (!installPrompt) {
      alert("Para instalar la app:\n\n1. Presiona el menú de tu navegador (tres puntos o botón compartir).\n2. Busca la opción 'Instalar aplicación' o 'Agregar a inicio'.");
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'App Red Renal ADER',
      text: 'Te invito a usar la App de la Fundación ADER. Radio, noticias y juegos para pacientes renales.',
      url: window.location.origin
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Error al compartir:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('Enlace copiado al portapapeles.');
      } catch (err) {
        alert('No se pudo compartir.');
      }
    }
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const stopAudio = () => {
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
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

  const toggleShuffle = () => setIsShuffle(!isShuffle);

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

  const getLabel = (title) => {
    const words = (title || "").trim().split(' ');
    return words[words.length - 1];
  };

  const prevIdx = podcasts.length > 0 ? (currentIdx - 1 + podcasts.length) % podcasts.length : 0;
  const nextIdx = podcasts.length > 0 ? (currentIdx + 1) % podcasts.length : 0;

  return (
    <div className="p-5 max-w-md mx-auto min-h-screen pb-24">
      <header className="py-4 flex justify-between items-center px-1 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">¡Hola!</h2>
          <p className="text-ader-blue font-semibold text-xs tracking-wide uppercase">Red Renal Ader Foundation</p>
        </div>
        <div className="flex items-center gap-3">
          <LinksDropdown />
          <img src="img/logo-ader-color.png" alt="Logo" className="h-10 w-auto object-contain" />
        </div>
      </header>

      <div className="mb-6 relative z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar podcast..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-ader-blue text-sm shadow-sm"
          />
        </div>
        {searchTerm && (
          <div className="absolute top-full left-0 right-0 bg-slate-800 mt-2 rounded-xl shadow-xl border border-slate-700 overflow-hidden max-h-60 overflow-y-auto z-30">
            {filteredPodcasts.length > 0 ? (
              filteredPodcasts.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => handleSearchSelect(p)}
                  className="w-full text-left p-3 hover:bg-slate-700 text-sm border-b border-slate-700 last:border-0"
                >
                  <Play size={14} className="text-ader-blue shrink-0 inline mr-2" />
                  <span className="truncate">{p.title}</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-slate-500 text-xs">No se encontraron resultados</div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-br from-ader-blue to-indigo-800 rounded-3xl p-5 text-white shadow-xl mb-6">
        <div className="flex justify-between items-start mb-6">
          <Mic size={24} />
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase">En Vivo</span>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="text-xs font-bold">Cargando emisora...</p>
          </div>
        ) : podcasts.length === 0 ? (
          <div className="text-center py-10">
            <p>No hay contenido disponible.</p>
          </div>
        ) : (
          <>
            <div className="bg-black/20 rounded-xl p-2 mb-6">
              <button onClick={() => setCurrentIdx(prevIdx)} className="text-blue-200/60 text-[10px] truncate w-full text-center py-1">
                {podcasts[prevIdx]?.title}
              </button>
              <div className="text-white font-bold text-sm truncate w-full text-center py-2 border-y border-white/20 bg-white/10 rounded">
                {podcasts[currentIdx]?.title}
              </div>
              <button onClick={() => setCurrentIdx(nextIdx)} className="text-blue-200/60 text-[10px] truncate w-full text-center py-1">
                {podcasts[nextIdx]?.title}
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Tema Actual</p>
              <h3 className="text-2xl font-bold tracking-tight">"{getLabel(podcasts[currentIdx]?.title)}"</h3>
            </div>
            
            <div className="mb-4 px-2">
              <input
                type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek}
                className="w-full h-1 bg-blue-900/30 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-blue-200 font-medium mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-1 px-1">
              <button onClick={toggleShuffle} className={`p-2 rounded-full ${isShuffle ? 'text-white bg-white/20' : 'text-blue-200'}`}>
                <Shuffle size={16} />
              </button>
              <button onClick={() => setCurrentIdx(prevIdx)} className="p-2"><SkipBack size={22} /></button>
              <button onClick={() => skipTime(-10)} className="p-1"><Rewind size={18} /></button>
              <button onClick={toggleAudio} className="bg-white text-ader-blue rounded-full p-3 shadow-lg">
                {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />}
              </button>
              <button onClick={() => skipTime(10)} className="p-1"><FastForward size={18} /></button>
              <button onClick={() => setCurrentIdx(nextIdx)} className="p-2"><SkipForward size={22} /></button>
              <button onClick={stopAudio} className="p-2"><Square fill="currentColor" size={16} /></button>
            </div>
          </>
        )}
      </div>

      {!isStandalone && (
        <button
          onClick={handleInstallClick}
          className="w-full bg-slate-800 text-slate-300 border border-slate-700 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-4"
        >
          <Download size={18} />
          Instalar App en mi Inicio
        </button>
      )}

      <a 
        href="https://whatsapp.com/channel/0029VbBszfGFi8xjHl3Tul23" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full bg-[#25D366] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-4"
      >
        <MessageCircle size={18} />
        UNIRME AL CANAL DE WHATSAPP
      </a>

      <button
        onClick={handleShareApp}
        className="w-full bg-blue-900/20 text-ader-blue border border-blue-900/30 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6"
      >
        <Share2 size={18} />
        Compartir App
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-5 rounded-2xl">
           <span className="text-[10px] font-bold text-slate-500 uppercase">Próxima Cita</span>
           <span className="block text-slate-200 font-bold text-lg">15 ENE</span>
        </div>
        <div className="bg-slate-800 p-5 rounded-2xl">
           <span className="text-[10px] font-bold text-slate-500 uppercase">Tu Estado</span>
           <span className="block text-emerald-400 font-bold text-lg">Estable</span>
        </div>
      </div>
    </div>
  );
}
