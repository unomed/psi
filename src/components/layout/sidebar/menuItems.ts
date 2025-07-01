
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

// Cadastros items - ROTAS PADRONIZADAS EM PORTUGUÊS
export const cadastrosItems: MenuItem[] = [
  {
    title: "Empresas",
    icon: Building2,
    href: "/empresas",
    roles: ["admin", "superadmin"],
    permission: "companies:read"
  },
  {
    title: "Funcionários",
    icon: Users,
    href: "/funcionarios",
    roles: ["admin", "manager"],
    permission: "employees:read"
  },
  {
    title: "Funções",
    icon: UserCircle,
    href: "/funcoes",
    roles: ["admin", "manager"],
    permission: "roles:read"
  },
  {
    title: "Setores",
    icon: Building2,
    href: "/setores",
    roles: ["admin", "manager"],
    permission: "sectors:read"
  }
];

// Avaliações items - ROTAS PADRONIZADAS EM PORTUGUÊS
export const avaliacoesItems: MenuItem[] = [
  {
    title: "Templates",
    icon: ClipboardList,
    href: "/templates",
    roles: ["admin", "manager"],
    permission: "checklists:read"
  },
  {
    title: "Resultados",
    icon: BarChart3,
    href: "/resultados",
    roles: ["admin", "manager"],
    permission: "assessment_results:read"
  },
  {
    title: "Comparação",
    icon: FileCheck,
    href: "/candidatos/comparacao",
    roles: ["admin", "manager"],
    permission: "assessments:read"
  },
  {
    title: "Avaliações",
    icon: Calendar,
    href: "/candidatos/avaliacoes",
    roles: ["admin", "manager"],
    permission: "assessments:schedule"
  }
];

// Gestão items - ROTAS PADRONIZADAS EM PORTUGUÊS
export const gestaoItems: MenuItem[] = [
  {
    title: "Gestão de Riscos",
    icon: AlertTriangle,
    href: "/gestao-riscos",
    roles: ["admin", "manager"],
    permission: "psychosocial_risks:read"
  },
  {
    title: "Plano de Ação",
    icon: FileText,
    href: "/plano-acao",
    roles: ["admin", "manager"],
    permission: "action_plans:read"
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    href: "/agendamentos",
    roles: ["admin", "manager"],
    permission: "assessments:schedule"
  },
  {
    title: "Relatórios",
    icon: TrendingUp,
    href: "/relatorios",
    roles: ["admin", "manager"],
    permission: "reports:read"
  }
];

// Portais items - ROTAS PADRONIZADAS EM PORTUGUÊS
export const portaisItems: MenuItem[] = [
  {
    title: "Faturamento",
    icon: CreditCard,
    href: "/faturamento",
    roles: ["admin", "superadmin"],
    permission: "billing:read"
  }
];

// Legacy export for backward compatibility
export const menuItems: MenuItem[] = [
  dashboardItem,
  ...cadastrosItems,
  ...avaliacoesItems,
  ...gestaoItems,
  ...portaisItems
];
