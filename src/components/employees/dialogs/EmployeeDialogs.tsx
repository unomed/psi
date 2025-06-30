
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmployeeForm } from "../EmployeeForm";
import { Employee, EmployeeFormData } from "@/types";

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  employee?: Employee;
}

export function EmployeeDialogs({
  isOpen,
  onClose,
  onSubmit,
  employee
}: EmployeeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{employee ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
        </DialogHeader>
        <EmployeeForm onSubmit={onSubmit} onClose={onClose} employee={employee} />
      </DialogContent>
    </Dialog>
  );
}
