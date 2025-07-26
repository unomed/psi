import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoleForm } from "@/components/roles/RoleForm";
import { RoleGrid } from "@/components/roles/RoleGrid";
import { EmptyRoleState } from "@/components/roles/EmptyRoleState";
import { RoleHeader } from "@/components/roles/RoleHeader";
import { RoleDetailsDialog } from "@/components/roles/RoleDetailsDialog";
import { useSectors } from "@/hooks/useSectors";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

export default function Funcoes() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  
  const { selectedCompanyId } = useCompany();
  const { sectors } = useSectors();
  const {
    isDialogOpen,
    setIsDialogOpen,
    editingRole,
    setEditingRole,
    viewingRole,
    setViewingRole,
    canCreateRoles,
    roles,
    handleCreateOrUpdateRole,
    handleDeleteRole,
  } = useRoleManagement();

  const filteredRoles = roles?.filter(role => 
    (!selectedCompanyId || role.companyId === selectedCompanyId) &&
    (!selectedSector || role.sectorId === selectedSector)
  );

  const handleCreateRole = async (values: any) => {
    if (!selectedCompanyId) {
      toast.error("Selecione uma empresa no cabeçalho");
      return;
    }
    await handleCreateOrUpdateRole({ ...values, companyId: selectedCompanyId });
  };

  return (
    <div className="space-y-6">
      <RoleHeader 
        onCreateClick={() => {
          setEditingRole(null);
          setIsDialogOpen(true);
        }}
        canCreate={canCreateRoles}
      />

      {!selectedCompanyId ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">Selecione uma empresa no cabeçalho para visualizar as funções</p>
        </div>
      ) : filteredRoles && filteredRoles.length > 0 ? (
        <RoleGrid 
          roles={filteredRoles}
          onEdit={(role) => {
            setEditingRole(role);
            setIsDialogOpen(true);
          }}
          onDelete={handleDeleteRole}
          canEdit={canCreateRoles}
        />
      ) : (
        <EmptyRoleState 
          onCreateClick={() => {
            setEditingRole(null);
            setIsDialogOpen(true);
          }}
          canCreate={canCreateRoles}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Editar Função' : 'Nova Função'}</DialogTitle>
          </DialogHeader>
          <RoleForm 
            onSubmit={handleCreateRole}
            defaultValues={editingRole || undefined}
            sectors={selectedCompanyId ? (sectors?.filter(s => s.companyId === selectedCompanyId) || []) : []}
            roleId={editingRole?.id} // Passando o ID da função para permitir gerenciamento de tags
          />
        </DialogContent>
      </Dialog>

      <RoleDetailsDialog 
        role={viewingRole}
        onOpenChange={() => setViewingRole(null)}
      />
    </div>
  );
}
