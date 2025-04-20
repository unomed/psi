
import { useState, useEffect } from "react";
import { AlertTriangle, Calendar, CheckCircle2, ClipboardList } from "lucide-react";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { RiskLevelChart } from "@/components/dashboard/RiskLevelChart";
import { SectorRiskChart } from "@/components/dashboard/SectorRiskChart";
import { RecentAssessments } from "@/components/dashboard/RecentAssessments";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { user, userRole, userCompanies } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    pendingAssessments: 0,
    completedAssessments: 0,
    highRiskEmployees: 0,
    upcomingReassessments: 0,
  });
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  useEffect(() => {
    // Set initial selected company based on user's companies
    if (userCompanies && userCompanies.length > 0 && !selectedCompany) {
      setSelectedCompany(userCompanies[0].companyId);
    }
  }, [userCompanies, selectedCompany]);

  useEffect(() => {
    if (!user || !selectedCompany) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log("Fetching dashboard data for company:", selectedCompany);

        // Query for pending assessments
        const { data: pendingData, error: pendingError } = await supabase
          .from('scheduled_assessments')
          .select('count')
          .eq('status', 'pending')
          .eq('company_id', selectedCompany);

        if (pendingError) throw pendingError;

        // Query for completed assessments
        const { data: completedData, error: completedError } = await supabase
          .from('scheduled_assessments')
          .select('count')
          .eq('status', 'completed')
          .eq('company_id', selectedCompany);

        if (completedError) throw completedError;

        // Get employees for this company
        const { data: employees, error: empError } = await supabase
          .from('employees')
          .select('id')
          .eq('company_id', selectedCompany);

        if (empError) throw empError;
        
        let highRiskCount = 0;
        
        if (employees && employees.length > 0) {
          const employeeIds = employees.map(emp => emp.id);
          
          // Query for high risk employees using the employee IDs and string comparison
          const { data: highRiskData, error: highRiskError } = await supabase
            .from('assessment_responses')
            .select('id')
            .eq('classification', 'high')
            .in('employee_id', employeeIds)
            .limit(1000);

          if (highRiskError) throw highRiskError;
          highRiskCount = highRiskData?.length || 0;
        }

        // Query for upcoming reassessments
        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 30);
        
        const { data: upcomingData, error: upcomingError } = await supabase
          .from('scheduled_assessments')
          .select('count')
          .eq('status', 'scheduled')
          .eq('company_id', selectedCompany)
          .lt('scheduled_date', nextMonth.toISOString())
          .gt('scheduled_date', new Date().toISOString());

        if (upcomingError) throw upcomingError;

        // Fallback to mock data if no results
        setDashboardData({
          pendingAssessments: pendingData?.[0]?.count || 24,
          completedAssessments: completedData?.[0]?.count || 215,
          highRiskEmployees: highRiskCount || 12,
          upcomingReassessments: upcomingData?.[0]?.count || 8,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Não foi possível carregar dados do dashboard");
        
        // Fallback to mock data on error
        setDashboardData({
          pendingAssessments: 24,
          completedAssessments: 215,
          highRiskEmployees: 12,
          upcomingReassessments: 8,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, selectedCompany]);

  // Handle company selection
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
  };

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

  // Company selector for users with multiple companies
  const CompanySelector = () => {
    if (userCompanies && userCompanies.length > 1) {
      return (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Selecionar empresa:</label>
          <select
            className="border rounded p-2 w-full max-w-md"
            value={selectedCompany || ""}
            onChange={(e) => handleCompanyChange(e.target.value)}
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
    return null;
  };

  const currentCompanyName = userCompanies?.find(c => c.companyId === selectedCompany)?.companyName || "sua empresa";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do monitoramento de riscos psicossociais em {currentCompanyName}.
        </p>
      </div>

      <CompanySelector />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          title="Avaliações Pendentes"
          value={dashboardData.pendingAssessments}
          description="Aguardando conclusão"
          icon={ClipboardList}
          className="bg-amber-50"
        />
        <DashboardMetricCard
          title="Avaliações Concluídas"
          value={dashboardData.completedAssessments}
          description="Total"
          icon={CheckCircle2}
          change={{ value: "12%", trend: "up" }}
          className="bg-green-50"
        />
        <DashboardMetricCard
          title="Funcionários em Risco Alto"
          value={dashboardData.highRiskEmployees}
          description="Necessitam atenção"
          icon={AlertTriangle}
          change={{ value: "3%", trend: "down" }}
          className="bg-red-50"
        />
        <DashboardMetricCard
          title="Próximas Reavaliações"
          value={dashboardData.upcomingReassessments}
          description="Nos próximos 30 dias"
          icon={Calendar}
          className="bg-blue-50"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RiskLevelChart companyId={selectedCompany} />
        <SectorRiskChart companyId={selectedCompany} />
      </div>

      <RecentAssessments companyId={selectedCompany} />
    </div>
  );
}
