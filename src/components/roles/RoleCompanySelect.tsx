
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeSelect } from "@/components/ui/SafeSelect";
import type { CompanyData } from "@/components/companies/CompanyCard";

interface SectorForRoleSelect {
  id: string;
  name: string;
  companyId: string;
}

interface RoleCompanySelectProps {
  companies: CompanyData[];
  selectedCompany: string | null;
  selectedSector: string | null;
  sectors: SectorForRoleSelect[];
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
    ? (sectors || []).filter(sector => sector.companyId === selectedCompany)
    : []; 

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="space-y-4 w-full md:w-auto md:space-y-0 md:space-x-4 md:flex md:items-center">
        <div className="w-full md:w-64">
          <SafeSelect
            data={companies}
            value={selectedCompany}
            onChange={onCompanyChange}
            placeholder="Selecione uma empresa"
            valueField="id"
            labelField="name"
          />
        </div>

        {selectedCompany && (
          <div className="w-full md:w-64">
            <SafeSelect
              data={filteredSectors}
              value={selectedSector}
              onChange={onSectorChange}
              placeholder="Selecione um setor"
              valueField="id"
              labelField="name"
              disabled={filteredSectors.length === 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}
