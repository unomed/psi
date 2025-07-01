
import { supabase } from "@/integrations/supabase/client";

export async function createDefaultPsicossocialTemplate(): Promise<string | null> {
  try {
    console.log("Verificando se já existe um template psicossocial padrão...");
    
    // Verificar se já existe um template psicossocial padrão
    const { data: existingTemplates } = await supabase
      .from('checklist_templates')
      .select('id')
      .eq('type', 'psicossocial')
      .eq('is_standard', true)
      .eq('title', 'Avaliação Psicossocial - MTE Completa')
      .limit(1);

    if (existingTemplates && existingTemplates.length > 0) {
      console.log('Template psicossocial MTE já existe:', existingTemplates[0].id);
      return existingTemplates[0].id;
    }

    console.log('Template psicossocial MTE não encontrado. Ele deve ser criado via migração SQL.');
    
    // O template agora é criado via migração SQL, não programaticamente
    // Verificar se existe qualquer template psicossocial
    const { data: anyPsicossocialTemplate } = await supabase
      .from('checklist_templates')
      .select('id')
      .eq('type', 'psicossocial')
      .limit(1);

    if (anyPsicossocialTemplate && anyPsicossocialTemplate.length > 0) {
      console.log('Encontrado template psicossocial existente:', anyPsicossocialTemplate[0].id);
      return anyPsicossocialTemplate[0].id;
    }

    console.log('Nenhum template psicossocial encontrado.');
    return null;

  } catch (error) {
    console.error('Erro ao verificar template padrão:', error);
    return null;
  }
}

export async function initializeDefaultTemplates() {
  try {
    console.log("Inicializando templates padrão...");
    
    const psicossocialTemplateId = await createDefaultPsicossocialTemplate();
    
    if (psicossocialTemplateId) {
      console.log('Templates padrão verificados com sucesso');
      return true;
    }
    
    console.log('Nenhum template psicossocial encontrado - deve ser criado via migração');
    return false;
  } catch (error) {
    console.error('Erro ao inicializar templates padrão:', error);
    return false;
  }
}
