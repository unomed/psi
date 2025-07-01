
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteAssessmentButtonProps {
  onDelete: () => Promise<void>;
  disabled?: boolean;
  assessmentStatus: string;
  employeeName?: string;
}

export function DeleteAssessmentButton({ 
  onDelete, 
  disabled = false, 
  assessmentStatus,
  employeeName = "funcionário"
}: DeleteAssessmentButtonProps) {
  const { userRole } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Superadmin pode deletar qualquer avaliação, admin só pode deletar não completas
  const canDelete = userRole === 'superadmin' || 
                    (userRole === 'admin' && assessmentStatus !== 'completed');

  if (!canDelete) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
    } catch (error) {
      console.error("Erro na exclusão:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getWarningMessage = () => {
    if (assessmentStatus === 'completed') {
      return `Esta avaliação já foi concluída por ${employeeName}. Todos os dados relacionados (emails, respostas) serão permanentemente removidos. Esta ação não pode ser desfeita.`;
    }
    return `Tem certeza que deseja excluir esta avaliação para ${employeeName}? Esta ação não pode ser desfeita.`;
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={disabled || isDeleting}
          title="Excluir agendamento"
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {isDeleting ? "Excluindo..." : "Excluir"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            {getWarningMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Sim, Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
