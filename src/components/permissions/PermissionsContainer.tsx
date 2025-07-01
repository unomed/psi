
import React from "react";
import { PermissionCard } from "./PermissionCard";
import { PermissionsHeader } from "./PermissionsHeader";
import { PermissionLegend } from "./PermissionLegend";
import { NewRoleDialog } from "./NewRoleDialog";
import { EditRoleDialog } from "./EditRoleDialog";
import { DeleteRoleDialog } from "./DeleteRoleDialog";
import { Permission } from "@/hooks/usePermissions";
import { PermissionSetting } from "@/types/permissions";

interface PermissionsContainerProps {
  uniquePermissions: Permission[];
  permissionSettings: PermissionSetting[];
  sections: string[];
  permissionOperations: any;
}

export function PermissionsContainer({
  uniquePermissions,
  permissionSettings,
  sections,
  permissionOperations
}: PermissionsContainerProps) {
  const {
    newRoleName,
    setNewRoleName,
    dialogOpen,
    setDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedRole,
    handleTogglePermission,
    handleCreateRole,
    handleEditRole,
    handleDeleteRole,
    onEditRole,
    onDeleteRole,
    getPermissionValue
  } = permissionOperations;

  return (
    <div className="space-y-8">
      <PermissionsHeader 
        permissions={uniquePermissions}
        onCreateRole={() => setDialogOpen(true)}
      />
      
      <PermissionLegend />

      {sections.map((section) => (
        <PermissionCard
          key={section}
          section={section}
          permissions={uniquePermissions}
          permissionSettings={permissionSettings}
          handleTogglePermission={handleTogglePermission}
          getPermissionValue={getPermissionValue}
          onEditRole={onEditRole}
          onDeleteRole={onDeleteRole}
        />
      ))}

      {selectedRole && (
        <>
          <EditRoleDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            roleName={selectedRole.role}
            newRoleName={newRoleName}
            setNewRoleName={setNewRoleName}
            handleEditRole={handleEditRole}
          />
          <DeleteRoleDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteRole}
            roleName={selectedRole.role}
          />
        </>
      )}

      <NewRoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        newRoleName={newRoleName}
        setNewRoleName={setNewRoleName}
        handleCreateRole={handleCreateRole}
      />
    </div>
  );
}
