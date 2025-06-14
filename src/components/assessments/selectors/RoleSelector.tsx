
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

  const baseFilteredRoles = selectedSector
    ? (roles || []).filter(role => role.sectorId === selectedSector)
    : [];

  const validRoles = baseFilteredRoles.filter(role => 
    role && 
    role.id !== null &&
    role.id !== undefined &&
    String(role.id).trim() !== "" &&
    role.name && 
    String(role.name).trim() !== ""
  );

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
          {validRoles.length > 0 ? (
            validRoles.map((role) => (
              <SelectItem key={String(role.id)} value={String(role.id)}>
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
