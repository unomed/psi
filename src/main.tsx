
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA TEMPORARIAMENTE DESABILITADO - pode estar causando problemas de cache
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     console.log('[PWA] Registrando service worker...');
    
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('[PWA] Service Worker registrado com sucesso:', registration.scope);
        
//         // Verificar se há atualizações
//         registration.addEventListener('updatefound', () => {
//           console.log('[PWA] Nova versão do service worker encontrada');
//           const newWorker = registration.installing;
          
//           if (newWorker) {
//             newWorker.addEventListener('statechange', () => {
//               if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
//                 console.log('[PWA] Nova versão instalada, recarregue a página');
//                 // Opcional: mostrar notificação para o usuário recarregar
//               }
//             });
//           }
//         });
        
//         // Check for updates periodicamente
//         setInterval(() => {
//           registration.update();
//         }, 60000); // Check a cada minuto
//       })
//       .catch((registrationError) => {
//         console.error('[PWA] Falha no registro do service worker:', registrationError);
//       });
//   });

//   // Listener para quando o service worker tomar controle
//   navigator.serviceWorker.addEventListener('controllerchange', () => {
//     console.log('[PWA] Service worker tomou controle da página');
//   });
// }

// // Debug para PWA
// if (process.env.NODE_ENV === 'development') {
//   console.log('[PWA] Modo desenvolvimento - logs de PWA habilitados');
  
//   // Log do status da instalação
//   window.addEventListener('beforeinstallprompt', (e) => {
//     console.log('[PWA] Evento beforeinstallprompt disparado');
//   });
  
//   // Log se já está instalado
//   if (window.matchMedia('(display-mode: standalone)').matches) {
//     console.log('[PWA] App já está instalado como PWA');
//   }
// }

console.log('[App] Sistema inicializado sem PWA - cache limpo');
