
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// DIAGNÓSTICO ULTRA-DETALHADO DO REACT
console.log('[Main] =================================');
console.log('[Main] TESTE EMERGENCIAL - versão simplificada');
console.log('[Main] =================================');
console.log('[Main] React available:', !!React);
console.log('[Main] React.version:', React.version);
console.log('[Main] React.useState available:', !!React.useState);
console.log('[Main] React.useEffect available:', !!React.useEffect);

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[Main] ❌ Root element not found!');
  throw new Error("Root element not found");
}

console.log('[Main] ✅ Root element found, creating React root...');

try {
  const root = ReactDOM.createRoot(rootElement);
  console.log('[Main] ✅ React root created successfully');
  
  root.render(<App />);
  console.log('[Main] ✅ React app rendered successfully - TESTE MÍNIMO');
} catch (error) {
  console.error('[Main] ❌ ERRO CRÍTICO no render do React:', error);
  console.error('[Main] Stack trace:', (error as Error).stack);
  throw error;
}
