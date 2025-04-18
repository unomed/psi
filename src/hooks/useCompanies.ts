
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CompanyData } from "@/components/companies/CompanyCard";

export const useCompanies = () => {
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name");

      if (error) {
        toast.error("Erro ao carregar empresas");
        throw error;
      }

      return data.map(company => ({
        id: company.id,
        name: company.name,
        cnpj: company.cnpj,
        address: company.address,
        city: company.city,
        state: company.state,
        industry: company.industry,
        contactName: company.contact_name,
        contactEmail: company.contact_email,
        contactPhone: company.contact_phone,
        notes: company.notes || "" // Provide a default empty string if notes is undefined
      })) as CompanyData[];
    },
  });

  const createCompany = useMutation({
    mutationFn: async (newCompany: Omit<CompanyData, "id">) => {
      const { data, error } = await supabase
        .from("companies")
        .insert([{
          name: newCompany.name,
          cnpj: newCompany.cnpj,
          address: newCompany.address,
          city: newCompany.city,
          state: newCompany.state,
          industry: newCompany.industry,
          contact_name: newCompany.contactName,
          contact_email: newCompany.contactEmail,
          contact_phone: newCompany.contactPhone
          // Don't include notes as it doesn't exist in the database
        }])
        .select()
        .single();

      if (error) {
        toast.error("Erro ao criar empresa");
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        cnpj: data.cnpj,
        address: data.address,
        city: data.city,
        state: data.state,
        industry: data.industry,
        contactName: data.contact_name,
        contactEmail: data.contact_email,
        contactPhone: data.contact_phone,
        notes: data.notes || "" // Provide a default empty string if notes is undefined
      } as CompanyData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Empresa criada com sucesso!");
    },
  });

  const updateCompany = useMutation({
    mutationFn: async (company: CompanyData) => {
      const { error } = await supabase
        .from("companies")
        .update({
          name: company.name,
          cnpj: company.cnpj,
          address: company.address,
          city: company.city,
          state: company.state,
          industry: company.industry,
          contact_name: company.contactName,
          contact_email: company.contactEmail,
          contact_phone: company.contactPhone
          // Don't include notes as it doesn't exist in the database
        })
        .eq("id", company.id);

      if (error) {
        toast.error("Erro ao atualizar empresa");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Empresa atualizada com sucesso!");
    },
  });

  const deleteCompany = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Erro ao deletar empresa");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Empresa removida com sucesso!");
    },
  });

  return {
    companies,
    isLoading,
    createCompany,
    updateCompany,
    deleteCompany,
  };
};
