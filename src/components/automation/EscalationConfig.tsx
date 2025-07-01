
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Mail, Phone, Bell } from "lucide-react";
import { EscalationLevel } from "@/types/automation";

interface EscalationConfigProps {
  escalationLevels: EscalationLevel[];
  companyId?: string;
}

export function EscalationConfig({ escalationLevels, companyId }: EscalationConfigProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Configuração de Escalação</h3>
          <p className="text-sm text-muted-foreground">
            Defina níveis hierárquicos para escalação automática
          </p>
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Novo Nível
        </Button>
      </div>

      {escalationLevels.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum nível configurado</h3>
            <p className="text-muted-foreground mb-4">
              Configure níveis de escalação para gestores
            </p>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Configurar Primeiro Nível
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {escalationLevels.map((level) => (
            <Card key={level.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Nível {level.level}: {level.name}
                      <Badge variant="outline">
                        {level.escalationDelayMinutes}min
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Escalação automática após {level.escalationDelayMinutes} minutos
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{level.userIds.length} usuários configurados</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Delay: {level.escalationDelayMinutes} minutos</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Métodos:</span>
                    {level.notificationMethods.map((method) => (
                      <Badge key={method} variant="secondary" className="text-xs">
                        {method === 'email' && <Mail className="h-3 w-3 mr-1" />}
                        {method === 'sms' && <Phone className="h-3 w-3 mr-1" />}
                        {method === 'in_app' && <Bell className="h-3 w-3 mr-1" />}
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
