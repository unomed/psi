
import { Badge } from "@/components/ui/badge";
import { Assessment } from "@/components/dashboard/assessments/types";

interface AssessmentTableProps {
  assessments: Assessment[];
}

export function AssessmentTable({ assessments }: AssessmentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-3 text-left font-medium">Funcionário</th>
            <th className="py-3 text-left font-medium">Setor</th>
            <th className="py-3 text-left font-medium">Data</th>
            <th className="py-3 text-left font-medium">Nível de Risco</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((assessment) => (
            <tr key={assessment.id} className="border-b last:border-0">
              <td className="py-3">{assessment.employee}</td>
              <td className="py-3">{assessment.sector}</td>
              <td className="py-3">
                {new Date(assessment.date).toLocaleDateString('pt-BR')}
              </td>
              <td className="py-3">
                <Badge
                  variant="outline"
                  className={
                    assessment.riskLevel === "Alto"
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : assessment.riskLevel === "Médio"
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      : "bg-green-100 text-green-800 hover:bg-green-100"
                  }
                >
                  {assessment.riskLevel}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
