
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

interface NewRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newRoleName: string;
  setNewRoleName: (name: string) => void;
  handleCreateRole: () => void;
}

export function NewRoleDialog({
  open,
  onOpenChange,
  newRoleName,
  setNewRoleName,
  handleCreateRole,
}: NewRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Perfil
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Perfil</DialogTitle>
          <DialogDescription>
            Digite o nome do novo perfil de usuário. Após a criação, você poderá configurar as permissões.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="roleName">Nome do Perfil</Label>
          <Input 
            id="roleName" 
            value={newRoleName} 
            onChange={(e) => setNewRoleName(e.target.value)} 
            placeholder="Ex: Gestor Comercial" 
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleCreateRole}>Criar Perfil</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
