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
      return data.map(template => {
        // Safely extract description from variables if it exists
        let description = '';
        if (template.variables) {
          // Handle the case when variables is a JSON object
          if (typeof template.variables === 'object' && template.variables !== null) {
            description = (template.variables as Record<string, any>).description || '';
          } 
          // Handle the case when variables might be a JSON string
          else if (typeof template.variables === 'string') {
            try {
              const parsed = JSON.parse(template.variables);
              description = parsed.description || '';
            } catch (e) {
              // If parsing fails, leave description as empty string
              console.warn('Failed to parse variables JSON string:', e);
            }
          }
        }

        return {
          id: template.id,
          name: template.name,
          subject: template.subject,
          body: template.body,
          description: description
        };
      });
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

  const { mutate: createTemplate } = useMutation({
    mutationFn: async (template: { 
      name: string; 
      subject: string; 
      body: string; 
      description?: string 
    }) => {
      // Check if a template with this name already exists
      const { data: existingTemplates, error: checkError } = await supabase
        .from('email_templates')
        .select('id')
        .eq('name', template.name);
      
      if (checkError) throw checkError;
      
      if (existingTemplates && existingTemplates.length > 0) {
        throw new Error(`Já existe um modelo do tipo "${template.name}"`);
      }

      // Store description in the variables field as JSON
      const variables = template.description ? { description: template.description } : {};
      
      const { error } = await supabase
        .from('email_templates')
        .insert({
          name: template.name,
          subject: template.subject,
          body: template.body,
          variables,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success('Novo modelo de email criado com sucesso');
    },
    onError: (error: any) => {
      console.error('Error creating email template:', error);
      toast.error(error.message || 'Erro ao criar novo modelo de email');
    }
  });

  return {
    templates,
    isLoading,
    updateTemplate,
    createTemplate
  };
}
