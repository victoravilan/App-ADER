import React, { useState, useEffect } from 'react';
import { firestore, auth } from './firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { Users, Send, Bell, Key, Copy } from 'lucide-react';

export default function Lobby({ onStartGame }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [userData, setUserData] = useState(null);
  const [joinSeed, setJoinSeed] = useState('');
  const currentUser = auth.currentUser;

  useEffect(() => {
    // Fetch current user's data
    const fetchUserData = async () => {
        if(currentUser) {
            const userDocRef = doc(firestore, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            }
        }
    }
    fetchUserData();

    // Fetch online users
    const fetchUsers = async () => {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('status', '==', 'approved'));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(user => user.id !== currentUser?.uid);
      setOnlineUsers(users);
    };

    fetchUsers();

    // Listen for invitations
    if (currentUser) {
      const invitesRef = collection(firestore, 'game_invitations');
      const q = query(invitesRef, where('receiverUid', '==', currentUser.uid), where('status', '==', 'pending'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newInvitations = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setInvitations(newInvitations);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleJoinWithSeed = (e) => {
    e.preventDefault();
    if (joinSeed) {
        onStartGame(joinSeed);
    }
  };
  
  const handleStartAndShare = () => {
    const gameSeed = Date.now().toString();
    navigator.clipboard.writeText(gameSeed).then(() => {
        alert(`ID de partida copiado al portapapeles: ${gameSeed}`);
        onStartGame(gameSeed);
    }, () => {
        alert(`No se pudo copiar. El ID de la partida es: ${gameSeed}`);
        onStartGame(gameSeed);
    });
  };

  const sendInvitation = async (receiverId) => {
    if (!currentUser) return;
    const gameSeed = Date.now().toString();
    await addDoc(collection(firestore, 'game_invitations'), {
      senderUid: currentUser.uid,
      senderName: userData?.name || 'Jugador Anónimo',
      receiverUid: receiverId,
      status: 'pending',
      seed: gameSeed,
      createdAt: serverTimestamp(),
    });
    alert('Invitación enviada!');
    onStartGame(gameSeed);
  };

  const acceptInvitation = (invitation) => {
    onStartGame(invitation.seed);
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold text-slate-100 mb-4">Sala de Espera</h2>

      {invitations.length > 0 && (
        <div className="mb-6 bg-slate-800 p-4 rounded-xl border border-yellow-500/30">
          <h3 className="font-bold text-yellow-400 flex items-center justify-center gap-2"><Bell size={16}/> Tienes una invitación!</h3>
          {invitations.map(inv => (
            <div key={inv.id} className="mt-2 flex items-center justify-between">
              <p className="text-sm">{inv.senderName} te ha invitado a jugar.</p>
              <button onClick={() => acceptInvitation(inv)} className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                Aceptar
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-slate-800 p-4 rounded-xl mb-6">
        <h3 className="font-bold text-slate-300 mb-3 flex items-center justify-center gap-2"><Key size={16}/> Jugar con Clave</h3>
        <form onSubmit={handleJoinWithSeed} className="flex gap-2">
            <input 
                type="text"
                value={joinSeed}
                onChange={(e) => setJoinSeed(e.target.value)}
                placeholder="Pega la clave de la partida..."
                className="flex-grow p-2 bg-slate-900 border-slate-700 rounded-lg text-sm"
            />
            <button type="submit" className="bg-blue-600 text-white font-bold px-4 rounded-lg">Unirse</button>
        </form>
        <button onClick={handleStartAndShare} className="mt-3 text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2 w-full">
            <Copy size={14}/> Crear y compartir clave
        </button>
      </div>

      {currentUser && (
        <div className="bg-slate-800 p-4 rounded-xl">
            <h3 className="font-bold text-slate-300 mb-3 flex items-center justify-center gap-2"><Users size={16}/> Jugadores en línea</h3>
            <div className="space-y-2">
            {onlineUsers.length > 0 ? onlineUsers.map(user => (
                <div key={user.id} className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                <p>{user.name}</p>
                <button onClick={() => sendInvitation(user.id)} className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                    <Send size={12}/> Invitar
                </button>
                </div>
            )) : <p className="text-slate-500 text-sm">No hay otros jugadores en línea.</p>}
            </div>
        </div>
      )}
       <button onClick={() => onStartGame()} className="mt-6 text-sm text-slate-400 hover:text-white">
        Jugar solo
      </button>
    </div>
  );
}
