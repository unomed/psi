
import { 
  Users, 
  Shield, 
  Mail, 
  Server, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Zap, 
  Cpu,
  UserCheck
} from "lucide-react";
import type { SubMenuItem } from "./types";

export const settingsItems: SubMenuItem[] = [
  {
    title: "Usuários",
    href: "/configuracoes/usuarios",
    icon: Users,
    roles: ["superadmin", "admin"],
    permission: "manage_users"
  },
  {
    title: "Permissões",
    href: "/configuracoes/permissoes",
    icon: Shield,
    roles: ["superadmin"],
    permission: "manage_permissions"
  },
  {
    title: "Portal do Funcionário",
    href: "/configuracoes/portal-funcionario",
    icon: UserCheck,
    roles: ["superadmin", "admin"],
    permission: "manage_users"
  },
  {
    title: "Servidor de Email",
    href: "/configuracoes/email-servidor",
    icon: Server,
    roles: ["superadmin", "admin"],
    permission: "manage_email_settings"
  },
  {
    title: "Templates de Email",
    href: "/configuracoes/email-templates",
    icon: Mail,
    roles: ["superadmin", "admin"],
    permission: "manage_email_settings"
  },
  {
    title: "Notificações",
    href: "/configuracoes/notificacoes",
    icon: MessageSquare,
    roles: ["superadmin", "admin"],
    permission: "manage_notifications"
  },
  {
    title: "Periodicidade",
    href: "/configuracoes/periodicidade",
    icon: Clock,
    roles: ["superadmin", "admin"],
    permission: "manage_assessment_settings"
  },
  {
    title: "Critérios de Avaliação",
    href: "/configuracoes/criterios-avaliacao",
    icon: CheckCircle,
    roles: ["superadmin", "admin"],
    permission: "manage_assessment_settings"
  },
  {
    title: "Automação Psicossocial",
    href: "/configuracoes/automacao-psicossocial",
    icon: Zap,
    roles: ["superadmin", "admin"],
    permission: "manage_automation"
  },
  {
    title: "Automação Avançada",
    href: "/configuracoes/automacao-avancada",
    icon: Cpu,
    roles: ["superadmin"],
    permission: "manage_advanced_automation"
  }
];
