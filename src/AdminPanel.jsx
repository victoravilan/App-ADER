import React, { useState, useEffect } from 'react';
import { Upload, PlusCircle, Music, Lock, FileAudio, Calendar, Type, FileText, CheckCircle, AlertCircle, Loader2, Link as LinkIcon, Info } from 'lucide-react';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [nextId, setNextId] = useState(1);

  const [formData, setFormData] = useState({
    archivo: null,
    nombreTecnico: '',
    nombreSistema: '',
    titulo: '',
    fecha: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    resena: '',
    urlManual: '' // Nuevo campo para URL externa o local
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'ader2026') { // Contraseña temporal
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  // Consultar a Firebase cuál es el último podcast para sugerir nombre
  useEffect(() => {
    if (isAuthenticated) {
      // LEER DE MEMORIA LOCAL
      const localData = localStorage.getItem('ader_podcasts');
      const podcasts = localData ? JSON.parse(localData) : [];
      
      let maxId = 0;
      podcasts.forEach(p => {
        const match = p.fileName.match(/podcast_(\d+)\.mp3/);
        if (match) {
          const id = parseInt(match[1]);
          if (id > maxId) maxId = id;
        }
      });
      setNextId(maxId + 1);
    }
  }, [isAuthenticated]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const nextName = `podcast_${String(nextId).padStart(2, '0')}.mp3`;

      setFormData({
        ...formData,
        archivo: file,
        nombreTecnico: file.name,
        nombreSistema: nextName
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación simple
    if ((!formData.archivo && !formData.urlManual) || !formData.titulo || !formData.resena) {
      alert("Por favor completa los campos y selecciona un archivo o ingresa una URL.");
      return;
    }

    setIsUploading(true);

    // Simular tiempo de carga
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      let downloadURL = formData.urlManual;

      // Si seleccionó archivo pero no URL manual, generamos la ruta local automática
      if (formData.archivo && !downloadURL) {
        downloadURL = `/podcast/${formData.nombreSistema}`;
      }

      // GUARDAR EN MEMORIA LOCAL
      const newPodcast = {
        id: Date.now(),
        title: formData.titulo,
        description: formData.resena,
        date: formData.fecha,
        fileName: formData.nombreSistema,
        src: downloadURL,
        createdAt: new Date().toISOString()
      };

      const currentPodcasts = JSON.parse(localStorage.getItem('ader_podcasts') || '[]');
      currentPodcasts.push(newPodcast);
      localStorage.setItem('ader_podcasts', JSON.stringify(currentPodcasts));

      alert(`¡Podcast registrado con éxito!\n\nIMPORTANTE:\nComo estamos en modo local, copia tu archivo MP3 a la carpeta 'public/podcast/' de tu proyecto y llámalo:\n\n👉 ${formData.nombreSistema}`);
      
      setFormData({ ...formData, archivo: null, nombreTecnico: '', nombreSistema: '', titulo: '', resena: '', urlManual: '' });
      setNextId(prev => prev + 1);

    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24">
        <div className="bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-sm text-center border border-slate-700">
          <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500 border border-slate-700">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Acceso Administrativo</h2>
          <p className="text-slate-400 text-sm mb-6">Área restringida para gestión de contenido.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-center font-bold tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
              placeholder="••••••••"
            />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-500 transition-colors">
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen pb-20">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <PlusCircle className="text-blue-400" /> Cargar Nuevo Contenido
      </h2>

      <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4 mb-6 flex gap-3">
        <Info className="text-amber-500 shrink-0" />
        <p className="text-sm text-amber-200">
          <strong>Modo Simulación:</strong> Los cambios realizados aquí solo se guardan en este dispositivo. Para publicar podcasts reales a todos los usuarios, debes editar el archivo <code>src/Home.jsx</code> y subirlo a GitHub.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700">
        
        {/* 1. Selección de Archivo */}
        <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${formData.archivo ? 'border-emerald-500/50 bg-emerald-900/20' : 'border-slate-600 hover:bg-slate-700/50'}`}>
          <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" id="audio-upload" />
          <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full">
            {formData.archivo ? (
              <>
                <FileAudio size={48} className="text-emerald-400" />
                <div className="text-left w-full mt-2">
                  <p className="text-xs text-slate-400 font-bold uppercase">Nombre Técnico (Original):</p>
                  <p className="font-mono text-sm text-slate-200 break-all mb-2">{formData.nombreTecnico}</p>
                  
                  <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-emerald-900/50">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Nombre Sistema (Sugerido):</p>
                      <p className="font-bold text-emerald-400">{formData.nombreSistema}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Music size={48} className="text-blue-500" />
                <span className="font-bold text-blue-400">Seleccionar Archivo (Opcional)</span>
                <span className="text-xs text-slate-500">Si falla la subida, usa el campo de URL abajo</span>
              </>
            )}
          </label>
        </div>

        {/* Campo URL Manual (Plan B) */}
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-300 flex items-center gap-2">
            <LinkIcon size={16} className="text-slate-500" /> URL del Audio / Ruta Local
          </label>
          <input 
            type="text" 
            value={formData.urlManual}
            onChange={(e) => setFormData({...formData, urlManual: e.target.value})}
            placeholder="Ej: /podcast/mi-audio.mp3 o https://..."
            className="w-full p-3 border border-slate-600 rounded-xl bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm placeholder-slate-500"
          />
          <p className="text-[10px] text-slate-500 mt-1 ml-1">Úsalo si la subida automática falla o si el archivo ya está en el servidor.</p>
        </div>

        {/* Campos de Metadatos */}
        {(formData.archivo || formData.urlManual) && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Título */}
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-300 flex items-center gap-2">
                <Type size={16} className="text-blue-400" /> Título del Contenido
              </label>
              <input 
                type="text" 
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                placeholder="Ej: Agua y los riñones"
                className="w-full p-3 border border-slate-600 rounded-xl bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium placeholder-slate-500"
              />
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-300 flex items-center gap-2">
                <Calendar size={16} className="text-orange-400" /> Fecha de Creación
              </label>
              <input 
                type="date" 
                value={formData.fecha}
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                className="w-full p-3 border border-slate-600 rounded-xl bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>

            {/* Reseña */}
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-300 flex items-center gap-2">
                <FileText size={16} className="text-purple-400" /> Breve Reseña (Max 20 palabras)
              </label>
              <textarea 
                value={formData.resena}
                onChange={(e) => setFormData({...formData, resena: e.target.value})}
                placeholder="Describe brevemente el contenido del podcast..."
                className="w-full p-3 border border-slate-600 rounded-xl bg-slate-900 text-white h-24 text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder-slate-500"
              ></textarea>
              <div className="text-right text-xs text-slate-500 mt-1">
                {formData.resena.split(/\s+/).filter(w => w.length > 0).length} / 20 palabras
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isUploading}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" /> 
                    REGISTRANDO...
                  </>
                ) : (
                  <><Upload size={20} /> REGISTRAR PODCAST</>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-500 mt-3 flex items-center justify-center gap-1">
                <AlertCircle size={10} />
                {formData.archivo ? `El archivo se renombrará a ${formData.nombreSistema}` : 'Se registrará el enlace proporcionado'}
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}