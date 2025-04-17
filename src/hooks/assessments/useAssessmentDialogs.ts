
import { useState } from "react";
import { ChecklistResult, ChecklistTemplate, ScheduledAssessment } from "@/types/checklist";

export function useAssessmentDialogs() {
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isNewAssessmentDialogOpen, setIsNewAssessmentDialogOpen] = useState(false);
  
  const [assessmentResult, setAssessmentResult] = useState<ChecklistResult | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [selectedAssessment, setSelectedAssessment] = useState<ScheduledAssessment | null>(null);

  return {
    // Dialog open states
    isAssessmentDialogOpen,
    setIsAssessmentDialogOpen,
    isResultDialogOpen,
    setIsResultDialogOpen,
    isScheduleDialogOpen,
    setIsScheduleDialogOpen,
    isLinkDialogOpen,
    setIsLinkDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    isNewAssessmentDialogOpen,
    setIsNewAssessmentDialogOpen,
    
    // Dialog data
    assessmentResult,
    setAssessmentResult,
    generatedLink,
    setGeneratedLink,
    selectedAssessment, 
    setSelectedAssessment
  };
}
