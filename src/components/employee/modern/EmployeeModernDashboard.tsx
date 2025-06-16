
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, MessageCircle } from "lucide-react";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { EmployeeModernSidebar } from "./EmployeeModernSidebar";
import { PendingAssessmentsList } from "../PendingAssessmentsList";
import { MoodSelector } from "../MoodSelector";
import { MoodStatsCard } from "../MoodStatsCard";
import { SymptomsGuidanceSection } from "./SymptomsGuidanceSection";
import { WhatsAppButton } from "./WhatsAppButton";

interface EmployeeModernDashboardProps {
  assessmentToken?: string | null;
  templateId?: string;
}

export function EmployeeModernDashboard({ assessmentToken, templateId }: EmployeeModernDashboardProps) {
  const { session, logout } = useEmployeeAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'assessments' | 'history' | 'symptoms'>('dashboard');

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'assessments':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Avaliações Agendadas</h2>
            <PendingAssessmentsList employeeId={session?.employee?.employeeId || ""} />
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Histórico de Avaliações</h2>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <p className="text-gray-600">Histórico de avaliações será implementado aqui.</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'symptoms':
        return <SymptomsGuidanceSection />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Olá, {session?.employee?.employeeName}
                </h1>
                <p className="text-gray-600">
                  {session?.employee?.companyName}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <PendingAssessmentsList employeeId={session?.employee?.employeeId || ""} />
              </div>

              <div className="space-y-6">
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Como você está hoje?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MoodSelector employeeId={session?.employee?.employeeId || ""} />
                  </CardContent>
                </Card>

                <MoodStatsCard employeeId={session?.employee?.employeeId || ""} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <EmployeeModernSidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        employeeName={session?.employee?.employeeName || ""}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-50">
          {renderCurrentView()}
        </main>
        
        <WhatsAppButton />
      </div>
    </div>
  );
}
