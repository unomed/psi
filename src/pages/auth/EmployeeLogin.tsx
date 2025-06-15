
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeLoginForm } from "@/components/employee/EmployeeLoginForm";

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
        
        <EmployeeLoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
