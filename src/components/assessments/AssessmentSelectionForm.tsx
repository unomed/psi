
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock, LinkIcon, Send } from "lucide-react";
import { ChecklistTemplate } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentSelectionFormProps {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onStartAssessment: () => void;
  onScheduleAssessment: () => void;
  onGenerateLink: () => void;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
}

export function AssessmentSelectionForm({
  selectedEmployee,
  selectedTemplate,
  templates,
  isTemplatesLoading,
  onStartAssessment,
  onScheduleAssessment,
  onGenerateLink,
  onEmployeeSelect,
  onTemplateSelect
}: AssessmentSelectionFormProps) {
  const { userCompanies } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<string>(() => {
    return userCompanies.length > 0 ? String(userCompanies[0].companyId) : '';
  });

  const { employees, isLoading: isEmployeesLoading } = useEmployees({ 
    companyId: selectedCompany || undefined 
  });

  const isFormValid = selectedEmployee && selectedTemplate;

  return (
    <div className="space-y-6">
      {/* Company Selection */}
      {userCompanies.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {userCompanies.map(company => (
                  <SelectItem key={String(company.companyId)} value={String(company.companyId)}>
                    {company.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Employee Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="employee">Selecione o funcionário</Label>
            {isEmployeesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={selectedEmployee || ""} onValueChange={onEmployeeSelect}>
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Escolha um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      <div className="flex flex-col">
                        <span>{employee.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {employee.role?.name} • {employee.sectors?.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                  {employees.length === 0 && (
                    <SelectItem value="no-employees" disabled>
                      Nenhum funcionário encontrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Modelo de Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="template">Selecione o modelo</Label>
            {isTemplatesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={selectedTemplate?.id || ""} onValueChange={onTemplateSelect}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Escolha um modelo de avaliação" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col">
                        <span>{template.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {template.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                  {templates.length === 0 && (
                    <SelectItem value="no-templates" disabled>
                      Nenhum modelo encontrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {selectedTemplate && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium">{selectedTemplate.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedTemplate.description}
              </p>
              {selectedTemplate.estimated_time_minutes && (
                <p className="text-xs text-muted-foreground mt-2">
                  Tempo estimado: {selectedTemplate.estimated_time_minutes} minutos
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              onClick={onStartAssessment} 
              disabled={!isFormValid}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              Iniciar Agora
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onScheduleAssessment}
              disabled={!isFormValid}
              className="w-full"
            >
              <Clock className="mr-2 h-4 w-4" />
              Agendar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onGenerateLink}
              disabled={!isFormValid}
              className="w-full"
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Gerar Link
            </Button>
          </div>
          
          {!isFormValid && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              Selecione um funcionário e um modelo para continuar
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
