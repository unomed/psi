
import { supabase } from "@/integrations/supabase/client";
import { MTE_PSICOSSOCIAL_TEMPLATE } from "@/data/psicossocialTemplates";

export async function createDefaultPsicossocialTemplate(): Promise<string | null> {
  try {
    // Verificar se já existe um template psicossocial padrão
    const { data: existingTemplates } = await supabase
      .from('checklist_templates')
      .select('id')
      .eq('type', 'custom')
      .eq('is_standard', true)
      .limit(1);

    if (existingTemplates && existingTemplates.length > 0) {
      console.log('Template psicossocial padrão já existe');
      return existingTemplates[0].id;
    }

    // Criar o template base
    const templateData = {
      title: 'Avaliação de Riscos Psicossociais - MTE',
      description: 'Template baseado no Guia de Fatores de Riscos Psicossociais do Ministério do Trabalho e Emprego',
      type: 'custom' as const,
      scale_type: 'custom' as const,
      is_active: true,
      is_standard: true,
      company_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: template, error: templateError } = await supabase
      .from('checklist_templates')
      .insert(templateData)
      .select()
      .single();

    if (templateError) {
      console.error('Erro ao criar template:', templateError);
      throw templateError;
    }

    // Criar as questões
    const questionsData = MTE_PSICOSSOCIAL_TEMPLATE.map((question, index) => ({
      template_id: template.id,
      question_text: question.text,
      order_number: index + 1,
      target_factor: question.category,
      weight: 1.0,
      reverse_scored: false
    }));

    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questionsData);

    if (questionsError) {
      console.error('Erro ao criar questões:', questionsError);
      throw questionsError;
    }

    console.log('Template psicossocial padrão criado com sucesso:', template.id);
    return template.id;

  } catch (error) {
    console.error('Erro ao criar template padrão:', error);
    return null;
  }
}

export async function initializeDefaultTemplates() {
  try {
    const psicossocialTemplateId = await createDefaultPsicossocialTemplate();
    
    if (psicossocialTemplateId) {
      console.log('Templates padrão inicializados com sucesso');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao inicializar templates padrão:', error);
    return false;
  }
}
