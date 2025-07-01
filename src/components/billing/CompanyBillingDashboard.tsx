
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyBilling } from "@/hooks/billing/useCompanyBilling";
import { useBillingRecords } from "@/hooks/billing/useBillingRecords";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";

interface CompanyBillingDashboardProps {
  companyId: string;
  onPurchaseCredits: () => void;
}

export function CompanyBillingDashboard({ companyId, onPurchaseCredits }: CompanyBillingDashboardProps) {
  const { companyBilling, isLoading } = useCompanyBilling(companyId);
  const { billingRecords } = useBillingRecords(companyId);

  const billingStats = useMemo(() => {
    if (!billingRecords) return { thisMonth: 0, lastMonth: 0, totalSpent: 0 };

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonth = billingRecords
      .filter(record => new Date(record.created_at) >= thisMonthStart)
      .reduce((sum, record) => sum + record.amount_charged, 0);

    const lastMonth = billingRecords
      .filter(record => {
        const date = new Date(record.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
      })
      .reduce((sum, record) => sum + record.amount_charged, 0);

    const totalSpent = billingRecords
      .reduce((sum, record) => sum + record.amount_charged, 0);

    return { thisMonth, lastMonth, totalSpent };
  }, [billingRecords]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!companyBilling) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Configuração de Cobrança Necessária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Esta empresa ainda não possui um plano de cobrança configurado.
          </p>
          <p className="text-sm text-muted-foreground">
            Entre em contato com o administrador do sistema para configurar um plano de cobrança.
          </p>
        </CardContent>
      </Card>
    );
  }

  const creditUsagePercent = companyBilling.auto_recharge_threshold > 0 
    ? Math.max(0, ((companyBilling.auto_recharge_threshold - companyBilling.assessment_credit_balance) / companyBilling.auto_recharge_threshold) * 100)
    : 0;

  const isLowBalance = companyBilling.assessment_credit_balance <= (companyBilling.auto_recharge_threshold || 10);

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo de Créditos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {companyBilling.assessment_credit_balance}
              {isLowBalance && (
                <Badge variant="destructive" className="text-xs">
                  Baixo
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Avaliações disponíveis
            </p>
            {companyBilling.auto_recharge_threshold > 0 && (
              <div className="mt-2">
                <Progress value={creditUsagePercent} className="h-1" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
            <Badge variant="outline">{companyBilling.billing_plans?.type}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(companyBilling.billing_plans?.assessment_price || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Por avaliação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Este Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(billingStats.thisMonth)}
            </div>
            <p className="text-xs text-muted-foreground">
              {billingStats.lastMonth > 0 ? (
                <>
                  {billingStats.thisMonth > billingStats.lastMonth ? '+' : ''}
                  {(((billingStats.thisMonth - billingStats.lastMonth) / billingStats.lastMonth) * 100).toFixed(1)}% vs mês anterior
                </>
              ) : (
                'Primeiro mês de uso'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(billingStats.totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground">
              Desde o início
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={onPurchaseCredits} className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Comprar Créditos
        </Button>
        
        {companyBilling.auto_recharge_enabled && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Recarga automática ativa
          </Badge>
        )}
      </div>

      {/* Low Balance Alert */}
      {isLowBalance && !companyBilling.auto_recharge_enabled && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Saldo Baixo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-700">
            <p>
              Seu saldo de créditos está baixo ({companyBilling.assessment_credit_balance} restantes).
              Considere comprar mais créditos ou ativar a recarga automática.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
