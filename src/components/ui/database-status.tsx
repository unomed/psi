
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Database, AlertCircle, CheckCircle } from 'lucide-react';

interface DatabaseStatusProps {
  className?: string;
}

export function DatabaseStatus({ className }: DatabaseStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('count')
        .limit(1);
      
      setIsConnected(!error);
      setLastCheck(new Date());
      
      if (error) {
        console.error('[DatabaseStatus] Erro na conexão:', error);
      } else {
        console.log('[DatabaseStatus] Conexão OK');
      }
    } catch (error) {
      console.error('[DatabaseStatus] Erro na verificação:', error);
      setIsConnected(false);
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Database className="w-4 h-4 animate-pulse" />
        <span className="text-sm">Verificando conexão...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isConnected ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <Badge variant="outline" className="text-green-700 border-green-300">
            DB Conectado
          </Badge>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4 text-red-500" />
          <Badge variant="destructive">
            DB Desconectado
          </Badge>
        </>
      )}
      {lastCheck && (
        <span className="text-xs text-muted-foreground">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
