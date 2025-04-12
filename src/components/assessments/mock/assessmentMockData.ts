
// Mock data for companies, sectors, roles, and employees
export const mockCompanies = [
  { id: "company-1", name: "Empresa ABC Ltda" },
  { id: "company-2", name: "Indústria XYZ S.A." }
];

export const mockSectors = [
  { id: "sector-1", name: "Desenvolvimento", companyId: "company-1" },
  { id: "sector-2", name: "Suporte", companyId: "company-1" },
  { id: "sector-3", name: "Produção", companyId: "company-2" }
];

export const mockRoles = [
  { id: "role-1", name: "Desenvolvedor", sectorId: "sector-1" },
  { id: "role-2", name: "Atendente de Suporte", sectorId: "sector-2" },
  { id: "role-3", name: "Operador de Máquina", sectorId: "sector-3" }
];

export const mockEmployees = [
  { id: "emp-1", name: "João Silva", email: "joao.silva@example.com", roleId: "role-1" },
  { id: "emp-2", name: "Maria Oliveira", email: "maria.oliveira@example.com", roleId: "role-2" },
  { id: "emp-3", name: "Carlos Santos", email: "carlos.santos@example.com", roleId: "role-3" }
];
