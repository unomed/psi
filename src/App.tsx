
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmployeeAuthNativeProvider } from "@/contexts/EmployeeAuthNative";
import { SimpleRoutes } from "@/components/routing/SimpleRoutes";
import { AuthenticatedRoutes } from "@/components/routing/AuthenticatedRoutes";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "@/pages/auth/Login";

// QueryClient configuração simples
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('[App] PSI - Iniciando aplicação');
  
  // Estado para controlar qual portal está sendo exibido
  const [portalMode, setPortalMode] = useState<'admin' | 'employee'>(() => {
    // Verificar se há uma preferência salva no localStorage
    const savedMode = localStorage.getItem('psi-portal-mode');
    return (savedMode === 'admin' || savedMode === 'employee') ? savedMode : 'admin';
  });

  // Salvar a preferência do usuário no localStorage
  useEffect(() => {
    localStorage.setItem('psi-portal-mode', portalMode);
  }, [portalMode]);

  // Função para alternar entre os portais
  const togglePortal = () => {
    setPortalMode(prev => prev === 'admin' ? 'employee' : 'admin');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Barra de navegação superior com botão para alternar entre portais */}
        <div className="fixed top-0 left-0 right-0 bg-slate-800 text-white p-2 z-50 flex justify-between items-center">
          <div className="font-semibold">
            {portalMode === 'admin' ? 'Portal Administrativo' : 'Portal do Funcionário'}
          </div>
          <button 
            onClick={togglePortal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
          >
            Alternar para {portalMode === 'admin' ? 'Portal do Funcionário' : 'Portal Administrativo'}
          </button>
        </div>

        {/* Espaçamento para compensar a barra fixa */}
        <div className="pt-12"></div>

        {/* Renderização condicional com base no modo selecionado */}
        {portalMode === 'employee' ? (
          <EmployeeAuthNativeProvider>
            <SimpleRoutes />
          </EmployeeAuthNativeProvider>
        ) : (
          <AuthProvider>
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/*" element={<AuthenticatedRoutes />} />
            </Routes>
          </AuthProvider>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
