
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployeeLoginForm } from "@/components/employee/EmployeeLoginForm";
import { ArrowLeft } from "lucide-react";

export default function EmployeeLogin() {
  const handleLoginSuccess = (employeeData: any) => {
    // Redirect to employee portal after successful login
    window.location.href = "/employee-portal";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">PSI Safe</h1>
          <p className="text-sm text-muted-foreground">Portal do Funcionário - Unomed</p>
        </div>
        
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth/login" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar para seleção de acesso
            </Link>
          </Button>
        </div>
        
        <EmployeeLoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
