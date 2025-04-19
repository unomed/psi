
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/companies/columns";
import type { CompanyData } from "@/components/companies/CompanyCard";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { EmptyCompanyState } from "@/components/companies/EmptyCompanyState";
import { CompanyDialogs } from "@/components/companies/CompanyDialogs";

export default function Empresas() {
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  
  const { companies, isLoading, createCompany, updateCompany, deleteCompany } = useCompanies();

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
    try {
      await deleteCompany.mutateAsync(selectedCompany.id);
      setIsDeleteDialogOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const handleView = (company: CompanyData) => {
    setSelectedCompany(company);
    setIsViewDialogOpen(true);
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(search.toLowerCase()) ||
    company.cnpj.toLowerCase().includes(search.toLowerCase()) ||
    company.city.toLowerCase().includes(search.toLowerCase()) ||
    company.state.toLowerCase().includes(search.toLowerCase()) ||
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
              setSelectedCompany(company);
              setIsEditDialogOpen(true);
            },
            onDelete: (company: CompanyData) => {
              setSelectedCompany(company);
              setIsDeleteDialogOpen(true);
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
