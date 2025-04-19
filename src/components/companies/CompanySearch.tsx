
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CompanySearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function CompanySearch({ search, onSearchChange }: CompanySearchProps) {
  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar empresas por nome, CNPJ, cidade..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
}
