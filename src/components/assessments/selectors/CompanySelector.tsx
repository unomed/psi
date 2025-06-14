
import React from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeSelect } from "@/components/ui/SafeSelect"; // Import SafeSelect
import type { Company } from "@/types/company"; // Assuming Company type exists

interface CompanySelectorProps {
  selectedCompany: string | null;
  onCompanyChange: (companyId: string) => void;
}

export function CompanySelector({
  selectedCompany,
  onCompanyChange,
}: CompanySelectorProps) {
  const { userRole, userCompanies: authUserCompanies } = useAuth();
  const { companies: allCompanies, isLoading } = useCompanies();

  const companiesForUser = userRole === 'superadmin'
    ? allCompanies
    : (allCompanies || []).filter(company =>
        (authUserCompanies || []).some(userCompany => userCompany.companyId === company.id)
      );

  // The SafeSelect component will handle internal filtering for valid ID and name.
  // We just need to pass the potentially raw data.

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Empresa</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="company">Empresa</Label>
      <SafeSelect<Company> // Specify the type for SafeSelect
        data={companiesForUser}
        value={selectedCompany}
        onChange={onCompanyChange}
        placeholder="Selecione uma empresa"
        valueField="id" // Default, but explicit
        labelField="name" // Default, but explicit
        className="w-full" // Added for consistent styling if needed
      />
    </div>
  );
}
