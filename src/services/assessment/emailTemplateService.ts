import { supabase } from "@/integrations/supabase/client";
import { EmailTemplate } from "@/types";

// Default email templates
export const DEFAULT_EMAIL_TEMPLATES = [
  {
    name: "Convite Inicial para Avaliação",
    type: "initial_invite",
    subject: "Convite para Avaliação Psicossocial - {{assessment_title}}",
    body: `Olá {{employee_name}},

Você foi convidado(a) para participar da {{assessment_title}} da {{company_name}}.

Esta avaliação é importante para identificarmos oportunidades de melhoria no ambiente de trabalho e promover o bem-estar de todos os colaboradores.

**Detalhes da Avaliação:**
- Data limite para conclusão: {{due_date}}
- Tempo estimado: 15-20 minutos
- Confidencialidade garantida

**Para acessar a avaliação, clique no link abaixo:**
{{assessment_link}}

Caso tenha dúvidas, entre em contato com o RH ou seu gestor direto.

Atenciosamente,
Equipe {{company_name}}`,
    description: "Template padrão para convite inicial de avaliação"
  },
  {
    name: "Lembrete 3 Dias",
    type: "reminder_3_days",
    subject: "Lembrete: Avaliação Psicossocial - {{assessment_title}}",
    body: `Olá {{employee_name}},

Este é um lembrete amigável sobre a {{assessment_title}} que ainda está pendente.

**Data limite:** {{due_date}} (restam 3 dias)

A sua participação é muito importante para melhorarmos nosso ambiente de trabalho.

**Acesse a avaliação aqui:**
{{assessment_link}}

Em caso de dúvidas, estamos à disposição.

Atenciosamente,
Equipe {{company_name}}`,
    description: "Lembrete enviado 3 dias antes do prazo"
  },
  {
    name: "Lembrete Final - 1 Dia",
    type: "reminder_1_day",
    subject: "⚠️ URGENTE: Avaliação Psicossocial vence amanhã",
    body: `Olá {{employee_name}},

Este é o último lembrete sobre a {{assessment_title}}.

⚠️ **IMPORTANTE:** A avaliação vence amanhã ({{due_date}})

Sua participação é fundamental para o sucesso do programa de bem-estar da {{company_name}}.

**Acesse agora:**
{{assessment_link}}

Se precisar de ajuda, entre em contato com o RH imediatamente.

Atenciosamente,
Equipe {{company_name}}`,
    description: "Lembrete urgente enviado 1 dia antes do prazo"
  },
  {
    name: "Confirmação de Conclusão",
    type: "completion_confirmation",
    subject: "✅ Avaliação Concluída - Obrigado pela participação",
    body: `Olá {{employee_name}},

Obrigado por completar a {{assessment_title}} em {{completion_date}}.

Sua participação é fundamental para melhorarmos continuamente nosso ambiente de trabalho.

**Próximos passos:**
- Os resultados serão analisados pela equipe técnica
- Ações de melhoria serão implementadas conforme necessário
- Você receberá feedback sobre as iniciativas tomadas

Agradecemos sua colaboração!

Atenciosamente,
Equipe {{company_name}}`,
    description: "Confirmação enviada após conclusão da avaliação"
  },
  {
    name: "Alerta de Alto Risco - Gestor",
    type: "high_risk_alert",
    subject: "🚨 Alerta: Resultado de Alto Risco Identificado",
    body: `Olá {{manager_name}},

Foi identificado um resultado de **{{risk_level}}** risco na avaliação psicossocial de um colaborador do setor {{sector_name}}.

**Ação Requerida:**
- Revisar os resultados no sistema
- Implementar ações imediatas conforme plano de ação gerado automaticamente
- Acompanhar de perto o colaborador

**Acesse o sistema para mais detalhes:**
{{assessment_link}}

**IMPORTANTE:** Este caso requer atenção imediata conforme NR-01.

Atenciosamente,
Sistema de Gestão de Riscos Psicossociais`,
    description: "Alerta para gestores sobre casos de alto risco"
  },
  {
    name: "Plano de Ação Criado",
    type: "action_plan_created",
    subject: "📋 Plano de Ação Gerado - {{sector_name}}",
    body: `Olá {{manager_name}},

Um plano de ação foi gerado automaticamente para o setor {{sector_name}} baseado nos resultados das avaliações psicossociais.

**Resumo:**
- Nível de risco identificado: {{risk_level}}
- Data de criação: {{completion_date}}
- Ações recomendadas disponíveis no sistema

**Próximos passos:**
1. Revise o plano de ação completo no sistema
2. Implemente as ações dentro dos prazos estabelecidos
3. Monitore o progresso regularmente

**Acesse o plano de ação:**
{{assessment_link}}

Para dúvidas sobre implementação, entre em contato com a equipe de SST.

Atenciosamente,
Sistema de Gestão {{company_name}}`,
    description: "Notificação sobre criação de plano de ação"
  }
];

