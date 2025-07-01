
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TagsMonitoringTabProps {
  connectionStatus: string;
  eventsCount: number;
  isConnected: boolean;
  employeeId?: string;
}

export function TagsMonitoringTab({ 
  connectionStatus, 
  eventsCount, 
  isConnected, 
  employeeId 
}: TagsMonitoringTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status da Conexão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {connectionStatus}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Eventos Recebidos:</span>
              <Badge variant="outline">{eventsCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Funcionário Monitorado:</span>
              <Badge variant="outline">{employeeId || 'Nenhum'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
