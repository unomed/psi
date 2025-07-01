
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, CreditCard } from "lucide-react";
import { useBillingMetrics } from "@/hooks/billing/useBillingMetrics";
import { formatCurrency } from "@/lib/utils";

export function BillingOverview() {
  const { metrics, isLoading } = useBillingMetrics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
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

  const cards = [
    {
      title: "Receita Mensal",
      value: formatCurrency(metrics?.monthlyRevenue || 0),
      icon: DollarSign,
      change: `${metrics?.revenueGrowth > 0 ? '+' : ''}${metrics?.revenueGrowth.toFixed(1)}%`,
      changeType: metrics?.revenueGrowth >= 0 ? 'positive' : 'negative'
    },
    {
      title: "Assinaturas Ativas",
      value: metrics?.activeSubscriptions?.toString() || '0',
      icon: Users,
      change: `+${metrics?.newSubscriptions || 0} este mês`,
      changeType: 'positive'
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(metrics?.averageTicket || 0),
      icon: TrendingUp,
      change: "por empresa",
      changeType: 'neutral'
    },
    {
      title: "Faturas Pendentes",
      value: `${metrics?.pendingInvoices || 0}/${metrics?.totalInvoices || 0}`,
      icon: FileText,
      change: "faturas totais",
      changeType: 'neutral'
    },
    {
      title: "Total Funcionários",
      value: metrics?.totalEmployees?.toString() || '0',
      icon: Users,
      change: "cadastrados",
      changeType: 'neutral'
    },
    {
      title: "Saldo Créditos",
      value: metrics?.totalCreditsBalance?.toString() || '0',
      icon: CreditCard,
      change: "créditos disponíveis",
      changeType: 'neutral'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className={`text-xs flex items-center ${
              card.changeType === 'positive' ? 'text-green-600' : 
              card.changeType === 'negative' ? 'text-red-600' : 
              'text-muted-foreground'
            }`}>
              {card.changeType === 'positive' && <TrendingUp className="mr-1 h-3 w-3" />}
              {card.changeType === 'negative' && <TrendingDown className="mr-1 h-3 w-3" />}
              {card.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
