
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, ChecklistResult, DiscQuestion, DiscFactorType, ScheduledAssessment, ScaleType } from "@/types/checklist";
import { Json } from "@/integrations/supabase/types";

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
      type: template.type as "disc" | "custom", 
      scaleType: template.scale_type as ScaleType || "likert5", // Adicionar o tipo de escala
      questions: (template.questions || []).map(q => ({
        id: q.id,
        text: q.question_text,
        targetFactor: q.target_factor as DiscFactorType,
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
      scale_type: template.scaleType || "likert5", // Salvar o tipo de escala
      is_active: true
    })
    .select()
    .single();

  if (templateError) {
    console.error("Error creating checklist template:", templateError);
    throw templateError;
  }

  const templateId = templateData?.id;
  if (!templateId) {
    throw new Error("Failed to get template ID after insertion");
  }

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

  return data?.id || "";
}

// Save a scheduled assessment to Supabase
export async function saveScheduledAssessment(assessment: Omit<ScheduledAssessment, "id">): Promise<string> {
  // In a real app, this would save to the assessment_schedules table
  
  // Mock for now, in a real app this would be a supabase insert
  console.log("Saving scheduled assessment:", assessment);
  
  // Return a mock ID
  return `sched-${Date.now()}`;
}

// Generate a unique assessment link
export function generateAssessmentLink(templateId: string, employeeId: string): string {
  // In a real app, this would generate a unique token and save it to the database
  // Then return a link with the token
  
  // For now, just return a mock link
  const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  return `${window.location.origin}/avaliacao/${token}`;
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

  // Map the Supabase data to our application types with proper type handling
  return (data || []).map(result => {
    // Ensure the factors_scores is in the expected format
    const factorScoresRaw = result.factors_scores as Json | null;
    let factorScores = { D: 0, I: 0, S: 0, C: 0 };
    
    // Make sure we have all required properties and they are numbers
    if (factorScoresRaw && typeof factorScoresRaw === 'object' && factorScoresRaw !== null) {
      const rawScores = factorScoresRaw as Record<string, unknown>;
      
      // Safely convert each property to a number
      if ('D' in rawScores && rawScores.D !== null) factorScores.D = Number(rawScores.D) || 0;
      if ('I' in rawScores && rawScores.I !== null) factorScores.I = Number(rawScores.I) || 0;
      if ('S' in rawScores && rawScores.S !== null) factorScores.S = Number(rawScores.S) || 0;
      if ('C' in rawScores && rawScores.C !== null) factorScores.C = Number(rawScores.C) || 0;
    }

    return {
      id: result.id,
      templateId: result.template_id,
      employeeName: result.employee_name || "Anônimo",
      results: factorScores,
      dominantFactor: (result.dominant_factor as DiscFactorType) || "D",
      completedAt: new Date(result.completed_at)
    };
  });
}
