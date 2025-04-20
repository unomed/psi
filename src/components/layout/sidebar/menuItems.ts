
import { BarChart3, Building2, Users, FolderKanban, ClipboardList, FileCheck, PieChart } from "lucide-react";

export const mainMenuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    path: "/dashboard",
    permission: "view_dashboard",
    roles: ["superadmin", "admin", "evaluator", "user", "profissionais"]
  },
  {
    title: "Empresas",
    icon: Building2,
    path: "/empresas",
    permission: "view_companies",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Funcionários",
    icon: Users,
    path: "/funcionarios",
    permission: "view_employees",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Setores",
    icon: FolderKanban,
    path: "/setores",
    permission: "view_sectors",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Funções",
    icon: FolderKanban,
    path: "/funcoes",
    permission: "view_functions",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Checklists",
    icon: ClipboardList,
    path: "/checklists",
    permission: "view_checklists",
    roles: ["superadmin", "admin", "evaluator"]
  },
  {
    title: "Avaliações",
    icon: FileCheck,
    path: "/avaliacoes",
    permission: "view_assessments",
    roles: ["superadmin", "admin", "evaluator", "profissionais"]
  },
  {
    title: "Relatórios",
    icon: PieChart,
    path: "/relatorios",
    permission: "view_reports",
    roles: ["superadmin", "admin"]
  }
];
