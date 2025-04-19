
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserProfileMenu() {
  const { user, signOut, userRole } = useAuth();
  
  if (!user) return null;
  
  // Get initials from email or name
  const getInitials = () => {
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  // Get role display text and color
  const getRoleDisplay = () => {
    if (!userRole) return { text: 'Usuário', variant: 'outline' };
    
    switch(userRole) {
      case 'superadmin':
        return { text: 'Super Admin', variant: 'destructive' };
      case 'admin':
        return { text: 'Admin', variant: 'default' };
      case 'evaluator':
        return { text: 'Avaliador', variant: 'secondary' };
      default:
        return { text: 'Usuário', variant: 'outline' };
    }
  };

  const roleDisplay = getRoleDisplay();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserRound className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-sm">{user.email}</span>
              <Badge variant={roleDisplay.variant as any} className="mt-1 w-fit">
                {roleDisplay.text}
              </Badge>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
