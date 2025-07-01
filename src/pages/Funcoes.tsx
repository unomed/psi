
import { useState } from "react";
import { useRoles } from "@/hooks/nr01/useRoles";
import { useSectors } from "@/hooks/nr01/useSectors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoleGrid } from "@/components/roles/RoleGrid";
import { RoleForm } from "@/components/roles/RoleForm";
import { EmptyRoleState } from "@/components/roles/EmptyRoleState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Funcoes() {
  const { roles, isLoading } = useRoles();
  const { sectors } = useSectors();
  const { userCompanies } = useSimpleAuth();
  const queryClient = useQueryClient();
  
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const createRole = useMutation({
    mutationFn: async (roleData: any) => {
      const { data, error } = await supabase
        .from('roles')
        .insert([{
          name: roleData.name,
          description: roleData.description,
          company_id: roleData.company_id,
          sector_id: roleData.sectorId,
          risk_level: roleData.riskLevel,
          required_skills: roleData.requiredSkills,
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
          sector_id: roleData.sectorId,
          risk_level: roleData.riskLevel,
          required_skills: roleData.requiredSkills,
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

  const handleDeleteRole = async (role: any) => {
    await deleteRole.mutateAsync(role.id);
  };

  // Transformar dados para corresponder ao tipo RoleData esperado
  const transformedRoles = filteredRoles?.map(role => ({
    id: role.id,
    name: role.name,
    description: role.description,
    riskLevel: role.risk_level as "high" | "medium" | "low" | undefined,
    requiredSkills: role.required_skills || [],
    companyId: role.company_id,
    created_at: role.created_at,
    updated_at: role.updated_at
  })) || [];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Funções</h1>
          <p className="text-muted-foreground">
            Gerenciamento de funções organizacionais
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} disabled={!selectedCompany}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Função
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Selecione uma empresa" />
          </SelectTrigger>
          <SelectContent>
            {userCompanies?.map((company) => (
              <SelectItem key={company.companyId} value={company.companyId}>
                {company.companyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedCompany ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">Selecione uma empresa para visualizar as funções</p>
        </div>
      ) : !filteredRoles?.length ? (
        <EmptyRoleState onCreateClick={() => setIsCreateDialogOpen(true)} />
      ) : (
        <RoleGrid
          roles={transformedRoles}
          onEdit={(role) => {
            setSelectedRole(role);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDeleteRole}
        />
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Função</DialogTitle>
          </DialogHeader>
          <RoleForm
            onSubmit={handleCreateRole}
            sectors={sectors?.filter(s => s.company_id === selectedCompany) || []}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Função</DialogTitle>
          </DialogHeader>
          <RoleForm
            defaultValues={selectedRole ? {
              name: selectedRole.name,
              description: selectedRole.description,
              riskLevel: selectedRole.riskLevel,
              requiredSkills: selectedRole.requiredSkills,
              sectorId: selectedRole.sector_id
            } : undefined}
            onSubmit={handleEditRole}
            sectors={sectors?.filter(s => s.company_id === selectedCompany) || []}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
