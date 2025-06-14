
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  MapPin, 
  Briefcase, 
  FileText, 
  ClipboardList, 
  Calendar,
  BarChart3,
  ListChecks,
  Settings 
} from "lucide-react";

export interface MenuItem {
  label: string;
  icon: any;
  href: string;
  requiredRole?: string;
  requireCompanyAccess?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Empresas",
    icon: Building2,
    href: "/empresas",
    requiredRole: "superadmin",
  },
  {
    label: "Funcionários",
    icon: Users,
    href: "/funcionarios",
    requireCompanyAccess: true,
  },
  {
    label: "Setores",
    icon: MapPin,
    href: "/setores",
    requireCompanyAccess: true,
  },
  {
    label: "Funções",
    icon: Briefcase,
    href: "/funcoes",
    requireCompanyAccess: true,
  },
  {
    label: "Templates",
    icon: FileText,
    href: "/templates",
  },
  {
    label: "Avaliações",
    icon: ClipboardList,
    href: "/avaliacoes",
    requireCompanyAccess: true,
  },
  {
    label: "Agendamentos",
    icon: Calendar,
    href: "/agendamentos",
    requireCompanyAccess: true,
  },
  {
    label: "Resultados",
    icon: BarChart3,
    href: "/resultados",
    requireCompanyAccess: true,
  },
  {
    label: "Relatórios",
    icon: FileText,
    href: "/relatorios",
    requireCompanyAccess: true,
  },
  {
    label: "Plano de Ação",
    icon: ListChecks,
    href: "/plano-acao",
    requireCompanyAccess: true,
  },
];

// Export as mainMenuItems for compatibility
export const mainMenuItems = menuItems.map(item => ({
  title: item.label,
  icon: item.icon,
  path: item.href,
  roles: item.requiredRole ? [item.requiredRole] : ['admin', 'user', 'superadmin'],
  permission: 'view_dashboard'
}));
