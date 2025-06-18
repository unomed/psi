import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, TrendingUp, DollarSign, Users, Building2, Calendar, Download, Settings, Plus, AlertTriangle } from "lucide-react";
import { BillingOverview } from "@/components/billing/BillingOverview";
import { BillingPlansTable } from "@/components/billing/BillingPlansTable";
import { SubscriptionsList } from "@/components/billing/SubscriptionsList";
import { InvoicesList } from "@/components/billing/InvoicesList";
import { UsageAnalytics } from "@/components/billing/UsageAnalytics";
import { PurchaseCreditsDialog } from "@/components/billing/PurchaseCreditsDialog";
import { BillingConfigDialog } from "@/components/billing/BillingConfigDialog";
import { NewSubscriptionDialog } from "@/components/billing/NewSubscriptionDialog";
import { CompanyBillingDashboard } from "@/components/billing/CompanyBillingDashboard";
import { useAuth } from '@/hooks/useAuth';

interface FaturamentoProps {
  
}

export default function Faturamento({}: FaturamentoProps) {
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isBillingConfigOpen, setIsBillingConfigOpen] = useState(false);
  const [isNewSubscriptionOpen, setIsNewSubscriptionOpen] = useState(false);
  const { userCompanies } = useAuth();
  const companyId = userCompanies[0].companyId;

  return (
    <div className="w-full max-w-none p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faturamento</h1>
          <p className="text-muted-foreground">
            Gerencie planos, assinaturas e faturamento da sua empresa
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsBillingConfigOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Configurar Cobrança
          </Button>
          <Button onClick={() => setIsNewSubscriptionOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Assinatura
          </Button>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-6">
          <TabsTrigger value="overview">
            <CreditCard className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="plans">
            <DollarSign className="h-4 w-4 mr-2" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <Users className="h-4 w-4 mr-2" />
            Assinaturas
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Calendar className="h-4 w-4 mr-2" />
            Faturas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="w-full space-y-6">
          {/* Company Billing Dashboard */}
          {companyId ? (
            <CompanyBillingDashboard 
              companyId={String(companyId)}
              onPurchaseCredits={() => setIsPurchaseDialogOpen(true)}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Nenhuma Empresa Encontrada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nenhuma empresa associada ao seu usuário foi encontrada.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Billing Overview */}
          <BillingOverview />

          {/* Usage Analytics */}
          <UsageAnalytics />
        </TabsContent>

        <TabsContent value="plans" className="w-full">
          <BillingPlansTable />
        </TabsContent>

        <TabsContent value="subscriptions" className="w-full">
          <SubscriptionsList />
        </TabsContent>

        <TabsContent value="invoices" className="w-full">
          <InvoicesList />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <PurchaseCreditsDialog 
        open={isPurchaseDialogOpen}
        onOpenChange={setIsPurchaseDialogOpen}
      />

      <BillingConfigDialog
        open={isBillingConfigOpen}
        onOpenChange={setIsBillingConfigOpen}
      />

      <NewSubscriptionDialog
        open={isNewSubscriptionOpen}
        onOpenChange={setIsNewSubscriptionOpen}
      />
    </div>
  );
}
