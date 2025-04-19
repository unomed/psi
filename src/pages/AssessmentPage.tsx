
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { ChecklistTemplate, ChecklistResult } from "@/types";
import { toast } from "sonner";
import { AssessmentError } from "@/components/assessments/AssessmentError";
import { AssessmentLoading } from "@/components/assessments/AssessmentLoading";
import { AssessmentComplete } from "@/components/assessments/AssessmentComplete";
import { fetchAssessmentByToken, submitAssessmentResult } from "@/services/assessmentService";

export default function AssessmentPage() {
  const { token } = useParams<{ token: string }>();
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
        
        const { template, error, assessmentId, linkId } = await fetchAssessmentByToken(token);
        
        if (error) {
          setError(error);
          return;
        }
        
        setTemplate(template);
        setAssessmentId(assessmentId);
        setLinkId(linkId);
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [token]);

  const handleSubmitAssessment = async (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
    try {
      setLoading(true);
      
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
        setResult(result);
        setAssessmentCompleted(true);
        toast.success("Avaliação concluída com sucesso!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseResults = () => {
    window.location.href = "/";
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
                  onCancel={() => window.location.href = "/"}
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
