
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleData } from "./RoleCard";

const getRiskLevelDisplay = (level?: string) => {
  if (!level) return "Não definido";
  
  switch (level) {
    case "high":
      return "Alto";
    case "medium":
      return "Médio";
    case "low":
      return "Baixo";
    default:
      return level;
  }
};

export const columns: ColumnDef<RoleData>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.original.description;
      return description ? (
        <span className="line-clamp-2">{description}</span>
      ) : (
        <span className="text-muted-foreground">Sem descrição</span>
      );
    },
  },
  {
    accessorKey: "riskLevel",
    header: "Nível de Risco",
    cell: ({ row }) => {
      const riskLevel = row.original.riskLevel;
      const displayText = getRiskLevelDisplay(riskLevel);
      
      const getColorClass = () => {
        switch (riskLevel) {
          case "high":
            return "text-red-600";
          case "medium":
            return "text-yellow-600";
          case "low":
            return "text-green-600";
          default:
            return "text-gray-600";
        }
      };
      
      return <span className={getColorClass()}>{displayText}</span>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row, table }) => {
      const role = row.original;
      const meta = table.options.meta as {
        onEdit: (role: RoleData) => void;
        onDelete: (role: RoleData) => void;
        onView: (role: RoleData) => void;
        canEdit: boolean;
      };

      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta.onView(role)}
            title="Visualizar"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {meta.canEdit && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => meta.onEdit(role)}
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => meta.onDelete(role)}
                title="Excluir"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];
