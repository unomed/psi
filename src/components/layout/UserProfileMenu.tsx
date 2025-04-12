
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

export function UserProfileMenu() {
  const { user, signOut } = useAuth();
  
  if (!user) return null;
  
  // Get initials from email or name
  const getInitials = () => {
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t">
      <Avatar>
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{user.email}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={signOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
