
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/usePermissions";
import { usePermissionOperations } from "@/hooks/permissions/usePermissionOperations";
import { PermissionsContainer } from "@/components/permissions/PermissionsContainer";
import { permissionSettings } from "@/constants/permissionSettings";

export default function PermissionsPage() {
  const { permissions, isLoading } = usePermissions();
  const permissionOperations = usePermissionOperations();

  const uniquePermissions = permissions 
    ? permissions.filter((role, index, self) => 
        index === self.findIndex((t) => t.role === role.role)
      ) 
    : [];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
        ))}
      </div>
    );
  }

  const sections = [...new Set(permissionSettings.map(p => p.section))];

  return (
    <PermissionsContainer
      uniquePermissions={uniquePermissions}
      permissionSettings={permissionSettings}
      sections={sections}
      permissionOperations={permissionOperations}
    />
  );
}
