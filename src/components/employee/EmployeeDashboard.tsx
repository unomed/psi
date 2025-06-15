
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, ClipboardList, BarChart3, Calendar } from "lucide-react";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { PendingAssessmentsList } from "./PendingAssessmentsList";
import { MoodSelector } from "./MoodSelector";
import { MoodStatsCard } from "./MoodStatsCard";
import { fetchAssessmentByToken } from "@/services/assessment/results";
import { ChecklistTemplate } from "@/types/checklist";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { AssessmentComplete } from "@/components/assessments/AssessmentComplete";
import { submitAssessmentResult } from "@/services/assessment/results";
import { toast } from "sonner";

interface EmployeeDashboardProps {
  assessmentToken?: string | null;
  templateId?: string;
}

export function EmployeeDashboard({ assessmentToken, templateId }: EmployeeDashboardProps) {
  const { session, logout } = useEmployeeAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'dashboard' | 'assessment' | 'completed'>('dashboard');
  const [assessmentTemplate, setAssessmentTemplate] = useState<ChecklistTemplate | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);

  useEffect(() => {
    const loadAssessment = async () => {
      if (assessmentToken && session?.isAuthenticated) {
        setIsLoadingAssessment(true);
        try {
          const response = await fetchAssessmentByToken(assessmentToken);
          
          if (response.error) {
            toast.error(response.error);
          } else if (response.template) {
            setAssessmentTemplate(response.template);
            setCurrentView('assessment');
          }
        } catch (error) {
          console.error("Erro ao carregar avaliação:", error);
          toast.error("Erro ao carregar avaliação");
        } finally {
          setIsLoadingAssessment(false);
        }
      }
    };

    loadAssessment();
  }, [assessmentToken, session?.isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmitAssessment = async (resultData: any) => {
    if (!assessmentTemplate || !session?.employee) return;

    try {
      const assessmentResult = {
        templateId: assessmentTemplate.id,
        employeeName: session.employee.employeeName,
        employeeId: session.employee.employeeId,
        results: resultData.results,
        dominantFactor: resultData.dominantFactor,
        categorizedResults: resultData.categorizedResults || {},
        responses: resultData.responses,
        linkId: null,
        assessmentId: null
      };

      const result = await submitAssessmentResult(assessmentResult);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      setAssessmentResult({
        ...assessmentResult,
        id: result.result?.id || "",
        completedAt: new Date()
      });
      setCurrentView('completed');
      toast.success("Avaliação concluída com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setAssessmentTemplate(null);
    setAssessmentResult(null);
  };

  if (isLoadingAssessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Carregando avaliação...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'assessment' && assessmentTemplate) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Avaliação: {assessmentTemplate.title}</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {assessmentTemplate.description}
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleBackToDashboard}>
                    Voltar ao Dashboard
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DiscAssessmentForm
                  template={assessmentTemplate}
                  onSubmit={handleSubmitAssessment}
                  onCancel={handleBackToDashboard}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'completed' && assessmentResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AssessmentComplete 
              result={assessmentResult}
              onClose={handleBackToDashboard}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                Olá, {session?.employee?.employeeName}
              </h1>
              <p className="text-muted-foreground">
                {session?.employee?.companyName}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Avaliações Pendentes */}
          <div className="lg:col-span-2">
            <PendingAssessmentsList employeeId={session?.employee?.employeeId || ""} />
          </div>

          {/* Humor do Dia */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Como você está hoje?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MoodSelector employeeId={session?.employee?.employeeId || ""} />
              </CardContent>
            </Card>

            <MoodStatsCard employeeId={session?.employee?.employeeId || ""} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <ClipboardList className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Ver Histórico</div>
                    <div className="text-sm text-muted-foreground">
                      Avaliações anteriores
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <BarChart3 className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Meus Relatórios</div>
                    <div className="text-sm text-muted-foreground">
                      Resultados pessoais
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
