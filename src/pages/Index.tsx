
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/auth/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  console.log('[Index] Estado da autenticação:', { hasUser: !!user, loading });

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se usuário está autenticado (admin/superadmin), redirecionar para dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Página de seleção de sistema para usuários não autenticados
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PSI Safe</h1>
          <p className="text-gray-600">Sistema de Avaliação de Riscos Psicossociais (NR 01)</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Acesso Administrativo */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-xl">Acesso Administrativo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-6">
                Para administradores e superadministradores do sistema
              </p>
              <Button 
                className="w-full" 
                onClick={() => window.location.href = '/auth/login'}
              >
                Entrar como Administrador
              </Button>
            </CardContent>
          </Card>

          {/* Portal do Funcionário */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-xl">Portal do Funcionário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-6">
                Para funcionários acessarem avaliações e bem-estar
              </p>
              <Button 
                variant="outline" 
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => window.location.href = '/auth/employee'}
              >
                Entrar como Funcionário
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 PSI Safe - Sistema de Gestão de Riscos Psicossociais</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
