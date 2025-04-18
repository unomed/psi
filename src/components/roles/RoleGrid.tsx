
import type { RoleData } from "./RoleCard";
import { RoleCard } from "./RoleCard";

interface RoleGridProps {
  roles: RoleData[];
  onRoleClick: (role: RoleData) => void;
}

export function RoleGrid({ roles, onRoleClick }: RoleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <RoleCard 
          key={role.id} 
          role={role} 
          onClick={() => onRoleClick(role)}
        />
      ))}
    </div>
  );
}
