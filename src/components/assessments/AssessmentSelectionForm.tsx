
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, Calendar, Link } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChecklistTemplate } from "@/types/checklist";

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
  { id: "emp-1", name: "João Silva", email: "joao.silva@example.com", roleId: "role-1" },
  { id: "emp-2", name: "Maria Oliveira", email: "maria.oliveira@example.com", roleId: "role-2" },
  { id: "emp-3", name: "Carlos Santos", email: "carlos.santos@example.com", roleId: "role-3" }
];

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
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

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
    onEmployeeSelect(""); // Clear employee selection
  };

  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
    setSelectedRole(null);
    onEmployeeSelect(""); // Clear employee selection
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    onEmployeeSelect(""); // Clear employee selection
  };

  const handleEmployeeChange = (value: string) => {
    onEmployeeSelect(value);
  };

  return (
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
            onValueChange={onTemplateSelect} 
            disabled={!selectedEmployee}
          >
            <SelectTrigger id="template">
              <SelectValue placeholder={selectedEmployee ? "Selecione um modelo" : "Primeiro selecione um funcionário"} />
            </SelectTrigger>
            <SelectContent>
              {isTemplatesLoading ? (
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
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            className="flex-1"
            disabled={!selectedEmployee || !selectedTemplate}
            onClick={onStartAssessment}
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Iniciar Avaliação
          </Button>
          
          <Button 
            className="flex-1"
            variant="outline"
            disabled={!selectedEmployee || !selectedTemplate}
            onClick={onScheduleAssessment}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Avaliação
          </Button>
          
          <Button 
            className="flex-1"
            variant="outline"
            disabled={!selectedEmployee || !selectedTemplate}
            onClick={onGenerateLink}
          >
            <Link className="mr-2 h-4 w-4" />
            Gerar Link
          </Button>
        </div>
      </div>
    </div>
  );
}

// Export mock data for use in other components
export { mockEmployees };
