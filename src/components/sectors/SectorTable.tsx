
import { DataTable } from "@/components/ui/data-table";
import { columns, type SectorData } from "./columns";

interface SectorTableProps {
  sectors: SectorData[];
  isLoading?: boolean;
  onEdit?: (sector: SectorData) => void;
  onDelete?: (sector: SectorData) => void;
  onView?: (sector: SectorData) => void;
}

export function SectorTable({ 
  sectors,
  isLoading,
  onEdit,
  onDelete,
  onView
}: SectorTableProps) {
  return (
    <DataTable 
      columns={columns}
      data={sectors}
      isLoading={isLoading}
      meta={{
        onEdit: onEdit || (() => {}),
        onDelete: onDelete || (() => {}),
        onView: onView || (() => {}),
      }}
    />
  );
}
