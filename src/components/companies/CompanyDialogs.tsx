
import { CompanyData } from "./CompanyCard";
import { CompanyForm } from "@/components/forms/CompanyForm";
import { CompanyViewDialog } from "./CompanyViewDialog";
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
  onCreateDialogChange: (open: boolean) => void;
  isEditDialogOpen: boolean;
  onEditDialogChange: (open: boolean) => void;
  isDeleteDialogOpen?: boolean;
  onDeleteDialogChange?: (open: boolean) => void;
  isViewDialogOpen: boolean;
  onViewDialogChange: (open: boolean) => void;
  selectedCompany: CompanyData | null;
  onCompanySelect?: (company: CompanyData | null) => void;
  handleCreate?: (data: Omit<CompanyData, "id">) => void;
  handleEdit?: (data: Omit<CompanyData, "id">) => void;
  handleDelete?: () => void;
}

export function CompanyDialogs({
  isCreateDialogOpen,
  onCreateDialogChange,
  isEditDialogOpen,
  onEditDialogChange,
  isDeleteDialogOpen = false,
  onDeleteDialogChange,
  isViewDialogOpen,
  onViewDialogChange,
  selectedCompany,
  handleCreate,
  handleEdit,
  handleDelete,
}: CompanyDialogsProps) {
  return (
    <>
      <Dialog open={isCreateDialogOpen} onOpenChange={onCreateDialogChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastro de Empresa</DialogTitle>
            <DialogDescription>
              Preencha os dados da empresa para cadastrá-la no sistema.
            </DialogDescription>
          </DialogHeader>
          {handleCreate && <CompanyForm onSubmit={handleCreate} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Atualize os dados da empresa.
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && handleEdit && (
            <CompanyForm 
              onSubmit={handleEdit} 
              defaultValues={selectedCompany}
            />
          )}
        </DialogContent>
      </Dialog>

      <CompanyViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={onViewDialogChange}
        company={selectedCompany}
      />

      {onDeleteDialogChange && handleDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogChange}>
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
      )}
    </>
  );
}
