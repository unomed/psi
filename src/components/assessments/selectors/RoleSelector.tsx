
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

  // Filter roles by sector
  const filteredRoles = selectedSector
    ? roles.filter(role => role.sectorId === selectedSector)
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
        value={selectedRole || undefined}
        onValueChange={onRoleChange}
        disabled={!selectedSector}
      >
        <SelectTrigger id="role">
          <SelectValue placeholder="Selecione uma função" />
        </SelectTrigger>
        <SelectContent>
          {filteredRoles.map((role) => {
            const roleId = role.id || `role-${role.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
            // Add validation to ensure we never pass empty strings
            if (!roleId || roleId.trim() === '') {
              console.error('Empty role ID detected:', role);
              return null;
            }
            return (
              <SelectItem key={roleId} value={roleId}>
                {role.name || 'Função sem nome'}
              </SelectItem>
            );
          }).filter(Boolean)}
        </SelectContent>
      </Select>
    </div>
  );
}
