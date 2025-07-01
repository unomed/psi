
import { FolderKanban, MapPin, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SectorData {
  id: string;
  name: string;
  description?: string;
  location?: string;
  riskLevel?: string;
  companyId: string;
}

interface SectorCardProps {
  sector: SectorData;
  className?: string;
  onClick?: () => void;
}

export function SectorCard({ sector, className, onClick }: SectorCardProps) {
  return (
    <Card 
      className={cn("cursor-pointer hover:shadow-md transition-shadow", className)} 
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5" />
          {sector.name}
        </CardTitle>
        {sector.description && (
          <CardDescription>{sector.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {sector.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{sector.location}</span>
          </div>
        )}
        
        {sector.riskLevel && (
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <span>Nível de risco: {sector.riskLevel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
