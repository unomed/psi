
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export function PermissionLegend() {
  const permissionTypes = [
    { type: 'view', label: 'Visualizar', color: 'bg-blue-50 text-blue-700 border-blue-200', description: 'Permite visualizar dados' },
    { type: 'create', label: 'Criar', color: 'bg-green-50 text-green-700 border-green-200', description: 'Permite criar novos registros' },
    { type: 'edit', label: 'Editar', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', description: 'Permite modificar registros existentes' },
    { type: 'delete', label: 'Excluir', color: 'bg-red-50 text-red-700 border-red-200', description: 'Permite remover registros' },
    { type: 'manage', label: 'Gerenciar', color: 'bg-purple-50 text-purple-700 border-purple-200', description: 'Acesso administrativo completo' },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="h-5 w-5 text-blue-600" />
          Legenda de Tipos de Permissão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {permissionTypes.map((type) => (
            <div key={type.type} className="flex flex-col gap-1">
              <Badge variant="outline" className={`justify-center ${type.color}`}>
                {type.label}
              </Badge>
              <span className="text-xs text-gray-500 text-center">{type.description}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
