
import { useState } from "react";
import { useCompanies } from "@/hooks/companies/useCompanies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { EmptyCompanyState } from "@/components/companies/EmptyCompanyState";
import { CreateCompanyDialog } from "@/components/companies/dialogs/CreateCompanyDialog";
import { EditCompanyDialog } from "@/components/companies/dialogs/EditCompanyDialog";
import { DeleteCompanyDialog } from "@/components/companies/dialogs/DeleteCompanyDialog";
import { CompanyViewDialog } from "@/components/companies/CompanyViewDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Empresas() {
  const { companies, isLoading } = useCompanies();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const createCompany = useMutation({
    mutationFn: async (companyData: any) => {
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: companyData.name,
          cnpj: companyData.cnpj,
          email: companyData.email,
          phone: companyData.phone,
          address: companyData.address,
          city: companyData.city,
          state: companyData.state,
          industry: companyData.industry,
          contact_name: companyData.contactName,
          contact_email: companyData.contactEmail,
          contact_phone: companyData.contactPhone
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa criada com sucesso!');
    }
  });

  const updateCompany = useMutation({
    mutationFn: async ({ companyId, companyData }: { companyId: string, companyData: any }) => {
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
          contact_name: companyData.contactName,
          contact_email: companyData.contactEmail,
          contact_phone: companyData.contactPhone
        })
        .eq('id', companyId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsEditDialogOpen(false);
      toast.success('Empresa atualizada com sucesso!');
    }
  });

  const deleteCompany = useMutation({
    mutationFn: async (companyId: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa excluída com sucesso!');
    }
  });

  const filteredCompanies = companies?.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.cnpj?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCompany = async (companyData: any) => {
    await createCompany.mutateAsync(companyData);
  };

  const handleEditCompany = async (companyId: string, companyData: any) => {
    await updateCompany.mutateAsync({ companyId, companyData });
  };

  const handleDeleteCompany = async (companyId: string) => {
    await deleteCompany.mutateAsync(companyId);
  };

  const handleEdit = (company: any) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (company: any) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (company: any) => {
    setSelectedCompany(company);
    setIsViewDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Empresas</h1>
          <p className="text-muted-foreground">
            Gerenciamento de empresas cadastradas
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      <CompanySearch value={searchTerm} onChange={setSearchTerm} />

      {!filteredCompanies?.length ? (
        <EmptyCompanyState onCreateClick={() => setIsCreateDialogOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={{
                ...company,
                id: company.id || '', // Garantir que id não seja undefined
              }}
              onEdit={() => handleEdit(company)}
              onDelete={() => handleDelete(company)}
            />
          ))}
        </div>
      )}

      <CreateCompanyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateCompany}
      />

      <EditCompanyDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        company={selectedCompany}
        onUpdate={handleEditCompany}
      />

      <DeleteCompanyDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        company={selectedCompany}
        onDelete={handleDeleteCompany}
      />

      <CompanyViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        company={selectedCompany}
      />
    </div>
  );
}
