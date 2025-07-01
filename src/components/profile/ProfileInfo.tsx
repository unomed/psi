
import { User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileInfoProps {
  profile: {
    full_name: string;
    email?: string;
    role: string | null;
  } | null;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  if (!profile) return null;

  const getRoleBadgeClass = (role: string | null) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'evaluator':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'superadmin':
        return 'Administrador Master';
      case 'admin':
        return 'Administrador';
      case 'evaluator':
        return 'Avaliador';
      default:
        return 'Usuário';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
        <CardDescription>
          Seus dados de acesso ao sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">{profile.full_name}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-muted-foreground mb-1">Perfil de Acesso</div>
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(profile.role)}`}>
            {getRoleLabel(profile.role)}
          </div>
          <p className="text-sm mt-2">
            {profile.role === 'superadmin' && 'Acesso total ao sistema, incluindo configurações avançadas e gerenciamento de perfis.'}
            {profile.role === 'admin' && 'Acesso administrativo ao sistema para gerenciar empresas, funcionários e avaliações.'}
            {profile.role === 'evaluator' && 'Acesso específico para criar e realizar avaliações no sistema.'}
            {!profile.role && 'Acesso básico ao sistema.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
