
import React, { createContext, useContext, useMemo } from 'react';

// CONTEXTO MÍNIMO PARA TESTE
interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log("[AuthProvider] VERSÃO SIMPLIFICADA inicializando");
  
  // Estado mínimo sem hooks complexos
  const contextValue = useMemo(() => ({
    user: null,
    loading: false,
    signIn: async () => {
      console.log('[AuthProvider] SignIn simulado');
    },
    signOut: async () => {
      console.log('[AuthProvider] SignOut simulado');
    },
  }), []);

  console.log("[AuthProvider] Renderizando children...");
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
