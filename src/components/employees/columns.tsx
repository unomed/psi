import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types/employee";
import { format } from "date-fns";

// Mapping para tradução dos status
const statusTranslations: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  vacation: "Férias",
  medical_leave: "Licença médica",
  // Adicionar outras traduções conforme necessário
};

export const createColumns = (employeeMoods?: Record<string, any>): ColumnDef<Employee>[] => [
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
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return statusTranslations[status] || status;
    }
  },
  {
    accessorKey: "mood",
    header: "Humor",
    cell: ({ row }) => {
      const employee = row.original;
      const moodData = employeeMoods?.[employee.id];
      
      if (!moodData || moodData.totalLogs === 0) {
        return (
          <div className="flex items-center gap-2 text-gray-400">
            <Smile className="h-4 w-4" />
            <span className="text-xs">Sem registros</span>
          </div>
        );
      }

      const getMoodColor = (avgMood: number) => {
        if (avgMood >= 4.5) return "bg-green-100 text-green-800 border-green-200";
        if (avgMood >= 3.5) return "bg-blue-100 text-blue-800 border-blue-200";
        if (avgMood >= 2.5) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (avgMood >= 1.5) return "bg-orange-100 text-orange-800 border-orange-200";
        return "bg-red-100 text-red-800 border-red-200";
      };

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{moodData.lastMoodEmoji}</span>
            <Badge variant="outline" className={getMoodColor(moodData.avgMood)}>
              {moodData.avgMood}/5
            </Badge>
          </div>
          <div className="text-xs text-gray-500">
            {moodData.totalLogs} registro{moodData.totalLogs !== 1 ? 's' : ''} (30d)
          </div>
        </div>
      );
    }
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