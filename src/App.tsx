
import React from "react";
import TestMinimal from "./test-minimal";

// VERSÃO TEMPORÁRIA PARA TESTE - REACT PURO SEM DEPS
function App() {
  console.log('[App] TESTE EMERGENCIAL - React puro iniciado');
  console.log('[App] React version:', React.version);
  console.log('[App] React.useState disponível:', !!React.useState);
  
  try {
    return <TestMinimal />;
  } catch (error) {
    console.error('[App] ERRO CRÍTICO no render:', error);
    return (
      <div style={{ padding: '20px', color: 'red', fontFamily: 'Arial' }}>
        <h1>🚨 ERRO CRÍTICO</h1>
        <p>Erro: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        <p>O React não está funcionando corretamente.</p>
      </div>
    );
  }
}

export default App;
