
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('[Main] Inicializando aplicação');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[Main] ❌ Root element not found!');
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

console.log('[Main] ✅ Aplicação renderizada com sucesso');
