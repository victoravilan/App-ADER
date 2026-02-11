import React, { useState, useEffect, useRef } from 'react';
import { auth, firestore } from './firebase';
import { collection, query, where, orderBy, doc, getDoc, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { Send, MessageCircle, Users, X } from 'lucide-react';

// Helper function to create a placeholder avatar
const Avatar = ({ name }) => (
  <div className="w-10 h-10 rounded-full bg-ader-blue flex items-center justify-center font-bold text-white flex-shrink-0">
    {name ? name.charAt(0).toUpperCase() : '?'}
  </div>
);

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Justo ahora';
  return new Date(timestamp.seconds * 1000).toLocaleString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  });
};

// Loading Skeleton Component
const MessageSkeleton = () => (
    <div className="flex items-end gap-2 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0"></div>
        <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-slate-700">
            <div className="h-4 bg-slate-600 rounded w-24 mb-2"></div>
            <div className="h-8 bg-slate-600 rounded w-48"></div>
        </div>
    </div>
);

export default function Comunidad() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Firebase auth user
  const [userData, setUserData] = useState(null); // Firestore user data
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((userAuth) => {
      setUser(userAuth);

      if (userAuth) {
        // Set up a real-time listener for the user's document
        const userDocRef = doc(firestore, 'users', userAuth.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
          setUserData(doc.exists() ? doc.data() : null);
        });

        // Set up a real-time listener for community members
        const usersCollection = collection(firestore, 'users');
        const q = query(usersCollection, where("status", "==", "approved"));
        const unsubscribeMembers = onSnapshot(q, (querySnapshot) => {
            const membersList = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setMembers(membersList);
        });

        // Return a cleanup function that unsubscribes from all listeners
        return () => {
          unsubscribeUser();
          unsubscribeMembers();
        };

      } else {
        // User is logged out, clear all user-related state
        setUserData(null);
        setMembers([]);
      }
    });

    // Cleanup the auth state listener when the component unmounts
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    setLoading(true);
    const messagesCollection = collection(firestore, 'posts'); // Using 'posts' collection as before
    const q = query(messagesCollection, orderBy('createdAt', 'asc')); // Order by ascending for chat flow

    const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      const messagesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });

    return () => unsubscribeMessages();
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user || !userData || !newMessage.trim()) return;

    setIsSending(true);
    try {
      await addDoc(collection(firestore, 'posts'), {
        content: newMessage,
        authorId: user.uid,
        authorName: userData.name || 'Anónimo',
        authorCenter: userData.center || 'Centro no especificado',
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error creating post:", error);
      alert("No se pudo enviar el mensaje.");
    }
    setIsSending(false);
  };

  return (
    <div className="relative flex flex-col h-screen bg-slate-900 text-slate-200 overflow-hidden">
      <header className="bg-slate-800 shadow-md p-4 z-10 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-bold text-ader-green">Comunidad ADER</h1>
            <p className="text-xs text-slate-400">Conecta y comparte con otros pacientes</p>
        </div>
        <button 
            onClick={() => setShowMembers(!showMembers)} 
            className="relative bg-ader-blue text-white p-3 rounded-full hover:bg-ader-dark-blue transition-all"
        >
            <Users size={20} />
            {members.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-800">{members.length}</span>}
        </button>
      </header>

      {/* Members Sidebar */}
      <div className={`absolute top-0 right-0 h-full w-full md:w-72 bg-slate-800/95 backdrop-blur-sm z-30 shadow-2xl transform transition-transform duration-300 ease-in-out ${showMembers ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b border-slate-700">
            <h3 className="font-bold text-lg text-white flex items-center gap-2"><Users size={20}/> Miembros</h3>
            <button onClick={() => setShowMembers(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <ul className="overflow-y-auto h-[calc(100%-60px)] p-4 space-y-3">
            {members.map(member => (
                <li key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700">
                    <Avatar name={member.name} />
                    <div>
                        <p className="font-semibold text-sm text-white">{member.name}</p>
                        <p className="text-xs text-slate-400">{member.center}</p>
                    </div>
                </li>
            ))}
        </ul>
      </div>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {loading && (
            <>
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </>
          )}
          {!loading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
                <MessageCircle size={48} />
                <h2 className="text-lg font-semibold mt-4">Bienvenido a la comunidad</h2>
                <p>Aún no hay mensajes. ¡Sé el primero en saludar!</p>
            </div>
          )}
          {!loading && messages.map(msg => {
            const isCurrentUser = msg.authorId === user?.uid;
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {!isCurrentUser && <Avatar name={msg.authorName} />}
                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-ader-green text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <p className={`font-bold ${isCurrentUser ? 'text-white' : 'text-ader-light-green'}`}>{msg.authorName}</p>
                    <p className={`opacity-70 ${isCurrentUser ? 'text-white' : 'text-slate-400'}`}>{msg.authorCenter}</p>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs opacity-50 text-right mt-1 ${isCurrentUser ? 'text-white' : 'text-slate-400'}`}>
                    {formatTimestamp(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <footer className="bg-slate-800 p-4">
        {user && userData?.status === 'approved' ? (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              className="w-full p-3 border border-slate-600 rounded-xl bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ader-green"
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="bg-ader-green text-white font-bold p-3 rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        ) : (
          <div className="text-center text-slate-400 text-sm">
            {user ? 'Tu cuenta debe ser aprobada para chatear.' : 'Inicia sesión para unirte a la comunidad.'}
          </div>
        )}
      </footer>
    </div>
  );
}