export async function createDefaultEmailTemplates(): Promise<void> {
  try {
    for (const template of DEFAULT_EMAIL_TEMPLATES) {
      const { error } = await supabase
        .from('email_templates')
        .insert({
          name: template.name,
          subject: template.subject,
          body: template.body,
          description: template.description
        });

      if (error) {
        console.error(`Error creating template ${template.name}:`, error);
      }
    }
  } catch (error) {
    console.error("Error creating default email templates:", error);
    throw error;
  }
}

export async function fetchEmailTemplates(): Promise<EmailTemplate[]> {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching email templates:', error);
    throw error;
  }

  // Corrigido: Tratamento adequado do tipo Json para Record<string, string>
  return (data || []).map(template => ({
    id: template.id,
    name: template.name,
    subject: template.subject,
    body: template.body,
    variables: typeof template.variables === 'object' && template.variables !== null 
      ? template.variables as Record<string, string>
      : {},
    created_at: template.created_at,
    updated_at: template.updated_at
  }));
}

export async function saveEmailTemplate(template: Omit<EmailTemplate, "id">): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;

    return data.id;
  } catch (error) {
    console.error("Error saving email template:", error);
    throw error;
  }
}

export async function updateEmailTemplate(templateId: string, updates: Partial<EmailTemplate>): Promise<void> {
  try {
    const { error } = await supabase
      .from('email_templates')
      .update(updates)
      .eq('id', templateId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating email template:", error);
    throw error;
  }
}

export async function deleteEmailTemplate(templateId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting email template:", error);
    throw error;
  }
}

export function processEmailTemplate(
  template: string, 
  variables: Record<string, string>
): string {
  let processed = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, value || `{{${key}}}`);
  });
  
  return processed;
}

export function validateEmailTemplate(template: EmailTemplate): string[] {
  const errors: string[] = [];
  
  if (!template.name?.trim()) {
    errors.push("Nome do template é obrigatório");
  }
  
  if (!template.subject?.trim()) {
    errors.push("Assunto é obrigatório");
  }
  
  if (!template.body?.trim()) {
    errors.push("Corpo do email é obrigatório");
  }
  
  // Check for common variable typos
  const commonVariables = [
    'employee_name', 'employee_email', 'company_name', 
    'assessment_title', 'assessment_link', 'due_date'
  ];
  
  const bodyText = template.body || '';
  const subjectText = template.subject || '';
  
  // Find all variables used in template
  const usedVariables = [
    ...(bodyText.match(/{{([^}]+)}}/g) || []),
    ...(subjectText.match(/{{([^}]+)}}/g) || [])
  ].map(v => v.replace(/[{}]/g, ''));
  
  // Warn about unknown variables
  usedVariables.forEach(variable => {
    if (!commonVariables.includes(variable)) {
      errors.push(`Variável '${variable}' pode não estar disponível`);
    }
  });
  
  return errors;
}
