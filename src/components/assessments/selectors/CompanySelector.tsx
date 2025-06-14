
import React from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeSelect } from "@/components/ui/SafeSelect";
import type { Company } from "@/types/company";

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
      <SafeSelect
        data={companiesForUser}
        value={selectedCompany}
        onChange={onCompanyChange}
        placeholder="Selecione uma empresa"
        valueField="id"
        labelField="name"
        className="w-full"
      />
    </div>
  );
}
