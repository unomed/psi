
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Download } from "lucide-react";
import { DiscResultDisplay } from "@/components/checklists/DiscResultDisplay";
import { ChecklistResult, DiscFactorType } from "@/types";

interface IndividualReportsProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function IndividualReports({ filters }: IndividualReportsProps) {
  const [selectedResult, setSelectedResult] = useState<ChecklistResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  console.log('Filtros aplicados nos relatórios individuais:', filters);

  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const reports = [
    { id: '1', employee: 'João Silva', sector: 'Produção', role: 'Operador', date: '15/03/2024', dominantFactor: DiscFactorType.D, riskLevel: 'medium' },
    { id: '2', employee: 'Maria Santos', sector: 'Administrativo', role: 'Analista', date: '12/03/2024', dominantFactor: DiscFactorType.I, riskLevel: 'low' },
    { id: '3', employee: 'Pedro Oliveira', sector: 'TI', role: 'Técnico', date: '10/03/2024', dominantFactor: DiscFactorType.S, riskLevel: 'high' },
    { id: '4', employee: 'Ana Costa', sector: 'Comercial', role: 'Gerente', date: '05/03/2024', dominantFactor: DiscFactorType.C, riskLevel: 'medium' },
    { id: '5', employee: 'Carlos Pereira', sector: 'Logística', role: 'Assistente', date: '02/03/2024', dominantFactor: DiscFactorType.D, riskLevel: 'low' },
  ];

  const getRiskBadge = (level: string) => {
    switch(level) {
      case 'low':
        return <Badge className="bg-green-500">Baixo</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Médio</Badge>;
      case 'high':
        return <Badge className="bg-red-500">Alto</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const viewReport = (reportId: string) => {
    // Em uma aplicação real, aqui você buscaria os detalhes da avaliação
    const mockResult: ChecklistResult = {
      id: reportId,
      templateId: 'template-1',
      employeeName: reports.find(r => r.id === reportId)?.employee || 'Anônimo',
      results: { D: 25, I: 15, S: 35, C: 25 },
      dominantFactor: (reports.find(r => r.id === reportId)?.dominantFactor || DiscFactorType.D),
      completedAt: new Date()
    };
    
    setSelectedResult(mockResult);
    setShowDetails(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios Individuais</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Nível de Risco</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map(report => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.employee}</TableCell>
                <TableCell>{report.sector}</TableCell>
                <TableCell>{report.role}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.dominantFactor}</TableCell>
                <TableCell>{getRiskBadge(report.riskLevel)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => viewReport(report.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Relatório</DialogTitle>
            </DialogHeader>
            {selectedResult && (
              <DiscResultDisplay 
                result={selectedResult} 
                onClose={() => setShowDetails(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
