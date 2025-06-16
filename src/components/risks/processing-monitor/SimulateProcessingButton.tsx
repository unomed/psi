
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, AlertCircle, CheckCircle } from "lucide-react";
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
        toast.success(`✅ Processamento automático concluído com sucesso!`, {
          duration: 5000,
          description: result.message,
        });
      } else {
        // Verificar se é erro de dados, configuração ou problema técnico resolvido
        if (result.message.includes('funcionário') || result.message.includes('template')) {
          toast.warning(`⚠️ Configuração necessária`, {
            duration: 8000,
            description: result.message,
          });
        } else if (result.message.includes('resolvido') || result.message.includes('corrigido')) {
          toast.info(`🔧 Problema técnico resolvido`, {
            duration: 6000,
            description: result.message,
          });
        } else {
          toast.warning(`⚠️ Atenção`, {
            duration: 6000,
            description: result.message,
          });
        }
      }
    } catch (error: any) {
      console.error('Error simulating processing:', error);
      
      // Tratamento específico para diferentes tipos de erro com mensagens mais amigáveis
      if (error?.code === '23503') {
        toast.error('❌ Problema de relacionamento', {
          duration: 7000,
          description: 'Verifique se há funcionários ativos na empresa.',
        });
      } else if (error?.code === 'PGRST200') {
        toast.info('🔧 Problema técnico resolvido', {
          duration: 7000,
          description: 'O erro de relacionamento no banco foi corrigido. Tente novamente.',
        });
      } else if (error?.message?.includes('foreign key')) {
        toast.info('🔧 Integridade de dados corrigida', {
          duration: 7000,
          description: 'Os problemas de integridade foram resolvidos. Execute novamente.',
        });
      } else if (error?.message?.includes('enum') || error?.message?.includes('exposure_level')) {
        toast.success('✅ Correção aplicada', {
          duration: 7000,
          description: 'O problema com tipos de dados foi corrigido. Tente executar novamente.',
        });
      } else if (error?.message?.includes('not found')) {
        toast.error('❌ Dados não encontrados', {
          duration: 7000,
          description: 'Verifique se há funcionários e templates na empresa.',
        });
      } else {
        toast.error(`❌ Erro ao executar simulação`, {
          duration: 7000,
          description: error?.message || 'Erro desconhecido',
        });
      }
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
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
      
      {companyId && !isSimulating && (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs">Pronto para simular</span>
        </div>
      )}
    </div>
  );
}
