import { supabase } from "@/integrations/supabase/client";
import { ChecklistResult } from "@/types/checklist";
import { DiscFactorType } from "@/types/disc";
import { stringToDiscFactorType } from "./utils";

export async function saveAssessmentResult(result: Omit<ChecklistResult, "id" | "completedAt">): Promise<string> {
  const dominantFactorString = result.dominantFactor.toString();
  
  // Get a default employee to satisfy the required constraint
  const { data: employees, error: empError } = await supabase
    .from('employees')
    .select('id')
    .limit(1);
  
  if (empError || !employees || employees.length === 0) {
    throw new Error('No employees found to create assessment');
  }
  
  const { data, error } = await supabase
    .from('assessment_responses')
    .insert({
      template_id: result.templateId,
      employee_id: employees[0].id, // Use first available employee
      employee_name: result.employeeName,
      dominant_factor: dominantFactorString,
      factors_scores: result.results,
      response_data: {}
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving assessment result:", error);
    throw error;
  }

  return data?.id || "";
}

export async function fetchAssessmentResults(): Promise<ChecklistResult[]> {
  const { data, error } = await supabase
    .from('assessment_responses')
    .select('*');
  
  if (error) {
    console.error("Error fetching assessment results:", error);
    throw error;
  }

  return (data || []).map(result => {
    const factorScoresRaw = result.factors_scores as any;
    let factorScores = { D: 0, I: 0, S: 0, C: 0 };
    
    if (factorScoresRaw && typeof factorScoresRaw === 'object' && factorScoresRaw !== null) {
      const rawScores = factorScoresRaw as Record<string, unknown>;
      
      if ('D' in rawScores && rawScores.D !== null) factorScores.D = Number(rawScores.D) || 0;
      if ('I' in rawScores && rawScores.I !== null) factorScores.I = Number(rawScores.I) || 0;
      if ('S' in rawScores && rawScores.S !== null) factorScores.S = Number(rawScores.S) || 0;
      if ('C' in rawScores && rawScores.C !== null) factorScores.C = Number(rawScores.C) || 0;
    }

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
