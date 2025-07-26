
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ClipboardCheck, Calendar, Award } from "lucide-react";
import { useEmployeeAssessments } from "@/hooks/useEmployeeAssessments";
import { supabase } from "@/integrations/supabase/client";

interface QuestionnaireStatsCardProps {
  employeeId: string;
}

export function QuestionnaireStatsCard({ employeeId }: QuestionnaireStatsCardProps) {
  const { assessments, loading } = useEmployeeAssessments(employeeId);
  const [completedStats, setCompletedStats] = useState({ total: 0, thisMonth: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Buscar estatísticas reais de avaliações concluídas
  useEffect(() => {
    const fetchCompletedStats = async () => {
      if (!employeeId) return;
      
      try {
        setStatsLoading(true);
        
        // Buscar avaliações concluídas
        const { data: completedData, error } = await supabase
          .from('assessment_responses')
          .select('completed_at')
          .eq('employee_id', employeeId)
          .not('completed_at', 'is', null);

        if (error) {
          console.error('[QuestionnaireStatsCard] Erro ao buscar estatísticas:', error);
          return;
        }

        const currentMonth = new Date();
        const thisMonth = completedData?.filter(response => {
          const completedDate = new Date(response.completed_at);
          return completedDate.getMonth() === currentMonth.getMonth() &&
                 completedDate.getFullYear() === currentMonth.getFullYear();
        }).length || 0;

        setCompletedStats({
          total: completedData?.length || 0,
          thisMonth
        });
      } catch (error) {
        console.error('[QuestionnaireStatsCard] Erro ao buscar estatísticas:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchCompletedStats();
  }, [employeeId]);

  if (loading || statsLoading) {
    return (
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Suas Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
          Suas Estatísticas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <ClipboardCheck className="h-4 w-4 text-blue-600 mr-1" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{completedStats.total}</div>
            <div className="text-xs text-gray-600">Total Concluídas</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-green-600 mr-1" />
            </div>
            <div className="text-2xl font-bold text-green-600">{completedStats.thisMonth}</div>
            <div className="text-xs text-gray-600">Este Mês</div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Avaliações pendentes:</span>
            <Badge variant="outline" className="text-xs">
              {assessments.length}
            </Badge>
          </div>
        </div>

        {completedStats.total >= 5 && (
          <div className="flex items-center justify-center p-2 bg-amber-50 rounded-lg">
            <Award className="h-4 w-4 text-amber-600 mr-2" />
            <span className="text-sm text-amber-700 font-medium">
              Participação Excelente!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
