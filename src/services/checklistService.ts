import { supabase } from "@/integrations/supabase/client";
import { 
  ChecklistTemplate, 
  ChecklistResult, 
  DiscQuestion, 
  DiscFactorType,
  ScaleType,
  scaleTypeToDbScaleType,
  ScheduledAssessment,
  PsicossocialQuestion,
  ChecklistTemplateType
} from "@/types";
import { Database } from "@/integrations/supabase/types";

// Define types from Supabase that we need
type Json = Database["public"]["Tables"]["assessment_responses"]["Row"]["factors_scores"];

// Type to handle possible template types from the database
type DbTemplateType = "disc" | "custom" | "srq20" | "phq9" | "gad7" | "mbi" | "audit" | "pss" | "copsoq" | "jcq" | "eri";

// Map our app types to DB types
function mapAppTemplateTypeToDb(type: ChecklistTemplateType): DbTemplateType {
  if (type === "psicossocial") {
    return "custom"; // Map psicossocial to custom in the DB for now
  }
  return type as DbTemplateType;
}

// Map DB types to our app types
function mapDbTemplateTypeToApp(type: string): ChecklistTemplateType {
  // If it's one of our special DB types that we want to map to psicossocial
  if (["copsoq", "jcq", "eri"].includes(type)) {
    return "psicossocial";
  }
  return type as ChecklistTemplateType;
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

  return (data || []).map(template => {
    const templateType = mapDbTemplateTypeToApp(template.type);
    
    let questions: (DiscQuestion | PsicossocialQuestion)[] = [];
    
    if (templateType === "disc") {
      // Process DISC questions
      questions = (template.questions || []).map(q => ({
        id: q.id,
        text: q.question_text,
        targetFactor: q.target_factor as DiscFactorType,
        weight: q.weight || 1
      }));
    } else if (templateType === "psicossocial") {
      // Process psicossocial questions with categories
      questions = (template.questions || []).map(q => ({
        id: q.id,
        text: q.question_text,
        category: q.target_factor || "Geral" // Use target_factor as category
      }));
    } else {
      // Process custom questions (might not have targetFactor)
      questions = (template.questions || []).map(q => ({
        id: q.id,
        text: q.question_text,
        targetFactor: q.target_factor as DiscFactorType,
        weight: q.weight || 1
      })) as DiscQuestion[];
    }

    return {
      id: template.id,
      title: template.title,
      description: template.description || "",
      type: templateType,
      scaleType: mapDbScaleToAppScale(template.scale_type),
      isStandard: template.is_standard || false,
      companyId: template.company_id,
      derivedFromId: template.derived_from_id,
      questions,
      createdAt: new Date(template.created_at)
    };
  });
}

// Helper function to map database scale types to application scale types
function mapDbScaleToAppScale(dbScale: string): ScaleType {
  switch(dbScale) {
    case "likert5": 
      return ScaleType.Likert;
    case "binary": 
      return ScaleType.YesNo;
    case "custom": 
      return ScaleType.Custom;
    default: 
      return ScaleType.Likert;
  }
}

// Helper function to convert string to DiscFactorType enum
function stringToDiscFactorType(factor: string): DiscFactorType {
  switch (factor) {
    case "D": return DiscFactorType.D;
    case "I": return DiscFactorType.I;
    case "S": return DiscFactorType.S;
    case "C": return DiscFactorType.C;
    default: return DiscFactorType.D; // Default to D if unknown
  }
}

