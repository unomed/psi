
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Mail, Trash2, Link, Copy, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { generateAssessmentLink, sendAssessmentEmail } from "@/services/assessment/links";
import { createDefaultEmailTemplates } from "@/services/emailTemplates/createDefaultTemplates";

export function ScheduledAssessmentsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteAssessmentId, setDeleteAssessmentId] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  
  const { userRole, userCompanies } = useAuth();

  const { data: assessments, isLoading, refetch } = useQuery({
    queryKey: ['scheduledAssessments', userCompanies],
    queryFn: async () => {
      let query = supabase
        .from('scheduled_assessments')
        .select(`
          *,
          checklist_templates(title, type)
        `);

      // Se não for superadmin, filtrar apenas empresas do usuário
      if (userRole !== 'superadmin' && userCompanies.length > 0) {
        const companyIds = userCompanies.map(uc => uc.companyId);
        query = query.in('company_id', companyIds);
      }

      const { data, error } = await query.order('scheduled_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const filteredAssessments = assessments?.filter(assessment => {
    const employeeName = assessment.employee_name || '';
    const matchesSearch = searchTerm === "" || 
      employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const handleGenerateLink = async (assessment: any) => {
    if (!assessment.employee_id || !assessment.template_id) {
      toast.error("Dados incompletos para gerar o link");
      return;
    }

    try {
      setGeneratingLink(assessment.id);
      console.log("Gerando link para avaliação:", {
        employeeId: assessment.employee_id,
        templateId: assessment.template_id,
        assessmentId: assessment.id
      });
      
      const link = await generateAssessmentLink(
        assessment.employee_id,
        assessment.template_id
      );
      
      if (link) {
        // Atualizar o agendamento com o link gerado
        const { error: updateError } = await supabase
          .from('scheduled_assessments')
          .update({ 
            link_url: link,
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', assessment.id);

        if (updateError) {
          console.error("Erro ao atualizar agendamento:", updateError);
          toast.error("Erro ao salvar o link gerado");
          return;
        }

        // Copiar link para clipboard
        await navigator.clipboard.writeText(link);
        toast.success("Link gerado e copiado para a área de transferência!");
        refetch();
      } else {
        toast.error("Falha ao gerar o link");
      }
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      toast.error("Erro ao gerar link. Tente novamente.");
    } finally {
      setGeneratingLink(null);
    }
  };

  const handleCopyLink = async (linkUrl: string) => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  const handleSendEmail = async (assessmentId: string) => {
    try {
      setSendingEmail(assessmentId);
      console.log("Enviando email para avaliação:", assessmentId);
      
      await sendAssessmentEmail(assessmentId);
      refetch();
      
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast.error("Erro ao enviar email. Verifique as configurações de email.");
    } finally {
      setSendingEmail(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAssessmentId) return;

    try {
      const { error } = await supabase
        .from('scheduled_assessments')
        .delete()
        .eq('id', deleteAssessmentId);

      if (error) throw error;
      
      toast.success("Agendamento excluído com sucesso!");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      toast.error("Erro ao excluir agendamento");
    } finally {
      setDeleteAssessmentId(null);
    }
  };

  const handleSetupEmailTemplates = async () => {
    try {
      await createDefaultEmailTemplates();
    } catch (error) {
      console.error("Erro ao configurar templates:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando agendamentos...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Avaliações Agendadas</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSetupEmailTemplates}
              title="Configurar templates de email padrão"
            >
              <Settings className="h-4 w-4 mr-1" />
              Configurar Templates
            </Button>
          </div>
          
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
              {userCompanies.length === 0 ? 
                "Você não tem acesso a nenhuma empresa" :
                "Nenhuma avaliação encontrada"
              }
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssessments?.map(assessment => {
                const employeeName = assessment.employee_name || 'Nome não disponível';
                
                return (
                  <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{employeeName}</h4>
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
                      {/* Botão para enviar email */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendEmail(assessment.id)}
                        disabled={sendingEmail === assessment.id || assessment.status === 'completed'}
                        title="Enviar email com link de avaliação"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        {sendingEmail === assessment.id ? 'Enviando...' : 'Enviar Email'}
                      </Button>

                      {/* Botão único para gerar/copiar link */}
                      {assessment.link_url ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyLink(assessment.link_url)}
                          title="Copiar link da avaliação"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copiar Link
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateLink(assessment)}
                          disabled={generatingLink === assessment.id || assessment.status === 'completed'}
                          title="Gerar link da avaliação"
                        >
                          <Link className="h-4 w-4 mr-1" />
                          {generatingLink === assessment.id ? 'Gerando...' : 'Gerar Link'}
                        </Button>
                      )}

                      {/* Botão de excluir */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteAssessmentId(assessment.id)}
                        disabled={assessment.status === 'completed'}
                        title="Excluir agendamento"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={!!deleteAssessmentId} onOpenChange={() => setDeleteAssessmentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
