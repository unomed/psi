
import React from "react";
import { Link } from "react-router-dom";
import { EmployeeNativeLoginForm } from "@/components/employee/EmployeeNativeLoginForm";

export function EmployeeLoginPage() {
  const handleLoginSuccess = () => {
    console.log('[EmployeeLoginPage] Login realizado com sucesso');
    // O redirecionamento será automático via EmployeeRoutes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Portal do Funcionário</h1>
          <p className="text-gray-600">Faça login para acessar seu painel</p>
        </div>
        
        <EmployeeNativeLoginForm onLoginSuccess={handleLoginSuccess} />
        
        <div className="mt-8 text-center space-y-3">
          <div className="text-sm text-gray-500">
            <p>Use seu CPF e os últimos 4 dígitos como senha</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">
              É administrador?{" "}
              <Link to="/auth/login" className="underline text-primary">
                Acesse o Sistema Administrativo
              </Link>
            </p>
          </div>
          <div className="text-center">
            <Link to="/" className="text-sm text-muted-foreground underline">
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
