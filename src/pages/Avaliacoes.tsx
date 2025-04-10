
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList, PlayCircle, Calendar, Send, Mail, Link } from "lucide-react";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchChecklistTemplates, saveScheduledAssessment, generateAssessmentLink } from "@/services/checklistService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { DiscResultDisplay } from "@/components/checklists/DiscResultDisplay";
import { ChecklistResult, ChecklistTemplate, ScheduledAssessment, AssessmentStatus } from "@/types/checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

// Mock data for scheduled assessments (in a real app, this would come from a database)
const mockScheduledAssessments: ScheduledAssessment[] = [
  {
    id: "sched-1",
    employeeId: "emp-1",
    templateId: "template-1",
    scheduledDate: new Date("2025-04-15"),
    sentAt: new Date("2025-04-10"),
    linkUrl: "https://example.com/assessment/link1",
    status: "sent",
    completedAt: null
  },
  {
    id: "sched-2",
    employeeId: "emp-2",
    templateId: "template-2",
    scheduledDate: new Date("2025-04-20"),
    sentAt: null,
    linkUrl: "",
    status: "scheduled",
    completedAt: null
  }
];

export default function Avaliacoes() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<ChecklistResult | null>(null);
  const [scheduledAssessments, setScheduledAssessments] = useState<ScheduledAssessment[]>(mockScheduledAssessments);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("nova");

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
    
    // In a real app, this would generate a unique link with a token in the database
    const newLink = generateAssessmentLink(selectedTemplate.id, selectedEmployee);
    setGeneratedLink(newLink);
    setIsLinkDialogOpen(true);
  };

  const handleSaveSchedule = async () => {
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
      
      const newScheduledAssessment: Omit<ScheduledAssessment, "id"> = {
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate: scheduledDate,
        sentAt: null,
        linkUrl: "",
        status: "scheduled",
        completedAt: null
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
      toast.success("Avaliação agendada com sucesso!");
    } catch (error) {
      console.error("Erro ao agendar avaliação:", error);
      toast.error("Erro ao agendar avaliação. Tente novamente mais tarde.");
    }
  };

  const handleSendEmail = async (scheduledAssessmentId: string) => {
    try {
      // Find the scheduled assessment
      const assessment = scheduledAssessments.find(a => a.id === scheduledAssessmentId);
      if (!assessment) {
        toast.error("Avaliação não encontrada.");
        return;
      }
      
      // Find the employee
      const employee = mockEmployees.find(e => e.id === assessment.employeeId);
      if (!employee) {
        toast.error("Funcionário não encontrado.");
        return;
      }
      
      // In a real app, this would generate a unique link and send an email
      const link = `https://example.com/assessment/${assessment.id}`;
      
      // Update the scheduled assessment with the link and sent date
      const updatedAssessments = scheduledAssessments.map(a => 
        a.id === scheduledAssessmentId 
          ? { 
              ...a, 
              sentAt: new Date(), 
              linkUrl: link,
              status: "sent" as AssessmentStatus // Explicitly cast to AssessmentStatus
            } 
          : a
      );
      
      setScheduledAssessments(updatedAssessments);
      toast.success(`Email enviado para ${employee.name} (${employee.email})`);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast.error("Erro ao enviar email. Tente novamente mais tarde.");
    }
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copiado para a área de transferência!");
  };

  const getSelectedEmployeeName = () => {
    if (!selectedEmployee) return "";
    const employee = mockEmployees.find(emp => emp.id === selectedEmployee);
    return employee?.name || "";
  };

  const getSelectedEmployeeEmail = () => {
    if (!selectedEmployee) return "";
    const employee = mockEmployees.find(emp => emp.id === selectedEmployee);
    return employee?.email || "";
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee?.name || "Desconhecido";
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.title || "Desconhecido";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled": return "Agendado";
      case "sent": return "Enviado";
      case "completed": return "Concluído";
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "sent": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
        <p className="text-muted-foreground mt-2">
          Aplicação e registro de avaliações psicossociais individuais e coletivas.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="nova">Nova Avaliação</TabsTrigger>
          <TabsTrigger value="agendadas">Avaliações Agendadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nova" className="space-y-4">
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
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    className="flex-1"
                    disabled={!selectedEmployee || !selectedTemplate}
                    onClick={handleStartAssessment}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Iniciar Avaliação
                  </Button>
                  
                  <Button 
                    className="flex-1"
                    variant="outline"
                    disabled={!selectedEmployee || !selectedTemplate}
                    onClick={handleScheduleAssessment}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Avaliação
                  </Button>
                  
                  <Button 
                    className="flex-1"
                    variant="outline"
                    disabled={!selectedEmployee || !selectedTemplate}
                    onClick={handleGenerateLink}
                  >
                    <Link className="mr-2 h-4 w-4" />
                    Gerar Link
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="agendadas" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Avaliações Agendadas</h2>
              
              {scheduledAssessments.length === 0 ? (
                <div className="text-center py-10">
                  <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Nenhuma avaliação agendada</h3>
                  <p className="text-muted-foreground mt-2">
                    Agende avaliações para funcionários na aba "Nova Avaliação".
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Funcionário
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modelo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {scheduledAssessments.map((assessment) => (
                        <tr key={assessment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{getEmployeeName(assessment.employeeId)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{getTemplateName(assessment.templateId)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {format(assessment.scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(assessment.status)}`}>
                              {getStatusLabel(assessment.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            {assessment.status === "scheduled" && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleSendEmail(assessment.id)}
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                Enviar
                              </Button>
                            )}
                            {assessment.status === "sent" && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  navigator.clipboard.writeText(assessment.linkUrl);
                                  toast.success("Link copiado para a área de transferência!");
                                }}
                              >
                                <Link className="h-4 w-4 mr-1" />
                                Copiar Link
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
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
      
      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Avaliação</DialogTitle>
            <DialogDescription>
              Agende uma avaliação para o funcionário selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Funcionário</Label>
              <p className="text-sm">{getSelectedEmployeeName()}</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm">{getSelectedEmployeeEmail()}</p>
            </div>
            <div className="space-y-2">
              <Label>Modelo de Checklist</Label>
              <p className="text-sm">{selectedTemplate?.title}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Data Agendada</Label>
              <DatePicker
                date={scheduledDate}
                onSelect={setScheduledDate}
                disabled={(date) => date < new Date()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveSchedule}>Agendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link para Avaliação</DialogTitle>
            <DialogDescription>
              Copie e compartilhe o link com o funcionário para que ele possa responder à avaliação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Funcionário</Label>
              <p className="text-sm">{getSelectedEmployeeName()}</p>
            </div>
            <div className="space-y-2">
              <Label>Modelo de Checklist</Label>
              <p className="text-sm">{selectedTemplate?.title}</p>
            </div>
            <div className="space-y-2">
              <Label>Link de Avaliação</Label>
              <div className="flex space-x-2">
                <Input readOnly value={generatedLink} className="flex-1" />
                <Button size="sm" onClick={handleCopyLink}>
                  <ClipboardList className="h-4 w-4" />
                  <span className="sr-only">Copiar</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Este link permitirá que o funcionário responda à avaliação sem necessidade de login.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsLinkDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
