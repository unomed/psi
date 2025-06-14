
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

  const baseValidSectors = (sectors || []).filter(sector =>
    sector && sector.id && String(sector.id).trim() !== "" && sector.name && String(sector.name).trim() !== ""
  );

  const filteredSectors = selectedCompany
    ? baseValidSectors.filter(sector => sector.companyId === selectedCompany)
    : []; // Show empty if no company selected, or all valid if that's the desired logic. Current logic: only company-specific.

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="space-y-4 w-full md:w-auto md:space-y-0 md:space-x-4 md:flex md:items-center">
        <div className="w-full md:w-64">
          <Select
            onValueChange={onCompanyChange}
            value={selectedCompany || "no-company-selected"} // Ensure placeholder value is not empty
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma empresa" />
            </SelectTrigger>
            <SelectContent>
              {validCompanies.map((company) => {
                const companyIdStr = String(company.id);
                if (companyIdStr.trim() === "") {
                  console.error("[Roles/RoleCompanySelect] Attempting to render Company SelectItem with empty value:", company);
                  return null;
                }
                return (
                  <SelectItem key={companyIdStr} value={companyIdStr}>
                    {company.name}
                  </SelectItem>
                );
              }).filter(Boolean)}
               {validCompanies.length === 0 && (
                <SelectItem value="no-companies-pls-select" disabled>Nenhuma empresa disponível</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedCompany && (
          <div className="w-full md:w-64">
            <Select
              onValueChange={onSectorChange}
              value={selectedSector || "no-sector-selected"} // Ensure placeholder value is not empty
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um setor" />
              </SelectTrigger>
              <SelectContent>
                {filteredSectors.map((sector) => {
                  const sectorIdStr = String(sector.id);
                  if (sectorIdStr.trim() === "") {
                    console.error("[Roles/RoleCompanySelect] Attempting to render Sector SelectItem with empty value:", sector);
                    return null;
                  }
                  return (
                    <SelectItem key={sectorIdStr} value={sectorIdStr}>
                      {sector.name}
                    </SelectItem>
                  );
                }).filter(Boolean)}
                {filteredSectors.length === 0 && (
                  <SelectItem value="no-sectors-pls-select" disabled>Nenhum setor disponível</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}

