
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { Employee, EmployeeFormData } from "@/types/employee";
import { useRoles } from "@/hooks/useRoles";
import { useSectors } from "@/hooks/useSectors";

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
  handleCreate: (data: EmployeeFormData) => void;
  handleEdit: (data: EmployeeFormData) => void;
  handleDelete: () => void;
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
  companyId
}: EmployeeDialogsProps) {
  const { roles } = useRoles();
  const { sectors } = useSectors();
  
  // Ensure these arrays are never undefined
  const safeRoles = roles || [];
  const safeSectors = sectors || [];

  // Map to translate status values
  const statusMap: Record<string, string> = {
    active: "Ativo",
    inactive: "Inativo",
    vacation: "Férias",
    medical_leave: "Licença Médica"
  };

  return (
    <>
      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Funcionário</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            initialData={companyId ? { company_id: companyId } as any : undefined}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o funcionário "{selectedEmployee?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Funcionário</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Informações Pessoais</h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Nome:</span> {selectedEmployee.name}</p>
                    <p><span className="font-medium">CPF:</span> {selectedEmployee.cpf}</p>
                    {selectedEmployee.email && <p><span className="font-medium">Email:</span> {selectedEmployee.email}</p>}
                    {selectedEmployee.phone && <p><span className="font-medium">Telefone:</span> {selectedEmployee.phone}</p>}
                    {selectedEmployee.birth_date && <p><span className="font-medium">Data de Nascimento:</span> {new Date(selectedEmployee.birth_date).toLocaleDateString()}</p>}
                    {selectedEmployee.gender && <p><span className="font-medium">Gênero:</span> {selectedEmployee.gender}</p>}
                    {selectedEmployee.address && <p><span className="font-medium">Endereço:</span> {selectedEmployee.address}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Informações Profissionais</h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Data de Admissão:</span> {new Date(selectedEmployee.start_date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Status:</span> {statusMap[selectedEmployee.status] || selectedEmployee.status}</p>
                    
                    {/* Lookup function role from roles */}
                    <p>
                      <span className="font-medium">Função:</span> {
                        selectedEmployee.role?.name || 
                        safeRoles.find(r => r.id === selectedEmployee.role_id)?.name || 
                        "Não definida"
                      }
                    </p>
                    
                    {/* Lookup sector from sectors */}
                    <p>
                      <span className="font-medium">Setor:</span> {
                        safeSectors.find(s => s.id === selectedEmployee.sector_id)?.name || 
                        "Não definido"
                      }
                    </p>
                    
                    {selectedEmployee.special_conditions && (
                      <p><span className="font-medium">Condições Especiais:</span> {selectedEmployee.special_conditions}</p>
                    )}
                    
                    {selectedEmployee.role?.risk_level && (
                      <p>
                        <span className="font-medium">Nível de Risco da Função:</span> {
                          selectedEmployee.role.risk_level === "low" ? "Baixo" :
                          selectedEmployee.role.risk_level === "medium" ? "Médio" :
                          selectedEmployee.role.risk_level === "high" ? "Alto" :
                          selectedEmployee.role.risk_level
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
