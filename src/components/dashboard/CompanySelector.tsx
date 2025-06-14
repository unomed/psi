
import { SafeSelect } from "@/components/ui/SafeSelect"; // Import SafeSelect
import { useCompanyFilter } from "@/hooks/useCompanyFilter";
import { Building2 } from "lucide-react";
import { SelectItem } from "@/components/ui/select"; // Keep for "Todas as empresas"

interface CompanyFilterItem { // Define a type for availableCompanies items
  companyId: string;
  companyName: string;
}

export function CompanySelector() {
  const {
    selectedCompanyId,
    setSelectedCompanyId,
    availableCompanies, // Assuming this is CompanyFilterItem[]
    canAccessAllCompanies
  } = useCompanyFilter();

  if (!availableCompanies || availableCompanies.length === 0) {
    console.log("[CompanySelector] No available companies, returning null.");
    return null;
  }

  if (availableCompanies.length === 1 && !canAccessAllCompanies()) {
    console.log("[CompanySelector] Only one company and no access to all, returning null.");
    return null;
  }
  
  // Data for SafeSelect - it will handle internal validation
  const selectData = availableCompanies.map(c => ({ id: c.companyId, name: c.companyName }));

  console.log("[CompanySelector] Rendering. SelectedID:", selectedCompanyId, "Available companies for select:", selectData.length);

  return (
    <div className="flex items-center gap-2 mb-4">
      <Building2 className="h-4 w-4" />
      {/* 
        SafeSelect doesn't directly support adding a static "All Companies" option *inside* its dynamic list.
        We need to handle this by either:
        1. Modifying SafeSelect to accept a prepend/append static option (more complex).
        2. Using the original Select for this specific case if the static option is crucial and data is well-controlled.
        3. Forcing a specific value like "all-companies" and handling it in `useCompanyFilter`.

        Given the error, let's ensure the dynamic part is safe first. 
        If "all-companies" is a distinct value handled by `setSelectedCompanyId`,
        we can use the original Select and ensure items are filtered.
      */}
      <Select value={selectedCompanyId || "all-companies"} onValueChange={setSelectedCompanyId}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {canAccessAllCompanies() && (
            <SelectItem value="all-companies">Todas as empresas</SelectItem>
          )}
          {(selectData || [])
            .filter(company => company && company.id && String(company.id).trim() !== "" && company.name && String(company.name).trim() !== "")
            .map((company) => {
              const companyIdStr = String(company.id);
              // This console.error was in your original code, if an item makes it past filter, it's an issue.
              if (companyIdStr.trim() === "") {
                console.error("[CompanySelector] CRITICAL: Filter failed. Attempting to render SelectItem with empty value. Company:", company);
                return null; 
              }
              return (
                <SelectItem key={companyIdStr} value={companyIdStr}>
                  {company.name}
                </SelectItem>
              );
            }).filter(Boolean)}
        </SelectContent>
      </Select>
    </div>
  );
}
