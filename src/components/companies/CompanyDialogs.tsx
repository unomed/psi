
import { CompanyData } from "./CompanyCard";
import { CompanyForm } from "@/components/forms/CompanyForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface CompanyDialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  selectedCompany: CompanyData | null;
  handleCreate: (data: Omit<CompanyData, "id">) => void;
  handleEdit: (data: Omit<CompanyData, "id">) => void;
  handleDelete: () => void;
}

export function CompanyDialogs({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isViewDialogOpen,
  setIsViewDialogOpen,
  selectedCompany,
  handleCreate,
  handleEdit,
  handleDelete,
}: CompanyDialogsProps) {
  return (
    <>
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
    </>
  );
}
