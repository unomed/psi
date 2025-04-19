
import { Gauge, Server, Mail, Bell, Calendar, Shield, Users } from "lucide-react";

export const settingsMenuItems = [
  {
    title: "Critérios de Avaliação",
    icon: Gauge,
    path: "/configuracoes/criterios",
    roles: ["superadmin"]
  },
  {
    title: "Servidor de Email",
    icon: Server,
    path: "/configuracoes/servidor-email",
    roles: ["superadmin"]
  },
  {
    title: "E-mails",
    icon: Mail,
    path: "/configuracoes/emails",
    roles: ["superadmin"]
  },
  {
    title: "Notificações",
    icon: Bell,
    path: "/configuracoes/notificacoes",
    roles: ["superadmin"]
  },
  {
    title: "Periodicidade",
    icon: Calendar,
    path: "/configuracoes/periodicidade",
    roles: ["superadmin"]
  },
  {
    title: "Gerenciar Permissões",
    icon: Shield,
    path: "/configuracoes/permissoes",
    roles: ["superadmin"]
  },
  {
    title: "Perfil de Usuários",
    icon: Users,
    path: "/configuracoes/usuarios",
    roles: ["superadmin"]
  }
];
