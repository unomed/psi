
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SectorData {
  id: string;
  name: string;
  description?: string;
  location?: string;
  riskLevel?: string;
  responsibleName?: string;
  companyId: string;
}

export const columns: ColumnDef<SectorData>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return description || <span className="text-muted-foreground">Sem descrição</span>;
    },
  },
  {
    accessorKey: "location",
    header: "Localização",
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      return location || <span className="text-muted-foreground">Não informado</span>;
    },
  },
  {
    accessorKey: "riskLevel",
    header: "Nível de Risco",
    cell: ({ row }) => {
      const riskLevel = row.getValue("riskLevel") as string;
      
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
      
      return <span className={getColorClass()}>{riskLevel || "Não avaliado"}</span>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row, table }) => {
      const sector = row.original;
      const meta = table.options.meta as {
        onEdit: (sector: SectorData) => void;
        onDelete: (sector: SectorData) => void;
        onView: (sector: SectorData) => void;
      };

      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta.onView(sector)}
            title="Visualizar"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta.onEdit(sector)}
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta.onDelete(sector)}
            title="Excluir"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
