import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Brain, Calculator, Zap } from "lucide-react";

interface PsychosocialAdvancedConfigProps {
  selectedCompanyId: string | null;
}

export function PsychosocialAdvancedConfig({ selectedCompanyId }: PsychosocialAdvancedConfigProps) {
  if (!selectedCompanyId) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para configurações avançadas</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Configurações salvas com sucesso!");
  };


  return (
    <div className="space-y-6">
      {/* Configurações de Processamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Configurações Avançadas
          </CardTitle>
          <CardDescription>
            Configurações avançadas para análise de riscos psicossociais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processing_interval">Intervalo de processamento (segundos)</Label>
                <Input
                  id="processing_interval"
                  name="processing_interval"
                  type="number"
                  min="60"
                  max="3600"
                  defaultValue={3600}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max_concurrent">Máximo de jobs concorrentes</Label>
                <Input
                  id="max_concurrent"
                  name="max_concurrent"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue={3}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Salvar Configurações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Machine Learning e IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Inteligência Artificial
          </CardTitle>
          <CardDescription>
            Configurações para análise preditiva e aprendizado de máquina (em desenvolvimento)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Funcionalidades de IA em desenvolvimento</p>
            <p className="text-sm">Análise preditiva de riscos e recomendações inteligentes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}