
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { mockRoles } from "../mock/assessmentMockData";

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
  const filteredRoles = selectedSector 
    ? mockRoles.filter(role => role.sectorId === selectedSector)
    : [];

  return (
    <div className="space-y-2">
      <Label htmlFor="role">Função</Label>
      <Select 
        onValueChange={onRoleChange} 
        value={selectedRole || undefined}
        disabled={!selectedSector}
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
