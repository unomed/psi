
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Search, Building, Users, Briefcase } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { useSectors } from "@/hooks/sectors/useSectors";
import { useRoles } from "@/hooks/useRoles";
import { useAuth } from "@/contexts/AuthContext";

interface EmployeeSelectionStepProps {
  selectedEmployee: any;
  onEmployeeSelect: (employee: any) => void;
}

export function EmployeeSelectionStep({ 
  selectedEmployee, 
  onEmployeeSelect 
}: EmployeeSelectionStepProps) {
  const { userCompanies } = useAuth();
  const companyId = userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined;
  const { employees } = useEmployees({ companyId });
  const { sectors } = useSectors({ companyId });
  const { roles } = useRoles();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Get sector and role names
  const getSectorName = (sectorId: string) => {
    return sectors?.find(s => s.id === sectorId)?.name || "Setor não encontrado";
  };

  const getRoleName = (roleId: string) => {
    return roles?.find(r => r.id === roleId)?.name || "Função não encontrada";
  };

  // Extract unique sectors and roles from employees
  const availableSectors = sectors?.filter(sector => 
    employees?.some(emp => emp.sector_id === sector.id)
  ) || [];
  
  const availableRoles = roles?.filter(role => 
    employees?.some(emp => emp.role_id === role.id)
  ) || [];

  // Filter employees
  const filteredEmployees = employees?.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "all" || employee.sector_id === selectedSector;
    const matchesRole = selectedRole === "all" || employee.role_id === selectedRole;
    
    return matchesSearch && matchesSector && matchesRole;
  }) || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecionar Funcionário</h3>
        <p className="text-muted-foreground">
          Escolha o funcionário que receberá a avaliação
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar funcionário</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Setor</Label>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os setores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os setores</SelectItem>
              {availableSectors.map(sector => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Cargo</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os cargos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cargos</SelectItem>
              {availableRoles.map(role => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employee List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum funcionário encontrado com os filtros aplicados
          </div>
        ) : (
          filteredEmployees.map(employee => (
            <Card 
              key={employee.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedEmployee?.id === employee.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onEmployeeSelect(employee)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{employee.name}</CardTitle>
                      {employee.email && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {employee.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {selectedEmployee?.id === employee.id && (
                    <Badge>Selecionado</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    <Building className="h-3 w-3 mr-1" />
                    {getSectorName(employee.sector_id)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {getRoleName(employee.role_id)}
                  </Badge>
                  {employee.role?.risk_level && (
                    <Badge variant={
                      employee.role.risk_level === 'high' ? 'destructive' :
                      employee.role.risk_level === 'medium' ? 'default' : 'secondary'
                    } className="text-xs">
                      Risco {employee.role.risk_level === 'high' ? 'Alto' : 
                              employee.role.risk_level === 'medium' ? 'Médio' : 'Baixo'}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {employee.employee_type || 'Funcionário'}
                  </div>
                  {employee.phone && (
                    <div className="flex items-center gap-1">
                      📞 {employee.phone}
                    </div>
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
