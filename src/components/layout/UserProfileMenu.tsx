
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="hidden sm:block">
          <p className="text-sm font-medium">{user.email}</p>
          <Badge variant={roleDisplay.variant as any} className="mt-1">
            {roleDisplay.text}
          </Badge>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={signOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
