
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types";

interface EmployeeSelectionStepProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onEmployeeSelect: (employee: Employee) => void;
  onNext: () => void;
  companyId?: string;
}

export function EmployeeSelectionStep({
  employees,
  selectedEmployee,
  onEmployeeSelect,
  onNext,
  companyId
}: EmployeeSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.cpf && employee.cpf.includes(searchTerm)) ||
    (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar funcionário por nome, CPF ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredEmployees.map((employee) => (
          <Card
            key={employee.id}
            className={`cursor-pointer transition-colors ${
              selectedEmployee?.id === employee.id
                ? "border-primary bg-primary/5"
                : "hover:bg-accent"
            }`}
            onClick={() => onEmployeeSelect(employee)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">{employee.name}</h4>
                    {employee.cpf && (
                      <p className="text-sm text-muted-foreground">CPF: {employee.cpf}</p>
                    )}
                    {employee.email && (
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant="outline">{employee.status}</Badge>
                  {employee.role && (
                    <Badge variant="secondary" className="text-xs">
                      {employee.role.name}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <User className="mx-auto h-12 w-12 mb-2" />
          <p>Nenhum funcionário encontrado</p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          disabled={!selectedEmployee}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
