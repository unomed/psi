import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createDefaultEmailTemplates } from "@/services/emailTemplates/createDefaultTemplates";
import { verifyEmailConfiguration } from "./emailVerification";

export async function generateAssessmentLink(
  employeeId: string,
  templateId: string
): Promise<string | null> {
  try {
    console.log("Starting link generation for:", { employeeId, templateId });
    
    // Primeiro, limpar links duplicados mantendo apenas o mais recente não usado
    const { data: allLinks, error: getAllError } = await supabase
      .from('assessment_links')
      .select('id, created_at, used_at, expires_at')
      .eq('employee_id', employeeId)
      .eq('template_id', templateId)
      .order('created_at', { ascending: false });

    if (getAllError) {
      console.error("Error getting all links:", getAllError);
    } else if (allLinks && allLinks.length > 1) {
      console.log(`Found ${allLinks.length} links, cleaning duplicates`);
      
      // Manter apenas o primeiro (mais recente) link válido
      const validLinks = allLinks.filter(link => 
        !link.used_at && 
        link.expires_at && 
        new Date(link.expires_at) > new Date()
      );
      
      let linksToKeep: string[] = [];
      if (validLinks.length > 0) {
        linksToKeep = [validLinks[0].id];
      }
      
      // Deletar todos os outros
      const linksToDelete = allLinks
        .filter(link => !linksToKeep.includes(link.id))
        .map(link => link.id);
      
      if (linksToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('assessment_links')
          .delete()
          .in('id', linksToDelete);
        
        if (deleteError) {
          console.error("Error deleting duplicate links:", deleteError);
        } else {
          console.log(`Deleted ${linksToDelete.length} duplicate/expired links`);
        }
      }
    }

    // Agora verificar se existe um link válido (usando maybeSingle para evitar erro)
    const { data: existingLink, error: fetchError } = await supabase
      .from('assessment_links')
      .select()
      .eq('employee_id', employeeId)
      .eq('template_id', templateId)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking existing links:", fetchError);
      throw fetchError;
    }

    console.log("Existing link check result:", existingLink);

    if (existingLink?.token) {
      // SEMPRE direcionar para o portal - redirecionamento automático
      const link = `https://avaliacao.unomed.med.br/portal`;
      console.log("Using existing link (redirected to portal):", link);
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

    // SEMPRE direcionar para o portal - redirecionamento automático
    const finalLink = `https://avaliacao.unomed.med.br/portal`;
    console.log("Final link generated (redirected to portal):", finalLink);
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

// Updated sendAssessmentEmail function using Resend
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
    
    // Get employee email
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('email, name')
      .eq('id', assessment.employee_id)
      .single();
      
    if (employeeError || !employee?.email) {
      console.error("Employee error:", employeeError);
      toast.error("Email do funcionário não encontrado");
      throw new Error("Email do funcionário não encontrado");
    }
    
    console.log("Employee data retrieved:", { name: employee.name, hasEmail: !!employee.email });
    
    // Generate link if not exists - sem criar novos agendamentos
    let linkUrl = assessment.link_url;
    if (!linkUrl) {
      console.log("Reutilizando link existente ou direcionando para portal...");
      // Sempre direcionar para o portal - evita criação de novos registros
      linkUrl = `https://avaliacao.unomed.med.br/portal`;
      
      // Atualizar o agendamento atual com o link do portal
      const { error: updateError } = await supabase
        .from('scheduled_assessments')
        .update({ link_url: linkUrl })
        .eq('id', assessmentId);
        
      if (updateError) {
        console.warn("Erro ao atualizar link do agendamento:", updateError);
      }
      console.log("Link do portal definido para agendamento existente");
    }
    
    console.log("Calling send-email-resend edge function...");
    // Call the new Resend email function
    const { data, error } = await supabase.functions.invoke('send-email-resend', {
      body: {
        employeeId: assessment.employee_id,
        employeeName: assessment.employee_name || employee.name,
        employeeEmail: employee.email,
        assessmentId: assessmentId,
        templateId: assessment.template_id,
        templateName: "Convite",
        linkUrl: linkUrl
      }
    });

    if (error) {
      console.error("Error calling send-email-resend function:", error);
      toast.error(`Erro ao enviar email: ${error.message}`);
      throw new Error(`Erro ao enviar email: ${error.message}`);
    }

    if (!data?.success) {
      console.error("Edge function returned unsuccessful result:", data);
      toast.error(data?.error || "Falha ao enviar email");
      throw new Error(data?.error || "Falha ao enviar email");
    }
    
    console.log("Assessment email sent successfully via Resend");
    toast.success("Email enviado com sucesso!");
    
  } catch (error) {
    console.error("Error in sendAssessmentEmail:", error);
    if (!error.message.includes("Email do funcionário")) {
      toast.error("Erro ao enviar email de avaliação");
    }
    throw error;
  }
}
