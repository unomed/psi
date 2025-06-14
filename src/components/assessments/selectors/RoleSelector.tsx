
import React from "react";
import { useRoles } from "@/hooks/useRoles";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeSelect } from "@/components/ui/SafeSelect";
import type { Role } from "@/types/role";

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

  const filteredRoles = selectedSector
    ? (roles || []).filter(role => role.sectorId === selectedSector)
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
      <SafeSelect
        data={filteredRoles}
        value={selectedRole}
        onChange={onRoleChange}
        placeholder={selectedSector ? "Selecione uma função" : "Selecione um setor primeiro"}
        valueField="id"
        labelField="name"
        disabled={!selectedSector}
        className="w-full"
      />
    </div>
  );
}
