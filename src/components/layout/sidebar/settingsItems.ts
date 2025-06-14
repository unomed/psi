
import { Settings, Bell, Mail, Zap, FileText, Shield, Users, Lock } from "lucide-react";
import type { MenuItem } from "./types";

export const settingsItems: MenuItem[] = [
  {
    title: "Notificações",
    url: "/configuracoes/notificacoes",
    icon: Bell,
  },
  {
    title: "Email",
    url: "/configuracoes/email", 
    icon: Mail,
  },
  {
    title: "Automação Psicossocial",
    url: "/configuracoes/automacao-psicossocial",
    icon: Zap,
  },
  {
    title: "Relatórios NR-01",
    url: "/configuracoes/relatorios-nr01",
    icon: Shield,
  },
  {
    title: "Usuários",
    url: "/configuracoes/usuarios",
    icon: Users,
  },
  {
    title: "Permissões",
    url: "/configuracoes/permissoes", 
    icon: Lock,
  },
];
