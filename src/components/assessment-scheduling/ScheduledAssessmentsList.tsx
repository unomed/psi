
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { generateAssessmentLink, sendAssessmentEmail } from "@/services/assessment/links";
import { createDefaultEmailTemplates } from "@/services/emailTemplates/createDefaultTemplates";
import { EditScheduledAssessmentDialog } from "./EditScheduledAssessmentDialog";
import { AssessmentListHeader } from "./AssessmentListHeader";
import { AssessmentFilters } from "./AssessmentFilters";
import { AssessmentItemsList } from "./AssessmentItemsList";
import { useScheduledAssessments } from "@/hooks/checklist/useScheduledAssessments";
import { toast } from "sonner";

export function ScheduledAssessmentsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [generatingLink, setGeneratingLink] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [editingAssessment, setEditingAssessment] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { userRole, userCompanies } = useAuth();

  // Usar o hook correto com exclusão em cascata
  const { 
    scheduledAssessments: assessments, 
    isLoading, 
    refetch, 
    handleDeleteAssessment 
  } = useScheduledAssessments({
    companyId: userRole === 'superadmin' ? null : userCompanies?.[0]?.companyId || null
  });

  const filteredAssessments = assessments?.filter(assessment => {
    const employeeName = assessment.employees?.name || assessment.employee_name || '';
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
    if (!assessment.employeeId || !assessment.templateId) {
      toast.error("Dados incompletos para gerar o link");
      return;
    }

    try {
      setGeneratingLink(assessment.id);
      console.log("Gerando link para avaliação:", {
        employeeId: assessment.employeeId,
        templateId: assessment.templateId,
        assessmentId: assessment.id
      });
      
      const link = await generateAssessmentLink(
        assessment.employeeId,
        assessment.templateId
      );
      
      if (link) {
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

  // Wrapper para garantir que retorna Promise<void>
  const handleDeleteAssessmentWrapper = async (assessmentId: string): Promise<void> => {
    await handleDeleteAssessment(assessmentId);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <Card className="w-full">
          <CardContent className="py-8">
            <div className="text-center">Carregando agendamentos...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Card className="w-full">
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
            onDeleteAssessment={handleDeleteAssessmentWrapper}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
        </CardContent>
      </Card>

      <EditScheduledAssessmentDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        assessment={editingAssessment}
      />
    </div>
  );
}
