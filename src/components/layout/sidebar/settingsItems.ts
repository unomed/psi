
import { Shield, Clock, Mail, Bell, Users, Settings, Brain, Zap, FileBarChart } from "lucide-react";

export const settingsItems = [
  {
    title: "Critérios de Avaliação",
    icon: Settings,
    url: "/configuracoes/criterios-avaliacao"
  },
  {
    title: "Periodicidade",
    icon: Clock,
    url: "/configuracoes/periodicidade"
  },
  {
    title: "Servidor de Email",
    icon: Mail,
    url: "/configuracoes/servidor-email"
  },
  {
    title: "Templates de Email",
    icon: Mail,
    url: "/configuracoes/templates-email"
  },
  {
    title: "Notificações",
    icon: Bell,
    url: "/configuracoes/notificacoes"
  },
  {
    title: "Permissões",
    icon: Shield,
    url: "/configuracoes/permissoes"
  },
  {
    title: "Gerenciamento de Usuários",
    icon: Users,
    url: "/configuracoes/usuarios"
  },
  {
    title: "Automação Psicossocial",
    icon: Brain,
    url: "/configuracoes/automacao-psicossocial"
  },
  {
    title: "Automação Avançada",
    icon: Zap,
    url: "/configuracoes/automacao-avancada"
  },
  {
    title: "Auditoria",
    icon: FileBarChart,
    url: "/configuracoes/auditoria"
  }
];
