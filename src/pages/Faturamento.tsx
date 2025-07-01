
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CreditCard, FileText, Settings, TrendingUp, Building2 } from "lucide-react";
import { BillingOverview } from "@/components/billing/BillingOverview";
import { SubscriptionsList } from "@/components/billing/SubscriptionsList";
import { InvoicesList } from "@/components/billing/InvoicesList";
import { BillingPlansTable } from "@/components/billing/BillingPlansTable";
import { UsageAnalytics } from "@/components/billing/UsageAnalytics";
import { CompanyBillingDashboard } from "@/components/billing/CompanyBillingDashboard";
import { PurchaseCreditsDialog } from "@/components/billing/PurchaseCreditsDialog";
import { NewSubscriptionDialog } from "@/components/billing/NewSubscriptionDialog";
import { BillingConfigDialog } from "@/components/billing/BillingConfigDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyBilling } from "@/hooks/billing/useCompanyBilling";
import { useCompanies } from "@/hooks/useCompanies";

export default function Faturamento() {
  const [isNewSubscriptionOpen, setIsNewSubscriptionOpen] = useState(false);
  const [isBillingConfigOpen, setIsBillingConfigOpen] = useState(false);
  const [isPurchaseCreditsOpen, setIsPurchaseCreditsOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  
  const { userRole } = useAuth();
  const { companies } = useCompanies();
  const { billingPlans } = useCompanyBilling();

  // Only superadmins can access billing
  if (userRole !== 'superadmin') {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="p-8">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Apenas super administradores podem acessar o faturamento.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faturamento</h1>
          <p className="text-muted-foreground">
            Gerencie assinaturas, faturas e configurações de cobrança
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBillingConfigOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
          <Button onClick={() => setIsNewSubscriptionOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Assinatura
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <BillingOverview />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Por Empresa
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Assinaturas
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Faturas
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Executivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Dashboard executivo será implementado
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies">
          <div className="space-y-6">
            {/* Company Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Selecionar Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center">
                  <select 
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                  >
                    <option value="">Selecione uma empresa...</option>
                    {companies?.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name} ({company.cnpj})
                      </option>
                    ))}
                  </select>
                  {selectedCompanyId && billingPlans && (
                    <Button 
                      variant="outline"
                      onClick={() => setIsPurchaseCreditsOpen(true)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Comprar Créditos
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Billing Dashboard */}
            {selectedCompanyId && (
              <CompanyBillingDashboard 
                companyId={selectedCompanyId}
                onPurchaseCredits={() => setIsPurchaseCreditsOpen(true)}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionsList />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoicesList />
        </TabsContent>

        <TabsContent value="plans">
          <BillingPlansTable />
        </TabsContent>

        <TabsContent value="analytics">
          <UsageAnalytics />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <NewSubscriptionDialog 
        isOpen={isNewSubscriptionOpen}
        onClose={() => setIsNewSubscriptionOpen(false)}
      />
      
      <BillingConfigDialog 
        isOpen={isBillingConfigOpen}
        onClose={() => setIsBillingConfigOpen(false)}
      />

      {selectedCompanyId && billingPlans && (
        <PurchaseCreditsDialog
          isOpen={isPurchaseCreditsOpen}
          onClose={() => setIsPurchaseCreditsOpen(false)}
          billingPlans={billingPlans}
          companyId={selectedCompanyId}
        />
      )}
    </div>
  );
}
