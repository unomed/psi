
import { BarChart3, Building2, Users, Briefcase, MapPin, FileText, ClipboardList, AlertTriangle, Target, FileBarChart, CreditCard, Calendar, UserCheck } from "lucide-react";
import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    roles: ["superadmin", "admin", "evaluator", "profissionais"]
  },
  
  // === SEÇÃO CADASTROS ===
  {
    title: "Empresas",
    href: "/empresas",
    icon: Building2,
    roles: ["superadmin", "admin"],
    permission: "view_companies"
  },
  {
    title: "Setores",
    href: "/setores",
    icon: MapPin,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_sectors"
  },
  {
    title: "Funções",
    href: "/funcoes",
    icon: Briefcase,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_functions"
  },
  {
    title: "Funcionários",
    href: "/funcionarios",
    icon: Users,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_employees"
  },
  
  // === SEÇÃO AVALIAÇÕES ===
  {
    title: "Templates",
    href: "/checklists",
    icon: FileText,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_checklists"
  },
  {
    title: "Agendamentos",
    href: "/agendamentos",
    icon: Calendar,
    roles: ["superadmin", "admin", "evaluator"],
    permission: "view_scheduling"
  },
  {
    title: "Resultados",
    href: "/resultados",
    icon: ClipboardList,
    roles: ["superadmin", "admin", "evaluator", "profissionais"],
    permission: "view_results"
  },
  
  // === SEÇÃO GESTÃO ===
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
  
  // === SEÇÃO PORTAIS ===
  {
    title: "Portal do Funcionário",
    href: "/employee-portal",
    icon: UserCheck,
    roles: ["superadmin", "admin", "evaluator"],
    isExternal: true
  },
  
  // === SEÇÃO FATURAMENTO ===
  {
    title: "Faturamento",
    href: "/faturamento",
    icon: CreditCard,
    roles: ["superadmin"],
    permission: "view_billing"
  }
];
