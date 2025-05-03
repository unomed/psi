
import { Gauge, Server, Mail, Bell, Calendar, Shield, Users } from "lucide-react";

export const settingsMenuItems = [
  {
    title: "Critérios de Avaliação",
    icon: Gauge,
    path: "/configuracoes/criterios",
    permission: "view_settings",
    roles: ["superadmin"]
  },
  {
    title: "Email",
    icon: Mail,
    path: "/configuracoes/email",
    permission: "view_settings",
    roles: ["superadmin"]
  },
  {
    title: "Servidor de Email",
    icon: Server,
    path: "/configuracoes/servidor-email",
    permission: "view_settings",
    roles: ["superadmin"]
  },
  {
    title: "E-mails",
    icon: Mail,
    path: "/configuracoes/emails",
    permission: "view_settings",
    roles: ["superadmin"]
  },
  {
    title: "Notificações",
    icon: Bell,
    path: "/configuracoes/notificacoes",
    permission: "view_settings",
    roles: ["superadmin"]
  },
  {
    title: "Periodicidade",
    icon: Calendar,
    path: "/configuracoes/periodicidade",
    permission: "view_settings",
    roles: ["superadmin"]
  },
  {
    title: "Gerenciar Permissões",
    icon: Shield,
    path: "/configuracoes/permissoes",
    permission: "edit_settings",
    roles: ["superadmin"]
  },
  {
    title: "Perfil de Usuários",
    icon: Users,
    path: "/configuracoes/usuarios",
    permission: "view_settings",
    roles: ["superadmin"]
  }
];
