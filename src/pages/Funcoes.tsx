import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoleForm } from "@/components/roles/RoleForm";
import { RoleCompanySelect } from "@/components/roles/RoleCompanySelect";
import { RoleGrid } from "@/components/roles/RoleGrid";
import { EmptyRoleState } from "@/components/roles/EmptyRoleState";
import { RoleHeader } from "@/components/roles/RoleHeader";
import { RoleDetailsDialog } from "@/components/roles/RoleDetailsDialog";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { useCompanyAccessCheck } from "@/hooks/useCompanyAccessCheck";
import { toast } from "sonner";

export default function Funcoes() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedCompany');
    return saved || null;
  });
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  
  const { companies } = useCompanies();
  const { sectors } = useSectors();
  const { filterResourcesByCompany } = useCompanyAccessCheck();
  const {
    isDialogOpen,
    setIsDialogOpen,
    editingRole,
    setEditingRole,
    viewingRole,
    setViewingRole,
    canCreateRoles,
    roles,
    handleCreateOrUpdateRole,
    handleDeleteRole,
  } = useRoleManagement();

  // Convert and filter companies
  const formattedCompanies = companies.map(company => ({
    company_id: company.id,
    ...company
  }));
  
  const accessibleCompanyRecords = filterResourcesByCompany(formattedCompanies);
  
  const accessibleCompanies = accessibleCompanyRecords.map(company => ({
    id: company.company_id || "",
    name: company.name || "",
    cnpj: company.cnpj || "",
    address: company.address || "",
    city: company.city || "",
    state: company.state || "",
    industry: company.industry || "",
    contactName: company.contactName || "",
    contactEmail: company.contactEmail || "",
    contactPhone: company.contactPhone || "",
    notes: ""
  }));

  const filteredRoles = roles?.filter(role => 
    (!selectedCompany || role.companyId === selectedCompany) &&
    (!selectedSector || role.sectorId === selectedSector)
  );

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    setSelectedSector(null);
    localStorage.setItem('selectedCompany', value);
  };

  const handleCreateRole = async (values: any) => {
    if (!selectedCompany) {
      toast.error("Selecione uma empresa");
      return;
    }
    await handleCreateOrUpdateRole({ ...values, companyId: selectedCompany });
  };

  return (
    <div className="space-y-6">
      <RoleHeader 
        onCreateClick={() => {
          setEditingRole(null);
          setIsDialogOpen(true);
        }}
        canCreate={canCreateRoles}
      />

      <RoleCompanySelect 
        companies={accessibleCompanies}
        sectors={sectors || []}
        selectedCompany={selectedCompany}
        selectedSector={selectedSector}
        onCompanyChange={handleCompanyChange}
        onSectorChange={setSelectedSector}
      />

      {filteredRoles && filteredRoles.length > 0 ? (
        <RoleGrid 
          roles={filteredRoles}
          onEdit={(role) => {
            setEditingRole(role);
            setIsDialogOpen(true);
          }}
          onDelete={handleDeleteRole}
          canEdit={canCreateRoles}
        />
      ) : (
        <EmptyRoleState 
          onCreateClick={() => {
            setEditingRole(null);
            setIsDialogOpen(true);
          }}
          canCreate={canCreateRoles}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Editar Função' : 'Nova Função'}</DialogTitle>
          </DialogHeader>
          <RoleForm 
            onSubmit={handleCreateRole}
            defaultValues={editingRole || undefined}
            sectors={selectedCompany ? (sectors?.filter(s => s.companyId === selectedCompany) || []) : []}
          />
        </DialogContent>
      </Dialog>

      <RoleDetailsDialog 
        role={viewingRole}
        onOpenChange={() => setViewingRole(null)}
      />
    </div>
  );
}
