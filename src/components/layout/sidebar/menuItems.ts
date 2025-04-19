
import { Building2, BarChart3, Users, FolderKanban, UserRound, ClipboardCheck, ClipboardList, FileText } from "lucide-react";

export const mainMenuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    path: "/",
    roles: ["superadmin", "admin", "evaluator"]
  },
  {
    title: "Empresas",
    icon: Building2,
    path: "/empresas",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Funcionários",
    icon: Users,
    path: "/funcionarios",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Setores",
    icon: FolderKanban,
    path: "/setores",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Funções",
    icon: UserRound,
    path: "/funcoes",
    roles: ["superadmin", "admin"]
  },
  {
    title: "Checklists",
    icon: ClipboardCheck,
    path: "/checklists",
    roles: ["superadmin", "admin", "evaluator"]
  },
  {
    title: "Avaliações",
    icon: ClipboardList,
    path: "/avaliacoes",
    roles: ["superadmin", "admin", "evaluator"]
  },
  {
    title: "Relatórios",
    icon: FileText,
    path: "/relatorios",
    roles: ["superadmin", "admin"]
  },
];
