
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check } from "lucide-react";
import { BillingPlan } from "@/types/billing";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface PurchaseCreditsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  billingPlans: BillingPlan[];
  companyId: string;
}

export function PurchaseCreditsDialog({ 
  isOpen, 
  onClose, 
  billingPlans,
  companyId 
}: PurchaseCreditsDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const creditPlans = billingPlans.filter(plan => plan.type === 'credits');

  const handlePurchase = async () => {
    if (!selectedPlan) {
      toast.error('Selecione um pacote de créditos');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Aqui você integraria com o Stripe para processar o pagamento
      // Por enquanto, vamos simular o processo
      
      toast.success('Funcionalidade de pagamento será implementada em breve');
      
      // Exemplo de integração com Stripe:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     planId: selectedPlan.id,
      //     companyId: companyId
      //   })
      // });
      // 
      // const { url } = await response.json();
      // window.open(url, '_blank');
      
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast.error('Erro ao processar compra');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlanCredits = (plan: BillingPlan) => {
    const discount = plan.bulk_discounts?.[0];
    return discount?.quantity || 1;
  };

  const getPlanSavings = (plan: BillingPlan) => {
    const discount = plan.bulk_discounts?.[0];
    return discount?.discount_percent || 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Comprar Créditos de Avaliação
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {creditPlans.map((plan) => {
              const credits = getPlanCredits(plan);
              const savings = getPlanSavings(plan);
              const totalPrice = plan.assessment_price * credits;
              const isSelected = selectedPlan?.id === plan.id;

              return (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {savings > 0 && (
                        <Badge variant="secondary">
                          {savings}% OFF
                        </Badge>
                      )}
                      {isSelected && (
                        <div className="rounded-full bg-primary p-1">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-3xl font-bold">
                          {credits}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Créditos de avaliação
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-2xl font-semibold text-primary">
                          {formatCurrency(totalPrice)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(plan.assessment_price)} por avaliação
                        </div>
                      </div>

                      {plan.description && (
                        <p className="text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {creditPlans.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum pacote de créditos disponível no momento.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handlePurchase}
              disabled={!selectedPlan || isProcessing}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              {isProcessing ? 'Processando...' : 'Comprar Créditos'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
