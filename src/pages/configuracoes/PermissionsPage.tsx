
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions, Permission } from "@/hooks/usePermissions";
import { NewRoleDialog } from "@/components/permissions/NewRoleDialog";
import { PermissionSection } from "@/components/permissions/PermissionSection";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface PermissionSetting {
  id: string;
  name: string;
  description: string;
  section: string;
}

export default function PermissionsPage() {
  const { permissions, isLoading, updatePermission, createRole } = usePermissions();
  const [newRoleName, setNewRoleName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const permissionSettings: PermissionSetting[] = [
    // Dashboard
    { id: "view_dashboard", name: "Visualizar Dashboard", description: "Acesso ao dashboard", section: "Dashboard" },
    
    // Companies
    { id: "view_companies", name: "Visualizar Empresas", description: "Acesso à listagem de empresas", section: "Empresas" },
    { id: "create_companies", name: "Criar Empresas", description: "Permissão para cadastrar novas empresas", section: "Empresas" },
    { id: "edit_companies", name: "Editar Empresas", description: "Permissão para editar empresas existentes", section: "Empresas" },
    { id: "delete_companies", name: "Excluir Empresas", description: "Permissão para excluir empresas", section: "Empresas" },
    
    // Employees
    { id: "view_employees", name: "Visualizar Funcionários", description: "Acesso à listagem de funcionários", section: "Funcionários" },
    { id: "create_employees", name: "Criar Funcionários", description: "Permissão para cadastrar novos funcionários", section: "Funcionários" },
    { id: "edit_employees", name: "Editar Funcionários", description: "Permissão para editar funcionários existentes", section: "Funcionários" },
    { id: "delete_employees", name: "Excluir Funcionários", description: "Permissão para excluir funcionários", section: "Funcionários" },
    
    // Sectors
    { id: "view_sectors", name: "Visualizar Setores", description: "Acesso à listagem de setores", section: "Setores" },
    { id: "create_sectors", name: "Criar Setores", description: "Permissão para cadastrar novos setores", section: "Setores" },
    { id: "edit_sectors", name: "Editar Setores", description: "Permissão para editar setores existentes", section: "Setores" },
    { id: "delete_sectors", name: "Excluir Setores", description: "Permissão para excluir setores", section: "Setores" },
    
    // Functions
    { id: "view_functions", name: "Visualizar Funções", description: "Acesso à listagem de funções", section: "Funções" },
    { id: "create_functions", name: "Criar Funções", description: "Permissão para cadastrar novas funções", section: "Funções" },
    { id: "edit_functions", name: "Editar Funções", description: "Permissão para editar funções existentes", section: "Funções" },
    { id: "delete_functions", name: "Excluir Funções", description: "Permissão para excluir funções", section: "Funções" },
    
    // Checklists
    { id: "view_checklists", name: "Visualizar Checklists", description: "Acesso à listagem de checklists", section: "Checklists" },
    { id: "create_checklists", name: "Criar Checklists", description: "Permissão para cadastrar novos checklists", section: "Checklists" },
    { id: "edit_checklists", name: "Editar Checklists", description: "Permissão para editar checklists existentes", section: "Checklists" },
    { id: "delete_checklists", name: "Excluir Checklists", description: "Permissão para excluir checklists", section: "Checklists" },
    
    // Assessments
    { id: "view_assessments", name: "Visualizar Avaliações", description: "Acesso à listagem de avaliações", section: "Avaliações" },
    { id: "create_assessments", name: "Criar Avaliações", description: "Permissão para cadastrar novas avaliações", section: "Avaliações" },
    { id: "edit_assessments", name: "Editar Avaliações", description: "Permissão para editar avaliações existentes", section: "Avaliações" },
    { id: "delete_assessments", name: "Excluir Avaliações", description: "Permissão para excluir avaliações", section: "Avaliações" },
    
    // Reports
    { id: "view_reports", name: "Visualizar Relatórios", description: "Acesso à seção de relatórios", section: "Relatórios" },
    { id: "export_reports", name: "Exportar Relatórios", description: "Permissão para exportar relatórios", section: "Relatórios" },
    
    // Settings
    { id: "view_settings", name: "Visualizar Configurações", description: "Acesso à seção de configurações", section: "Configurações" },
    { id: "edit_settings", name: "Editar Configurações", description: "Permissão para alterar configurações do sistema", section: "Configurações" },
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
    if (!newRoleName.trim()) return;
    
    const basicPermissions = createFullPermissions(false);
    basicPermissions.view_dashboard = true;
    
    createRole.mutate({ 
      role: newRoleName.trim(), 
      permissions: basicPermissions 
    });
    
    setNewRoleName("");
    setDialogOpen(false);
  };

  const getPermissionValue = (role: Permission, permissionId: string): boolean => {
    if (role.role === 'superadmin') {
      return true;
    }
    return role.permissions && role.permissions[permissionId] === true;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sections = [...new Set(permissionSettings.map(p => p.section))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Permissões</h1>
        <p className="text-muted-foreground mt-2">
          Configure as permissões de acesso para cada perfil de usuário.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Perfis de Usuários</h2>
        <NewRoleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          newRoleName={newRoleName}
          setNewRoleName={setNewRoleName}
          handleCreateRole={handleCreateRole}
        />
      </div>
      
      {sections.map((section) => (
        <PermissionSection
          key={section}
          section={section}
          permissions={permissions}
          permissionSettings={permissionSettings}
          handleTogglePermission={handleTogglePermission}
          getPermissionValue={getPermissionValue}
        />
      ))}
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
  view_reports: value,
  export_reports: value,
  view_settings: value,
  edit_settings: value,
});
