
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/companies/columns";
import type { CompanyData } from "@/components/companies/CompanyCard";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { EmptyCompanyState } from "@/components/companies/EmptyCompanyState";
import { CompanyDialogs } from "@/components/companies/CompanyDialogs";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyAccessCheck } from "@/hooks/useCompanyAccessCheck";
import { toast } from "sonner";

export default function Empresas() {
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [displayedCompanies, setDisplayedCompanies] = useState<CompanyData[]>([]);
  
  const { companies, isLoading, createCompany, updateCompany, deleteCompany } = useCompanies();
  const { userRole, userCompanies } = useAuth();
  const { filterResourcesByCompany } = useCompanyAccessCheck();

  // Filtra empresas com base no acesso do usuário
  useEffect(() => {
    if (!companies) return;
    
    // Se não for superadmin, aplicar filtro rigoroso
    if (userRole !== 'superadmin') {
      const userCompanyIds = userCompanies.map(company => company.companyId);
      console.log('[Empresas] IDs de empresas do usuário:', userCompanyIds);
      
      const filtered = companies.filter(company => 
        userCompanyIds.includes(company.id)
      );
      
      console.log('[Empresas] Empresas filtradas por acesso:', filtered.length, 'de', companies.length);
      setDisplayedCompanies(filtered);
    } else {
      // Superadmin vê tudo
      setDisplayedCompanies(companies);
    }
  }, [companies, userRole, userCompanies]);

  // Verifica acesso antes de criar/editar/excluir
  const verifyAccessToCompany = (companyId: string): boolean => {
    if (userRole === 'superadmin') return true;
    
    const hasAccess = userCompanies.some(company => company.companyId === companyId);
    if (!hasAccess) {
      toast.error('Você não tem acesso a esta empresa');
      return false;
    }
    
    return true;
  };

  const handleCreate = async (data: Omit<CompanyData, "id">) => {
    try {
      await createCompany.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  const handleEdit = async (data: Omit<CompanyData, "id">) => {
    if (!selectedCompany) return;
    
    // Verificar acesso
    if (!verifyAccessToCompany(selectedCompany.id)) return;
    
    try {
      await updateCompany.mutateAsync({ ...data, id: selectedCompany.id });
      setIsEditDialogOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany) return;
    
    // Verificar acesso
    if (!verifyAccessToCompany(selectedCompany.id)) return;
    
    try {
      await deleteCompany.mutateAsync(selectedCompany.id);
      setIsDeleteDialogOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const handleView = (company: CompanyData) => {
    // Verificar acesso
    if (!verifyAccessToCompany(company.id)) return;
    
    setSelectedCompany(company);
    setIsViewDialogOpen(true);
  };

  // Aplicar filtro de busca
  const filteredCompanies = displayedCompanies.filter(company => 
    company.name.toLowerCase().includes(search.toLowerCase()) ||
    company.cnpj.toLowerCase().includes(search.toLowerCase()) ||
    company.city?.toLowerCase().includes(search.toLowerCase()) ||
    company.state?.toLowerCase().includes(search.toLowerCase()) ||
    (company.industry && company.industry.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as empresas e suas filiais, incluindo informações do PGR.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>
      
      <CompanySearch
        search={search}
        onSearchChange={setSearch}
      />
      
      {filteredCompanies.length === 0 ? (
        <EmptyCompanyState
          hasSearch={search.length > 0}
          onCreateClick={() => setIsCreateDialogOpen(true)}
        />
      ) : (
        <DataTable 
          columns={columns} 
          data={filteredCompanies}
          isLoading={isLoading}
          meta={{
            onEdit: (company: CompanyData) => {
              if (verifyAccessToCompany(company.id)) {
                setSelectedCompany(company);
                setIsEditDialogOpen(true);
              }
            },
            onDelete: (company: CompanyData) => {
              if (verifyAccessToCompany(company.id)) {
                setSelectedCompany(company);
                setIsDeleteDialogOpen(true);
              }
            },
            onView: handleView,
          }}
        />
      )}

      <CompanyDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isViewDialogOpen={isViewDialogOpen}
        setIsViewDialogOpen={setIsViewDialogOpen}
        selectedCompany={selectedCompany}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}
