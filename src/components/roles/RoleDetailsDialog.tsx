
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { RoleData } from "./RoleCard";

interface RoleDetailsDialogProps {
  role: RoleData | null;
  onOpenChange: (open: boolean) => void;
}

function getRiskLevelDisplay(level: string) {
  switch (level) {
    case "high":
      return "Alto";
    case "medium":
      return "Médio";
    case "low":
      return "Baixo";
    default:
      return level;
  }
}

export function RoleDetailsDialog({ role, onOpenChange }: RoleDetailsDialogProps) {
  return (
    <Dialog open={!!role} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes da Função</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Nome</h3>
            <p>{role?.name}</p>
          </div>
          {role?.description && (
            <div>
              <h3 className="font-semibold">Descrição</h3>
              <p>{role.description}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold">Nível de Risco</h3>
            <p>{role?.riskLevel ? getRiskLevelDisplay(role.riskLevel) : "Não definido"}</p>
          </div>
          {role?.requiredSkills && role.requiredSkills.length > 0 && (
            <div>
              <h3 className="font-semibold">Habilidades Requeridas</h3>
              <ul className="list-disc pl-4">
                {role.requiredSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
