
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { EmptyCompanyState } from "@/components/companies/EmptyCompanyState";
import { CompanyDialogs } from "@/components/companies/CompanyDialogs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCompanies } from "@/hooks/companies/useCompanies";

export default function Empresas() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { companies, isLoading, error } = useCompanies();

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setIsEditMode(false);
    setSelectedCompany(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEditMode(false);
    setSelectedCompany(null);
  };

  const handleEditCompany = (company: any) => {
    setSelectedCompany(company);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDeleteCompany = async (company: any) => {
    if (!window.confirm(`Tem certeza que deseja excluir a empresa "${company.name}"?`)) {
      return;
    }

    try {
      // Simular deleção - implementar quando hook estiver disponível
      toast.success("Empresa excluída com sucesso!");
    } catch (err) {
      toast.error("Erro ao excluir empresa.");
    }
  };

  const handleSubmit = async (companyData: any) => {
    try {
      // Simular criação/edição - implementar quando hook estiver disponível
      if (isEditMode) {
        toast.success("Empresa atualizada com sucesso!");
      } else {
        toast.success("Empresa criada com sucesso!");
      }
      handleCloseForm();
    } catch (err) {
      toast.error("Erro ao salvar empresa.");
    }
  };

  const filteredCompanies = companies?.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas e filiais
          </p>
        </div>
        <Button onClick={handleOpenForm}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      <CompanySearch
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {isLoading ? (
        <Card>
          <CardContent>Carregando empresas...</CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent>Erro ao carregar empresas.</CardContent>
        </Card>
      ) : filteredCompanies && filteredCompanies.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription>{company.cnpj}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCompany(company)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCompany(company)}
                  >
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyCompanyState onCreate={handleOpenForm} />
      )}

      <CompanyDialogs
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        isEditMode={isEditMode}
        selectedCompany={selectedCompany}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
