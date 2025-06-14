
import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { CompanyDialogs } from "@/components/companies/CompanyDialogs";
import { EmptyCompanyState } from "@/components/companies/EmptyCompanyState";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyFilter } from "@/hooks/useCompanyFilter";

export default function Empresas() {
  const { companies, isLoading, error } = useCompanies();
  const { userRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCompanyDialogOpen, setIsNewCompanyDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { filteredCompanies } = useCompanyFilter(companies || []);

  // Memoize the displayed companies to prevent unnecessary recalculations
  const displayedCompanies = useMemo(() => {
    if (!filteredCompanies) return [];
    
    if (!searchTerm.trim()) {
      return filteredCompanies;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return filteredCompanies.filter(company =>
      company.name?.toLowerCase().includes(lowercaseSearch) ||
      company.cnpj?.toLowerCase().includes(lowercaseSearch) ||
      company.email?.toLowerCase().includes(lowercaseSearch)
    );
  }, [filteredCompanies, searchTerm]);

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

  const canCreateCompany = userRole === 'superadmin';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={handleEditCompany}
              onView={handleViewCompany}
              canEdit={canCreateCompany}
            />
          ))}
        </div>
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
      />
    </div>
  );
}
