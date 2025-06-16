
import { Button } from "@/components/ui/button";
import { Plus, Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Permission } from "@/hooks/usePermissions";

interface PermissionsHeaderProps {
  permissions: Permission[];
  onCreateRole: () => void;
}

export function PermissionsHeader({ permissions, onCreateRole }: PermissionsHeaderProps) {
  const roleStats = {
    total: permissions.length,
    superadmin: permissions.filter(p => p.role === 'superadmin').length,
    admin: permissions.filter(p => p.role === 'admin').length,
    others: permissions.filter(p => !['superadmin', 'admin'].includes(p.role)).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          Gerenciar Permissões
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure as permissões de acesso para cada perfil de usuário no sistema.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">Perfis de Usuários</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {roleStats.total} Total
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {roleStats.superadmin} Super Admin
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              {roleStats.admin} Admin
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              {roleStats.others} Outros
            </Badge>
          </div>
        </div>
        
        <Button onClick={onCreateRole} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Novo Perfil
        </Button>
      </div>
    </div>
  );
}
