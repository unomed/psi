
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface EditAssessmentButtonProps {
  onEdit: () => void;
  disabled?: boolean;
  assessmentStatus: string;
}

export function EditAssessmentButton({ 
  onEdit, 
  disabled = false, 
  assessmentStatus 
}: EditAssessmentButtonProps) {
  const { userRole } = useAuth();
  
  // Only allow editing for admin/superadmin and non-completed assessments
  const canEdit = (userRole === 'admin' || userRole === 'superadmin') && 
                  assessmentStatus !== 'completed';

  if (!canEdit) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onEdit}
      disabled={disabled}
      title="Editar agendamento"
    >
      <Edit className="h-4 w-4 mr-1" />
      Editar
    </Button>
  );
}
