
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);
  const { roles = [], isLoading } = useRoles();

  const rolesList = Array.isArray(roles) ? roles : [];
  
  const filteredRoles = selectedSector 
    ? rolesList.filter(role => role.sectorId === selectedSector)
    : [];

  const selectedRoleName = filteredRoles.find(
    role => role.id === selectedRole
  )?.name || "";

  return (
    <div className="space-y-2">
      <Label htmlFor="role">Função</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={!selectedSector || isLoading}
          >
            {selectedRoleName || (selectedSector ? "Selecione uma função" : "Primeiro selecione um setor")}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar função..." />
            <CommandEmpty>Nenhuma função encontrada.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                  <CommandItem
                    key={role.id}
                    value={role.name}
                    onSelect={() => {
                      onRoleChange(role.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedRole === role.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {role.name}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>
                  {selectedSector ? "Nenhuma função disponível" : "Selecione um setor primeiro"}
                </CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
