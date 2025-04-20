
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
      setGeneratedLink(assessment.linkUrl);
    }
    setIsDialogOpen(true);
  };

  const handleConfirmShare = async () => {
    if (!selectedAssessment || !selectedAssessment.employeeId || !selectedAssessment.templateId) return;
    
    try {
      setIsGenerating(true);
      const link = await generateAssessmentLink(
        selectedAssessment.employeeId,
        selectedAssessment.templateId
      );
      
      if (link) {
        setGeneratedLink(link);
        await onShareAssessment?.(selectedAssessment.id);
        toast.success("Link gerado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao gerar link de avaliação:", error);
      toast.error("Erro ao gerar link de avaliação");
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
