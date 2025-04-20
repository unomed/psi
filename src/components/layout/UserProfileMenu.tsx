
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Building, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function UserProfileMenu() {
  const { user, signOut, userRole, userCompanies } = useAuth();

  if (!user) return null;

  // Extract first letter of email for avatar
  const emailFirstLetter = user.email ? user.email[0].toUpperCase() : "U";
  
  // Get user display name from either full_name (from profile) or email
  const userDisplayName = user.user_metadata?.full_name || user.email || 'Usuário';

  // Format role for display
  const displayRole = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Usuário';

  // Determinar se existe acesso a empresas
  const hasCompanyAccess = userCompanies && userCompanies.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src="" alt={userDisplayName} />
            <AvatarFallback>{emailFirstLetter}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userDisplayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <Badge variant="outline" className="mt-2 w-fit">
              {displayRole}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {userRole === 'superadmin' ? (
          <div className="px-2 py-1 text-xs text-green-600 flex items-center">
            <Building className="h-3 w-3 mr-1" />
            Acesso a todas as empresas
          </div>
        ) : hasCompanyAccess ? (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center">
              <Building className="h-3 w-3 mr-1" />
              Empresas com acesso:
            </DropdownMenuLabel>
            <div className="max-h-32 overflow-y-auto px-2 py-1">
              {userCompanies.map((company) => (
                <div key={company.companyId} className="text-xs py-1 flex items-center">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-2"></span>
                  {company.companyName}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="px-2 py-1 text-xs text-amber-600 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Nenhuma empresa associada ao seu perfil
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
