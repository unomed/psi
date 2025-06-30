
import { supabase } from "@/integrations/supabase/client";
import { ChecklistResult } from "@/types/checklist";
import { DiscFactorType } from "@/types/disc";
import { stringToDiscFactorType } from "./utils";

export async function saveAssessmentResult(result: Omit<ChecklistResult, "id" | "completedAt">): Promise<string> {
  const dominantFactorString = result.dominant_factor?.toString() || '';
  
  // Verificar se o employee_name é válido
  if (!result.employee_name) {
    throw new Error('Employee name is required to save assessment');
  }
  
  const employeeName = result.employee_name || '';
  
  // Buscar funcionário por nome para obter o ID correto
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .select('id')
    .eq('name', employeeName)
    .eq('status', 'active')
    .single();
  
  if (empError || !employee) {
    throw new Error(`Employee "${employeeName}" not found or is inactive`);
  }
  
  const { data, error } = await supabase
    .from('assessment_responses')
    .insert({
      template_id: result.template_id,
      employee_id: employee.id, // Usar o ID correto do funcionário
      employee_name: employeeName,
      dominant_factor: dominantFactorString,
      factors_scores: result.results,
      response_data: result.responses,
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

export async function fetchAssessmentResults(): Promise<ChecklistResult[]> {
  const { data, error } = await supabase
    .from('assessment_responses')
    .select(`
      *,
      employee:employees!inner(id, name)
    `);
  
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
      template_id: result.template_id,
      employee_id: result.employee_id,
      templateId: result.template_id,
      employeeId: result.employee_id,
      employeeName: result.employee?.name || result.employee_name || "Anônimo",
      employee_name: result.employee?.name || result.employee_name || "Anônimo",
      responses: result.response_data || {},
      results: factorScores,
      dominantFactor: dominantFactor,
      dominant_factor: result.dominant_factor,
      score: result.raw_score || 0,
      completedAt: new Date(result.completed_at),
      completed_at: result.completed_at,
      createdBy: result.created_by || ''
    };
  });
}
