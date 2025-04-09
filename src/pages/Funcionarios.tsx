
import { useState } from "react";
import { Users, PlusCircle, Building2, FolderKanban, UserRound, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CompanyData } from "@/components/companies/CompanyCard";
import { SectorData } from "@/components/sectors/SectorCard";
import { RoleData } from "@/components/roles/RoleCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";

// Mock data for companies
const mockCompanies: CompanyData[] = [
  {
    id: "company-1",
    name: "Empresa ABC Ltda",
    cnpj: "12.345.678/0001-90",
    address: "Rua Principal, 123",
    city: "São Paulo",
    state: "SP",
    industry: "Tecnologia da Informação",
    contactName: "João Silva",
    contactEmail: "joao.silva@abc.com",
    contactPhone: "(11) 98765-4321"
  },
  {
    id: "company-2",
    name: "Indústria XYZ S.A.",
    cnpj: "98.765.432/0001-10",
    address: "Av. Industrial, 456",
    city: "Belo Horizonte",
    state: "MG",
    industry: "Manufatura",
    contactName: "Maria Oliveira",
    contactEmail: "maria.o@xyz.com.br",
    contactPhone: "(31) 91234-5678"
  }
];

// Mock data for sectors
const mockSectors: SectorData[] = [
  {
    id: "sector-1",
    name: "Desenvolvimento",
    description: "Equipe de desenvolvimento de software",
    location: "2º andar",
    riskLevel: "Médio",
    companyId: "company-1"
  },
  {
    id: "sector-2",
    name: "Suporte",
    description: "Suporte técnico ao cliente",
    location: "Térreo",
    riskLevel: "Baixo",
    companyId: "company-1"
  },
  {
    id: "sector-3",
    name: "Produção",
    description: "Linha de produção principal",
    location: "Galpão 3",
    riskLevel: "Alto",
    companyId: "company-2"
  }
];

// Mock data for roles
const mockRoles: RoleData[] = [
  {
    id: "role-1",
    name: "Desenvolvedor Front-end",
    description: "Desenvolvimento de interfaces de usuário",
    sectorId: "sector-1",
    companyId: "company-1",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
    riskLevel: "Baixo"
  },
  {
    id: "role-2",
    name: "Desenvolvedor Back-end",
    description: "Desenvolvimento de APIs e serviços",
    sectorId: "sector-1",
    companyId: "company-1",
    requiredSkills: ["Node.js", "Python", "SQL", "API Design"],
    riskLevel: "Baixo"
  },
  {
    id: "role-3",
    name: "Atendente de Suporte",
    description: "Atendimento ao cliente e suporte técnico",
    sectorId: "sector-2",
    companyId: "company-1",
    requiredSkills: ["Comunicação", "Resolução de problemas", "Paciência"],
    riskLevel: "Médio"
  },
  {
    id: "role-4",
    name: "Operador de Máquina",
    description: "Operação de máquinas e equipamentos",
    sectorId: "sector-3",
    companyId: "company-2",
    requiredSkills: ["Operação de máquinas", "Segurança do trabalho"],
    riskLevel: "Alto"
  }
];

// Interface para os dados do Funcionário
interface EmployeeData {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  companyId: string;
  sectorId: string;
  roleId: string;
  startDate: string;
  status: "ativo" | "afastado" | "desligado";
  specialConditions?: string;
}

type EmployeeFormData = Omit<EmployeeData, "id" | "companyId" | "sectorId" | "roleId">;

