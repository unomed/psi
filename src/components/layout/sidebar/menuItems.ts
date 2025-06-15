
import { 
  Building2, 
  Users, 
  Briefcase, 
  Factory, 
  ClipboardList, 
  BarChart3, 
  Shield, 
  FileText, 
  Calendar,
  CreditCard,
  UserCheck,
  GitCompare
} from "lucide-react";
import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3
  },
  {
    title: "Empresas",
    href: "/empresas",
    icon: Building2
  },
  {
    title: "Funcionários",
    href: "/funcionarios",
    icon: Users
  },
  {
    title: "Funções",
    href: "/funcoes",
    icon: Briefcase
  },
  {
    title: "Setores",
    href: "/setores",
    icon: Factory
  },
  {
    title: "Templates",
    href: "/checklists",
    icon: ClipboardList
  },
  {
    title: "Resultados",
    href: "/resultados",
    icon: BarChart3
  },
  {
    title: "Gestão de Riscos",
    href: "/gestao-riscos", 
    icon: Shield
  },
  {
    title: "Plano de Ação",
    href: "/plano-acao",
    icon: FileText
  },
  {
    title: "Agendamentos",
    href: "/agendamentos",
    icon: Calendar
  },
  {
    title: "Candidatos",
    icon: UserCheck,
    subItems: [
      {
        title: "Comparação",
        href: "/candidatos/comparacao",
        icon: GitCompare
      },
      {
        title: "Avaliações",
        href: "/candidatos/avaliacoes",
        icon: ClipboardList
      }
    ]
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: FileText
  },
  {
    title: "Faturamento",
    href: "/faturamento",
    icon: CreditCard
  }
];
