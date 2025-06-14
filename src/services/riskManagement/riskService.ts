
import { supabase } from "@/integrations/supabase/client";

export interface RiskAssessment {
  id: string;
  company_id: string;
  employee_id: string;
  assessment_date: Date;
  risk_level: 'low' | 'medium' | 'high';
  risk_factors: string[];
  mitigation_actions: string[];
  status: 'pending' | 'in_progress' | 'completed';
  next_assessment_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface RiskFactor {
  id: string;
  name: string;
  category: string;
  weight: number;
  description: string;
}

export async function createRiskAssessment(data: Omit<RiskAssessment, 'id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('risk_assessments')
    .insert({
      company_id: data.company_id,
      employee_id: data.employee_id,
      assessment_date: data.assessment_date.toISOString(),
      risk_level: data.risk_level,
      risk_factors: data.risk_factors,
      mitigation_actions: data.mitigation_actions,
      status: data.status,
      next_assessment_date: data.next_assessment_date?.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getRiskAssessments(companyId?: string) {
  let query = supabase
    .from('risk_assessments')
    .select(`
      *,
      employees(name, sector_id, role_id),
      sectors(name),
      roles(name)
    `)
    .order('assessment_date', { ascending: false });

  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateRiskAssessment(id: string, updates: Partial<RiskAssessment>) {
  const { data, error } = await supabase
    .from('risk_assessments')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRiskAssessment(id: string) {
  const { error } = await supabase
    .from('risk_assessments')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getRiskFactors() {
  const { data, error } = await supabase
    .from('risk_factors')
    .select('*')
    .order('category', { ascending: true });

  if (error) throw error;
  return data;
}
