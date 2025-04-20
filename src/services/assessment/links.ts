import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function generateAssessmentLink(
  employeeId: string,
  templateId: string
): Promise<string | null> {
  try {
    // Gerar token único
    const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Definir data de expiração (7 dias a partir de agora)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Salvar link na tabela assessment_links
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

    // Retornar URL completa do link usando o domínio personalizado
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
    const { error } = await supabase
      .from('scheduled_assessments')
      .update({ 
        link_url: linkUrl,
        status: 'sent'
      })
      .eq('id', assessmentId);

    if (error) throw error;
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    throw error;
  }
}
