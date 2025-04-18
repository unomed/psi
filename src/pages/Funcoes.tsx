
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

export default function Funcoes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const { roles, isLoading, createRole } = useRoles();
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

  const handleCreateRole = async (values) => {
    try {
      if (!canCreateRoles) {
        toast.error("Você não tem permissão para criar funções");
        return;
      }
      
      if (!selectedCompany) {
        toast.error("Selecione uma empresa");
        return;
      }

      await createRole.mutateAsync({
        ...values,
        companyId: selectedCompany,
        sectorId: values.sectorId || null,
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating role:", error);
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
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Função
          </Button>
        )}
      </div>

      <RoleCompanySelect 
        value={selectedCompany}
        onChange={setSelectedCompany}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredRoles && filteredRoles.length > 0 ? (
        <RoleGrid 
          roles={filteredRoles}
          canEdit={canCreateRoles}
        />
      ) : (
        <EmptyRoleState 
          onCreateClick={() => canCreateRoles && setIsDialogOpen(true)}
          canCreate={canCreateRoles}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Função</DialogTitle>
          </DialogHeader>
          <RoleForm onSubmit={handleCreateRole} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
