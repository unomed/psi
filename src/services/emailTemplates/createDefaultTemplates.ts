
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const defaultTemplates = [
  {
    name: "Convite",
    subject: "Convite para Avaliação Psicossocial - {employeeName}",
    body: `Prezado(a) {employeeName},

Você foi convidado(a) a participar de uma avaliação psicossocial como parte do programa de saúde e bem-estar da empresa.

🔗 **Link para a avaliação:** {linkUrl}

**Informações importantes:**
• A avaliação é confidencial e os dados serão tratados de acordo com a LGPD
• Tempo estimado: 15-20 minutos
• Prazo para conclusão: {dataLimite}
• Em caso de dúvidas, entre em contato com o RH

Sua participação é fundamental para promovermos um ambiente de trabalho mais saudável e produtivo.

Atenciosamente,
Equipe de Recursos Humanos`,
    variables: {
      description: "Template de convite para participar de avaliação psicossocial"
    }
  },
  {
    name: "Lembrete",
    subject: "Lembrete: Avaliação Psicossocial Pendente - {employeeName}",
    body: `Prezado(a) {employeeName},

Este é um lembrete amigável sobre sua avaliação psicossocial que ainda não foi concluída.

🔗 **Link para a avaliação:** {linkUrl}

**Detalhes:**
• Prazo limite: {dataLimite}
• Tempo estimado: 15-20 minutos
• Sua participação é muito importante

Caso tenha dúvidas ou dificuldades técnicas, entre em contato conosco.

Atenciosamente,
Equipe de Recursos Humanos`,
    variables: {
      description: "Template de lembrete para avaliações pendentes"
    }
  },
  {
    name: "Conclusão",
    subject: "Avaliação Psicossocial Concluída - Obrigado!",
    body: `Prezado(a) {employeeName},

Agradecemos por ter concluído sua avaliação psicossocial!

Sua participação é fundamental para melhorarmos continuamente o ambiente de trabalho e promover a saúde mental de todos os colaboradores.

**Próximos passos:**
• Os resultados serão analisados de forma confidencial
• Ações de melhoria serão implementadas conforme necessário
• Você receberá feedback sobre as iniciativas implementadas

Em caso de dúvidas, nossa equipe está à disposição.

Atenciosamente,
Equipe de Recursos Humanos`,
    variables: {
      description: "Template de confirmação de conclusão da avaliação"
    }
  }
];

export async function createDefaultEmailTemplates() {
  try {
    console.log("Criando templates padrão de email...");

    for (const template of defaultTemplates) {
      // Primeiro, limpar templates duplicados mantendo apenas o mais recente
      const { data: allTemplates, error: getAllError } = await supabase
        .from('email_templates')
        .select('id, created_at')
        .eq('name', template.name)
        .order('created_at', { ascending: false });

      if (getAllError) {
        console.error(`Erro ao buscar templates ${template.name}:`, getAllError);
        continue;
      }

      // Se há múltiplos templates, deletar os antigos
      if (allTemplates && allTemplates.length > 1) {
        console.log(`Removendo ${allTemplates.length - 1} templates duplicados para ${template.name}`);
        const templateIdsToDelete = allTemplates.slice(1).map(t => t.id);
        
        const { error: deleteError } = await supabase
          .from('email_templates')
          .delete()
          .in('id', templateIdsToDelete);

        if (deleteError) {
          console.error(`Erro ao deletar templates duplicados ${template.name}:`, deleteError);
        }
      }

      // Verificar se ainda existe pelo menos um template (usando maybeSingle para evitar erro)
      const { data: existing, error: checkError } = await supabase
        .from('email_templates')
        .select('id')
        .eq('name', template.name)
        .maybeSingle();

      if (checkError) {
        console.error(`Erro ao verificar template ${template.name}:`, checkError);
        continue;
      }

      if (existing) {
        console.log(`Template ${template.name} já existe, pulando...`);
        continue;
      }

      // Criar template
      const { error: insertError } = await supabase
        .from('email_templates')
        .insert({
          name: template.name,
          subject: template.subject,
          body: template.body,
          variables: template.variables,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error(`Erro ao criar template ${template.name}:`, insertError);
        toast.error(`Erro ao criar template ${template.name}`);
      } else {
        console.log(`Template ${template.name} criado com sucesso`);
      }
    }

    toast.success("Templates de email configurados com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao criar templates padrão:", error);
    toast.error("Erro ao configurar templates de email");
    return false;
  }
}
