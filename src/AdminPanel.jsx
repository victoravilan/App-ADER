import React, { useState, useEffect } from 'react';
import { storage, firestore, auth } from './firebase'; // Import auth
import { signInWithEmailAndPassword } from "firebase/auth"; // Import sign in function
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, query, where, orderBy, deleteDoc } from "firebase/firestore";
import { Upload, PlusCircle, Music, Lock, FileAudio, Calendar, Type, FileText, CheckCircle, AlertCircle, Loader2, Info, Users, Trash2, ListMusic } from 'lucide-react';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('info.victoravilan@gmail.com'); // Pre-fill admin email
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  
  const [podcasts, setPodcasts] = useState([]);
  const [loadingPodcasts, setLoadingPodcasts] = useState(true);
  const [pendingUsers, setPendingUsers] = useState([]);

  const [formData, setFormData] = useState({
    archivo: null,
    nombreTecnico: '',
    nombreSistema: '',
    titulo: '',
    fecha: new Date().toISOString().split('T')[0],
    resena: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Firebase Auth Error:", error);
      let message = 'Error al iniciar sesión.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = 'El email o la contraseña son incorrectos.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'El formato del email es incorrecto.';
      }
      setFeedback({ message, type: 'error' });
    }
  };

  const fetchPodcasts = async () => {
    setLoadingPodcasts(true);
    try {
        const podcastsCollection = collection(firestore, 'podcasts');
        const q = query(podcastsCollection, orderBy("createdAt", "desc"));
        const podcastSnapshot = await getDocs(q);
        const podcastsList = podcastSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setPodcasts(podcastsList);
    } catch (error) {
        console.error("Error fetching podcasts:", error);
        setFeedback({ message: 'Error al cargar los podcasts.', type: 'error' });
    }
    setLoadingPodcasts(false);
  };

  const fetchPendingUsers = async () => {
    try {
        const usersCollection = collection(firestore, 'users');
        const q = query(usersCollection, where("status", "==", "pending_approval"));
        const usersSnapshot = await getDocs(q);
        const usersList = usersSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setPendingUsers(usersList);
    } catch (error) {
        console.error("Error fetching pending users:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPodcasts();
      fetchPendingUsers();
    }
  }, [isAuthenticated]);
  
  const handleApproveUser = async (userId) => {
    const userDocRef = doc(firestore, 'users', userId);
    try {
        await updateDoc(userDocRef, { status: 'approved' });
        setFeedback({ message: 'Usuario aprobado con éxito.', type: 'success' });
        await fetchPendingUsers(); // Refresh the list
    } catch (error) {
        setFeedback({ message: 'Error al aprobar el usuario.', type: 'error' });
        console.error("Error approving user:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const nextId = podcasts.length + 1;
      const nextName = `podcast-ader-${String(nextId).padStart(3, '0')}-${Date.now()}.mp3`;
      setFormData(prev => ({ ...prev, archivo: file, nombreTecnico: file.name, nombreSistema: nextName }));
    }
  };
  
  const handlePodcastDelete = async (podcast) => {
    if (!window.confirm(`¿Seguro que quieres eliminar el podcast "${podcast.title}"? Esta acción no se puede deshacer.`)) return;

    setFeedback({ message: `Eliminando "${podcast.title}"...`, type: 'info' });
    try {
      // 1. Delete file from Storage
      const storageRef = ref(storage, `podcasts/${podcast.fileName}`);
      await deleteObject(storageRef);

      // 2. Delete document from Firestore
      const docRef = doc(firestore, 'podcasts', podcast.id);
      await deleteDoc(docRef);

      setFeedback({ message: 'Podcast eliminado con éxito.', type: 'success' });
      await fetchPodcasts(); // Refresh the list
    } catch (error) {
        console.error("Error deleting podcast: ", error);
        setFeedback({ message: `Error al eliminar: ${error.message}`, type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.archivo || !formData.titulo || !formData.resena) {
      setFeedback({ message: "Por favor completa todos los campos y selecciona un archivo.", type: 'error' });
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    setFeedback({ message: 'Iniciando subida...', type: 'info' });
    const storageRef = ref(storage, `podcasts/${formData.nombreSistema}`);
    const uploadTask = uploadBytesResumable(storageRef, formData.archivo);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        setFeedback({ message: `Subiendo... ${Math.round(progress)}%`, type: 'info' });
      }, 
      (error) => {
        setFeedback({ message: `Error en la subida: ${error.message}`, type: 'error' });
        setIsUploading(false);
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(firestore, 'podcasts'), {
            title: formData.titulo,
            description: formData.resena,
            date: formData.fecha,
            fileName: formData.nombreSistema,
            src: downloadURL,
            createdAt: serverTimestamp()
          });
          setFeedback({ message: '¡Podcast subido y registrado con éxito!', type: 'success' });
          setFormData({ archivo: null, nombreTecnico: '', nombreSistema: '', titulo: '', fecha: new Date().toISOString().split('T')[0], resena: '' });
          await fetchPodcasts(); // Refresh list after upload
        } catch (error) {
          setFeedback({ message: `Error al guardar en base de datos: ${error.message}`, type: 'error' });
        } finally {
          setIsUploading(false);
        }
      }
    );
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24">
        <div className="bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-sm text-center border border-slate-700">
            <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500 border border-slate-700">
            <Lock size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Acceso Administrativo</h2>
            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-center" placeholder="email@admin.com" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-center" placeholder="••••••••" />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">ENTRAR</button>
              {feedback.message && <p className={`text-sm mt-4 ${feedback.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{feedback.message}</p>}
            </form>
        </div>
        </div>
    );
  }

  return (
    <div className="p-6 min-h-screen pb-20 space-y-12">
      {feedback.message && (
            <div className={`border rounded-xl p-4 flex gap-3 items-center text-sm fixed top-5 right-5 z-50 bg-slate-900 shadow-lg ${
                feedback.type === 'error' ? 'border-red-700/50 text-red-300' : 
                feedback.type === 'success' ? 'border-green-700/50 text-green-300' : 
                'border-blue-700/50 text-blue-300'
            }`}>
            {feedback.type === 'error' ? <AlertCircle /> : feedback.type === 'success' ? <CheckCircle /> : <Info />}
            <p>{feedback.message}</p>
            </div>
        )}
      
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2"><PlusCircle className="text-blue-400" /> Cargar Nuevo Podcast</h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="border-2 border-dashed rounded-2xl p-6 text-center border-slate-600">
                <input type="file" accept="audio/mp3,audio/mpeg" onChange={handleFileChange} className="hidden" id="audio-upload" />
                <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    {formData.archivo ? <><FileAudio size={48} className="text-emerald-400" /><p className="font-mono text-sm text-slate-200">{formData.nombreTecnico}</p></> : <><Music size={48} className="text-blue-500" /><span className="font-bold text-blue-400">Seleccionar Archivo MP3</span></>}
                </label>
            </div>
            {isUploading && <div className="w-full bg-slate-700 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div></div>}
            <div className="space-y-4">
                <input type="text" value={formData.titulo} onChange={(e) => setFormData(prev => ({...prev, titulo: e.target.value}))} placeholder="Título del Podcast" className="w-full p-3 bg-slate-900 border-slate-700 rounded-xl" />
                <input type="date" value={formData.fecha} onChange={(e) => setFormData(prev => ({...prev, fecha: e.target.value}))} className="w-full p-3 bg-slate-900 border-slate-700 rounded-xl" />
                <textarea value={formData.resena} onChange={(e) => setFormData(prev => ({...prev, resena: e.target.value}))} placeholder="Reseña..." className="w-full p-3 h-24 bg-slate-900 border-slate-700 rounded-xl"></textarea>
                <button type="submit" disabled={isUploading || !formData.archivo} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">
                    {isUploading ? 'SUBIENDO...' : 'SUBIR Y REGISTRAR'}
                </button>
            </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2"><ListMusic className="text-purple-400" /> Podcasts en Firebase</h2>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
            {loadingPodcasts ? (
                <div className="flex justify-center items-center py-10"><Loader2 className="animate-spin text-slate-500" /></div>
            ) : podcasts.length > 0 ? podcasts.map(podcast => (
                <div key={podcast.id} className="flex justify-between items-center bg-slate-900 p-3 rounded-lg hover:bg-slate-700/50">
                    <div>
                        <p className="font-bold text-white">{podcast.title}</p>
                        <p className="text-xs text-slate-400">{new Date(podcast.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{podcast.fileName}</p>
                    </div>
                    <button onClick={() => handlePodcastDelete(podcast)} className="bg-red-900/50 text-red-400 font-bold text-xs px-3 py-2 rounded-md hover:bg-red-800/50">
                        <Trash2 size={14} />
                    </button>
                </div>
            )) : <p className="text-center text-slate-500 text-sm py-4">No hay podcasts en Firebase. ¡Sube el primero!</p>}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2"><Users className="text-green-400" /> Aprobar Usuarios</h2>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
            {pendingUsers.length > 0 ? pendingUsers.map(user => (
                <div key={user.id} className="flex justify-between items-center bg-slate-900 p-3 rounded-lg">
                    <div>
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email} | {user.center}</p>
                    </div>
                    <button onClick={() => handleApproveUser(user.id)} className="bg-green-600 text-white font-bold text-xs px-3 py-1 rounded-md hover:bg-green-500">
                        Aprobar
                    </button>
                </div>
            )) : <p className="text-center text-slate-500 text-sm py-4">No hay usuarios pendientes de aprobación.</p>}
        </div>
      </div>
    </div>
  );
}