
import { useState } from "react";
import { ChecklistResult, ChecklistTemplate, ScheduledAssessment } from "@/types";
import { useAssessmentSaveOperations } from "./assessments/operations/useAssessmentSaveOperations";
import { useAssessmentEmailOperations } from "./assessments/operations/useAssessmentEmailOperations";

export function useAssessmentState() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isNewAssessmentDialogOpen, setIsNewAssessmentDialogOpen] = useState(false);

  const [assessmentResult, setAssessmentResult] = useState<ChecklistResult | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("agendadas");
  const [selectedAssessment, setSelectedAssessment] = useState<ScheduledAssessment | null>(null);

  const { 
    scheduledAssessments, 
    setScheduledAssessments, 
    handleSaveSchedule 
  } = useAssessmentSaveOperations();

  const { handleSendEmail } = useAssessmentEmailOperations(
    scheduledAssessments,
    setScheduledAssessments
  );

  return {
    // State
    selectedEmployee,
    setSelectedEmployee,
    selectedTemplate,
    setSelectedTemplate,
    scheduledDate,
    setScheduledDate,
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
    assessmentResult,
    setAssessmentResult,
    scheduledAssessments,
    setScheduledAssessments,
    generatedLink,
    setGeneratedLink,
    activeTab,
    setActiveTab,
    selectedAssessment,
    setSelectedAssessment,
    // Functions
    handleSaveSchedule,
    handleSendEmail
  };
}
