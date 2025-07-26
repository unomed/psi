
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Phone, Briefcase } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";

interface ProfileInfoProps {
  profile: {
    full_name: string;
    email?: string;
    phone?: string;
    position?: string;
    role: string | null;
    avatar_url?: string;
  } | null;
  onAvatarUpdate: (newUrl: string) => void;
}

export function ProfileInfo({ profile, onAvatarUpdate }: ProfileInfoProps) {
  const getRoleBadgeClass = (role: string | null) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'admin':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'evaluator':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
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

  if (!profile) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informações do Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex justify-center">
          <AvatarUpload 
            currentAvatarUrl={profile.avatar_url}
            userName={profile.full_name}
            onAvatarUpdate={onAvatarUpdate}
          />
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{profile.full_name}</p>
              <p className="text-sm text-muted-foreground">Nome completo</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{profile.email}</p>
              <p className="text-sm text-muted-foreground">Endereço de email</p>
            </div>
          </div>

          {profile.phone && (
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{profile.phone}</p>
                <p className="text-sm text-muted-foreground">Telefone</p>
              </div>
            </div>
          )}

          {profile.position && (
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{profile.position}</p>
                <p className="text-sm text-muted-foreground">Cargo</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getRoleBadgeClass(profile.role)}>
                {getRoleLabel(profile.role)}
              </Badge>
              <div>
                <p className="text-sm text-muted-foreground">
                  {profile.role === 'superadmin' ? 'Acesso total ao sistema' :
                   profile.role === 'admin' ? 'Gerenciamento de empresas' :
                   profile.role === 'evaluator' ? 'Avaliação de funcionários' : 'Acesso básico'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
