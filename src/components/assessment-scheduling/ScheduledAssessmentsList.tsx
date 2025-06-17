
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { EditScheduledAssessmentDialog } from "./EditScheduledAssessmentDialog";
import { AssessmentListHeader } from "./AssessmentListHeader";
import { AssessmentFilters } from "./AssessmentFilters";
import { AssessmentItemsList } from "./AssessmentItemsList";

export function ScheduledAssessmentsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteAssessmentId, setDeleteAssessmentId] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [editingAssessment, setEditingAssessment] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { userRole, userCompanies } = useAuth();

  const { data: assessments, isLoading, refetch, error } = useQuery({
    queryKey: ['scheduledAssessments', userCompanies],
    queryFn: async () => {
      try {
        let query = supabase
          .from('scheduled_assessments')
          .select(`
            *,
            checklist_templates(title, type)
          `);

        // Se não for superadmin, filtrar apenas empresas do usuário
        if (userRole !== 'superadmin' && userCompanies?.length > 0) {
          const companyIds = userCompanies.map(uc => uc.companyId).filter(Boolean);
          if (companyIds.length > 0) {
            query = query.in('company_id', companyIds);
          }
        }

        const { data, error } = await query.order('scheduled_date', { ascending: false });

        if (error) {
          console.error("Erro ao buscar agendamentos:", error);
          throw error;
        }

        // Filtrar registros com dados válidos
        return (data || []).filter(assessment => {
          // Validar dados obrigatórios
          return assessment.id && 
                 assessment.employee_id && 
                 assessment.template_id && 
                 assessment.scheduled_date &&
                 assessment.employee_name; // Validar se tem nome do funcionário
        });
      } catch (error) {
        console.error("Erro na query de agendamentos:", error);
        toast.error("Erro ao carregar agendamentos");
        return [];
      }
    },
    retry: 3,
    retryDelay: 1000
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

  const handleEditAssessment = (assessment: any) => {
    setEditingAssessment(assessment);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingAssessment(null);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-red-600">
            <p>Erro ao carregar agendamentos.</p>
            <Button onClick={() => refetch()} className="mt-2">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Carregando agendamentos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <AssessmentListHeader onSetupEmailTemplates={handleSetupEmailTemplates} />
          <AssessmentFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </CardHeader>
        
        <CardContent>
          <AssessmentItemsList
            filteredAssessments={filteredAssessments || []}
            userCompanies={userCompanies || []}
            generatingLink={generatingLink}
            sendingEmail={sendingEmail}
            onGenerateLink={handleGenerateLink}
            onCopyLink={handleCopyLink}
            onSendEmail={handleSendEmail}
            onEditAssessment={handleEditAssessment}
            onDeleteAssessment={(id) => setDeleteAssessmentId(id)}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
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

      {/* Add edit dialog */}
      <EditScheduledAssessmentDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        assessment={editingAssessment}
      />
    </>
  );
}
