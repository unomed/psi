
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  ClipboardCheck,
  ClipboardList,
  FileText,
  FolderKanban,
  Settings,
  Users,
  UserRound,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserProfileMenu } from "./UserProfileMenu";
import { useAuth } from "@/contexts/AuthContext";

// Menu items with their icons, routes and allowed roles
const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    path: "/",
    roles: ["superadmin", "admin", "evaluator"] // Todos podem acessar
  },
  {
    title: "Empresas",
    icon: Building2,
    path: "/empresas",
    roles: ["superadmin", "admin"] // Apenas superadmin e admin
  },
  {
    title: "Funcionários",
    icon: Users,
    path: "/funcionarios",
    roles: ["superadmin", "admin"] // Apenas superadmin e admin
  },
  {
    title: "Setores",
    icon: FolderKanban,
    path: "/setores",
    roles: ["superadmin", "admin"] // Apenas superadmin e admin
  },
  {
    title: "Funções",
    icon: UserRound,
    path: "/funcoes",
    roles: ["superadmin", "admin"] // Apenas superadmin e admin
  },
  {
    title: "Checklists",
    icon: ClipboardCheck,
    path: "/checklists",
    roles: ["superadmin", "admin", "evaluator"] // Todos podem acessar
  },
  {
    title: "Avaliações",
    icon: ClipboardList,
    path: "/avaliacoes",
    roles: ["superadmin", "admin", "evaluator"] // Todos podem acessar
  },
  {
    title: "Relatórios",
    icon: FileText,
    path: "/relatorios",
    roles: ["superadmin", "admin"] // Apenas superadmin e admin
  },
  {
    title: "Configurações",
    icon: Settings,
    path: "/configuracoes",
    roles: ["superadmin"] // Apenas superadmin
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();

  // Filtrar itens de menu com base na função do usuário
  const filteredMenuItems = menuItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="px-6 py-5 flex items-center border-b">
        <h2 className="text-xl font-bold">PSI Safe</h2>
        <span className="ml-2 text-xs bg-psi-blue-100 text-psi-blue-800 px-2 py-0.5 rounded-full">
          NR 01
        </span>
        <div className="ml-auto">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col h-[calc(100%-60px)]">
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex items-center w-full",
                      location.pathname === item.path && "bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <UserProfileMenu />
      </SidebarContent>
    </Sidebar>
  );
}
