
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserProfileMenu() {
  const { user, signOut, userRole, userCompanies } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const initials = user.email ? user.email.substring(0, 2).toUpperCase() : "??";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userRole === 'superadmin' ? 'Super Admin' : 
               userRole === 'admin' ? 'Administrador' : 'Avaliador'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Mostrar empresas do usuário */}
        {userCompanies.length > 0 && (
          <>
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
              Empresas com acesso:
            </DropdownMenuLabel>
            <div className="max-h-32 overflow-y-auto px-2 py-1">
              {userCompanies.map((company) => (
                <p key={company.companyId} className="text-xs text-muted-foreground truncate">
                  • {company.companyName}
                </p>
              ))}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/perfil")}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/configuracoes/email")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => {
            signOut();
            navigate("/auth/login");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
