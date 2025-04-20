import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function generateAssessmentLink(
  employeeId: string,
  templateId: string
): Promise<string | null> {
  try {
    // Check if there's already an active link for this employee and template
    const { data: existingLink } = await supabase
      .from('assessment_links')
      .select()
      .eq('employee_id', employeeId)
      .eq('template_id', templateId)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (existingLink?.token) {
      return `https://avaliacao.unomed.med.br/avaliacao/${existingLink.token}`;
    }

    // Generate a unique token
    const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Set expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Save link in assessment_links table
    const { data, error } = await supabase
      .from('assessment_links')
      .insert({
        token,
        template_id: templateId,
        employee_id: employeeId,
        expires_at: expiresAt.toISOString(),
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;

    // Return the complete URL
    return `https://avaliacao.unomed.med.br/avaliacao/${token}`;
  } catch (error) {
    console.error("Erro ao gerar link:", error);
    toast.error("Erro ao gerar link de avaliação");
    return null;
  }
}

export async function updateAssessmentStatus(
  assessmentId: string, 
  linkUrl: string
): Promise<void> {
  try {
    const currentDate = new Date().toISOString();
    
    const { error } = await supabase
      .from('scheduled_assessments')
      .update({ 
        link_url: linkUrl,
        status: 'sent',
        sent_at: currentDate
      })
      .eq('id', assessmentId);

    if (error) throw error;
    
    toast.success("Link gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    toast.error("Erro ao atualizar status da avaliação");
    throw error;
  }
}

export async function checkLinkValidity(token: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('assessment_links')
      .select()
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) throw error;

    return !!data;
  } catch (error) {
    console.error("Erro ao verificar validade do link:", error);
    return false;
  }
}

export async function markLinkAsUsed(token: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('assessment_links')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    if (error) throw error;
  } catch (error) {
    console.error("Erro ao marcar link como usado:", error);
    throw error;
  }
}
