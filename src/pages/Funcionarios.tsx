
import { useState } from "react";
import { PlusCircle, Users } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/employees/columns";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { Employee, EmployeeFormData } from "@/types/employee";
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
import { format } from "date-fns";

export default function Funcionarios() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const { employees, isLoading, createEmployee, updateEmployee, deleteEmployee } = useEmployees();

  const handleCreate = async (data: EmployeeFormData) => {
    try {
      await createEmployee.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const handleEdit = async (data: EmployeeFormData) => {
    if (!selectedEmployee) return;
    try {
      await updateEmployee.mutateAsync({ ...data, id: selectedEmployee.id });
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    try {
      await deleteEmployee.mutateAsync(selectedEmployee.id);
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os funcionários da empresa e suas informações.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>

      {employees?.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum funcionário cadastrado</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Cadastre funcionários para começar a gerenciar suas informações.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Cadastrar Funcionário
            </Button>
          </div>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={employees || []}
          isLoading={isLoading}
          meta={{
            onEdit: (employee: Employee) => {
              setSelectedEmployee(employee);
              setIsEditDialogOpen(true);
            },
            onDelete: (employee: Employee) => {
              setSelectedEmployee(employee);
              setIsDeleteDialogOpen(true);
            },
            onView: (employee: Employee) => {
              setSelectedEmployee(employee);
              setIsViewDialogOpen(true);
            },
          }}
        />
      )}

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
    </div>
  );
}
