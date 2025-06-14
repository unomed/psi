
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import { MoodSelector } from './MoodSelector';
import { PendingAssessmentsList } from './PendingAssessmentsList';
import { MoodStatsCard } from './MoodStatsCard';
import { LogOut, User, Building } from 'lucide-react';

export function EmployeeDashboard() {
  const { session, logout } = useEmployeeAuth();

  if (!session) {
    return null;
  }

  const { employee } = session;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Olá, {employee.employeeName}! 👋
            </h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Building className="h-4 w-4" />
              {employee.companyName}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Mood Selector - Full width on mobile, 2 cols on larger screens */}
          <div className="md:col-span-2 lg:col-span-2">
            <MoodSelector employeeId={employee.employeeId} />
          </div>

          {/* Mood Stats */}
          <div className="lg:col-span-1">
            <MoodStatsCard employeeId={employee.employeeId} />
          </div>

          {/* Pending Assessments - Full width */}
          <div className="md:col-span-2 lg:col-span-3">
            <PendingAssessmentsList employeeId={employee.employeeId} />
          </div>
        </div>

        {/* Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">📝 Sobre as Avaliações</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• As avaliações são confidenciais e anônimas</li>
                  <li>• Tempo estimado: 15-20 minutos</li>
                  <li>• Ajudam a melhorar o ambiente de trabalho</li>
                  <li>• Dados protegidos conforme LGPD</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">😊 Sobre o Registro de Humor</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Registre seu humor diariamente</li>
                  <li>• Dados usados para bem-estar geral</li>
                  <li>• Acompanhe sua evolução pessoal</li>
                  <li>• Informação confidencial</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
