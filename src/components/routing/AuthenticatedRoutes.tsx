import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminRoutes } from "./AdminRoutes";
import MainLayout from "@/components/layout/MainLayout";

export function AuthenticatedRoutes() {
  const { session, loading } = useAuth();
  
  console.log('[AuthenticatedRoutes] Estado da autenticação:', {
    hasSession: !!session,
    loading
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Carregando Portal Administrativo...</p>
        </div>
      </div>
    );
  }

  // Verificar se o usuário está autenticado
  if (!session) {
    // Redirecionar para a página de login se não estiver autenticado
    return <Navigate to="/auth/login" replace />;
  }

  // Se estiver autenticado, renderizar as rotas administrativas com o layout principal
  return (
    <MainLayout>
      <AdminRoutes />
    </MainLayout>
  );
}
