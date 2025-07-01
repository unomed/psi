
import { CandidateTagsSection } from "./CandidateTagsSection";
import { TechnicalTagsSection } from "./tags/TechnicalTagsSection";

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

      {/* Seção de competências técnicas (para funcionários) */}
      {!isCandidate && (
        <TechnicalTagsSection
          employeeId={employeeId}
          selectedRole={selectedRole}
          onTagsChange={onTagsChange}
        />
      )}
    </div>
  );
}
