
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Home, ClipboardList, BarChart3, Calendar, User } from "lucide-react";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";
import { PendingAssessmentsList } from "@/components/employee/PendingAssessmentsList";
import { MoodSelector } from "@/components/employee/MoodSelector";
import { MoodStatsCard } from "@/components/employee/MoodStatsCard";

type ViewType = 'dashboard' | 'assessments' | 'history' | 'profile';

export function EmployeeSimpleDashboard() {
  const { session, logout } = useEmployeeAuthNative();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const handleLogout = () => {
    logout();
  };

  if (!session?.employee) {
    return null;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: Home },
    { id: 'assessments', label: 'Avaliações', icon: ClipboardList },
    { id: 'history', label: 'Histórico', icon: BarChart3 },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'assessments':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Avaliações Pendentes</h2>
            <PendingAssessmentsList employeeId={session.employee.employeeId} />
          </div>
        );
      
      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Histórico</h2>
            <div className="grid gap-6">
              <MoodStatsCard employeeId={session.employee.employeeId} />
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600">Histórico de avaliações em desenvolvimento...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Meu Perfil</h2>
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome</label>
                  <p className="text-gray-900">{session.employee.employeeName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Empresa</label>
                  <p className="text-gray-900">{session.employee.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ID do Funcionário</label>
                  <p className="text-gray-900 font-mono">{session.employee.employeeId}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            {/* Header Welcome */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Olá, {session.employee.employeeName}! 👋
              </h1>
              <p className="text-lg text-gray-600">{session.employee.companyName}</p>
            </div>

            {/* Grid Principal */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Coluna Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Humor do Dia */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Como você está hoje?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MoodSelector employeeId={session.employee.employeeId} />
                  </CardContent>
                </Card>

                {/* Avaliações Pendentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      Avaliações Pendentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PendingAssessmentsList employeeId={session.employee.employeeId} />
                  </CardContent>
                </Card>
              </div>

              {/* Coluna Lateral */}
              <div className="space-y-6">
                {/* Estatísticas de Humor */}
                <MoodStatsCard employeeId={session.employee.employeeId} />

                {/* Ações Rápidas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Ações Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setCurrentView('assessments')}
                    >
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Ver Todas as Avaliações
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setCurrentView('history')}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Histórico Completo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Simples */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Portal</h2>
          <p className="text-sm text-gray-500">Funcionário</p>
        </div>
        
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
