import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { User, Lock, ArrowRight, LogOut, PlusCircle, FileText, Upload, Trash2, Edit, AlertTriangle, CheckCircle, AtSign, Building } from 'lucide-react';

const DataProtectionClause = () => (
    <div className="mt-4 p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-xs text-slate-500">
        <p className="font-bold mb-1 flex items-center gap-1"><AlertTriangle size={14} /> Política de Privacidad</p>
        Al registrarte, aceptas nuestra política de protección de datos. Tu información personal y médica es confidencial y solo tú tendrás acceso a ella mediante tu contraseña. No compartiremos tus datos con terceros.
    </div>
);

export default function PacientePanel() {
  const [user, setUser] = useState(null); // Firebase user object
  const [userData, setUserData] = useState(null); // User data from Firestore
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('login'); // 'login', 'register'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [center, setCenter] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        // User is signed in.
        const userDocRef = doc(firestore, 'users', userAuth.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData({ uid: userAuth.uid, ...userDoc.data() });
        }
        setUser(userAuth);
      } else {
        // User is signed out.
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !center) {
        setFeedback({ message: 'Nombre y centro son obligatorios.', type: 'error' });
        return;
    }
    setFeedback({ message: 'Registrando...', type: 'info' });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userAuth = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(firestore, 'users', userAuth.uid), {
        name,
        email: userAuth.email,
        center,
        createdAt: new Date(),
        documents: [],
        status: 'pending_approval' // Admin needs to approve
      });
      
      setFeedback({ message: '¡Registro exitoso! Tu cuenta está pendiente de aprobación por un administrador.', type: 'success' });
      setView('login');
    } catch (error) {
      console.error(error);
      setFeedback({ message: error.message, type: 'error' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback({ message: 'Iniciando sesión...', type: 'info' });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state change will handle the rest
    } catch (error) {
      console.error(error);
      setFeedback({ message: 'Correo o contraseña incorrectos.', type: 'error' });
    }
  };
  
  const handleLogout = async () => {
    await signOut(auth);
    setEmail('');
    setPassword('');
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setFeedback({ message: 'Por favor, introduce tu correo para resetear la contraseña.', type: 'error' });
      return;
    }
    setFeedback({ message: 'Enviando correo de recuperación...', type: 'info' });
    try {
      await sendPasswordResetEmail(auth, email);
      setFeedback({ message: 'Se ha enviado un enlace a tu correo para que puedas cambiar tu contraseña.', type: 'success' });
    } catch (error) {
      setFeedback({ message: error.message, type: 'error' });
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const storageRef = ref(storage, `user-documents/${user.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => { /* Track progress if needed */ },
      (error) => { alert(`Error al subir: ${error.message}`) },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const newDocument = {
          name: file.name,
          url: downloadURL,
          path: storageRef.fullPath,
          uploadedAt: new Date()
        };
        
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          documents: arrayUnion(newDocument)
        });

        // Refresh user data
        const updatedDoc = await getDoc(userDocRef);
        setUserData({ uid: user.uid, ...updatedDoc.data() });
      }
    );
  };
  
  const handleDocumentDelete = async (docToDelete) => {
    if (!user || !window.confirm(`¿Seguro que quieres eliminar "${docToDelete.name}"?`)) return;

    // Delete from storage
    const docRef = ref(storage, docToDelete.path);
    await deleteObject(docRef);

    // Remove from firestore
    const userDocRef = doc(firestore, 'users', user.uid);
    await updateDoc(userDocRef, {
      documents: arrayRemove(docToDelete)
    });
    
    // Refresh user data
    const updatedDoc = await getDoc(userDocRef);
    setUserData({ uid: user.uid, ...updatedDoc.data() });
  };

  if (loading) {
    return <div className="p-5 text-center">Cargando...</div>;
  }
  
  if (!user || !userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24">
        <div className="bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-sm text-center border border-slate-700">
          <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500"><User size={32} /></div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">{view === 'login' ? 'Mi Perfil' : 'Crear Cuenta'}</h2>
          <p className="text-slate-400 text-sm mb-6">{view === 'login' ? 'Accede a tu historial clínico y citas.' : 'Regístrate para gestionar tu información.'}</p>
          
          <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {view === 'register' && (
                <>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre Completo" required className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl" />
                    <input type="text" value={center} onChange={e => setCenter(e.target.value)} placeholder="Tu centro (Ej: Diaverum Manresa)" required className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl" />
                </>
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" required className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl" />
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
              {view === 'login' ? 'ENTRAR' : 'REGISTRARME'} <ArrowRight size={16} />
            </button>
            {feedback.message && <p className={`text-sm ${feedback.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{feedback.message}</p>}
          </form>

          {view === 'register' && <DataProtectionClause />}

          <div className="text-xs text-slate-500 mt-4">
            {view === 'login' 
              ? <>¿No tienes cuenta? <button onClick={() => setView('register')} className="font-bold text-blue-400">Regístrate</button> | <button onClick={handlePasswordReset} className="font-bold text-blue-400">Olvidé mi clave</button></>
              : <>¿Ya tienes cuenta? <button onClick={() => setView('login')} className="font-bold text-blue-400">Inicia sesión</button></>
            }
          </div>
        </div>
      </div>
    );
  }

  if (userData.status === 'pending_approval') {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-xl font-bold">Cuenta Pendiente de Aprobación</h2>
            <p className="text-slate-400 mt-2 mb-6">Tu cuenta ha sido registrada, pero un administrador necesita verificarla. Por favor, ten paciencia.</p>
            <button onClick={handleLogout} className="text-red-400 bg-red-900/20 px-4 py-2 rounded-lg"><LogOut size={16} className="inline mr-2" />Cerrar Sesión</button>
        </div>
    );
  }

  return (
    <div className="p-5 min-h-screen pb-24">
      <header className="mb-6 flex justify-between items-start pt-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">{userData.name}</h2>
          <p className="text-slate-400 text-sm font-medium flex items-center gap-2"><Building size={14} />{userData.center}</p>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold text-red-400 bg-red-900/20 px-3 py-2 rounded-lg flex items-center gap-1">
          <LogOut size={14} /> Salir
        </button>
      </header>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-300 flex items-center gap-2 text-sm uppercase tracking-wider">
            <FileText size={16} /> Mis Documentos
          </h3>
          <label className="cursor-pointer text-xs font-bold text-blue-400 bg-blue-900/20 px-3 py-2 rounded-lg flex items-center gap-1">
            <Upload size={14} /> Subir
            <input type="file" className="hidden" onChange={handleDocumentUpload} />
          </label>
        </div>
        <div className="space-y-3">
          {userData.documents && userData.documents.length > 0 ? (
            userData.documents.map((doc, i) => (
              <div key={i} className="bg-slate-800 p-3 rounded-xl flex justify-between items-center">
                <div>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="font-bold text-sm text-slate-200 hover:text-blue-400">{doc.name}</a>
                  <p className="text-[10px] text-slate-500 font-medium">Subido: {new Date(doc.uploadedAt.seconds * 1000).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDocumentDelete(doc)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={16} /></button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 bg-slate-800 rounded-2xl border border-dashed border-slate-600 text-slate-500 text-sm">No has subido documentos.</div>
          )}
        </div>
      </section>
    </div>
  );
}