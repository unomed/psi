import { toast } from "sonner";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { calculateNextScheduledDate as calcNextDate } from "@/services/assessmentHandlerService";
import { saveScheduledAssessment } from "@/services/checklist";
import { validateAssessmentDate } from "@/utils/dateUtils";
import { useEmployees } from "@/hooks/useEmployees";

export function useScheduleOperations({
  selectedEmployee,
  selectedTemplate,
  scheduledDate,
  setIsScheduleDialogOpen,
  setIsNewAssessmentDialogOpen,
  setScheduledDate,
  setActiveTab,
  companyId
}: {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  scheduledDate: Date | undefined;
  setIsScheduleDialogOpen: (isOpen: boolean) => void;
  setIsNewAssessmentDialogOpen: (isOpen: boolean) => void;
  setScheduledDate: (date: Date | undefined) => void;
  setActiveTab: (tab: string) => void;
  companyId?: string;
}) {
  const { employees } = useEmployees({ companyId });

  const handleScheduleAssessment = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist para agendar a avaliação.");
      return;
    }
    
    setIsScheduleDialogOpen(true);
  };

  const handleSaveSchedule = async (recurrenceType: RecurrenceType, phoneNumber: string) => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    
    // Using our date validation utility
    const dateError = validateAssessmentDate(scheduledDate);
    if (dateError) {
      toast.error(dateError);
      return;
    }
    
    try {
      const employee = employees.find(e => e.id === selectedEmployee);
      if (!employee) {
        toast.error("Funcionário não encontrado.");
        return;
      }
      
      const nextDate = calcNextDate(scheduledDate!, recurrenceType);
      
      const newScheduledAssessment = {
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate: scheduledDate!,
        sentAt: null,
        linkUrl: "",
        status: "scheduled" as const,
        completedAt: null,
        recurrenceType: recurrenceType,
        nextScheduledDate: nextDate,
        phoneNumber: phoneNumber.trim() !== "" ? phoneNumber : undefined,
        company_id: employee.company_id,
        employees: {
          name: employee.name,
          email: employee.email || '',
          phone: phoneNumber || ''
        }
      };
      
      await saveScheduledAssessment(newScheduledAssessment);
      
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

  return {
    handleScheduleAssessment,
    handleSaveSchedule
  };
}
