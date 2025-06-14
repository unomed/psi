
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AssessmentMetrics() {
  const { data: metrics } = useQuery({
    queryKey: ['assessmentMetrics'],
    queryFn: async () => {
      const { data: scheduled } = await supabase
        .from('scheduled_assessments')
        .select('status, scheduled_date')
        .order('scheduled_date');

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const total = scheduled?.length || 0;
      const pending = scheduled?.filter(a => a.status === 'scheduled').length || 0;
      const completed = scheduled?.filter(a => a.status === 'completed').length || 0;
      const overdue = scheduled?.filter(a => 
        a.status === 'scheduled' && new Date(a.scheduled_date) < today
      ).length || 0;

      return { total, pending, completed, overdue };
    }
  });

  const cards = [
    {
      title: "Total de Agendamentos",
      value: metrics?.total || 0,
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Pendentes",
      value: metrics?.pending || 0,
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Concluídas",
      value: metrics?.completed || 0,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Em Atraso",
      value: metrics?.overdue || 0,
      icon: AlertCircle,
      color: "text-red-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
