
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Mock data
const ROLES = [
  { id: "role-1", sectorId: "sector-1", name: "Gerente Administrativo" },
  { id: "role-2", sectorId: "sector-1", name: "Assistente Administrativo" },
  { id: "role-3", sectorId: "sector-2", name: "Operador de Máquinas" },
  { id: "role-4", sectorId: "sector-3", name: "Vendedor" },
  { id: "role-5", sectorId: "sector-4", name: "Analista Financeiro" },
];

interface RoleSelectorProps {
  selectedSector: string | null;
  selectedRole: string | null;
  onRoleChange: (roleId: string) => void;
}

export function RoleSelector({
  selectedSector,
  selectedRole,
  onRoleChange,
}: RoleSelectorProps) {
  // Filter roles by sector
  const filteredRoles = selectedSector
    ? ROLES.filter(role => role.sectorId === selectedSector)
    : [];
    
  // Ensure we always have at least one item to select with a non-empty string value
  const roles = filteredRoles.length > 0 
    ? filteredRoles 
    : [{ id: "no-role", name: "Nenhuma função encontrada" }];

  return (
    <div className="space-y-2">
      <Label htmlFor="role">Função</Label>
      <Select
        value={selectedRole || ""}
        onValueChange={onRoleChange}
        disabled={!selectedSector}
      >
        <SelectTrigger id="role">
          <SelectValue placeholder="Selecione uma função" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
