import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Filter, Search, Users, Building2, Calendar, BarChart3 } from "lucide-react";
import { AssessmentResultsTable } from "@/components/assessments/assessment-results/AssessmentResultsTable";
import { useAuth } from '@/hooks/useAuth';

export default function AssessmentResults() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({
    company: "",
    sector: "",
    dateRange: null,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (newFilterCriteria: any) => {
    setFilterCriteria(newFilterCriteria);
  };

  const handleDownload = () => {
    console.log("Download requested with filters:", filterCriteria);
  };

  return (
    <div className="w-full max-w-none p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resultados das Avaliações</h1>
          <p className="text-muted-foreground">
            Analise os resultados das avaliações psicossociais e gere relatórios
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Dados
        </Button>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6">
          <TabsTrigger value="results">
            <FileText className="h-4 w-4 mr-2" />
            Resultados
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Análises
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Calendar className="h-4 w-4 mr-2" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="w-full space-y-6">
          {/* Search and Filters */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar resultados..."
                className="border rounded-md px-3 py-2 w-64"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </div>

          {/* Assessment Results Table */}
          <AssessmentResultsTable />
        </TabsContent>

        <TabsContent value="analytics" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Análise Detalhada</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Em breve: Gráficos interativos e análises aprofundadas dos
                resultados das avaliações.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Geração de Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Em breve: Ferramenta para gerar relatórios personalizados com
                base nos resultados das avaliações.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
