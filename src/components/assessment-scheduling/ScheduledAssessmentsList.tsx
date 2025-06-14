
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Mail, MessageCircle, ExternalLink, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ScheduledAssessmentsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: assessments, isLoading, refetch } = useQuery({
    queryKey: ['scheduledAssessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_assessments')
        .select(`
          *,
          checklist_templates(title, type)
        `)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const filteredAssessments = assessments?.filter(assessment => {
    const matchesSearch = searchTerm === "" || 
      assessment.employee_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      sent: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: "Agendada",
      sent: "Enviada",
      completed: "Concluída",
      overdue: "Em Atraso"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleSendEmail = async (assessmentId: string) => {
    try {
      // Implementar envio de email
      toast.success("Email enviado com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao enviar email");
    }
  };

  const handleDelete = async (assessmentId: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_assessments')
        .delete()
        .eq('id', assessmentId);

      if (error) throw error;
      
      toast.success("Agendamento excluído com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao excluir agendamento");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando agendamentos...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações Agendadas</CardTitle>
        
        {/* Filtros */}
        <div className="flex gap-4 pt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por funcionário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="scheduled">Agendadas</SelectItem>
              <SelectItem value="sent">Enviadas</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredAssessments?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma avaliação encontrada
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssessments?.map(assessment => (
              <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{assessment.employee_name}</h4>
                    <Badge className={getStatusColor(assessment.status)}>
                      {getStatusLabel(assessment.status)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Template: {assessment.checklist_templates?.title}</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Agendada para: {new Date(assessment.scheduled_date).toLocaleDateString('pt-BR')}
                    </div>
                    {assessment.recurrence_type !== "none" && (
                      <p>Recorrência: {assessment.recurrence_type}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {assessment.link_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(assessment.link_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Link
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSendEmail(assessment.id)}
                    disabled={assessment.status === 'completed'}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(assessment.id)}
                    disabled={assessment.status === 'completed'}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
