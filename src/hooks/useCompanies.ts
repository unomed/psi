
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CompanyData } from "@/types";

export function useCompanies() {
  const queryClient = useQueryClient();

  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) {
        toast.error('Erro ao carregar empresas');
        throw error;
      }
      
      // Transform database response to match expected interface
      return data.map(company => ({
        id: company.id,
        name: company.name,
        cnpj: company.cnpj,
        email: company.email,
        phone: company.phone,
        address: company.address,
        city: company.city,
        state: company.state,
        industry: company.industry,
        logo_url: company.logo_url,
        contact_name: company.contact_name,
        contact_email: company.contact_email,
        contact_phone: company.contact_phone,
        notes: company.notes || '', // Add notes mapping with fallback
        createdAt: new Date(company.created_at),
        updatedAt: new Date(company.updated_at),
        created_at: company.created_at,
        updated_at: company.updated_at
      }));
    }
  });

  const createCompany = useMutation({
    mutationFn: async (companyData: Omit<CompanyData, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: companyData.name,
          cnpj: companyData.cnpj,
          email: companyData.email,
          phone: companyData.phone,
          address: companyData.address,
          city: companyData.city,
          state: companyData.state,
          industry: companyData.industry,
          logo_url: companyData.logo_url,
          contact_name: companyData.contact_name,
          contact_email: companyData.contact_email,
          contact_phone: companyData.contact_phone,
          notes: companyData.notes
        })
        .select()
        .single();

      if (error) {
        toast.error('Erro ao criar empresa');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa criada com sucesso');
    },
  });

  const updateCompany = useMutation({
    mutationFn: async ({ id, ...companyData }: Partial<CompanyData> & { id: string }) => {
      const { data, error } = await supabase
        .from('companies')
        .update({
          name: companyData.name,
          cnpj: companyData.cnpj,
          email: companyData.email,
          phone: companyData.phone,
          address: companyData.address,
          city: companyData.city,
          state: companyData.state,
          industry: companyData.industry,
          logo_url: companyData.logo_url,
          contact_name: companyData.contact_name,
          contact_email: companyData.contact_email,
          contact_phone: companyData.contact_phone,
          notes: companyData.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast.error('Erro ao atualizar empresa');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa atualizada com sucesso');
    },
  });

  const deleteCompany = useMutation({
    mutationFn: async (companyId: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) {
        toast.error('Erro ao excluir empresa');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa excluída com sucesso');
    },
  });

  return { 
    companies: companies || [], 
    isLoading,
    error,
    createCompany: createCompany.mutate,
    updateCompany: updateCompany.mutate,
    deleteCompany: deleteCompany.mutate
  };
}
