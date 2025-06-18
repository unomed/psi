
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// DIAGNÓSTICO DETALHADO DO REACT
console.log('[Main] =================================');
console.log('[Main] Portal do Funcionário iniciando...');
console.log('[Main] =================================');
console.log('[Main] React available:', !!React);
console.log('[Main] React.useState available:', !!React.useState);
console.log('[Main] React.useContext available:', !!React.useContext);
console.log('[Main] React.useEffect available:', !!React.useEffect);
console.log('[Main] React.forwardRef available:', !!React.forwardRef);
console.log('[Main] ReactDOM available:', !!ReactDOM);
console.log('[Main] ReactDOM.createRoot available:', !!ReactDOM.createRoot);

// VERIFICAR SE REACT É ÚNICO
const reactVersion = React.version;
console.log('[Main] React version:', reactVersion);

// VERIFICAR WINDOW.REACT (para debug)
if (typeof window !== 'undefined') {
  (window as any).__REACT_DEBUG__ = React;
  console.log('[Main] React anexado ao window para debug');
}

console.log('[Main] =================================');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[Main] ❌ Root element not found!');
  throw new Error("Root element not found");
}

console.log('[Main] ✅ Root element found, creating React root...');

try {
  const root = ReactDOM.createRoot(rootElement);
  console.log('[Main] ✅ React root created successfully');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('[Main] ✅ React app rendered successfully');
  console.log('[Main] =================================');
} catch (error) {
  console.error('[Main] ❌ ERRO CRÍTICO no render do React:', error);
  console.error('[Main] Stack trace:', (error as Error).stack);
  throw error;
}
