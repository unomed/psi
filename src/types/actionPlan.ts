
export type ActionStatus = "pending" | "in_progress" | "completed" | "canceled";

export type Action = {
  id: string;
  description: string;
  responsible: string;
  dueDate: string;
  status: ActionStatus;
  riskId?: string;
  riskDescription?: string;
};

export type ActionFilters = {
  department: string;
  responsibles: string;
  priority: string;
};
