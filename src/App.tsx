
import React, { useState } from 'react';

function App() {
  const [test, setTest] = useState(0);
  return (
    <div>
      <h1>Teste Mínimo 3: {test}</h1>
      <button onClick={() => setTest(test + 1)}>
        Ainda funciona?
      </button>
    </div>
  );
}

export default App;
