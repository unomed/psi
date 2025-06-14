
import { Users, Settings as SettingsIcon, Key, Mail } from "lucide-react";

export const settingsMenuItems = [
  {
    title: "Perfil de Usuários",
    icon: Users,
    path: "/configuracoes/usuarios",
    roles: ["superadmin"],
    permission: "edit_settings"
  },
  {
    title: "Permissões",
    icon: Key,
    path: "/configuracoes/permissoes",
    roles: ["superadmin"],
    permission: "edit_settings"
  },
  {
    title: "Configurações de Email",
    icon: Mail,
    path: "/configuracoes/email-server",
    roles: ["superadmin"],
    permission: "edit_settings"
  },
  {
    title: "Templates de Email",
    icon: Mail,
    path: "/configuracoes/email-templates",
    roles: ["superadmin"],
    permission: "edit_settings"
  },
  {
    title: "Critérios de Avaliação",
    icon: SettingsIcon,
    path: "/configuracoes/criterios",
    roles: ["superadmin"],
    permission: "edit_settings"
  },
  {
    title: "Periodicidade",
    icon: SettingsIcon,
    path: "/configuracoes/periodicidade",
    roles: ["superadmin"],
    permission: "edit_settings"
  },
  {
    title: "Notificações",
    icon: SettingsIcon,
    path: "/configuracoes/notificacoes",
    roles: ["superadmin"],
    permission: "edit_settings"
  }
];
