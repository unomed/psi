
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Home, ClipboardList, BarChart3, Calendar, User, Heart } from "lucide-react";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";
import { PendingAssessmentsList } from "@/components/employee/PendingAssessmentsList";
import { MoodSelector } from "@/components/employee/MoodSelector";
import { MoodStatsCard } from "@/components/employee/MoodStatsCard";
import { SymptomsGuidanceSection } from "@/components/employee/modern/SymptomsGuidanceSection";
import { WhatsAppButton } from "@/components/employee/modern/WhatsAppButton";
import { WellnessCard } from "@/components/employee/modern/WellnessCard";
import { DailyHealthMessage } from "@/components/employee/modern/DailyHealthMessage";

type ViewType = 'dashboard' | 'assessments' | 'history' | 'health' | 'profile';

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
    { id: 'health', label: 'Saúde', icon: Heart },
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
      
      case 'health':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Saúde e Bem-estar</h2>
            <SymptomsGuidanceSection />
          </div>
        );
      
      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Histórico</h2>
            <div className="grid gap-6">
              <MoodStatsCard employeeId={session.employee.employeeId} />
              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <p className="text-gray-600">Histórico detalhado de avaliações será implementado em breve...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Meu Perfil</h2>
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
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
            {/* Header Welcome com gradiente */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white shadow-lg">
              <h1 className="text-3xl font-bold mb-2">
                Olá, {session.employee.employeeName}! 👋
              </h1>
              <p className="text-lg text-blue-100">{session.employee.companyName}</p>
            </div>

            {/* Grid Principal */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Coluna Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Mensagem Diária de Saúde */}
                <DailyHealthMessage employeeId={session.employee.employeeId} />

                {/* Humor do Dia */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Como você está hoje?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MoodSelector employeeId={session.employee.employeeId} />
                  </CardContent>
                </Card>

                {/* Avaliações Pendentes */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-green-500" />
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
                {/* Card de Bem-estar */}
                <WellnessCard />

                {/* Estatísticas de Humor */}
                <MoodStatsCard employeeId={session.employee.employeeId} />

                {/* Ações Rápidas */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      Ações Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-blue-50"
                      onClick={() => setCurrentView('assessments')}
                    >
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Ver Todas as Avaliações
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-green-50"
                      onClick={() => setCurrentView('health')}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Orientações de Saúde
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-purple-50"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar Modernizada */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <h2 className="text-xl font-bold">Portal do Funcionário</h2>
          <p className="text-sm text-blue-100">Unomed</p>
        </div>
        
        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
            className="w-full justify-start bg-white border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
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

      {/* Botão do WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
