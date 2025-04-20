
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
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');
        
        if (error) {
          console.error('Error fetching companies:', error);
          toast.error('Erro ao carregar empresas');
        } else if (data) {
          setCompanies(data);
          
          // If user is Super Admin, select all companies automatically
          if (user?.role === 'superadmin') {
            setSelectedCompanies(data.map(c => c.id));
            form.setValue('companyIds', data.map(c => c.id));
          }
        }
      } catch (error) {
        console.error('Unexpected error fetching companies:', error);
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
          const { data, error } = await supabase
            .from('user_companies')
            .select('company_id')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Error fetching user companies:', error);
            toast.error('Erro ao carregar empresas do usuário');
          } else if (data) {
            const companyIds = data.map(item => item.company_id);
            setSelectedCompanies(companyIds);
            form.setValue('companyIds', companyIds);
          }
        } catch (error) {
          console.error('Unexpected error fetching user companies:', error);
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
    } else {
      updatedCompanies = [...selectedCompanies, companyId];
    }
    
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
