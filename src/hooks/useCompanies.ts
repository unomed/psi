
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        logoUrl: company.logo_url,
        contactName: company.contact_name,
        contactEmail: company.contact_email,
        contactPhone: company.contact_phone,
        createdAt: new Date(company.created_at),
        updatedAt: new Date(company.updated_at)
      }));
    }
  });

  const createCompany = useMutation({
    mutationFn: async (companyData: any) => {
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
          logo_url: companyData.logoUrl,
          contact_name: companyData.contactName,
          contact_email: companyData.contactEmail,
          contact_phone: companyData.contactPhone
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
    mutationFn: async (companyData: any) => {
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
          logo_url: companyData.logoUrl,
          contact_name: companyData.contactName,
          contact_email: companyData.contactEmail,
          contact_phone: companyData.contactPhone
        })
        .eq('id', companyData.id)
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
    createCompany,
    updateCompany,
    deleteCompany
  };
}
