
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ChecklistTemplate } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { useChecklistTemplates } from "@/hooks/checklist/useChecklistTemplates";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

interface EmployeeSelectionStepProps {
  selectedEmployeeId: string | null;
  selectedTemplateId: string | null;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onNext: () => void;
}

export function EmployeeSelectionStep({
  selectedEmployeeId,
  selectedTemplateId,
  onEmployeeSelect,
  onTemplateSelect,
  onNext
}: EmployeeSelectionStepProps) {
  const { userCompanies } = useAuth();
  const companyId = userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined;
  
  const { data: employees, isLoading: loadingEmployees } = useEmployees(companyId);
  const { checklists, isLoading: loadingTemplates } = useChecklistTemplates();

  const selectedEmployee = employees?.find(emp => emp.id === selectedEmployeeId);
  const selectedTemplate = checklists.find(template => template.id === selectedTemplateId);

  const canProceed = selectedEmployeeId && selectedTemplateId;

  if (loadingEmployees || loadingTemplates) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seleção de Funcionário e Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleção de Funcionário e Template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="employee">Funcionário</Label>
          <Select
            value={selectedEmployeeId || ""}
            onValueChange={onEmployeeSelect}
          >
            <SelectTrigger id="employee">
              <SelectValue placeholder="Selecione um funcionário" />
            </SelectTrigger>
            <SelectContent>
              {employees?.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name} - {employee.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="template">Modelo de Checklist</Label>
          <Select
            value={selectedTemplateId || ""}
            onValueChange={onTemplateSelect}
          >
            <SelectTrigger id="template">
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              {checklists.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEmployee && selectedTemplate && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h4 className="font-medium">Resumo da Seleção</h4>
            <p className="text-sm"><strong>Funcionário:</strong> {selectedEmployee.name}</p>
            <p className="text-sm"><strong>Email:</strong> {selectedEmployee.email}</p>
            <p className="text-sm"><strong>Template:</strong> {selectedTemplate.title}</p>
          </div>
        )}

        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="w-full"
        >
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
