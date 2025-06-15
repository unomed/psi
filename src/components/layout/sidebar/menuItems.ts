
import { BarChart3, Building2, Users, Briefcase, MapPin, FileText, ClipboardList, AlertTriangle, Target, FileBarChart, CreditCard, Calendar } from "lucide-react";
import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    roles: ["superadmin", "admin", "evaluator", "profissionais"]
  },
  {
    title: "Empresas",
    href: "/empresas",
    icon: Building2,
    roles: ["superadmin", "admin"],
    permission: "view_companies"
  },
  {
    title: "Funcionários",
    href: "/funcionarios",
    icon: Users,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_employees"
  },
  {
    title: "Funções",
    href: "/funcoes",
    icon: Briefcase,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_functions"
  },
  {
    title: "Setores",
    href: "/setores",
    icon: MapPin,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_sectors"
  },
  {
    title: "Templates",
    href: "/checklists",
    icon: FileText,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_checklists"
  },
  {
    title: "Resultados",
    href: "/resultados",
    icon: ClipboardList,
    roles: ["superadmin", "admin", "evaluator", "profissionais"],
    permission: "view_results"
  },
  {
    title: "Gestão de Riscos",
    href: "/gestao-riscos",
    icon: AlertTriangle,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_risk_management"
  },
  {
    title: "Plano de Ação",
    href: "/plano-acao",
    icon: Target,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_action_plans"
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: FileBarChart,
    roles: ["superadmin", "admin", "evaluator", "profissionais"],
    permission: "view_reports"
  },
  {
    title: "Agendamentos",
    href: "/agendamentos",
    icon: Calendar,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_scheduling"
  },
  {
    title: "Faturamento",
    href: "/faturamento",
    icon: CreditCard,
    roles: ["superadmin"],
    permission: "view_billing"
  }
];
