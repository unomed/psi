
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, FileText, Search, Filter } from "lucide-react";
import { useAssessmentResultsData } from "@/hooks/useAssessmentResultsData";
import { AssessmentResultDialog } from "./AssessmentResultDialog";
import { formatDateTime } from "@/utils/dateFormat";

interface AssessmentResultsTableRealProps {
  companyId?: string | null;
}

export function AssessmentResultsTableReal({ companyId }: AssessmentResultsTableRealProps) {
  const { data: results = [], isLoading } = useAssessmentResultsData(companyId);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const handleViewResult = (result: any) => {
    setSelectedResult(result);
    setIsResultDialogOpen(true);
  };

  const handleExport = (result: any) => {
    console.log("Exportar resultado:", result.id);
    // TODO: Implement real export functionality
  };

  // Filter results based on search and filters
  const filteredResults = results.filter(result => {
    const matchesSearch = result.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.templateTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = filterRisk === "all" || result.riskLevel === filterRisk;
    const matchesType = filterType === "all" || result.templateType === filterType;
    
    return matchesSearch && matchesRisk && matchesType;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resultados das Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">Carregando resultados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resultados das Avaliações ({filteredResults.length})
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar funcionário ou avaliação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Nível de Risco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Riscos</SelectItem>
                  <SelectItem value="Alto">Alto Risco</SelectItem>
                  <SelectItem value="Médio">Risco Médio</SelectItem>
                  <SelectItem value="Baixo">Baixo Risco</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="disc">DISC</SelectItem>
                  <SelectItem value="psicossocial">Psicossocial</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {results.length === 0 
                ? "Nenhum resultado de avaliação encontrado" 
                : "Nenhum resultado corresponde aos filtros aplicados"
              }
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{result.employeeName}</h4>
                      <Badge
                        variant={
                          result.riskLevel === 'Alto' ? 'destructive' :
                          result.riskLevel === 'Médio' ? 'secondary' :
                          'default'
                        }
                      >
                        {result.riskLevel} Risco
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.templateType.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">{result.templateTitle}</span>
                      <span>{formatDateTime(result.completedAt)}</span>
                      <div className="flex gap-2">
                        {result.sector && <span>Setor: {result.sector}</span>}
                        {result.role && <span>• {result.role}</span>}
                      </div>
                    </div>
                    
                    {result.dominantFactor && (
                      <div className="mt-1 text-sm">
                        <span className="text-muted-foreground">Fator dominante: </span>
                        <span className="font-medium">{result.dominantFactor}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResult(result)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(result)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AssessmentResultDialog
        result={selectedResult}
        isOpen={isResultDialogOpen}
        onClose={() => {
          setIsResultDialogOpen(false);
          setSelectedResult(null);
        }}
      />
    </>
  );
}
