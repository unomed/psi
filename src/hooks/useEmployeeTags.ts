
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { EmployeeTag, EmployeeTagType } from "@/types/tags";

export function useEmployeeTags(employeeId?: string) {
  const queryClient = useQueryClient();

  const { data: employeeTags = [], isLoading } = useQuery({
    queryKey: ['employee-tags', employeeId],
    queryFn: async (): Promise<EmployeeTag[]> => {
      if (!employeeId) return [];
      
      const { data, error } = await supabase
        .from('employee_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('employee_id', employeeId);

      if (error) {
        console.error("Error fetching employee tags:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!employeeId
  });

  const addEmployeeTag = useMutation({
    mutationFn: async ({ employeeId, tagTypeId, acquiredDate, notes }: {
      employeeId: string;
      tagTypeId: string;
      acquiredDate?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('employee_tags')
        .insert({
          employee_id: employeeId,
          tag_type_id: tagTypeId,
          acquired_date: acquiredDate,
          notes
        })
        .select()
        .single();

      if (error) {
        toast.error('Erro ao adicionar tag ao funcionário');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-tags'] });
      toast.success('Tag adicionada com sucesso');
    },
  });

  const removeEmployeeTag = useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase
        .from('employee_tags')
        .delete()
        .eq('id', tagId);

      if (error) {
        toast.error('Erro ao remover tag do funcionário');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-tags'] });
      toast.success('Tag removida com sucesso');
    },
  });

  return {
    employeeTags,
    isLoading,
    addEmployeeTag,
    removeEmployeeTag
  };
}

export function useTagTypes() {
  const { data: tagTypes = [], isLoading } = useQuery({
    queryKey: ['tag-types'],
    queryFn: async (): Promise<EmployeeTagType[]> => {
      const { data, error } = await supabase
        .from('employee_tag_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error("Error fetching tag types:", error);
        throw error;
      }

      return data || [];
    }
  });

  return {
    tagTypes,
    isLoading
  };
}
