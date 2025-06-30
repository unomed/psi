
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanyDialogs } from "@/components/companies/CompanyDialogs";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { EmptyCompanyState } from "@/components/companies/EmptyCompanyState";
import { Company } from "@/types";

export default function Empresas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const { companies, createCompany, updateCompany, deleteCompany, isLoading } = useCompanies();

  const handleCreateCompany = async (companyData: Omit<Company, "id" | "created_at" | "updated_at">) => {
    await createCompany(companyData);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateCompany = async (companyData: Partial<Company> & { id: string }) => {
    await updateCompany(companyData);
    setIsEditDialogOpen(false);
    setSelectedCompany(null);
  };

  const handleDeleteCompany = async () => {
    if (selectedCompany) {
      await deleteCompany(selectedCompany.id);
      setIsDeleteDialogOpen(false);
      setSelectedCompany(null);
    }
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsViewDialogOpen(true);
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.cnpj.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Carregando empresas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas cadastradas no sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {companies.length === 0 ? (
        <EmptyCompanyState onCreate={() => setIsCreateDialogOpen(true)} />
      ) : (
        <>
          <CompanySearch
            value={searchTerm}
            onChange={setSearchTerm}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onEdit={handleEditCompany}
                onDelete={handleDeleteClick}
                onView={handleViewCompany}
              />
            ))}
          </div>
        </>
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
        onCreateCompany={handleCreateCompany}
        onUpdateCompany={handleUpdateCompany}
        onDeleteCompany={handleDeleteCompany}
      />
    </div>
  );
}
