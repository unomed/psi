
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Permission } from "@/hooks/usePermissions";
import { PermissionSetting } from "@/types/permissions";

interface PermissionCardProps {
  section: string;
  permissions: Permission[];
  permissionSettings: PermissionSetting[];
  handleTogglePermission: (role: Permission, permissionId: string) => void;
  getPermissionValue: (role: Permission, permissionId: string) => boolean;
  onEditRole: (role: Permission) => void;
  onDeleteRole: (role: Permission) => void;
}

export function PermissionCard({
  section,
  permissions,
  permissionSettings,
  handleTogglePermission,
  getPermissionValue,
  onEditRole,
  onDeleteRole,
}: PermissionCardProps) {
  const sectionPermissions = permissionSettings.filter(p => p.section === section);
  
  const getSectionIcon = (section: string) => {
    const icons: Record<string, string> = {
      "Dashboard": "📊",
      "Empresas": "🏢",
      "Funcionários": "👥",
      "Setores": "🏭",
      "Funções": "⚙️",
      "Templates": "📋",
      "Avaliações": "✅",
      "Agendamentos": "📅",
      "Resultados": "📈",
      "Gestão de Riscos": "⚠️",
      "Plano de Ação": "📝",
      "Relatórios": "📊",
      "Faturamento": "💰",
      "Configurações": "⚙️"
    };
    return icons[section] || "📄";
  };

  const getPermissionTypeColor = (permissionId: string) => {
    if (permissionId.includes('view')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (permissionId.includes('create')) return 'bg-green-50 text-green-700 border-green-200';
    if (permissionId.includes('edit')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (permissionId.includes('delete')) return 'bg-red-50 text-red-700 border-red-200';
    if (permissionId.includes('manage')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{getSectionIcon(section)}</span>
          {section}
          <Badge variant="outline" className="ml-auto">
            {sectionPermissions.length} permissões
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Permissão</th>
                {permissions.map((role) => (
                  <th key={role.id} className="text-center p-2 min-w-[120px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-medium">{role.role}</span>
                      {role.role !== 'superadmin' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => onEditRole(role)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Editar
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => onDeleteRole(role)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sectionPermissions.map((permissionSetting) => (
                <tr key={permissionSetting.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{permissionSetting.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPermissionTypeColor(permissionSetting.id)}`}
                        >
                          {permissionSetting.id.split('_')[0]}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{permissionSetting.description}</span>
                    </div>
                  </td>
                  {permissions.map((role) => (
                    <td key={`${role.id}-${permissionSetting.id}`} className="p-3 text-center">
                      {role.role === 'superadmin' ? (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          Total
                        </Badge>
                      ) : (
                        <Switch
                          checked={getPermissionValue(role, permissionSetting.id)}
                          onCheckedChange={() => handleTogglePermission(role, permissionSetting.id)}
                          disabled={role.role === 'superadmin'}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
