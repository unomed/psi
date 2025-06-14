
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
    roles: ["superadmin", "admin", "user"]
  },
  {
    title: "Empresas",
    icon: Building2,
    href: "/empresas",
    path: "/empresas",
    roles: ["superadmin"]
  },
  {
    title: "Funcionários",
    icon: Users,
    href: "/funcionarios",
    path: "/funcionarios",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Setores",
    icon: MapPin,
    href: "/setores",
    path: "/setores",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Funções",
    icon: Briefcase,
    href: "/funcoes",
    path: "/funcoes",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Checklists",
    icon: CheckSquare,
    href: "/templates",
    path: "/templates",
    roles: ["superadmin", "admin", "user"]
  },
  {
    title: "Avaliações",
    icon: UserCheck,
    href: "/avaliacoes",
    path: "/avaliacoes",
    roles: ["superadmin", "admin", "user"]
  },
  {
    title: "Resultados",
    icon: TrendingUp,
    href: "/resultados",
    path: "/resultados",
    roles: ["superadmin", "admin", "user"]
  },
  {
    title: "Gestão de Riscos",
    icon: Shield,
    href: "/gestao-riscos",
    path: "/gestao-riscos",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Plano de Ação",
    icon: FileText,
    href: "/plano-acao",
    path: "/plano-acao",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    href: "/relatorios",
    path: "/relatorios",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Faturamento",
    icon: CreditCard,
    href: "/faturamento",
    path: "/faturamento",
    roles: ["superadmin"]
  }
];
