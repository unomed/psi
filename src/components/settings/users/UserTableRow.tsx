
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { User } from "@/hooks/users/types";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleActive: (user: User) => void;
}

export function UserTableRow({ user, onEdit, onDelete, onToggleActive }: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>{user.full_name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        {user.role === 'admin' ? 'Administrador' : 
         user.role === 'superadmin' ? 'Super Admin' : 
         user.role === 'profissionais' ? 'Profissional' : 'Avaliador'}
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                {user.role === 'superadmin' ? (
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    <span>Todas empresas</span>
                  </div>
                ) : (
                  user.companies.length > 0 ? (
                    <span>{user.companies.join(", ")}</span>
                  ) : (
                    <div className="flex items-center text-amber-600">
                      <X className="h-4 w-4 mr-1" />
                      <span>Nenhuma empresa</span>
                    </div>
                  )
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {user.role === 'superadmin' 
                ? 'Super Admin tem acesso a todas as empresas' 
                : user.companies.length > 0 
                  ? `Empresas associadas: ${user.companies.join(", ")}` 
                  : 'Este usuário não tem acesso a nenhuma empresa'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Switch
                checked={user.is_active}
                onCheckedChange={() => onToggleActive(user)}
                aria-label="Toggle user active status"
              />
            </TooltipTrigger>
            <TooltipContent>
              {user.is_active 
                ? 'Usuário ativo no sistema' 
                : 'Usuário inativo no sistema'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(user)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(user)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
