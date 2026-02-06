import React, { useState, useEffect } from 'react';
import { auth, firestore } from './firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { MessageSquare, Send } from 'lucide-react';

export default function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const postsCollection = collection(firestore, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const postsSnapshot = await getDocs(q);
    const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(postsList);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newPostContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'posts'), {
        content: newPostContent,
        authorId: user.uid,
        authorName: user.displayName || 'Anónimo',
        createdAt: serverTimestamp()
      });
      setNewPostContent('');
      await fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Error creating post:", error);
      alert("No se pudo publicar el mensaje.");
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="p-5 text-center">Cargando comunidad...</div>;
  }

  return (
    <div className="p-5 max-w-2xl mx-auto min-h-screen pb-24 text-slate-200">
      <header className="py-4 mb-6">
        <h1 className="text-3xl font-bold text-ader-green tracking-tight">Comunidad ADER</h1>
        <p className="text-slate-400 mt-2">
          Un espacio para conectar, compartir y apoyarnos mutuamente.
        </p>
      </header>
      
      {user ? (
        <form onSubmit={handlePostSubmit} className="mb-6">
          <textarea
            className="w-full p-3 border border-slate-600 rounded-xl bg-slate-800 text-white placeholder-slate-500"
            placeholder="Escribe tu mensaje para la comunidad..."
            rows="3"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
          <button
            type="submit"
            disabled={isSubmitting || !newPostContent.trim()}
            className="w-full mt-2 bg-ader-green text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send size={16} /> {isSubmitting ? 'Publicando...' : 'Publicar'}
          </button>
        </form>
      ) : (
        <div className="mb-6 text-center bg-slate-800 p-6 rounded-2xl">
            <p className="text-slate-400">Debes iniciar sesión para poder publicar.</p>
        </div>
      )}


      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-ader-blue">
                  {post.authorName ? post.authorName.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="ml-3">
                  <p className="font-bold text-sm text-white">{post.authorName}</p>
                  <p className="text-xs text-slate-400">{post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : 'Justo ahora'}</p>
                </div>
              </div>
              <p className="text-slate-300 whitespace-pre-wrap">{post.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-slate-800 rounded-2xl border-dashed border-slate-600">
            <MessageSquare className="mx-auto text-slate-500" size={40}/>
            <p className="mt-4 text-slate-400">Aún no hay publicaciones. ¡Sé el primero!</p>
          </div>
        )}
      </div>
    </div>
  );
}