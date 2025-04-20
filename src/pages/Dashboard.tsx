
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardCompanySelector } from "@/components/dashboard/DashboardCompanySelector";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentAssessments } from "@/components/dashboard/RecentAssessments";

export default function Dashboard() {
  const { userCompanies } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userCompanies && userCompanies.length > 0 && !selectedCompany) {
      setSelectedCompany(userCompanies[0].companyId);
      setLoading(false);
    }
  }, [userCompanies, selectedCompany]);

  const currentCompanyName = userCompanies?.find(c => c.companyId === selectedCompany)?.companyName || "sua empresa";

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Carregando dados do dashboard...
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-12 w-28 mb-2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do monitoramento de riscos psicossociais em {currentCompanyName}.
        </p>
      </div>

      <DashboardCompanySelector
        userCompanies={userCompanies || []}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
      />

      <DashboardMetrics companyId={selectedCompany} />
      <DashboardCharts companyId={selectedCompany} />
      <RecentAssessments companyId={selectedCompany} />
    </div>
  );
}
