
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { ChecklistTemplate, ChecklistResult } from "@/types";
import { toast } from "sonner";
import { AssessmentError } from "@/components/assessments/AssessmentError";
import { AssessmentLoading } from "@/components/assessments/AssessmentLoading";
import { AssessmentComplete } from "@/components/assessments/AssessmentComplete";
import { checkLinkValidity, markLinkAsUsed } from "@/services/assessment/links";
import { fetchAssessmentByToken, submitAssessmentResult } from "@/services/assessment/results";

export default function AssessmentPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [result, setResult] = useState<ChecklistResult | null>(null);

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        
        if (!token) {
          setError("Link de avaliação inválido");
          return;
        }
        
        const response = await fetchAssessmentByToken(token);
        
        if (response.error) {
          setError(response.error);
          return;
        }
        
        if (!('template' in response) || !response.template) {
          setError("Modelo de avaliação não encontrado");
          return;
        }
        
        // Complete the template with required properties
        const completeTemplate: ChecklistTemplate = {
          ...response.template,
          name: response.template.title,
          is_standard: false,
          is_active: true,
          estimated_time_minutes: 15,
          version: 1,
          createdAt: new Date(response.template.created_at),
          cutoff_scores: response.template.cutoff_scores || { high: 80, medium: 60, low: 40 },
          questions: response.template.questions || []
        };

        setTemplate(completeTemplate);
        
        if ('linkData' in response && response.linkData) {
          setLinkId(response.linkData.id);
        }
        
        console.log("Assessment loaded successfully:", { template: completeTemplate, linkId });
      } catch (err) {
        console.error("Error loading assessment:", err);
        setError("Erro ao carregar avaliação. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [token, navigate]);

  const handleSubmitAssessment = async (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
    try {
      setLoading(true);
      
      if (!linkId) {
        toast.error("Erro ao identificar o link da avaliação");
        return;
      }
      
      const { result, error } = await submitAssessmentResult({
        ...resultData,
        assessmentId,
        linkId
      });
      
      if (error) {
        toast.error(error);
        return;
      }
      
      if (result) {
        // Mark link as used
        if (token) {
          await markLinkAsUsed(token);
        }
        
        // Complete the result with required properties
        const completeResult: ChecklistResult = {
          ...result,
          templateId: result.template_id,
          employeeId: result.employee_id,
          employeeName: result.employee_name,
          responses: result.response_data as Record<string, any>,
          results: result.factors_scores as Record<string, number>,
          completedAt: new Date(result.completed_at)
        };
        
        setResult(completeResult);
        setAssessmentCompleted(true);
        toast.success("Avaliação concluída com sucesso!");
      }
    } catch (err) {
      console.error("Error submitting assessment:", err);
      toast.error("Erro ao enviar avaliação. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseResults = () => {
    window.location.href = "https://avaliacao.unomed.med.br/";
  };

  if (loading) {
    return <AssessmentLoading />;
  }

  if (error) {
    return <AssessmentError errorMessage={error} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center">
            {assessmentCompleted 
              ? "Avaliação Concluída" 
              : template?.title || "Avaliação"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!assessmentCompleted ? (
            <>
              {template && (
                <div className="mb-4">
                  <p className="text-muted-foreground">{template.description}</p>
                </div>
              )}
              
              {template && (
                <DiscAssessmentForm 
                  template={template} 
                  onSubmit={handleSubmitAssessment}
                  onCancel={() => window.location.href = "https://avaliacao.unomed.med.br/"}
                />
              )}
            </>
          ) : (
            result && <AssessmentComplete result={result} onClose={handleCloseResults} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
