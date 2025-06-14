
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
  const filteredSectors = selectedCompany 
    ? sectors.filter(sector => sector.companyId === selectedCompany)
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
              {companies.map((company) => {
                const companyId = company.id || `company-fallback-${Date.now()}-${Math.random()}`;
                if (!companyId || companyId.trim() === '') {
                  console.error('Empty company ID detected in RoleCompanySelect:', company);
                  return null;
                }
                return (
                  <SelectItem key={companyId} value={companyId}>
                    {company.name || 'Empresa sem nome'}
                  </SelectItem>
                );
              }).filter(Boolean)}
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
                {filteredSectors.map((sector) => {
                  const sectorId = sector.id || `sector-fallback-${Date.now()}-${Math.random()}`;
                  if (!sectorId || sectorId.trim() === '') {
                    console.error('Empty sector ID detected in RoleCompanySelect:', sector);
                    return null;
                  }
                  return (
                    <SelectItem key={sectorId} value={sectorId}>
                      {sector.name || 'Setor sem nome'}
                    </SelectItem>
                  );
                }).filter(Boolean)}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
