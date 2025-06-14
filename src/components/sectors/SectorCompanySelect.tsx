
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeSelect } from "@/components/ui/SafeSelect";
import type { CompanyData } from "@/components/companies/CompanyCard";

interface SectorDataForSelect {
    id: string;
    name: string;
    companyId: string;
}

interface SectorCompanySelectProps {
  companies: CompanyData[];
  selectedCompany: string | null;
  onCompanyChange: (value: string) => void;
}

export function SectorCompanySelect({ companies, selectedCompany, onCompanyChange }: SectorCompanySelectProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-72">
        <SafeSelect
          data={companies}
          value={selectedCompany}
          onChange={onCompanyChange}
          placeholder="Selecione uma empresa"
          valueField="id"
          labelField="name"
          className="w-full"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Selecione uma empresa para visualizar e gerenciar seus setores
      </p>
    </div>
  );
}
