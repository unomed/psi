
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleName: string;
  newRoleName: string;
  setNewRoleName: (name: string) => void;
  handleEditRole: () => void;
}

export function EditRoleDialog({
  open,
  onOpenChange,
  roleName,
  newRoleName,
  setNewRoleName,
  handleEditRole,
}: EditRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Altere o nome do perfil "{roleName}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="roleName">Novo Nome do Perfil</Label>
          <Input 
            id="roleName" 
            value={newRoleName} 
            onChange={(e) => setNewRoleName(e.target.value)} 
            placeholder="Ex: Gestor Comercial" 
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleEditRole}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
