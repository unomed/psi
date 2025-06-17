
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { fetchAssessmentByToken } from "@/services/assessment/results";
import { ChecklistTemplate } from "@/types/checklist";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { PsicossocialAssessmentForm } from "@/components/checklists/PsicossocialAssessmentForm";
import { AssessmentComplete } from "@/components/assessments/AssessmentComplete";
import { submitAssessmentResult } from "@/services/assessment/results";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PublicAssessment() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("employee");
  const assessmentId = searchParams.get("assessment");
  
  const [isLoading, setIsLoading] = useState(true);
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [currentView, setCurrentView] = useState<'assessment' | 'completed'>('assessment');
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);

  console.log("[PublicAssessment] Iniciando validação do token:", token);
  console.log("[PublicAssessment] URL atual:", window.location.href);
  console.log("[PublicAssessment] Tentativa número:", retryCount + 1);

  useEffect(() => {
    const loadAssessment = async () => {
      if (!token) {
        toast.error("Token de avaliação não encontrado");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("[PublicAssessment] Chamando fetchAssessmentByToken...");
        
        const response = await fetchAssessmentByToken(token);
        console.log("[PublicAssessment] Resposta recebida:", response);
        
        if (response.error) {
          console.error("[PublicAssessment] Erro na validação:", response.error);
          toast.error(response.error);
          setIsLoading(false);
          return;
        }

        if ('template' in response && response.template) {
          console.log("[PublicAssessment] Validação bem-sucedida:", response.template);
          setTemplate(response.template);
          setEmployeeName(response.employeeName || "Funcionário");
          setIsLoading(false);
        } else {
          console.error("[PublicAssessment] Resposta inválida:", response);
          toast.error("Resposta inválida do servidor");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[PublicAssessment] Erro ao carregar avaliação:", error);
        
        // Tentar novamente até 3 vezes
        if (retryCount < 2) {
          console.log("[PublicAssessment] Tentando novamente em 2 segundos...");
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        } else {
          toast.error("Erro ao carregar avaliação. Tente novamente mais tarde.");
          setIsLoading(false);
        }
      }
    };

    loadAssessment();
  }, [token, retryCount]);

  const handleSubmitAssessment = async (resultData: any) => {
    if (!template) return;

    try {
      const assessmentResult = {
        templateId: template.id,
        employeeName: employeeName,
        employeeId: employeeId || "",
        results: resultData.results,
        dominantFactor: resultData.dominantFactor,
        categorizedResults: resultData.categorizedResults || {},
        responses: resultData.responses,
        linkId: null,
        assessmentId: assessmentId
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
    // Redirecionar para o portal do funcionário
    if (employeeId) {
      window.location.href = `/employee-portal?employee=${employeeId}`;
    } else {
      window.location.href = '/employee-portal';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <div className="text-muted-foreground">
            <h2 className="text-xl font-semibold mb-2">Carregando avaliação</h2>
            <p>Aguarde enquanto preparamos seu questionário...</p>
            {retryCount > 0 && (
              <p className="text-sm mt-2">Tentativa {retryCount + 1} de 3</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Avaliação não encontrada</h2>
            <p className="text-muted-foreground mb-4">
              O link de avaliação pode estar expirado ou inválido.
            </p>
            <Button onClick={handleBackToDashboard} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'completed' && assessmentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{template.title}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {template.description}
                  </p>
                  {employeeName && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Funcionário: <span className="font-medium">{employeeName}</span>
                    </p>
                  )}
                </div>
                <Button variant="outline" onClick={handleBackToDashboard} size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {template.type === 'disc' ? (
                <DiscAssessmentForm
                  template={template}
                  onSubmit={handleSubmitAssessment}
                  onCancel={handleBackToDashboard}
                />
              ) : (
                <PsicossocialAssessmentForm
                  template={template}
                  onSubmit={handleSubmitAssessment}
                  onCancel={handleBackToDashboard}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
