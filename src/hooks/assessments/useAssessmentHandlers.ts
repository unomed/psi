
import { useState } from "react";
import { toast } from "sonner";
import { ChecklistResult, ChecklistTemplate, RecurrenceType } from "@/types/checklist";
import { saveScheduledAssessment } from "@/services/checklistService";
import { generateAssessmentLink, getEmployeeInfo } from "@/components/assessments/assessmentUtils";
import { mockEmployees } from "@/components/assessments/AssessmentSelectionForm";

export function useAssessmentHandlers({
  selectedEmployee,
  selectedTemplate,
  setIsAssessmentDialogOpen,
  setIsResultDialogOpen,
  setIsScheduleDialogOpen,
  setIsLinkDialogOpen,
  setIsNewAssessmentDialogOpen,
  setAssessmentResult,
  setGeneratedLink,
  setActiveTab,
  scheduledDate,
  handleSendEmail
}: {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  setIsAssessmentDialogOpen: (isOpen: boolean) => void;
  setIsResultDialogOpen: (isOpen: boolean) => void;
  setIsScheduleDialogOpen: (isOpen: boolean) => void;
  setIsLinkDialogOpen: (isOpen: boolean) => void;
  setIsNewAssessmentDialogOpen: (isOpen: boolean) => void;
  setAssessmentResult: (result: ChecklistResult | null) => void;
  setGeneratedLink: (link: string) => void;
  setActiveTab: (tab: string) => void;
  scheduledDate: Date | undefined;
  handleSendEmail: (employeeId: string) => void;
}) {
  const handleNewAssessment = () => {
    setSelectedEmployee(null);
    setSelectedTemplate(null);
    setIsNewAssessmentDialogOpen(true);
  };

  const handleScheduleAssessment = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist para agendar a avaliação.");
      return;
    }
    
    setIsScheduleDialogOpen(true);
  };

  const handleGenerateLink = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist para gerar o link.");
      return;
    }
    
    const newLink = generateAssessmentLink(selectedTemplate.id, selectedEmployee);
    setGeneratedLink(newLink);
    setIsLinkDialogOpen(true);
  };

  const handleShareAssessment = (assessmentId: string) => {
    const assessment = scheduledAssessments.find(a => a.id === assessmentId);
    if (assessment) {
      setSelectedAssessment(assessment);
      setIsShareDialogOpen(true);
    }
  };

  const handleSubmitAssessment = (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
    const mockResult: ChecklistResult = {
      ...resultData,
      id: `result-${Date.now()}`,
      completedAt: new Date()
    };
    
    setAssessmentResult(mockResult);
    setIsAssessmentDialogOpen(false);
    setIsResultDialogOpen(true);
    
    toast.success("Avaliação concluída com sucesso!");
  };

  const handleCloseResult = () => {
    setIsResultDialogOpen(false);
    setAssessmentResult(null);
  };

  const getSelectedEmployeeName = () => {
    return getEmployeeInfo(selectedEmployee).name;
  };

  const handleSaveAssessment = async () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return;
    }

    try {
      await saveScheduledAssessment({
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate: new Date(),
        status: "scheduled",
        sentAt: null,
        completedAt: null,
        linkUrl: "",
        recurrenceType: "none"
      });
      
      toast.success("Avaliação salva com sucesso!");
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast.error("Erro ao salvar avaliação.");
    }
  };

  const handleSendEmailToEmployee = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return;
    }
    
    handleSendEmail(selectedEmployee);
    setIsNewAssessmentDialogOpen(false);
    setActiveTab("agendadas");
  };

  const calculateNextScheduledDate = (currentDate: Date, recurrenceType: RecurrenceType): Date | null => {
    if (recurrenceType === "none") return null;
    
    const nextDate = new Date(currentDate);
    
    switch (recurrenceType) {
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case "semiannual":
        nextDate.setMonth(nextDate.getMonth() + 6);
        break;
      case "annual":
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        return null;
    }
    
    return nextDate;
  };

  const handleSaveSchedule = async (recurrenceType: RecurrenceType, phoneNumber: string) => {
    if (!selectedEmployee || !selectedTemplate || !scheduledDate) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    
    try {
      // Create new scheduled assessment
      const employee = mockEmployees.find(e => e.id === selectedEmployee);
      if (!employee) {
        toast.error("Funcionário não encontrado.");
        return;
      }
      
      const nextDate = calculateNextScheduledDate(scheduledDate, recurrenceType);
      
      const newScheduledAssessment: Omit<ScheduledAssessment, "id"> = {
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate: scheduledDate,
        sentAt: null,
        linkUrl: "",
        status: "scheduled",
        completedAt: null,
        recurrenceType: recurrenceType,
        nextScheduledDate: nextDate,
        phoneNumber: phoneNumber.trim() !== "" ? phoneNumber : undefined
      };
      
      // In a real app, this would save to the database
      const savedId = await saveScheduledAssessment(newScheduledAssessment);
      
      setIsScheduleDialogOpen(false);
      setIsNewAssessmentDialogOpen(false);
      setScheduledDate(undefined);
      setActiveTab("agendadas");
      toast.success("Avaliação agendada com sucesso!");
    } catch (error) {
      console.error("Erro ao agendar avaliação:", error);
      toast.error("Erro ao agendar avaliação. Tente novamente mais tarde.");
    }
  };

  // For TypeScript to be happy, we need a scheduledAssessments variable even though it's not used directly
  const scheduledAssessments = [];

  return {
    handleNewAssessment,
    handleScheduleAssessment,
    handleGenerateLink,
    handleShareAssessment,
    handleSubmitAssessment,
    handleCloseResult,
    getSelectedEmployeeName,
    handleSaveAssessment,
    handleSendEmailToEmployee,
    handleSaveSchedule,
    calculateNextScheduledDate
  };
}
