
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
  roles: ["admin", "manager", "evaluator"],
  permission: "view_dashboard"
};

// Cadastros items - ROTAS PADRONIZADAS EM PORTUGUÊS
export const cadastrosItems: MenuItem[] = [
  {
    title: "Empresas",
    icon: Building2,
    href: "/empresas",
    roles: ["superadmin"],
    permission: "view_companies"
  },
  {
    title: "Funcionários",
    icon: Users,
    href: "/funcionarios",
    roles: ["admin", "manager"],
    permission: "view_employees"
  },
  {
    title: "Funções",
    icon: UserCircle,
    href: "/funcoes",
    roles: ["admin", "manager"],
    permission: "view_functions"
  },
  {
    title: "Setores",
    icon: Building2,
    href: "/setores",
    roles: ["admin", "manager"],
    permission: "view_sectors"
  }
];

// Avaliações items - ROTAS PADRONIZADAS EM PORTUGUÊS
export const avaliacoesItems: MenuItem[] = [
  {
    title: "Templates",
    icon: ClipboardList,
    href: "/templates",
    roles: ["admin", "manager"],
    permission: "view_checklists"
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    href: "/agendamentos",
    roles: ["admin", "manager"],
    permission: "view_scheduling"
  },
  {
    title: "Resultados",
    icon: BarChart3,
    href: "/resultados",
    roles: ["admin", "manager", "evaluator"],
    permission: "view_results"
  }
];

// Gestão items - ROTAS PADRONIZADAS EM PORTUGUÊS
export const gestaoItems: MenuItem[] = [
  {
    title: "Gestão de Riscos",
    icon: AlertTriangle,
    href: "/gestao-riscos",
    roles: ["admin", "manager"],
    permission: "view_risk_management"
  },
  {
    title: "Plano de Ação",
    icon: FileText,
    href: "/plano-acao",
    roles: ["admin", "manager"],
    permission: "view_action_plans"
  },
  {
    title: "Relatórios",
    icon: TrendingUp,
    href: "/relatorios",
    roles: ["admin", "manager", "evaluator"],
    permission: "view_reports"
  }
];

// Candidatos items - NOVA SEÇÃO
export const candidatosItems: MenuItem[] = [
  {
    title: "Avaliações",
    icon: Calendar,
    href: "/candidatos/avaliacoes",
    roles: ["admin", "manager"],
    permission: "view_assessments"
  },
  {
    title: "Comparação",
    icon: FileCheck,
    href: "/candidatos/comparacao",
    roles: ["admin", "manager"],
    permission: "view_assessments"
  }
];

// Portais items - ROTAS PADRONIZADAS EM PORTUGUÊS
export const portaisItems: MenuItem[] = [
  {
    title: "Faturamento",
    icon: CreditCard,
    href: "/faturamento",
    roles: ["superadmin"],
    permission: "view_billing"
  }
];

// Legacy export for backward compatibility
export const menuItems: MenuItem[] = [
  dashboardItem,
  ...cadastrosItems,
  ...avaliacoesItems,
  ...gestaoItems,
  ...candidatosItems,
  ...portaisItems
];
