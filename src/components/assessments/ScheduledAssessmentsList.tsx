
import { useState } from "react";
import { ScheduledAssessment } from "@/types";
import { generateAssessmentLink, deleteAssessment, sendAssessmentEmail } from "@/services/assessment/links";
import { toast } from "sonner";
import { AssessmentListTable } from "./list/AssessmentListTable";
import { ShareAssessmentDialog } from "./list/ShareAssessmentDialog";

interface ScheduledAssessmentsListProps {
  assessments: ScheduledAssessment[];
  type: "scheduled" | "completed";
  onShareAssessment?: (assessmentId: string) => Promise<void>;
}

export function ScheduledAssessmentsList({ 
  assessments, 
  type,
  onShareAssessment 
}: ScheduledAssessmentsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<ScheduledAssessment | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState<{[key: string]: boolean}>({});

  const handleShareClick = async (assessment: ScheduledAssessment) => {
    setSelectedAssessment(assessment);
    if (assessment.linkUrl) {
      // If link already exists, use it
      setGeneratedLink(assessment.linkUrl);
      setIsDialogOpen(true);
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirmShare = async () => {
    if (!selectedAssessment || !selectedAssessment.employeeId || !selectedAssessment.templateId) {
      toast.error("Dados incompletos para gerar o link");
      return;
    }
    
    try {
      setIsGenerating(true);
      console.log("Gerando link para avaliação:", {
        employeeId: selectedAssessment.employeeId,
        templateId: selectedAssessment.templateId,
        assessmentId: selectedAssessment.id
      });
      
      const link = await generateAssessmentLink(
        selectedAssessment.employeeId,
        selectedAssessment.templateId
      );
      
      if (link) {
        console.log("Link gerado com sucesso:", link);
        setGeneratedLink(link);
        
        if (onShareAssessment) {
          await onShareAssessment(selectedAssessment.id);
        }
        
        toast.success("Link gerado com sucesso!");
      } else {
        toast.error("Falha ao gerar o link");
      }
    } catch (error) {
      console.error("Erro detalhado ao gerar link de avaliação:", error);
      toast.error("Erro ao gerar link de avaliação. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    try {
      setIsProcessing(prev => ({ ...prev, [assessmentId]: true }));
      await deleteAssessment(assessmentId);
      // Refresh the list after deletion - you might want to implement a more elegant way
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting assessment:", error);
    } finally {
      setIsProcessing(prev => ({ ...prev, [assessmentId]: false }));
    }
  };

  const handleSendEmail = async (assessmentId: string) => {
    try {
      setIsProcessing(prev => ({ ...prev, [assessmentId]: true }));
      await sendAssessmentEmail(assessmentId);
      // Refresh the list after sending email
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsProcessing(prev => ({ ...prev, [assessmentId]: false }));
    }
  };

  return (
    <>
      <AssessmentListTable
        assessments={assessments}
        type={type}
        onShareClick={handleShareClick}
        onShareAssessment={onShareAssessment}
        onDeleteAssessment={handleDeleteAssessment}
        onSendEmail={handleSendEmail}
        isProcessing={isProcessing}
      />

      <ShareAssessmentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        assessment={selectedAssessment}
        generatedLink={generatedLink}
        isGenerating={isGenerating}
        onConfirmShare={handleConfirmShare}
      />
    </>
  );
}
