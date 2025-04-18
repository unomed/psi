
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companies: string[];
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@exemplo.com",
    role: "admin",
    companies: ["Empresa A", "Empresa B"],
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@exemplo.com",
    role: "evaluator",
    companies: ["Empresa C"],
  },
];

export default function UserManagementSettings() {
  const [users] = useState<User[]>(mockUsers);

  const handleAddUser = () => {
    toast.info("Função em desenvolvimento");
  };

  const handleEditUser = (userId: string) => {
    toast.info("Função em desenvolvimento");
  };

  const handleDeleteUser = (userId: string) => {
    toast.info("Função em desenvolvimento");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Usuários</CardTitle>
        <CardDescription>
          Gerencie usuários e suas permissões no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Button onClick={handleAddUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Usuário
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Empresas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role === 'admin' ? 'Administrador' : 'Avaliador'}</TableCell>
                <TableCell>{user.companies.join(", ")}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditUser(user.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
