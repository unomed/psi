
import { useState } from "react";
import { CompanySelector } from "@/components/assessments/selectors/CompanySelector";
import { SectorSelector } from "@/components/assessments/selectors/SectorSelector";
import { RoleSelector } from "@/components/assessments/selectors/RoleSelector";

interface EmployeeFiltersProps {
  onCompanyChange: (companyId: string | null) => void;
  onSectorChange: (sectorId: string | null) => void;
  onRoleChange: (roleId: string | null) => void;
}

export function EmployeeFilters({
  onCompanyChange,
  onSectorChange,
  onRoleChange,
}: EmployeeFiltersProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    setSelectedSector(null);
    onCompanyChange(companyId);
    onSectorChange(null);
    onRoleChange(null);
  };

  const handleSectorChange = (sectorId: string) => {
    setSelectedSector(sectorId);
    onSectorChange(sectorId);
    onRoleChange(null);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CompanySelector
          selectedCompany={selectedCompany}
          onCompanyChange={handleCompanyChange}
        />
        <SectorSelector
          selectedCompany={selectedCompany}
          selectedSector={selectedSector}
          onSectorChange={handleSectorChange}
        />
        <RoleSelector
          selectedSector={selectedSector}
          selectedRole={null}
          onRoleChange={onRoleChange}
        />
      </div>
    </div>
  );
}
