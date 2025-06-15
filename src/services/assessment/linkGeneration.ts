
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function generateUniqueAssessmentLink(
  templateId: string,
  employeeId: string,
  expiresInDays: number = 7
): Promise<{ linkUrl: string; token: string } | null> {
  try {
    // Generate unique token
    const token = crypto.randomUUID().replace(/-/g, '');
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    // Save link to database
    const { data: linkData, error } = await supabase
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
      console.error("Error creating assessment link:", error);
      toast.error("Erro ao gerar link de avaliação");
      return null;
    }
    
    // Generate the public URL using the correct domain
    const linkUrl = `https://avaliacao.unomed.med.br/avaliacao/${token}`;
    
    return { linkUrl, token };
  } catch (error) {
    console.error("Error generating assessment link:", error);
    toast.error("Erro ao gerar link de avaliação");
    return null;
  }
}

export async function validateAssessmentLink(token: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('assessment_links')
      .select('expires_at, used_at')
      .eq('token', token)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    // Check if link has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return false;
    }
    
    // Check if link has already been used
    if (data.used_at) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error validating assessment link:", error);
    return false;
  }
}

export async function markLinkAsUsed(token: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('assessment_links')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);
    
    if (error) {
      console.error("Error marking link as used:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error marking link as used:", error);
    return false;
  }
}
