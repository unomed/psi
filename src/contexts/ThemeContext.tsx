
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light'; // Forçando apenas tema claro

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Sempre inicializar com tema claro
  const [theme] = useState<Theme>('light');
  const [effectiveTheme] = useState<'light'>('light');

  useEffect(() => {
    // Forçar sempre o tema claro
    const root = window.document.documentElement;
    root.classList.remove('dark', 'system');
    root.classList.add('light');
    
    // Remover qualquer configuração anterior de tema escuro
    localStorage.removeItem('theme');
    localStorage.setItem('theme', 'light');
  }, []);

  // Função que não permite mudança de tema, mas mantém a interface
  const handleSetTheme = (newTheme: Theme) => {
    // Sempre manter tema claro, ignorar tentativas de mudança
    console.log('Tema claro é forçado no portal do funcionário');
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      effectiveTheme,
      setTheme: handleSetTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
