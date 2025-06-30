
import { CompanyBillingDashboard } from "@/components/billing/CompanyBillingDashboard";
import { BillingOverview } from "@/components/billing/BillingOverview";
import { UsageAnalytics } from "@/components/billing/UsageAnalytics";
import { InvoicesList } from "@/components/billing/InvoicesList";
import { SubscriptionsList } from "@/components/billing/SubscriptionsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Faturamento() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Faturamento</h1>
          <p className="text-muted-foreground">
            Controle financeiro completo - faturamento, faturas, assinaturas e análises de uso
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="company">Por Empresa</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <BillingOverview />
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <CompanyBillingDashboard />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <InvoicesList />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <SubscriptionsList />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <UsageAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
