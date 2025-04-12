
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
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
    <div className="flex items-center gap-2 p-4 border-t">
      <Avatar>
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{user.email}</p>
        {userRole && (
          <Badge variant={roleDisplay.variant as any} className="mt-1">
            {roleDisplay.text}
          </Badge>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={signOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
