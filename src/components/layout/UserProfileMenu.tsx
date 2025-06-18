
import { LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export function UserProfileMenu() {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  
  console.log('[UserProfileMenu] Current user:', { user: !!user, userRole });
  
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";
    
  const userName = user?.user_metadata?.full_name || "Usuário";
  
  const handleLogout = async () => {
    console.log('[UserProfileMenu] Iniciando logout');
    try {
      await signOut();
      console.log('[UserProfileMenu] Logout realizado, redirecionando');
      navigate("/auth/login");
    } catch (error) {
      console.error('[UserProfileMenu] Erro no logout:', error);
    }
  };
  
  if (!user) {
    console.log('[UserProfileMenu] Usuário não autenticado, não mostrando menu');
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            {userRole && (
              <p className="text-xs leading-none text-muted-foreground capitalize">
                Perfil: {userRole}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/perfil">
              <User className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </Link>
          </DropdownMenuItem>
          {(userRole === 'superadmin' || userRole === 'admin') && (
            <DropdownMenuItem asChild>
              <Link to="/configuracoes/criterios-avaliacao">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
