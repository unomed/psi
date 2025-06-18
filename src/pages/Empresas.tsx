import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Users, MapPin, Phone, Mail, Globe, Calendar, MoreHorizontal } from "lucide-react";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { CompanyDialogs } from "@/components/companies/CompanyDialogs";
import { EmptyCompanyState } from "@/components/companies/EmptyCompanyState";
import { useAuth } from '@/hooks/useAuth';
import { useCompanies } from "@/hooks/useCompanies";
import { CreateCompanyDialog } from "@/components/companies/dialogs/CreateCompanyDialog";
import { EditCompanyDialog } from "@/components/companies/dialogs/EditCompanyDialog";
import { DeleteCompanyDialog } from "@/components/companies/dialogs/DeleteCompanyDialog";
import { Company } from "@/types/company";

export default function Empresas() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { user } = useAuth();
  const { companies, isLoading, createCompany, updateCompany, deleteCompany } = useCompanies();

  const handleCreateCompany = async (companyData: Omit<Company, 'id'>) => {
    try {
      await createCompany(companyData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Erro ao criar empresa:", error);
    }
  };

  const handleUpdateCompany = async (companyId: string, companyData: Partial<Company>) => {
    try {
      await updateCompany(companyId, companyData);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    try {
      await deleteCompany(companyId);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erro ao excluir empresa:", error);
    }
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-none p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas e suas informações.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      <CompanySearch />

      {companies && companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={() => handleEdit(company)}
              onDelete={() => handleDelete(company)}
            />
          ))}
        </div>
      ) : (
        <EmptyCompanyState onCreate={() => setIsCreateDialogOpen(true)} />
      )}

      <CreateCompanyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateCompany}
      />

      {selectedCompany && (
        <EditCompanyDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          company={selectedCompany}
          onUpdate={handleUpdateCompany}
        />
      )}

      {selectedCompany && (
        <DeleteCompanyDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          company={selectedCompany}
          onDelete={handleDeleteCompany}
        />
      )}
    </div>
  );
}
