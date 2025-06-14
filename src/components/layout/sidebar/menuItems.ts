
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
  },
  {
    title: "Empresas", 
    href: "/empresas",
    icon: Building,
  },
  {
    title: "Funcionários",
    href: "/funcionarios", 
    icon: Users,
  },
  {
    title: "Setores",
    href: "/setores",
    icon: MapPin,
  },
  {
    title: "Funções",
    href: "/funcoes",
    icon: UserCog,
  },
  {
    title: "Templates",
    href: "/templates",
    icon: FileText,
  },
  {
    title: "Agendamentos",
    href: "/agendamentos",
    icon: Calendar,
  },
  {
    title: "Resultados",
    href: "/resultados",
    icon: BarChart3,
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: ClipboardList,
  },
  {
    title: "Plano de Ação",
    href: "/plano-acao",
    icon: ClipboardList,
  },
  {
    title: "Gestão de Riscos",
    href: "/gestao-riscos",
    icon: Shield,
  },
  {
    title: "Faturamento",
    href: "/faturamento",
    icon: CreditCard,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    hasSubmenu: true,
  },
];
