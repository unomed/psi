
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileCheck, 
  ClipboardList, 
  BarChart3, 
  AlertTriangle,
  BookOpen,
  UserCircle,
  Calendar,
  ShieldCheck,
  Settings,
  FileText,
  TrendingUp,
  Zap,
  CreditCard
} from "lucide-react";
import { MenuItem } from "./types";

// Dashboard item
export const dashboardItem: MenuItem = {
  title: "Dashboard",
  icon: LayoutDashboard,
  href: "/dashboard",
  roles: ["admin", "manager"],
  permission: "dashboard:read"
};

// Cadastros items
export const cadastrosItems: MenuItem[] = [
  {
    title: "Empresas",
    icon: Building2,
    href: "/companies",
    roles: ["admin", "superadmin"],
    permission: "companies:read"
  },
  {
    title: "Funcionários",
    icon: Users,
    href: "/employees",
    roles: ["admin", "manager"],
    permission: "employees:read"
  },
  {
    title: "Cargos",
    icon: UserCircle,
    href: "/roles",
    roles: ["admin", "manager"],
    permission: "roles:read"
  },
  {
    title: "Setores",
    icon: Building2,
    href: "/sectors",
    roles: ["admin", "manager"],
    permission: "sectors:read"
  }
];

// Avaliações items
export const avaliacoesItems: MenuItem[] = [
  {
    title: "Checklists",
    icon: ClipboardList,
    href: "/checklists",
    roles: ["admin", "manager"],
    permission: "checklists:read"
  },
  {
    title: "Avaliações",
    icon: FileCheck,
    href: "/assessments",
    roles: ["admin", "manager"],
    permission: "assessments:read"
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    href: "/assessment-scheduling",
    roles: ["admin", "manager"],
    permission: "assessments:schedule"
  },
  {
    title: "Resultados",
    icon: BarChart3,
    href: "/assessment-results",
    roles: ["admin", "manager"],
    permission: "assessment_results:read"
  }
];

// Gestão items
export const gestaoItems: MenuItem[] = [
  {
    title: "Riscos Psicossociais",
    icon: AlertTriangle,
    href: "/psychosocial-risks",
    roles: ["admin", "manager"],
    permission: "psychosocial_risks:read"
  },
  {
    title: "Planos de Ação",
    icon: FileText,
    href: "/action-plans",
    roles: ["admin", "manager"],
    permission: "action_plans:read"
  },
  {
    title: "Relatórios",
    icon: TrendingUp,
    href: "/reports",
    roles: ["admin", "manager"],
    permission: "reports:read"
  },
  {
    title: "Auditoria",
    icon: ShieldCheck,
    href: "/audit",
    roles: ["admin"],
    permission: "audit:read"
  }
];

// Portais items
export const portaisItems: MenuItem[] = [
  {
    title: "Portal Funcionário",
    icon: Users,
    href: "/employee-portal",
    roles: ["admin", "manager"],
    permission: "employees:read"
  },
  {
    title: "Automação",
    icon: Zap,
    href: "/automation",
    roles: ["admin"],
    permission: "automation:read"
  }
];

// Faturamento item
export const faturamentoItem: MenuItem = {
  title: "Faturamento",
  icon: CreditCard,
  href: "/billing",
  roles: ["admin", "superadmin"],
  permission: "billing:read"
};

// Legacy export for backward compatibility
export const menuItems: MenuItem[] = [
  dashboardItem,
  ...cadastrosItems,
  ...avaliacoesItems,
  ...gestaoItems,
  ...portaisItems,
  faturamentoItem
];
