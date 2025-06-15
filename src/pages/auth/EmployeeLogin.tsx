
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployeeLoginForm } from "@/components/employee/EmployeeLoginForm";
import { ArrowLeft, Shield, Users } from "lucide-react";

export default function EmployeeLogin() {
  const handleLoginSuccess = (employeeData: any) => {
    // Redirect to employee portal after successful login
    window.location.href = "/employee-portal";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">PSI Safe</h1>
                <p className="text-sm text-muted-foreground">Unomed - Avaliação Psicossocial</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth/login" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Área Administrativa
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Portal do Funcionário
            </h2>
            <p className="text-gray-600">
              Acesse suas avaliações psicossociais e acompanhe seu bem-estar no trabalho
            </p>
          </div>
          
          <EmployeeLoginForm onLoginSuccess={handleLoginSuccess} />

          {/* Features */}
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="font-semibold mb-3 text-center">O que você pode fazer:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Responder avaliações psicossociais
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Registrar seu humor diário
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Acompanhar suas estatísticas pessoais
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Visualizar recomendações personalizadas
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Dados protegidos pela LGPD • Confidencial e seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
