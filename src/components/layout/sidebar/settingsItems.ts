
import { Settings, Bell, Mail, Zap, FileText, Shield, Users, Lock } from "lucide-react";
import type { SettingsMenuItem } from "./types";

export const settingsItems: SettingsMenuItem[] = [
  {
    title: "Notificações",
    href: "/configuracoes/notificacoes",
    icon: Bell,
  },
  {
    title: "Email",
    href: "/configuracoes/email", 
    icon: Mail,
  },
  {
    title: "Automação Psicossocial",
    href: "/configuracoes/automacao-psicossocial",
    icon: Zap,
  },
  {
    title: "Relatórios NR-01",
    href: "/configuracoes/relatorios-nr01",
    icon: Shield,
  },
  {
    title: "Usuários",
    href: "/configuracoes/usuarios",
    icon: Users,
  },
  {
    title: "Permissões",
    href: "/configuracoes/permissoes", 
    icon: Lock,
  },
];
