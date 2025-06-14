
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  MapPin, 
  UserCog, 
  FileText, 
  Calendar,
  BarChart3, 
  ClipboardList, 
  Shield, 
  CreditCard,
  Settings
} from "lucide-react";
import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["superadmin", "admin", "manager", "user"],
  },
  {
    title: "Empresas", 
    href: "/empresas",
    icon: Building,
    roles: ["superadmin"],
  },
  {
    title: "Funcionários",
    href: "/funcionarios", 
    icon: Users,
    roles: ["superadmin", "admin", "manager"],
  },
  {
    title: "Setores",
    href: "/setores",
    icon: MapPin,
    roles: ["superadmin", "admin", "manager"],
  },
  {
    title: "Funções",
    href: "/funcoes",
    icon: UserCog,
    roles: ["superadmin", "admin", "manager"],
  },
  {
    title: "Templates",
    href: "/templates",
    icon: FileText,
    roles: ["superadmin", "admin", "manager"],
  },
  {
    title: "Agendamentos",
    href: "/agendamentos",
    icon: Calendar,
    roles: ["superadmin", "admin", "manager"],
  },
  {
    title: "Resultados",
    href: "/resultados",
    icon: BarChart3,
    roles: ["superadmin", "admin", "manager"],
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: ClipboardList,
    roles: ["superadmin", "admin", "manager"],
  },
  {
    title: "Plano de Ação",
    href: "/plano-acao",
    icon: ClipboardList,
    roles: ["superadmin", "admin", "manager"],
  },
  {
    title: "Gestão de Riscos",
    href: "/gestao-riscos",
    icon: Shield,
    roles: ["superadmin", "admin", "manager"],
  },
  {
    title: "Faturamento",
    href: "/faturamento",
    icon: CreditCard,
    roles: ["superadmin"],
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    roles: ["superadmin", "admin"],
  },
];
