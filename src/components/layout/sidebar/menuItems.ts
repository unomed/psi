
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
  UserCheck,
  CalendarClock,
  ClipboardList
} from "lucide-react";
import { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
    roles: ["superadmin", "admin", "evaluator", "profissionais"],
    permission: "view_dashboard"
  },
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
    roles: ["superadmin", "admin"],
    permission: "view_employees"
  },
  {
    title: "Setores",
    icon: MapPin,
    href: "/setores",
    roles: ["superadmin", "admin"],
    permission: "view_sectors"
  },
  {
    title: "Funções",
    icon: Briefcase,
    href: "/funcoes",
    roles: ["superadmin", "admin"],
    permission: "view_functions"
  },
  {
    title: "Templates",
    icon: CheckSquare,
    href: "/templates",
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_checklists"
  },
  {
    title: "Avaliações",
    icon: UserCheck,
    href: "/avaliacoes",
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_assessments"
  },
  {
    title: "Agendamentos",
    icon: CalendarClock,
    href: "/agendamentos",
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_scheduling"
  },
  {
    title: "Resultados",
    icon: ClipboardList,
    href: "/resultados",
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_results"
  },
  {
    title: "Gestão de Riscos",
    icon: Shield,
    href: "/gestao-riscos",
    roles: ["superadmin", "admin"],
    permission: "view_risk_management"
  },
  {
    title: "Plano de Ação",
    icon: FileText,
    href: "/plano-acao",
    roles: ["superadmin", "admin"],
    permission: "view_action_plans"
  },
  {
    title: "Relatórios",
    icon: TrendingUp,
    href: "/relatorios",
    roles: ["superadmin", "admin"],
    permission: "view_reports"
  },
  {
    title: "Faturamento",
    icon: CreditCard,
    href: "/faturamento",
    roles: ["superadmin"],
    permission: "view_billing"
  }
];
