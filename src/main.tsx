
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// DIAGNÓSTICO ULTRA-DETALHADO DO REACT
console.log('[Main] =================================');
console.log('[Main] TESTE EMERGENCIAL iniciando...');
console.log('[Main] =================================');
console.log('[Main] React available:', !!React);
console.log('[Main] React.version:', React.version);
console.log('[Main] React.useState available:', !!React.useState);
console.log('[Main] React.useContext available:', !!React.useContext);
console.log('[Main] React.useEffect available:', !!React.useEffect);
console.log('[Main] React.forwardRef available:', !!React.forwardRef);
console.log('[Main] ReactDOM available:', !!ReactDOM);
console.log('[Main] ReactDOM.createRoot available:', !!ReactDOM.createRoot);

// VERIFICAR MÚLTIPLAS INSTÂNCIAS DO REACT
const reactVersion = React.version;
console.log('[Main] React version detectada:', reactVersion);

// VERIFICAR SE HÁ MÚLTIPLAS VERSÕES
if (typeof window !== 'undefined') {
  (window as any).__REACT_DEBUG__ = React;
  (window as any).__REACT_VERSION__ = reactVersion;
  console.log('[Main] React anexado ao window para debug');
  
  // Verificar se já existe React no window
  if ((window as any).__REACT_MULTIPLE_INSTANCES__) {
    console.error('[Main] ❌ MÚLTIPLAS INSTÂNCIAS DO REACT DETECTADAS!');
  } else {
    (window as any).__REACT_MULTIPLE_INSTANCES__ = true;
    console.log('[Main] ✅ Primeira instância React registrada');
  }
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
  
  // Tentar render sem StrictMode
  try {
    console.log('[Main] 🔄 Tentando render sem StrictMode...');
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
    console.log('[Main] ✅ Render sem StrictMode funcionou!');
  } catch (error2) {
    console.error('[Main] ❌ FALHA TOTAL - nem sem StrictMode funciona:', error2);
    throw error2;
  }
}
