
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchChecklistTemplates } from "@/services/checklistService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { DiscResultDisplay } from "@/components/checklists/DiscResultDisplay";
import { ChecklistResult, ChecklistTemplate } from "@/types/checklist";

// Mock data for companies (in a real app, this would come from a database)
const mockCompanies = [
  { id: "company-1", name: "Empresa ABC Ltda" },
  { id: "company-2", name: "Indústria XYZ S.A." }
];

// Mock data for sectors (in a real app, this would come from a database)
const mockSectors = [
  { id: "sector-1", name: "Desenvolvimento", companyId: "company-1" },
  { id: "sector-2", name: "Suporte", companyId: "company-1" },
  { id: "sector-3", name: "Produção", companyId: "company-2" }
];

// Mock data for roles (in a real app, this would come from a database)
const mockRoles = [
  { id: "role-1", name: "Desenvolvedor", sectorId: "sector-1" },
  { id: "role-2", name: "Atendente de Suporte", sectorId: "sector-2" },
  { id: "role-3", name: "Operador de Máquina", sectorId: "sector-3" }
];

// Mock data for employees (in a real app, this would come from a database)
const mockEmployees = [
  { id: "emp-1", name: "João Silva", roleId: "role-1" },
  { id: "emp-2", name: "Maria Oliveira", roleId: "role-2" },
  { id: "emp-3", name: "Carlos Santos", roleId: "role-3" }
];

export default function Avaliacoes() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<ChecklistResult | null>(null);

  // Fetch checklist templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['checklistTemplates'],
    queryFn: fetchChecklistTemplates
  });

  // Filter sectors, roles, and employees based on selection
  const filteredSectors = selectedCompany 
    ? mockSectors.filter(sector => sector.companyId === selectedCompany)
    : [];

  const filteredRoles = selectedSector 
    ? mockRoles.filter(role => role.sectorId === selectedSector)
    : [];

  const filteredEmployees = selectedRole 
    ? mockEmployees.filter(emp => emp.roleId === selectedRole)
    : [];

  // Handle selection changes
  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    setSelectedSector(null);
    setSelectedRole(null);
    setSelectedEmployee(null);
  };

  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
    setSelectedRole(null);
    setSelectedEmployee(null);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setSelectedEmployee(null);
  };

  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  const handleStartAssessment = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist para iniciar a avaliação.");
      return;
    }
    
    setIsAssessmentDialogOpen(true);
  };

  const handleSubmitAssessment = (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
    // In a real app, this would save the assessment to the database
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
    if (!selectedEmployee) return "";
    const employee = mockEmployees.find(emp => emp.id === selectedEmployee);
    return employee?.name || "";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
        <p className="text-muted-foreground mt-2">
          Aplicação e registro de avaliações psicossociais individuais e coletivas.
        </p>
      </div>
      
      <Card className="p-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Nova Avaliação</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Select onValueChange={handleCompanyChange} value={selectedCompany || undefined}>
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sector">Setor</Label>
                <Select 
                  onValueChange={handleSectorChange} 
                  value={selectedSector || undefined}
                  disabled={!selectedCompany}
                >
                  <SelectTrigger id="sector">
                    <SelectValue placeholder={selectedCompany ? "Selecione um setor" : "Primeiro selecione uma empresa"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select 
                  onValueChange={handleRoleChange} 
                  value={selectedRole || undefined}
                  disabled={!selectedSector}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder={selectedSector ? "Selecione uma função" : "Primeiro selecione um setor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employee">Funcionário</Label>
                <Select 
                  onValueChange={handleEmployeeChange} 
                  value={selectedEmployee || undefined}
                  disabled={!selectedRole}
                >
                  <SelectTrigger id="employee">
                    <SelectValue placeholder={selectedRole ? "Selecione um funcionário" : "Primeiro selecione uma função"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template">Modelo de Checklist</Label>
              <Select 
                onValueChange={handleTemplateSelect} 
                disabled={!selectedEmployee}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder={selectedEmployee ? "Selecione um modelo" : "Primeiro selecione um funcionário"} />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Carregando modelos...</SelectItem>
                  ) : templates.length === 0 ? (
                    <SelectItem value="empty" disabled>Nenhum modelo disponível</SelectItem>
                  ) : (
                    templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full mt-4" 
              disabled={!selectedEmployee || !selectedTemplate}
              onClick={handleStartAssessment}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Iniciar Avaliação
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Assessment Dialog */}
      <Dialog open={isAssessmentDialogOpen} onOpenChange={setIsAssessmentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.title}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <DiscAssessmentForm
              template={selectedTemplate}
              onSubmit={(resultData) => handleSubmitAssessment({
                ...resultData,
                employeeName: getSelectedEmployeeName()
              })}
              onCancel={() => setIsAssessmentDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Result Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resultado da Avaliação</DialogTitle>
          </DialogHeader>
          {assessmentResult && (
            <DiscResultDisplay
              result={assessmentResult}
              onClose={handleCloseResult}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
