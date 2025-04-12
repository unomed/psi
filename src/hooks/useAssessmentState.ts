
import { useState } from "react";
import { ChecklistResult, ChecklistTemplate, ScheduledAssessment, RecurrenceType } from "@/types/checklist";
import { toast } from "sonner";
import { saveScheduledAssessment } from "@/services/checklistService";
import { mockEmployees } from "@/components/assessments/AssessmentSelectionForm";
import { sendAssessmentEmail } from "@/components/assessments/assessmentUtils";

// Import mock data for scheduled assessments (in a real app, this would come from a database)
const mockScheduledAssessments: ScheduledAssessment[] = [
  {
    id: "sched-1",
    employeeId: "emp-1",
    templateId: "template-1",
    scheduledDate: new Date("2025-04-15"),
    sentAt: new Date("2025-04-10"),
    linkUrl: "https://example.com/assessment/link1",
    status: "sent",
    completedAt: null,
    recurrenceType: "monthly",
    nextScheduledDate: new Date("2025-05-15"),
    phoneNumber: "(11) 98765-4321"
  },
  {
    id: "sched-2",
    employeeId: "emp-2",
    templateId: "template-2",
    scheduledDate: new Date("2025-04-20"),
    sentAt: null,
    linkUrl: "",
    status: "scheduled",
    completedAt: null,
    recurrenceType: "none",
    nextScheduledDate: null
  }
];

export function useAssessmentState() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const [assessmentResult, setAssessmentResult] = useState<ChecklistResult | null>(null);
  const [scheduledAssessments, setScheduledAssessments] = useState<ScheduledAssessment[]>(mockScheduledAssessments);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("agendadas");
  const [selectedAssessment, setSelectedAssessment] = useState<ScheduledAssessment | null>(null);

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
      
      const assessmentWithId: ScheduledAssessment = {
        ...newScheduledAssessment,
        id: savedId || `sched-${Date.now()}`
      };
      
      setScheduledAssessments([...scheduledAssessments, assessmentWithId]);
      setIsScheduleDialogOpen(false);
      setScheduledDate(undefined);
      setActiveTab("agendadas");
      toast.success("Avaliação agendada com sucesso!");
    } catch (error) {
      console.error("Erro ao agendar avaliação:", error);
      toast.error("Erro ao agendar avaliação. Tente novamente mais tarde.");
    }
  };

  const handleSendEmail = async (scheduledAssessmentId: string) => {
    try {
      const updatedAssessments = await sendAssessmentEmail(scheduledAssessmentId, scheduledAssessments);
      setScheduledAssessments(updatedAssessments);
      
      // Find the employee to display in the toast
      const assessment = scheduledAssessments.find(a => a.id === scheduledAssessmentId);
      if (assessment) {
        const employee = mockEmployees.find(e => e.id === assessment.employeeId);
        if (employee) {
          toast.success(`Email enviado para ${employee.name} (${employee.email})`);
        }
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast.error("Erro ao enviar email. Tente novamente mais tarde.");
    }
  };

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
