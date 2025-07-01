
import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";

interface EmailServerFormActionsProps {
  isUpdating: boolean;
  isTestingConnection: boolean;
  onTestConnection: () => void;
  hasSettings: boolean;
}

export function EmailServerFormActions({
  isUpdating,
  isTestingConnection,
  onTestConnection,
  hasSettings
}: EmailServerFormActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button type="submit" className="flex-1" disabled={isUpdating}>
        {isUpdating ? (
          <>
            <span className="animate-spin mr-2">⭮</span>
            Salvando...
          </>
        ) : (
          "Salvar Configurações"
        )}
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onTestConnection}
        disabled={isTestingConnection || isUpdating || !hasSettings}
        className="flex items-center gap-2"
      >
        <TestTube className="h-4 w-4" />
        {isTestingConnection ? "Testando..." : "Testar Conexão"}
      </Button>
    </div>
  );
}
