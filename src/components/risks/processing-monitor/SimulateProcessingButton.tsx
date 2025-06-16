
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, AlertCircle } from "lucide-react";
import { AutomationProcessingService } from "@/services/riskManagement/automation/processingService";
import { toast } from "sonner";

interface SimulateProcessingButtonProps {
  companyId?: string;
}

export function SimulateProcessingButton({ companyId }: SimulateProcessingButtonProps) {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateProcessing = async () => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado');
      return;
    }

    setIsSimulating(true);
    
    try {
      console.log('Iniciando simulação de processamento para empresa:', companyId);
      const result = await AutomationProcessingService.simulateProcessing(companyId);
      
      if (result.success) {
        toast.success(`✅ Simulação concluída: ${result.message}`, {
          duration: 5000,
        });
      } else {
        // Verificar se é erro de dados ou configuração
        if (result.message.includes('funcionário') || result.message.includes('template')) {
          toast.warning(`⚠️ ${result.message}`, {
            duration: 8000,
            description: 'Certifique-se de que há funcionários ativos e templates de avaliação na empresa.'
          });
        } else {
          toast.warning(`⚠️ Simulação: ${result.message}`, {
            duration: 6000,
          });
        }
      }
    } catch (error: any) {
      console.error('Error simulating processing:', error);
      
      // Tratamento específico para diferentes tipos de erro
      if (error?.code === '23503') {
        toast.error('❌ Erro de relacionamento no banco. Verifique se há funcionários ativos na empresa.', {
          duration: 7000,
        });
      } else if (error?.code === 'PGRST200') {
        toast.error('❌ Erro de relacionamento no banco. Problema foi corrigido, tente novamente.', {
          duration: 7000,
        });
      } else if (error?.message?.includes('foreign key')) {
        toast.error('❌ Erro de integridade de dados. Verifique a consistência dos dados.', {
          duration: 7000,
        });
      } else if (error?.message?.includes('not found')) {
        toast.error('❌ Dados não encontrados. Verifique se há funcionários e templates na empresa.', {
          duration: 7000,
        });
      } else {
        toast.error(`❌ Erro ao executar simulação: ${error?.message || 'Erro desconhecido'}`, {
          duration: 7000,
        });
      }
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSimulateProcessing}
        disabled={isSimulating || !companyId}
        className="flex items-center gap-2"
      >
        {isSimulating ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        {isSimulating ? 'Processando...' : 'Simular Processamento'}
      </Button>
      
      {!companyId && (
        <div className="flex items-center gap-1 text-yellow-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">Empresa não selecionada</span>
        </div>
      )}
    </div>
  );
}
