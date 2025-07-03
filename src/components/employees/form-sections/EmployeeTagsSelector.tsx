
import { CandidateTagsSection } from "./CandidateTagsSection";

interface EmployeeTagsSelectorProps {
  employeeId?: string;
  selectedRole: string | null;
  employeeType?: string;
  onTagsChange?: (tags: string[]) => void;
}

export function EmployeeTagsSelector({ 
  employeeId, 
  selectedRole, 
  employeeType, 
  onTagsChange 
}: EmployeeTagsSelectorProps) {
  const isCandidate = employeeType === 'candidato';

  return (
    <div className="space-y-6">
      {/* Seção específica para candidatos */}
      <CandidateTagsSection 
        employeeId={employeeId}
        onTagsChange={onTagsChange}
        isCandidate={isCandidate}
      />

      {/* Seção simplificada para funcionários */}
      {!isCandidate && employeeId && (
        <div className="space-y-4 border p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-lg font-semibold">Tags do Funcionário</label>
              <p className="text-sm text-muted-foreground mt-1">Tags técnicas e competências</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Sistema de tags simplificado
          </div>
        </div>
      )}
    </div>
  );
}
