
import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssessmentSelectionTab } from "./scheduling/AssessmentSelectionTab";
import { SchedulingDetailsTab } from "./scheduling/SchedulingDetailsTab";
import { RecurrenceType, ChecklistTemplate } from "@/types";

interface ScheduleRecurringAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployeeId: string | null;
  selectedTemplate: ChecklistTemplate | null;
  scheduledDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onSave: (recurrenceType: RecurrenceType, phoneNumber: string) => void;
}

export function ScheduleRecurringAssessmentDialog({
  isOpen,
  onClose,
  selectedEmployeeId,
  selectedTemplate,
  scheduledDate,
  onDateSelect,
  onSave
}: ScheduleRecurringAssessmentDialogProps) {
  const [activeTab, setActiveTab] = useState("selection");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [localSelectedEmployee, setLocalSelectedEmployee] = useState<string | null>(selectedEmployeeId);
  const [localSelectedTemplate, setLocalSelectedTemplate] = useState<ChecklistTemplate | null>(selectedTemplate);
  
  const { employees, isLoading } = useEmployees();

  const selectedEmployee = employees?.find(emp => emp.id === localSelectedEmployee);

  const handleSchedule = (recurrenceType: RecurrenceType, phoneNumber: string) => {
    onSave(recurrenceType, phoneNumber);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Avaliação</DialogTitle>
          <DialogDescription>
            Agende uma avaliação com opção de recorrência para o funcionário selecionado.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="selection">Seleção</TabsTrigger>
            <TabsTrigger value="scheduling" disabled={!localSelectedEmployee || !localSelectedTemplate}>
              Agendamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="selection">
            <AssessmentSelectionTab
              selectedCompany={selectedCompany}
              selectedSector={selectedSector}
              selectedRole={selectedRole}
              selectedEmployee={localSelectedEmployee}
              selectedTemplate={localSelectedTemplate}
              onCompanyChange={setSelectedCompany}
              onSectorChange={setSelectedSector}
              onRoleChange={setSelectedRole}
              onEmployeeChange={setLocalSelectedEmployee}
              onTemplateSelect={(templateId) => {
                const template = selectedTemplate?.id === templateId ? selectedTemplate : null;
                setLocalSelectedTemplate(template);
              }}
              onNext={() => setActiveTab("scheduling")}
              templates={selectedTemplate ? [selectedTemplate] : []}
              isTemplatesLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="scheduling">
            <SchedulingDetailsTab
              employeeName={selectedEmployee?.name || ""}
              employeeEmail={selectedEmployee?.email}
              templateTitle={localSelectedTemplate?.title}
              scheduledDate={scheduledDate}
              onDateSelect={onDateSelect}
              onBack={() => setActiveTab("selection")}
              onSchedule={handleSchedule}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
