
import React from 'react';

export default function TestMinimal() {
  const [count, setCount] = React.useState(0);
  
  console.log('[TestMinimal] React version:', React.version);
  console.log('[TestMinimal] useState working:', typeof setCount === 'function');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🧪 Test Minimal - Count: {count}</h1>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ padding: '10px', fontSize: '16px' }}
      >
        Increment
      </button>
      <p>Se você vê este componente funcionando, React está OK!</p>
    </div>
  );
}
