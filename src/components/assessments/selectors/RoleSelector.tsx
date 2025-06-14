
import React from "react";
import { useRoles } from "@/hooks/useRoles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { roles, isLoading } = useRoles();

  // Filter roles by sector and ensure valid data
  const filteredRoles = selectedSector
    ? roles.filter(role => 
        role && 
        role.sectorId === selectedSector &&
        role.id && 
        role.id.toString().trim() !== "" &&
        role.name && 
        role.name.trim() !== ""
      )
    : [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Função</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="role">Função</Label>
      <Select
        value={selectedRole || "no-role-selected"}
        onValueChange={onRoleChange}
        disabled={!selectedSector}
      >
        <SelectTrigger id="role">
          <SelectValue placeholder="Selecione uma função" />
        </SelectTrigger>
        <SelectContent>
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => (
              <SelectItem key={role.id} value={String(role.id)}>
                {role.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-roles-available" disabled>
              {selectedSector ? "Nenhuma função encontrada" : "Selecione um setor primeiro"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
