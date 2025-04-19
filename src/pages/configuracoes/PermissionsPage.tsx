
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusCircle, Info } from "lucide-react";  // Changed from 'InfoCircle' to 'Info'
import { usePermissions, Permission } from "@/hooks/usePermissions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Get unique sections
  const sections = [...new Set(permissionSettings.map(p => p.section))];

  const handleTogglePermission = (role: Permission, permissionId: string) => {
    // Não permitir alteração para o perfil superadmin
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
    
    // Create basic permissions for the new role
    const basicPermissions = {
      view_dashboard: true,
      view_companies: false,
      create_companies: false,
      edit_companies: false,
      delete_companies: false,
      view_employees: false,
      create_employees: false,
      edit_employees: false,
      delete_employees: false,
      view_sectors: false,
      create_sectors: false,
      edit_sectors: false,
      delete_sectors: false,
      view_functions: false,
      create_functions: false,
      edit_functions: false,
      delete_functions: false,
      view_checklists: false,
      create_checklists: false,
      edit_checklists: false,
      delete_checklists: false,
      view_assessments: false,
      create_assessments: false,
      edit_assessments: false,
      delete_assessments: false,
      view_reports: false,
      export_reports: false,
      view_settings: false,
      edit_settings: false
    };
    
    createRole.mutate({ 
      role: newRoleName.trim(), 
      permissions: basicPermissions 
    });
    
    setNewRoleName("");
    setDialogOpen(false);
  };

  const getPermissionValue = (role: Permission, permissionId: string): boolean => {
    // Para superadmin, sempre retornar true
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Perfil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Perfil</DialogTitle>
              <DialogDescription>
                Digite o nome do novo perfil de usuário. Após a criação, você poderá configurar as permissões.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="roleName">Nome do Perfil</Label>
              <Input 
                id="roleName" 
                value={newRoleName} 
                onChange={(e) => setNewRoleName(e.target.value)} 
                placeholder="Ex: Gestor Comercial" 
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateRole}>Criar Perfil</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {sections.map((section) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle>{section}</CardTitle>
            <CardDescription>
              Permissões relacionadas a {section.toLowerCase()}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Recurso</TableHead>
                  {permissions?.map((role) => (
                    <TableHead key={role.id}>
                      {role.role.charAt(0).toUpperCase() + role.role.slice(1)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionSettings
                  .filter(p => p.section === section)
                  .map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{permission.name}</div>
                          <div className="text-xs text-muted-foreground">{permission.description}</div>
                        </div>
                      </TableCell>
                      {permissions?.map((role) => (
                        <TableCell key={`${role.id}-${permission.id}`}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <Switch 
                                    checked={getPermissionValue(role, permission.id)}
                                    onCheckedChange={() => handleTogglePermission(role, permission.id)}
                                    disabled={role.role === 'superadmin'} // Superadmin sempre tem todas as permissões
                                    aria-readonly={role.role === 'superadmin'}
                                  />
                                </div>
                              </TooltipTrigger>
                              {role.role === 'superadmin' && (
                                <TooltipContent>
                                  <p>O perfil Superadmin sempre tem acesso total ao sistema</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
