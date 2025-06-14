
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, User, Building, MapPin, Briefcase } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";
import { useRoles } from "@/hooks/useRoles";
import { Employee } from "@/types/employee";

interface EmployeeSelectionStepProps {
  selectedEmployee: Employee | null;
  onEmployeeSelect: (employee: Employee) => void;
}

export function EmployeeSelectionStep({ selectedEmployee, onEmployeeSelect }: EmployeeSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { employees, isLoading: loadingEmployees } = useEmployees();
  const { companies } = useCompanies();
  const { sectors } = useSectors();
  const { roles } = useRoles();

  // Filtrar funcionários
  const filteredEmployees = employees?.filter(employee => {
    const matchesSearch = searchTerm === "" || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.cpf.includes(searchTerm) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = !selectedCompany || employee.company_id === selectedCompany;
    const matchesSector = !selectedSector || employee.sector_id === selectedSector;
    const matchesRole = !selectedRole || employee.role_id === selectedRole;

    return matchesSearch && matchesCompany && matchesSector && matchesRole;
  });

  const getCompanyName = (companyId: string) => {
    return companies?.find(c => c.id === companyId)?.name || "Empresa não encontrada";
  };

  const getSectorName = (sectorId: string) => {
    return sectors?.find(s => s.id === sectorId)?.name || "Setor não encontrado";
  };

  const getRoleName = (roleId: string) => {
    return roles?.find(r => r.id === roleId)?.name || "Função não encontrada";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecionar Funcionário</h3>
        <p className="text-muted-foreground">
          Escolha o funcionário que realizará a avaliação psicossocial
        </p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nome, CPF ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Empresa</Label>
          <Select value={selectedCompany || undefined} onValueChange={setSelectedCompany}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as empresas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as empresas</SelectItem>
              {companies?.map(company => (
                <SelectItem key={company.id} value={company.id || `company-${Math.random()}`}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Setor</Label>
          <Select value={selectedSector || undefined} onValueChange={setSelectedSector}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os setores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os setores</SelectItem>
              {sectors?.map(sector => (
                <SelectItem key={sector.id} value={sector.id || `sector-${Math.random()}`}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Função</Label>
          <Select value={selectedRole || undefined} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as funções" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as funções</SelectItem>
              {roles?.map(role => (
                <SelectItem key={role.id} value={role.id || `role-${Math.random()}`}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de funcionários */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loadingEmployees ? (
          <div className="text-center py-8">Carregando funcionários...</div>
        ) : filteredEmployees?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum funcionário encontrado com os filtros aplicados
          </div>
        ) : (
          filteredEmployees?.map(employee => (
            <Card 
              key={employee.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedEmployee?.id === employee.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onEmployeeSelect(employee)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">CPF: {employee.cpf}</p>
                      {employee.email && (
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Building className="h-3 w-3 mr-1" />
                          {getCompanyName(employee.company_id)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {getSectorName(employee.sector_id)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {getRoleName(employee.role_id)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {selectedEmployee?.id === employee.id && (
                    <Badge>Selecionado</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
