
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";

export async function fetchAssessmentByToken(token: string): Promise<{
  template: ChecklistTemplate | null;
  error: string | null;
  assessmentId: string | null;
}> {
  try {
    if (!token) {
      return { template: null, error: "Link de avaliação inválido", assessmentId: null };
    }
    
    // Parse the token to extract template ID
    const tokenParts = token.split('-');
    if (tokenParts.length < 2) {
      return { 
        template: null, 
        error: "Link de avaliação inválido ou expirado", 
        assessmentId: null 
      };
    }
    
    // Fetch the first template (for demo purposes)
    const { data: templates, error: templatesError } = await supabase
      .from('checklist_templates')
      .select('*')
      .limit(1);
      
    if (templatesError) {
      console.error("Error fetching template:", templatesError);
      return { template: null, error: "Erro ao carregar avaliação", assessmentId: null };
    }
    
    if (!templates || templates.length === 0) {
      return { 
        template: null, 
        error: "Modelo de avaliação não encontrado", 
        assessmentId: null 
      };
    }
    
    // Fetch questions for this template
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('template_id', templates[0].id);
      
    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return { template: null, error: "Erro ao carregar questões", assessmentId: null };
    }
    
    // Convert the data to application types
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
    
    return { 
      template: templateData, 
      error: null, 
      assessmentId: token // Using token as mock assessmentId
    };
  } catch (err) {
    console.error("Error in fetchAssessment:", err);
    return { template: null, error: "Erro ao carregar avaliação", assessmentId: null };
  }
}

export async function submitAssessmentResult(
  resultData: Omit<ChecklistResult, "id" | "completedAt">
): Promise<{ result: ChecklistResult | null; error: string | null }> {
  try {
    // Create result with ID and completion date
    const result: ChecklistResult = {
      ...resultData,
      id: `result-${Date.now()}`,
      completedAt: new Date()
    };
    
    // Save to database
    const { data, error } = await supabase
      .from('assessment_responses')
      .insert({
        template_id: result.templateId,
        employee_name: result.employeeName || "Anônimo",
        dominant_factor: result.dominantFactor,
        factors_scores: result.results,
        response_data: {} // Would structure this based on responses
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error saving result:", error);
      return { result: null, error: "Erro ao salvar resultado" };
    }
    
    return { result, error: null };
  } catch (err) {
    console.error("Error submitting assessment:", err);
    return { result: null, error: "Erro ao enviar avaliação" };
  }
}
