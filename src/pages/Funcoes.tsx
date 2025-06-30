
import { useState } from "react";
import { useRoles } from "@/hooks/nr01/useRoles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoleHeader } from "@/components/roles/RoleHeader";
import { RoleGrid } from "@/components/roles/RoleGrid";
import { RoleForm } from "@/components/roles/RoleForm";
import { EmptyRoleState } from "@/components/roles/EmptyRoleState";
import { RoleDetailsDialog } from "@/components/roles/RoleDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

export default function Funcoes() {
  const { roles, isLoading } = useRoles();
  const { userCompanies } = useSimpleAuth();
  const queryClient = useQueryClient();
  
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const createRole = useMutation({
    mutationFn: async (roleData: any) => {
      const { data, error } = await supabase
        .from('roles')
        .insert([{
          name: roleData.name,
          description: roleData.description,
          company_id: roleData.company_id,
          sector_id: roleData.sector_id,
          risk_level: roleData.risk_level,
          required_skills: roleData.required_skills,
          required_tags: roleData.required_tags || []
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Função criada com sucesso!');
      setIsCreateDialogOpen(false);
    }
  });

  const updateRole = useMutation({
    mutationFn: async (roleData: any) => {
      const { data, error } = await supabase
        .from('roles')
        .update({
          name: roleData.name,
          description: roleData.description,
          sector_id: roleData.sector_id,
          risk_level: roleData.risk_level,
          required_skills: roleData.required_skills,
          required_tags: roleData.required_tags || []
        })
        .eq('id', roleData.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Função atualizada com sucesso!');
      setIsEditDialogOpen(false);
    }
  });

  const deleteRole = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Função excluída com sucesso!');
    }
  });

  const filteredRoles = selectedCompany 
    ? roles?.filter(role => role.company_id === selectedCompany)
    : [];

  const handleCreateRole = async (roleData: any) => {
    await createRole.mutateAsync({ ...roleData, company_id: selectedCompany });
  };

  const handleEditRole = async (roleData: any) => {
    await updateRole.mutateAsync(roleData);
  };

  const handleDeleteRole = async (roleId: string) => {
    await deleteRole.mutateAsync(roleId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <RoleHeader 
        onCreateClick={() => setIsCreateDialogOpen(true)}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
        userCompanies={userCompanies}
      />

      {!selectedCompany ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">Selecione uma empresa para visualizar as funções</p>
        </div>
      ) : !filteredRoles?.length ? (
        <EmptyRoleState onCreateClick={() => setIsCreateDialogOpen(true)} />
      ) : (
        <RoleGrid
          roles={filteredRoles}
          onEdit={(role) => {
            setSelectedRole(role);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDeleteRole}
          onView={(role) => {
            setSelectedRole(role);
            setIsViewDialogOpen(true);
          }}
        />
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Função</DialogTitle>
          </DialogHeader>
          <RoleForm
            onSubmit={handleCreateRole}
            onCancel={() => setIsCreateDialogOpen(false)}
            companyId={selectedCompany}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Função</DialogTitle>
          </DialogHeader>
          <RoleForm
            role={selectedRole}
            onSubmit={handleEditRole}
            onCancel={() => setIsEditDialogOpen(false)}
            companyId={selectedCompany}
          />
        </DialogContent>
      </Dialog>

      <RoleDetailsDialog
        role={selectedRole}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
    </div>
  );
}