export default function Funcionarios() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar setores com base na empresa selecionada
  const filteredSectors = selectedCompany 
    ? mockSectors.filter(sector => sector.companyId === selectedCompany)
    : [];

  // Filtrar funções com base no setor selecionado
  const filteredRoles = selectedSector 
    ? mockRoles.filter(role => role.sectorId === selectedSector)
    : [];

  // Filtrar funcionários com base nas seleções
  const filteredEmployees = employees.filter(employee => {
    const matchesFilters = (
      (!selectedCompany || employee.companyId === selectedCompany) &&
      (!selectedSector || employee.sectorId === selectedSector) &&
      (!selectedRole || employee.roleId === selectedRole)
    );
    
    const matchesSearch = searchTerm 
      ? employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.cpf.includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesFilters && matchesSearch;
  });

  // Formulário para criar/editar funcionários
  const form = useForm<EmployeeFormData>({
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      phone: "",
      birthDate: "",
      gender: "",
      address: "",
      startDate: "",
      status: "ativo",
      specialConditions: ""
    },
  });

  // Resetar o formulário quando abrir o diálogo de criação
  const handleOpenCreateDialog = () => {
    if (!selectedCompany || !selectedSector || !selectedRole) {
      toast.error("Selecione uma empresa, setor e função antes de adicionar um funcionário");
      return;
    }
    
    form.reset({
      name: "",
      cpf: "",
      email: "",
      phone: "",
      birthDate: "",
      gender: "",
      address: "",
      startDate: new Date().toISOString().split("T")[0],
      status: "ativo",
      specialConditions: ""
    });
    
    setIsCreateDialogOpen(true);
  };

  // Preencher o formulário quando abrir o diálogo de edição
  const handleOpenEditDialog = (employee: EmployeeData) => {
    setCurrentEmployee(employee);
    
    form.reset({
      name: employee.name,
      cpf: employee.cpf,
      email: employee.email,
      phone: employee.phone,
      birthDate: employee.birthDate,
      gender: employee.gender,
      address: employee.address,
      startDate: employee.startDate,
      status: employee.status,
      specialConditions: employee.specialConditions || ""
    });
    
    setIsEditDialogOpen(true);
  };

  // Abrir diálogo de confirmação de exclusão
  const handleOpenDeleteDialog = (employee: EmployeeData) => {
    setCurrentEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  // Adicionar um novo funcionário
  const handleCreateEmployee = (data: EmployeeFormData) => {
    if (!selectedCompany || !selectedSector || !selectedRole) {
      toast.error("Selecione uma empresa, setor e função");
      return;
    }
    
    const newEmployee: EmployeeData = {
      ...data,
      id: `employee-${Date.now()}`,
      companyId: selectedCompany,
      sectorId: selectedSector,
      roleId: selectedRole
    };
    
    setEmployees([...employees, newEmployee]);
    setIsCreateDialogOpen(false);
    toast.success("Funcionário cadastrado com sucesso!");
  };

  // Atualizar funcionário existente
  const handleUpdateEmployee = (data: EmployeeFormData) => {
    if (!currentEmployee) return;
    
    const updatedEmployees = employees.map(emp => 
      emp.id === currentEmployee.id ? { 
        ...emp, 
        ...data 
      } : emp
    );
    
    setEmployees(updatedEmployees);
    setIsEditDialogOpen(false);
    setCurrentEmployee(null);
    toast.success("Funcionário atualizado com sucesso!");
  };

  // Excluir funcionário
  const handleDeleteEmployee = () => {
    if (!currentEmployee) return;
    
    const updatedEmployees = employees.filter(emp => emp.id !== currentEmployee.id);
    setEmployees(updatedEmployees);
    setIsDeleteDialogOpen(false);
    setCurrentEmployee(null);
    toast.success("Funcionário excluído com sucesso!");
  };

  // Funções para alteração de seleções
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    setSelectedSector(null);
    setSelectedRole(null);
  };

  const handleSectorChange = (sectorId: string) => {
    setSelectedSector(sectorId);
    setSelectedRole(null);
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
  };

  // Encontrar nomes de empresa, setor e função
  const getCompanyName = (companyId: string) => {
    const company = mockCompanies.find(c => c.id === companyId);
    return company?.name || "Desconhecida";
  };

  const getSectorName = (sectorId: string) => {
    const sector = mockSectors.find(s => s.id === sectorId);
    return sector?.name || "Desconhecido";
  };

  const getRoleName = (roleId: string) => {
    const role = mockRoles.find(r => r.id === roleId);
    return role?.name || "Desconhecida";
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground mt-2">
            Cadastro e acompanhamento dos funcionários e suas avaliações psicossociais.
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>
      
      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
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
            
            <div>
              <Label htmlFor="sector">Setor</Label>
              <Select 
                onValueChange={handleSectorChange} 
                value={selectedSector || undefined}
                disabled={!selectedCompany}
              >
                <SelectTrigger id="sector">
                  <SelectValue placeholder="Selecione um setor" />
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
            
            <div>
              <Label htmlFor="role">Função</Label>
              <Select 
                onValueChange={handleRoleChange} 
                value={selectedRole || undefined}
                disabled={!selectedSector}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione uma função" />
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
            
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Nome, CPF ou e-mail"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabela de funcionários ou mensagem de vazio */}
      {filteredEmployees.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.cpf}</TableCell>
                  <TableCell>{getCompanyName(employee.companyId)}</TableCell>
                  <TableCell>{getSectorName(employee.sectorId)}</TableCell>
                  <TableCell>{getRoleName(employee.roleId)}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      employee.status === "ativo" ? "bg-green-100 text-green-800" :
                      employee.status === "afastado" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {employee.status === "ativo" ? "Ativo" :
                       employee.status === "afastado" ? "Afastado" :
                       "Desligado"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenEditDialog(employee)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenDeleteDialog(employee)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum funcionário encontrado</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              {!selectedCompany 
                ? "Selecione uma empresa para visualizar seus funcionários."
                : !selectedSector
                ? "Selecione um setor para visualizar seus funcionários."
                : !selectedRole
                ? "Selecione uma função para visualizar seus funcionários."
                : "Nenhum funcionário cadastrado para os filtros selecionados."}
            </p>
            {selectedCompany && selectedSector && selectedRole && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleOpenCreateDialog}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Cadastrar Funcionário
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Diálogo de criação */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastro de Funcionário</DialogTitle>
            <DialogDescription>
              Preencha os dados do funcionário para cadastrá-lo no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateEmployee)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo*</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF*</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="000.000.000-00" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(00) 00000-0000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                          <SelectItem value="nao-informado">Prefiro não informar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Admissão*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue="ativo">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="afastado">Afastado</SelectItem>
                          <SelectItem value="desligado">Desligado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="specialConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condições Especiais</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Restrições ou condições de saúde relevantes" />
                    </FormControl>
                    <FormDescription>
                      Informe quaisquer condições especiais que possam ser relevantes para avaliações psicossociais.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar Funcionário</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogDescription>
              Atualize os dados do funcionário.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateEmployee)} className="space-y-6">
              {/* Mesmo conteúdo do formulário de criação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo*</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF*</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="000.000.000-00" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(00) 00000-0000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                          <SelectItem value="nao-informado">Prefiro não informar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Admissão*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="afastado">Afastado</SelectItem>
                          <SelectItem value="desligado">Desligado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="specialConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condições Especiais</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Restrições ou condições de saúde relevantes" />
                    </FormControl>
                    <FormDescription>
                      Informe quaisquer condições especiais que possam ser relevantes para avaliações psicossociais.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. Deseja realmente excluir o funcionário {currentEmployee?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
