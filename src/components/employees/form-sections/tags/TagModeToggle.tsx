
import { Button } from "@/components/ui/button";
import { Zap, Settings, Database } from "lucide-react";

interface TagModeToggleProps {
  useAdvancedMode: boolean;
  showMigration: boolean;
  showDebug: boolean;
  onAdvancedModeToggle: () => void;
  onMigrationToggle: () => void;
  onDebugToggle: () => void;
}

export function TagModeToggle({
  useAdvancedMode,
  showMigration,
  showDebug,
  onAdvancedModeToggle,
  onMigrationToggle,
  onDebugToggle
}: TagModeToggleProps) {
  return (
    <div className="flex gap-2">
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={onAdvancedModeToggle}
      >
        {useAdvancedMode ? (
          <>
            <Settings className="h-4 w-4 mr-2" />
            Modo Simples
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Modo Avançado
          </>
        )}
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={onMigrationToggle}
      >
        <Database className="h-4 w-4 mr-2" />
        Migração
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={onDebugToggle}
      >
        🔧 Debug
      </Button>
    </div>
  );
}
