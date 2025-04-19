
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AssessmentSelectionTab } from "./scheduling/AssessmentSelectionTab";
import { SchedulingDetailsTab } from "./scheduling/SchedulingDetailsTab";
import { useEmployees } from "@/hooks/useEmployees";
import { ChecklistTemplate, RecurrenceType } from "@/types";

interface NewAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onScheduleAssessment: (recurrenceType: RecurrenceType, phoneNumber: string) => void;
  onGenerateLink: () => void;
  onSendEmail: () => void;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onSave: () => Promise<boolean> | boolean;
}

export function NewAssessmentDialog({
  isOpen,
  onClose,
  selectedEmployee,
  selectedTemplate,
  templates,
  isTemplatesLoading,
  onScheduleAssessment,
  onGenerateLink,
  onSendEmail,
  onEmployeeSelect,
  onTemplateSelect,
  onSave
}: NewAssessmentDialogProps) {
  const [activeTab, setActiveTab] = useState("selection");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  
  const { employees } = useEmployees();
  const selectedEmployeeData = employees?.find(emp => emp.id === selectedEmployee);

  const handleSchedule = (recurrenceType: RecurrenceType, phoneNumber: string) => {
    onScheduleAssessment(recurrenceType, phoneNumber);
    onClose();
  };

  const handleClose = () => {
    setActiveTab("selection");
    setSelectedCompany(null);
    setSelectedSector(null);
    setSelectedRole(null);
    setScheduledDate(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Avaliação</DialogTitle>
          <DialogDescription>
            Selecione o funcionário e o modelo de avaliação para começar.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="selection">Seleção</TabsTrigger>
            <TabsTrigger value="scheduling" disabled={!selectedEmployee || !selectedTemplate}>
              Agendamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="selection">
            <AssessmentSelectionTab
              selectedCompany={selectedCompany}
              selectedSector={selectedSector}
              selectedRole={selectedRole}
              selectedEmployee={selectedEmployee}
              selectedTemplate={selectedTemplate}
              onCompanyChange={setSelectedCompany}
              onSectorChange={setSelectedSector}
              onRoleChange={setSelectedRole}
              onEmployeeChange={onEmployeeSelect}
              onTemplateSelect={onTemplateSelect}
              onNext={() => setActiveTab("scheduling")}
              templates={templates}
              isTemplatesLoading={isTemplatesLoading}
            />
          </TabsContent>

          <TabsContent value="scheduling">
            <SchedulingDetailsTab
              employeeName={selectedEmployeeData?.name || "Funcionário não encontrado"}
              employeeEmail={selectedEmployeeData?.email}
              templateTitle={selectedTemplate?.title}
              scheduledDate={scheduledDate}
              onDateSelect={setScheduledDate}
              onBack={() => setActiveTab("selection")}
              onSchedule={handleSchedule}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
