import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  FileText, 
  Download,
  TrendingUp,
  Users,
  AlertTriangle,
  Calendar,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Relatorios() {
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: undefined, 
    to: undefined 
  });
  const [selectedSector, setSelectedSector] = useState<string>('all-sectors');
  const [selectedRole, setSelectedRole] = useState<string>('all-roles');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedCompany');
    return saved || null;
  });
  
  const { userRole, userCompanies } = useAuth();
  const { verifyCompanyAccess } = useCompanyAccessCheck();
  const { reportsData, isLoading } = useReportsData(selectedCompany || undefined);
  
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
    // Implementação futura da exportação PDF
    toast.info("Funcionalidade de exportação será implementada em breve");
  };
  
  const handlePrint = () => {
    window.print();
  };

  const filters = { dateRange, selectedSector, selectedRole, selectedCompany };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios NR-01</h1>
          <p className="text-muted-foreground mt-2">
            Relatórios consolidados para conformidade legal e análise de riscos psicossociais.
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sectors">Por Setor</TabsTrigger>
          <TabsTrigger value="roles">Por Função</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Conformidade NR-01 */}
          <NR01ComplianceOverview filters={filters} />
          
          {/* Gráficos principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RiskLevelDistribution filters={filters} />
            <RiskTrendChart filters={filters} />
          </div>
          
          {/* Resumo de avaliações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumo de Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <p className="text-lg font-semibold text-blue-700">Total de Avaliações</p>
                      <p className="text-2xl font-bold mt-1 text-blue-900">
                        {reportsData?.totalAssessments || 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-lg font-semibold text-green-700">Concluídas</p>
                      <p className="text-2xl font-bold mt-1 text-green-900">
                        {reportsData?.completedAssessments || 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <p className="text-lg font-semibold text-yellow-700">Pendentes</p>
                      <p className="text-2xl font-bold mt-1 text-yellow-900">
                        {reportsData?.pendingAssessments || 0}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sectors" className="space-y-6 mt-6">
          <SectorRiskFactors 
            filters={filters} 
            fullWidth 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RiskLevelDistribution filters={filters} />
            <RiskTrendChart filters={filters} />
          </div>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-6 mt-6">
          <RoleRiskComparison 
            filters={filters} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RiskLevelDistribution filters={filters} />
            <RiskTrendChart filters={filters} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
