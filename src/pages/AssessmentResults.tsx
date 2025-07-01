
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText } from "lucide-react";
import { AssessmentResultsTableReal } from "@/components/assessments/assessment-results/AssessmentResultsTableReal";
import { AssessmentAnalytics } from "@/components/assessments/assessment-analytics/AssessmentAnalytics";
import { CompanySelectorReal } from "@/components/dashboard/CompanySelectorReal";
import { useAuth } from "@/contexts/AuthContext";

export default function AssessmentResults() {
  const { userRole, userCompanies } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(() => {
    // Auto-select first company for non-superadmin users
    if (userRole !== 'superadmin' && userCompanies.length > 0) {
      return userCompanies[0].companyId;
    }
    return null;
  });

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId || null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resultados das Avaliações</h1>
        <p className="text-muted-foreground">
          Visualize e analise os resultados das avaliações psicossociais realizadas
        </p>
      </div>

      <CompanySelectorReal
        selectedCompanyId={selectedCompanyId}
        onCompanyChange={handleCompanyChange}
      />

      {/* Tabs */}
      <Tabs defaultValue="results" className="space-y-6">
        <TabsList>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resultados
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Análises
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <AssessmentResultsTableReal companyId={selectedCompanyId} />
        </TabsContent>

        <TabsContent value="analytics">
          <AssessmentAnalytics companyId={selectedCompanyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
