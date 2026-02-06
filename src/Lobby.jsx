import React, { useState, useEffect } from 'react';
import { firestore, auth } from './firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { Users, Send, Bell } from 'lucide-react';

export default function Lobby({ onStartGame }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    // Fetch online users (This is a simplified example. A real app would use presence management)
    const fetchUsers = async () => {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('status', '==', 'approved')); // Simplified: all approved users
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== currentUser?.uid); // Exclude self
      setOnlineUsers(users);
    };

    fetchUsers();

    // Listen for invitations
    if (currentUser) {
      const invitesRef = collection(firestore, 'game_invitations');
      const q = query(invitesRef, where('receiverUid', '==', currentUser.uid), where('status', '==', 'pending'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newInvitations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInvitations(newInvitations);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const sendInvitation = async (receiverId) => {
    if (!currentUser) return;
    await addDoc(collection(firestore, 'game_invitations'), {
      senderUid: currentUser.uid,
      senderName: currentUser.displayName || 'Jugador Anónimo',
      receiverUid: receiverId,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    alert('Invitación enviada!');
  };

  const acceptInvitation = (invitationId) => {
    // For now, just starts a local game
    onStartGame(); 
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold text-slate-100 mb-4">Sala de Espera</h2>

      {/* Incoming Invitations */}
      {invitations.length > 0 && (
        <div className="mb-6 bg-slate-800 p-4 rounded-xl border border-yellow-500/30">
          <h3 className="font-bold text-yellow-400 flex items-center justify-center gap-2"><Bell size={16}/> Tienes una invitación!</h3>
          {invitations.map(inv => (
            <div key={inv.id} className="mt-2 flex items-center justify-between">
              <p className="text-sm">{inv.senderName} te ha invitado a jugar.</p>
              <button onClick={() => acceptInvitation(inv.id)} className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                Aceptar
              </button>
            </div>
          ))}
        </div>
      )}

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
       <button onClick={onStartGame} className="mt-6 text-sm text-slate-400 hover:text-white">
        Jugar solo
      </button>
    </div>
  );
}
