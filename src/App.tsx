
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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

// Componente interno para ter acesso ao useLocation
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log('[App] PSI - Iniciando aplicação');
  
  // Estado para controlar qual portal está sendo exibido
  const [portalMode, setPortalMode] = useState<'admin' | 'employee'>(() => {
    // Verificar se a URL atual é do portal de funcionário
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/portal') || currentPath.startsWith('/login') || currentPath.startsWith('/employee-portal') || currentPath.startsWith('/avaliacao/') || currentPath.startsWith('/assessment/')) {
      return 'employee';
    }
    
    // Verificar se há uma preferência salva no localStorage
    const savedMode = localStorage.getItem('psi-portal-mode');
    return (savedMode === 'admin' || savedMode === 'employee') ? savedMode : 'admin';
  });

  // Detectar mudanças de rota e ajustar o modo automaticamente
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Se está acessando uma rota de funcionário, mudar para modo employee
    if (currentPath.startsWith('/employee-portal')) {
      console.log('[App] Detectado acesso ao portal de funcionário via /employee-portal, alternando modo');
      setPortalMode('employee');
      
      // Extrair parâmetros da URL original
      const urlParams = new URLSearchParams(location.search);
      const employeeId = urlParams.get('employee');
      const assessmentId = urlParams.get('assessment');
      
      // Redirecionar para a rota equivalente no SimpleRoutes
      let newPath = '/portal';
      if (assessmentId) {
        newPath = `/portal/assessment/${assessmentId}`;
      }
      
      // Preservar parâmetros se existirem
      const searchParams = new URLSearchParams();
      if (employeeId) searchParams.set('employee', employeeId);
      if (assessmentId) searchParams.set('assessment', assessmentId);
      
      const finalPath = searchParams.toString() ? `${newPath}?${searchParams.toString()}` : newPath;
      
      console.log('[App] Redirecionando para:', finalPath);
      navigate(finalPath, { replace: true });
      return;
    }
    
    // Se está acessando rotas do portal do funcionário diretamente
    if (currentPath.startsWith('/portal') || currentPath.startsWith('/login')) {
      console.log('[App] Detectado acesso direto ao portal do funcionário, alternando modo');
      setPortalMode('employee');
      return;
    }
    
    // Se está acessando rotas de avaliação pública, também usar modo employee
    if (currentPath.startsWith('/avaliacao/') || currentPath.startsWith('/assessment/')) {
      console.log('[App] Detectado acesso a avaliação pública, alternando modo');
      setPortalMode('employee');
      return;
    }
    
    // Se está acessando rotas administrativas, usar modo admin
    if (currentPath.startsWith('/auth/login') || currentPath.startsWith('/dashboard') || currentPath === '/') {
      if (portalMode === 'employee') {
        console.log('[App] Detectado acesso administrativo, alternando modo');
        setPortalMode('admin');
      }
    }
  }, [location.pathname, navigate, portalMode]);

  // Salvar a preferência do usuário no localStorage
  useEffect(() => {
    localStorage.setItem('psi-portal-mode', portalMode);
  }, [portalMode]);

  // Função para alternar entre os portais
  const togglePortal = () => {
    const newMode = portalMode === 'admin' ? 'employee' : 'admin';
    setPortalMode(newMode);
    
    // Redirecionar para a página apropriada
    if (newMode === 'employee') {
      navigate('/portal', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <>
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
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
