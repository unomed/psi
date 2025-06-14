
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
    path: "/dashboard"
  },
  {
    title: "Empresas",
    icon: Building2,
    path: "/empresas"
  },
  {
    title: "Funcionários",
    icon: Users,
    path: "/funcionarios"
  },
  {
    title: "Setores",
    icon: MapPin,
    path: "/setores"
  },
  {
    title: "Funções",
    icon: Briefcase,
    path: "/funcoes"
  },
  {
    title: "Checklists",
    icon: CheckSquare,
    path: "/checklists"
  },
  {
    title: "Avaliações",
    icon: UserCheck,
    path: "/avaliacoes"
  },
  {
    title: "Resultados",
    icon: TrendingUp,
    path: "/resultados"
  },
  {
    title: "Gestão de Riscos",
    icon: Shield,
    path: "/gestao-riscos"
  },
  {
    title: "Plano de Ação",
    icon: FileText,
    path: "/plano-acao"
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    path: "/relatorios"
  },
  {
    title: "Faturamento",
    icon: CreditCard,
    path: "/faturamento"
  }
];
