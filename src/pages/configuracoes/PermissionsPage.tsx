import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions, Permission } from "@/hooks/usePermissions";
import { NewRoleDialog } from "@/components/permissions/NewRoleDialog";
import { EditRoleDialog } from "@/components/permissions/EditRoleDialog";
import { DeleteRoleDialog } from "@/components/permissions/DeleteRoleDialog";
import { PermissionCard } from "@/components/permissions/PermissionCard";
import { PermissionsHeader } from "@/components/permissions/PermissionsHeader";
import { PermissionLegend } from "@/components/permissions/PermissionLegend";
import { toast } from "sonner";
import { PermissionSetting } from "@/types/permissions";

export default function PermissionsPage() {
  const { permissions, isLoading, updatePermission, createRole, deleteRole } = usePermissions();
  const [newRoleName, setNewRoleName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Permission | null>(null);

  const uniquePermissions = permissions 
    ? permissions.filter((role, index, self) => 
        index === self.findIndex((t) => t.role === role.role)
      ) 
    : [];

  const permissionSettings: PermissionSetting[] = [
    // Dashboard
    { id: "view_dashboard", name: "Visualizar Dashboard", description: "Acesso ao dashboard", section: "Dashboard" },
    
    // Companies
    { id: "view_companies", name: "Visualizar Empresas", description: "Acesso à listagem de empresas", section: "Empresas" },
    { id: "create_companies", name: "Criar Empresas", description: "Permissão para cadastrar novas empresas", section: "Empresas" },
    { id: "edit_companies", name: "Editar Empresas", description: "Permissão para editar empresas existentes", section: "Empresas" },
    { id: "delete_companies", name: "Excluir Empresas", description: "Permissão para excluir empresas", section: "Empresas" },
    
    // Employees/Funcionários
    { id: "view_employees", name: "Visualizar Funcionários", description: "Acesso à listagem de funcionários", section: "Funcionários" },
    { id: "create_employees", name: "Cadastrar Funcionários", description: "Permissão para cadastrar novos funcionários", section: "Funcionários" },
    { id: "edit_employees", name: "Editar Funcionários", description: "Permissão para editar funcionários existentes", section: "Funcionários" },
    { id: "delete_employees", name: "Excluir Funcionários", description: "Permissão para excluir funcionários", section: "Funcionários" },
    
    // Sectors/Setores
    { id: "view_sectors", name: "Visualizar Setores", description: "Acesso à listagem de setores", section: "Setores" },
    { id: "create_sectors", name: "Criar Setores", description: "Permissão para cadastrar novos setores", section: "Setores" },
    { id: "edit_sectors", name: "Editar Setores", description: "Permissão para editar setores existentes", section: "Setores" },
    { id: "delete_sectors", name: "Excluir Setores", description: "Permissão para excluir setores", section: "Setores" },
    
    // Functions/Funções
    { id: "view_functions", name: "Visualizar Funções", description: "Acesso à listagem de funções", section: "Funções" },
    { id: "create_functions", name: "Criar Funções", description: "Permissão para cadastrar novas funções", section: "Funções" },
    { id: "edit_functions", name: "Editar Funções", description: "Permissão para editar funções existentes", section: "Funções" },
    { id: "delete_functions", name: "Excluir Funções", description: "Permissão para excluir funções", section: "Funções" },
    
    // Templates/Checklists
    { id: "view_checklists", name: "Visualizar Templates", description: "Acesso à listagem de templates", section: "Templates" },
    { id: "create_checklists", name: "Criar Templates", description: "Permissão para cadastrar novos templates", section: "Templates" },
    { id: "edit_checklists", name: "Editar Templates", description: "Permissão para editar templates existentes", section: "Templates" },
    { id: "delete_checklists", name: "Excluir Templates", description: "Permissão para excluir templates", section: "Templates" },
    
    // Assessments/Avaliações
    { id: "view_assessments", name: "Visualizar Avaliações", description: "Acesso à listagem de avaliações", section: "Avaliações" },
    { id: "create_assessments", name: "Criar Avaliações", description: "Permissão para cadastrar novas avaliações", section: "Avaliações" },
    { id: "edit_assessments", name: "Editar Avaliações", description: "Permissão para editar avaliações existentes", section: "Avaliações" },
    { id: "delete_assessments", name: "Excluir Avaliações", description: "Permissão para excluir avaliações", section: "Avaliações" },

    // Agendamentos
    { id: "view_scheduling", name: "Visualizar Agendamentos", description: "Acesso à listagem de agendamentos", section: "Agendamentos" },
    { id: "create_scheduling", name: "Criar Agendamentos", description: "Permissão para criar novos agendamentos", section: "Agendamentos" },
    { id: "edit_scheduling", name: "Editar Agendamentos", description: "Permissão para editar agendamentos existentes", section: "Agendamentos" },
    { id: "delete_scheduling", name: "Excluir Agendamentos", description: "Permissão para excluir agendamentos", section: "Agendamentos" },

    // Resultados
    { id: "view_results", name: "Visualizar Resultados", description: "Acesso à seção de resultados", section: "Resultados" },
    { id: "export_results", name: "Exportar Resultados", description: "Permissão para exportar resultados", section: "Resultados" },
    { id: "analyze_results", name: "Analisar Resultados", description: "Permissão para análise detalhada de resultados", section: "Resultados" },

    // Gestão de Riscos
    { id: "view_risk_management", name: "Visualizar Gestão de Riscos", description: "Acesso à gestão de riscos", section: "Gestão de Riscos" },
    { id: "create_risk_plans", name: "Criar Planos de Risco", description: "Permissão para criar planos de gestão de risco", section: "Gestão de Riscos" },
    { id: "edit_risk_matrix", name: "Editar Matriz de Riscos", description: "Permissão para editar matriz de riscos", section: "Gestão de Riscos" },

    // Plano de Ação
    { id: "view_action_plans", name: "Visualizar Planos de Ação", description: "Acesso aos planos de ação", section: "Plano de Ação" },
    { id: "create_action_plans", name: "Criar Planos de Ação", description: "Permissão para criar planos de ação", section: "Plano de Ação" },
    { id: "edit_action_plans", name: "Editar Planos de Ação", description: "Permissão para editar planos de ação", section: "Plano de Ação" },
    { id: "approve_action_plans", name: "Aprovar Planos de Ação", description: "Permissão para aprovar planos de ação", section: "Plano de Ação" },
    
    // Reports/Relatórios
    { id: "view_reports", name: "Visualizar Relatórios", description: "Acesso à seção de relatórios", section: "Relatórios" },
    { id: "export_reports", name: "Exportar Relatórios", description: "Permissão para exportar relatórios", section: "Relatórios" },
    { id: "create_custom_reports", name: "Criar Relatórios Personalizados", description: "Permissão para criar relatórios personalizados", section: "Relatórios" },

    // Faturamento
    { id: "view_billing", name: "Visualizar Faturamento", description: "Acesso à seção de faturamento", section: "Faturamento" },
    { id: "manage_billing", name: "Gerenciar Faturamento", description: "Permissão para gerenciar configurações de faturamento", section: "Faturamento" },
    { id: "view_invoices", name: "Visualizar Faturas", description: "Permissão para visualizar faturas", section: "Faturamento" },
    
    // Settings/Configurações
    { id: "view_settings", name: "Visualizar Configurações", description: "Acesso à seção de configurações", section: "Configurações" },
    { id: "edit_settings", name: "Editar Configurações", description: "Permissão para alterar configurações do sistema", section: "Configurações" },
    { id: "manage_users", name: "Gerenciar Usuários", description: "Permissão para gerenciar usuários do sistema", section: "Configurações" },
    { id: "manage_permissions", name: "Gerenciar Permissões", description: "Permissão para gerenciar permissões de usuários", section: "Configurações" },
  ];

  const handleTogglePermission = (role: Permission, permissionId: string) => {
    if (role.role === 'superadmin') {
      return;
    }
    
    const newPermissions = { 
      ...role.permissions,
      [permissionId]: !role.permissions[permissionId]
    };
    
    updatePermission.mutate({ 
      roleId: role.id, 
      permissions: newPermissions 
    });
  };
  
  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast.error("O nome do perfil é obrigatório");
      return;
    }
    
    const basicPermissions = createFullPermissions(false);
    basicPermissions.view_dashboard = true;
    
    createRole.mutate({ 
      role: newRoleName.trim(), 
      permissions: basicPermissions 
    });
    
    setNewRoleName("");
    setDialogOpen(false);
  };

  const handleEditRole = () => {
    if (!selectedRole || !newRoleName.trim()) {
      toast.error("O nome do perfil é obrigatório");
      return;
    }

    updatePermission.mutate({
      roleId: selectedRole.id,
      permissions: selectedRole.permissions,
      role: newRoleName.trim()
    } as any);

    setNewRoleName("");
    setEditDialogOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;
    
    deleteRole.mutate(selectedRole.id, {
      onSuccess: () => {
        toast.success("Perfil excluído com sucesso");
        setDeleteDialogOpen(false);
        setSelectedRole(null);
      }
    });
  };

  const onEditRole = (role: Permission) => {
    setSelectedRole(role);
    setNewRoleName(role.role);
    setEditDialogOpen(true);
  };

  const onDeleteRole = (role: Permission) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const getPermissionValue = (role: Permission, permissionId: string): boolean => {
    return !!role.permissions[permissionId];
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
        ))}
      </div>
    );
  }

  const sections = [...new Set(permissionSettings.map(p => p.section))];

  return (
    <div className="space-y-8">
      <PermissionsHeader 
        permissions={uniquePermissions}
        onCreateRole={() => setDialogOpen(true)}
      />
      
      <PermissionLegend />

      {sections.map((section) => (
        <PermissionCard
          key={section}
          section={section}
          permissions={uniquePermissions}
          permissionSettings={permissionSettings}
          handleTogglePermission={handleTogglePermission}
          getPermissionValue={getPermissionValue}
          onEditRole={onEditRole}
          onDeleteRole={onDeleteRole}
        />
      ))}

      {selectedRole && (
        <>
          <EditRoleDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            roleName={selectedRole.role}
            newRoleName={newRoleName}
            setNewRoleName={setNewRoleName}
            handleEditRole={handleEditRole}
          />
          <DeleteRoleDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteRole}
            roleName={selectedRole.role}
          />
        </>
      )}

      <NewRoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        newRoleName={newRoleName}
        setNewRoleName={setNewRoleName}
        handleCreateRole={handleCreateRole}
      />
    </div>
  );
}

