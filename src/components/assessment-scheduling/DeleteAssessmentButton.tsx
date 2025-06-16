
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DeleteAssessmentButtonProps {
  onDelete: () => void;
  disabled?: boolean;
  assessmentStatus: string;
}

export function DeleteAssessmentButton({ 
  onDelete, 
  disabled = false, 
  assessmentStatus 
}: DeleteAssessmentButtonProps) {
  const { userRole } = useAuth();
  
  // Only allow deleting for admin/superadmin and non-completed assessments
  const canDelete = (userRole === 'admin' || userRole === 'superadmin') && 
                    assessmentStatus !== 'completed';

  if (!canDelete) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onDelete}
      disabled={disabled}
      title="Excluir agendamento"
      className="text-red-500 hover:text-red-700"
    >
      <Trash2 className="h-4 w-4 mr-1" />
      Excluir
    </Button>
  );
}
