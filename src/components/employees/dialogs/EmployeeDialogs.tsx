
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Employee, EmployeeFormData } from "@/types/employee";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface EmployeeDialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  selectedEmployee: Employee | null;
  handleCreate: (data: EmployeeFormData) => Promise<void>;
  handleEdit: (data: EmployeeFormData) => Promise<void>;
  handleDelete: () => Promise<void>;
  companyId: string | null;
}

export function EmployeeDialogs({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isViewDialogOpen,
  setIsViewDialogOpen,
  selectedEmployee,
  handleCreate,
  handleEdit,
  handleDelete,
  companyId,
}: EmployeeDialogsProps) {
  return (
    <>
      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastro de Funcionário</DialogTitle>
            <DialogDescription>
              Preencha os dados do funcionário para cadastrá-lo no sistema.
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm onSubmit={handleCreate} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogDescription>
              Atualize os dados do funcionário.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm 
              initialData={selectedEmployee}
              onSubmit={handleEdit} 
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Funcionário</DialogTitle>
            <DialogDescription>
              Visualize os dados completos do funcionário.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Nome</h3>
                <p>{selectedEmployee.name}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">CPF</h3>
                <p>{selectedEmployee.cpf}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Email</h3>
                <p>{selectedEmployee.email || "Não informado"}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Telefone</h3>
                <p>{selectedEmployee.phone || "Não informado"}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Data de Nascimento</h3>
                <p>{selectedEmployee.birth_date ? format(new Date(selectedEmployee.birth_date), 'dd/MM/yyyy') : "Não informado"}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Gênero</h3>
                <p>{selectedEmployee.gender || "Não informado"}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Data de Admissão</h3>
                <p>{format(new Date(selectedEmployee.start_date), 'dd/MM/yyyy')}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground">Status</h3>
                <p>{selectedEmployee.status}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <h3 className="font-medium text-muted-foreground">Endereço</h3>
                <p>{selectedEmployee.address || "Não informado"}</p>
              </div>
              {selectedEmployee.special_conditions && (
                <div className="col-span-2 space-y-1">
                  <h3 className="font-medium text-muted-foreground">Condições Especiais</h3>
                  <p>{selectedEmployee.special_conditions}</p>
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
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o funcionário
              e todos os dados associados a ele.
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
