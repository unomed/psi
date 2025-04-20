
import { useState, useEffect } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/employees/columns";
import { Employee, EmployeeFormData } from "@/types/employee";
import { EmptyEmployeeState } from "@/components/employees/EmptyEmployeeState";
import { EmployeeHeader } from "@/components/employees/EmployeeHeader";
import { EmployeeDialogs } from "@/components/employees/dialogs/EmployeeDialogs";
import { EmployeeSearch } from "@/components/employees/EmployeeSearch";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyAccessCheck } from "@/hooks/useCompanyAccessCheck";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Funcionarios() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedCompany');
    return saved || null;
  });
  
  const { userRole, userCompanies } = useAuth();
  const { verifyCompanyAccess } = useCompanyAccessCheck();
  
  const { employees, isLoading, createEmployee, updateEmployee, deleteEmployee } = useEmployees();

  // Verificar se o usuário tem acesso à empresa selecionada
  useEffect(() => {
    const checkCompanyAccess = async () => {
      if (!selectedCompany) return;
      
      // Superadmin tem acesso a todas as empresas
      if (userRole === 'superadmin') return;
      
      const hasAccess = await verifyCompanyAccess(selectedCompany);
      if (!hasAccess) {
        toast.error('Você não tem acesso à empresa selecionada');
        
        // Se o usuário tem pelo menos uma empresa associada, selecionar a primeira
        if (userCompanies.length > 0) {
          const firstCompany = userCompanies[0].companyId;
          setSelectedCompany(firstCompany);
          localStorage.setItem('selectedCompany', firstCompany);
        } else {
          setSelectedCompany(null);
          localStorage.removeItem('selectedCompany');
        }
      }
    };
    
    checkCompanyAccess();
  }, [selectedCompany, userRole, userCompanies, verifyCompanyAccess]);
  
  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    localStorage.setItem('selectedCompany', value);
  };

  // Filtrar funcionários por empresa
  const filteredByCompany = selectedCompany 
    ? employees?.filter(employee => employee.company_id === selectedCompany)
    : [];

  const filteredEmployees = filteredByCompany?.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    const matchesName = employee.name.toLowerCase().includes(searchLower);
    const matchesCpf = employee.cpf.toLowerCase().includes(searchLower);
    const matchesEmail = employee.email?.toLowerCase().includes(searchLower) || false;
    
    return matchesName || matchesCpf || matchesEmail;
  });

  const handleCreate = async (data: EmployeeFormData) => {
    if (!selectedCompany) {
      toast.error("Selecione uma empresa primeiro");
      return;
    }
    
    try {
      // Garantir que o funcionário seja criado na empresa selecionada
      await createEmployee.mutateAsync({
        ...data,
        company_id: selectedCompany
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const handleEdit = async (data: EmployeeFormData) => {
    if (!selectedEmployee) return;
    
    // Verificar se o usuário tem acesso à empresa do funcionário
    if (userRole !== 'superadmin') {
      const hasAccess = await verifyCompanyAccess(selectedEmployee.company_id);
      if (!hasAccess) {
        toast.error('Você não tem permissão para editar este funcionário');
        return;
      }
    }
    
    try {
      await updateEmployee.mutateAsync({ ...data, id: selectedEmployee.id });
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    
    // Verificar se o usuário tem acesso à empresa do funcionário
    if (userRole !== 'superadmin') {
      const hasAccess = await verifyCompanyAccess(selectedEmployee.company_id);
      if (!hasAccess) {
        toast.error('Você não tem permissão para excluir este funcionário');
        return;
      }
    }
    
    try {
      await deleteEmployee.mutateAsync(selectedEmployee.id);
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="space-y-8">
      <EmployeeHeader onCreateClick={() => {
        if (!selectedCompany) {
          toast.error("Selecione uma empresa primeiro");
          return;
        }
        setIsCreateDialogOpen(true);
      }} />
      
      {/* Seletor de empresa */}
      {userCompanies.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Label htmlFor="company">Selecione a empresa:</Label>
              <Select 
                value={selectedCompany || ""} 
                onValueChange={handleCompanyChange}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {userCompanies.map(company => (
                    <SelectItem key={company.companyId} value={company.companyId}>
                      {company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!selectedCompany ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">Selecione uma empresa para visualizar os funcionários</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <EmployeeSearch 
              search={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          {filteredEmployees?.length === 0 && !isLoading ? (
            <EmptyEmployeeState onCreateClick={() => setIsCreateDialogOpen(true)} />
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredEmployees || []}
              isLoading={isLoading}
              meta={{
                onEdit: (employee: Employee) => {
                  setSelectedEmployee(employee);
                  setIsEditDialogOpen(true);
                },
                onDelete: (employee: Employee) => {
                  setSelectedEmployee(employee);
                  setIsDeleteDialogOpen(true);
                },
                onView: (employee: Employee) => {
                  setSelectedEmployee(employee);
                  setIsViewDialogOpen(true);
                },
              }}
            />
          )}
        </>
      )}

      <EmployeeDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isViewDialogOpen={isViewDialogOpen}
        setIsViewDialogOpen={setIsViewDialogOpen}
        selectedEmployee={selectedEmployee}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        companyId={selectedCompany}
      />
    </div>
  );
}
