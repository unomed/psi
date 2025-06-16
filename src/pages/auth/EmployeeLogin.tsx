
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeLoginForm } from "@/components/employee/EmployeeLoginForm";
import { Shield, Users } from "lucide-react";

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
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">PSI Safe</h1>
                <p className="text-sm text-muted-foreground">Unomed - Avaliação Psicossocial</p>
              </div>
            </div>
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
              Acesse suas avaliações psicossociais
            </p>
          </div>
          
          <EmployeeLoginForm onLoginSuccess={handleLoginSuccess} />

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
