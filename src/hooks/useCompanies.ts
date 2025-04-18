
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

      return data as CompanyData[];
    },
  });

  const createCompany = useMutation({
    mutationFn: async (newCompany: Omit<CompanyData, "id">) => {
      const { data, error } = await supabase
        .from("companies")
        .insert([
          {
            name: newCompany.name,
            cnpj: newCompany.cnpj,
            address: newCompany.address,
            city: newCompany.city,
            state: newCompany.state,
            industry: newCompany.industry,
            contact_name: newCompany.contactName,
            contact_email: newCompany.contactEmail,
            contact_phone: newCompany.contactPhone,
          },
        ])
        .select()
        .single();

      if (error) {
        toast.error("Erro ao criar empresa");
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const deleteCompany = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("companies").delete().eq("id", id);

      if (error) {
        toast.error("Erro ao deletar empresa");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return {
    companies,
    isLoading,
    createCompany,
    deleteCompany,
  };
};
