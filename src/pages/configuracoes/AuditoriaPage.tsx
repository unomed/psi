
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { RoleCheck } from '@/components/auth/RoleCheck';
import { ResponsiveContainer } from '@/components/layout/ResponsiveContainer';
import { AuditDashboard } from '@/components/audit/AuditDashboard';
import { AuditLogsList } from '@/components/audit/AuditLogsList';
import { AuditLogGenerator } from '@/components/audit/AuditLogGenerator';
import { Shield, Activity, Clock, Settings } from 'lucide-react';

export default function AuditoriaPage() {
  const { userCompanies } = useAuth();
  const currentCompanyId = userCompanies?.[0]?.companyId;

  return (
    <RoleCheck allowedRoles={['superadmin', 'admin']}>
      <ResponsiveContainer maxWidth="full">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Auditoria do Sistema</h1>
            <p className="text-muted-foreground">
              Monitore e analise todas as ações realizadas no sistema
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">
                <Activity className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="logs">
                <Shield className="h-4 w-4 mr-2" />
                Logs Detalhados
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Clock className="h-4 w-4 mr-2" />
                Atividade Recente
              </TabsTrigger>
              <TabsTrigger value="generator">
                <Settings className="h-4 w-4 mr-2" />
                Gerador de Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AuditDashboard companyId={currentCompanyId} />
            </TabsContent>

            <TabsContent value="logs">
              <AuditLogsList companyId={currentCompanyId} />
            </TabsContent>

            <TabsContent value="activity">
              <AuditLogsList companyId={currentCompanyId} />
            </TabsContent>

            <TabsContent value="generator">
              <AuditLogGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </ResponsiveContainer>
    </RoleCheck>
  );
}
