
import { 
  Building2, 
  Users, 
  Briefcase, 
  Factory, 
  ClipboardList, 
  TrendingUp, 
  Shield, 
  FileText, 
  Calendar,
  CreditCard,
  UserCheck,
  GitCompare,
  BarChart3,
  FileBarChart
} from "lucide-react";
import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    roles: ["admin", "manager", "user"]
  },
  {
    title: "Empresas",
    href: "/empresas",
    icon: Building2,
    roles: ["admin", "manager"]
  },
  {
    title: "Funcionários",
    href: "/funcionarios",
    icon: Users,
    roles: ["admin", "manager", "user"]
  },
  {
    title: "Funções",
    href: "/funcoes",
    icon: Briefcase,
    roles: ["admin", "manager"]
  },
  {
    title: "Setores",
    href: "/setores",
    icon: Factory,
    roles: ["admin", "manager"]
  },
  {
    title: "Templates",
    href: "/checklists",
    icon: ClipboardList,
    roles: ["admin", "manager", "user"]
  },
  {
    title: "Resultados",
    href: "/resultados",
    icon: TrendingUp,
    roles: ["admin", "manager", "user"]
  },
  {
    title: "Gestão de Riscos",
    href: "/gestao-riscos", 
    icon: Shield,
    roles: ["admin", "manager"]
  },
  {
    title: "Plano de Ação",
    href: "/plano-acao",
    icon: FileText,
    roles: ["admin", "manager"]
  },
  {
    title: "Agendamentos",
    href: "/agendamentos",
    icon: Calendar,
    roles: ["admin", "manager"]
  },
  {
    title: "Candidatos",
    href: "#",
    icon: UserCheck,
    roles: ["admin", "manager"],
    subItems: [
      {
        title: "Comparação",
        href: "/candidatos/comparacao",
        icon: GitCompare,
        roles: ["admin", "manager"]
      },
      {
        title: "Avaliações",
        href: "/candidatos/avaliacoes",
        icon: ClipboardList,
        roles: ["admin", "manager"]
      }
    ]
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: FileBarChart,
    roles: ["admin", "manager", "user"]
  },
  {
    title: "Faturamento",
    href: "/faturamento",
    icon: CreditCard,
    roles: ["admin"]
  }
];
