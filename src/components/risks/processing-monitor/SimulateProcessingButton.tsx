
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play } from "lucide-react";
import { PsychosocialAutomationService } from "@/services/riskManagement/psychosocialAutomationService";
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
      const result = await PsychosocialAutomationService.simulateProcessing(companyId);
      if (result.success) {
        toast.success(`Simulação concluída: ${result.message}`);
      } else {
        toast.warning(`Simulação: ${result.message}`);
      }
    } catch (error) {
      console.error('Error simulating processing:', error);
      toast.error('Erro ao executar simulação');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSimulateProcessing}
      disabled={isSimulating}
    >
      {isSimulating ? (
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Play className="w-4 h-4 mr-2" />
      )}
      Simular Processamento
    </Button>
  );
}
