
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
              validCompanies.map((company) => {
                const companyIdStr = String(company.id);
                if (companyIdStr.trim() === "") {
                  console.error("[Sectors/SectorCompanySelect] Attempting to render SelectItem with empty value for company:", company);
                  return null;
                }
                return (
                  <SelectItem key={companyIdStr} value={companyIdStr}>
                    {company.name}
                  </SelectItem>
                );
              }).filter(Boolean)
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

