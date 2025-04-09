
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, ChecklistResult, DiscQuestion } from "@/types/checklist";

// Fetch all checklist templates from Supabase
export async function fetchChecklistTemplates(): Promise<ChecklistTemplate[]> {
  const { data, error } = await supabase
    .from('checklist_templates')
    .select('*, questions(*)');
  
  if (error) {
    console.error("Error fetching checklist templates:", error);
    throw error;
  }

  // Map the Supabase data to our application types
  return (data || []).map(template => {
    return {
      id: template.id,
      title: template.title,
      description: template.description || "",
      type: template.type as "disc" | "custom", // We'll need to expand this as we add more types
      questions: (template.questions || []).map(q => ({
        id: q.id,
        text: q.question_text,
        targetFactor: q.target_factor as any,
        weight: q.weight || 1
      })),
      createdAt: new Date(template.created_at)
    };
  });
}

// Save a new checklist template to Supabase
export async function saveChecklistTemplate(template: Omit<ChecklistTemplate, "id" | "createdAt">): Promise<string> {
  // First, insert the template
  const { data: templateData, error: templateError } = await supabase
    .from('checklist_templates')
    .insert({
      title: template.title,
      description: template.description,
      type: template.type,
      scale_type: template.type === 'disc' ? 'likert5' : 'custom',
      is_active: true
    })
    .select()
    .single();

  if (templateError) {
    console.error("Error creating checklist template:", templateError);
    throw templateError;
  }

  const templateId = templateData.id;

  // Then, insert all questions
  const questionsToInsert = template.questions.map((q, index) => ({
    template_id: templateId,
    question_text: q.text,
    order_number: index + 1,
    target_factor: q.targetFactor,
    weight: q.weight
  }));

  const { error: questionsError } = await supabase
    .from('questions')
    .insert(questionsToInsert);

  if (questionsError) {
    console.error("Error creating checklist questions:", questionsError);
    throw questionsError;
  }

  return templateId;
}

// Save an assessment result to Supabase
export async function saveAssessmentResult(result: Omit<ChecklistResult, "id" | "completedAt">): Promise<string> {
  const { data, error } = await supabase
    .from('assessment_responses')
    .insert({
      template_id: result.templateId,
      employee_name: result.employeeName,
      dominant_factor: result.dominantFactor,
      factors_scores: result.results,
      response_data: {}, // We would need to structure this based on the responses
      completed_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving assessment result:", error);
    throw error;
  }

  return data.id;
}

// Fetch all assessment results from Supabase
export async function fetchAssessmentResults(): Promise<ChecklistResult[]> {
  const { data, error } = await supabase
    .from('assessment_responses')
    .select('*');
  
  if (error) {
    console.error("Error fetching assessment results:", error);
    throw error;
  }

  // Map the Supabase data to our application types
  return (data || []).map(result => {
    return {
      id: result.id,
      templateId: result.template_id,
      employeeName: result.employee_name || "Anônimo",
      results: result.factors_scores || { D: 0, I: 0, S: 0, C: 0 },
      dominantFactor: result.dominant_factor as any || "D",
      completedAt: new Date(result.completed_at)
    };
  });
}
