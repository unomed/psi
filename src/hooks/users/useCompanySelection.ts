
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCompanySelection = (user: any, form: ReturnType<typeof useForm>) => {
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch all companies when component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        console.log("[useCompanySelection] Buscando todas as empresas");
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');
        
        if (error) {
          console.error('[useCompanySelection] Erro ao carregar empresas:', error);
          toast.error('Erro ao carregar empresas');
        } else if (data) {
          console.log("[useCompanySelection] Empresas carregadas:", data.length);
          setCompanies(data);
          
          // If user is Super Admin, select all companies automatically
          if (user?.role === 'superadmin') {
            console.log("[useCompanySelection] Usuário é superadmin, selecionando todas as empresas");
            setSelectedCompanies(data.map(c => c.id));
            form.setValue('companyIds', data.map(c => c.id));
          }
        }
      } catch (error) {
        console.error('[useCompanySelection] Erro inesperado ao carregar empresas:', error);
        toast.error('Erro inesperado ao carregar empresas');
      }
    };

    fetchCompanies();
  }, [user?.role, form]);

  // Fetch user's current company assignments when editing
  useEffect(() => {
    if (user?.id) {
      const fetchUserCompanies = async () => {
        try {
          console.log("[useCompanySelection] Buscando empresas associadas ao usuário:", user.id);
          const { data, error } = await supabase
            .from('user_companies')
            .select('company_id')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('[useCompanySelection] Erro ao carregar empresas do usuário:', error);
            toast.error('Erro ao carregar empresas do usuário');
          } else if (data) {
            const companyIds = data.map(item => item.company_id);
            console.log("[useCompanySelection] Empresas encontradas:", companyIds);
            setSelectedCompanies(companyIds);
            form.setValue('companyIds', companyIds);
          }
        } catch (error) {
          console.error('[useCompanySelection] Erro inesperado ao carregar empresas do usuário:', error);
          toast.error('Erro inesperado ao carregar empresas do usuário');
        }
      };

      fetchUserCompanies();
    }
  }, [user, form]);

  const handleToggleCompany = (companyId: string) => {
    let updatedCompanies: string[];
    
    // Se o papel for superadmin, não permitir desmarcar empresas
    if (form.getValues('role') === 'superadmin') {
      toast.info('Super Admin tem acesso a todas as empresas por padrão');
      return;
    }
    
    if (selectedCompanies.includes(companyId)) {
      updatedCompanies = selectedCompanies.filter(id => id !== companyId);
      console.log(`[useCompanySelection] Removendo empresa ${companyId}`);
    } else {
      updatedCompanies = [...selectedCompanies, companyId];
      console.log(`[useCompanySelection] Adicionando empresa ${companyId}`);
    }
    
    console.log("[useCompanySelection] Empresas atualizadas:", updatedCompanies);
    setSelectedCompanies(updatedCompanies);
    form.setValue('companyIds', updatedCompanies);
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    companies: filteredCompanies,
    selectedCompanies,
    searchQuery,
    setSearchQuery,
    handleToggleCompany,
    error,
    setError
  };
};
