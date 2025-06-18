
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('[Main] Portal do Funcionário iniciando...');
console.log('[Main] React available:', !!React);
console.log('[Main] React.useState available:', !!React.useState);
console.log('[Main] React.useContext available:', !!React.useContext);
console.log('[Main] ReactDOM available:', !!ReactDOM);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

console.log('[Main] Root element found, creating React root...');

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('[Main] React app rendered successfully');
} catch (error) {
  console.error('[Main] Error rendering React app:', error);
  throw error;
}
