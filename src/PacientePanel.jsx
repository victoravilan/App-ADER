import React, { useState, useEffect } from 'react';
import { User, Lock, ArrowRight, LogOut, PlusCircle, FileText, Upload, Trash2, Edit } from 'lucide-react';

// --- SIMULACIÓN DE BASE DE DATOS EN LOCALSTORAGE ---

// Obtener usuarios o inicializar
const getStoredUsers = () => {
  const users = localStorage.getItem('ader_auth_users');
  return users ? JSON.parse(users) : [];
};

// Obtener perfiles o inicializar
const getStoredProfiles = () => {
  const profiles = localStorage.getItem('ader_auth_profiles');
  return profiles ? JSON.parse(profiles) : {};
};

// --- COMPONENTE PRINCIPAL ---

export default function PacientePanel() {
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot', 'profile', 'setup', 'edit'
  const [currentUser, setCurrentUser] = useState(null); // email del usuario logueado
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);

  // Estados para formularios
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    tipoSangre: '',
    telefono: '',
    documentos: []
  });

  // Cargar datos al iniciar
  useEffect(() => {
    // Al cargar, revisa si hay una sesión activa guardada
    const loggedInUser = localStorage.getItem('ader_currentUser');
    if (loggedInUser) {
      const userProfiles = getStoredProfiles()[loggedInUser] || [];
      setCurrentUser(loggedInUser);
      setProfiles(userProfiles);
      if (userProfiles.length > 0) {
        setView('profile');
      } else {
        setView('setup');
      }
    } else {
      // Si no hay sesión, revisa si hay un email recordado para autocompletar
      const rememberedEmail = localStorage.getItem('ader_remembered_email');
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      // Si el usuario marca "Recordarme", guardamos su sesión y su email
      if (rememberMe) {
        localStorage.setItem('ader_currentUser', email);
        localStorage.setItem('ader_remembered_email', email);
      } else {
        localStorage.removeItem('ader_currentUser');
        localStorage.removeItem('ader_remembered_email');
      }
      const userProfiles = getStoredProfiles()[email] || [];
      setCurrentUser(email);
      setProfiles(userProfiles);
      if (userProfiles.length > 0) {
        setView('profile');
      } else {
        setView('setup');
      }
    } else {
      alert('Correo o contraseña incorrectos.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      alert('Este correo ya está registrado.');
      return;
    }
    const newUsers = [...users, { email, password }];
    localStorage.setItem('ader_auth_users', JSON.stringify(newUsers));
    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    setView('login');
  };

  const handleForgotPassword = () => {
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      // NOTA DE SEGURIDAD: En una app real, NUNCA se debe hacer esto.
      // Se debe enviar un enlace de reseteo único y seguro.
      // Esto es solo una simulación para la demo.
      alert(`(Simulación) Se ha enviado un correo a ${email} con tu contraseña: ${user.password}`);
    } else {
      alert('Si el correo existe en nuestro sistema, recibirás instrucciones.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ader_currentUser'); // Cierra la sesión persistente
    setCurrentUser(null);
    setProfiles([]);
    // No limpiamos el email si está recordado
    setPassword('');
    setView('login');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const allProfiles = getStoredProfiles();
    const userProfiles = allProfiles[currentUser] || [];
    
    if (view === 'edit') {
      // Actualizar perfil existente
      const updatedProfiles = userProfiles.map((p, index) => 
        index === selectedProfileIndex ? profileData : p
      );
      allProfiles[currentUser] = updatedProfiles;
      setProfiles(updatedProfiles);
      alert('Perfil actualizado con éxito.');
    } else {
      // Crear nuevo perfil
      const newProfiles = [...userProfiles, profileData];
      allProfiles[currentUser] = newProfiles;
      setProfiles(newProfiles);
      setSelectedProfileIndex(newProfiles.length - 1);
    }

    localStorage.setItem('ader_auth_profiles', JSON.stringify(allProfiles));
    setView('profile');
    // Reset form
    setProfileData({ nombre: '', fechaNacimiento: '', lugarNacimiento: '', tipoSangre: '', telefono: '', documentos: [] });
  };

  const handleEditClick = () => {
    const profileToEdit = profiles[selectedProfileIndex];
    if (!profileToEdit) return;
    setProfileData(profileToEdit);
    setView('edit');
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulación: solo guardamos el nombre y tipo.
    const newDocument = { name: file.name, type: file.type, date: new Date().toLocaleDateString() };
    
    const updatedProfiles = [...profiles];
    updatedProfiles[selectedProfileIndex].documentos.push(newDocument);

    const allProfiles = getStoredProfiles();
    allProfiles[currentUser] = updatedProfiles;
    localStorage.setItem('ader_auth_profiles', JSON.stringify(allProfiles));
    setProfiles(updatedProfiles);

    alert(`(Simulación) Documento '${file.name}' registrado. En una app real, se subiría a un servidor.`);
  };

  const handleDeleteProfile = () => {
    const currentProfile = profiles[selectedProfileIndex];
    if (!currentProfile) return;

    const confirmation = window.confirm(
      `¿Estás seguro de que quieres eliminar el perfil de "${currentProfile.nombre}"?\n\n¡ATENCIÓN! Esta acción es irreversible y borrará todos sus datos y documentos. Si es el único perfil, también se eliminará tu cuenta de registro.`
    );

    if (confirmation) {
      const allProfiles = getStoredProfiles();
      let userProfiles = allProfiles[currentUser] || [];

      // Eliminar el perfil seleccionado
      userProfiles = userProfiles.filter((_, index) => index !== selectedProfileIndex);

      if (userProfiles.length === 0) {
        // Si era el último perfil, eliminar la cuenta completa
        delete allProfiles[currentUser];
        const allUsers = getStoredUsers();
        const updatedUsers = allUsers.filter(u => u.email !== currentUser);
        localStorage.setItem('ader_auth_users', JSON.stringify(updatedUsers));
        
        if (localStorage.getItem('ader_remembered_email') === currentUser) {
            localStorage.removeItem('ader_remembered_email');
        }
        alert('Perfil y cuenta eliminados. Serás desconectado.');
        handleLogout();
      } else {
        // Si quedan más perfiles, solo actualizar la lista
        allProfiles[currentUser] = userProfiles;
        setProfiles(userProfiles);
        setSelectedProfileIndex(0); // Volver al primer perfil
        alert(`El perfil de "${currentProfile.nombre}" ha sido eliminado.`);
      }
      localStorage.setItem('ader_auth_profiles', JSON.stringify(allProfiles));
    }
  };

  // --- VISTAS RENDERIZADAS ---

  if (!currentUser) {
    // VISTA DE LOGIN / REGISTRO
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24">
        <div className="bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-sm text-center border border-slate-700">
          <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500 border border-slate-700">
            <User size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">
            {view === 'login' ? 'Mi Perfil' : 'Crear Cuenta'}
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {view === 'login' ? 'Accede a tu historial clínico y citas.' : 'Regístrate para gestionar tu información.'}
          </p>
          
          <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" required className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            
            {view === 'login' && (
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="mr-2 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-0" />
                  Mantener sesión iniciada
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-xs text-slate-500 hover:text-blue-400">Olvidé mi clave</button>
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors">
              {view === 'login' ? 'ENTRAR' : 'REGISTRARME'} <ArrowRight size={16} />
            </button>
          </form>

          <div className="text-xs text-slate-500 mt-4">
            {view === 'login' 
              ? <>¿No tienes cuenta? <button onClick={() => setView('register')} className="font-bold text-blue-400 hover:text-blue-300 ml-1">Regístrate</button></>
              : (
              <>
                ¿Ya tienes cuenta? <button onClick={() => setView('login')} className="font-bold text-blue-400 hover:text-blue-300 ml-1">Inicia sesión</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'setup' || view === 'edit') {
    // VISTA DE CONFIGURACIÓN / EDICIÓN DE PERFIL
    return (
      <div className="p-5 min-h-screen pb-24">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          {view === 'setup' ? 'Crea un Nuevo Perfil' : 'Editar Perfil'}
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          {view === 'setup' ? 'Completa los datos para empezar.' : `Estás editando el perfil de ${profileData.nombre}.`}
        </p>
        <form onSubmit={handleSaveProfile} className="space-y-4 bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700">
          <input value={profileData.nombre} onChange={e => setProfileData({...profileData, nombre: e.target.value})} placeholder="Nombre y Apellido" required className="w-full p-3 border border-slate-600 rounded-xl bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          <input value={profileData.fechaNacimiento} onChange={e => setProfileData({...profileData, fechaNacimiento: e.target.value})} type="date" placeholder="Fecha de Nacimiento" required className="w-full p-3 border border-slate-600 rounded-xl bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          <input value={profileData.lugarNacimiento} onChange={e => setProfileData({...profileData, lugarNacimiento: e.target.value})} placeholder="Lugar de Nacimiento" required className="w-full p-3 border border-slate-600 rounded-xl bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          <input value={profileData.tipoSangre} onChange={e => setProfileData({...profileData, tipoSangre: e.target.value})} placeholder="Tipo de Sangre" required className="w-full p-3 border border-slate-600 rounded-xl bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          <input value={profileData.telefono} onChange={e => setProfileData({...profileData, telefono: e.target.value})} type="tel" placeholder="Teléfono" required className="w-full p-3 border border-slate-600 rounded-xl bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setView('profile')} className="w-1/2 bg-slate-700 text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-600 transition-colors">CANCELAR</button>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg">GUARDAR CAMBIOS</button>
          </div>
        </form>
      </div>
    );
  }

  // VISTA DE PERFIL PRINCIPAL
  const currentProfile = profiles[selectedProfileIndex];

  return (
    <div className="p-5 min-h-screen pb-24">
      <header className="mb-6 flex justify-between items-start pt-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">{currentProfile?.nombre}</h2>
          <p className="text-slate-400 text-sm font-medium">Perfil del Paciente</p>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold text-red-400 bg-red-900/20 border border-red-900/30 px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-red-900/40 transition-colors">
          <LogOut size={14} /> Salir
        </button>
      </header>

      {/* Selector de Perfiles */}
      {profiles.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {profiles.map((p, i) => (
            <button 
              key={i} 
              onClick={() => setSelectedProfileIndex(i)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedProfileIndex === i ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
            >
              {p.nombre.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Datos del Perfil */}
      <section className="mb-8 bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider">Datos Personales</h3>
          <button onClick={handleEditClick} className="text-xs font-bold text-blue-400 bg-blue-900/20 border border-blue-900/30 px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-900/40 transition-colors">
            <Edit size={14} /> Editar
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-slate-300"><strong className="block text-xs text-slate-500 mb-1">F. Nacimiento:</strong> {currentProfile?.fechaNacimiento}</div>
          <div className="text-slate-300"><strong className="block text-xs text-slate-500 mb-1">L. Nacimiento:</strong> {currentProfile?.lugarNacimiento}</div>
          <div className="text-slate-300"><strong className="block text-xs text-slate-500 mb-1">T. Sangre:</strong> {currentProfile?.tipoSangre}</div>
          <div className="text-slate-300"><strong className="block text-xs text-slate-500 mb-1">Teléfono:</strong> {currentProfile?.telefono}</div>
        </div>
      </section>

      {/* Documentos */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-300 flex items-center gap-2 text-sm uppercase tracking-wider">
            <FileText size={16} className="text-purple-400" /> Documentos
          </h3>
          <label className="cursor-pointer text-xs font-bold text-blue-400 bg-blue-900/20 border border-blue-900/30 px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-900/40 transition-colors">
            <Upload size={14} /> Subir
            <input type="file" className="hidden" onChange={handleDocumentUpload} />
          </label>
        </div>
        <div className="space-y-3">
          {currentProfile?.documentos.length > 0 ? (
            currentProfile.documentos.map((doc, i) => (
              <div key={i} className="bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-700 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-slate-200">{doc.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Subido: {doc.date}</p>
                </div>
                <button disabled className="text-[10px] font-black text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg cursor-not-allowed border border-slate-700">VER</button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 bg-slate-800 rounded-2xl border border-dashed border-slate-600 text-slate-500 text-sm">No hay documentos.</div>
          )}
        </div>
      </section>

      {/* Botón para añadir más perfiles */}
      {profiles.length < 3 && (
        <button 
          onClick={() => setView('setup')}
          className="w-full mt-8 bg-slate-800 border-2 border-dashed border-slate-600 py-3 rounded-xl font-bold text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-700 hover:text-slate-200 transition-colors"
        >
          <PlusCircle size={16} /> Añadir Otro Perfil ({profiles.length}/3)
        </button>
      )}

      <button 
        onClick={handleDeleteProfile}
        className="w-full mt-4 text-red-400 font-bold text-xs flex items-center justify-center gap-2 py-2 hover:text-red-300 transition-colors"
      >
        <Trash2 size={14} /> Eliminar Perfil de {currentProfile?.nombre.split(' ')[0]}
      </button>
    </div>
  );
}