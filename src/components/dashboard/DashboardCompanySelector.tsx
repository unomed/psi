
interface DashboardCompanySelectorProps {
  userCompanies: { companyId: string; companyName: string; }[];
  selectedCompany: string | null;
  onCompanyChange: (companyId: string) => void;
}

export function DashboardCompanySelector({ 
  userCompanies, 
  selectedCompany, 
  onCompanyChange 
}: DashboardCompanySelectorProps) {
  if (!userCompanies || userCompanies.length <= 1) return null;
  
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Selecionar empresa:</label>
      <select
        className="border rounded p-2 w-full max-w-md"
        value={selectedCompany || ""}
        onChange={(e) => onCompanyChange(e.target.value)}
      >
        {userCompanies.map((company) => (
          <option key={company.companyId} value={company.companyId}>
            {company.companyName}
          </option>
        ))}
      </select>
    </div>
  );
}
