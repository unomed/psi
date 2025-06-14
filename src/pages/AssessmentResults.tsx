
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, TrendingUp } from "lucide-react";
import { AssessmentResultsTable } from "@/components/assessments/assessment-results/AssessmentResultsTable";
import { AssessmentAnalytics } from "@/components/assessments/assessment-analytics/AssessmentAnalytics";
import { DashboardCompanySelector } from "@/components/dashboard/DashboardCompanySelector";

export default function AssessmentResults() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedCompany');
    return saved || null;
  });

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    localStorage.setItem('selectedCompany', companyId);
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

      {/* Company Selector */}
      <DashboardCompanySelector 
        selectedCompany={selectedCompany}
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
          <AssessmentResultsTable companyId={selectedCompany} />
        </TabsContent>

        <TabsContent value="analytics">
          <AssessmentAnalytics companyId={selectedCompany} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
