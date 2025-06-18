
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";
import { EmployeeModernSidebar } from "./EmployeeModernSidebar";
import { PendingAssessmentsList } from "../PendingAssessmentsList";
import { MoodStatsCard } from "../MoodStatsCard";
import { QuestionnaireStatsCard } from "./QuestionnaireStatsCard";
import { SymptomsGuidanceSection } from "./SymptomsGuidanceSection";
import { WhatsAppButton } from "./WhatsAppButton";
import { DailyHealthMessage } from "./DailyHealthMessage";
import { WellnessCard } from "./WellnessCard";
import { ModernMoodSelector } from "./ModernMoodSelector";

interface EmployeeModernDashboardProps {
  assessmentToken?: string | null;
  templateId?: string;
  assessmentId?: string | null;
  expectedEmployeeId?: string | null;
}

export function EmployeeModernDashboard({ 
  assessmentToken, 
  templateId, 
  assessmentId,
  expectedEmployeeId 
}: EmployeeModernDashboardProps) {
  const { session, logout } = useEmployeeAuthNative();
  const [currentView, setCurrentView] = useState<'dashboard' | 'assessments' | 'history' | 'symptoms'>(
    // Se há um assessment específico, começar na aba de avaliações
    assessmentId ? 'assessments' : 'dashboard'
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/employee";
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'assessments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Avaliações Agendadas</h2>
              {assessmentId && (
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  ✨ Você tem uma avaliação específica para responder
                </div>
              )}
            </div>
            <PendingAssessmentsList 
              employeeId={session?.employee?.employeeId || ""} 
              highlightAssessmentId={assessmentId}
            />
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Histórico de Avaliações</h2>
            <div className="grid gap-6">
              <QuestionnaireStatsCard employeeId={session?.employee?.employeeId || ""} />
              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <p className="text-gray-600">Histórico detalhado de avaliações será implementado aqui.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'symptoms':
        return <SymptomsGuidanceSection />;
      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Olá, {session?.employee?.employeeName}! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  {session?.employee?.companyName}
                </p>
                {assessmentId && (
                  <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-blue-800 text-sm">
                      Você tem uma avaliação pendente. 
                      <Button 
                        variant="link" 
                        className="text-blue-600 underline p-0 ml-1 h-auto"
                        onClick={() => setCurrentView('assessments')}
                      >
                        Clique aqui para responder
                      </Button>
                    </p>
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={handleLogout} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 md:hidden">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Coluna Principal - Humor e Mensagens */}
              <div className="lg:col-span-2 space-y-6">
                {/* Mensagem Diária de Saúde - removendo employeeId prop */}
                <DailyHealthMessage />

                {/* Seletor de Humor Moderno - removendo employeeId prop */}
                <ModernMoodSelector />
              </div>

              {/* Coluna Lateral - Estatísticas e Bem-estar */}
              <div className="space-y-6">
                {/* Estatísticas de Humor */}
                <MoodStatsCard employeeId={session?.employee?.employeeId || ""} />

                {/* Card de Bem-estar */}
                <WellnessCard />

                {/* Estatísticas dos Questionários */}
                <QuestionnaireStatsCard employeeId={session?.employee?.employeeId || ""} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      <EmployeeModernSidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        employeeName={session?.employee?.employeeName || ""}
        hasNewAssessment={!!assessmentId}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {renderCurrentView()}
        </main>
        
        <WhatsAppButton />
      </div>
    </div>
  );
}
