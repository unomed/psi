
import { 
  Settings, 
  Users, 
  Mail, 
  Server, 
  FileText, 
  Bell, 
  Calendar,
  Shield,
  CheckSquare,
  Bot
} from "lucide-react";

export const settingsMenuItems = [
  {
    title: "Critérios de Avaliação",
    path: "/configuracoes/criterios",
    icon: CheckSquare,
    roles: ["admin", "superadmin"],
    permission: "view_settings"
  },
  {
    title: "Usuários",
    path: "/configuracoes/usuarios", 
    icon: Users,
    roles: ["admin", "superadmin"],
    permission: "view_settings"
  },
  {
    title: "Permissões",
    path: "/configuracoes/permissoes",
    icon: Shield,
    roles: ["superadmin"],
    permission: "edit_settings"
  },
  {
    title: "Email",
    path: "/configuracoes/email",
    icon: Mail,
    roles: ["admin", "superadmin"],
    permission: "view_settings"
  },
  {
    title: "Servidor de Email",
    path: "/configuracoes/email-server",
    icon: Server,
    roles: ["admin", "superadmin"],
    permission: "view_settings"
  },
  {
    title: "Templates de Email",
    path: "/configuracoes/email-templates",
    icon: FileText,
    roles: ["admin", "superadmin"],
    permission: "view_settings"
  },
  {
    title: "Notificações",
    path: "/configuracoes/notificacoes",
    icon: Bell,
    roles: ["admin", "superadmin"],
    permission: "view_settings"
  },
  {
    title: "Periodicidade",
    path: "/configuracoes/periodicidade",
    icon: Calendar,
    roles: ["admin", "superadmin"],
    permission: "view_settings"
  },
  {
    title: "Automação Psicossocial",
    path: "/configuracoes/automacao-psicossocial",
    icon: Bot,
    roles: ["admin", "superadmin"],
    permission: "view_settings"
  }
];
