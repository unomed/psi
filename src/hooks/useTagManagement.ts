
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateTagTypeData {
  name: string;
  description?: string;
  category?: string;
}

interface UpdateTagTypeData extends CreateTagTypeData {
  id: string;
}

export function useTagManagement() {
  const queryClient = useQueryClient();

  const createTagType = useMutation({
    mutationFn: async (data: CreateTagTypeData) => {
      const { data: result, error } = await supabase
        .from('employee_tag_types')
        .insert({
          name: data.name,
          description: data.description,
          category: data.category,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating tag type:", error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tag-types'] });
      toast.success('Tag criada com sucesso');
    },
    onError: (error: any) => {
      console.error("Error creating tag type:", error);
      toast.error('Erro ao criar tag');
    },
  });

  const updateTagType = useMutation({
    mutationFn: async ({ id, ...data }: UpdateTagTypeData) => {
      const { data: result, error } = await supabase
        .from('employee_tag_types')
        .update({
          name: data.name,
          description: data.description,
          category: data.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Error updating tag type:", error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tag-types'] });
      toast.success('Tag atualizada com sucesso');
    },
    onError: (error: any) => {
      console.error("Error updating tag type:", error);
      toast.error('Erro ao atualizar tag');
    },
  });

  const deleteTagType = useMutation({
    mutationFn: async (tagId: string) => {
      // Verificar se há funcionários usando esta tag
      const { data: employeeTags, error: checkError } = await supabase
        .from('employee_tags')
        .select('id')
        .eq('tag_type_id', tagId)
        .limit(1);

      if (checkError) {
        throw checkError;
      }

      if (employeeTags && employeeTags.length > 0) {
        throw new Error('Não é possível excluir esta tag pois há funcionários que a possuem');
      }

      // Verificar se é uma tag obrigatória de alguma função
      const { data: requiredTags, error: requiredError } = await supabase
        .from('role_required_tags')
        .select('id')
        .eq('tag_type_id', tagId)
        .limit(1);

      if (requiredError) {
        throw requiredError;
      }

      if (requiredTags && requiredTags.length > 0) {
        throw new Error('Não é possível excluir esta tag pois é obrigatória para alguma função');
      }

      // Se chegou aqui, pode excluir
      const { error } = await supabase
        .from('employee_tag_types')
        .delete()
        .eq('id', tagId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tag-types'] });
      toast.success('Tag excluída com sucesso');
    },
    onError: (error: any) => {
      console.error("Error deleting tag type:", error);
      toast.error(error.message || 'Erro ao excluir tag');
    },
  });

  return {
    createTagType,
    updateTagType,
    deleteTagType
  };
}
