
import React from 'react';

// Teste React ULTRA simples
export default function TestMinimal() {
  console.log('[TestMinimal] Renderizando componente de teste');
  
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Teste React Mínimo</h1>
      <p>Se você vê isso, React está funcionando!</p>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  );
}
