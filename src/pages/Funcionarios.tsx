import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { CompanySelector } from "@/components/assessments/selectors/CompanySelector";
import { SectorSelector } from "@/components/assessments/selectors/SectorSelector";
import { RoleSelector } from "@/components/assessments/selectors/RoleSelector";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/employees/columns";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { EmployeeFormData } from "@/types/employee";

export default function Funcionarios() {
  const { employees, isLoading, createEmployee } = useEmployees();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const filteredEmployees = employees?.filter(employee => {
    if (selectedCompany && employee.company_id !== selectedCompany) return false;
    if (selectedSector && employee.sector_id !== selectedSector) return false;
    if (selectedRole && employee.role_id !== selectedRole) return false;
    return true;
  });

  const handleCreateEmployee = async (data: EmployeeFormData) => {
    await createEmployee.mutateAsync(data);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os funcionários da empresa e suas informações.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CompanySelector 
          selectedCompany={selectedCompany} 
          onCompanyChange={setSelectedCompany}
        />
        <SectorSelector 
          selectedCompany={selectedCompany}
          selectedSector={selectedSector}
          onSectorChange={setSelectedSector}
        />
        <RoleSelector 
          selectedSector={selectedSector}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />
      </div>

      {employees?.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum funcionário cadastrado</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Cadastre funcionários para começar a gerenciar suas informações e avaliações.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Cadastrar Funcionário
            </Button>
          </div>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={filteredEmployees || []}
          isLoading={isLoading}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastro de Funcionário</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            onSubmit={handleCreateEmployee}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
