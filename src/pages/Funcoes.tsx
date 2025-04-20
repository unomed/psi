
import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoleForm } from "@/components/roles/RoleForm";
import { RoleCompanySelect } from "@/components/roles/RoleCompanySelect";
import { RoleGrid } from "@/components/roles/RoleGrid";
import { EmptyRoleState } from "@/components/roles/EmptyRoleState";
import { useRoles } from "@/hooks/useRoles";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";
import type { RoleData } from "@/components/roles/RoleCard";

export default function Funcoes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedCompany');
    return saved || null;
  });
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const { roles, isLoading, createRole, updateRole, deleteRole } = useRoles();
  const { companies } = useCompanies();
  const { sectors } = useSectors();
  const { userRole } = useAuth();
  const [canCreateRoles, setCanCreateRoles] = useState(false);
  const [viewingRole, setViewingRole] = useState<RoleData | null>(null);
  
  useEffect(() => {
    const checkPermissions = async () => {
      const isSuperAdminOrAdmin = userRole === 'superadmin' || userRole === 'admin';
      setCanCreateRoles(isSuperAdminOrAdmin);
    };
    
    checkPermissions();
  }, [userRole]);

  const filteredRoles = roles?.filter(role => 
    (!selectedCompany || role.companyId === selectedCompany) &&
    (!selectedSector || role.sectorId === selectedSector)
  );

  const handleCreateOrUpdateRole = async (values: any) => {
    try {
      if (!canCreateRoles) {
        toast.error("Você não tem permissão para gerenciar funções");
        return;
      }
      
      if (!selectedCompany) {
        toast.error("Selecione uma empresa");
        return;
      }

      if (editingRole) {
        await updateRole.mutateAsync({
          ...editingRole,
          ...values,
          sectorId: values.sectorId || null,
        });
      } else {
        await createRole.mutateAsync({
          ...values,
          companyId: selectedCompany,
          sectorId: values.sectorId || null,
        });
      }

      setIsDialogOpen(false);
      setEditingRole(null);
    } catch (error) {
      console.error("Error managing role:", error);
    }
  };

  const handleDeleteRole = async (role: RoleData) => {
    if (confirm("Tem certeza que deseja excluir esta função?")) {
      try {
        await deleteRole.mutateAsync(role.id);
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    setSelectedSector(null);
    localStorage.setItem('selectedCompany', value);
  };

  useEffect(() => {
    setSelectedSector(null);
  }, [selectedCompany]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funções Organizacionais</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as funções, habilidades e perfis de risco psicossocial da sua empresa.
          </p>
        </div>
        {canCreateRoles && (
          <Button onClick={() => {
            setEditingRole(null);
            setIsDialogOpen(true);
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Função
          </Button>
        )}
      </div>

      <RoleCompanySelect 
        companies={companies || []}
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
            onSubmit={handleCreateOrUpdateRole} 
            defaultValues={editingRole || undefined}
            sectors={selectedCompany ? sectors?.filter(s => s.companyId === selectedCompany) || [] : []}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingRole} onOpenChange={() => setViewingRole(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Função</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Nome</h3>
              <p>{viewingRole?.name}</p>
            </div>
            {viewingRole?.description && (
              <div>
                <h3 className="font-semibold">Descrição</h3>
                <p>{viewingRole.description}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Nível de Risco</h3>
              <p>{viewingRole?.riskLevel ? getRiskLevelDisplay(viewingRole.riskLevel) : "Não definido"}</p>
            </div>
            {viewingRole?.requiredSkills && viewingRole.requiredSkills.length > 0 && (
              <div>
                <h3 className="font-semibold">Habilidades Requeridas</h3>
                <ul className="list-disc pl-4">
                  {viewingRole.requiredSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getRiskLevelDisplay(level: string) {
  switch (level) {
    case "high":
      return "Alto";
    case "medium":
      return "Médio";
    case "low":
      return "Baixo";
    default:
      return level;
  }
}
