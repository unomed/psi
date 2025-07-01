
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Pause, Play, X } from "lucide-react";
import { useSubscriptions } from "@/hooks/billing/useSubscriptions";
import { Subscription, SubscriptionStatus } from "@/types/billing";

export function SubscriptionsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "all">("all");
  
  const { subscriptions, isLoading } = useSubscriptions();

  const getStatusBadge = (status: SubscriptionStatus) => {
    const variants = {
      active: "default",
      suspended: "secondary", 
      cancelled: "destructive",
      trial: "outline"
    };
    
    const labels = {
      active: "Ativa",
      suspended: "Suspensa",
      cancelled: "Cancelada", 
      trial: "Trial"
    };

    return (
      <Badge variant={variants[status] as any}>
        {labels[status]}
      </Badge>
    );
  };

  const filteredSubscriptions = subscriptions?.filter(sub => {
    const matchesSearch = searchTerm === "" || 
      sub.companies?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.companies?.cnpj.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assinaturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando assinaturas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por empresa ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspensa</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <div className="grid gap-4">
        {filteredSubscriptions?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhuma assinatura encontrada
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSubscriptions?.map((subscription) => (
            <Card key={subscription.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">
                      {subscription.companies?.name || "Empresa não encontrada"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      CNPJ: {subscription.companies?.cnpj || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Plano: {subscription.billing_plans?.name || "N/A"}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(subscription.status)}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Valor Mensal</p>
                    <p className="text-muted-foreground">
                      R$ {subscription.monthly_amount.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Próximo Pagamento</p>
                    <p className="text-muted-foreground">
                      {new Date(subscription.next_billing_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Ciclo</p>
                    <p className="text-muted-foreground">
                      {subscription.billing_cycle === 'monthly' ? 'Mensal' : 
                       subscription.billing_cycle === 'quarterly' ? 'Trimestral' : 'Anual'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Início</p>
                    <p className="text-muted-foreground">
                      {new Date(subscription.start_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  {subscription.status === 'active' ? (
                    <Button variant="outline" size="sm">
                      <Pause className="mr-2 h-4 w-4" />
                      Suspender
                    </Button>
                  ) : subscription.status === 'suspended' ? (
                    <Button variant="outline" size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Reativar
                    </Button>
                  ) : null}
                  {subscription.status !== 'cancelled' && (
                    <Button variant="destructive" size="sm">
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
