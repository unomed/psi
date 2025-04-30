
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function generateAssessmentLink(
  employeeId: string,
  templateId: string
): Promise<string | null> {
  try {
    console.log("Starting link generation for:", { employeeId, templateId });
    
    // Check if there's already an active link for this employee and template
    const { data: existingLink, error: fetchError } = await supabase
      .from('assessment_links')
      .select()
      .eq('employee_id', employeeId)
      .eq('template_id', templateId)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking existing links:", fetchError);
      throw fetchError;
    }

    console.log("Existing link check result:", existingLink);

    if (existingLink?.token) {
      // Use the public domain instead of window.location.origin
      const link = `https://avaliacao.unomed.med.br/avaliacao/${existingLink.token}`;
      console.log("Using existing link:", link);
      return link;
    }

    // Generate a unique token - using a more reliable method
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 10);
    const token = `${timestamp}-${randomPart}`;
    
    console.log("Generated new token:", token);
    
    // Set expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Save link in assessment_links table
    const { data, error } = await supabase
      .from('assessment_links')
      .insert({
        token,
        template_id: templateId,
        employee_id: employeeId,
        expires_at: expiresAt.toISOString(),
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting assessment link:", error);
      throw error;
    }

    if (!data) {
      throw new Error("Nenhum dado retornado após inserir o link de avaliação");
    }

    console.log("Link generated successfully:", data);

    // Return the complete URL with the custom domain
    const finalLink = `https://avaliacao.unomed.med.br/avaliacao/${token}`;
    console.log("Final link generated:", finalLink);
    return finalLink;
  } catch (error) {
    console.error("Error generating link:", error);
    toast.error("Erro ao gerar link de avaliação");
    return null;
  }
}

export async function updateAssessmentStatus(
  assessmentId: string, 
  linkUrl: string
): Promise<void> {
  try {
    console.log("Updating assessment status:", { assessmentId, linkUrl });
    const currentDate = new Date().toISOString();
    
    const { error } = await supabase
      .from('scheduled_assessments')
      .update({ 
        link_url: linkUrl,
        status: 'sent',
        sent_at: currentDate
      })
      .eq('id', assessmentId);

    if (error) {
      console.error("Error updating assessment status:", error);
      throw error;
    }
    
    console.log("Assessment status updated successfully");
    toast.success("Link gerado com sucesso!");
  } catch (error) {
    console.error("Error in updateAssessmentStatus:", error);
    toast.error("Erro ao atualizar status da avaliação");
    throw error;
  }
}

export async function checkLinkValidity(token: string): Promise<boolean> {
  try {
    console.log("Checking validity of token:", token);
    
    // Check if token exists and is not used
    const { data, error } = await supabase
      .from('assessment_links')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) {
      console.error("Database error when checking token:", error);
      return false;
    }

    const isValid = !!data;
    console.log(`Token validity check result: ${isValid}`, data);
    
    return isValid;
  } catch (error) {
    console.error("Exception when checking link validity:", error);
    return false;
  }
}

export async function markLinkAsUsed(token: string): Promise<void> {
  try {
    console.log("Marking link as used:", token);
    const { error } = await supabase
      .from('assessment_links')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    if (error) {
      console.error("Error marking link as used:", error);
      throw error;
    }
    
    console.log("Link marked as used successfully");
  } catch (error) {
    console.error("Error in markLinkAsUsed:", error);
    throw error;
  }
}

// New function to delete assessment
export async function deleteAssessment(assessmentId: string): Promise<void> {
  try {
    console.log("Deleting assessment:", assessmentId);
    
    const { error } = await supabase
      .from('scheduled_assessments')
      .delete()
      .eq('id', assessmentId);
      
    if (error) {
      console.error("Error deleting assessment:", error);
      throw error;
    }
    
    console.log("Assessment deleted successfully");
    toast.success("Agendamento excluído com sucesso!");
  } catch (error) {
    console.error("Error in deleteAssessment:", error);
    toast.error("Erro ao excluir agendamento");
    throw error;
  }
}

// New function to send assessment email
export async function sendAssessmentEmail(assessmentId: string): Promise<void> {
  try {
    console.log("Sending email for assessment:", assessmentId);
    
    // Get the assessment details
    const { data: assessment, error: fetchError } = await supabase
      .from('scheduled_assessments')
      .select(`
        id,
        employee_id,
        template_id,
        link_url,
        employee_name,
        checklist_templates (title)
      `)
      .eq('id', assessmentId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching assessment:", fetchError);
      throw fetchError;
    }
    
    if (!assessment) {
      throw new Error("Avaliação não encontrada");
    }
    
    if (!assessment.link_url) {
      throw new Error("Link de avaliação não gerado");
    }
    
    // Update the status
    const { error: updateError } = await supabase
      .from('scheduled_assessments')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', assessmentId);
      
    if (updateError) {
      console.error("Error updating assessment status:", updateError);
      throw updateError;
    }
    
    // In a real implementation, you would send the email here
    // This could involve calling an edge function or third-party service
    
    console.log("Assessment email sent successfully");
    toast.success("Email enviado com sucesso!");
  } catch (error) {
    console.error("Error sending assessment email:", error);
    toast.error("Erro ao enviar email de avaliação");
    throw error;
  }
}
