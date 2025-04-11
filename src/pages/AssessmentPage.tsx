
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { DiscResultDisplay } from "@/components/checklists/DiscResultDisplay";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AssessmentPage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [result, setResult] = useState<ChecklistResult | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would validate the token and retrieve the assessment details
        // For now, we'll use a mock implementation that fetches a template
        
        // This would typically check a tokens table or similar in the database
        if (!token) {
          setError("Link de avaliação inválido");
          return;
        }
        
        // Mock validation - in production, this would query a tokens table
        // For now, let's parse the token to extract template ID
        // Format is: timestamp-randomstring
        const tokenParts = token.split('-');
        if (tokenParts.length < 2) {
          setError("Link de avaliação inválido ou expirado");
          return;
        }
        
        // In a real app, we would fetch the assessment using the token
        // For demo, let's fetch the first template
        const { data: templates, error: templatesError } = await supabase
          .from('checklist_templates')
          .select('*')
          .limit(1);
          
        if (templatesError) {
          console.error("Error fetching template:", templatesError);
          setError("Erro ao carregar avaliação");
          return;
        }
        
        if (!templates || templates.length === 0) {
          setError("Modelo de avaliação não encontrado");
          return;
        }
        
        // Now fetch the questions for this template
        const { data: questions, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('template_id', templates[0].id);
          
        if (questionsError) {
          console.error("Error fetching questions:", questionsError);
          setError("Erro ao carregar questões");
          return;
        }
        
        // Convert the data to our application types
        const templateData: ChecklistTemplate = {
          id: templates[0].id,
          title: templates[0].title,
          description: templates[0].description || "",
          type: templates[0].type as "disc" | "custom",
          questions: (questions || []).map(q => ({
            id: q.id,
            text: q.question_text,
            targetFactor: q.target_factor as "D" | "I" | "S" | "C",
            weight: q.weight || 1
          })),
          createdAt: new Date(templates[0].created_at)
        };
        
        setTemplate(templateData);
        setAssessmentId(token); // Using token as mock assessmentId
      } catch (err) {
        console.error("Error in fetchAssessment:", err);
        setError("Erro ao carregar avaliação");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [token]);

  const handleSubmitAssessment = async (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
    try {
      setLoading(true);
      
      // In a real app, this would save the assessment result to the database
      // and update the scheduled assessment status
      
      // Mock saving result
      const result: ChecklistResult = {
        ...resultData,
        id: `result-${Date.now()}`,
        completedAt: new Date()
      };
      
      // Here we would save to database
      const { data, error } = await supabase
        .from('assessment_responses')
        .insert({
          template_id: result.templateId,
          employee_name: result.employeeName || "Anônimo",
          dominant_factor: result.dominantFactor,
          factors_scores: result.results,
          response_data: {} // We would structure this based on the responses
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error saving result:", error);
        toast.error("Erro ao salvar resultado");
        return;
      }
      
      setResult(result);
      setAssessmentCompleted(true);
      toast.success("Avaliação concluída com sucesso!");
    } catch (err) {
      console.error("Error submitting assessment:", err);
      toast.error("Erro ao enviar avaliação");
    } finally {
      setLoading(false);
    }
  };

  // Add a function to handle closing the results
  const handleCloseResults = () => {
    // Navigate back to the home page or reset the assessment
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Carregando avaliação...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Erro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">{error}</p>
            <div className="flex justify-center">
              <Button onClick={() => window.location.href = "/"}>
                Voltar para o início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-green-700 font-medium">
                  Sua avaliação foi enviada com sucesso!
                </p>
              </div>
              
              {result && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Seus Resultados:</h3>
                  <DiscResultDisplay 
                    result={result} 
                    onClose={handleCloseResults} // Add the onClose prop here
                  />
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                <Button onClick={() => window.location.href = "/"}>
                  Voltar para o início
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
