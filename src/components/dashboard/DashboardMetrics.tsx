
import { useState, useEffect } from "react";
import { AlertTriangle, Calendar, CheckCircle2, ClipboardList } from "lucide-react";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DashboardMetricsProps {
  companyId: string | null;
}

export function DashboardMetrics({ companyId }: DashboardMetricsProps) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    pendingAssessments: 0,
    completedAssessments: 0,
    highRiskEmployees: 0,
    upcomingReassessments: 0,
  });

  useEffect(() => {
    if (!companyId) return;

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        console.log("Fetching dashboard metrics for company:", companyId);

        // Query for pending assessments
        const { data: pendingData, error: pendingError } = await supabase
          .from('scheduled_assessments')
          .select('count')
          .eq('status', 'pending')
          .eq('company_id', companyId);

        if (pendingError) throw pendingError;

        // Query for completed assessments
        const { data: completedData, error: completedError } = await supabase
          .from('scheduled_assessments')
          .select('count')
          .eq('status', 'completed')
          .eq('company_id', companyId);

        if (completedError) throw completedError;

        // Get employees for this company
        const { data: employees, error: empError } = await supabase
          .from('employees')
          .select('id')
          .eq('company_id', companyId);

        if (empError) throw empError;
        
        let highRiskCount = 0;
        
        if (employees && employees.length > 0) {
          const employeeIds = employees.map(emp => emp.id);
          
          // Query for high risk employees
          const { data: highRiskData, error: highRiskError } = await supabase
            .from('assessment_responses')
            .select('id')
            .in('employee_id', employeeIds)
            .eq('classification', 'severe')
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
          .eq('company_id', companyId)
          .lt('scheduled_date', nextMonth.toISOString())
          .gt('scheduled_date', new Date().toISOString());

        if (upcomingError) throw upcomingError;

        setMetrics({
          pendingAssessments: pendingData?.[0]?.count || 0,
          completedAssessments: completedData?.[0]?.count || 0,
          highRiskEmployees: highRiskCount,
          upcomingReassessments: upcomingData?.[0]?.count || 0,
        });

      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        toast.error("Não foi possível carregar métricas do dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [companyId]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardMetricCard
        title="Avaliações Pendentes"
        value={metrics.pendingAssessments}
        description="Aguardando conclusão"
        icon={ClipboardList}
        className="bg-amber-50"
      />
      <DashboardMetricCard
        title="Avaliações Concluídas"
        value={metrics.completedAssessments}
        description="Total"
        icon={CheckCircle2}
        change={{ value: "12%", trend: "up" }}
        className="bg-green-50"
      />
      <DashboardMetricCard
        title="Funcionários em Risco Alto"
        value={metrics.highRiskEmployees}
        description="Necessitam atenção"
        icon={AlertTriangle}
        change={{ value: "3%", trend: "down" }}
        className="bg-red-50"
      />
      <DashboardMetricCard
        title="Próximas Reavaliações"
        value={metrics.upcomingReassessments}
        description="Nos próximos 30 dias"
        icon={Calendar}
        className="bg-blue-50"
      />
    </div>
  );
}
