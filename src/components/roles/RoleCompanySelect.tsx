
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CompanyData } from "@/components/companies/CompanyCard";

interface RoleCompanySelectProps {
  companies: CompanyData[];
  selectedCompany: string | null;
  selectedSector: string | null;
  sectors: { id: string; name: string; companyId: string }[];
  onCompanyChange: (value: string) => void;
  onSectorChange: (value: string) => void;
}

export function RoleCompanySelect({ 
  companies, 
  selectedCompany, 
  selectedSector,
  sectors,
  onCompanyChange,
  onSectorChange 
}: RoleCompanySelectProps) {
  
  const validCompanies = (companies || []).filter(company =>
    company && company.id && String(company.id).trim() !== "" && company.name && String(company.name).trim() !== ""
  );

  const validSectors = (sectors || []).filter(sector =>
    sector && sector.id && String(sector.id).trim() !== "" && sector.name && String(sector.name).trim() !== ""
  );
  
  const filteredSectors = selectedCompany 
    ? validSectors.filter(sector => sector.companyId === selectedCompany)
    : [];

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="space-y-4 w-full md:w-auto md:space-y-0 md:space-x-4 md:flex md:items-center">
        <div className="w-full md:w-64">
          <Select 
            onValueChange={onCompanyChange} 
            value={selectedCompany || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma empresa" />
            </SelectTrigger>
            <SelectContent>
              {validCompanies.map((company) => (
                  <SelectItem key={String(company.id)} value={String(company.id)}>
                    {company.name}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedCompany && (
          <div className="w-full md:w-64">
            <Select 
              onValueChange={onSectorChange} 
              value={selectedSector || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um setor" />
              </SelectTrigger>
              <SelectContent>
                {filteredSectors.map((sector) => (
                    <SelectItem key={String(sector.id)} value={String(sector.id)}>
                      {sector.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
