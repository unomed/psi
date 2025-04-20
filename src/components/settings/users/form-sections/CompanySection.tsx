
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

interface CompanySectionProps {
  companies: { id: string; name: string }[];
  selectedCompanies: string[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggleCompany: (companyId: string) => void;
}

export function CompanySection({
  companies,
  selectedCompanies,
  searchQuery,
  onSearchChange,
  onToggleCompany
}: CompanySectionProps) {
  return (
    <div className="space-y-2">
      <FormLabel>Empresas</FormLabel>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar empresas..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 mb-2"
        />
      </div>
      <div className="border rounded-md p-3 space-y-2 max-h-60 overflow-y-auto">
        {companies.length > 0 ? (
          companies.map((company) => (
            <div key={company.id} className="flex items-center space-x-2">
              <Checkbox
                id={`company-${company.id}`}
                checked={selectedCompanies.includes(company.id)}
                onCheckedChange={() => onToggleCompany(company.id)}
              />
              <label
                htmlFor={`company-${company.id}`}
                className="text-sm cursor-pointer"
              >
                {company.name}
              </label>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            {searchQuery ? "Nenhuma empresa encontrada" : "Nenhuma empresa disponível"}
          </p>
        )}
      </div>
    </div>
  );
}
