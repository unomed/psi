
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
      // Use the public domain instead of window.location.origin
      return `https://avaliacao.unomed.med.br/avaliacao/${existingLink.token}`;
    }

    // Generate a unique token
    const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Set expiration date (30 days from now instead of 7)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    // Save link in assessment_links table with better error handling
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

    if (error) {
      console.error("Erro detalhado ao gerar link:", error);
      throw error;
    }

    if (!data) {
      throw new Error("Nenhum dado retornado após inserir o link de avaliação");
    }

    console.log("Link gerado com sucesso:", data);

    // Return the complete URL with the custom domain
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
    // Melhorar a verificação incluindo logs detalhados
    console.log("Verificando validade do token:", token);
    
    const { data, error } = await supabase
      .from('assessment_links')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) {
      console.error("Erro ao verificar token:", error);
      return false;
    }

    console.log("Resultado da verificação do token:", data);
    
    return !!data;
  } catch (error) {
    console.error("Exceção ao verificar validade do link:", error);
    return false;
  }
}

export async function markLinkAsUsed(token: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('assessment_links')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    if (error) {
      console.error("Erro ao marcar link como usado:", error);
      throw error;
    }
    
    console.log("Link marcado como usado com sucesso:", token);
  } catch (error) {
    console.error("Erro ao marcar link como usado:", error);
    throw error;
  }
}
