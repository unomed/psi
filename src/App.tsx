
import React from "react";
import TestMinimal from "./test-minimal";

// VERSÃO FINAL - REACT PURO SEM NENHUMA DEPENDÊNCIA RADIX UI
function App() {
  console.log('[App] React puro - ZERO Radix UI');
  console.log('[App] React version:', React.version);
  console.log('[App] useState funcionando:', !!React.useState);
  
  try {
    return <TestMinimal />;
  } catch (error) {
    console.error('[App] ERRO:', error);
    return (
      <div style={{ padding: '20px', color: 'red', fontFamily: 'Arial' }}>
        <h1>🚨 ERRO</h1>
        <p>Erro: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
      </div>
    );
  }
}

export default App;
