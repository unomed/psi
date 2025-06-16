
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
  Zap
} from "lucide-react";
import { MenuItemType } from "./types";

export const menuItems: MenuItemType[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    permission: "dashboard:read"
  },
  {
    title: "Empresas",
    icon: Building2,
    href: "/companies",
    permission: "companies:read"
  },
  {
    title: "Funcionários",
    icon: Users,
    href: "/employees",
    permission: "employees:read"
  },
  {
    title: "Cargos",
    icon: UserCircle,
    href: "/roles",
    permission: "roles:read"
  },
  {
    title: "Setores",
    icon: Building2,
    href: "/sectors",
    permission: "sectors:read"
  },
  {
    title: "Checklists",
    icon: ClipboardList,
    href: "/checklists",
    permission: "checklists:read"
  },
  {
    title: "Avaliações",
    icon: FileCheck,
    href: "/assessments",
    permission: "assessments:read"
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    href: "/assessment-scheduling",
    permission: "assessments:schedule"
  },
  {
    title: "Resultados",
    icon: BarChart3,
    href: "/assessment-results",
    permission: "assessment_results:read"
  },
  {
    title: "Riscos Psicossociais",
    icon: AlertTriangle,
    href: "/psychosocial-risks",
    permission: "psychosocial_risks:read"
  },
  {
    title: "Planos de Ação",
    icon: FileText,
    href: "/action-plans",
    permission: "action_plans:read"
  },
  {
    title: "Relatórios",
    icon: TrendingUp,
    href: "/reports",
    permission: "reports:read"
  },
  {
    title: "Auditoria",
    icon: ShieldCheck,
    href: "/audit",
    permission: "audit:read"
  },
  {
    title: "Portal Funcionário",
    icon: Users,
    href: "/employee-portal",
    permission: "employees:read"
  },
  {
    title: "Automação",
    icon: Zap,
    href: "/automation",
    permission: "automation:read"
  }
];
