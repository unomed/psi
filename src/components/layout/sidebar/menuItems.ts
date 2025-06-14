
import { 
  Building, 
  Users, 
  Briefcase, 
  MapPin, 
  CheckSquare, 
  BarChart3, 
  FileText, 
  ClipboardList,
  UserCheck,
  Calendar,
  DollarSign
} from "lucide-react";
import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
    roles: ["superadmin", "admin", "manager", "user"]
  },
  {
    title: "Empresas",
    icon: Building,
    href: "/empresas",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Funcionários", 
    icon: Users,
    href: "/funcionarios",
    roles: ["superadmin", "admin", "manager"]
  },
  {
    title: "Setores",
    icon: MapPin,
    href: "/setores",
    roles: ["superadmin", "admin", "manager"]
  },
  {
    title: "Funções",
    icon: Briefcase,
    href: "/funcoes",
    roles: ["superadmin", "admin", "manager"]
  },
  {
    title: "Templates",
    icon: CheckSquare,
    href: "/templates",
    roles: ["superadmin", "admin", "manager", "user"]
  },
  {
    title: "Avaliações",
    icon: UserCheck,
    href: "/avaliacoes",
    roles: ["superadmin", "admin", "manager", "user"]
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    href: "/agendamentos", 
    roles: ["superadmin", "admin", "manager"]
  },
  {
    title: "Resultados",
    icon: BarChart3,
    href: "/resultados",
    roles: ["superadmin", "admin", "manager"]
  },
  {
    title: "Faturamento",
    icon: DollarSign,
    href: "/faturamento",
    roles: ["superadmin"]
  },
  {
    title: "Gestão de Riscos",
    icon: FileText,
    href: "/gestao-riscos",
    roles: ["superadmin", "admin", "manager"]
  },
  {
    title: "Plano de Ação",
    icon: ClipboardList,
    href: "/plano-acao",
    roles: ["superadmin", "admin", "manager"]
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    href: "/relatorios",
    roles: ["superadmin", "admin", "manager"]
  }
];
