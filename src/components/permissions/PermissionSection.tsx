
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Permission } from "@/hooks/usePermissions";
import { PermissionTable } from './PermissionTable';

interface PermissionSetting {
  id: string;
  name: string;
  description: string;
  section: string;
}

interface PermissionSectionProps {
  section: string;
  permissions: Permission[];
  permissionSettings: PermissionSetting[];
  handleTogglePermission: (role: Permission, permissionId: string) => void;
  getPermissionValue: (role: Permission, permissionId: string) => boolean;
}

export function PermissionSection({
  section,
  permissions,
  permissionSettings,
  handleTogglePermission,
  getPermissionValue,
}: PermissionSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{section}</CardTitle>
        <CardDescription>
          Permissões relacionadas a {section.toLowerCase()}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PermissionTable
          permissions={permissions}
          permissionSettings={permissionSettings}
          section={section}
          handleTogglePermission={handleTogglePermission}
          getPermissionValue={getPermissionValue}
        />
      </CardContent>
    </Card>
  );
}
