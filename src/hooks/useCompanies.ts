
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

      // Map the database fields to match the CompanyData interface
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
        // Since 'notes' might not be a field in the database type,
        // we need to use a type assertion to handle it
        notes: (company as any).notes || undefined
      })) as CompanyData[];
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
            // Only include notes if it exists in the new company data
            ...(newCompany.notes && { notes: newCompany.notes })
          },
        ])
        .select()
        .single();

      if (error) {
        toast.error("Erro ao criar empresa");
        throw error;
      }

      // Map the response to match the CompanyData interface
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
        // Use type assertion here as well
        notes: (data as any).notes || undefined
      } as CompanyData;
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
