
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { RiskLevelDistribution } from "@/components/reports/RiskLevelDistribution";
import { SectorRiskFactors } from "@/components/reports/SectorRiskFactors";
import { IndividualReports } from "@/components/reports/IndividualReports";
import { RoleRiskComparison } from "@/components/reports/RoleRiskComparison";
import { FileText, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyAccessCheck } from "@/hooks/useCompanyAccessCheck";
import { toast } from "sonner";

export default function Relatorios() {
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: undefined, 
    to: undefined 
  });
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedCompany');
    return saved || null;
  });
  
  const { userRole, userCompanies } = useAuth();
  const { verifyCompanyAccess } = useCompanyAccessCheck();
  
  // Verificar se o usuário tem acesso à empresa selecionada
  useEffect(() => {
    const checkCompanyAccess = async () => {
      if (!selectedCompany) return;
      
      // Superadmin tem acesso a todas as empresas
      if (userRole === 'superadmin') return;
      
      const hasAccess = await verifyCompanyAccess(selectedCompany);
      if (!hasAccess) {
        toast.error('Você não tem acesso à empresa selecionada');
        
        // Se o usuário tem pelo menos uma empresa associada, selecionar a primeira
        if (userCompanies.length > 0) {
          const firstCompany = userCompanies[0].companyId;
          setSelectedCompany(firstCompany);
          localStorage.setItem('selectedCompany', firstCompany);
        } else {
          setSelectedCompany(null);
          localStorage.removeItem('selectedCompany');
        }
      }
    };
    
    checkCompanyAccess();
  }, [selectedCompany, userRole, userCompanies, verifyCompanyAccess]);
  
  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    localStorage.setItem('selectedCompany', value);
  };
  
  const handleExportPDF = () => {
    // Seria implementado com uma biblioteca como jsPDF
    console.log("Exportando relatório como PDF");
    alert("Funcionalidade de exportação será implementada em breve");
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground mt-2">
            Relatórios individuais e consolidados para comprovação legal do cumprimento da NR 01.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>
      
      <ReportFilters 
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedCompany={selectedCompany}
        onCompanyChange={handleCompanyChange}
        userCompanies={userCompanies}
        userRole={userRole}
      />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sectors">Por Setor</TabsTrigger>
          <TabsTrigger value="roles">Por Função</TabsTrigger>
          <TabsTrigger value="individual">Individuais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RiskLevelDistribution filters={{dateRange, selectedSector, selectedRole, selectedCompany}} />
            <SectorRiskFactors filters={{dateRange, selectedSector, selectedRole, selectedCompany}} />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Severidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['Normal', 'Leve', 'Moderado', 'Severo', 'Crítico'].map((level, index) => (
                  <Card key={level} className={`bg-opacity-10 ${
                    index === 0 ? 'bg-green-100 border-green-200' : 
                    index === 1 ? 'bg-blue-100 border-blue-200' : 
                    index === 2 ? 'bg-yellow-100 border-yellow-200' : 
                    index === 3 ? 'bg-orange-100 border-orange-200' : 
                    'bg-red-100 border-red-200'
                  }`}>
                    <CardContent className="p-4">
                      <p className="text-lg font-semibold">{level}</p>
                      <p className="text-2xl font-bold mt-1">{12 - index * 2}%</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sectors" className="space-y-6 mt-6">
          <SectorRiskFactors 
            filters={{dateRange, selectedSector, selectedRole, selectedCompany}} 
            fullWidth 
          />
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-6 mt-6">
          <RoleRiskComparison 
            filters={{dateRange, selectedSector, selectedRole, selectedCompany}} 
          />
        </TabsContent>
        
        <TabsContent value="individual" className="space-y-6 mt-6">
          <IndividualReports 
            filters={{dateRange, selectedSector, selectedRole, selectedCompany}} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
