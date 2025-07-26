import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, FileText, Eye, Download } from "lucide-react";
import { useAssessmentResultsData } from "@/hooks/useAssessmentResultsData";
import { useCompany } from "@/contexts/CompanyContext";
import { AssessmentResultDialog } from "@/components/assessments/assessment-results/AssessmentResultDialog";

export default function AssessmentResults() {
  const { selectedCompanyId } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("todos");
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  const { data: results = [], isLoading } = useAssessmentResultsData(selectedCompanyId);

  // Verificação se empresa está selecionada
  if (!selectedCompanyId) {
    return (
      <div className="text-center p-8">
        <div>
          <h1 className="text-3xl font-bold">Resultados das Avaliações</h1>
          <p className="text-muted-foreground">
            Visualize e analise os resultados das avaliações realizadas
          </p>
        </div>
        <div className="mt-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Selecione uma empresa</h3>
          <p className="text-muted-foreground">
            Para ver os resultados, selecione uma empresa no canto superior direito.
          </p>
        </div>
      </div>
    );
  }

  const filteredResults = results.filter(result => {
    const matchesSearch = (result.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (result.templateTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === "todos" || result.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const handleViewResult = (result: any) => {
    setSelectedResult(result);
    setIsResultDialogOpen(true);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Alto': return 'bg-red-100 text-red-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Baixo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resultados das Avaliações</h1>
          <p className="text-muted-foreground">
            Visualize e analise os resultados das avaliações realizadas
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>


      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por funcionário ou template..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os riscos</SelectItem>
            <SelectItem value="Alto">Alto risco</SelectItem>
            <SelectItem value="Médio">Médio risco</SelectItem>
            <SelectItem value="Baixo">Baixo risco</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando resultados...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum resultado encontrado</p>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou realize algumas avaliações
            </p>
          </div>
        ) : (
          filteredResults.map(result => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{result.employeeName}</CardTitle>
                    <CardDescription>{result.templateTitle}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getRiskLevelColor(result.riskLevel)}>
                      {result.riskLevel}
                    </Badge>
                    <Badge variant="outline">
                      {result.templateType.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Concluído em: {new Date(result.completedAt).toLocaleDateString('pt-BR')}
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleViewResult(result)}
                  >
                    <Eye className="mr-2 h-3 w-3" />
                    Ver Resultado
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AssessmentResultDialog
        result={selectedResult}
        isOpen={isResultDialogOpen}
        onClose={() => {
          setIsResultDialogOpen(false);
          setSelectedResult(null);
        }}
      />
    </div>
  );
}