
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CompanyData } from "@/components/companies/CompanyCard";

interface SectorCompanySelectProps {
  companies: CompanyData[];
  selectedCompany: string | null;
  onCompanyChange: (value: string) => void;
}

export function SectorCompanySelect({ companies, selectedCompany, onCompanyChange }: SectorCompanySelectProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-72">
        <Select onValueChange={onCompanyChange} value={selectedCompany || undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma empresa" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-muted-foreground">
        Selecione uma empresa para visualizar e gerenciar seus setores
      </p>
    </div>
  );
}
