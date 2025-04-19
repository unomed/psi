
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmployeeSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function EmployeeSearch({ search, onSearchChange }: EmployeeSearchProps) {
  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Label htmlFor="search">Buscar funcionário</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Buscar por nome do funcionário..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );
}
