
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useRoles } from "@/hooks/useRoles";

interface RoleSelectorProps {
  selectedSector: string | null;
  selectedRole: string | null;
  onRoleChange: (value: string) => void;
}

export function RoleSelector({ 
  selectedSector, 
  selectedRole, 
  onRoleChange 
}: RoleSelectorProps) {
  const { roles, isLoading } = useRoles();

  const filteredRoles = selectedSector 
    ? roles.filter(role => role.sectorId === selectedSector)
    : [];

  return (
    <div className="space-y-2">
      <Label htmlFor="role">Função</Label>
      <Select 
        onValueChange={onRoleChange} 
        value={selectedRole || undefined}
        disabled={!selectedSector || isLoading}
      >
        <SelectTrigger id="role">
          <SelectValue placeholder={selectedSector ? "Selecione uma função" : "Primeiro selecione um setor"} />
        </SelectTrigger>
        <SelectContent>
          {filteredRoles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
