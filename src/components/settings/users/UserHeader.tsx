
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface UserHeaderProps {
  onAddUser: () => void;
}

export function UserHeader({ onAddUser }: UserHeaderProps) {
  return (
    <div className="mb-6">
      <Button onClick={onAddUser}>
        <UserPlus className="h-4 w-4 mr-2" />
        Adicionar Usuário
      </Button>
    </div>
  );
}
