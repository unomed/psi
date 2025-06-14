
import { 
  BarChart3, 
  FileText, 
  Users, 
  Building2, 
  Briefcase, 
  MapPin,
  CheckSquare,
  Calendar,
  TrendingUp,
  Shield,
  CreditCard,
  UserCheck
} from "lucide-react";
import { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
    path: "/dashboard",
    roles: ["superadmin", "admin", "evaluator", "profissionais"],
    permission: "view_dashboard"
  },
  {
    title: "Empresas",
    icon: Building2,
    href: "/empresas",
    path: "/empresas",
    roles: ["superadmin"],
    permission: "view_companies"
  },
  {
    title: "Funcionários",
    icon: Users,
    href: "/funcionarios",
    path: "/funcionarios",
    roles: ["superadmin", "admin"],
    permission: "view_employees"
  },
  {
    title: "Setores",
    icon: MapPin,
    href: "/setores",
    path: "/setores",
    roles: ["superadmin", "admin"],
    permission: "view_sectors"
  },
  {
    title: "Funções",
    icon: Briefcase,
    href: "/funcoes",
    path: "/funcoes",
    roles: ["superadmin", "admin"],
    permission: "view_functions"
  },
  {
    title: "Checklists",
    icon: CheckSquare,
    href: "/templates",
    path: "/templates",
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_checklists"
  },
  {
    title: "Avaliações",
    icon: UserCheck,
    href: "/avaliacoes",
    path: "/avaliacoes",
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_assessments"
  },
  {
    title: "Resultados",
    icon: TrendingUp,
    href: "/resultados",
    path: "/resultados",
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_reports"
  },
  {
    title: "Gestão de Riscos",
    icon: Shield,
    href: "/gestao-riscos",
    path: "/gestao-riscos",
    roles: ["superadmin", "admin"],
    permission: "view_reports"
  },
  {
    title: "Plano de Ação",
    icon: FileText,
    href: "/plano-acao",
    path: "/plano-acao",
    roles: ["superadmin", "admin"],
    permission: "view_reports"
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    href: "/relatorios",
    path: "/relatorios",
    roles: ["superadmin", "admin"],
    permission: "view_reports"
  },
  {
    title: "Faturamento",
    icon: CreditCard,
    href: "/faturamento",
    path: "/faturamento",
    roles: ["superadmin"],
    permission: "view_settings"
  }
];
