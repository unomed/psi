
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditDashboard } from '@/components/audit/AuditDashboard';
import { AuditLogsList } from '@/components/audit/AuditLogsList';
import { useAuth } from '@/contexts/AuthContext';
import { RoleCheck } from '@/components/auth/RoleCheck';
import { ResponsiveContainer } from '@/components/layout/ResponsiveContainer';

export default function AuditoriaPage() {
  const { userCompanies } = useAuth();
  const currentCompanyId = userCompanies[0]?.companyId;

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
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="logs">Logs Detalhados</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AuditDashboard companyId={currentCompanyId} />
            </TabsContent>

            <TabsContent value="logs">
              <AuditLogsList companyId={currentCompanyId} />
            </TabsContent>
          </Tabs>
        </div>
      </ResponsiveContainer>
    </RoleCheck>
  );
}
