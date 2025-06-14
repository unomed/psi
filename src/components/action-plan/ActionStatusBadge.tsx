
import { ActionStatus } from "@/types/actionPlan";

interface ActionStatusBadgeProps {
  status: ActionStatus;
}

export function ActionStatusBadge({ status }: ActionStatusBadgeProps) {
  const getStatusConfig = (status: ActionStatus) => {
    switch (status) {
      case "pending":
        return { label: "Pendente", className: "px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs" };
      case "in_progress":
        return { label: "Em andamento", className: "px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs" };
      case "completed":
        return { label: "Concluída", className: "px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs" };
      case "canceled":
        return { label: "Cancelada", className: "px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs" };
      default:
        return { label: status, className: "px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs" };
    }
  };

  const config = getStatusConfig(status);
  
  return <span className={config.className}>{config.label}</span>;
}
