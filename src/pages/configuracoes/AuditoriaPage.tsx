
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { RoleCheck } from '@/components/auth/RoleCheck';
import { ResponsiveContainer } from '@/components/layout/ResponsiveContainer';
import { Shield, Activity, Users, FileText } from 'lucide-react';

export default function AuditoriaPage() {
  const { userCompanies } = useAuth();
  const currentCompanyId = userCompanies[0]?.companyId;

  // Dados mock para demonstração
  const auditStats = [
    { title: "Total de Logs", value: "1,234", icon: FileText },
    { title: "Usuários Ativos", value: "45", icon: Users },
    { title: "Ações Hoje", value: "89", icon: Activity },
    { title: "Alertas", value: "3", icon: Shield }
  ];

  const recentLogs = [
    {
      id: 1,
      action: "Login realizado",
      user: "admin@unomed.com",
      timestamp: "2024-01-15 10:30:00",
      ip: "192.168.1.100"
    },
    {
      id: 2,
      action: "Funcionário criado",
      user: "gerencia@unomed.com",
      timestamp: "2024-01-15 10:25:00",
      ip: "192.168.1.101"
    },
    {
      id: 3,
      action: "Avaliação agendada",
      user: "admin@unomed.com",
      timestamp: "2024-01-15 10:20:00",
      ip: "192.168.1.100"
    }
  ];

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

          {/* Cards de estatísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {auditStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="logs">Logs Detalhados</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Atividade Recente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{log.action}</p>
                            <p className="text-sm text-muted-foreground">
                              por {log.user}
                            </p>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>{log.timestamp}</p>
                            <p>{log.ip}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>Logs Detalhados do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="mx-auto h-12 w-12 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Logs de Auditoria</h3>
                      <p>Os logs detalhados de auditoria aparecerão aqui.</p>
                      <p className="text-sm mt-2">
                        Empresa: {currentCompanyId || 'Todas'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ResponsiveContainer>
    </RoleCheck>
  );
}
