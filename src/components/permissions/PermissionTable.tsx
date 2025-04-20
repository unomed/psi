
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Permission } from "@/hooks/usePermissions";
import { PermissionSetting } from '@/types/permissions';
import { RoleHeader } from './RoleHeader';

interface PermissionTableProps {
  permissions: Permission[];
  permissionSettings: PermissionSetting[];
  section: string;
  handleTogglePermission: (role: Permission, permissionId: string) => void;
  getPermissionValue: (role: Permission, permissionId: string) => boolean;
  onEditRole: (role: Permission) => void;
  onDeleteRole: (role: Permission) => void;
}

export function PermissionTable({
  permissions,
  permissionSettings,
  section,
  handleTogglePermission,
  getPermissionValue,
  onEditRole,
  onDeleteRole,
}: PermissionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Recurso</TableHead>
          {permissions?.map((role) => (
            <RoleHeader
              key={role.id}
              role={role.role.charAt(0).toUpperCase() + role.role.slice(1)}
              onEdit={() => onEditRole(role)}
              onDelete={() => onDeleteRole(role)}
              isReadOnly={role.role === 'superadmin'}
            />
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissionSettings
          .filter(p => p.section === section)
          .map((permission) => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{permission.name}</div>
                  <div className="text-xs text-muted-foreground">{permission.description}</div>
                </div>
              </TableCell>
              {permissions?.map((role) => (
                <TableCell key={`${role.id}-${permission.id}`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Switch 
                            checked={getPermissionValue(role, permission.id)}
                            onCheckedChange={() => handleTogglePermission(role, permission.id)}
                            disabled={role.role === 'superadmin'}
                            aria-readonly={role.role === 'superadmin'}
                          />
                        </div>
                      </TooltipTrigger>
                      {role.role === 'superadmin' && (
                        <TooltipContent>
                          <p>O perfil Superadmin sempre tem acesso total ao sistema</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
