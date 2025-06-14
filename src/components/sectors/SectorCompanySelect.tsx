
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CompanyData } from "@/components/companies/CompanyCard";

interface SectorCompanySelectProps {
  companies: CompanyData[];
  selectedCompany: string | null;
  onCompanyChange: (value: string) => void;
}

export function SectorCompanySelect({ companies, selectedCompany, onCompanyChange }: SectorCompanySelectProps) {
  const validCompanies = (companies || []).filter(company => 
    company && 
    company.id !== null &&
    company.id !== undefined &&
    String(company.id).trim() !== "" &&
    company.name && 
    String(company.name).trim() !== ""
  );

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-72">
        <Select onValueChange={onCompanyChange} value={selectedCompany || "no-company-selected"}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma empresa" />
          </SelectTrigger>
          <SelectContent>
            {validCompanies.length > 0 ? (
              validCompanies.map((company) => (
                <SelectItem key={String(company.id)} value={String(company.id)}>
                  {company.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-companies-available" disabled>
                Nenhuma empresa disponível
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-muted-foreground">
        Selecione uma empresa para visualizar e gerenciar seus setores
      </p>
    </div>
  );
}
