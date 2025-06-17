
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Função para converter nome do checklist em slug amigável
function slugifyChecklistName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}

// Função para capturar dados completos do funcionário
async function getEmployeeData(employeeId: string) {
  try {
    const { data: employee, error } = await supabase
      .from('employees')
      .select(`
        id,
        name,
        email,
        phone,
        cpf,
        company_id,
        sector_id,
        role_id,
        companies!inner(id, name),
        sectors(id, name),
        roles(id, name)
      `)
      .eq('id', employeeId)
      .single();

    if (error) {
      console.error('Erro ao buscar dados do funcionário:', error);
      throw error;
    }

    return employee;
  } catch (error) {
    console.error('Erro ao capturar dados do funcionário:', error);
    throw error;
  }
}

// Função para capturar dados do template/checklist
async function getChecklistData(templateId: string) {
  try {
    const { data: template, error } = await supabase
      .from('checklist_templates')
      .select('id, title, description, type')
      .eq('id', templateId)
      .single();

    if (error) {
      console.error('Erro ao buscar dados do template:', error);
      throw error;
    }

    return template;
  } catch (error) {
    console.error('Erro ao capturar dados do template:', error);
    throw error;
  }
}

export async function generateEmployeePortalLink(
  employeeId: string,
  assessmentId: string,
  templateId?: string,
  checklistTitle?: string
): Promise<{ linkUrl: string; portalToken: string } | null> {
  try {
    // Gerar token único
    const portalToken = crypto.randomUUID().replace(/-/g, '');
    
    // Capturar dados do funcionário
    const employeeData = await getEmployeeData(employeeId);
    
    // Capturar dados do checklist se templateId fornecido
    let checklistData = null;
    let checklistSlug = 'avaliacao'; // slug padrão
    
    if (templateId) {
      checklistData = await getChecklistData(templateId);
      checklistSlug = slugifyChecklistName(checklistData.title);
    } else if (checklistTitle) {
      checklistSlug = slugifyChecklistName(checklistTitle);
    }

    // Atualizar o agendamento com dados completos do funcionário
    const { error: updateError } = await supabase
      .from('scheduled_assessments')
      .update({
        employee_name: employeeData.name,
        company_id: employeeData.company_id,
        portal_token: portalToken,
        employee_data: {
          name: employeeData.name,
          email: employeeData.email,
          phone: employeeData.phone,
          company_name: employeeData.companies?.name,
          sector_name: employeeData.sectors?.name,
          role_name: employeeData.roles?.name
        }
      })
      .eq('id', assessmentId);

    if (updateError) {
      console.error('Erro ao atualizar dados do funcionário no agendamento:', updateError);
      // Não falhar se não conseguir atualizar, apenas log
    }

    // Gerar a URL do portal com o domínio correto e slug do checklist
    const linkUrl = `https://avaliacao.unomed.med.br/checklist/${checklistSlug}?employee=${employeeId}&assessment=${assessmentId}&token=${portalToken}`;
    
    console.log("Portal link gerado:", {
      linkUrl,
      employeeName: employeeData.name,
      checklistTitle: checklistData?.title || checklistTitle,
      checklistSlug
    });
    
    return { linkUrl, portalToken };
  } catch (error) {
    console.error("Erro ao gerar link do portal:", error);
    toast.error("Erro ao gerar link do portal");
    return null;
  }
}

export async function validatePortalAccess(
  employeeId: string, 
  assessmentId: string, 
  token: string
): Promise<boolean> {
  try {
    // Verificar se o agendamento existe e pertence ao funcionário
    const { data: assessment, error } = await supabase
      .from('scheduled_assessments')
      .select('employee_id, status, portal_token, employee_name')
      .eq('id', assessmentId)
      .eq('employee_id', employeeId)
      .single();
    
    if (error || !assessment) {
      console.error("Agendamento não encontrado ou não pertence ao funcionário:", error);
      return false;
    }

    // Verificar se o token é válido
    if (assessment.portal_token && assessment.portal_token !== token) {
      console.log("Token inválido para acesso ao portal");
      return false;
    }
    
    // Verificar se o agendamento ainda é válido (não foi concluído)
    if (assessment.status === 'completed') {
      console.log("Agendamento já foi concluído");
      return false;
    }
    
    console.log("Acesso ao portal validado com sucesso:", {
      employeeName: assessment.employee_name,
      assessmentId,
      status: assessment.status
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao validar acesso ao portal:", error);
    return false;
  }
}
