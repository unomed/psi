
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/employee";
import { format } from "date-fns";

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "cpf",
    header: "CPF",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    accessorKey: "start_date",
    header: "Data de Admissão",
    cell: ({ row }) => {
      const date = row.getValue("start_date") as string;
      return format(new Date(date), "dd/MM/yyyy");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row, table }) => {
      const employee = row.original;
      const meta = table.options.meta as {
        onEdit: (employee: Employee) => void;
        onDelete: (employee: Employee) => void;
        onView: (employee: Employee) => void;
      };

      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta.onView(employee)}
            title="Visualizar"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta.onEdit(employee)}
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta.onDelete(employee)}
            title="Excluir"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
