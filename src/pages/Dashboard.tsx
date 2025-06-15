
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetricsReal } from "@/components/dashboard/DashboardMetricsReal";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { RecentAssessmentsReal } from "@/components/dashboard/RecentAssessmentsReal";
import { CompanySelectorReal } from "@/components/dashboard/CompanySelectorReal";

export default function Dashboard() {
  const { userRole, userCompanies } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(() => {
    // Auto-select first company for non-superadmin users
    if (userRole !== 'superadmin' && userCompanies.length > 0) {
      return userCompanies[0].companyId;
    }
    return null;
  });

  const handleCompanyChange = (companyId: string) => {
    // Convert empty string back to null for "all companies"
    setSelectedCompanyId(companyId || null);
  };

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Dashboard"
        description="Visão geral do sistema de avaliação psicossocial"
      />

      <CompanySelectorReal
        selectedCompanyId={selectedCompanyId}
        onCompanyChange={handleCompanyChange}
      />

      <DashboardMetricsReal companyId={selectedCompanyId} />

      <DashboardQuickActions />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <RecentAssessmentsReal companyId={selectedCompanyId} />
      </div>
    </div>
  );
}
