
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Company } from "@/types/company";

export function useCompanies() {
  const queryClient = useQueryClient();

  const companiesQuery = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      return data || [];
    }
  });

  const createCompanyMutation = useMutation({
    mutationFn: async (newCompany: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: newCompany.name,
          cnpj: newCompany.cnpj,
          email: newCompany.email,
          phone: newCompany.phone,
          address: newCompany.address,
          city: newCompany.city,
          state: newCompany.state,
          industry: newCompany.industry,
          logo_url: newCompany.logoUrl,
          contact_name: newCompany.contactName,
          contact_email: newCompany.contactEmail,
          contact_phone: newCompany.contactPhone
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar empresa: ' + error.message);
    }
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, company }: { id: string; company: Partial<Company> }) => {
      const { data, error } = await supabase
        .from('companies')
        .update({
          name: company.name,
          cnpj: company.cnpj,
          email: company.email,
          phone: company.phone,
          address: company.address,
          city: company.city,
          state: company.state,
          industry: company.industry,
          logo_url: company.logoUrl,
          contact_name: company.contactName,
          contact_email: company.contactEmail,
          contact_phone: company.contactPhone
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar empresa: ' + error.message);
    }
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa deletada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao deletar empresa: ' + error.message);
    }
  });

  return {
    companies: companiesQuery.data || [],
    isLoading: companiesQuery.isLoading,
    error: companiesQuery.error,
    createCompany: createCompanyMutation.mutateAsync,
    updateCompany: updateCompanyMutation.mutateAsync,
    deleteCompany: deleteCompanyMutation.mutateAsync,
    isCreating: createCompanyMutation.isPending,
    isUpdating: updateCompanyMutation.isPending,
    isDeleting: deleteCompanyMutation.isPending
  };
}