// Save a new checklist template to Supabase
export async function saveChecklistTemplate(
  template: Omit<ChecklistTemplate, "id" | "createdAt">, 
  isStandard: boolean = false
): Promise<string> {
  const dbScaleType = scaleTypeToDbScaleType(template.scaleType || ScaleType.Likert);
  const dbTemplateType = mapAppTemplateTypeToDb(template.type);
  
  const { data: templateData, error: templateError } = await supabase
    .from('checklist_templates')
    .insert({
      title: template.title,
      description: template.description,
      type: dbTemplateType,
      scale_type: dbScaleType,
      is_active: true,
      is_standard: isStandard,
      company_id: template.companyId
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

  const questionsToInsert = template.questions.map((q, index) => {
    if (template.type === "disc") {
      const discQuestion = q as DiscQuestion;
      return {
        template_id: templateId,
        question_text: discQuestion.text,
        order_number: index + 1,
        target_factor: discQuestion.targetFactor,
        weight: discQuestion.weight
      };
    } else if (template.type === "psicossocial") {
      const psiQuestion = q as PsicossocialQuestion;
      return {
        template_id: templateId,
        question_text: psiQuestion.text,
        order_number: index + 1,
        target_factor: psiQuestion.category, // Store category in target_factor
        weight: 1
      };
    } else {
      // Generic handling for custom templates
      return {
        template_id: templateId,
        question_text: q.text,
        order_number: index + 1,
        // Default values if properties don't exist
        target_factor: (q as any).targetFactor || null,
        weight: (q as any).weight || 1
      };
    }
  });

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

// Save an assessment result to Supabase
export async function saveAssessmentResult(result: Omit<ChecklistResult, "id" | "completedAt">): Promise<string> {
  // Convert enum value to string for database storage
  const dominantFactorString = result.dominantFactor.toString();
  
  const { data, error } = await supabase
    .from('assessment_responses')
    .insert({
      template_id: result.templateId,
      employee_name: result.employeeName,
      dominant_factor: dominantFactorString,
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

    // Convert the dominant_factor string from database to DiscFactorType enum
    const dominantFactor = stringToDiscFactorType(result.dominant_factor || "D");

    return {
      id: result.id,
      templateId: result.template_id,
      employeeName: result.employee_name || "Anônimo",
      results: factorScores,
      dominantFactor: dominantFactor,
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
  // Remove properties that don't exist in the database schema
  const { companyId, createdAt, isStandard, questions, scaleType, type, ...otherProps } = template;
  
  // Prepare valid update data
  const updateData: any = {
    ...otherProps,
    updated_at: new Date().toISOString()
  };
  
  if (scaleType) {
    updateData.scale_type = scaleTypeToDbScaleType(scaleType);
  }
  
  if (isStandard !== undefined) {
    updateData.is_standard = isStandard;
  }
  
  if (companyId) {
    updateData.company_id = companyId;
  }
  
  if (type) {
    updateData.type = mapAppTemplateTypeToDb(type);
  }

  // Log para debug
  console.log("Template update data:", updateData);

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
  if (questions) {
    await updateTemplateQuestions(templateId, questions, type || "disc");
  }

  return data.id;
}

// Helper function to update questions for a template
async function updateTemplateQuestions(
  templateId: string, 
  questions: (DiscQuestion | PsicossocialQuestion)[], 
  templateType: ChecklistTemplateType
) {
  // First, delete existing questions
  const { error: deleteError } = await supabase
    .from('questions')
    .delete()
    .eq('template_id', templateId);

  if (deleteError) {
    console.error("Error deleting existing questions:", deleteError);
    throw deleteError;
  }

  // Then insert new questions based on template type
  const questionsToInsert = questions.map((q, index) => {
    if (templateType === "disc") {
      const discQuestion = q as DiscQuestion;
      return {
        template_id: templateId,
        question_text: discQuestion.text,
        order_number: index + 1,
        target_factor: discQuestion.targetFactor,
        weight: discQuestion.weight
      };
    } else if (templateType === "psicossocial") {
      const psiQuestion = q as PsicossocialQuestion;
      return {
        template_id: templateId,
        question_text: psiQuestion.text,
        order_number: index + 1,
        target_factor: psiQuestion.category, // Store category in target_factor
        weight: 1
      };
    } else {
      // Generic handling for custom templates
      return {
        template_id: templateId,
        question_text: q.text,
        order_number: index + 1,
        // Default values if properties don't exist
        target_factor: (q as any).targetFactor || null,
        weight: (q as any).weight || 1
      };
    }
  });

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

// Fetch scheduled assessments from Supabase
export async function fetchScheduledAssessments(): Promise<ScheduledAssessment[]> {
  const { data, error } = await supabase
    .from('scheduled_assessments')
    .select('*')
    .order('scheduled_date', { ascending: true });

  if (error) {
    console.error("Error fetching scheduled assessments:", error);
    throw error;
  }

  return data.map(assessment => ({
    id: assessment.id,
    employeeId: assessment.employee_id,
    templateId: assessment.template_id,
    scheduledDate: new Date(assessment.scheduled_date),
    sentAt: assessment.sent_at ? new Date(assessment.sent_at) : null,
    completedAt: assessment.completed_at ? new Date(assessment.completed_at) : null,
    nextScheduledDate: assessment.next_scheduled_date ? new Date(assessment.next_scheduled_date) : null,
    linkUrl: assessment.link_url || "",
    status: assessment.status as "scheduled" | "sent" | "completed",
    recurrenceType: assessment.recurrence_type as "none" | "monthly" | "semiannual" | "annual" | undefined,
    phoneNumber: assessment.phone_number
  }));
}

// Save a scheduled assessment to Supabase
export async function saveScheduledAssessment(
  assessment: Omit<ScheduledAssessment, "id">
): Promise<string> {
  const { data, error } = await supabase
    .from('scheduled_assessments')
    .insert({
      employee_id: assessment.employeeId,
      template_id: assessment.templateId,
      scheduled_date: assessment.scheduledDate.toISOString(),
      status: assessment.status,
      recurrence_type: assessment.recurrenceType,
      next_scheduled_date: assessment.nextScheduledDate?.toISOString(),
      phone_number: assessment.phoneNumber,
      link_url: assessment.linkUrl,
      sent_at: assessment.sentAt?.toISOString(),
      completed_at: assessment.completedAt?.toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving scheduled assessment:", error);
    throw error;
  }

  return data.id;
}

// Send assessment email
export async function sendAssessmentEmail(assessmentId: string): Promise<void> {
  // This would integrate with your email service
  // For now, we'll just update the status
  const { error } = await supabase
    .from('scheduled_assessments')
    .update({ 
      status: 'sent',
      sent_at: new Date().toISOString()
    })
    .eq('id', assessmentId);

  if (error) {
    console.error("Error sending assessment email:", error);
    throw error;
  }
}
