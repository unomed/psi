
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle } from "lucide-react";
import { ChecklistTemplate } from "@/types/checklist";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { AssessmentComplete } from "@/components/assessments/AssessmentComplete";
import { fetchAssessmentByToken, submitAssessmentResult } from "@/services/assessment/results";
import { toast } from "sonner";

export default function PublicAssessment() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  useEffect(() => {
    const loadAssessment = async () => {
      if (!token) {
        setError("Token de avaliação não fornecido");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchAssessmentByToken(token);
        
        if (response.error) {
          setError(response.error);
        } else if (response.template) {
          setTemplate(response.template);
          setLinkId(response.linkId);
          setAssessmentId(response.assessmentId);
        }
      } catch (err) {
        console.error("Erro ao carregar avaliação:", err);
        setError("Erro ao carregar avaliação");
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessment();
  }, [token]);

  const handleSubmitAssessment = async (resultData: any) => {
    if (!template) return;

    try {
      const assessmentResult = {
        templateId: template.id,
        employeeName: "Avaliação Externa",
        employeeId: "",
        results: resultData.results,
        dominantFactor: resultData.dominantFactor,
        categorizedResults: resultData.categorizedResults || {},
        responses: resultData.responses,
        linkId,
        assessmentId
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
      setIsCompleted(true);
      toast.success("Avaliação concluída com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    }
  };

  const handleCloseResult = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Erro</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button 
              className="mt-4 w-full" 
              onClick={() => navigate("/")}
            >
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted && assessmentResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AssessmentComplete 
              result={assessmentResult}
              onClose={handleCloseResult}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <CardTitle>Avaliação Psicossocial</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Complete a avaliação seguindo as instruções abaixo
              </p>
            </CardHeader>
            <CardContent>
              {template && (
                <DiscAssessmentForm
                  template={template}
                  onSubmit={handleSubmitAssessment}
                  onCancel={handleCloseResult}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
