
import { Action } from "@/types/actionPlan";

export const mockActions: Action[] = [
  {
    id: "ACT001",
    description: "Implementar sistema de priorização de tarefas no setor de atendimento",
    responsible: "Maria Silva (RH)",
    dueDate: "15/06/2025",
    status: "in_progress",
    riskId: "PS001",
    riskDescription: "Sobrecarga de trabalho no setor de atendimento"
  },
  {
    id: "ACT002",
    description: "Realizar reuniões semanais com equipe para distribuição de demandas",
    responsible: "Carlos Mendes (Supervisor)",
    dueDate: "01/06/2025",
    status: "completed",
    riskId: "PS001",
    riskDescription: "Sobrecarga de trabalho no setor de atendimento"
  },
  {
    id: "ACT003",
    description: "Implementar pausas obrigatórias no sistema de atendimento",
    responsible: "Joana Lima (TI)",
    dueDate: "30/06/2025",
    status: "pending",
    riskId: "PS001",
    riskDescription: "Sobrecarga de trabalho no setor de atendimento"
  },
  {
    id: "ACT004",
    description: "Programa de desenvolvimento de lideranças",
    responsible: "João Pereira (SESMT)",
    dueDate: "30/07/2025",
    status: "in_progress",
    riskId: "PS003",
    riskDescription: "Assédio moral na equipe de vendas"
  },
  {
    id: "ACT005",
    description: "Reavaliação de funções com baixa autonomia",
    responsible: "Ana Oliveira (Produção)",
    dueDate: "15/08/2025",
    status: "pending",
    riskId: "PS007",
    riskDescription: "Falta de autonomia na equipe de produção"
  }
];
