
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyData } from "./CompanyCard";

export const columns: ColumnDef<CompanyData>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "cnpj",
    header: "CNPJ",
  },
  {
    accessorKey: "address",
    header: "Endereço",
  },
  {
    accessorKey: "city",
    header: "Cidade",
  },
  {
    accessorKey: "state",
    header: "Estado",
  },
  {
    accessorKey: "industry",
    header: "Setor",
    cell: ({ row }) => {
      const industry = row.getValue("industry") as string;
      return industry || <span className="text-muted-foreground">Não informado</span>;
    },
  },
  {
    accessorKey: "contactName",
    header: "Contato",
  },
  {
    accessorKey: "contactEmail",
    header: "Email",
  },
  {
    accessorKey: "contactPhone",
    header: "Telefone",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row, table }) => {
      const company = row.original;
      const meta = table.options.meta as {
        onEdit: (company: CompanyData) => void;
        onDelete: (company: CompanyData) => void;
        onView: (company: CompanyData) => void;
      };

      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta.onView(company)}
            title="Visualizar"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta.onEdit(company)}
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta.onDelete(company)}
            title="Excluir"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
