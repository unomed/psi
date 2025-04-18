
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoleForm } from "@/components/roles/RoleForm";
import { RoleGrid } from "@/components/roles/RoleGrid";
import { EmptyRoleState } from "@/components/roles/EmptyRoleState";
import { RoleCompanySelect } from "@/components/roles/RoleCompanySelect";
import { useRoles } from "@/hooks/useRoles";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";
import type { RoleData } from "@/components/roles/RoleCard";

export default function Funcoes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const { roles, isLoading, createRole, updateRole, deleteRole } = useRoles();
  const { companies } = useCompanies();
  const { sectors } = useSectors();
  const { hasRole, userRole } = useAuth();
  const [canCreateRoles, setCanCreateRoles] = useState(false);
  
  useEffect(() => {
    // Check if user can create roles (superadmin or admin)
    const checkPermissions = async () => {
      const isSuperAdminOrAdmin = userRole === 'superadmin' || userRole === 'admin';
      setCanCreateRoles(isSuperAdminOrAdmin);
    };
    
    checkPermissions();
  }, [userRole]);

  const filteredRoles = roles?.filter(role => 
    !selectedCompany || role.companyId === selectedCompany
  );

  const handleCreateOrUpdateRole = async (values: any) => {
    try {
      if (!canCreateRoles) {
        toast.error("Você não tem permissão para gerenciar funções");
        return;
      }
      
      if (!selectedCompany) {
        toast.error("Selecione uma empresa");
        return;
      }

      if (editingRole) {
        await updateRole.mutateAsync({
          ...editingRole,
          ...values,
          sectorId: values.sectorId || null,
        });
      } else {
        await createRole.mutateAsync({
          ...values,
          companyId: selectedCompany,
          sectorId: values.sectorId || null,
        });
      }

      setIsDialogOpen(false);
      setEditingRole(null);
    } catch (error) {
      console.error("Error managing role:", error);
    }
  };

  const handleEditRole = (role: RoleData) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDeleteRole = async (role: RoleData) => {
    if (confirm("Tem certeza que deseja excluir esta função?")) {
      try {
        await deleteRole.mutateAsync(role.id);
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funções</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie funções, habilidades e perfis de risco psicossocial.
          </p>
        </div>
        {canCreateRoles && (
          <Button onClick={() => {
            setEditingRole(null);
            setIsDialogOpen(true);
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Função
          </Button>
        )}
      </div>

      <RoleCompanySelect 
        companies={companies || []}
        sectors={sectors || []}
        selectedCompany={selectedCompany}
        selectedSector={selectedSector}
        onCompanyChange={setSelectedCompany}
        onSectorChange={setSelectedSector}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredRoles && filteredRoles.length > 0 ? (
        <RoleGrid 
          roles={filteredRoles}
          onEdit={handleEditRole}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Editar Função' : 'Nova Função'}</DialogTitle>
          </DialogHeader>
          <RoleForm 
            onSubmit={handleCreateOrUpdateRole} 
            defaultValues={editingRole || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
