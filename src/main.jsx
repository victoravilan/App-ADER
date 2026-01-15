import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Llamamos a App
import './index.css'   // Cargamos los estilos

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Registro del Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registrado:', reg))
      .catch(err => console.log('Error SW:', err));
  });
}