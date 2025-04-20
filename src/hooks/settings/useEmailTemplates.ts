
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmailTemplate } from "@/components/settings/email-templates/types";

export function useEmailTemplates() {
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching email templates:', error);
        toast.error('Erro ao carregar modelos de email');
        return [];
      }

      // Transform the data to ensure it matches EmailTemplate interface
      // The database doesn't have a description field, so we add it
      return data.map(template => ({
        id: template.id,
        name: template.name,
        subject: template.subject,
        body: template.body,
        description: '' // Add empty description since it's not in the database
      }));
    }
  });

  const { mutate: updateTemplate } = useMutation({
    mutationFn: async (template: { subject: string; body: string; id: string }) => {
      const { error } = await supabase
        .from('email_templates')
        .update({
          subject: template.subject,
          body: template.body,
          updated_at: new Date().toISOString()
        })
        .eq('id', template.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success('Modelo de email atualizado com sucesso');
    },
    onError: (error) => {
      console.error('Error updating email template:', error);
      toast.error('Erro ao atualizar modelo de email');
    }
  });

  return {
    templates,
    isLoading,
    updateTemplate
  };
}
