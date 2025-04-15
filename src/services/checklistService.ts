
import { supabase } from "@/integrations/supabase/client";
import { 
  ChecklistTemplate, 
  ChecklistResult, 
  DiscQuestion, 
  DiscFactorType,
  ScaleType,
  scaleTypeToDbScaleType 
} from "@/types/checklist";
import { Database } from "@/integrations/supabase/types";

// Define types from Supabase that we need
type Json = Database["public"]["Tables"]["assessment_responses"]["Row"]["factors_scores"];

// Type for scheduled assessment that was missing
export interface ScheduledAssessment {
  id: string;
  employeeId: string;
  templateId: string;
  scheduledDate: Date;
  sentAt: Date | null;
  linkUrl: string;
  status: "scheduled" | "sent" | "completed";
  completedAt: Date | null;
  recurrenceType?: "none" | "monthly" | "semiannual" | "annual";
  nextScheduledDate?: Date | null;
  phoneNumber?: string;
}

// Fetch all checklist templates from Supabase
export async function fetchChecklistTemplates(): Promise<ChecklistTemplate[]> {
  const { data, error } = await supabase
    .from('checklist_templates')
    .select('*, questions(*)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching checklist templates:", error);
    throw error;
  }

  return (data || []).map(template => ({
    id: template.id,
    title: template.title,
    description: template.description || "",
    type: template.type as "disc" | "custom",
    scaleType: mapDbScaleToAppScale(template.scale_type),
    isStandard: template.is_standard || false,
    companyId: template.company_id,
    derivedFromId: template.derived_from_id,
    questions: (template.questions || []).map(q => ({
      id: q.id,
      text: q.question_text,
      targetFactor: q.target_factor as DiscFactorType,
      weight: q.weight || 1
    })),
    createdAt: new Date(template.created_at)
  }));
}

// Save a new checklist template to Supabase
export async function saveChecklistTemplate(
  template: Omit<ChecklistTemplate, "id" | "createdAt">, 
  isStandard: boolean = false
): Promise<string> {
  const { data: templateData, error: templateError } = await supabase
    .from('checklist_templates')
    .insert({
      title: template.title,
      description: template.description,
      type: template.type,
      scale_type: scaleTypeToDbScaleType(template.scaleType || "likert5"),
      is_active: true,
      is_standard: isStandard,
      company_id: isStandard ? null : template.companyId
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

// Copy a template for a company
export async function copyTemplateForCompany(
  templateId: string, 
  companyId: string, 
  newTitle?: string
): Promise<string> {
  const { data, error } = await supabase
    .rpc('copy_template_for_company', {
      template_id: templateId,
      company_id: companyId,
      new_title: newTitle
    });

  if (error) {
    console.error("Error copying template:", error);
    throw error;
  }

  return data;
}

// Helper function to map database scale types to application scale types
function mapDbScaleToAppScale(dbScale: string): ScaleType {
  switch(dbScale) {
    case "likert5": return "likert5";
    case "binary": return "yesno";
    case "custom": 
      return "custom";
    default: return "likert5";
  }
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

// New method to update an existing checklist template
export async function updateChecklistTemplate(
  templateId: string, 
  template: Partial<ChecklistTemplate>
): Promise<string> {
  // Prepare the update object, converting scale type if needed
  const updateData = {
    ...template,
    scale_type: template.scaleType ? scaleTypeToDbScaleType(template.scaleType) : undefined,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('checklist_templates')
    .update(updateData)
    .eq('id', templateId)
    .select()
    .single();

  if (error) {
    console.error("Error updating checklist template:", error);
    throw error;
  }

  // If questions were updated, handle that separately
  if (template.questions) {
    await updateTemplateQuestions(templateId, template.questions);
  }

  return data.id;
}

// Helper function to update questions for a template
async function updateTemplateQuestions(templateId: string, questions: DiscQuestion[]) {
  // First, delete existing questions
  const { error: deleteError } = await supabase
    .from('questions')
    .delete()
    .eq('template_id', templateId);

  if (deleteError) {
    console.error("Error deleting existing questions:", deleteError);
    throw deleteError;
  }

  // Then insert new questions
  const questionsToInsert = questions.map((q, index) => ({
    template_id: templateId,
    question_text: q.text,
    order_number: index + 1,
    target_factor: q.targetFactor,
    weight: q.weight
  }));

  const { error: insertError } = await supabase
    .from('questions')
    .insert(questionsToInsert);

  if (insertError) {
    console.error("Error inserting new questions:", insertError);
    throw insertError;
  }
}

// Method to delete a checklist template
export async function deleteChecklistTemplate(templateId: string): Promise<void> {
  // First, delete associated questions
  const { error: questionsDeleteError } = await supabase
    .from('questions')
    .delete()
    .eq('template_id', templateId);

  if (questionsDeleteError) {
    console.error("Error deleting template questions:", questionsDeleteError);
    throw questionsDeleteError;
  }

  // Then delete the template itself
  const { error: templateDeleteError } = await supabase
    .from('checklist_templates')
    .delete()
    .eq('id', templateId);

  if (templateDeleteError) {
    console.error("Error deleting checklist template:", templateDeleteError);
    throw templateDeleteError;
  }
}
