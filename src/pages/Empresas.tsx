import { useState } from "react";
import { PlusCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/forms/CompanyForm";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/companies/columns";
import type { CompanyData } from "@/components/companies/CompanyCard";
import { useCompanies } from "@/hooks/useCompanies";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Empresas() {
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
      
      {companies.length === 0 ? (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhuma empresa cadastrada</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Cadastre empresas e filiais, gerencie informações sobre o ramo de atividade
              e registre os responsáveis pelo PGR.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Cadastrar Empresa
            </Button>
          </div>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={companies}
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

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastro de Empresa</DialogTitle>
            <DialogDescription>
              Preencha os dados da empresa para cadastrá-la no sistema.
            </DialogDescription>
          </DialogHeader>
          <CompanyForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Atualize os dados da empresa.
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <CompanyForm 
              onSubmit={handleEdit} 
              defaultValues={selectedCompany}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Empresa</DialogTitle>
            <DialogDescription>
              Visualize os dados completos da empresa.
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Nome</h3>
                <p>{selectedCompany.name}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">CNPJ</h3>
                <p>{selectedCompany.cnpj}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Endereço</h3>
                <p>{selectedCompany.address}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Cidade</h3>
                <p>{selectedCompany.city}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Estado</h3>
                <p>{selectedCompany.state}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Setor</h3>
                <p>{selectedCompany.industry || "Não informado"}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Nome do Contato</h3>
                <p>{selectedCompany.contactName}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Email do Contato</h3>
                <p>{selectedCompany.contactEmail}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Telefone do Contato</h3>
                <p>{selectedCompany.contactPhone}</p>
              </div>
              {selectedCompany.notes && (
                <div className="col-span-2 space-y-1">
                  <h3 className="font-medium text-muted-foreground">Observações</h3>
                  <p>{selectedCompany.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a empresa
              e todos os dados associados a ela.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
