
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  BarChart3,
  Target,
  Users,
  AlertTriangle,
  TrendingUp,
  FileText,
  Settings,
  Download
} from "lucide-react";
import { ActionPlanForm } from "@/components/action-plans/ActionPlanForm";
import { ActionPlansTable } from "@/components/action-plans/ActionPlansTable";
import { ActionPlansList } from "@/components/action-plans/ActionPlansList";
import { NR01ActionPlansList } from "@/components/action-plans/nr01/NR01ActionPlansList";
import { NR01FiltersSection } from "@/components/action-plans/nr01/NR01FiltersSection";
import { NR01RiskStatistics } from "@/components/action-plans/nr01/NR01RiskStatistics";
import { CreateActionPlanDialog } from "@/components/action-plans/nr01/CreateActionPlanDialog";
import { useAuth } from "@/hooks/useAuth";
import { DateRange } from "react-day-picker";

export default function PlanoAcao() {
  const { userCompanies } = useAuth();
  const [activeTab, setActiveTab] = useState("nr01");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Add filters state for NR01FiltersSection
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    sector: 'all',
    status: 'all',
    dateRange: undefined as DateRange | undefined
  });

  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;

  // Mock data for risk statistics
  const riskStats = {
    totalAnalyses: 0,
    riskLevels: {
      baixo: 0,
      medio: 0,
      alto: 0,
      critico: 0
    }
  };

  // Mock sectors data
  const sectors: Array<{ id: string; name: string }> = [];

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsEditMode(false);
    setShowCreateDialog(true);
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditMode(true);
    setShowCreateDialog(true);
  };

  const handleViewDetails = (plan: any) => {
    console.log("Visualizando detalhes do plano:", plan);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      riskLevel: 'all',
      sector: 'all',
      status: 'all',
      dateRange: undefined
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Planos de Ação</h1>
          <p className="text-muted-foreground">
            Gestão de planos de ação para controle de riscos psicossociais
          </p>
        </div>
        <Button onClick={handleCreatePlan}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nr01" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            NR-01
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nr01" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Planos de Ação NR-01
              </CardTitle>
              <CardDescription>
                Planos específicos para controle de riscos psicossociais conforme NR-01
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <NR01RiskStatistics 
                riskStats={riskStats}
                activePlansCount={0}
              />
              <NR01FiltersSection 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                riskStats={riskStats}
                sectors={sectors}
                resultCount={0}
              />
              <NR01ActionPlansList 
                actionPlans={[]}
                onPlanSelect={handleViewDetails}
                onCreateFromRisk={handleCreatePlan}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Planos de Ação Gerais</CardTitle>
              <CardDescription>
                Todos os planos de ação da organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActionPlansList 
                onCreatePlan={handleCreatePlan}
                onEditPlan={handleEditPlan}
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Total de Planos</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Concluídos</p>
                    <p className="text-2xl font-bold">18</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Em Andamento</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Atrasados</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Configurações do sistema de planos de ação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configurações em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateActionPlanDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        companyId={companyId}
        selectedPlan={selectedPlan}
        isEditMode={isEditMode}
      />
    </div>
  );
}