const createFullPermissions = (value: boolean): Record<string, boolean> => ({
  view_dashboard: value,
  view_companies: value,
  create_companies: value,
  edit_companies: value,
  delete_companies: value,
  view_employees: value,
  create_employees: value,
  edit_employees: value,
  delete_employees: value,
  view_sectors: value,
  create_sectors: value,
  edit_sectors: value,
  delete_sectors: value,
  view_functions: value,
  create_functions: value,
  edit_functions: value,
  delete_functions: value,
  view_checklists: value,
  create_checklists: value,
  edit_checklists: value,
  delete_checklists: value,
  view_assessments: value,
  create_assessments: value,
  edit_assessments: value,
  delete_assessments: value,
  view_scheduling: value,
  create_scheduling: value,
  edit_scheduling: value,
  delete_scheduling: value,
  view_results: value,
  export_results: value,
  analyze_results: value,
  view_risk_management: value,
  create_risk_plans: value,
  edit_risk_matrix: value,
  view_action_plans: value,
  create_action_plans: value,
  edit_action_plans: value,
  approve_action_plans: value,
  view_reports: value,
  export_reports: value,
  create_custom_reports: value,
  view_billing: value,
  manage_billing: value,
  view_invoices: value,
  view_settings: value,
  edit_settings: value,
  manage_users: value,
  manage_permissions: value,
});
