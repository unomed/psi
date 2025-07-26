import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { CompanyDialogs } from "@/components/companies/CompanyDialogs";
import { EmptyCompanyState } from "@/components/companies/EmptyCompanyState";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/companies/columns";

export default function Empresas() {
  const { companies, isLoading, error, createCompany, updateCompany } = useCompanies();
  const { userRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCompanyDialogOpen, setIsNewCompanyDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Para empresas, mostrar todas se for superadmin, ou apenas as que o usuário tem acesso
  const displayedCompanies = useMemo(() => {
    if (!companies) return [];
    
    // Superadmin vê todas as empresas, outros veem apenas as suas
    const filteredList = userRole === 'superadmin' ? companies : [];
    
    if (!searchTerm.trim()) {
      return filteredList;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return filteredList.filter(company =>
      company.name?.toLowerCase().includes(lowercaseSearch) ||
      company.cnpj?.toLowerCase().includes(lowercaseSearch) ||
      company.email?.toLowerCase().includes(lowercaseSearch)
    );
  }, [companies, searchTerm, userRole]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleEditCompany = useCallback((company) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  }, []);

  const handleViewCompany = useCallback((company) => {
    setSelectedCompany(company);
    setIsViewDialogOpen(true);
  }, []);

  const handleNewCompany = useCallback(() => {
    setIsNewCompanyDialogOpen(true);
  }, []);

  // Função para criar empresa
  const handleCreateCompany = useCallback((data) => {
    createCompany.mutate(data, {
      onSuccess: () => {
        setIsNewCompanyDialogOpen(false);
      }
    });
  }, [createCompany]);

  // Função para editar empresa
  const handleUpdateCompany = useCallback((data) => {
    if (selectedCompany) {
      updateCompany.mutate({ ...data, id: selectedCompany.id }, {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedCompany(null);
        }
      });
    }
  }, [updateCompany, selectedCompany]);

  const canCreateCompany = userRole === 'superadmin';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">Carregando empresas...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Erro ao carregar empresas: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
        {canCreateCompany && (
          <Button onClick={handleNewCompany}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Empresa
          </Button>
        )}
      </div>

      <CompanySearch 
        value={searchTerm} 
        onChange={handleSearchChange} 
      />

      {displayedCompanies.length === 0 ? (
        <EmptyCompanyState 
          hasSearch={!!searchTerm.trim()}
          canCreate={canCreateCompany}
          onCreateNew={handleNewCompany}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns}
              data={displayedCompanies}
              isLoading={isLoading}
              meta={{
                onEdit: handleEditCompany,
                onView: handleViewCompany,
                canEdit: canCreateCompany,
              }}
            />
          </CardContent>
        </Card>
      )}

      <CompanyDialogs
        isCreateDialogOpen={isNewCompanyDialogOpen}
        onCreateDialogChange={setIsNewCompanyDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        onEditDialogChange={setIsEditDialogOpen}
        isViewDialogOpen={isViewDialogOpen}
        onViewDialogChange={setIsViewDialogOpen}
        selectedCompany={selectedCompany}
        onCompanySelect={setSelectedCompany}
        handleCreate={handleCreateCompany}
        handleEdit={handleUpdateCompany}
      />
    </div>
  );
}
