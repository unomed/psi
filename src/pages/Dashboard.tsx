
import { useSystemInitialization } from "@/hooks/useSystemInitialization";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useChecklistData } from "@/hooks/useChecklistData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { DashboardSystemStatus } from "@/components/dashboard/DashboardSystemStatus";
import { DashboardNextSteps } from "@/components/dashboard/DashboardNextSteps";
import { DashboardRecentAssessments } from "@/components/dashboard/DashboardRecentAssessments";

export default function Dashboard() {
  const { user, hasRole } = useAuth();
  const { isInitializing } = useSystemInitialization();
  const { checklists, results, scheduledAssessments, isLoading } = useChecklistData();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <span className="ml-2">Inicializando sistema...</span>
      </div>
    );
  }

  // Calcular métricas
  const totalEmployees = 0; // TODO: Implementar contagem de funcionários
  const totalTemplates = checklists?.length || 0;
  const pendingAssessments = scheduledAssessments?.filter(a => a.status === 'scheduled')?.length || 0;
  const completedAssessments = results?.length || 0;
  const criticalRisks = results?.filter(r => {
    const score = typeof r.results === 'object' && 'score' in r.results ? r.results.score : 0;
    return score > 80;
  })?.length || 0;

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Dashboard"
        description="Visão geral do sistema de avaliação psicossocial"
      />

      <DashboardMetrics companyId={null} />

      <DashboardQuickActions />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardSystemStatus 
          totalTemplates={totalTemplates}
          totalEmployees={totalEmployees}
          completedAssessments={completedAssessments}
        />
        
        <DashboardNextSteps 
          totalEmployees={totalEmployees}
          pendingAssessments={pendingAssessments}
        />
      </div>

      <DashboardRecentAssessments 
        results={results}
        completedAssessments={completedAssessments}
        criticalRisks={criticalRisks}
      />
    </div>
  );
}
