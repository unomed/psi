
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

export default function PermissionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Permissões</h1>
        <p className="text-muted-foreground mt-2">
          Configure as permissões de acesso para cada perfil de usuário.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Permissões do Sistema</CardTitle>
          <CardDescription>
            Define quais recursos cada perfil de usuário pode acessar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Recurso</TableHead>
                <TableHead>Administrador</TableHead>
                <TableHead>Avaliador</TableHead>
                <TableHead>Usuário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Dashboard</TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Empresas</TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Funcionários</TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Setores</TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Checklists</TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Avaliações</TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Relatórios</TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Configurações</TableCell>
                <TableCell><Switch defaultChecked disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
                <TableCell><Switch disabled /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
