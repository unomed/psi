
import { useState } from "react";
import { ScheduledAssessment } from "@/types";
import { generateAssessmentLink } from "@/services/assessment/links";
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

  const handleShareClick = async (assessment: ScheduledAssessment) => {
    setSelectedAssessment(assessment);
    if (assessment.linkUrl) {
      // Se já existe um link, use-o
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
        templateId: selectedAssessment.templateId
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

  return (
    <>
      <AssessmentListTable
        assessments={assessments}
        type={type}
        onShareClick={handleShareClick}
        onShareAssessment={onShareAssessment}
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
